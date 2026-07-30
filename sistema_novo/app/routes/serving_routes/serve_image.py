from flask import Blueprint, abort, send_from_directory, current_app
from app.utils.imageProcessing_util import ImageProcessingUtil
import os

blueprint = Blueprint('serve_image', __name__) #definição do blueprint para servir imagens
@blueprint.route('/serve_image/<path:filename>')#criamos a rota para servir imagens, onde <path:filename> é o nome do arquivo de imagem que será servido
def serve_image(filename):

    #utilizamos a função process_image para verificar se a extensão do arquivo é permitida e para obter o tipo MIME correto
    is_allowed, mime_type_function = ImageProcessingUtil.process_image(filename)

    # Verifica se a extensão do arquivo é permitida
    if not is_allowed:
        return abort(400, description="Extensão de arquivo não permitida")  # Retorna um erro 400 se a extensão não for permitida

    #definimos a iamgem como o caminho do arquivo dentro da pasta static/images e procura pelo nome do arquivo passado na rota
    image = os.path.join(current_app.static_folder, 'images', filename)

    #verificamos se o arquivo existe no caminho especificado, caso não exista retornamos um erro 404
    if not os.path.isfile(image):
        return abort(404, description="Arquivo não encontrado")  # Retorna um erro 404 se o arquivo não for encontrado
    return send_from_directory(image, filename, mimetype=mime_type_function)  # Retorna o arquivo de imagem solicitado com o tipo MIME correto