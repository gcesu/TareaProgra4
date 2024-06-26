from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__, static_folder='../frontend', static_url_path='')

tasks = []

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/add_task', methods=['POST'])
def add_task():
    task = request.json['task']
    tasks.append(task)
    return jsonify({'task': task})

@app.route('/get_tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

if __name__ == '__main__':
    app.run(debug=True)
