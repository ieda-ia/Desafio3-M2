const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app.js');
const {
  gerarCredenciaisAleatorias,
  cadastrarUsuario,
  confirmarEmail,
  fazerLogin,
  recuperarSenha,
  historicoLogin
} = require('../helpers/cadastro_usuario.js');

describe('Testes NEGATIVOS da API de Login', function () {
  this.timeout(10000);

  const credenciais = gerarCredenciaisAleatorias();
  let email = credenciais.email;
  let username = credenciais.username;

  before(async () => {
    const res = await cadastrarUsuario(credenciais);
    expect(res.status).to.equal(201);
    await confirmarEmail(res.body.userId);
  });
    describe('POST /cadastro', () => {
      it('Não deve cadastrar usuário com e-mail já existente', async () => {
        const res = await cadastrarUsuario({
          ...credenciais,
          username: username + '2'
        });

        expect(res.status).to.equal(409);
        expect(res.body.mensagem).to.include('já cadastrado');
      });
    });
    describe('POST /confirmar-email', () => {
      it('Não deve confirmar e-mail com userId inválido', async () => {
        const res = await confirmarEmail('id-invalido')
        expect(res.status).to.equal(404);
        expect(res.body.mensagem).to.include('Usuário não encontrado');
      });
    });
    describe('POST /login', () => {
      it('Não deve logar com senha errada', async () => {
        const res = await fazerLogin(email, 'SenhaErrada');
        expect(res.status).to.equal(401);
        expect(res.body.mensagem).to.include('Credenciais inválidas');
      });
    });
    describe('GET /historico-login', () => {
      it('Não deve acessar histórico de login sem token', async () => {
        const res = await historicoLogin()
        expect(res.status).to.equal(401);
        expect(res.body.mensagem).to.include('Token inválido');
      });
    });
    describe('POST /recuperar-senha', () => {
      it('Não deve recuperar senha com dados errados', async () => {
        const res = await recuperarSenha(email, 'NovaSenha123', '2000-01-01', 'Outro Pai', 'Outra Mãe')
        expect(res.status).to.equal(401);
        expect(res.body.mensagem).to.include('Dados de recuperação não conferem.');
      });
    });
    describe('POST /login', () => {
      it('Deve bloquear usuário após 3 tentativas de senha errada', async () => {
        let resposta;
        for (let i = 0; i < 3; i++) {
          resposta = await fazerLogin(email, 'SenhaErrada');
        }
        expect(resposta.status).to.equal(403);
        expect(resposta.body.mensagem).to.include('Usuário bloqueado');
      });
    });
});