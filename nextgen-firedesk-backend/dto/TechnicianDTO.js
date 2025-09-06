class TechnicianDTO {
  constructor(technician) {
    this._id = technician._id;
    this.technicianId = technician.technicianId;
    this.userId = technician.userId?._id;
    this.userType = technician.userId?.userType;
    this.name = technician.userId?.name;
    this.contactNo = technician.userId?.phone;
    this.email = technician.userId?.email;
    this.profile = technician.userId?.profile;
    this.status = technician.userId?.status;
    this.plantId = technician.plantId?.map((plant) => plant._id);
    this.plantName = technician.plantId?.map((plant) => plant.plantName);
    this.categoryId = technician.categoryId.map((c) => c._id);
    this.categoryName = technician.categoryId.map((c) => c.categoryName);
    this.technicianType = technician.technicianType;
    this.venderName = technician.venderName;
    this.venderAddress = technician.venderAddress;
    this.venderNumber = technician.venderNumber;
    this.venderEmail = technician.venderEmail;
    this.createdAt = technician.createdAt;
    this.updatedAt = technician.updatedAt;
    this.managerNames = technician.plantId
      .map((plant) => plant.managerId?.userId?.name)
      .filter(Boolean);
  }
}

module.exports = TechnicianDTO;
