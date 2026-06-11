from app.database.DB_connection import create_connection, conn_close


class CadastroEstoque:
        @staticmethod
        def cadastrar_produto(nome_produto, codigo_de_barras, quantidade, lote, validade_int, validade_texto, imagem_caminho, categoria):
                conn = create_connection()
                cursor = conn.cursor()
                try:
                    cursor.execute('''
                        INSERT INTO estoque (nome_produto, codigo_de_barras, quantidade, lote, validade_int, validade_texto, imagem_caminho, categoria)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (nome_produto, codigo_de_barras, quantidade, lote, validade_int, validade_texto, imagem_caminho, categoria))
                    conn_close(conn)
                except Exception as e:
                    print(f"Error occurred while registering product: {e}")
                    conn.rollback()
                finally:
                    conn_close(conn)

        @staticmethod
        def retirar_produto(nome_produto, codigo_de_barras, quantidade):
                conn = create_connection()
                cursor = conn.cursor()
                try:
                    cursor.execute('''
                        UPDATE estoque
                        SET quantidade = quantidade - ?
                        WHERE nome_produto = ? AND codigo_de_barras = ?
                    ''', (quantidade, nome_produto, codigo_de_barras))
                    conn_close(conn)
                except Exception as e:
                    print(f"Error occurred while removing quantity: {e}")
                    conn.rollback()
                finally:
                    conn_close(conn)

        @staticmethod
        def adicionar_quantidade(codigo_de_barras, quantidade, validade_text):
                conn = create_connection()
                cursor = conn.cursor()
                try:
                    cursor.execute('''
                        UPDATE estoque
                        SET quantidade = quantidade + ?
                        WHERE codigo_de_barras = ? AND validade_text = ?
                    ''', (quantidade, codigo_de_barras, validade_text))
                    conn_close(conn)
                except Exception as e:
                    print(f"Error occurred while adding quantity: {e}")
                    conn.rollback()
                finally:
                    conn_close(conn)