// =======================================
// API - Express + MongoDB
// =======================================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Libera o acesso do aplicativo à API
app.use(cors());

// Permite receber JSON (limite maior por causa das imagens)
app.use(express.json({ limit: '20mb' }));

// Endereço do banco de dados
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/technologic';
const PORTA = 3000;


// =======================================
// MODELOS (formato dos dados no banco)
// =======================================

const Usuario = mongoose.model('Usuario', {
    nome: String,
    email: String,
    senha: String,
    telefone: String,
    cpf: String,
    imagem: String,
});

const Conteudo = mongoose.model('Conteudo', {
    titulo: String,
    subtitulo: String,
    categoria: String,
    imagem: String,
});


// =======================================
// USUÁRIOS
// =======================================

// Cadastro de usuário
app.post('/usuarios', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ mensagem: 'Preencha todos os campos' });
        }

        // Verifica se o e-mail já foi usado
        const existe = await Usuario.findOne({ email: email });
        if (existe) {
            return res.status(400).json({ mensagem: 'E-mail já cadastrado' });
        }

        const usuario = await Usuario.create({ nome, email, senha });
        res.status(201).json(usuario);
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: 'Erro ao cadastrar' });
    }
});

// Login
app.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Procura um usuário com esse e-mail e essa senha
        const usuario = await Usuario.findOne({ email: email, senha: senha });

        if (!usuario) {
            return res.status(401).json({ mensagem: 'E-mail ou senha inválidos' });
        }

        res.json(usuario);
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: 'Erro ao fazer login' });
    }
});

// Alterar dados do perfil
app.put('/usuarios/:id', async (req, res) => {
    try {
        const dados = {
            nome: req.body.nome,
            email: req.body.email,
            telefone: req.body.telefone,
            cpf: req.body.cpf,
            imagem: req.body.imagem,
        };

        // Só troca a senha se uma nova foi digitada
        if (req.body.senha) {
            dados.senha = req.body.senha;
        }

        // { new: true } devolve o usuário já atualizado
        const usuario = await Usuario.findByIdAndUpdate(req.params.id, dados, { new: true });
        res.json(usuario);
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: 'Erro ao salvar perfil' });
    }
});


// =======================================
// CONTEÚDOS (os cards do aplicativo)
// =======================================

// Listar conteúdos (com pesquisa opcional)
app.get('/conteudos', async (req, res) => {
    try {
        // Busca TODOS os conteúdos do banco
        const todos = await Conteudo.find();

        const busca = req.query.busca;

        // Sem termo de pesquisa: devolve tudo
        if (!busca) {
            return res.json(todos);
        }

        // Com termo: passa por cada conteúdo e guarda os que contêm o termo
        const termo = busca.toLowerCase();
        const encontrados = [];

        for (let i = 0; i < todos.length; i++) {
            const item = todos[i];
            const texto = (item.titulo + ' ' + item.subtitulo + ' ' + item.categoria).toLowerCase();

            if (texto.includes(termo)) {
                encontrados.push(item);
            }
        }

        res.json(encontrados);
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: 'Erro ao buscar conteúdos' });
    }
});

// Cadastrar conteúdo
app.post('/conteudos', async (req, res) => {
    try {
        const { titulo, subtitulo, categoria, imagem } = req.body;

        if (!titulo) {
            return res.status(400).json({ mensagem: 'Informe o título' });
        }

        const conteudo = await Conteudo.create({ titulo, subtitulo, categoria, imagem });
        res.status(201).json(conteudo);
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: 'Erro ao cadastrar conteúdo' });
    }
});

// Alterar conteúdo
app.put('/conteudos/:id', async (req, res) => {
    try {
        const { titulo, subtitulo, categoria, imagem } = req.body;

        const conteudo = await Conteudo.findByIdAndUpdate(
            req.params.id,
            { titulo, subtitulo, categoria, imagem },
            { new: true }
        );
        res.json(conteudo);
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: 'Erro ao alterar conteúdo' });
    }
});

// Excluir conteúdo
app.delete('/conteudos/:id', async (req, res) => {
    try {
        await Conteudo.findByIdAndDelete(req.params.id);
        res.json({ mensagem: 'Conteúdo excluído' });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: 'Erro ao excluir conteúdo' });
    }
});


// =======================================
// INICIAR
// =======================================

// Primeiro conecta no banco, depois liga o servidor
mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('Conectado ao MongoDB');
        app.listen(PORTA, () => {
            console.log('API rodando na porta ' + PORTA);
        });
    })
    .catch((erro) => {
        console.log('Erro ao conectar no MongoDB:', erro.message);
    });
