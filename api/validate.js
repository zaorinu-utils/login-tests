import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://zaorinu-utils.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Client-IP');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(400).json({ valid: false, error: 'Authentication not provided' });
  }

  const clientIp = req.headers['x-client-ip'];
  if (!clientIp) {
    return res.status(400).json({ valid: false, error: 'Client IP not provided' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.ip !== clientIp) {
      return res.status(401).json({ valid: false, error: 'IP mismatch, token invalid' });
    }

    return res.status(200).json({ valid: true, username: payload.username });

  } catch (e) {
    return res.status(401).json({ valid: false, error: 'Invalid or expired authentication' });
  }
}
