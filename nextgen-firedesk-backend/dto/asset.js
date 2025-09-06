class AssetDTO {
  constructor(asset, groupName = null) {
    this._id = asset._id;
    this.plantId = asset.plantId;
    this.building = asset.building;
    this.productId = asset.productId;
    this.location = asset.location;
    this.capacity = asset.capacity;
    this.capacityUnit = asset.capacityUnit;
    this.orgUserId = asset.orgUserId;
    this.technicianUserId = asset.technicianUserId;
    this.model = asset.model;
    this.slNo = asset.slNo;
    this.pressureRating = asset.pressureRating;
    this.pressureUnit = asset.pressureUnit;
    this.moc = asset.moc;
    this.approval = asset.approval;
    this.fireClass = asset.fireClass;
    this.manufacturingDate = asset.manufacturingDate;
    this.installDate = asset.installDate;
    this.validTill = asset.validTill;
    this.suctionSize = asset.suctionSize;
    this.head = asset.head;
    this.rpm = asset.rpm;
    this.mocOfImpeller = asset.mocOfImpeller;
    this.fuelCapacity = asset.fuelCapacity;
    this.flowInLpm = asset.flowInLpm;
    this.housePower = asset.housePower;
    this.healthStatus = asset.healthStatus;
    this.tag = asset.tag;
    this.status = asset.status;
    this.qrCodeUrl = asset.qrCodeUrl;
    this.assetId = asset.assetId;
    this.lat = asset.lat;
    this.long = asset.long;
    this.latLongRemark = asset.latLongRemark;
    this.serviceDates = asset.serviceDates;
    this.createdAt = asset.createdAt;
    this.groupId = asset.groupId;
    this.oldlatlongs = asset.oldlatlongs;
    this.manufacturerName = asset.manufacturerName;
    this.document1 = asset.document1;
    this.document2 = asset.document2;
  }
}

module.exports = AssetDTO;
