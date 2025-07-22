const request = require('supertest');
const { expect } = require('chai');

const BASE_URL = 'http://localhost:3004';

let userId = '';
let token = '';
const randomSuffix = Math.floor(Math.random() * 1000000);
const email = `usuario${randomSuffix}@empresa.com`;
const username = `usuario${randomSuffix}`;

const login = async (login, senha) => {
  return await request(BASE_URL)
    .post('/login')
    .set('Content-Type', 'application/json')
    .send({ login, senha });
};

describe('API de Login', () => {

  before(async () => {
    const res = await request(BASE_URL)
      .post('/cadastro')
      .send({
        email,
        username,
        senha: 'Senha123',
        nome: 'Usuário Teste',
        dataNascimento: '1990-01-01',
        nomePai: 'João Teste',
        nomeMae: 'Maria Teste'
      });
    userId = res.body.userId;

    await request(BASE_URL)
      .post('/confirmar-email')
      .send({ userId });
  });

  it('Deve negar login com senha inválida', async () => {
    const res = await login(email, 'SenhaErrada');
    expect(res.status).to.equal(401);
    expect(res.body.mensagem).to.include('Credenciais inválidas');
  });

  it('Deve permitir login com credenciais válidas', async () => {
    const res = await login(email, 'Senha123');
    token = res.body.token;
    expect(res.status).to.equal(200);
    expect(token).to.be.a('string');
  });

  it('Deve permitir logout com token válido', async () => {
    const res = await request(BASE_URL)
      .post('/logout')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body.mensagem).to.equal('Logout realizado com sucesso.');
  });

  it('Deve bloquear usuário após 3 logins errados', async () => {
    let resposta;
    for (let i = 0; i < 3; i++) {
      resposta = await login(email, 'SenhaErrada');
    }
    expect(resposta.status).to.equal(403);
    expect(resposta.body.mensagem).to.include('Usuário bloqueado');
  });

  it('Deve recuperar a senha com sucesso', async () => {
    const res = await request(BASE_URL)
      .post('/recuperar-senha')
      .send({
        email,
        novaSenha: 'SenhaNova123',
        dataNascimento: '1990-01-01',
        nomePai: 'João Teste',
        nomeMae: 'Maria Teste'
      });
    expect(res.status).to.equal(200);
    expect(res.body.mensagem).to.equal('Senha redefinida com sucesso.');
  });

});
