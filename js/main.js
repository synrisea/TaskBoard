document.addEventListener("DOMContentLoaded", () => {
    const taskManager = new TaskManager();

    document.getElementById("sort-tasks").addEventListener("change", () => {
        renderTasks();
    });
    const filterSelect = document.getElementById("filter-tasks");
    const sortSelect = document.getElementById("sort-tasks");
    const taskList = document.querySelector("#task-list .task-list");
    const addForm = document.querySelector("#task-form form");
    const statusMessage = document.getElementById("status-message"); 

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
        const taskList = document.querySelector("#task-list .task-list");
        
        if (!taskList) {
            console.error("task-list element not found. Make sure the HTML contains a <ul class='task-list'> element.");
            return;
        }
        
        const filterBy = filterSelect.value;
        const sortBy = sortSelect.value;    

        const tasksToRender = taskManager.getFilteredAndSortedTasks(filterBy, sortBy);
    
        taskList.innerHTML = ""; 
        
        tasksToRender.forEach(task => {
            const taskItem = document.createElement("li");
            taskItem.classList.add("task");
    
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.isCompleted;
            checkbox.addEventListener("click", () => toggleTaskStatus(task.id));
    
            const taskTitle = document.createElement("a");
            taskTitle.href = `details.html?id=${task.id}`;
            taskTitle.classList.add("task-title");
            taskTitle.textContent = task.title;
    
            const editButton = document.createElement("button");
            editButton.classList.add("edit-button");
            const editLink = document.createElement("a");
            editLink.href = `edit.html?id=${task.id}`;
            editLink.textContent = "Edit";
            editButton.appendChild(editLink);
    
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => deleteTask(task.id));
    
            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskTitle);
            taskItem.appendChild(editButton);
            taskItem.appendChild(deleteButton);
    
            taskList.appendChild(taskItem);
        });
    }
    
    filterSelect.addEventListener("change", renderTasks);
    sortSelect.addEventListener("change", renderTasks);
    
    function deleteTask(taskId) {
        taskManager.removeTask(taskId);
        renderTasks();
    }

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

            console.log(localStorage.getItem("tasks"));
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
        const taskId = params.get("id");
        const task = taskManager.getTaskById(taskId);

        if (!task) {
            //show404Page();
        } else {
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
                window.location.href = "index.html";
            });
        }
    }

    const detailsSection = document.getElementById("task-details");
    if (detailsSection) {
        const params = new URLSearchParams(window.location.search);
        const taskId = params.get("id");
        const task = taskManager.getTaskById(taskId);

        if (!task) {
            //show404Page();
        } else {
            detailsSection.querySelector(".task-title").textContent = task.title;
            detailsSection.querySelector(".task-date").textContent = task.createdAt;
            detailsSection.querySelector(".task-status").textContent = task.isCompleted ? "Completed" : "Incomplete";
            detailsSection.querySelector(".task-description").textContent = task.description;
        }
    }

    function show404Page() {
        document.body.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h1>404 Not Found</h1>
                <p>The page you are looking for does not exist or the task ID is invalid.</p>
                <a href="index.html">Go back to Home</a>
            </div>`;
    }

    renderTasks();
});
