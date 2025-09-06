class ProductDTO {
  constructor(product) {
    this._id = product._id;
    this.productId = product.productId;
    this.categoryId = product.categoryId?._id;
    this.categoryName = product.categoryId?.categoryName;
    this.productName = product.productName;
    this.description = product.description;
    this.type = product.type;
    this.testFrequency = product.testFrequency;
    this.capacity = product.capacity;
    this.image1 = product.image1;
    this.image2 = product.image2;
    this.status = product.status;
    this.createdAt = product.createdAt;
  }
}

module.exports = ProductDTO;
