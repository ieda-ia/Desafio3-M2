# Sistema de Autenticação Empresarial

Um sistema completo de autenticação empresarial desenvolvido com Node.js, Express, MongoDB e EJS, seguindo as melhores práticas de segurança.

## 🚀 Funcionalidades

### Autenticação
- ✅ Login com email/username e senha
- ✅ Cadastro de usuários com validação completa
- ✅ Logout seguro com blacklist de tokens
- ✅ Troca de senha
- ✅ Proteção contra ataques de força bruta
- ✅ Histórico de login
- ✅ Detecção de dispositivos

### Interface Web
- ✅ Página de login moderna e responsiva
- ✅ Página de cadastro com validação em tempo real
- ✅ Dashboard com informações do usuário
- ✅ Design inspirado no modelo fornecido
- ✅ Animações e interações suaves

### Segurança
- ✅ Senhas criptografadas com bcrypt
- ✅ Autenticação JWT
- ✅ Sessões seguras com MongoDB
- ✅ Blacklist de tokens
- ✅ Validação de dados com Joi
- ✅ Proteção contra CSRF
- ✅ Rate limiting (configurável)

### Banco de Dados
- ✅ MongoDB com Mongoose
- ✅ Modelos bem estruturados
- ✅ Índices para performance
- ✅ Validação de dados

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js, Express.js
- **Banco de Dados**: MongoDB, Mongoose
- **Autenticação**: JWT, bcryptjs
- **Template Engine**: EJS
- **Sessões**: express-session, connect-mongo
- **Validação**: Joi
- **Testes**: Mocha, Chai, Supertest
- **Documentação**: Swagger

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- MongoDB (versão 4.4 ou superior)
- npm ou yarn

## 🔧 Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/ieda-ia/Desafio3-M2.git
   cd Desafio3-M2
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```env
   PORT=3004
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/auth_empresarial
   JWT_SECRET=sua-chave-secreta-super-segura-aqui
   SESSION_SECRET=outra-chave-secreta-para-sessoes
   ```

4. **Inicie o MongoDB**
   ```bash
   # No Windows
   mongod
   
   # No macOS/Linux
   sudo systemctl start mongod
   ```

5. **Execute o projeto**
   ```bash
   # Desenvolvimento
   npm run dev
   
   # Produção
   npm start
   ```

6. **Acesse a aplicação**
   - Interface Web: http://localhost:3004
   - Documentação API: http://localhost:3004/docs

## 📁 Estrutura do Projeto

```
Desafio3-M2/
├── src/
│   ├── config/
│   │   └── database.js          # Configuração do MongoDB
│   ├── controllers/
│   │   ├── authController.js    # Controlador de autenticação
│   │   └── userController.js    # Controlador de usuários
│   ├── middlewares/
│   │   └── authMiddleware.js    # Middleware de autenticação
│   ├── models/
│   │   ├── userModel.js         # Modelo de usuário
│   │   └── tokenBlacklist.js    # Modelo de blacklist
│   ├── views/
│   │   ├── layout.ejs           # Layout base
│   │   ├── login.ejs            # Página de login
│   │   ├── cadastro.ejs         # Página de cadastro
│   │   └── dashboard.ejs        # Página do dashboard
│   ├── app.js                   # Configuração do Express
│   ├── routes.js                # Rotas da aplicação
│   └── server.js                # Servidor
├── test/                        # Testes automatizados
├── swagger/                     # Documentação da API
├── helpers/                     # Scripts auxiliares
├── package.json
└── README.md
```

## 🎯 Como Usar

### Interface Web

1. **Acesse** http://localhost:3004
2. **Crie uma conta** na página de cadastro
3. **Faça login** com suas credenciais
4. **Explore o dashboard** com suas informações

### API REST

#### Autenticação
```bash
# Login
POST /login
{
  "login": "usuario@empresa.com",
  "senha": "Senha123",
  "dispositivo": "Desktop"
}

# Cadastro
POST /cadastro
{
  "email": "usuario@empresa.com",
  "username": "usuario1",
  "senha": "Senha123",
  "nome": "Usuário Teste",
  "dataNascimento": "1990-01-01",
  "nomePai": "João Teste",
  "nomeMae": "Maria Teste"
}

# Logout
POST /logout
Authorization: Bearer <token>

# Trocar senha
POST /trocar-senha
Authorization: Bearer <token>
{
  "senhaAtual": "Senha123",
  "novaSenha": "NovaSenha123"
}
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes com relatório
npm run test:report
```

## 📊 Teste de Carga

O projeto inclui um arquivo JMeter para testes de carga:

```bash
# Execute o teste de carga com JMeter
jmeter -n -t Desafio3-M2_LoadTest.jmx -l results.jtl -e -o report/
```

## 🔒 Segurança

### Medidas Implementadas

- **Criptografia**: Senhas hash com bcrypt
- **Tokens**: JWT com expiração
- **Sessões**: Armazenadas no MongoDB
- **Validação**: Dados validados com Joi
- **Rate Limiting**: Proteção contra ataques
- **CSRF**: Proteção contra Cross-Site Request Forgery
- **XSS**: Sanitização de dados
- **SQL Injection**: Prevenção com Mongoose

### Boas Práticas

- ✅ Senhas fortes obrigatórias
- ✅ Bloqueio após tentativas falhadas
- ✅ Histórico de login
- ✅ Detecção de dispositivos
- ✅ Logout seguro
- ✅ Tokens na blacklist

## 🚀 Deploy

### Docker (Recomendado)

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3004
CMD ["npm", "start"]
```

### Variáveis de Produção

```env
NODE_ENV=production
MONGODB_URI=mongodb://seu-servidor:27017/auth_empresarial
JWT_SECRET=chave-super-secreta-de-producao
SESSION_SECRET=chave-sessao-de-producao
```

## 📈 Monitoramento

### Logs
- Logs de autenticação
- Logs de erro
- Logs de performance

### Métricas
- Usuários ativos
- Tentativas de login
- Taxa de sucesso

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Email**: suporte@empresa.com
- **Documentação**: http://localhost:3004/docs
- **Issues**: [GitHub Issues](https://github.com/ieda-ia/Desafio3-M2/issues)

## 🎉 Agradecimentos

- Equipe de desenvolvimento
- Comunidade Node.js
- MongoDB
- Font Awesome (ícones)

---

**Desenvolvido com ❤️ para o Desafio3-M2**