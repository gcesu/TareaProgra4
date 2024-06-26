document.getElementById('task-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const taskInput = document.getElementById('task-input');
    const response = await fetch('/add_task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: taskInput.value }),
    });
    const data = await response.json();
    addTaskToList(data.task);
    taskInput.value = '';
});

async function fetchTasks() {
    const response = await fetch('/get_tasks');
    const tasks = await response.json();
    tasks.forEach(task => addTaskToList(task));
}

function addTaskToList(task) {
    const taskList = document.getElementById('task-list');
    const li = document.createElement('li');
    li.textContent = task;
    taskList.appendChild(li);
}

fetchTasks();
