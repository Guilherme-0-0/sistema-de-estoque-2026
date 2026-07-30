from flask import Flask, session
from app.database.init_db import criar_tabelas, limpar_linhas_sem_quantidade
from app.utils.translations import translate

def create_app():
    
    app = Flask(__name__)
    """
    Módulo de inicialização do aplicativo.
    Este módulo é responsável por configurar o banco de dados, criar as tabelas necessárias e limpar quaisquer
    linhas inválidas do estoque. Ele é executado quando o aplicativo é iniciado para garantir que o ambiente esteja pronto para uso.
    """
    criar_tabelas()
    limpar_linhas_sem_quantidade()

    @app.context_processor #decorador para injetar variaveis no jinja2 de todos os htmls
    def inject_language():
        def t(key): #função que usamos para traduzir as chaves de tradução, onde t é a função que chamamos
                    # nos templates para traduzir as chaves
            current_language = session.get('lang', 'pt')  # Obtém o idioma atual da sessão, padrão para 'pt'

            return translate(key, current_language) # Utiliza a função do arquivo de traduções
                                                    # para descobrir a tradução da chave de acordo com
                                                    # o idioma atual 
                                                    
        return dict(t=t) #retornamos um dicionário com a função t para que ela esteja disponível nos templates
    return app

