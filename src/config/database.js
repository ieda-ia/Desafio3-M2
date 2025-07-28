// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auth_empresarial', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log(`MongoDB conectado: ${conn.connection.host}`);
//   } catch (error) {
//     console.error('Erro ao conectar com MongoDB:', error.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB; 