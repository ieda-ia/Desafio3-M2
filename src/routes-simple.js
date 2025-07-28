const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger/swagger.json');

// Dados temporários em memória
const users = [
    {
        id: '1',
        email: 'usuario@teste.com',
        username: 'usuario1',
        nome: 'Usuário Teste',
        senha: 'Senha123'
    }
];

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
        res.render('login-simple', { 
            error: req.query.error,
            success: req.query.success 
        });
    }
});

router.get('/cadastro', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.render('cadastro-simple', { 
            error: req.query.error,
            success: req.query.success 
        });
    }
});

router.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login?error=Faça login para acessar o dashboard');
    }
    
    res.render('dashboard-simple', { 
        user: req.session.user,
        error: req.query.error,
        success: req.query.success 
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login?success=Logout realizado com sucesso');
});

// Autenticação simplificada
router.post('/login', (req, res) => {
    const { login, senha } = req.body;
    
    if (!login || !senha) {
        return res.redirect('/login?error=Login e senha são obrigatórios');
    }

    // Buscar usuário (simulação)
    const user = users.find(u => 
        (u.email === login || u.username === login) && u.senha === senha
    );

    if (!user) {
        return res.redirect('/login?error=Credenciais inválidas');
    }

    // Criar sessão
    req.session.user = {
        id: user.id,
        email: user.email,
        nome: user.nome,
        username: user.username
    };

    res.redirect('/dashboard?success=Login realizado com sucesso');
});

// Cadastro simplificado
router.post('/cadastro', (req, res) => {
    const { email, username, senha, nome, dataNascimento, nomePai, nomeMae } = req.body;
    
    if (!email || !username || !senha || !nome || !dataNascimento || !nomePai || !nomeMae) {
        return res.redirect('/cadastro?error=Todos os campos são obrigatórios');
    }

    // Verificar se usuário já existe
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
        return res.redirect('/cadastro?error=Email ou username já cadastrado');
    }

    // Criar novo usuário
    const newUser = {
        id: (users.length + 1).toString(),
        email,
        username,
        senha,
        nome,
        dataNascimento,
        nomePai,
        nomeMae
    };

    users.push(newUser);

    res.redirect('/login?success=Usuário cadastrado com sucesso! Faça login para continuar');
});

// Trocar senha simplificado
router.post('/trocar-senha', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ mensagem: 'Usuário não autenticado' });
    }

    const { senhaAtual, novaSenha } = req.body;
    
    if (!senhaAtual || !novaSenha) {
        return res.status(400).json({ mensagem: 'Senha atual e nova senha são obrigatórias' });
    }

    // Buscar usuário
    const user = users.find(u => u.id === req.session.user.id);
    
    if (!user || user.senha !== senhaAtual) {
        return res.status(401).json({ mensagem: 'Senha atual incorreta' });
    }

    // Atualizar senha
    user.senha = novaSenha;

    res.json({ mensagem: 'Senha alterada com sucesso' });
});

// Swagger docs
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router; 