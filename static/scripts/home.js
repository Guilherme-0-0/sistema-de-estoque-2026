// JS simples para tornar a home interativa para iniciantes
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const productsGrid = document.querySelector('.products-grid');

    // Debounce simples
    function debounce(fn, delay = 300) {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn(...args), delay);
        };
    }

    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            const q = e.target.value.trim();
            // Simples: atualiza query string e recarrega a página
            const params = new URLSearchParams(window.location.search);
            if (q) params.set('q', q); else params.delete('q');
            params.set('page', 1);
            window.location.search = params.toString();
        }, 400));
    }

    // Delegate clicks nos botões de ação
    productsGrid && productsGrid.addEventListener('click', (e) => {
        // Se clicou em um botão de ação, processa a ação
        const btn = e.target.closest('.action-btn');
        if (btn) {
            e.stopPropagation(); // Impede que o clique no botão ative o clique no card
            const action = btn.dataset.action; // 'add' ou 'remove'
            const productId = btn.closest('.product-card').dataset.id;
            if (!productId) return;

            // Se for REMOVER, abre o modal de retirada
            if (action === 'remove') {
                abrirModalRetirada(productId, btn.closest('.product-card'));
                return;
            }

            // Se for ADICIONAR, abre o modal de adição
            if (action === 'add') {
                abrirModalAdicao(productId, btn.closest('.product-card'));
                return;
            }
            return;
        }

        // Se clicou no card (mas não em um botão), vai para a página de retirada
        const productCard = e.target.closest('.product-card');
        if (productCard) {
            const productId = productCard.dataset.id;
            if (productId) {
                window.location.href = `/retirada_estoque/${productId}`;
            }
        }
    });

    // Paginação
    const pagination = document.querySelector('.pagination');
    if (pagination) {
        pagination.addEventListener('click', (e) => {
            const btn = e.target.closest('.page-btn');
            if (!btn || btn.disabled) return;
            
            const isNext = btn.querySelector('.bi-chevron-right');
            const params = new URLSearchParams(window.location.search);
            let currentPage = parseInt(params.get('page') || '1');
            
            if (isNext) {
                params.set('page', currentPage + 1);
            } else {
                params.set('page', Math.max(1, currentPage - 1));
            }
            
            window.location.search = params.toString();
        });
    }

    // Filtros - Categoria e Ordenação
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach((select, index) => {
        // Restaurar valores dos filtros da URL
        const params = new URLSearchParams(window.location.search);
        if (index === 0) {
            // Primeiro select é categoria
            const categoria = params.get('categoria');
            if (categoria) select.value = categoria;
        } else if (index === 1) {
            // Segundo select é ordenação
            const ordenar = params.get('ordenar');
            if (ordenar) select.value = ordenar;
        }

        // Adicionar listener de mudança
        select.addEventListener('change', (e) => {
            const params = new URLSearchParams(window.location.search);
            const valor = e.target.value;
            
            if (index === 0) {
                // Filtro de categoria
                if (valor) {
                    params.set('categoria', valor);
                } else {
                    params.delete('categoria');
                }
            } else if (index === 1) {
                // Filtro de ordenação
                if (valor) {
                    params.set('ordenar', valor);
                } else {
                    params.delete('ordenar');
                }
            }
            
            // Resetar para primeira página ao aplicar filtros
            params.set('page', 1);
            
            window.location.search = params.toString();
        });
    });
});

// Variáveis globais do modal
let modalProdutoId = null;
let modalEstoqueMax = 0;

function carregarResponsaveis() {
    fetch('/api/responsaveis')
        .then(r => r.json())
        .then(data => {
            const lista = document.getElementById('lista-responsaveis');
            const listaGerenciar = document.getElementById('lista-responsaveis-gerenciar');
            
            lista.innerHTML = '';
            if (listaGerenciar) listaGerenciar.innerHTML = '';

            data.responsaveis.forEach(resp => {
                // Radio button para o modal de retirada
                const div = document.createElement('div');
                div.className = 'responsavel-option';
                div.innerHTML = `
                    <label>
                        <input type="radio" name="responsavel" value="${resp.id}">
                        ${resp.nome}
                    </label>
                `;
                lista.appendChild(div);

                // Item para o modal de gerenciamento
                if (listaGerenciar) {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span>${resp.nome}</span>
                        <button class="btn-delete" onclick="removerResponsavel(${resp.id})" aria-label="Remover ${resp.nome}">
                            <i class="bi bi-trash"></i>
                        </button>
                    `;
                    listaGerenciar.appendChild(li);
                }
            });

            // Opção "Outro"
            const divOutro = document.createElement('div');
            divOutro.className = 'responsavel-option';
            divOutro.innerHTML = `
                <label>
                    <input type="radio" name="responsavel" value="outro">
                    Outro
                </label>
            `;
            lista.appendChild(divOutro);

            // Listener para mostrar/ocultar campo "Outro"
            document.querySelectorAll('input[name="responsavel"]').forEach(radio => {
                radio.addEventListener('change', () => {
                    const outroContainer = document.querySelector('.outro-responsavel-container');
                    if (radio.value === 'outro') {
                        outroContainer.style.display = 'block';
                    } else {
                        outroContainer.style.display = 'none';
                    }
                });
            });
        })
        .catch(err => console.error('Erro ao carregar responsáveis:', err));
}

function carregarResponsaveisAdicao() {
    fetch('/api/responsaveis')
        .then(r => r.json())
        .then(data => {
            const lista = document.getElementById('lista-responsaveis-adicao');
            
            lista.innerHTML = '';

            data.responsaveis.forEach(resp => {
                // Radio button para o modal de adição
                const div = document.createElement('div');
                div.className = 'responsavel-option';
                div.innerHTML = `
                    <label>
                        <input type="radio" name="responsavel-adicao" value="${resp.id}">
                        ${resp.nome}
                    </label>
                `;
                lista.appendChild(div);
            });

            // Opção "Outro"
            const divOutro = document.createElement('div');
            divOutro.className = 'responsavel-option';
            divOutro.innerHTML = `
                <label>
                    <input type="radio" name="responsavel-adicao" value="outro">
                    Outro
                </label>
            `;
            lista.appendChild(divOutro);

            // Listener para mostrar/ocultar campo "Outro"
            document.querySelectorAll('input[name="responsavel-adicao"]').forEach(radio => {
                radio.addEventListener('change', () => {
                    const outroContainer = document.querySelector('.outro-responsavel-adicao-container');
                    if (radio.value === 'outro') {
                        outroContainer.style.display = 'block';
                    } else {
                        outroContainer.style.display = 'none';
                    }
                });
            });
        })
        .catch(err => console.error('Erro ao carregar responsáveis:', err));
}

function abrirModalRetirada(productId, cardElement) {
    const modal = document.getElementById('modalRetirada');
    const produtoNome = cardElement.querySelector('h3').textContent;
    const quantidadeAtual = parseInt(cardElement.querySelector('.quantity').textContent.trim());

    modalProdutoId = productId;
    modalEstoqueMax = quantidadeAtual;

    document.getElementById('modal-produto-nome').textContent = produtoNome;
    document.getElementById('modal-estoque-atual').textContent = quantidadeAtual;
    document.getElementById('modal-quantidade').value = 1;
    document.getElementById('modal-quantidade').setAttribute('max', quantidadeAtual);
    
    // Limpar seleção anterior
    document.querySelectorAll('input[name="responsavel"]').forEach(r => r.checked = false);
    document.querySelector('.outro-responsavel-container').style.display = 'none';
    document.getElementById('modal-outro-responsavel').value = '';

    carregarResponsaveis();
    modal.style.display = 'flex';
}

function fecharModalRetirada(event) {
    const modal = document.getElementById('modalRetirada');
    modal.style.display = 'none';
    modalProdutoId = null;
    modalEstoqueMax = 0;
}

function ajustarQuantidadeModal(delta) {
    const input = document.getElementById('modal-quantidade');
    let valor = parseInt(input.value) || 1;
    valor += delta;
    if (valor < 1) valor = 1;
    if (valor > modalEstoqueMax) valor = modalEstoqueMax;
    input.value = valor;
}

function confirmarRetirada() {
    const quantidade = parseInt(document.getElementById('modal-quantidade').value);
    const radioSelecionado = document.querySelector('input[name="responsavel"]:checked');

    if (!radioSelecionado) {
        alert('Por favor, selecione quem está retirando');
        return;
    }

    let responsavel = '';
    if (radioSelecionado.value === 'outro') {
        responsavel = document.getElementById('modal-outro-responsavel').value.trim();
        if (!responsavel) {
            alert('Por favor, digite o nome da pessoa');
            return;
        }
    } else {
        // Pegar o nome do responsável do label
        responsavel = radioSelecionado.parentElement.textContent.trim();
    }

    // Envia para o backend
    fetch('/api/retirar_com_motivo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            product_id: modalProdutoId,
            quantidade: quantidade,
            motivo: responsavel
        })
    }).then(r => r.json())
    .then(json => {
        if (json.ok) {
            window.location.reload();
        } else {
            alert(json.error || 'Erro ao retirar produto');
        }
    }).catch(err => {
        alert('Erro de rede');
        console.error(err);
    });
}

function abrirGerenciarResponsaveis() {
    const modalGerenciar = document.getElementById('modalGerenciarResponsaveis');
    carregarResponsaveis();
    modalGerenciar.style.display = 'flex';
}

function fecharGerenciarResponsaveis(event) {
    const modalGerenciar = document.getElementById('modalGerenciarResponsaveis');
    modalGerenciar.style.display = 'none';
    // Recarregar lista do modal principal se estiver aberto
    if (document.getElementById('modalRetirada').style.display === 'flex') {
        carregarResponsaveis();
    }
}

function adicionarResponsavel() {
    const input = document.getElementById('novo-responsavel');
    const nome = input.value.trim();

    if (!nome) {
        alert('Digite um nome válido');
        return;
    }

    fetch('/api/responsaveis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nome })
    })
    .then(r => r.json())
    .then(json => {
        if (json.ok) {
            input.value = '';
            carregarResponsaveis();
        } else {
            alert(json.error || 'Erro ao adicionar responsável');
        }
    })
    .catch(err => {
        alert('Erro de rede');
        console.error(err);
    });
}

function removerResponsavel(id) {
    if (!confirm('Deseja realmente remover este nome?')) return;

    fetch(`/api/responsaveis/${id}`, {
        method: 'DELETE'
    })
    .then(r => r.json())
    .then(json => {
        if (json.ok) {
            carregarResponsaveis();
        } else {
            alert(json.error || 'Erro ao remover responsável');
        }
    })
    .catch(err => {
        alert('Erro de rede');
        console.error(err);
    });
}

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        fecharModalRetirada();
        fecharModalAdicao();
    }
});

// ==================== FUNÇÕES DO MODAL DE ADIÇÃO ====================

let modalAdicaoProdutoId = null;

function abrirModalAdicao(productId, cardElement) {
    const modal = document.getElementById('modalAdicao');
    const produtoNome = cardElement.querySelector('h3').textContent;
    const quantidadeAtual = parseInt(cardElement.querySelector('.quantity').textContent.trim());

    modalAdicaoProdutoId = productId;

    document.getElementById('modal-adicao-produto-nome').textContent = produtoNome;
    document.getElementById('modal-adicao-estoque-atual').textContent = quantidadeAtual;
    document.getElementById('modal-adicao-quantidade').value = 1;
    
    // Limpar seleção anterior
    document.querySelectorAll('input[name="responsavel-adicao"]').forEach(r => r.checked = false);
    document.querySelector('.outro-responsavel-adicao-container').style.display = 'none';
    document.getElementById('modal-adicao-outro-responsavel').value = '';

    carregarResponsaveisAdicao();
    modal.style.display = 'flex';
}

function fecharModalAdicao(event) {
    const modal = document.getElementById('modalAdicao');
    modal.style.display = 'none';
    modalAdicaoProdutoId = null;
}

function ajustarQuantidadeModalAdicao(delta) {
    const input = document.getElementById('modal-adicao-quantidade');
    let valor = parseInt(input.value) || 1;
    valor += delta;
    if (valor < 1) valor = 1;
    input.value = valor;
}

function confirmarAdicao() {
    const quantidade = parseInt(document.getElementById('modal-adicao-quantidade').value);
    const radioSelecionado = document.querySelector('input[name="responsavel-adicao"]:checked');

    if (!radioSelecionado) {
        alert('Por favor, selecione quem está adicionando');
        return;
    }

    let responsavel = '';
    if (radioSelecionado.value === 'outro') {
        responsavel = document.getElementById('modal-adicao-outro-responsavel').value.trim();
        if (!responsavel) {
            alert('Por favor, digite o nome da pessoa');
            return;
        }
    } else {
        // Pegar o nome do responsável do label
        responsavel = radioSelecionado.parentElement.textContent.trim();
    }

    // Envia para o backend
    fetch('/api/adicionar_com_motivo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            product_id: modalAdicaoProdutoId,
            quantidade: quantidade,
            motivo: responsavel
        })
    }).then(r => r.json())
    .then(json => {
        if (json.ok) {
            window.location.reload();
        } else {
            alert(json.error || 'Erro ao adicionar produto');
        }
    }).catch(err => {
        alert('Erro de rede');
        console.error(err);
    });
}

function abrirGerenciarResponsaveisDeAdicao() {
    const modalGerenciar = document.getElementById('modalGerenciarResponsaveis');
    carregarResponsaveis();
    modalGerenciar.style.display = 'flex';
    
    // Quando fechar o modal de gerenciar, recarregar a lista do modal de adição
    const originalFechar = window.fecharGerenciarResponsaveis;
    window.fecharGerenciarResponsaveis = function(event) {
        originalFechar(event);
        if (document.getElementById('modalAdicao').style.display === 'flex') {
            carregarResponsaveisAdicao();
        }
    };
}
