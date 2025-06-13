import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://zaorinu-utils.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Bloquear método GET (acesso direto via navegador)
  if (req.method === 'GET') {
    return res.status(403).json({ error: 'Acesso direto não permitido' });
  }

  // Bloquear se o Referer não for do domínio esperado (opcional)
  const referer = req.headers.referer || '';
  if (!referer.startsWith('https://zaorinu-utils.github.io')) {
    return res.status(403).json({ error: 'Referer inválido' });
  }

  if (req.method === 'OPTIONS') {
    // Responder pré-vôo CORS
    return res.status(204).end();
  }

  if (req.method === 'POST') {
    const payload = { createdAt: Date.now() };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30s' });
    return res.status(200).json({ state: token });
  }

  // Método não permitido
  res.status(405).json({ error: 'Método não permitido' });
}
