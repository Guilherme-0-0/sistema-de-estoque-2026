# MANUAL COMPLETO - Sistema de Estoque

## Sumário
- Visão Geral ........................................ 16
- Instalação & Execução .............................. 20
- Funcionalidades Principais ........................ 34
- Banco de Dados (Schema) ............................ 43
- Rotas / API (endpoints) ............................ 56
- Frontend (templates e assets) ...................... 76
- CSS: variáveis e estilos principais ................ 95
- Acessibilidade ..................................... 106
- Novas Funcionalidades ............................. 112
- Boas práticas e sugestões .......................... 127
- Arquivos importantes ............................... 135
- Sugestões rápidas aplicáveis agora .................. 142

## Visão Geral
Este projeto é um sistema simples de controle de estoque escrito em Flask (Python) com SQLite como banco de dados.
Objetivo: gerenciar entradas/saídas, histórico diário, exportação para Excel e interface acessível.

## Instalação & Execução
Requisitos:
- Python 3.10+
- pip
- Dependências: Flask, openpyxl

Passos:
1. clone o repositório
2. python -m venv .venv
3. source .venv/bin/activate
4. pip install -r requirements.txt  # se existir
5. flask init-db
6. flask run

## Funcionalidades Principais
- Login demo (admin/admin)
- Adição de produtos (modo rápido e completo)
- Retirada com confirmação e motivo
- Ajuste rápido de quantidade via botões (+/-)
- Histórico diário com filtro por período e exportação para Excel
- Exportação formatada (.xlsx) com cores por tipo de ação
- API para responsáveis (CRUD básico)

## Banco de Dados (Schema)
Tabelas principais:
- estoque:
  - id, codigo_de_barras, lote, validade_int, validade_text, produto_nome, quantidade, image_path, categoria
- movimentacao:
  - id, product_id, product_barcode, name, action, quantidade, motivo, timestamp
- responsaveis:
  - id, nome, criado_em

Observações:
- campo motivo foi adicionado em movimentacao (agrega informação do porquê)
- validade_int guarda timestamp (segundos desde epoch)

## Rotas / API (endpoints)
Principais rotas:
- GET/POST / (login)
- GET /usuario
- GET /home
- GET/POST /adicionar_produto
- GET/POST /retirada
- GET/POST /retirada_estoque/<produto_id>
- POST /api/adjust_quantity  (json)
- POST /api/retirar_com_motivo (json)
- POST /api/adicionar_com_motivo (json)
- GET /historico
- GET /exportar_historico
- GET/POST /api/responsaveis

Formato importante:
- /api/adjust_quantity espera JSON { product_id, action:'add' }
- /api/retirar_com_motivo aceita { product_id, quantidade, motivo } (motivo opcional)
- /api/adicionar_com_motivo aceita { product_id, quantidade, motivo } (motivo opcional)

## Frontend (templates e assets)
Templates principais:
- index.html (login)
- usuario.html (seletor de perfil)
- home.html (lista de produtos)
- adicionar_estoque.html (formulário de adição)
- retirar.html (scanner)
- retirar_estoque.html (detalhes e confirmação)
- historico.html (visão e filtros)

Assets:
- static/style/telainicial.css (estilos principais)
- static/img/ (imagens de produto)
- static/scripts/home.js (comportamento na home) [verificar existência]

Regras importantes:
- imagens servidas via /static/img/<filename> com validação de extensão
- templates usam a função t('chave') para tradução (inject_translation)

## CSS: variáveis e estilos principais
Variáveis CSS definidas (exemplos):
- --bg-1, --surface, --text-primary, --accent, --accent-hover, --border-default

Botões:
- action-btn[data-action="add"] -> gradiente verde
- action-btn[data-action="remove"] -> gradiente vermelho
- action-btn (info) -> gradiente azul

Responsividade:
- Mobile-first com @media para max-width:768px e 769-1100px

## Acessibilidade
- WCAG 2.1 AAA como objetivo
- Foco visível via outline de 3px e box-shadow
- Navegação por teclado, tooltips acessíveis (desabilitados em mobile)
- Tamanho mínimo de toque: 44-48px

## Novas Funcionalidades
1) Modal de confirmação na retirada
- Ajuste de quantidade no modal (+ / -)
- Campo motivo (aparece no histórico; agora opcional)
- Cancelar com ESC ou botão

2) Exportação para Excel (.xlsx)
- Arquivo por período com nome como historico_DDD-MM-YYYY.xlsx
- Cabeçalho verde com fonte branca; entradas em verde; saídas em vermelho
- Colunas: Data/Hora, Código de Barras, Produto, Ação, Quantidade, Motivo

3) Histórico diário
- Seletor de períodos (hoje, semana, mês, custom, all)
- Cada dia tratado como conjunto independente para exportação

## Boas práticas e sugestões
- Mover banco para app.instance_path para consistência (sqlite path)
- Usar SQLAlchemy para abstração e testes mais fáceis
- Criar um arquivo requirements.txt com dependências exatas
- Separar scripts JS por feature (home.js, historico.js)
- Validar/normalizar entradas no frontend antes de enviar
- Adicionar testes unitários para endpoints críticos

## Arquivos importantes
- app.py .............. lógica e rotas
- translations.py ...... dicionário de tradução
- static/style/telainicial.css
- templates/*.html ..... templates (views)
- NOVAS_FUNCIONALIDADES.md (descrição das features adicionadas)

## Sugestões rápidas aplicáveis agora (pequenas mudanças)
- Aceitar motivo vazio nas APIs de retirada/adição por modal
- Remover código morto na rota /retirada (após parse)
- Sanear nome de arquivo na exportação para evitar caracteres inválidos

Fim do manual.
