from flask import Blueprint, request, jsonify
from services.task_service import TaskService

task_blueprint = Blueprint("task", __name__)
task_service = TaskService()

@task_blueprint.route("/tasks", methods=["POST"])
def submit():
    data = request.json
    title = data.get("title")
    description = data.get("description")
    task = task_service.create_task(title, description)
    
    if not title or not description:
        return jsonify({'error': 'Missing required fields'}), 400
    
    task = task_service.create_task(title, description)
    return jsonify(task.serialize()), 201

@task_blueprint.route("/tasks", methods=["GET"])
def get_task(task_id):
    task = task_service.get_tasks(task_id)
    if task:
        return jsonify(task.serialize()), 200
    else:
        return jsonify({'error': 'Task not found'}), 404
    
@task_blueprint.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.json
    title = data.get("title")
    description = data.get("description")
    if not title or not description:
        return jsonify({'error': 'Missing required fields'}), 400
    
    if task_service.update_task(task_id, title, description):
        task = task_service.get_tasks(task_id)
        return jsonify(task.serialize()), 200
    else:
        return jsonify({'error': 'Task not found'}), 404
    
@task_blueprint.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    if task_service.delete_task(task_id):
        return '', 204
    else:
        return jsonify({'error': 'Task not found'}), 404