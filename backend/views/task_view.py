from flask import jsonify

def task_response(task):
    response = {
        'status': 'success',
        'task': {
            'id': task.id,
            'name': task.name,
            'date': task.date,
            'time': task.time,
            'description': task.description
        }
    }
    return jsonify(response)