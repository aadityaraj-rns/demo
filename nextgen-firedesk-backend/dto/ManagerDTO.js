class ManagerDTO {
  constructor(manager, plants = [], categories = []) {
    this._id = manager._id;
    this.managerId = manager.managerId;
    this.name = manager.userId?.name;
    this.contactNo = manager.userId?.phone;
    this.email = manager.userId?.email;
    this.loginID = manager.userId?.loginID;
    this.status = manager.userId?.status;
    this.createdAt = manager.createdAt;
    this.updatedAt = manager.updatedAt;
    this.plants = plants.map((plant) => ({
      plantId: plant._id,
      plantName: plant.plantName,
    }));
    this.categories = categories;
  }
}

module.exports = ManagerDTO;
