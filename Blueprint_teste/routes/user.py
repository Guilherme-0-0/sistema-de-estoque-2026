from flask import Blueprint

user_bp = Blueprint('user', __name__, template_folder='templates')

@user_bp.route('/')
def index():
    return "Hello, User!"

@user_bp.route('/profile')
def profile():
    return "This is the user profile page."