import { validarToken } from './_jwt.js';

export default function handler(req, res) {
  const token = req.query.token;
  if (!token) return res.status(400).json({ valid: false });

  const dados = validarToken(token);
  if (dados) {
    res.json({ valid: true, username: dados.username });
  } else {
    res.json({ valid: false });
  }
}
