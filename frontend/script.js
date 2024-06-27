document.addEventListener("DOMContentLoaded", function() {
    var modal = document.getElementById("task-modal");
    var closeBtn = document.querySelector(".close");
    var addTaskBtns = document.querySelectorAll(".add-task-btn");

    var selectedDay = ""; // Variable para almacenar el día seleccionado

    function openModal(day) {
        selectedDay = day;
        modal.style.display = "block";

        document.getElementById("task-name").value = "";
        document.getElementById("task-date").value = "";
        document.getElementById("task-time").value = "";
        document.getElementById("task-description").value = "";
    }

    function closeModal() {
        modal.style.display = "none";
    }

    addTaskBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            openModal(btn.getAttribute("data-day"));
        });
    });

    closeBtn.addEventListener("click", function() {
        closeModal();
    });

    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    var addTaskForm = document.getElementById("add-task-form");
    addTaskForm.addEventListener("submit", function(event) {
        event.preventDefault();

        var taskName = document.getElementById("task-name").value;
        var taskDate = document.getElementById("task-date").value;
        var taskTime = document.getElementById("task-time").value;
        var taskDescription = document.getElementById("task-description").value;

        // Añadir tarea al día correspondiente
        addTaskToDay(selectedDay, taskName, taskDate, taskTime, taskDescription);

        addTaskForm.reset();
        closeModal();
    });

    function addTaskToDay(day, taskName, taskDate, taskTime, taskDescription) {
        const dayContainer = document.getElementById(day);
        const task = document.createElement("div");
        task.className = "task";
        task.innerHTML = `
            <div class="task-details">
                <h3 class="task-title">${taskName}</h3>
                <p class="task-date">${taskDate}</p>
                <p class="task-time">${taskTime}</p>
                <p class="task-description">${taskDescription}</p>
            </div>
            <div class="task-buttons">
                <button class="modify-task-btn">Modificar</button>
                <button class="finalize-task-btn">Finalizar</button>
            </div>
        `;

        dayContainer.appendChild(task);

        const taskCountElement = dayContainer.querySelector('.task-count');
        const taskCount = dayContainer.querySelectorAll('.task').length;
        taskCountElement.textContent = taskCount;

        task.querySelector(".finalize-task-btn").addEventListener("click", deleteTask);
        task.querySelector(".modify-task-btn").addEventListener("click", function() {
            editTask(task);
        }); // Agregar evento para modificar tarea
    }

    function deleteTask(event) {
        const task = event.target.parentElement.parentElement;
        const dayContainer = task.closest('.day');
        const taskCountElement = dayContainer.querySelector('.task-count');

        task.remove();

        const taskCount = dayContainer.querySelectorAll('.task').length;
        taskCountElement.textContent = taskCount;
    }

    function editTask(taskElement) {
        const taskDetails = taskElement.querySelector('.task-details');
        const taskTitle = taskDetails.querySelector('.task-title').textContent;
        const taskTime = taskDetails.querySelector('.task-time').textContent;
        const taskDate = taskDetails.querySelector('.task-date').textContent;
        const taskDescription = taskDetails.querySelector('.task-description').textContent;

        openModal(selectedDay);
        document.getElementById("task-name").value = taskTitle;
        document.getElementById("task-date").value = taskDate;
        document.getElementById("task-time").value = taskTime;
        document.getElementById("task-description").value = taskDescription;

        // Almacenar referencia al elemento de tarea para actualizarlo después de editar
        let taskToUpdate = taskElement;

        // Mostrar el modal de edición
        openModal(taskToUpdate.getAttribute("data-day"));

        // Función para actualizar la tarea después de editar
        var updateTaskForm = document.getElementById("add-task-form");
        updateTaskForm.addEventListener("submit", function(event) {
            event.preventDefault();

            var updatedTaskName = document.getElementById("task-name").value;
            var updatedTaskDate = document.getElementById("task-date").value;
            var updatedTaskTime = document.getElementById("task-time").value;
            var updatedTaskDescription = document.getElementById("task-description").value;

            // Actualizar los detalles de la tarea dentro del elemento existente
            taskDetails.querySelector('.task-title').textContent = updatedTaskName;
            taskDetails.querySelector('.task-time').textContent = updatedTaskTime;
            taskDetails.querySelector('.task-date').textContent = updatedTaskDate;
            taskDetails.querySelector('.task-description').textContent = updatedTaskDescription;

            // Cerrar el modal después de actualizar
            closeModal();
        });
    }
});
