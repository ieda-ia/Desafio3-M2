# 🚀 Instruções Rápidas - Sistema de Autenticação

## ⚡ Início Rápido

### 1. Instalação
```bash
npm install
npm run setup
```

### 2. Iniciar MongoDB
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

### 3. Executar o Sistema
```bash
npm run dev
```

### 4. Acessar
- **Interface Web**: http://localhost:3004
- **Documentação API**: http://localhost:3004/docs

## 🎯 Como Usar

### Interface Web
1. **Acesse** http://localhost:3004
2. **Clique em "Crie sua conta"**
3. **Preencha os dados** e crie sua conta
4. **Faça login** com suas credenciais
5. **Explore o dashboard** com suas informações

### Funcionalidades Disponíveis
- ✅ Cadastro de usuários
- ✅ Login seguro
- ✅ Dashboard personalizado
- ✅ Alteração de senha
- ✅ Logout seguro
- ✅ Histórico de atividades

## 🔧 Solução de Problemas

### MongoDB não conecta
```bash
# Verificar se está rodando
mongod --version

# Iniciar manualmente
mongod
```

### Porta ocupada
```bash
# Mudar porta no arquivo .env
PORT=3005
```

### Erro de dependências
```bash
npm install
npm audit fix
```

## 📱 Teste no Celular
- Acesse o IP da sua máquina na rede local
- Exemplo: http://192.168.1.100:3004

## 🔒 Segurança
- Senhas criptografadas
- Tokens JWT seguros
- Proteção contra ataques
- Validação de dados

## 📞 Suporte
- **Issues**: GitHub
- **Documentação**: http://localhost:3004/docs 