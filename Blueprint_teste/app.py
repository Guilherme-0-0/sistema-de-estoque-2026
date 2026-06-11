#https://www.youtube.com/watch?v=m7rQBybbGQM

from flask import Flask
from routes.user import user_bp

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to the Home Page!"

#registrando o blueprint

app.register_blueprint(user_bp, url_prefix='/user')


if __name__ == '__main__':
    app.run(debug=True, port=5000)