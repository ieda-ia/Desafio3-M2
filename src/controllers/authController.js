const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dayjs = require('dayjs');
const User = require('../models/userModel');
const TokenBlacklist = require('../models/tokenBlacklist');
const Joi = require('joi');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo';
const JWT_EXPIRATION = '10m';
const MAX_ATTEMPTS = 5;
const BLOCK_TIME_MINUTES = 15;

const senhaSchema = Joi.object({
  senhaAtual: Joi.string().required(),
  novaSenha: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/).required()
});

async function getUserByLogin(login) {
  const user = await User.findOne({
    $or: [
      { email: login.toLowerCase() },
      { username: login }
    ]
  });
  return user;
}

exports.login = async (req, res) => {
  try {
    const { login, senha, dispositivo } = req.body;
    
    if (!login || !senha) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(400).json({ mensagem: 'Login e senha são obrigatórios.' });
      }
      return res.redirect('/login?error=Login e senha são obrigatórios');
    }

    const user = await getUserByLogin(login);
    if (!user) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
      }
      return res.redirect('/login?error=Credenciais inválidas');
    }

    // Verificar se usuário está bloqueado
    if (user.bloqueado) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(403).json({ mensagem: 'Usuário bloqueado. Entre em contato com o suporte.' });
      }
      return res.redirect('/login?error=Usuário bloqueado. Entre em contato com o suporte');
    }

    // Verificar senha
    const senhaValida = await user.compararSenha(senha);
    if (!senhaValida) {
      await user.adicionarLogin(dispositivo || 'Desconhecido', req.ip, false);
      
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(401).json({ 
          mensagem: `Credenciais inválidas. Tentativas restantes: ${MAX_ATTEMPTS - user.tentativasLogin}` 
        });
      }
      return res.redirect('/login?error=Credenciais inválidas');
    }

    // Login bem-sucedido
    await user.adicionarLogin(dispositivo || 'Desconhecido', req.ip, true);

    // Criar token JWT
    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

    // Para requisições AJAX/API
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({ 
        token, 
        mensagem: 'Login realizado com sucesso!',
        user: {
          id: user._id,
          email: user.email,
          nome: user.nome,
          username: user.username
        }
      });
    }

    // Para requisições de página web
    req.session.user = {
      id: user._id,
      email: user.email,
      nome: user.nome,
      username: user.username
    };
    req.session.token = token;

    res.redirect('/dashboard?success=Login realizado com sucesso');

  } catch (error) {
    console.error('Erro no login:', error);
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
    res.redirect('/login?error=Erro interno do servidor');
  }
};

exports.logout = async (req, res) => {
  try {
    const auth = req.headers.authorization;
    const token = auth ? auth.split(' ')[1] : req.session.token;

    if (token) {
      try {
        const payload = jwt.verify(token, JWT_SECRET);
        // Adicionar à blacklist
        await TokenBlacklist.create({ token });
        
        // Remover sessão do usuário se necessário
        const user = await User.findById(payload.id);
        if (user) {
          // Limpar sessões antigas
          user.historicoLogin = user.historicoLogin.filter(login => 
            dayjs(login.data).isAfter(dayjs().subtract(30, 'days'))
          );
          await user.save();
        }
      } catch (err) {
        // Token inválido, mas ainda assim fazer logout
      }
    }

    // Destruir sessão
    req.session.destroy();

    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({ mensagem: 'Logout realizado com sucesso.' });
    }

    res.redirect('/login?success=Logout realizado com sucesso');

  } catch (error) {
    console.error('Erro no logout:', error);
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
    res.redirect('/login?error=Erro interno do servidor');
  }
};

exports.trocarSenha = async (req, res) => {
  try {
    const { error } = senhaSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ mensagem: 'Dados inválidos', detalhes: error.details });
    }

    const { senhaAtual, novaSenha } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    const senhaAtualValida = await user.compararSenha(senhaAtual);
    if (!senhaAtualValida) {
      return res.status(401).json({ mensagem: 'Senha atual incorreta.' });
    }

    const novaSenhaIgual = await user.compararSenha(novaSenha);
    if (novaSenhaIgual) {
      return res.status(400).json({ mensagem: 'A nova senha deve ser diferente da atual.' });
    }

    user.senha = novaSenha;
    await user.save();

    return res.json({ mensagem: 'Senha alterada com sucesso.' });

  } catch (error) {
    console.error('Erro ao trocar senha:', error);
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
}; 