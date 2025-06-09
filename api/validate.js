// taxa máxima: 1 requisição por IP a cada 5 segundos
const rateLimitMap = new Map();

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://zaorinu-utils.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();

  const lastRequest = rateLimitMap.get(ip) || 0;
  if (now - lastRequest < 5000) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  rateLimitMap.set(ip, now); // salva o novo timestamp

  const token = req.query.token;
  if (!token) return res.status(400).json({ valid: false });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, username: payload.username });
  } catch (e) {
    res.json({ valid: false });
  }
}
