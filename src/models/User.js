/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.name = null;
    this.username = null;
    this.token = null;
    this.refreshToken = null;
    this.status = null;
    this.email = null;
    this.birthDate = null;
    this.score = null;
    Object.assign(this, data);
  }
}
export default User;
