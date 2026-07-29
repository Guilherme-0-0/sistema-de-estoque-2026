from app.database.DB_connection import create_connection, conn_close

class UsuarioModel:
    @staticmethod
    def EnviarSenha(nome):
        conn = create_connection()
        cursor = conn.cursor()
        usuario = cursor.execute("SELECT senha FROM usuarios WHERE nome = ?", (nome,)).fetchone()
        conn_close(conn)
        return usuario
    
    @staticmethod
    def EnviarFuncao(nome):
        conn = create_connection()
        cursor = conn.cursor()
        funcao = cursor.execute("SELECT funcao FROM usuarios WHERE nome = ?", (nome,)).fetchone()
        conn_close(conn)
        return funcao

    @staticmethod
    def cadastrar_usuario(nome, senha, funcao):
        conn = create_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO usuarios (nome, senha, funcao) VALUES (?, ?, ?)", (nome, senha, funcao))
        conn_close(conn)