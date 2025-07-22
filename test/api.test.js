const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');

describe('API - Testes Positivos, Negativos e Performance', function () {
  this.timeout(10000); // Para garantir tempo suficiente nos testes

  let userId;
  let token;
  const randomSuffix = Math.floor(Math.random() * 1000000);
  const email = `test${randomSuffix}@empresa.com`;
  const username = `testuser${randomSuffix}`;

  // POSITIVO: Cadastro de usuário
  it('Deve cadastrar usuário com sucesso', async () => {
    const res = await request(app)
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
    expect(res.status).to.equal(201);
    expect(res.body.mensagem).to.include('Usuário cadastrado com sucesso');
    userId = res.body.userId;
  });

  // NEGATIVO: Cadastro com e-mail já existente
  it('Não deve cadastrar usuário com e-mail já existente', async () => {
    const res = await request(app)
      .post('/cadastro')
      .send({
        email,
        username: username + '2',
        senha: 'Senha123',
        nome: 'Usuário Teste',
        dataNascimento: '1990-01-01',
        nomePai: 'João Teste',
        nomeMae: 'Maria Teste'
      });
    expect(res.status).to.not.equal(201);
    expect(res.body.mensagem).to.include('já cadastrado');
  });

  // POSITIVO: Confirmação de e-mail
  it('Deve confirmar e-mail com sucesso', async () => {
    const res = await request(app)
      .post('/confirmar-email')
      .send({ userId });
    expect(res.status).to.equal(200);
    expect(res.body.mensagem).to.include('Email confirmado com sucesso');
  });

  // NEGATIVO: Confirmação de e-mail com userId inválido
  it('Não deve confirmar e-mail com userId inválido', async () => {
    const res = await request(app)
      .post('/confirmar-email')
      .send({ userId: 'id-invalido' });
    expect(res.status).to.not.equal(200);
    expect(res.body.mensagem).to.include('Usuário não encontrado.');
  });

  // NEGATIVO: Login com senha errada
  it('Não deve logar com senha errada', async () => {
    const res = await request(app)
      .post('/login')
      .send({ login: email, senha: 'SenhaErrada' });
    expect(res.status).to.equal(401);
    expect(res.body.mensagem).to.include('Credenciais inválidas');
  });

  // POSITIVO: Login com sucesso
  it('Deve logar com sucesso', async () => {
    const res = await request(app)
      .post('/login')
      .send({ login: email, senha: 'Senha123' });
    expect(res.status).to.equal(200);
    expect(res.body.token).to.be.a('string');
    token = res.body.token;
  });

  // NEGATIVO: Acessar rota protegida sem token
  it('Não deve acessar histórico de login sem token', async () => {
    const res = await request(app)
      .get('/historico-login');
    expect(res.status).to.equal(401);
  });

  // POSITIVO: Acessar histórico de login com token
  it('Deve acessar histórico de login com token', async () => {
    const res = await request(app)
      .get('/historico-login')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body.historico).to.be.an('array');
  });

  // NEGATIVO: Recuperar senha com dados errados
  it('Não deve recuperar senha com dados errados', async () => {
    const res = await request(app)
      .post('/recuperar-senha')
      .send({
        email,
        novaSenha: 'NovaSenha123',
        dataNascimento: '2000-01-01', // data errada
        nomePai: 'Outro Pai',
        nomeMae: 'Outra Mãe'
      });
    expect(res.status).to.not.equal(200);
  });

  // POSITIVO: Logout com sucesso
  it('Deve fazer logout com sucesso', async () => {
    const res = await request(app)
      .post('/logout')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body.mensagem).to.include('Logout realizado com sucesso');
  });

  // TESTE DE PERFORMANCE: Login deve responder em menos de 500ms
  it('Login deve responder em menos de 500ms', async () => {
    const start = Date.now();
    const res = await request(app)
      .post('/login')
      .send({ login: email, senha: 'Senha123' });
    const duration = Date.now() - start;
    expect(res.status).to.be.oneOf([200, 401]); // pode ser bloqueado após muitos testes
    expect(duration).to.be.below(500);
  });
}); 