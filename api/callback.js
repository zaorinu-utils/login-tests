export default async function handler(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: 'Sem código OAuth' });

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
    const { login } = await userRes.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ status: 'success', username: login });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar login' });
  }
}
