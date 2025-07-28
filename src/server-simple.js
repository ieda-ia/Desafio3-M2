const express = require('express');
const session = require('express-session');
const path = require('path');
const app = require('./app-simple');

const PORT = process.env.PORT || 3004;

// Configurar sessões em memória (temporário)
app.use(session({
  secret: 'chave-secreta-temporaria',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 dia
  }
}));

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📱 Interface Web: http://localhost:${PORT}`);
    console.log(`📚 Documentação API: http://localhost:${PORT}/docs`);
    console.log(`\n🎯 Para testar:`);
    console.log(`1. Acesse: http://localhost:${PORT}`);
    console.log(`2. Teste o design das páginas`);
    console.log(`3. Funcionalidades básicas disponíveis`);
    console.log(`\n⚠️  MODO TEMPORÁRIO: Sem MongoDB`);
    console.log(`💡 Para instalar MongoDB: https://docs.mongodb.com/manual/installation/`);
    console.log(`\n⏹️  Para parar o servidor: Ctrl+C`);
});

// Tratamento de erros
process.on('SIGINT', () => {
    console.log('\n👋 Encerrando servidor...');
    process.exit(0);
}); 