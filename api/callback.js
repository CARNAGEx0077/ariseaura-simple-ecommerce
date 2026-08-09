export default async function handler(req, res) {
  const { code, state } = req.query;
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;
  const allowedIdsRaw = process.env.ALLOWED_GITHUB_IDS;

  // ─── STEP 1: Validate OAuth state (CSRF protection) ───────────────────────
  // The state was set as an httpOnly cookie in /api/auth and included in the
  // GitHub authorization URL. GitHub echoes it back here. We compare the two.
  const cookieHeader = req.headers.cookie || '';
  const stateCookieMatch = cookieHeader.match(/(?:^|;\s*)oauth_state=([^;]+)/);
  const storedState = stateCookieMatch ? stateCookieMatch[1] : null;

  if (!state || !storedState || state !== storedState) {
    return res.status(403).send(
      'Access denied: Invalid OAuth state. This may indicate a CSRF attack. Please return to the CMS and try again.'
    );
  }

  // ─── STEP 2: Guard required credentials ────────────────────────────────────
  if (!clientId || !clientSecret) {
    return res.status(500).send('OAuth credentials not configured in Vercel environment variables.');
  }

  // ─── STEP 3: Guard allowlist presence BEFORE touching GitHub ───────────────
  // Fail closed: if no allowlist is configured, nobody gets in.
  if (!allowedIdsRaw || allowedIdsRaw.trim() === '') {
    return res.status(403).send(
      'Access denied: No authorized users configured. Set ALLOWED_GITHUB_IDS in Vercel Environment Variables.'
    );
  }

  // Parse allowlist: split by comma, trim whitespace, keep only pure numeric IDs.
  const allowedIds = allowedIdsRaw
    .split(',')
    .map(id => id.trim())
    .filter(id => /^\d+$/.test(id));

  if (allowedIds.length === 0) {
    return res.status(403).send(
      'Access denied: ALLOWED_GITHUB_IDS is malformed. Provide comma-separated numeric GitHub user IDs.'
    );
  }

  try {
    // ─── STEP 4: Exchange code for access token (server-side only) ───────────
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code
      })
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).send(`OAuth Error: ${tokenData.error_description}`);
    }

    const token = tokenData.access_token;

    if (!token) {
      return res.status(500).send('GitHub did not return an access token. Check your OAuth app credentials.');
    }

    // ─── STEP 5: Identify the GitHub user with the fresh token ───────────────
    // This call happens server-side. The client cannot influence its result.
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    if (!userResponse.ok) {
      return res.status(503).send(
        'Access denied: Failed to retrieve GitHub user identity. Please try again.'
      );
    }

    const user = await userResponse.json();
    const userId = user.id;

    if (!userId || typeof userId !== 'number') {
      return res.status(500).send(
        'Access denied: GitHub returned an invalid or missing user identity.'
      );
    }

    // ─── STEP 6: Allowlist check — BEFORE the token reaches the browser ──────
    if (!allowedIds.includes(String(userId))) {
      // Log the denial server-side (visible in Vercel function logs).
      console.warn(`CMS access denied for GitHub user ID: ${userId} (login: ${user.login})`);
      return res.status(403).send(
        `Access denied: GitHub account "${user.login}" (ID: ${userId}) is not authorized to access this CMS.`
      );
    }

    // ─── STEP 7: Authorized — deliver token via Decap CMS postMessage ─────────
    const script = `
      <script>
        const receiveMessage = (message) => {
          window.opener.postMessage(
            'authorization:github:success:{"token":"${token}","provider":"github"}',
            message.origin
          );
          window.removeEventListener("message", receiveMessage, false);
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      </script>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(script);

  } catch (error) {
    console.error('Error in OAuth callback:', error);
    res.status(500).send('Authentication Error');
  }
}
