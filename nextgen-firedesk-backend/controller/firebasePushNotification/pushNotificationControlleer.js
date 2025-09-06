const admin = require("firebase-admin");
const serviceAccount = require("./firedesk-4c38e-firebase-adminsdk-fbsvc-c1490039a3.json");
const COMPANY_LOGO_URL = "http://localhost:5000/logo/firedesk_logo.png";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendPushNotification = async (deviceToken, notification) => {
  try {
    const message = {
      token: deviceToken,
      notification: {
        title: notification.title,
        body: notification.body,
        image: notification.image || COMPANY_LOGO_URL,
      },
      data: notification.data || {},
    };

    const response = await admin.messaging().send(message);
    return { success: true, response };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { success: false, error: error.message };
  }
};

const pushNotification = {
  async sendNotification(req, res, next) {
    try {
      // const { deviceToken, notification } = req.body;
      const deviceToken =
        "dkUtltOvQHaJl_XGzY_WRD:APA91bES5VPO5N8_-UV-po8JWRYS2EgrhXXpo8S6PBiCiy-yZ5-BHiCoIUP1E8y3u-jxI35u_iH0T_ZuBUOQUxI4du3NiR7xWKAFAKR5XpSRk8G_C9XF4v0";
      const notification = {
        title: "Hello!",
        body: "This is a test push notification from node js.",
        data: { key1: "value1", key2: "value2" },
      };
      if (!deviceToken || !notification) {
        return res
          .status(400)
          .json({ error: "deviceToken and notification are required" });
      }

      const result = await sendPushNotification(deviceToken, notification);

      if (result.success) {
        return res.status(200).json({
          message: "Notification sent successfully",
          result: result.response,
        });
      } else {
        return res.status(500).json({
          error: "Failed to send notification",
          details: result.error,
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({
        error: "An unexpected error occurred",
        details: error.message,
      });
    }
  },
  async sendNotificationDirectly(deviceToken, notification) {
    return sendPushNotification(deviceToken, notification);
  },
};

module.exports = pushNotification;
