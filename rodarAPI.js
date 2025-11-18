// rodarAPI.js - CORRIGIDO

const express = require('express');
const cors = require('cors');
const db = require('./acessaBancoNoServidor'); // Importa a conexão com o DB

const app = express();
const PORT = 3000;

// Middleware para permitir que o Express entenda JSON
app.use(express.json());

// Middleware para permitir requisições cross-origin (CORS)
app.use(cors());

// --- ROTAS DA API (Endpoints) ---

// 🎯 Rota POST (CREATE): /api/membros
app.post('/api/membros', (req, res) => {
    const { nome, nickname, linguagem_favorita } = req.body;

    if (!nome || !nickname || !linguagem_favorita) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const sql = 'INSERT INTO Membros (nome, nickname, linguagem_favorita) VALUES (?, ?, ?)';
    const values = [nome, nickname, linguagem_favorita];

    db.query(sql, values, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Nickname já em uso.' });
            }
            console.error('Erro ao inserir membro:', err);
            return res.status(500).json({ error: 'Erro interno do servidor ao criar membro.' });
        }
        res.status(201).json({ 
            message: 'Membro criado com sucesso!', 
            id: result.insertId 
        });
    });
});

// 🎯 Rota GET (READ - Listar Todos): /api/membros
app.get('/api/membros', (req, res) => {
    const sql = 'SELECT id, nome, nickname, linguagem_favorita, data_cadastro FROM Membros ORDER BY data_cadastro DESC';
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar membros:', err);
            return res.status(500).json({ error: 'Erro interno do servidor ao listar membros.' });
        }
        res.status(200).json(results);
    });
});

// 🎯 Rota GET (READ - Por ID): /api/membros/:id (Necessário para a edição)
app.get('/api/membros/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT id, nome, nickname, linguagem_favorita FROM Membros WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro interno do servidor ao buscar membro.' });
        if (results.length === 0) return res.status(404).json({ error: `Membro com ID ${id} não encontrado.` });
        res.status(200).json(results[0]);
    });
});

// 🎯 Rota PUT (UPDATE): /api/membros/:id (AGORA NO LUGAR CERTO)
app.put('/api/membros/:id', (req, res) => {
    const { id } = req.params; 
    const { nome, nickname, linguagem_favorita } = req.body; 

    if (!nome || !nickname || !linguagem_favorita) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios para atualização.' });
    }

    const sql = 'UPDATE Membros SET nome = ?, nickname = ?, linguagem_favorita = ? WHERE id = ?';
    const values = [nome, nickname, linguagem_favorita, id];

    db.query(sql, values, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Nickname já em uso por outro membro.' });
            }
            console.error('Erro ao atualizar membro:', err);
            return res.status(500).json({ error: 'Erro interno do servidor ao atualizar membro.' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Membro com ID ${id} não encontrado.` });
        }

        res.status(200).json({ 
            message: `Membro com ID ${id} atualizado com sucesso!`,
            changes: result.changedRows
        });
    });
});

// 🎯 Rota DELETE (DELETE): /api/membros/:id (AGORA NO LUGAR CERTO)
app.delete('/api/membros/:id', (req, res) => {
    const { id } = req.params; 

    const sql = 'DELETE FROM Membros WHERE id = ?';
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao excluir membro:', err);
            return res.status(500).json({ error: 'Erro interno do servidor ao excluir membro.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Membro com ID ${id} não encontrado.` });
        }

        res.status(200).json({ 
            message: `Membro com ID ${id} excluído com sucesso!`,
            deletedCount: result.affectedRows
        });
    });
});


// Rota de teste/inicial
app.get('/', (req, res) => {
    res.send('API da Comunidade de Programação Online!');
});

// Inicia o servidor (DEVE SER O ÚLTIMO COMANDO)
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});