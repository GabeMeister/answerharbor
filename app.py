# pylint: disable=C0111,C0103,C0111

from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
    return '<h1>Hello world!</h1>'

if __name__ == '__main__':
    app.run(debug=True)
