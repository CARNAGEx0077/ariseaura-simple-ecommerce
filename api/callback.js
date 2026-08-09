export default async function handler(req, res) {
  const { code } = req.query;
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).send('OAuth credentials not configured in Vercel environment variables.');
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
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
    
    const data = await response.json();
    
    if (data.error) {
      return res.status(400).send(`OAuth Error: ${data.error_description}`);
    }
    
    const token = data.access_token;

    if (!token) {
      return res.status(500).send('GitHub did not return an access token. Check your OAuth app credentials.');
    }

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
