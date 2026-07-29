from app.services.login_service import AuthService
from flask import session, redirect, url_for, request, flash
from functools import wraps

"""
    DECORATOR DE AUTENTICAÇÃO E PERMISSÃO
    
    1. @wraps(f): Preserva a 'identidade' da função original f (nome, docstrings).
       SEM ELE: O Flask renomeia todas as rotas para 'decorated_function',
       causando conflito de endpoints (AssertionError) no servidor.
       
    2. *args, **kwargs: Permite que o decorator seja genérico e funcione em
       qualquer rota, independentemente de ela receber parâmetros na URL
       (ex: /editar/<id>) ou não.

    3. Professor, o senhor tem razão no ponto de que o decorator
      adiciona uma camada a mais na pilha de execução do Python em comparação a uma chamada direta.
      Porém, optei por esse padrão para seguir o princípio da Programação Orientada a Aspectos (AOP)
      e o padrão do próprio Flask (como o @login_required). Isso isola a responsabilidade da segurança
      fora da regra de negócio da rota e garante que o código fique mais limpo.
    """

def authenticate_user(f): #função que é o nosso decorador, chamamos com o nome dela @authenticate_user

    @wraps(f) #aqui estamos preservando a identidade da função original f(é o parametro da função que authenticate_user recebe)

    def decorated_function(*args, **kwargs): #aqui criamos a função decorado que vai encapsular a função original f, e recebemos os parametros que a função original recebe
        if 'nome' not in session or 'funcao' not in session or 'logado' not in session: #verificamos se a sessão do usuário está ativa, se não estiver, redirecionamos para a página de login
            flash("Sessão não encontrada. Por favor, faça login.", "blocked") #damos um aviso com flash caso a sessão não esteja ativa
            return redirect(url_for('blueprint.login')) #redirecionamos para a página de login

        # Aqui verificamos se o usuário tem permissão para acessar a rota atual, chamando a função verificar_sessao da classe AuthService
        teste_de_sessao = AuthService.verificar_sessao(session.get('funcao'), session.get('logado'), request.endpoint)
        if teste_de_sessao is True:
            return f(*args, **kwargs) # se o teste de sessão for verdadeiro, chamamos a função original f com os parametros que ela recebe
        else:
            #caso contrário , damos um aviso com flash e redirecionamos para a página de login
            flash("Você não tem permissão para acessar esta página.", "notallowed")
            return redirect(url_for('blueprint.login'))
    return decorated_function #retorna a função decorado, se não fossse feito isso authenticate_user retornaria nada e o flask daria erro


