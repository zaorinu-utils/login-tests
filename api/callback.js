import { gerarToken } from './_jwt.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://zaorinu-utils.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  const code = req.query.code;
  if (!code) return res.status(204).end();

  try {
    // 1. Troca o code pelo access token do GitHub
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
    if (!access_token) return res.status(401).json({ error: 'Invalid Authentication' });

    // 2. Busca dados do usuário no GitHub
    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userData = await userRes.json();
    const username = userData.login;

    // 3. Busca IP público do usuário
    const ipRes = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipRes.json();
    const userIp = ipData.ip;

    // 4. Gera token incluindo username e IP
    const jwt = gerarToken({ username, ip: userIp });

    // 5. Redireciona para frontend com token no query param
    res.writeHead(302, {
      Location: `https://zaorinu-utils.github.io/login-front/?token=${jwt}`,
    });
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
}
