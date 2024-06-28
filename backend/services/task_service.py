from models.task import Task

class TaskService:
    def __init__(self):
        self.tasks = []

    def create_task(self, title, description):
        task = Task(len(self.tasks) + 1, title, description, "pending")
        self.tasks.append(task)
        return task
    
    def get_tasks(self):
        return [task.serialize() for task in self.tasks]   
    
    def update_task(self, task_id, status):
        for task in self.tasks:
            if task.id == task_id:
                task.status = status
                return task.serialize()
        return None
    
    def delete_task(self, task_id):
        for task in self.tasks:
            if task.id == task_id:
                self.tasks.remove(task)
                return task.serialize()
        return None