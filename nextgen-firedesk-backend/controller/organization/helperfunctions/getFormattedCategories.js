const Client = require("../../../models/admin/client/Client");

async function getFormattedCategories(userId) {
  const client = await Client.findOne({ userId })
    .populate({
      path: 'categories.categoryId',
      model: 'Category',
      select: '_id categoryName',
    });

  return client
    ? client.categories.map((category) => ({
        categoryId: category.categoryId?._id,
        categoryName: category.categoryId?.categoryName,
        // serviceDetails: category.serviceDetails,
      }))
    : [];
}

module.exports = getFormattedCategories;