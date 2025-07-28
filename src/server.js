const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3004;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auth_empresarial';

async function startServer() {
    try {
        // console.log('🔌 Conectando ao MongoDB...');
        // await mongoose.connect(MONGODB_URI, {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        // });
        // console.log('✅ MongoDB conectado com sucesso!');
        // Iniciar servidor SEM MongoDB
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT} (sem conexão com MongoDB)`);
            console.log(`📱 Interface Web: http://localhost:${PORT}`);
            console.log(`📚 Documentação API: http://localhost:${PORT}/docs`);
            console.log(`\n🎯 Para testar:`);
            console.log(`1. Acesse: http://localhost:${PORT}`);
            console.log(`2. Crie uma conta na página de cadastro (pode não funcionar sem banco)`);
            console.log(`3. Faça login e explore o dashboard`);
            console.log(`\n⏹️  Para parar o servidor: Ctrl+C`);
        });
        
    } catch (error) {
        console.error('❌ Erro ao conectar ao MongoDB:', error.message);
        console.log('\n💡 Soluções possíveis:');
        console.log('1. Verifique se o MongoDB está instalado e rodando');
        console.log('2. Execute: mongod (para iniciar o MongoDB)');
        console.log('3. Verifique se a URL do MongoDB está correta no arquivo .env');
        console.log('\n🔧 Para instalar o MongoDB:');
        console.log('Windows: https://docs.mongodb.com/manual/installation/');
        console.log('macOS: brew install mongodb-community');
        console.log('Linux: sudo apt-get install mongodb');
        
        process.exit(1);
    }
}

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
    console.error('❌ Erro não tratado:', err);
    process.exit(1);
});

process.on('SIGINT', () => {
    console.log('\n👋 Encerrando servidor...');
    mongoose.connection.close(() => {
        console.log('✅ Conexão com MongoDB fechada.');
        process.exit(0);
    });
});

startServer(); 