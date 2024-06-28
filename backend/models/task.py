class Task:
    def __init__(self, id, name, date, time, description):
        self.id = id
        self.name = name
        self.date = date
        self.time = time
        self.description = description

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "date": self.date,
            "time": self.time,
            "description": self.description
        }