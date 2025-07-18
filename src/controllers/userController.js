const { createUser, findUserByEmail, findUserByUsername } = require('../models/userModel');
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

exports.cadastro = (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ mensagem: 'Dados inválidos', detalhes: error.details });
  }
  const { email, username, senha, nome, dataNascimento, nomePai, nomeMae } = req.body;
  if (findUserByEmail(email)) {
    return res.status(409).json({ mensagem: 'Email já cadastrado.' });
  }
  if (findUserByUsername(username)) {
    return res.status(409).json({ mensagem: 'Username já cadastrado.' });
  }
  const user = createUser({ email, username, senha, nome, dataNascimento, nomePai, nomeMae });
  // Simula envio de email de confirmação
  // (Na prática, um token de confirmação seria enviado por email)
  return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso. Confirme seu email para ativar a conta.', userId: user.id });
};

exports.confirmarEmail = (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ mensagem: 'userId é obrigatório.' });
  }
  const user = require('../models/userModel').findUserById(userId);
  if (!user) {
    return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
  }
  if (user.emailConfirmado) {
    return res.status(400).json({ mensagem: 'Email já confirmado.' });
  }
  user.emailConfirmado = true;
  return res.json({ mensagem: 'Email confirmado com sucesso.' });
};

const recuperarSenhaSchema = Joi.object({
  email: Joi.string().email().required(),
  dataNascimento: Joi.string().required(),
  nomePai: Joi.string().required(),
  nomeMae: Joi.string().required(),
  novaSenha: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/).required()
});

exports.recuperarSenha = (req, res) => {
  const { error } = recuperarSenhaSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ mensagem: 'Dados inválidos', detalhes: error.details });
  }
  const { email, dataNascimento, nomePai, nomeMae, novaSenha } = req.body;
  const user = findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
  }
  if (
    user.dataNascimento !== dataNascimento ||
    user.nomePai !== nomePai ||
    user.nomeMae !== nomeMae
  ) {
    return res.status(401).json({ mensagem: 'Dados de recuperação não conferem.' });
  }
  if (bcrypt.compareSync(novaSenha, user.senha)) {
    return res.status(400).json({ mensagem: 'A nova senha deve ser diferente da atual.' });
  }
  user.senha = bcrypt.hashSync(novaSenha, 10);
  return res.json({ mensagem: 'Senha redefinida com sucesso.' });
};

exports.desbloquearUsuario = (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ mensagem: 'userId é obrigatório.' });
  }
  const user = require('../models/userModel').findUserById(userId);
  if (!user) {
    return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
  }
  user.bloqueadoAte = null;
  user.tentativasInvalidas = 0;
  return res.json({ mensagem: 'Usuário desbloqueado com sucesso.' });
}; 