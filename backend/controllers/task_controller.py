from flask import Blueprint, request, jsonify
from services.task_service import TaskService

task_blueprint = Blueprint("task", __name__)
task_service = TaskService()

@task_blueprint.route("/submit", methods=["POST"])
def submit():
    data = request.json
    name = data.get("name")
    date = data.get("date")
    time = data.get("time")
    description = data.get("description")
    day = data.get("day")
    
    if not name or not date or not time or not description:
        return jsonify({'error': 'Missing required fields'}), 400
    
    task = task_service.create_task(name, date, time, description)
    return jsonify(task.serialize()), 201

@task_blueprint.route("/task/tasks/<name>", methods=["GET"])
def get_task(name):
    task = task_service.get_task(name)
    if task:
        return jsonify(task.serialize())
    else:
        return jsonify({'error': 'Task not found'}), 404

@task_blueprint.route("/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.json
    name = data.get("name")
    date = data.get("date")
    time = data.get("time")
    description = data.get("description")

    if not name or not date or not time or not description:
        return jsonify({'error': 'Missing required fields'}), 400
    
    if task_service.update_task(task_id, name, date, time, description):
        task = task_service.get_task(task_id)
        return jsonify(task.serialize())
    else:
        return jsonify({'error': 'Task not found'}), 404

@task_blueprint.route("/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    if task_service.delete_task(task_id):
        return '', 204
    else:
        return jsonify({'error': 'Task not found'}), 404
