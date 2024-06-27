from flask import Flask, request, jsonify, g
import sqlite3

app = Flask(__name__)
DATABASE = 'db_to_do_list.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.route('/tasks', methods=['GET'])
def get_tasks():
    cur = get_db().cursor()
    cur.execute("SELECT * FROM tasks")
    tasks = cur.fetchall()
    return jsonify(tasks)

@app.route('/tasks', methods=['POST'])
def add_task():
    task_data = request.json
    name = task_data.get('name')
    date = task_data.get('date')
    time = task_data.get('time')
    description = task_data.get('description')
    day = task_data.get('day')
    
    db = get_db()
    cur = db.cursor()
    cur.execute("INSERT INTO tasks (name, date, time, description, day) VALUES (?, ?, ?, ?, ?)",
                (name, date, time, description, day))
    db.commit()
    return jsonify({"status": "Task added"}), 201

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    db = get_db()
    cur = db.cursor()
    cur.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    db.commit()
    return jsonify({"status": "Task deleted"}), 200

if __name__ == '__main__':
    app.run(debug=True)
