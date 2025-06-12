import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export function gerarToken({ username, ip }) {
  return jwt.sign(
    { 
      username, 
      ip, 
      _token: 'AVISO: Não compartilhe este token com ninguém.' 
    },
    SECRET,
    { expiresIn: '1h' }
  );
}

export function validarToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
