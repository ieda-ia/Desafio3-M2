const express = require('express');
const router = express.Router();
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const authMiddleware = require('./middlewares/authMiddleware');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger/swagger.json');

// Rotas de páginas web
router.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

router.get('/login', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.render('login', { 
      error: req.query.error,
      success: req.query.success 
    });
  }
});

router.get('/cadastro', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.render('cadastro', { 
      error: req.query.error,
      success: req.query.success 
    });
  }
});

router.get('/dashboard', authMiddleware, (req, res) => {
  res.render('dashboard', { 
    user: req.session.user,
    error: req.query.error,
    success: req.query.success 
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login?success=Logout realizado com sucesso');
});

// Autenticação API
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/trocar-senha', authMiddleware, authController.trocarSenha);

// Cadastro e recuperação API
router.post('/cadastro', userController.cadastro);
router.post('/confirmar-email', userController.confirmarEmail);
router.post('/recuperar-senha', userController.recuperarSenha);
router.post('/desbloquear-usuario', userController.desbloquearUsuario);

// Informações
router.get('/historico-login', authMiddleware, (req, res) => {
  res.json({ historico: req.user.historicoLogin });
});

// Swagger docs
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router; 