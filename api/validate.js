import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://zaorinu-utils.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  const token = req.query.token;
  if (!token) return res.status(400).json({ valid: false });

  try {
    const payload = jwt.verify(token, SECRET);

    // Ratelimit: mínimo 3s entre requisições (timestamp embutido no token)
    const agora = Date.now();
    if (payload.lastRequest && agora - payload.lastRequest < 3000) {
      return res.status(429).json({ valid: false, error: 'Espere um pouco antes de tentar de novo' });
    }

    // Gera novo token com lastRequest atualizado
    const novoToken = jwt.sign({
      username: payload.username,
      lastRequest: agora
    }, SECRET, { expiresIn: '1h' });

    return res.json({ valid: true, username: payload.username, token: novoToken });

  } catch (e) {
    return res.status(401).json({ valid: false, error: 'Token inválido' });
  }
}
