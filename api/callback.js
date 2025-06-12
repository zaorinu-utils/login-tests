import { gerarToken } from './_jwt.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://zaorinu-utils.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-login-attempts');
  res.setHeader('Access-Control-Expose-Headers', 'X-RateLimit-Remaining');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // O cliente pode enviar o número de tentativas já feitas
  const tentativas = Number(req.headers['x-login-attempts'] || 0);
  const LIMITE = 5;

  // Calcula tentativas restantes
  const restantes = LIMITE - tentativas;
  res.setHeader('X-RateLimit-Remaining', Math.max(restantes, 0));

  if (tentativas >= LIMITE) {
    return res.status(429).json({ error: 'Limite de tentativas atingido' });
  }

  const code = req.query.code;
  if (!code) return res.status(400).send('Código ausente');

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
    if (!access_token) return res.status(401).json({ error: 'Token inválido' });

    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userData = await userRes.json();
    const username = userData.login;

    const jwt = gerarToken(username);

    res.writeHead(302, {
      Location: `https://zaorinu-utils.github.io/login-front/?token=${jwt}`,
      'X-RateLimit-Remaining': Math.max(restantes, 0),
    });
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
}
