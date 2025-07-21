const request = require('supertest');
const { expect } = require('chai');


// Teste de login com sucesso
describe('Testes da API de Login', () => {
  describe('Login com sucesso', () => {
    let userId = ''
    // Cadastrar usuário
    it('Deve retornar 200 ao fazer cadastro do usuário com sucesso', async () => {
      const resposta = await request('http://localhost:3004')
        .post('/cadastro')
        .set('Content-Type', 'application/json')
        .send({
              'email': 'usuario5@empresa.com',
              'username': 'usuario5',
              'senha': 'Senha123',
              'nome': 'Usuário Teste',
              'dataNascimento': '1990-01-01',
              'nomePai': 'João Teste',
              'nomeMae': 'Maria Teste'
            }); 
      userId = resposta.body.userId       
      expect(resposta.status).to.equal(201);
      expect(resposta.body.mensagem).to.equal('Usuário cadastrado com sucesso. Confirme seu email para ativar a conta.');
    });
    
    // Validar cadastro - confirmar e-mail com id
    it('Deve fazer cadastro do usuário', async () => {
      const resposta = await request('http://localhost:3004')
        .post('/confirmar-email')
        .set('Content-Type', 'application/json')
        .send({
              'userId': userId             
            });          
      expect(resposta.status).to.equal(200);
      expect(resposta.body.mensagem).to.equal('Email confirmado com sucesso.');
    });

    it('Deve fazer login com sucesso com credenciais válidas', async () => {
      const resposta = await request('http://localhost:3004')
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({ 
          'login': 'usuario5@empresa.com',
          'senha': 'Senha123'
         });
      expect(resposta.status).to.equal(200);
      expect(resposta.body.token).to.be.a('string');
    });
  });
});















