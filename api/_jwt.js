import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'minha_chave_supersecreta';

export function gerarToken(username) {
  return jwt.sign({ username }, SECRET, { expiresIn: '1h' });
}

export function validarToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
