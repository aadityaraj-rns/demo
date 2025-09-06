class OrgTicketsDTO {
  constructor(ticket) {
    this._id = ticket._id;
    this.ticketId = ticket.ticketId;
    this.plantId = ticket.plantId._id;
    this.plantName = ticket.plantId.plantName;
    this.assetsData = ticket.assetsId.map((asset) => ({
      assetProductId: asset.productId._id,
      assetId: asset.assetId,
      building: asset.building,
      technicianName: asset.technicianUserId?.map((t) => t?.name),
      assetCategoryId: asset.productId.categoryId,
      assetsId: asset._id,
      assetName: asset.productId.productName,
      // group: asset.group,
      status: asset.status,
    }));

    this.assetProductId = ticket.assetsId.map((asset) => asset.productId._id);
    this.assetId = ticket.assetsId.map((asset) => asset.assetId);
    this.building = ticket.assetsId.map((asset) => asset.building);
    this.technicianName = ticket.assetsId.map((asset) => [
      ...new Set(asset.technicianUserId?.map((t) => t?.name)),
    ]);
    this.assetCategoryId = ticket.assetsId.map(
      (asset) => asset.productId.categoryId
    );
    this.assetsId = ticket.assetsId.map((asset) => asset._id);
    this.assetNames = ticket.assetsId.map(
      (asset) => asset.productId.productName
    );

    this.taskNames = ticket.taskNames;
    this.taskDescription = ticket.taskDescription;
    this.targetDate = ticket.targetDate;
    this.completedStatus = ticket.completedStatus;
    this.status = ticket.status;
    this.createdAt = ticket.createdAt;
  }
}
module.exports = OrgTicketsDTO;
