const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const routes = require('./routes-simple');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger/swagger.json');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar EJS como template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configurar arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurar sessões em memória
app.use(session({
  secret: process.env.SESSION_SECRET || 'chave-secreta-temporaria',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 dia
  }
}));

// Documentação Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas principais
app.use('/', routes);

// Tratamento de rota não encontrada
app.use((req, res) => {
  res.status(404).json({ mensagem: 'Rota não encontrada' });
});

module.exports = app; 