from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from app.services.cadastro_service import CadastroService
from app.utils.auth_util import authenticate_user

blueprint = Blueprint('blueprint',__name__)

@blueprint.route('/cadastrarItem',methods=['POST','GET'])
@authenticate_user
def cadastrarItem():

    if request.method == 'POST':

        # Daqui -->    
        nome_produto = request.form.get('produto_nome')
        codigo_de_barras = request.form.get('codigo_de_barras')     
        lote = request.form.get('lote', '')
        validade = request.form.get('validade')
        categoria = request.form.get('categoria', '')
        modo_rapido = request.form.get('modo_rapido') == 'on'
        caminho_imagem = request.form.get('image_path')
        # Até aqui <-- Pegamos os dados do formulário de cadastro

        # Neste trecho pegamos a quantidade e verificamos se a quantidade é um número válido e se é maior que zero
        try:
            quantidade = int(request.form.get('quantidade', 0))
        except ValueError:
            flash("A quantidade deve ser um número válido.", 'erro')
            return redirect(url_for('blueprint.cadastrarItem'))

        responsavel_atual = session.get('nome')  # Pegamos o nome do usuário logado

        # Tentamos enviar os dados para o serviço de cadastro, caso ocorra algum erro, exibimos uma mensagem de erro para o suário
        try:
            formulario = CadastroService.adicionar_produto(nome_produto, codigo_de_barras, quantidade, lote, validade, categoria, modo_rapido, caminho_imagem, responsavel_atual)
            flash(formulario, 'sucesso')
        except Exception as e:
            flash(f"Erro ao cadastrar o produto: {str(e)}", 'erro')

        return redirect(url_for('blueprint.cadastrarItem'))#da um return para a rota de cadastro, para que o usuário possa cadastrar outro produto

    return render_template('cadastro/cadastrar.html')#carrega nosso template