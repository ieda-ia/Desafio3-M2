const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const dayjs = require('dayjs');

// Estrutura de armazenamento em memória
const users = [];

// Usuário fixo para testes
const usuarioFixo = {
  id: uuidv4(),
  email: 'usuario@empresa.com',
  username: 'usuario1',
  senha: bcrypt.hashSync('Senha123', 10),
  nome: 'Usuário Teste',
  dataNascimento: '1990-01-01',
  nomePai: 'João Teste',
  nomeMae: 'Maria Teste',
  emailConfirmado: true, // já confirmado
  tentativasInvalidas: 0,
  bloqueadoAte: null,
  historicoLogin: [],
  dispositivos: [],
  sessoes: [],
  primeiroLogin: true
};
users.push(usuarioFixo);

// Função para criar novo usuário
function createUser({ email, username, senha, nome, dataNascimento, nomePai, nomeMae }) {
  const hash = bcrypt.hashSync(senha, 10);
  const user = {
    id: uuidv4(),
    email,
    username,
    senha: hash,
    nome,
    dataNascimento,
    nomePai,
    nomeMae,
    emailConfirmado: false,
    tentativasInvalidas: 0,
    bloqueadoAte: null,
    historicoLogin: [],
    dispositivos: [],
    sessoes: [],
    primeiroLogin: true
  };
  users.push(user);
  return user;
}

function findUserByEmail(email) {
  return users.find(u => u.email === email);
}

function findUserByUsername(username) {
  return users.find(u => u.username === username);
}

function findUserById(id) {
  return users.find(u => u.id === id);
}

function updateUser(id, data) {
  const user = findUserById(id);
  if (user) Object.assign(user, data);
  return user;
}

function resetUsers() {
  users.length = 0;
}

module.exports = {
  users,
  createUser,
  findUserByEmail,
  findUserByUsername,
  findUserById,
  updateUser,
  resetUsers
}; 