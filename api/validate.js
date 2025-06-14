import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://zaorinu-utils.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const allowedReferer = "https://github.com/login/oauth/select_account?client_id=Ov23liDydrs0YSmOnO9m&redirect_uri=https%3A%2F%2Flogin-tests-six.vercel.app%2Fapi%2Fcallback";

  if (req.method === 'GET') {
    const referer = req.headers.referer || '';

    if (!referer.startsWith(allowedReferer)) {
      return res.status(204).end();  // Bloqueia se o Referer for outro
    }

    // Se o referer for válido, segue o código desejado:
    return res.status(200).json({ status: "OK" });
  }

  return res.status(405).end(); // Método não permitido

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

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ valid: true, username: payload.username });
  } catch (e) {
    return res.status(401).json({ valid: false, error: 'Invalid or expired authentication' });
  }
}
