const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dayjs = require('dayjs');
const { users, findUserByEmail, findUserByUsername, updateUser, findUserById } = require('../models/userModel');
const { addToken, isBlacklisted } = require('../models/tokenBlacklist');
const Joi = require('joi');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo';
const JWT_EXPIRATION = '10m';
const MAX_ATTEMPTS = 3;
const BLOCK_TIME_MINUTES = 5;
const MAX_SESSIONS = 3;

function getUserByLogin(login) {
  return login.includes('@') ? findUserByEmail(login) : findUserByUsername(login);
}

const senhaSchema = Joi.object({
  senhaAtual: Joi.string().required(),
  novaSenha: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/).required()
});

exports.login = (req, res) => {
  const { login, senha, dispositivo } = req.body;
  if (!login || !senha) {
    return res.status(400).json({ mensagem: 'Login e senha são obrigatórios.' });
  }
  const user = getUserByLogin(login);
  if (!user) {
    return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
  }
  // Bloqueio
  if (user.bloqueadoAte && dayjs().isBefore(user.bloqueadoAte)) {
    const minutos = dayjs(user.bloqueadoAte).diff(dayjs(), 'minute') + 1;
    return res.status(403).json({ mensagem: `Usuário bloqueado. Tente novamente em ${minutos} minutos.` });
  }
  // Senha
  if (!bcrypt.compareSync(senha, user.senha)) {
    user.tentativasInvalidas++;
    if (user.tentativasInvalidas >= MAX_ATTEMPTS) {
      user.bloqueadoAte = dayjs().add(BLOCK_TIME_MINUTES, 'minute').toISOString();
      user.tentativasInvalidas = 0;
      return res.status(403).json({ mensagem: `Usuário bloqueado por ${BLOCK_TIME_MINUTES} minutos.` });
    }
    return res.status(401).json({ mensagem: `Credenciais inválidas. Tentativas restantes: ${MAX_ATTEMPTS - user.tentativasInvalidas}` });
  }
  // Reset tentativas
  user.tentativasInvalidas = 0;
  user.bloqueadoAte = null;
  // Sessões
  if (user.sessoes.length >= MAX_SESSIONS) {
    return res.status(403).json({ mensagem: 'Limite de sessões simultâneas atingido.' });
  }
  // Novo dispositivo
  let novoDispositivo = false;
  if (dispositivo && !user.dispositivos.includes(dispositivo)) {
    user.dispositivos.push(dispositivo);
    novoDispositivo = true;
  }
  // Token
  const payload = { id: user.id, email: user.email };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  const exp = dayjs().add(10, 'minute').unix();
  user.sessoes.push({ token, exp, criadoEm: new Date().toISOString(), dispositivo });
  // Histórico
  user.historicoLogin.push({ data: new Date().toISOString(), dispositivo });
  // Primeiro login
  let mensagem = user.primeiroLogin ? 'Bem-vindo ao seu primeiro login!' : 'Login realizado com sucesso!';
  user.primeiroLogin = false;
  res.json({ token, mensagem, novoDispositivo });
};

exports.logout = (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ mensagem: 'Token não fornecido.' });
  }
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // Blacklist
    const exp = payload.exp;
    addToken(token, exp);
    // Remove sessão do usuário
    const user = findUserById(payload.id);
    if (user) {
      user.sessoes = user.sessoes.filter(sessao => sessao.token !== token);
    }
    return res.json({ mensagem: 'Logout realizado com sucesso.' });
  } catch (err) {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
  }
};

exports.trocarSenha = (req, res) => {
  const { error } = senhaSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ mensagem: 'Dados inválidos', detalhes: error.details });
  }
  const { senhaAtual, novaSenha } = req.body;
  const user = req.user;
  if (!bcrypt.compareSync(senhaAtual, user.senha)) {
    return res.status(401).json({ mensagem: 'Senha atual incorreta.' });
  }
  if (bcrypt.compareSync(novaSenha, user.senha)) {
    return res.status(400).json({ mensagem: 'A nova senha deve ser diferente da atual.' });
  }
  user.senha = bcrypt.hashSync(novaSenha, 10);
  return res.json({ mensagem: 'Senha alterada com sucesso.' });
}; 