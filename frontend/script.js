document.addEventListener("DOMContentLoaded", function() {
    var modal = document.getElementById("task-modal");
    var closeBtn = document.querySelector(".close");
    var addTaskBtns = document.querySelectorAll(".add-task-btn");

    var selectedDay = ""; // Variable para almacenar el día seleccionado

    document.getElementById('search-task-btn').addEventListener('click', function() {
        const taskName = document.getElementById('search-task-name').value;
        if (taskName) {
            getTasks(taskName); // Llama a getTasks con el nombre de la tarea
        } else {
            alert('Por favor, ingrese el nombre de una tarea para buscar');
        }
    });

    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('finish-task-btn')) {
            const taskId = event.target.getAttribute('data-task-id');
            deleteTask(taskId);
        } else if (event.target.classList.contains('add-task-btn')) {
            openModal(event.target.getAttribute('data-day'));
        }
    });

    closeBtn.addEventListener("click", closeModal);
    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    var addTaskForm = document.getElementById("add-task-form");
    addTaskForm.addEventListener("submit", function(event) {
        event.preventDefault();
        var taskData = {
            name: document.getElementById("task-name").value,
            date: document.getElementById("task-date").value,
            time: document.getElementById("task-time").value,
            description: document.getElementById("task-description").value
        };

        if (addTaskForm.getAttribute("data-task-id")) {
            // Si el formulario tiene un data-task-id, estamos editando una tarea
            updateTask(addTaskForm.getAttribute("data-task-id"), taskData);
        } else {
            createTask(taskData);
        }
    });

    function openModal(day) {
        selectedDay = day;
        modal.style.display = "block";
        addTaskForm.removeAttribute("data-task-id"); // Asegúrate de que no haya ningún id al abrir el modal para crear una nueva tarea
        addTaskForm.reset();
    }

    function closeModal() {
        modal.style.display = "none";
    }

    function createTask(taskData) {
        fetch('http://localhost:5000/task/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                addTaskToDay(selectedDay, data);
                closeModal();
            } else {
                console.error('Error al crear la tarea:', data.error);
            }
        })
        .catch(error => console.error('Error al enviar la solicitud:', error));
    }

    function updateTask(taskId, taskData) {
        fetch(`http://localhost:5000/task/${taskId}`, { // Corregida la URL
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                updateTaskInDOM(taskId, data);
                closeModal();
            } else {
                console.error('Error al actualizar la tarea:', data.error);
            }
        })
        .catch(error => console.error('Error al enviar la solicitud:', error));
    }

    function deleteTask(taskId) {
        fetch(`http://localhost:5000/task/${taskId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                removeTaskFromDOM(taskId);
                console.log(`Tarea ${taskId} eliminada`);
            } else {
                console.error('Error al intentar eliminar la tarea');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function getTasks(taskName) {
        fetch(`http://localhost:5000/task/tasks/${taskName}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Tarea no encontrada');
            } else {
                alert(`Nombre: ${data.name}\nFecha: ${data.date}\nHora: ${data.time}\nDescripción: ${data.description}`);
            }
        })
        .catch(error => console.error('Error al enviar la solicitud:', error));
    }

    function addTaskToDay(day, task) {
        const dayContainer = document.getElementById(day);
        const taskElement = document.createElement("div");
        taskElement.className = "task";
        taskElement.setAttribute("data-task-id", task.id);
        taskElement.innerHTML = `
            <div class="task-details">
                <h3 class="task-name">${task.name}</h3>
                <p class="task-date">${task.date}</p>
                <p class="task-time">${task.time}</p>
                <p class="task-description">${task.description}</p>
            </div>
            <div class="task-buttons">
                <button class="modify-task-btn">Modificar</button>
                <button class="finalize-task-btn">Finalizar</button>
            </div>
        `;
        dayContainer.appendChild(taskElement);
        updateTaskCount(dayContainer);

        taskElement.querySelector(".finalize-task-btn").addEventListener("click", function() {
            deleteTask(task.id);
        });
        taskElement.querySelector(".modify-task-btn").addEventListener("click", function() {
            openModalForEdit(task);
        });
    }

    function removeTaskFromDOM(taskId) {
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskElement) {
            const dayContainer = taskElement.parentNode;
            taskElement.parentNode.removeChild(taskElement);
            updateTaskCount(dayContainer); // Asegúrate de que el contenedor del día exista
        }
    }

    function updateTaskInDOM(taskId, taskData) {
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskElement) {
            const taskDetails = taskElement.querySelector('.task-details');
            taskDetails.querySelector('.task-name').textContent = taskData.name;
            taskDetails.querySelector('.task-date').textContent = taskData.date;
            taskDetails.querySelector('.task-time').textContent = taskData.time;
            taskDetails.querySelector('.task-description').textContent = taskData.description;
        }
    }

    function updateTaskCount(dayContainer) {
        const taskCountElement = dayContainer.querySelector('.task-count');
        if (taskCountElement) { // Verifica que el elemento taskCountElement exista
            const taskCount = dayContainer.querySelectorAll('.task').length;
            taskCountElement.textContent = taskCount;
        }
    }

    function openModalForEdit(task) {
        openModal(selectedDay);
        document.getElementById("task-name").value = task.name;
        document.getElementById("task-date").value = task.date;
        document.getElementById("task-time").value = task.time;
        document.getElementById("task-description").value = task.description;
        addTaskForm.setAttribute("data-task-id", task.id);
    }
});
