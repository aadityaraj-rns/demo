class UserDTO {
  constructor(user) {
    this._id = user._id;
    this.userType = user.userType;
    this.name = user.name;
    this.phone = user.phone;
    this.email = user.email;
    this.displayName=user.displayName;
    this.profile = user.profile;
    this.loginID = user.loginID;
  }
}
module.exports = UserDTO;
