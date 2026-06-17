from app.database.DB_connection import create_connection, conn_close


class MovimentacaoEstoque:
        @staticmethod
        def registrar_movimentacao(codigo_de_barras, quantidade, tipo_movimentacao, responsavel):
                conn = create_connection()
                cursor = conn.cursor()
                nome_produto = cursor.execute('SELECT nome FROM produtos WHERE codigo_de_barras = ?', (codigo_de_barras,)).fetchone()
                cursor.execute('''
                    INSERT INTO historico (nome_produto, codigo_de_barras, quantidade, tipo_movimentacao, responsavel)
                    VALUES (?, ?, ?, ?, ?)
                ''', (nome_produto, codigo_de_barras, quantidade, tipo_movimentacao, responsavel))
                conn_close(conn)
        @staticmethod
        def obter_historico():
                conn = create_connection()
                cursor = conn.cursor()
                cursor.execute('SELECT * FROM historico')
                historico = cursor.fetchall()
                conn_close(conn)
                return historico
        
#class MovimentacaoEstoqueComFiltro:
