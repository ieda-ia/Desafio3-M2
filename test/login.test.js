const request = require('supertest');
const { expect } = require('chai');


// Teste de login com sucesso
describe('Testes da API de Login', () => {
  describe('Login com sucesso', () => {
    it('deve fazer login com sucesso com credenciais válidas', async () => {
      const resposta = await request('http://localhost:3004')
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({ 
          'login': 'usuario@empresa.com',
          'senha': 'Senha123'
         });
      expect(resposta.status).to.equal(200);
      expect(resposta.body.token).to.be.a('string');
    });
  });
});















// const request = require('supertest');
// const expressApp = require('../src/app.js'); // app do Express
// const http = require('http');

// let server;

// before(function () {
//   server = http.createServer(expressApp).listen(3004);
// });

// after(function () {
//   server.close();
// });

// describe('Testes da API de Login', function () {
//   // 1. Login com sucesso
//   it('deve fazer login com sucesso com credenciais válidas', async function () {
//     const res = await request(server)
//       .post('/login')
//       .send({ email: 'usuario@email.com', senha: 'senha123' });

//     if (res.status !== 200) throw new Error('Status diferente de 200');
//     if (!res.body.token) throw new Error('Token não retornado');
//   });

//   // 2. Login inválido
//   it('deve falhar ao fazer login com credenciais inválidas', async function () {
//     const res = await request(server)
//       .post('/login')
//       .send({ email: 'usuario@email.com', senha: 'senhaErrada' });

//     if (res.status !== 401) throw new Error('Status diferente de 401');
//     if (!res.body.error) throw new Error('Mensagem de erro não retornada');
//   });

//   // 3. Bloquear senha após 3 tentativas
//   it('deve bloquear o usuário após 3 tentativas de senha errada', async function () {
//     for (let i = 0; i < 3; i++) {
//       await request(server)
//         .post('/login')
//         .send({ email: 'usuario@email.com', senha: 'senhaErrada' });
//     }

//     const res = await request(server)
//       .post('/login')
//       .send({ email: 'usuario@email.com', senha: 'senhaErrada' });

//     if (res.status !== 403) throw new Error('Status diferente de 403');
//     if (!res.body.error || !res.body.error.includes('bloqueado')) {
//       throw new Error('Usuário não foi bloqueado');
//     }
//   });

//   // 4. Lembrar senha
//   it('deve enviar instruções de recuperação de senha para o email', async function () {
//     const res = await request(server)
//       .post('/lembrar-senha')
//       .send({ email: 'usuario@email.com' });

//     if (res.status !== 200) throw new Error('Status diferente de 200');
//     if (!res.body.mensagem || !res.body.mensagem.includes('enviada')) {
//       throw new Error('Mensagem de recuperação não enviada');
//     }
//   });
// });
