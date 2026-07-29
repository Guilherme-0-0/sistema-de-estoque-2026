from flask import session, redirect, url_for
from app.models.usuario_model import UsuarioModel
from werkzeug.security import check_password_hash

class LoginService:

    @staticmethod
    def logar_sessao(nome, senha): #função para logar a sessão do usuário com senha e usuário
        try:
            hashBanco = UsuarioModel.EnviarSenha(nome)
            logado = False
            if hashBanco is not None and check_password_hash(hashBanco,senha):
                session['nome'] = nome
                session['funcao'] = UsuarioModel.EnviarFuncao(nome)
                session['logado'] = True
                return True
        except Exception as e:
            print(f"Erro ao logar: {e}")
            return 'Erro ao logar: ' + str(e)

class AuthService:
    @staticmethod
    def verificar_sessao(funcao, logado, endpoint_atual):
        if not logado:
            return redirect(url_for('blueprint.login'))
        else:
            PERMISSOES = {
                'comum': ["blueprint.home", "blueprint.retirarItem"],
                'cadastro': ["blueprint.home", "blueprint.cadastrarItem", "blueprint.retirarItem", "blueprint.historico"],
                'admin': ["blueprint.adminHome", "blueprint.gerenciarUsuario", "blueprint.ativosSistema"]
            }
            if funcao is not None:
                paginaPermitida = PERMISSOES.get(funcao, [])
            if endpoint_atual in paginaPermitida:
                return True
            else:
                return False
        

            