from models.task import Task

class TaskService:
    def __init__(self):
        self.tasks = {}
        self.next_task_id = 1

    def create_task(self, name, date, time, description):
        task_id = self.next_task_id
        self.next_task_id += 1
        task = Task(task_id, name, date, time, description)
        self.tasks[task_id] = task
        return task
    
    def get_task(self, task_id):
        return self.tasks.get(task_id)   
    
    def update_task(self, task_id, name, date, time, description):
        if task_id in self.tasks:
            task = self.tasks[task_id]
            task.name = name
            task.date = date
            task.time = time
            task.description = description
            return True
        return False
    
    def delete_task(self, task_id):
        if task_id in self.tasks:
            del self.tasks[task_id]
            return True
        return False