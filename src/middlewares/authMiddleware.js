const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/tokenBlacklist');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo';

module.exports = async (req, res, next) => {
  try {
    // Verificar se há sessão ativa (para páginas web)
    if (req.session && req.session.user) {
      req.user = req.session.user;
      return next();
    }

    // Verificar token JWT (para API)
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(401).json({ mensagem: 'Token não fornecido.' });
      }
      return res.redirect('/login?error=Sessão expirada. Faça login novamente');
    }

    const token = auth.split(' ')[1];
    
    // Verificar se token está na blacklist
    const blacklistedToken = await TokenBlacklist.findOne({ token });
    if (blacklistedToken) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(401).json({ mensagem: 'Token inválido (logout realizado).' });
      }
      return res.redirect('/login?error=Sessão inválida. Faça login novamente');
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(payload.id);
      
      if (!user) {
        if (req.xhr || req.headers.accept?.includes('application/json')) {
          return res.status(401).json({ mensagem: 'Usuário não encontrado.' });
        }
        return res.redirect('/login?error=Usuário não encontrado');
      }

      if (user.bloqueado) {
        if (req.xhr || req.headers.accept?.includes('application/json')) {
          return res.status(403).json({ mensagem: 'Usuário bloqueado.' });
        }
        return res.redirect('/login?error=Usuário bloqueado. Entre em contato com o suporte');
      }

      req.user = {
        id: user._id,
        email: user.email,
        nome: user.nome,
        username: user.username
      };
      req.token = token;
      next();

    } catch (err) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
      }
      return res.redirect('/login?error=Token inválido ou expirado');
    }

  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
    return res.redirect('/login?error=Erro interno do servidor');
  }
}; 