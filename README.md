# Flask Practice Branch

This branch is a fresh start for practicing the Flask module.

## Getting Started

```bash
pip install flask
```

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello, Flask!'

if __name__ == '__main__':
    app.run(debug=True)
```
