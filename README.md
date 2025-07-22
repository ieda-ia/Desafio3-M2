# 🔐 API REST de Autenticação para o Desafio 3 da Mentoria 2.0

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18+-blue.svg)](https://expressjs.com/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-orange.svg)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/Swagger-Documentation-green.svg)](https://swagger.io/)

## 📋 Objetivo

API REST robusta de autenticação empresarial desenvolvida para **estudos de teste de software e aprendizado**. 

⚠️ **NÃO destinada para produção** - Armazenamento em memória (sem banco de dados).

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

## 🚀 Como Usar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
 git clone <seu-repositorio>
 cd Desafio3-M2

# Instale as dependências
npm install

# Inicie o servidor
npm start
```

### Rodando os Testes

Os testes automatizados utilizam o Mocha e o Supertest. Não é necessário subir o servidor manualmente para rodar os testes!

```bash
npm test
```

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

## 🏗️ Estrutura do Projeto

```
/src
  /controllers          # Controladores da API
    - authController.js  # Autenticação (login, logout, troca senha)
    - userController.js  # Usuários (cadastro, confirmação, recuperação)
  /middlewares          # Middlewares
    - authMiddleware.js  # Autenticação JWT
  /models               # Modelos de dados
    - userModel.js       # Usuários em memória
    - tokenBlacklist.js  # Blacklist de tokens
  - app.js              # Configuração do Express (exporta apenas o app, usado nos testes)
  - server.js           # Ponto de entrada do servidor (usa app.listen)
  - routes.js           # Rotas da API
/swagger
  - swagger.json        # Documentação OpenAPI
/test
  - login.test.js       # Testes automatizados da API
```

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

## 🔧 Tecnologias Utilizadas

- **Express.js** - Framework web
- **JWT** - Autenticação stateless
- **bcryptjs** - Hash de senhas
- **Joi** - Validação de dados
- **Swagger UI** - Documentação da API
- **dayjs** - Manipulação de datas
- **uuid** - Geração de IDs únicos

## 📝 Scripts Disponíveis

```bash
npm start          # Inicia o servidor em produção
npm run dev        # Inicia o servidor em desenvolvimento (nodemon)
npm test           # Executa os testes automatizados
```

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