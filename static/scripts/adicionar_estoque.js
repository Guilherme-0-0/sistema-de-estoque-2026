// Dicionário completo que mapeia o NOME DO PRODUTO (em minúsculas, usado para a busca) 
// para o NOME DO ARQUIVO da imagem (usado para o caminho).
const MAPA_IMAGENS_PRODUTOS = {
    // --------------------------------------------------------------------------------
    // LISTA COMPLETA DOS PRODUTOS
    // --------------------------------------------------------------------------------
    "abóbora": "abobora.webp",
    "açúcar": "acucar.webp",
    "alface": "alface.jpg",
    "alho": "alho.jpg",
    "arroz": "arroz.jpg",
    "banana": "banana.jpg",
    "batata": "batata.jpeg",
    "batata doce": "batata_doce.jpeg",
    "bolacha maizena": "bolacha_maizena.jpeg",
    "bolacha salgada": "bolacha_salgada.jpg",
    "pão": "pao.png",
    "pão de forma": "pao_de_forma.jpg",
    "leite": "leite.jpeg",
    "café": "cafe.jpg",
    "feijão": "feijao.jpg",
    "carne bovina": "carne_bovina.webp",
    "carne de frango": "carne_frangi.jpeg",
    "peixe": "carne_peixe.jpg",
    "carne de porco": "carne_porco.jpg",
    "cebola": "cebola.jpeg",
    "cenoura": "cenoura.jpeg",
    "cereal": "cereal.webp",
    "cheiro verde": "cheiro_verde.webp",
    "couve": "couve.jpeg",
    "ervilha": "ervilha.webp",
    "farinha de fubá": "farinha_fuba.jpg",
    "farinha de trigo": "farinha_trigo.jpeg",
    "iogurte": "iogurte.jpeg",
    "laranja": "laranja.jpeg",
    "maçã": "maca.jpg",
    "macarrão": "macarrao.jpeg",
    "mamão": "mamao.jpeg",
    "mandioca": "mandioca.jpeg",
    "placeholder": "placeholder_generico.png" ,
    "coca cola": "coca.jpg",
};

const FALLBACK_IMAGE_NAME = "placeholder_generico.png"; 

// Variável que armazena o caminho base, lido do HTML após o Flask processar url_for
let IMAGE_BASE_URL = ''; 

// ====================================================================
// FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO E LÓGICA
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos do Formulário
    const formAdicionarProduto = document.getElementById('form-adicionar-produto');
    const inputProdutoNome = document.getElementById('produto_nome');
    const inputProdutoTipo = document.getElementById('produto_tipo');
    const inputValidade = document.getElementById('validade');
    const validadeBtn = document.getElementById('validade-btn');
    const datalistTiposProduto = document.getElementById('lista-tipos-produto');
    const inputCodigoBarras = document.getElementById('codigo_de_barras');
    const inputQuantidade = document.getElementById('quantidade');
    const inputLote = document.getElementById('lote');
    const inputImagePath = document.getElementById('image_path');
    const inputCategoria = document.getElementById('categoria');
    
    // Elementos do modo rápido
    const checkboxModoRapido = document.getElementById('modo_rapido_toggle');
    const hiddenModoRapido = document.getElementById('modo_rapido');
    const camposCompletos = document.querySelectorAll('.campo-completo');
    
    // Elemento que contém o caminho base gerado pelo Flask/url_for
    const baseUrlElement = document.getElementById('image-base-url');

    // 2. LER O CAMINHO BASE CORRETO INJETADO PELO FLASK E NORMALIZAR
    if (baseUrlElement) {
        // Pega o valor injetado pelo Flask no atributo data-url
        IMAGE_BASE_URL = baseUrlElement.dataset.url; 
        
        // CORREÇÃO CRUCIAL: Garante que a URL base termine com barra
        if (IMAGE_BASE_URL && !IMAGE_BASE_URL.endsWith('/')) {
            IMAGE_BASE_URL += '/';
        }
    } else {
        // console.error("Elemento #image-base-url não encontrado. O preview de imagem não funcionará."); // Mensagem de erro não mais necessária
    }
    
    // 3. POPULA O DATALIST DE TIPOS DE PRODUTO (Sugestões)
    Object.keys(MAPA_IMAGENS_PRODUTOS).forEach(tipoProduto => {
        // Exclui o placeholder da lista de sugestões
        if (tipoProduto === "placeholder") return;
        
        const option = document.createElement('option');
        // Capitaliza a primeira letra de cada palavra para a visualização
        const tipoFormatado = tipoProduto.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        option.value = tipoFormatado;
        datalistTiposProduto.appendChild(option);
    });

    // 3.5. FUNÇÃO PARA TOGGLE DO MODO RÁPIDO
    function toggleModoRapido() {
        const modoRapidoAtivo = checkboxModoRapido.checked;
        
        // Atualiza o campo hidden
        hiddenModoRapido.value = modoRapidoAtivo ? 'on' : 'off';
        
        // Mostra/oculta campos completos
        camposCompletos.forEach(campo => {
            if (modoRapidoAtivo) {
                campo.style.display = 'none';
                // Remove required dos campos ocultos
                const inputs = campo.querySelectorAll('input, select');
                inputs.forEach(input => {
                    input.removeAttribute('required');
                });
            } else {
                campo.style.display = '';
                // Restaura required nos campos que originalmente tinham
                const inputNome = campo.querySelector('#produto_nome');
                const inputTipo = campo.querySelector('#produto_tipo');
                const inputCategoria = campo.querySelector('#categoria');
                
                if (inputNome) inputNome.setAttribute('required', '');
                if (inputTipo) inputTipo.setAttribute('required', '');
                if (inputCategoria) inputCategoria.setAttribute('required', '');
            }
        });
    }
    
    // Listener para o checkbox de modo rápido
    if (checkboxModoRapido) {
        checkboxModoRapido.addEventListener('change', toggleModoRapido);
    }

    // 4. Funções de Validação e UX

    function validateBarcode() {
        const value = inputCodigoBarras.value;
        const isValid = /^\d{8,13}$/.test(value); // Códigos de barras têm entre 8 e 13 dígitos
        
        if (!isValid) {
            inputCodigoBarras.setCustomValidity("O código de barras deve ter entre 8 e 13 dígitos.");
        } else {
            inputCodigoBarras.setCustomValidity("");
        }
        return isValid;
    }

    function validateQuantity() {
        const value = parseInt(inputQuantidade.value);
        const maxQuantity = 9999; // Exemplo de quantidade máxima
        
        if (value <= 0) {
            inputQuantidade.setCustomValidity("A quantidade deve ser maior que zero.");
            return false;
        } else if (value > maxQuantity) {
            inputQuantidade.setCustomValidity(`A quantidade não pode ser maior que ${maxQuantity}.`);
            return false;
        } else {
            inputQuantidade.setCustomValidity("");
            return true;
        }
    }

    function validateLote() {
        const value = inputLote.value.trim();
        const isValid = /^[A-Za-z0-9]{1,10}$/.test(value); // Exemplo: alfanumérico, máximo 10 caracteres
        
        if (!isValid && value !== "") { // Permite vazio, mas se preenchido deve ser válido
            inputLote.setCustomValidity("O lote deve conter apenas letras e números, máximo 10 caracteres.");
            return false;
        } else {
            inputLote.setCustomValidity("");
            return true;
        }
    }

    function validateExpiryDate(event) {
        if (!inputValidade.value) {
            inputValidade.setCustomValidity("");
            return true;
        }

        // Lembre-se: T00:00:00 é necessário para garantir que a data seja tratada como início do dia
        const selectedDate = new Date(inputValidade.value + "T00:00:00"); 
        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        if (selectedDate < today) {
            if (event && event.type === 'submit') {
                event.preventDefault();
            }
            inputValidade.setCustomValidity("A data de validade não pode ser anterior à data de hoje.");
            inputValidade.reportValidity(); 
            return false;
        } else {
            inputValidade.setCustomValidity("");
            return true;
        }
    }

    function updateImagePathAndPreview() {
        // Normaliza a entrada do usuário para minusculas, tirando espaços extras
        const selectedType = inputProdutoTipo.value.trim().toLowerCase();
        
        // 1. Encontra o nome do arquivo baseado no tipo do produto, ou usa o fallback
        const nomeDoArquivo = MAPA_IMAGENS_PRODUTOS[selectedType] || FALLBACK_IMAGE_NAME;
        
        // 2. Salva APENAS o nome do arquivo no campo oculto (Isso é o que vai para o Flask)
        inputImagePath.value = nomeDoArquivo;
        
        // 3. Atualiza a prévia da imagem
        const imagePreview = document.getElementById('image-preview');
        const previewPlaceholder = document.getElementById('image-preview-placeholder');
        
        if (IMAGE_BASE_URL) {
            const imageUrl = IMAGE_BASE_URL + nomeDoArquivo;
            
            // Testa se a imagem existe antes de mostrar
            fetch(imageUrl, { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        imagePreview.src = imageUrl;
                        imagePreview.classList.remove('hidden');
                        previewPlaceholder.classList.add('hidden');
                    } else {
                        throw new Error('Imagem não encontrada');
                    }
                })
                .catch(error => {
                    console.error('Erro ao carregar imagem:', error);
                    imagePreview.classList.add('hidden');
                    previewPlaceholder.classList.remove('hidden');
                    previewPlaceholder.textContent = 'Imagem não disponível para este produto';
                });
        }
    }


    // 5. Listeners de Evento

    // Dispara a atualização do campo oculto do caminho da imagem sempre que o tipo do produto muda
    inputProdutoTipo.addEventListener('input', updateImagePathAndPreview);
    inputProdutoTipo.addEventListener('change', updateImagePathAndPreview);
    
    // REMOVIDO: validação automática no change que causava o bug de digitação
    // inputValidade.addEventListener('change', validateExpiryDate);

    // Botão do calendário: abre o seletor de data nativo
    if (validadeBtn && inputValidade) {
        validadeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Tenta usar showPicker() quando disponível (Chrome/Edge modernos)
            if (typeof inputValidade.showPicker === 'function') {
                try {
                    inputValidade.showPicker();
                    return;
                } catch (err) {
                    console.log('showPicker() falhou, usando fallback:', err);
                }
            }
            
            // Fallback: remove temporariamente readonly (se houver), foca e dispara clique
            const wasReadOnly = inputValidade.readOnly;
            inputValidade.readOnly = false;
            inputValidade.focus();
            
            // Pequeno delay para garantir que o navegador processe o foco antes do click
            setTimeout(() => {
                try { 
                    inputValidade.click(); 
                } catch (err) { 
                    console.log('Click fallback falhou:', err); 
                }
                // Restaura readonly se estava ativo (não usado mais, mas por precaução)
                if (wasReadOnly) inputValidade.readOnly = false;
            }, 50);
        });
    }

    // Adiciona validação em tempo real
    inputCodigoBarras.addEventListener('input', validateBarcode);
    inputQuantidade.addEventListener('input', validateQuantity);
    inputLote.addEventListener('input', validateLote);

    formAdicionarProduto.addEventListener('submit', (event) => {
        // Garante que o caminho da imagem esteja atualizado antes do envio
        updateImagePathAndPreview(); 
        
        // Valida todos os campos antes do envio
        if (!validateExpiryDate(event) || 
            !validateBarcode() || 
            !validateQuantity() || 
            !validateLote()) {
            event.preventDefault();
            return;
        }
        
        // Converte a data do formato ISO (YYYY-MM-DD) para formato brasileiro (DD/MM/YYYY)
        if (inputValidade && inputValidade.value) {
            const dataISO = inputValidade.value; // ex: "2025-10-29"
            const [ano, mes, dia] = dataISO.split('-');
            const dataBrasileira = `${dia}/${mes}/${ano}`; // ex: "29/10/2025"
            
            // Cria um input hidden temporário com a data no formato brasileiro
            const hiddenDateInput = document.createElement('input');
            hiddenDateInput.type = 'hidden';
            hiddenDateInput.name = 'validade';
            hiddenDateInput.value = dataBrasileira;
            formAdicionarProduto.appendChild(hiddenDateInput);
            
            // Remove o name do input original para não enviar dois valores
            inputValidade.removeAttribute('name');
        }
    });

    // Inicialização do campo oculto ao carregar a página
    updateImagePathAndPreview();
    validateExpiryDate();
});
