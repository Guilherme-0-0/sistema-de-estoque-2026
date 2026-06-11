from app.database.DB_connection import create_connection, conn_close

class ListarEstoque:
        @staticmethod
        def listar_estoque():
                conn = create_connection()
                cursor = conn.cursor()
                cursor.execute('SELECT * FROM estoque')
                produtos = cursor.fetchall()
                conn_close(conn)
                return produtos

#class ListarEstoqueComFiltro:
        @staticmethod