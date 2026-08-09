export default function handler(req, res) {
  const clientId = process.env.OAUTH_CLIENT_ID;
  const scope = 'repo,user';

  if (!clientId) {
    return res.status(500).send('OAuth Client ID not configured. Please set OAUTH_CLIENT_ID in Vercel Environment Variables.');
  }

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}`;
  res.redirect(authUrl);
}
