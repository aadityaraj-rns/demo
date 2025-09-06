const notification = require("../../../models/Notification");
const Manager = require("../../../models/organization/manager/Manager");

const notificationController = {
  async getMyNotifications(req, res, next) {
    try {
      let userId = req.user._id;

      if (req.user.userType === "manager") {
        const org = await Manager.findOne({ userId: req.user._id })
          .populate({
            path: "orgUserId",
            select: "_id",
          })
          .select("orgUserId");

        userId = org.orgUserId._id;
      }

      const myNotifications = await notification
        .find({ userId })
        .sort({ createdAt: -1 });
      return res.json(myNotifications);
    } catch (error) {
      return next(error);
    }
  },
  async clearMyNotifications(req, res, next) {
    try {
      const myNotifications = await notification.deleteMany({
        userId: req.user._id,
      });
      return res.json(myNotifications);
    } catch (error) {
      return next(error);
    }
  },
  async updateReadNotification(req, res, next) {
    console.log(req.body);

    try {
      const updateNotificationRead = await notification.updateMany(
        { userId: req.user._id },
        { $set: { read: true } }
      );
      return res.json({ message: "updated", result: updateNotificationRead });
    } catch (error) {
      console.log(error);
    }
  },
};
module.exports = notificationController;
