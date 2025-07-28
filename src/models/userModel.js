const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  senha: {
    type: String,
    required: true,
    minlength: 6
  },
  nome: {
    type: String,
    required: true,
    trim: true
  },
  dataNascimento: {
    type: Date,
    required: true
  },
  nomePai: {
    type: String,
    required: true,
    trim: true
  },
  nomeMae: {
    type: String,
    required: true,
    trim: true
  },
  emailConfirmado: {
    type: Boolean,
    default: false
  },
  bloqueado: {
    type: Boolean,
    default: false
  },
  tentativasLogin: {
    type: Number,
    default: 0
  },
  ultimoLogin: {
    type: Date
  },
  historicoLogin: [{
    data: {
      type: Date,
      default: Date.now
    },
    dispositivo: String,
    ip: String,
    sucesso: Boolean
  }],
  dataCriacao: {
    type: Date,
    default: Date.now
  },
  dataAtualizacao: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware para hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senhas
userSchema.methods.compararSenha = async function(senhaCandidata) {
  return await bcrypt.compare(senhaCandidata, this.senha);
};

// Método para adicionar login ao histórico
userSchema.methods.adicionarLogin = function(dispositivo, ip, sucesso) {
  this.historicoLogin.push({
    data: new Date(),
    dispositivo,
    ip,
    sucesso
  });
  
  if (sucesso) {
    this.ultimoLogin = new Date();
    this.tentativasLogin = 0;
  } else {
    this.tentativasLogin += 1;
    if (this.tentativasLogin >= 5) {
      this.bloqueado = true;
    }
  }
  
  return this.save();
};

module.exports = mongoose.model('User', userSchema); 