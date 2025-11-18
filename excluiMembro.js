// excluiMembro.js

// URL base da sua API
const API_BASE_URL = 'http://localhost:3000/api/membros'; 

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtém o ID do membro da URL (query string)
    const params = new URLSearchParams(window.location.search);
    const membroId = params.get('id');

    if (!membroId) {
        exibirMensagem('❌ Erro: ID do membro não especificado na URL.', 'error');
        return;
    }
    
    // 2. Busca e carrega os dados atuais do membro
    carregarMembroParaConfirmacao(membroId);

    // 3. Adiciona o listener para o botão de confirmação
    const btnConfirmar = document.getElementById('btn-confirmar');
    btnConfirmar.addEventListener('click', () => {
        // Pega o ID garantido que foi carregado
        if (membroId) {
            excluirMembro(membroId);
        }
    });
});

/**
 * Busca os dados do membro na API e exibe para confirmação.
 * (Chama a rota GET /api/membros/:id)
 */
async function carregarMembroParaConfirmacao(id) {
    const dadosDiv = document.getElementById('dados-membro');
    dadosDiv.style.display = 'none'; // Esconde os dados até carregar
    exibirMensagem(`Carregando dados do membro ID: ${id}...`, 'mensagem');
    
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        const membro = await response.json();

        if (response.ok) {
            // Preenche os campos de exibição
            document.getElementById('membro-id-display').textContent = membro.id;
            document.getElementById('membro-nickname-display').textContent = membro.nickname;
            document.getElementById('membro-nome-display').textContent = membro.nome;
            document.getElementById('membro-linguagem-display').textContent = membro.linguagem_favorita;
            
            document.getElementById('titulo-pagina').textContent = `🗑️ Excluir @${membro.nickname}`;
            exibirMensagem('Revise os dados e confirme a exclusão.', 'mensagem');
            dadosDiv.style.display = 'block'; // Exibe os dados para confirmação

        } else {
            exibirMensagem(`❌ Erro do Servidor: ${response.status} - ${membro.error || 'Falha ao buscar membro.'}`, 'error');
        }
    } catch (error) {
        exibirMensagem('🔴 Erro de conexão. Verifique se o Backend está ativo.', 'error');
        console.error('Erro de rede na busca para confirmação:', error);
    }
}

/**
 * Envia a requisição DELETE para a API.
 * (Chama a rota DELETE /api/membros/:id)
 */
async function excluirMembro(id) {
    const btnConfirmar = document.getElementById('btn-confirmar');
    btnConfirmar.disabled = true; // Desabilita para evitar cliques duplos
    exibirMensagem('Executando exclusão...', 'mensagem');

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE', 
        });

        const data = await response.json();
        
        if (response.ok) {
            exibirMensagem(`✅ Sucesso na Exclusão! ${data.message}`, 'success');
            // Redireciona para a lista após a exclusão
            setTimeout(() => {
                window.location.href = 'buscaMembro.html';
            }, 1500); 
        } else {
            btnConfirmar.disabled = false; // Habilita o botão em caso de erro no servidor
            exibirMensagem(`❌ Erro na Exclusão: ${data.error || 'Falha na exclusão.'}`, 'error');
        }
    } catch (error) {
        btnConfirmar.disabled = false;
        exibirMensagem('🔴 Erro de conexão. Não foi possível acessar a API.', 'error');
        console.error('Erro de rede na exclusão:', error);
    }
}

/**
 * Função utilitária para exibir mensagens de status com o estilo correto
 */
function exibirMensagem(texto, tipo) {
    const msgEl = document.getElementById('mensagem-status');
    msgEl.textContent = texto;
    msgEl.className = 'mensagem ' + tipo; // Adiciona a classe de estilo
}