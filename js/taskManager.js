class TaskManager {
    #tasks;
  
    constructor() {
      this.#tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    }
  
    addTask(task) {
      this.#tasks.push(task);
      this.saveToLocalStorage();
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
  
    filterTasksByStatus(isCompleted) {
      return this.#tasks.filter(task => task.isCompleted === isCompleted);
    }
  
    sortTasksBy(field) {
      return [...this.#tasks].sort((a, b) =>
        field === "createdAt"
          ? new Date(b[field]) - new Date(a[field])
          : a[field].localeCompare(b[field])
      );
    }
  
    saveToLocalStorage() {
      localStorage.setItem("tasks", JSON.stringify(this.#tasks));
    }
  
    get allTasks() {
      return this.#tasks;
    }
  }