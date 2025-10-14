class ClientDTO {
  constructor(client) {
    this.id = client?.id || null; // Use Sequelize's 'id' instead of '_id'
    this.userId = client?.userId?.id || null;
    this.branchName = client?.branchName || "";
    this.cityId = client?.city?.id || null;
    this.cityName = client?.city?.cityName || "";
    this.stateId = client?.city?.state?.id || null;
    this.stateName = client?.city?.state?.stateName || "";
    this.industryId = client?.industry?.id || null;
    this.industryName = client?.industry?.industryName || "";
    this.clientType = client?.clientType || "";
    this.categoryId = client?.categories?.map(
      (category) => category?.category?.id
    ) || [];
    this.categoryNames = client?.categories?.map(
      (category) => category?.category?.categoryName
    ) || [];
    this.contactNo = client?.userId?.phone || "";
    this.email = client?.userId?.email || "";
    this.loginID = client?.userId?.loginID || "";
    this.status = client?.userId?.status || "";
    this.name = client?.userId?.name || "";
    this.gst = client?.gst || "";
    this.address = client?.address || "";
    this.pincode = client?.pincode || "";
    this.createdAt = client?.createdAt || null;

    // Handle createdByPartnerId
    this.createdByPartnerId = client?.createdByPartnerUserId || null;
  }
}

module.exports = ClientDTO;
