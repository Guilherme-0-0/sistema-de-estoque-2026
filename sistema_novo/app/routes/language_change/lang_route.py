from flask import Blueprint, session, redirect, request, url_for

lang_bp = Blueprint('lang_bp', __name__) #nomeamos o blueprint como lang_bp, e passamos o nome do arquivo atual como segundo argumento
@lang_bp.route('/change_language/<lang_code>') #criamos a rota para mudar o idioma, onde <lang_code> é o código do idioma que queremos mudar
def change_language(lang_status): #a função change_language recebe o código do idioma como parâmetro

    if lang_status in ['en', 'pt']: #verificamos se o código do idioma é válido, ou seja, se é 'en' ou 'pt'
        session['lang'] = lang_status #se for válido, armazenamos o código do idioma na sessão, para que possamos usá-lo em outras partes do aplicativo
    else:
        session['lang'] = 'pt' #se não for válido, armazenamos 'pt' como idioma padrão na sessão
    return redirect(request.referrer or url_for('home')) #redirecionamos o usuário de volta para a página anterior (request.referrer)
                                                         #ou para a página inicial (url_for('home')) caso não haja uma página anterior.
                                                         #mas por padrão a pagina anterior será a atual usamos o "referrer" por que o usuário
                                                         #clica em um botão para mudar o idioma alterando o estado da página anterior