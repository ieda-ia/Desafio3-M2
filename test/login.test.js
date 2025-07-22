const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');

const BASE_URL = 'http://localhost:3004';

describe('Testes da API de Login', () => {
  describe('Login com sucesso', () => {
    let userId = '';
    let token = '';
    // Gerar email e username aleatórios
    const randomSuffix = Math.floor(Math.random() * 1000000);
    const email = `usuario${randomSuffix}@empresa.com`;
    const username = `usuario${randomSuffix}`;

    // Cadastrar usuário
    it('Deve retornar 200 ao fazer cadastro do usuário com sucesso', async () => {
      const resposta = await request(app)
        .post('/cadastro')
        .set('Content-Type', 'application/json')
        .send({
          email,
          username,
          senha: 'Senha123',
          nome: 'Usuário Teste',
          dataNascimento: '1990-01-01',
          nomePai: 'João Teste',
          nomeMae: 'Maria Teste'
        });
      userId = resposta.body.userId;
      expect(resposta.status).to.equal(201);
      expect(resposta.body.mensagem).to.equal('Usuário cadastrado com sucesso. Confirme seu email para ativar a conta.');
    });
    
    // Validar cadastro - confirmar e-mail com id
    it('Deve fazer cadastro do usuário', async () => {
      const resposta = await request(app)
        .post('/confirmar-email')
        .set('Content-Type', 'application/json')
        .send({ userId });
      expect(resposta.status).to.equal(200);
      expect(resposta.body.mensagem).to.equal('Email confirmado com sucesso.');
    });

    it('Deve retornar 401 ao fazer login com credenciais inválidas', async () => {
      const resposta = await request(app)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          login: email,
          senha: 'SenhaErrada'
        });
      expect(resposta.status).to.equal(401);
      expect(resposta.body.mensagem).to.include('Credenciais inválidas');
    });

    it('Deve fazer login com sucesso com credenciais válidas', async () => {
      const resposta = await request(app)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({
          login: email,
          senha: 'Senha123'
        });
      token = resposta.body.token;
      expect(resposta.status).to.equal(200);
      expect(token).to.be.a('string');
    });

    it('Deve fazer logout com sucesso', async () => {
      const resposta = await request(app)
        .post('/logout')
        .set('accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(resposta.status).to.equal(200);
      expect(resposta.body.mensagem).to.equal('Logout realizado com sucesso.');
    });

    it('Deve retornar 403 usuario bloqueado', async () => {
      let resposta = ''
      for (let i = 0; i <= 2; i++) {
        resposta = await request(app)
          .post('/login')
          .set('Content-Type', 'application/json')
          .send({
            login: email,
            senha: 'SenhaErrada'
          });
      }
      expect(resposta.status).to.equal(403);
      expect(resposta.body.mensagem).to.include('Usuário bloqueado');
    });

    it('Deve recuperar senha', async () => {
        const resposta = await request(app)
          .post('/recuperar-senha')
          .set('Content-Type', 'application/json')
          .send({ 
          'email': email,
          'novaSenha': 'SenhaNova123',
          'dataNascimento': '1990-01-01',
          'nomePai': 'João Teste',
          'nomeMae': 'Maria Teste'
         });

      expect(resposta.status).to.equal(200);
      expect(resposta.body.mensagem).to.equal('Senha redefinida com sucesso.');
    });

  });
});















