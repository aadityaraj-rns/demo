class ClientDTO {
  constructor(client) {
    this._id = client?._id || null;  // Safely access _id or return null
    this.userId = client?.userId?._id || null;
    this.branchName = client?.branchName || "";
    this.cityId = client?.cityId?._id || null;
    this.cityName = client?.cityId?.cityName || "";
    this.stateId = client?.cityId?.stateId?._id || null;
    this.stateName = client?.cityId?.stateId?.stateName || "";
    this.industryId = client?.industryId?._id || null;
    this.industryName = client?.industryId?.industryName || "";
    this.clientType = client?.clientType || "";
    this.categoryId = client?.categories?.map(
      (category) => category?.categoryId?._id
    ) || [];
    this.categoryNames = client?.categories?.map(
      (category) => category?.categoryId?.categoryName
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
