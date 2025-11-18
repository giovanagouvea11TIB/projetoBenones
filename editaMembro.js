// editaMembro.js

// URL base da sua API
const API_BASE_URL = 'http://localhost:3000/api/membros'; 

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtém o ID do membro da URL (query string)
    const params = new URLSearchParams(window.location.search);
    const membroId = params.get('id');

    if (!membroId) {
        exibirMensagem('❌ Erro: ID do membro não especificado na URL. Volte para a lista.', 'error');
        return;
    }
    
    // 2. Busca e carrega os dados atuais do membro (GET /api/membros/:id)
    carregarMembro(membroId);

    // 3. Adiciona o listener para o envio do formulário (chama a função de PUT)
    const form = document.getElementById('form-edicao');
    form.addEventListener('submit', (event) => {
        event.preventDefault(); 
        salvarAlteracoes(membroId);
    });
});

/**
 * Busca os dados do membro na API e preenche o formulário.
 * (Chama a rota GET /api/membros/:id)
 */
async function carregarMembro(id) {
    const form = document.getElementById('form-edicao');
    form.style.display = 'none'; // Esconde o formulário até carregar
    exibirMensagem(`Carregando dados do membro ID: ${id}...`, 'mensagem');
    
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const membro = await response.json();

        if (response.ok) {
            // Preenche os campos do formulário
            document.getElementById('membro-id').value = membro.id;
            document.getElementById('nome').value = membro.nome;
            document.getElementById('nickname').value = membro.nickname;
            document.getElementById('linguagem_favorita').value = membro.linguagem_favorita;
            
            document.getElementById('titulo-pagina').textContent = `✍️ Editando @${membro.nickname}`;
            exibirMensagem('Dados carregados. Faça suas alterações.', 'success');
            form.style.display = 'block'; // Exibe o formulário

        } else {
            exibirMensagem(`❌ Erro do Servidor: ${response.status} - ${membro.error || 'Falha ao buscar membro.'}`, 'error');
        }
    } catch (error) {
        exibirMensagem('🔴 Erro de conexão. Verifique se o Backend está ativo.', 'error');
        console.error('Erro de rede na busca:', error);
    }
}

/**
 * Envia os dados do formulário atualizados.
 * (Chama a rota PUT /api/membros/:id)
 */
async function salvarAlteracoes(id) {
    const nome = document.getElementById('nome').value;
    const nickname = document.getElementById('nickname').value;
    const linguagem_favorita = document.getElementById('linguagem_favorita').value;

    const dadosAtualizados = { nome, nickname, linguagem_favorita };

    exibirMensagem('Salvando alterações...', 'mensagem');
    document.getElementById('btn-salvar').disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosAtualizados),
        });

        const resultado = await response.json();
        document.getElementById('btn-salvar').disabled = false;

        if (response.ok) {
            exibirMensagem(`✅ Sucesso! ${resultado.message}`, 'success');
            // Redireciona para a lista após a edição
            setTimeout(() => {
                window.location.href = 'buscaMembro.html';
            }, 1500); 

        } else {
            exibirMensagem(`❌ Erro: ${resultado.error || 'Falha ao salvar alterações.'}`, 'error');
        }

    } catch (error) {
        document.getElementById('btn-salvar').disabled = false;
        exibirMensagem('🔴 Erro de conexão. Não foi possível acessar a API.', 'error');
        console.error('Erro de rede na atualização:', error);
    }
}

/**
 * Função utilitária para exibir mensagens de status com o estilo correto
 */
function exibirMensagem(texto, tipo) {
    const msgEl = document.getElementById('mensagem-status');
    msgEl.textContent = texto;
    msgEl.className = 'mensagem ' + tipo; // Adiciona a classe de estilo (success, error, mensagem)
}