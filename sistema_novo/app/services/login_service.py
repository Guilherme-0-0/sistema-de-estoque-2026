from flask import session, redirect, url_for

class LoginService:
    @staticmethod
    def pegar_sessao(): #função para pegar a sessão do usuário
        sessao = session.get('user') # Puxamos a sessão logada do usuário
        return sessao

    @staticmethod
    def verificar_sessao(): #função para verificar se o usuário está logado e sua função é correta
            return redirect(url_for('blueprint.landing_page'))