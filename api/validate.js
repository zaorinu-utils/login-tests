import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://zaorinu-utils.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  const token = req.query.token;
  if (!token) return res.status(400).json({ valid: false });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Webhook do Discord via env
    const webhookURL = process.env.WEBHOOK_URL;

    if (webhookURL) {
      await fetch(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `🔐 **Login detectado!**\n👤 Usuário: \`${payload.username}\`\n🕒 Hora: <t:${Math.floor(Date.now() / 1000)}:R>`
        })
      });
    }

    res.json({ valid: true, username: payload.username });

  } catch (e) {
    res.json({ valid: false });
  }
}
