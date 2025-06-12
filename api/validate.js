import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://zaorinu-utils.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Block non-post requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ valid: false, error: 'Token not provided' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ valid: true, username: payload.username });
  } catch (e) {
    return res.status(401).json({ valid: false, error: 'Invalid or expired token' });
  }
}
