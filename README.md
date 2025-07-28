# 🚀 Desafio3-M2: API REST de Autenticação Empresarial

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18+-blue.svg)](https://expressjs.com/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-orange.svg)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/Swagger-Documentation-green.svg)](https://swagger.io/)

## 📋 Objetivo

API REST robusta de autenticação empresarial desenvolvida para **estudos de teste de software e aprendizado**.

⚠️ **NÃO destinada para produção** - Armazenamento em memória (sem banco de dados).

---

## 🛠️ Stack Utilizada

- **Node.js** 18+
- **Express.js** - Framework web
- **JWT** - Autenticação stateless
- **bcryptjs** - Hash de senhas
- **Joi** - Validação de dados
- **Swagger UI** - Documentação da API
- **dayjs** - Manipulação de datas
- **uuid** - Geração de IDs únicos
- **Mocha** - Testes automatizados
- **Chai** - Asserções para testes
- **Supertest** - Testes de endpoints HTTP

---

## 🏗️ Estrutura de Diretórios

```
/helpers
  cadastro_usuario.js      # Função utilitária para cadastro de usuário em testes
/src
  /controllers
    authController.js      # Autenticação (login, logout, troca senha)
    userController.js      # Usuários (cadastro, confirmação, recuperação)
  /middlewares
    authMiddleware.js      # Autenticação JWT
  /models
    userModel.js           # Usuários em memória
    tokenBlacklist.js      # Blacklist de tokens
  app.js                   # Configuração do Express (exporta apenas o app, usado nos testes)
  server.js                # Ponto de entrada do servidor (usa app.listen)
  routes.js                # Rotas da API
/swagger
  swagger.json             # Documentação OpenAPI
/test
  login_positivo.test.js   # Testes positivos de login
  login_negativo.test.js   # Testes negativos de login
```

---

## 📚 Comandos Úteis

```bash
npm install         # Instala as dependências
npm start           # Inicia o servidor em produção
npm run dev         # Inicia o servidor em desenvolvimento (nodemon)
npm test            # Executa os testes automatizados
npm run test:report # Executa os testes e gera relatório HTML com mochawesome
```

> **Nota:** O relatório HTML dos testes será gerado na pasta `mochawesome-report` após rodar `npm run test:report`. Para visualizar, abra o arquivo `mochawesome-report/mochawesome.html` no seu navegador.

---

## 🔑 Como Executar a API de Login

1. **Clone o repositório:**
   ```bash
   git clone <seu-repositorio>
   cd Desafio3-M2
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Inicie o servidor:**
   ```bash
   npm start
   # ou para ambiente de desenvolvimento
   npm run dev
   ```
4. **Acesse a documentação Swagger:**
   - [http://localhost:3000/docs](http://localhost:3000/docs)

5. **Faça login:**
   - Endpoint: `POST /login`
   - Exemplo de payload:
     ```json
     {
       "email": "usuario@empresa.com",
       "senha": "Senha123"
     }
     ```
   - O token JWT será retornado na resposta.

6. **Utilize o token JWT:**
   - Adicione o header `Authorization: Bearer <token>` nas requisições protegidas.

---

## 👤 Usuário Fixo para Testes

Um usuário já está disponível para testes em todos os endpoints protegidos:

```json
{
  "email": "usuario@empresa.com",
  "username": "usuario1",
  "senha": "Senha123",
  "nome": "Usuário Teste",
  "dataNascimento": "1990-01-01",
  "nomePai": "João Teste",
  "nomeMae": "Maria Teste",
  "emailConfirmado": true
}
```

---

## ✨ Funcionalidades Implementadas

### 🔑 Autenticação
- ✅ Login com email/senha ou username/senha
- ✅ Login inválido com contagem de tentativas
- ✅ Bloqueio automático após 3 tentativas inválidas (5 minutos)
- ✅ Desbloqueio automático e manual (admin)
- ✅ Logout seguro com blacklist de tokens
- ✅ JWT com expiração de 10 minutos

### 👤 Cadastro e Usuários
- ✅ Cadastro de usuário com validação completa
- ✅ Confirmação de email (simulada)
- ✅ Validação de força de senha (mínimo 6 caracteres, letras + números)
- ✅ Validação de campos obrigatórios

### 🔒 Segurança Avançada
- ✅ Middleware de autenticação JWT
- ✅ Blacklist de tokens para logout seguro
- ✅ Detecção de login por novo dispositivo
- ✅ Limite de sessões simultâneas (máximo 3)
- ✅ Histórico de login com data/hora
- ✅ Primeiro login com mensagem diferenciada

### 🔄 Recuperação e Troca
- ✅ Recuperação de senha (email, data nascimento, nome pai/mãe)
- ✅ Troca de senha (requer senha atual)

---

## 📚 Endpoints

### Autenticação
| Método | Endpoint        | Descrição         | Autenticação |
|--------|-----------------|-------------------|--------------|
| POST   | `/login`        | Login de usuário  |      ❌      |
| POST   | `/logout`       | Logout do usuário |      ✅      |
| POST   | `/trocar-senha` | Troca de senha    |      ✅      |

### Cadastro e Recuperação
| Método | Endpoint               | Descrição                  | Autenticação |
|--------|------------------------|----------------------------|--------------|
| POST   | `/cadastro`            | Cadastra novo usuário      |     ❌       |
| POST   | `/confirmar-email`     | Confirma email do cadastro |     ❌       |
| POST   | `/recuperar-senha`     | Recupera senha             |     ❌       |
| POST   | `/desbloquear-usuario` | Desbloqueio manual (admin) |     ❌       |

### Informações
| Método | Endpoint           | Descrição            | Autenticação |
|--------|--------------------|----------------------|--------------|
| GET    | `/historico-login` | Histórico de login   |     ✅       |
| GET    | `/docs`            | Documentação Swagger |     ❌       |

---

## 🧪 Dados de Teste

### Exemplo de usuário para cadastro:
```json
{
  "email": "usuario@empresa.com",
  "username": "usuario1",
  "senha": "Senha123",
  "nome": "Usuário Teste",
  "dataNascimento": "1990-01-01",
  "nomePai": "João Teste",
  "nomeMae": "Maria Teste"
}
```

### Fluxo de teste recomendado:
1. **Cadastrar usuário:** POST `/cadastro`
2. **Confirmar email:** POST `/confirmar-email` com `userId`
3. **Fazer login:** POST `/login` (receberá token JWT)
4. **Usar token:** Adicionar header `Authorization: Bearer <token>`

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ⚠️ Aviso

Este projeto foi desenvolvido **exclusivamente para fins educacionais e de estudo**. Não é recomendado para uso em produção sem as devidas adaptações de segurança e infraestrutura. 

Grupo 6 - M2.0
https://github.com/ieda-ia
https://github.com/fabhid23
https://github.com/welitaluisa
https://github.com/JonathasAnalista
https://github.com/JonatanAlbuquerque0607