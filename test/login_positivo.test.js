const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app.js');
const { gerarCredenciaisAleatorias,
  cadastrarUsuario,
  confirmarEmail,
  fazerLogin,
  fazerLogout,
  recuperarSenha,
  historicoLogin } = require('../helpers/cadastro_usuario');
describe('Testes POSITIVOS da API de Login e PERFORMANCE', () => {
    let userId = '';
    let token = '';
    let email = '';

    describe('POST /cadastro', () => {
      it('Deve cadastrar usuário com sucesso', async () => {
        const credenciais = gerarCredenciaisAleatorias();
        const res = await cadastrarUsuario(credenciais);
        expect(res.status).to.equal(201);
        expect(res.body.mensagem).to.include('Usuário cadastrado com sucesso');
        userId = res.body.userId;
        email = credenciais.email;
      });
    });

  describe('POST /confirmar-email', () => {
    it('Deve confirmar e-mail com sucesso', async () => {
      const res = await confirmarEmail(userId)
      expect(res.status).to.equal(200);
      expect(res.body.mensagem).to.include('Email confirmado com sucesso');
    });
  });

  describe('POST /login', () => {
    it('Deve logar com sucesso', async () => {
      const res = await fazerLogin(email, 'Senha123')
      expect(res.status).to.equal(200);
      expect(res.body.token).to.be.a('string');
      token = res.body.token;
    });
  });
  describe('GET /historico-login', () => {

    it('Deve acessar histórico de login com token', async () => {
      const res = await historicoLogin(token)
      expect(res.status).to.equal(200);
      expect(res.body.historico).to.be.an('array');
    });
  });

  describe('POST /logout', () => {
    it('Deve fazer logout com sucesso', async () => {
      const res = await fazerLogout(token)
      expect(res.status).to.equal(200);
      expect(res.body.mensagem).to.include('Logout realizado com sucesso');
    });
  });

  describe('POST /recuperar-senha', () => {
    it('Deve recuperar senha com sucesso', async () => {
      const res = await recuperarSenha(email, 'SenhaNova123', '1990-01-01', 'João Teste', 'Maria Teste')
      expect(res.status).to.equal(200);
      expect(res.body.mensagem).to.equal('Senha redefinida com sucesso.');
    });
  });

  describe('Performance', () => {

    it('Login deve responder em menos de 500ms', async () => {
      const start = Date.now();
      const res = await fazerLogin(email, 'Senha123');
      const duration = Date.now() - start;
      expect([200, 401, 403]).to.include(res.status);
      expect(duration).to.be.below(500);
    });
  });
});
