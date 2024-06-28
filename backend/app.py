from flask import Flask
from flask_cors import CORS
from controllers.task_controller import task_blueprint

app = Flask(__name__)
CORS(app)

app.register_blueprint(task_blueprint, url_prefix="/task")

if __name__ == "__main__":
    app.run(port=5000)