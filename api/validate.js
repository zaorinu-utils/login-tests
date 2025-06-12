import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://zaorinu-utils.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Expose-Headers', 'X-RateLimit-Remaining');

  // O cliente pode enviar o número de tentativas já feitas
  const tentativas = Number(req.headers['x-login-attempts'] || 0);
  const LIMITE = 5;
  const restantes = LIMITE - tentativas;
  res.setHeader('X-RateLimit-Remaining', Math.max(restantes, 0));

  if (tentativas >= LIMITE) {
    return res.status(429).json({ valid: false, error: 'Limite de tentativas atingido' });
  }

  const token = req.query.token;
  if (!token) return res.status(400).json({ valid: false });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, username: payload.username });
  } catch (e) {
    res.json({ valid: false });
  }
}
