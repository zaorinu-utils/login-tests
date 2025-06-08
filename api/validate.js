import { sessions } from './callback.js';

export default function handler(req, res) {
  const token = req.query.token;
  if (!token) return res.status(400).json({ valid: false });

  const session = sessions.get(token);
  if (session && session.expires > Date.now()) {
    res.json({ valid: true, username: session.username });
  } else {
    res.json({ valid: false });
  }
}
