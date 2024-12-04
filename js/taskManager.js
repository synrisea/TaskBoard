class TaskManager {
    #tasks;
  
    constructor() {
      const tasksFromStorage = JSON.parse(localStorage.getItem("tasks")) || [];
      this.#tasks = tasksFromStorage.map(taskData => Task.fromJSON(taskData));
    }
    addTask(task) {
      this.#tasks.push(task);
      this.saveToLocalStorage();
      console.log("Adding task:", task);
    }
  
    removeTask(taskId) {
      this.#tasks = this.#tasks.filter(task => task.id !== taskId);
      this.saveToLocalStorage();
    }
  
    editTask(taskId, title, description) {
      const task = this.getTaskById(taskId);
      if (task) {
        task.title = title;
        task.description = description;
        this.saveToLocalStorage();
      }
    }
  
    toggleTaskStatus(taskId) {
      const task = this.getTaskById(taskId);
      if (task) {
        task.toggleCompleted();
        this.saveToLocalStorage();
      }
    }
  
    getTaskById(taskId) {
      return this.#tasks.find(task => task.id === taskId);
    }
  
    getFilteredAndSortedTasks(filterBy, sortBy) {
      let filteredTasks = [...this.#tasks];

      if (filterBy === "completed") {
          filteredTasks = filteredTasks.filter(task => task.isCompleted);
      } else if (filterBy === "incomplete") {
          filteredTasks = filteredTasks.filter(task => !task.isCompleted);
      }

      if (sortBy === "createdAt") {
          filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortBy === "title") {
          filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
      }

      return filteredTasks;
  }
  
    saveToLocalStorage() {
      localStorage.setItem("tasks", JSON.stringify(this.#tasks));
    }
    
    get allTasks() {
      return this.#tasks;
    }
  }