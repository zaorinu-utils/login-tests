import jwt from 'jsonwebtoken';
import { gerarToken } from './_jwt.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://zaorinu-utils.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const referer = req.headers.referer || '';
  const allowedPrefix = 'https://github.com/';
  
  if (!referer.startsWith(allowedPrefix)) {
    return res.status(403).json({ error: 'Invalid Referer' });
  }

  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    jwt.verify(state, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(403).json({ error: 'Your link expired! Try to login again.' });
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const { access_token } = await tokenRes.json();
    if (!access_token) {
      return res.status(401).json({ error: 'Invalid Authentication' });
    }

    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userData = await userRes.json();
    const username = userData.login;

    const jwtToken = gerarToken(username);

    res.writeHead(302, {
      Location: `https://zaorinu-utils.github.io/login-front/?token=${jwtToken}&state=${state}`,
    });
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
}
