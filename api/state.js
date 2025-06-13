import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://zaorinu-utils.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const referer = req.headers.referer || '';
  if (!referer.startsWith('https://zaorinu-utils.github.io')) {
    return res.status(403).json({ error: 'Referer inválido' });
  }

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET' || req.method === 'POST') {
    const payload = { createdAt: Date.now() };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30s' });
    return res.status(200).json({ state: token });
  }

  res.status(405).json({ error: 'Método não permitido' });
}
