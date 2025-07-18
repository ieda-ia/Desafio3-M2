const jwt = require('jsonwebtoken');
const { isBlacklisted } = require('../models/tokenBlacklist');
const { findUserById } = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo';

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ mensagem: 'Token não fornecido.' });
  }
  const token = auth.split(' ')[1];
  if (isBlacklisted(token)) {
    return res.status(401).json({ mensagem: 'Token inválido (logout realizado).' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = findUserById(payload.id);
    if (!user) {
      return res.status(401).json({ mensagem: 'Usuário não encontrado.' });
    }
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
  }
}; 