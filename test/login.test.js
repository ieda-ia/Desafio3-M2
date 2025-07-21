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















