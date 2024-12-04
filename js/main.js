document.addEventListener("DOMContentLoaded", () => {
    const taskManager = new TaskManager();

    function autoResizeTextarea(area) {
        area.style.height = "auto";
        area.style.height = area.scrollHeight + "px";
    }

    document.querySelectorAll("textarea").forEach(area => {
        area.addEventListener("input", () => autoResizeTextarea(area));
        autoResizeTextarea(area);
    });

    const titleRegex = /^[A-Za-zА-Яа-я0-9\s]{2,50}$/;
    const descriptionRegex = /^[^\s].{1,}$/;

    function validateTitle(title) {
        return titleRegex.test(title);
    }

    function validateDescription(description) {
        return descriptionRegex.test(description);
    }

    function renderTasks() {
        const taskList = document.querySelector(".task-list");
        taskList.innerHTML = ""; 
        taskManager.allTasks.forEach(task => {
            const taskItem = document.createElement("li");
            taskItem.classList.add("task");
            taskItem.innerHTML = `
                <input type="checkbox" ${task.isCompleted ? "checked" : ""} onclick="toggleTaskStatus('${task.id}')">
                <a href="details.html?id=${task.id}" class="task-title">${task.title}</a>
                <button class="edit-button"><a href="edit.html?id=${task.id}">Edit</a></button>
                <button class="delete-button" onclick="deleteTask('${task.id}')">Delete</button>
            `;
            taskList.appendChild(taskItem);
        });
    }

    const addForm = document.querySelector("#task-form form");
const statusMessage = document.getElementById("status-message"); 

if (addForm) {
    addForm.addEventListener("submit", event => {
        event.preventDefault();
        const title = document.getElementById("task-title").value.trim();
        const details = document.getElementById("task-details").value.trim();

        if (!validateTitle(title) || !validateDescription(details)) {
            statusMessage.textContent = "Invalid title or description!";
            statusMessage.style.color = "red";  
            statusMessage.style.display = "block";
            return;
        }

        const newTask = new Task(title, details);
        taskManager.addTask(newTask);
        renderTasks();

        statusMessage.textContent = "Task added successfully!";
        statusMessage.style.color = "green";  
        statusMessage.style.display = "block";
        addForm.reset();
    });
}

    window.deleteTask = function (taskId) {
        taskManager.removeTask(taskId);
        renderTasks();
    };

    window.toggleTaskStatus = function (taskId) {
        taskManager.toggleTaskStatus(taskId);
        renderTasks();
    };

    const editForm = document.querySelector("#edit-task-form form");
    if (editForm) {
        const params = new URLSearchParams(window.location.search);
        const task = taskManager.getTaskById(params.get("id"));
        if (task) {
            document.getElementById("edit-task-title").value = task.title;
            document.getElementById("edit-task-details").value = task.description;

            editForm.addEventListener("submit", event => {
                event.preventDefault();
                const title = document.getElementById("edit-task-title").value.trim();
                const details = document.getElementById("edit-task-details").value.trim();

                if (!validateTitle(title) || !validateDescription(details)) {
                    alert("Invalid title or description!");
                    return;
                }

                taskManager.editTask(task.id, title, details);
                alert("Task updated!");
                window.location.href = "index.html";
            });
        } else {
            alert("Task not found!");
        }
    }

    const detailsSection = document.getElementById("task-details");
    if (detailsSection) {
        const params = new URLSearchParams(window.location.search);
        const task = taskManager.getTaskById(params.get("id"));

        if (task) {
            detailsSection.querySelector(".task-title").textContent = task.title;
            detailsSection.querySelector(".task-date").textContent = task.createdAt;
            detailsSection.querySelector(".task-status").textContent = task.isCompleted ? "Completed" : "Incomplete";
            detailsSection.querySelector(".task-description").textContent = task.description;
        } else {
            alert("Task not found!");
        }
    }

    renderTasks();
});
