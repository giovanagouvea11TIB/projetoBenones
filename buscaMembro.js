// buscaMembro.js - Código ATUALIZADO

const API_URL = 'http://localhost:3000/api/membros'; 

document.addEventListener('DOMContentLoaded', () => {
    listarMembros(); 
    const btnAtualizar = document.getElementById('btn-atualizar');
    btnAtualizar.addEventListener('click', listarMembros);
});

async function listarMembros() {
    const container = document.getElementById('membros-container');
    const msgEl = document.getElementById('mensagem-lista');
    container.innerHTML = ''; 
    msgEl.textContent = 'Carregando membros da comunidade...';
    msgEl.className = 'mensagem'; 

    try {
        const response = await fetch(API_URL);
        const membros = await response.json();

        if (response.ok) {
            if (membros && membros.length > 0) {
                msgEl.textContent = `✅ Sucesso! Total de ${membros.length} membros encontrados.`;
                msgEl.classList.add('success');
                membros.forEach(membro => {
                    container.appendChild(criarMembroCard(membro));
                });
            } else {
                msgEl.textContent = 'Nenhum membro cadastrado.';
                msgEl.classList.add('mensagem');
            }
        } else {
            msgEl.textContent = `❌ Erro do Servidor: ${response.status} - ${membros.error || 'Falha ao buscar membros.'}`;
            msgEl.classList.add('error');
        }
    } catch (error) {
        msgEl.textContent = '🔴 Erro de conexão. Verifique se o Backend está ativo na porta 3000.';
        msgEl.classList.add('error');
    }
}

/**
 * Cria o cartão do membro com os botões de AÇÃO
 */
function criarMembroCard(membro) {
    const card = document.createElement('div');
    card.classList.add('membro-card'); 

    const dataCadastro = membro.data_cadastro 
        ? new Date(membro.data_cadastro).toLocaleDateString('pt-BR') 
        : 'Data Desconhecida';

    // O HTML do cartão com os botões
    card.innerHTML = `
        <h3>@${membro.nickname}</h3>
        <p><strong>Nome Completo:</strong> ${membro.nome}</p>
        <p><strong>Linguagem Favorita:</strong> ${membro.linguagem_favorita}</p>
        <p class="data"><strong>Membro Desde:</strong> ${dataCadastro}</p>
        <div class="acoes">
            <button class="btn-editar" data-id="${membro.id}">Editar</button>
            <button class="btn-excluir" data-id="${membro.id}">Excluir</button>
        </div>
        <p class="id-membro">ID: ${membro.id}</p>
    `;
    
    // Conecta o botão Excluir à página de exclusão, passando o ID
    const btnExcluir = card.querySelector('.btn-excluir');
    btnExcluir.addEventListener('click', () => {
        window.location.href = `excluiMembro.html?id=${membro.id}`; 
    });

    // Conecta o botão Editar à página de edição, passando o ID
    const btnEditar = card.querySelector('.btn-editar');
    btnEditar.addEventListener('click', () => {
        window.location.href = `editaMembro.html?id=${membro.id}`; 
    });

    return card;
}