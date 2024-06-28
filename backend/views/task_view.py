from flask import jsonify

def task_response(task):
    response = {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "status": task.status
    }
    return jsonify(response)