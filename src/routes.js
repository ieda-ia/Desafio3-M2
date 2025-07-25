const express = require('express');
const router = express.Router();
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const authMiddleware = require('./middlewares/authMiddleware');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger/swagger.json');


// Autenticação
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/trocar-senha', authMiddleware, authController.trocarSenha);

// Cadastro e recuperação
router.post('/cadastro', userController.cadastro);
router.post('/confirmar-email', userController.confirmarEmail);
router.post('/recuperar-senha', userController.recuperarSenha);
router.post('/desbloquear-usuario', userController.desbloquearUsuario);

// Informações
router.get('/historico-login', authMiddleware, (req, res) => {
  res.json({ historico: req.user.historicoLogin });
});

// Swagger docs (a ser implementado)
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router; 