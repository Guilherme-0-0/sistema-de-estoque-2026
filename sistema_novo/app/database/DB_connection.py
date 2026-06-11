import sqlite3

Nome_banco_provisorio = "sistema_novo/app/database/S.G.E.db"


#cria a função de conexão com o banco de dados, utilizando o nome do banco definido na variável Nome_banco_provisorio
def create_connection():
    """ create a database connection to the SQLite database specified by db_file
    :param db_file: database file
    :return: Connection object or None
    """
    conn = None #cria a variavel de conexão e a inicializa como None
    try:
        #faz uma tentativa de conectar ao banco de dados 
        conn = sqlite3.connect(Nome_banco_provisorio)
        print("Connection to SQLite DB successful")
    except sqlite3.Error as e:
        #caso a conexão dê errado, o erro é capturado e impresso na tela
        print(f"Error connecting to database: {e}")
    return conn

#uma função simples para dar commit no banco e fechar a conexão
def conn_close(conn):
    if conn:
        conn.commit()
        conn.close()
        print("Connection closed successfully")