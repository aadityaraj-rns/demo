class UserDTO {
  constructor(user) {
    this.id = user.id; // UUID from PostgreSQL
    this.userType = user.userType || "admin";
    this.name = user.name || "";
    this.email = user.email || "";
    this.phone = user.phone || "";
    this.displayName = user.displayName || "";
    this.profile = user.profile || "";
    this.loginID = user.loginID || ""; // optional field for legacy frontend
    this.createdAt = user.createdAt || null;
    this.updatedAt = user.updatedAt || null;
  }
}

module.exports = UserDTO;
