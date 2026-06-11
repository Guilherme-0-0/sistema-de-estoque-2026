from flask import Blueprint

blueprint = Blueprint('blueprint',__name__)

@blueprint.route('/cadastrarItem',methods='POST,GET')