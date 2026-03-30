#!/usr/bin/env python3
"""Script simples para popular o banco sqlite usado pelo app.

Gera ~20 itens aleatórios e um item especial para testar o scanner.
Execute: python3 scripts/seed_db.py
"""
import sqlite3
import random
import time
from datetime import datetime

DB_PATH = 'banco.db'

N_RANDOM = 20

# Dicionário que mapeia tipos de produtos para seus nomes de arquivo de imagem
# (Baseado no MAPA_IMAGENS_PRODUTOS do adicionar_estoque.js)
MAPA_IMAGENS = {
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
    "leite": "leite.jpeg",
    "café": "cafe.png",
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
}

# Lista de produtos com suas respectivas imagens
PRODUCT_DATA = [
    ("Arroz Tipo 1", "arroz", 1),
    ("Feijão Carioca", "feijão", 1),
    ("Açúcar Cristal", "açúcar", 1),
    ("Macarrão Espaguete", "macarrão", 1),
    ("Farinha de Trigo", "farinha de trigo", 1),
    ("Farinha de Fubá", "farinha de fubá", 1),
    ("Leite Longa Vida", "leite", 2),
    ("Café Torrado", "café", 1),
    ("Pão de Forma", "pão", 1),
    ("Bolacha Maizena", "bolacha maizena", 1),
    ("Bolacha Salgada", "bolacha salgada", 1),
    ("Cereal Matinal", "cereal", 1),
    ("Iogurte Natural", "iogurte", 2),
    ("Carne Bovina Kg", "carne bovina", 3),
    ("Carne de Frango Kg", "carne de frango", 3),
    ("Peixe Kg", "peixe", 3),
    ("Carne de Porco Kg", "carne de porco", 3),
    ("Banana Kg", "banana", 4),
    ("Maçã Kg", "maçã", 4),
    ("Laranja Kg", "laranja", 4),
    ("Mamão Kg", "mamão", 4),
    ("Cenoura Kg", "cenoura", 4),
    ("Batata Kg", "batata", 4),
    ("Batata Doce Kg", "batata doce", 4),
    ("Cebola Kg", "cebola", 4),
    ("Alho Kg", "alho", 4),
    ("Abóbora Kg", "abóbora", 4),
    ("Alface Unidade", "alface", 4),
    ("Couve Maço", "couve", 4),
    ("Cheiro Verde Maço", "cheiro verde", 4),
    ("Mandioca Kg", "mandioca", 4),
    ("Ervilha Lata", "ervilha", 1),
]

def parse_date_ddmmyyyy(s):
    # aceita formatos como '12/12/2025' ou '2025-12-12'
    try:
        if '/' in s:
            d = datetime.strptime(s, '%d/%m/%Y')
        else:
            d = datetime.strptime(s, '%Y-%m-%d')
        return int(d.timestamp()), d.strftime('%d/%m/%Y')
    except Exception:
        return None, None

def ensure_tables(conn):
    cur = conn.cursor()
    cur.execute('''CREATE TABLE IF NOT EXISTS estoque(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo_de_barras TEXT NOT NULL,
        lote TEXT NOT NULL,
        validade_int INTEGER NOT NULL,
        validade_text TEXT NOT NULL,
        produto_nome TEXT NOT NULL,
        quantidade INTEGER,
        image_path TEXT,
        categoria INTEGER NOT NULL
    )''')
    cur.execute('''CREATE TABLE IF NOT EXISTS movimentacao (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        product_barcode TEXT NOT NULL,
        name TEXT NOT NULL,
        action TEXT NOT NULL,
        quantidade INTEGER NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES estoque(id)
    )''')
    conn.commit()

def insert_random_items(conn, n=N_RANDOM):
    """Insere n itens aleatórios no estoque com imagens correspondentes."""
    cur = conn.cursor()
    inserted = 0
    
    for i in range(n):
        # Escolhe um produto aleatório da lista
        product_name, product_type_key, categoria = random.choice(PRODUCT_DATA)
        
        # Adiciona variação opcional no nome (lote, marca fictícia, etc)
        if random.random() < 0.3:  # 30% de chance de adicionar variação
            variations = [' Premium', ' Especial', ' Orgânico', ' Light', ' Diet']
            product_name += random.choice(variations)
        
        # Gerador simples de códigos EAN-13-like (não garantido válidos)
        barcode = ''.join(str(random.randint(0,9)) for _ in range(13))
        lote = f'L{random.randint(10000,99999)}'
        
        # Validade entre 30 dias e 2 anos
        days = random.randint(30, 365*2)
        validade = datetime.now().timestamp() + days * 24*3600
        validade_int = int(validade)
        validade_text = datetime.fromtimestamp(validade_int).strftime('%d/%m/%Y')
        
        # Quantidade aleatória
        quantidade = random.randint(5, 200)
        
        # Obtém o caminho da imagem baseado no tipo do produto
        image_path = MAPA_IMAGENS.get(product_type_key, "placeholder_generico.png")

        cur.execute('''INSERT INTO estoque (codigo_de_barras, lote, validade_int, validade_text, produto_nome, quantidade, image_path, categoria)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
                    (barcode, lote, validade_int, validade_text, product_name, quantidade, image_path, categoria))
        inserted += 1

    conn.commit()
    return inserted

def insert_demo_item(conn):
    """Insere um item demo especial para testes de scanner."""
    cur = conn.cursor()
    # Demo item especificado pelo usuário
    demo_barcode = '7896806400099'
    demo_lote = 'L456732'
    demo_validade = '12/12/2025'
    validade_int, validade_text = parse_date_ddmmyyyy(demo_validade)
    if validade_int is None:
        # fallback para timestamp de hoje
        validade_int = int(time.time())
        validade_text = demo_validade

    # prevenir duplicação: checa se já existe barcode+lote
    cur.execute('SELECT id FROM estoque WHERE codigo_de_barras = ? AND lote = ?', (demo_barcode, demo_lote))
    if cur.fetchone():
        print('Item demo já existe — pulando inserção')
        return 0

    # Item demo com imagem de arroz
    demo_image = MAPA_IMAGENS.get('arroz', 'placeholder_generico.png')
    
    cur.execute('''INSERT INTO estoque (codigo_de_barras, lote, validade_int, validade_text, produto_nome, quantidade, image_path, categoria)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
                (demo_barcode, demo_lote, validade_int, validade_text, 'Produto Demo Scanner', 10, demo_image, 1))
    conn.commit()
    return 1

def main():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    ensure_tables(conn)
    n = insert_random_items(conn, N_RANDOM)
    print(f'Inseridos {n} itens aleatórios')
    d = insert_demo_item(conn)
    if d:
        print('Inserido item demo (scanner)')
    conn.close()

if __name__ == '__main__':
    main()
