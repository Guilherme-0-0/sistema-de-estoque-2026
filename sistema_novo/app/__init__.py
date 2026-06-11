from flask import Flask
from app.database.init_db import criar_tabelas, limpar_linhas_sem_quantidade


def create_app():
    
    app = Flask(__name__)
    """
    Módulo de inicialização do aplicativo.
    Este módulo é responsável por configurar o banco de dados, criar as tabelas necessárias e limpar quaisquer
    linhas inválidas do estoque. Ele é executado quando o aplicativo é iniciado para garantir que o ambiente esteja pronto para uso.
    """
    criar_tabelas()
    limpar_linhas_sem_quantidade()

    return app

