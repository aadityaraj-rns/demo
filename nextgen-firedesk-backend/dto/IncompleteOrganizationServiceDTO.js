class IncompleteOrganizationServiceDTO {
  constructor(asset) {
    this._id = asset._id;
    this.plantId = asset.plantId?._id;
    this.building = asset.building;
    this.location = asset.location;
    this.plantName = asset.plantId?.plantName;
    this.assetName = asset.productId?.productName;
    this.assetId = asset.assetId;
    this.technicianUserId = asset.technicianUserId?._id;
    this.technicianName = asset.technicianUserId?.name;
    this.technicianContactNo = asset.technicianUserId?.phone;
    this.serviceDate = asset.serviceDate;
    this.serviceType = asset.serviceType;
    // this.group = asset.group;
  }
}
module.exports = IncompleteOrganizationServiceDTO;
