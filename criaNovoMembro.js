// criaNovoMembro.js

const API_URL = 'http://localhost:3000/api/membros';

document.addEventListener('DOMContentLoaded', () => {
    const formCadastro = document.getElementById('form-cadastro');
    formCadastro.addEventListener('submit', handleCadastro);
});

/**
 * Função para enviar os dados do formulário para a rota POST
 */
async function handleCadastro(event) {
    event.preventDefault(); 

    const nome = document.getElementById('nome').value;
    const nickname = document.getElementById('nickname').value;
    const linguagem_favorita = document.getElementById('linguagem').value;
    const msgEl = document.getElementById('mensagem-cadastro');
    
    msgEl.textContent = 'Enviando...';
    msgEl.className = 'mensagem';

    const novoMembro = { nome, nickname, linguagem_favorita };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novoMembro),
        });

        const data = await response.json();

        if (response.ok) {
            msgEl.textContent = `Sucesso! Membro ${nickname} cadastrado com ID ${data.id}.`;
            msgEl.classList.add('success');
            document.getElementById('form-cadastro').reset();
        } else {
            msgEl.textContent = `Erro ao cadastrar: ${data.error || 'Erro desconhecido.'}`;
            msgEl.classList.add('error');
        }
    } catch (error) {
        msgEl.textContent = 'Erro de conexão com o servidor. Verifique se o rodarAPI.js está ativo.';
        msgEl.classList.add('error');
        console.error('Erro de rede:', error);
    }
}