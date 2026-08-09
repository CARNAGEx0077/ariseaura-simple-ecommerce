import { randomBytes } from 'crypto';

export default function handler(req, res) {
  const clientId = process.env.OAUTH_CLIENT_ID;
  const scope = 'public_repo';

  if (!clientId) {
    return res.status(500).send('OAuth Client ID not configured. Please set OAUTH_CLIENT_ID in Vercel Environment Variables.');
  }

  // Generate a cryptographically secure random state value for CSRF protection.
  // Stored in an httpOnly cookie so /api/callback can verify it without a database.
  const state = randomBytes(16).toString('hex');

  res.setHeader(
    'Set-Cookie',
    `oauth_state=${state}; HttpOnly; SameSite=Lax; Path=/; Max-Age=600`
  );

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}&state=${state}`;
  res.redirect(authUrl);
}
