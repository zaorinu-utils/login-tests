import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const payload = {
    createdAt: Date.now()
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '20s' });
  res.status(200).json({ state: token });
}