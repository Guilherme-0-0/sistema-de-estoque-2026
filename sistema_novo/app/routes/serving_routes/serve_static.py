from flask import Blueprint, abort, send_from_directory, current_app
import os

blueprint = Blueprint('serve_static', __name__)#definimos o blueprint para servir arquivos estáticos
@blueprint.route('/serve_static/<path:filename>')#criamos a rota para servir arquivos estáticos, onde <path:filename> é o nome do arquivo que será servido
def serve_static(filename):

    #definimos o caminho do arquivo estático dentro da pasta static e procuramos pelo nome do arquivo passado na rota
    static_file_path = os.path.join(current_app.static_folder, filename)

    #fazemos uma verificação rápida para garantir que o arquivo existe no caminho especificado, caso não exista retornamos um erro 404
    if not os.path.isfile(static_file_path):
        return abort(404, description="Arquivo não encontrado")  # Retorna um erro 404 se o arquivo não for encontrado
    
    return send_from_directory(current_app.static_folder, filename)  # Retorna o arquivo estático solicitado