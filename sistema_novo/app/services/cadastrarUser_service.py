from flask import session, redirect, url_for, request
from app.models.usuario_model import UsuarioModel
from werkzeug.security import  generate_password_hash

class CadastrarUserService:
    @staticmethod
    def cadastrar_usuario(nome, senha, funcao):
        # Gera o hash da senha antes de armazená-la no banco de dados
        senha_hash = generate_password_hash(senha, method='pbkdf2:sha256', salt_length=16)
        UsuarioModel.cadastrar_usuario(nome, senha_hash, funcao)