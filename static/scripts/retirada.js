// Funcionalidades da página de retirada
document.addEventListener('DOMContentLoaded', function() {
    const codigoInput = document.getElementById('codigo');
    const validadeInput = document.getElementById('validade');
    const campoBarra = document.getElementById('campo-barra');
    const campoValidade = document.getElementById('campo-validade');

    // Garante que o input de código sempre permaneça selecionado
    if (campoBarra.style.display !== 'none') {
        window.addEventListener('load', () => codigoInput.focus());
        document.addEventListener('click', () => {
            if (campoBarra.style.display !== 'none') {
                codigoInput.focus();
            }
        });
    }

    // Ao pressionar Enter no campo de código
    codigoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const codigo = codigoInput.value.trim();
            if (!codigo) return;

            // Busca opções de validade no servidor via AJAX
            fetch(`/api/produtos_por_codigo?codigo=${encodeURIComponent(codigo)}`)
                .then(resp => {
                    if (!resp.ok) throw new Error('Erro ao consultar produtos');
                    return resp.json();
                })
                .then(data => {
                    // data = lista de objetos {id, produto_nome, validade_text, quantidade, lote}
                    const container = document.getElementById('validade-options');
                    container.innerHTML = '';
                    // product preview
                    const preview = document.getElementById('product-preview');
                    const previewImg = document.getElementById('preview-img');
                    const previewName = document.getElementById('preview-name');
                    const previewExtra = document.getElementById('preview-extra');

                    if (!data || data.length === 0) {
                        // hide preview
                        if (preview) preview.style.display = 'none';
                        container.innerHTML = `<div class="error-message" role="status">\n                          <i class="bi bi-exclamation-triangle"></i> ${'Nenhum produto encontrado ou sem estoque.'}\n                        </div>`;
                    } else {
                        // populate preview using first returned item
                        const first = data[0];
                        if (previewName) previewName.textContent = first.produto_nome || '';
                        if (previewExtra) previewExtra.textContent = first.lote ? `Lote: ${first.lote}` : (first.produto_nome ? '' : '');
                        if (previewImg) {
                            if (first.image_path) {
                                let src = first.image_path.trim();
                                if (!src.startsWith('http') && !src.startsWith('/')) {
                                    src = '/static/img/' + src;
                                }
                                previewImg.src = src;
                                previewImg.alt = first.produto_nome || 'Produto';
                                previewImg.style.display = '';
                            } else {
                                previewImg.style.display = 'none';
                            }
                        }
                        if (preview) preview.style.display = 'flex';

                        // Para cada entrada distinta de validade, cria um botão
                        data.forEach(item => {
                            const btn = document.createElement('button');
                            btn.type = 'button';
                            btn.className = 'validade-btn';
                            btn.setAttribute('data-id', item.id);
                            btn.setAttribute('aria-label', `${item.produto_nome} - ${item.validade_text} - ${item.quantidade} unidades`);
                            btn.innerHTML = `<div class="btn-title">${item.validade_text}</div><div class="btn-sub">${item.quantidade || 0} ${'unidades'}</div>`;
                            btn.addEventListener('click', () => {
                                // Redireciona para a rota de retirada com o id específico
                                window.location.href = `/retirada_estoque/${item.id}`;
                            });
                            container.appendChild(btn);
                        });
                    }

                    // Mostra a área de opções e esconde o scanner
                    campoBarra.style.display = 'none';
                    campoValidade.style.display = 'block';
                })
                .catch(err => {
                    console.error(err);
                    alert('Erro ao buscar produtos.');
                });
            }
        });

    // Animação do ícone de scanner
    const scannerIcon = document.querySelector('.scanner-icon i');
    
    function startScanAnimation() {
        scannerIcon.style.color = 'var(--accent)';
        setTimeout(() => { scannerIcon.style.color = 'var(--accent-700)'; }, 200);
    }

    // Inicia a animação quando digitar no campo
    codigoInput.addEventListener('input', startScanAnimation);

    // Validação do formulário
    document.getElementById('form-retirada').addEventListener('submit', function(e) {
        // O envio direto não é mais usado nessa tela (navegamos para /retirada_estoque/<id>).
        // Mantemos validação básica para quem ainda use o fluxo antigo.
        const codigo = codigoInput.value.trim();
        if (!codigo) {
            e.preventDefault();
            alert('Por favor, escaneie ou digite o código de barras.');
            codigoInput.focus();
            return;
        }
    });

    // Voltar: mostra novamente o campo do código
    const voltarBtn = document.getElementById('voltar-btn');
    if (voltarBtn) {
        voltarBtn.addEventListener('click', () => {
            campoValidade.style.display = 'none';
            campoBarra.style.display = 'block';
            codigoInput.value = '';
            codigoInput.focus();
            const preview = document.getElementById('product-preview');
            if (preview) preview.style.display = 'none';
        });
    }
});
