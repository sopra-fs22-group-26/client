/**
 * Task model
 */
 class Task {
    constructor(data = {}) {
      this.taskId = null;
      this.dueDate = null;
      this.title = null;
      this.description = null;
      this.estimate = null;
      this.priority = null;
      this.location = null;
      this.geoLocation = null;
      this.status = null;
      this.assignee = null;
      this.reporter = null;
      this.score = null;
      this.nofComments = null;
      this.score = null;
      this.privateFlag = null;
      Object.assign(this, data);
    }
  }
  export default Task;
  