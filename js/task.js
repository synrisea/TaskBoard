class Task {
    #id;
    #title;
    #description;
    #createdAt;
    #isCompleted;
  
    constructor(title, description) {
      this.#id = Date.now().toString(36) + Math.random().toString(36).substr(2);
      this.#title = title;
      this.#description = description;
      this.#createdAt = new Date().toLocaleString("ru-RU");
      this.#isCompleted = false;
    }
  
    get id() {
      return this.#id;
    }
  
    get title() {
      return this.#title;
    }
  
    set title(value) {
      this.#title = value;
    }
  
    get description() {
      return this.#description;
    }
  
    set description(value) {
      this.#description = value;
    }
  
    get createdAt() {
      return this.#createdAt;
    }
  
    get isCompleted() {
      return this.#isCompleted;
    }
  
    toggleCompleted() {
      this.#isCompleted = !this.#isCompleted;
    }
  }