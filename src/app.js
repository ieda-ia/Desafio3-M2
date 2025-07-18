const express = require('express');
const cors = require('cors');
const routes = require('./routes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Rotas principais
app.use('/', routes);

// Tratamento de rota não encontrada
app.use((req, res) => {
  res.status(404).json({ mensagem: 'Rota não encontrada' });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 