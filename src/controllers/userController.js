const User = require('../models/userModel');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

// Validação de cadastro
const schema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).required(),
  senha: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/).required(),
  nome: Joi.string().required(),
  dataNascimento: Joi.string().required(),
  nomePai: Joi.string().required(),
  nomeMae: Joi.string().required()
});

exports.cadastro = async (req, res) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(400).json({ mensagem: 'Dados inválidos', detalhes: error.details });
      }
      return res.redirect('/cadastro?error=Dados inválidos');
    }

    const { email, username, senha, nome, dataNascimento, nomePai, nomeMae } = req.body;

    // Verificar se email já existe
    const emailExistente = await User.findOne({ email: email.toLowerCase() });
    if (emailExistente) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(409).json({ mensagem: 'Email já cadastrado.' });
      }
      return res.redirect('/cadastro?error=Email já cadastrado');
    }

    // Verificar se username já existe
    const usernameExistente = await User.findOne({ username });
    if (usernameExistente) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(409).json({ mensagem: 'Username já cadastrado.' });
      }
      return res.redirect('/cadastro?error=Username já cadastrado');
    }

    // Criar novo usuário
    const user = new User({
      email: email.toLowerCase(),
      username,
      senha,
      nome,
      dataNascimento: new Date(dataNascimento),
      nomePai,
      nomeMae
    });

    await user.save();

    // Simula envio de email de confirmação
    // (Na prática, um token de confirmação seria enviado por email)
    
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(201).json({ 
        mensagem: 'Usuário cadastrado com sucesso. Confirme seu email para ativar a conta.', 
        userId: user._id 
      });
    }

    res.redirect('/login?success=Usuário cadastrado com sucesso. Confirme seu email para ativar a conta');

  } catch (error) {
    console.error('Erro no cadastro:', error);
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
    res.redirect('/cadastro?error=Erro interno do servidor');
  }
};

exports.confirmarEmail = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ mensagem: 'userId é obrigatório.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    if (user.emailConfirmado) {
      return res.status(400).json({ mensagem: 'Email já confirmado.' });
    }

    user.emailConfirmado = true;
    await user.save();

    return res.json({ mensagem: 'Email confirmado com sucesso.' });

  } catch (error) {
    console.error('Erro ao confirmar email:', error);
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

const recuperarSenhaSchema = Joi.object({
  email: Joi.string().email().required(),
  dataNascimento: Joi.string().required(),
  nomePai: Joi.string().required(),
  nomeMae: Joi.string().required(),
  novaSenha: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/).required()
});

exports.recuperarSenha = async (req, res) => {
  try {
    const { error } = recuperarSenhaSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ mensagem: 'Dados inválidos', detalhes: error.details });
    }

    const { email, dataNascimento, nomePai, nomeMae, novaSenha } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    if (
      user.dataNascimento.toISOString().split('T')[0] !== dataNascimento ||
      user.nomePai !== nomePai ||
      user.nomeMae !== nomeMae
    ) {
      return res.status(401).json({ mensagem: 'Dados de recuperação não conferem.' });
    }

    const novaSenhaIgual = await user.compararSenha(novaSenha);
    if (novaSenhaIgual) {
      return res.status(400).json({ mensagem: 'A nova senha deve ser diferente da atual.' });
    }

    user.senha = novaSenha;
    await user.save();

    return res.json({ mensagem: 'Senha redefinida com sucesso.' });

  } catch (error) {
    console.error('Erro ao recuperar senha:', error);
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

exports.desbloquearUsuario = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ mensagem: 'userId é obrigatório.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    user.bloqueado = false;
    user.tentativasLogin = 0;
    await user.save();

    return res.json({ mensagem: 'Usuário desbloqueado com sucesso.' });

  } catch (error) {
    console.error('Erro ao desbloquear usuário:', error);
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
}; 