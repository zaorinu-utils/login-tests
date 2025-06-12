import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://zaorinu-utils.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  const payload = {
    createdAt: Date.now()
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '20s' });
  res.status(200).json({ state: token });
}