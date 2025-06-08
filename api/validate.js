import { sessions } from './callback.js';

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://zaorinu-utils.github.io'); // ajuste seu domínio aqui
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const token = req.query.token;
  if (!token) return res.status(400).json({ valid: false });

  const session = sessions.get(token);
  if (session && session.expires > Date.now()) {
    res.json({ valid: true, username: session.username });
  } else {
    res.json({ valid: false });
  }
}
