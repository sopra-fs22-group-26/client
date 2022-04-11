/**
 * Task model
 */
 class Task {
    constructor(data = {}) {
      this.task_id = null;
      this.dueDate = null;
      this.title = null;
      this.description = null;
      this.estimate = null;
      this.priority = null;
      this.location = null;
      this.status = null;
      Object.assign(this, data);
    }
  }
  export default Task;
  