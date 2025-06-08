import { v4 as uuidv4 } from 'uuid';

const sessions = new Map();

export default async function handler(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).send('Missing code');

  try {
    // Trocar code por access_token
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

    // Pegar info do user
    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const userData = await userRes.json();
    const username = userData.login;

    // Criar token de sessão
    const sessionToken = uuidv4();
    const expires = Date.now() + 1000 * 60 * 60; // 1h

    // Salvar sessão (em memória, só para teste)
    sessions.set(sessionToken, { username, expires });

    // Redirecionar para frontend com token na query
    res.writeHead(302, {
      Location: `https://zaorinu-utils.github.io/login-front/?token=${sessionToken}`,
    });
    res.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno' });
  }
}

// Exportar sessions para validate.js (simplificação)
export { sessions };
