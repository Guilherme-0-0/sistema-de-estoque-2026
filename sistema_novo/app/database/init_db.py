import sqlite3
#importa a nossa função de conexão com o banco de dados do módulo DB_connection
from app.database.DB_connection import create_connection

"""
Módulo para inicializar o banco de dados e criar as tabelas necessárias. 
Este módulo é responsável por criar as tabelas de usuários, estoque e histórico,
além de inserir os usuários padrão caso a tabela de usuários esteja vazia.
"""

#função para criar as tabelas do banco de dados
def criar_tabelas():
    conn = create_connection()#chamamos a função de conexão do modulo DB_connection

    if conn is not None:
        try:
            cursor = conn.cursor()#define o cursor para executar comandos SQL no banco de dados

            #LIGAR O PRAGMA PARA FKs FUNCIONAREM
            cursor.execute('PRAGMA foreign_keys = ON')#ligamos o pragma para garantir que as chaves estrangeiras funcionem corretamente

            # dentro das tabelas utilizamos propriedades do SQLite para definir os tipos de dados
            # como TEXT, INTEGER e DATETIME, 
            # e as restrições, como PRIMARY KEY, NOT NULL e FOREIGN KEY

            #tabela de usuarios
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS usuarios (
                    id INTEGER PRIMARY KEY AUTOINCREMENT, -- aqui vai o id do usuário
                    nome TEXT NOT NULL, -- aqui vai o nome do usuário
                    funcao TEXT NOT NULL, --aqui vai a função do usuário (ex: administrador, gerente de estoque, funcionário)
                    senha TEXT NOT NULL -- aqui vai o hash da senha do usuário
                    ''')# criamos  tabelas dos usuários, com id, nome, função e senha(hash)

            #tabela de estoque
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS estoque (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nome_produto TEXT NOT NULL,
                    codigo_de_barras TEXT NOT NULL,
                    quantidade INTEGER,
                    lote TEXT,
                    validade_int INTEGER NOT NULL,
                    validade_texto TEXT NOT NULL,
                    imagem_caminho TEXT,
                    categoria TEXT
                           '''       )# criamos a tabela de estoque, com id, nome do produto, código de barras, quantidade,
                                    # lote, validade (em formato inteiro e texto), caminho da imagem e categoria
            
            #tabela de histórico
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS historico (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nome_produto TEXT NOT NULL,
                    codigo_de_barras TEXT NOT NULL,
                    quantidade INTEGER,
                    lote TEXT,
                    categoria TEXT,
                    data_movimentacao DATETIME DEFAULT CURRENT_TIMESTAMP,
                    tipo_movimentacao TEXT NOT NULL,
                    responsavel TEXT NOT NULL,
                    FOREIGN KEY (nome_produto) REFERENCES estoque(nome_produto),
                    FOREIGN KEY (codigo_de_barras) REFERENCES estoque(codigo_de_barras)
                    FOREIGN KEY (responsavel) REFERENCES usuarios(nome)
                    ''')# criamos a tabela de histórico, com id, nome do produto, código de barras, quantidade, lote, categoria,
                        # data da movimentação, tipo da movimentação (entrada ou saída) e o responsável pela movimentação.
            
            #verifica se a abela usuarios está vazia, se sim, insere os usuários padrão
            cursor.execute('SELECT COUNT(*) FROM usuarios')
            if cursor.fetchone()[0] == 0:
                cursor.execute('''
                    INSERT INTO usuarios (nome, funcao) VALUES
                    ('Admin', 'Administrador'),
                    ('Estoque', 'Gerente de Estoque'),
                    ('Usuario1', 'Funcionário')
                ''')# criamos os usuários padrão, com nome e função, caso a tabela de usuários esteja vazia

            # faz um commit e fecha a conexão após uma verificação se tudo ocorreu corretamente
            conn.commit()
            print("Tabelas criadas com sucesso")
        except sqlite3.Error as e:
            print(f"Error creating tables: {e}")
        finally:
            conn.close()
    else:
        print("Error! cannot create the database connection.")




"""
Função para limpar linhas da tabela de estoque onde a quantidade é nula ou zero.
Essa função é útil para manter a integridade dos dados e evitar registros inválidos no estoque.
"""
def limpar_linhas_sem_quantidade():
    conn = create_connection() # criamos a conexão através de uma variavél
    if conn is not None:
        try:
            cursor = conn.cursor() #definimos o cursor para executar comandos SQL no banco de dados

            #fazemos uma limpa no banco, selecionando todos os itens com quantidade nula ou zero e deletando eles
            cursor.execute('DELETE FROM estoque WHERE quantidade IS NULL OR quantidade = 0')
            conn.commit()
            print("Linhas sem quantidade removidas com sucesso")
        except sqlite3.Error as e:
            print(f"Error cleaning up lines: {e}")
        finally:
            conn.close()

    else:
        print("Error! cannot create the database connection.")

