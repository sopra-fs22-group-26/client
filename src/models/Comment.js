/**
 * Comment model
 */
class Comment {
    constructor(data = {}) {
        this.commentId = null;
        this.content = null;
        this.belongingTask = null;
        this.author = null;
        Object.assign(this, data);
    }
}
export default Comment;
