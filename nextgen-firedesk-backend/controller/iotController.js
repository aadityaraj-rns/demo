const category = require("../models/admin/masterData/category");
const Notification = require("../models/Notification");
const Plant = require("../models/organization/plant/Plant");
const PumpIOTLiveData = require("../models/PumpIOTLiveData");

const iotController = {
  async create(req, res, next) {
    const { device_data, device_id } = req.body;

    if (!device_id || !device_data) {
      console.log("device_id and device_data are required");
      return res
        .status(400)
        .json({ error: "device_id and device_data are required" });
    }

    try {
      let record = await PumpIOTLiveData.findOne({ device_id });

      if (!record) {
        record = new PumpIOTLiveData({ device_id, device_data });
      } else {
        const old = record.device_data;
        const categoryData = await category
          .findOne({
            categoryName: "Pump Room",
          })
          .select("_id");
        const plant = await Plant.findOne({
          pumpIotDeviceId: device_id,
        }).select("orgUserId plantName headerPressure");
        if (plant) {
          const notifications = [];

          const pushNotif = (title, msg) => {
            notifications.push({
              categoryId: categoryData._id,
              plantId: plant._id,
              userId: plant.orgUserId,
              importance: "Critical",
              title,
              message: `${msg} - ${new Date().toLocaleString()}`,
            });
          };

          if (old?.TS1 === 1 && device_data?.TS1 === 0)
            pushNotif(
              "Pump Trip",
              `Pump Trip detected – immediate attention required - Plant: ${plant.plantName}, Jockey Pump`
            );

          if (old?.TS2 === 1 && device_data?.TS2 === 0)
            pushNotif(
              "Pump Trip",
              `Pump Trip detected – immediate attention required - Plant: ${plant.plantName}, Electrical Pump`
            );

          if (old?.PS1 === 0 && device_data?.PS1 === 1)
            pushNotif(
              "Jockey Pump Started",
              `Jockey Pump Started - Need Attention - Plant: ${plant.plantName}`
            );

          if (old?.PS2 === 0 && device_data?.PS2 === 1)
            pushNotif(
              "Electrical Pump Started",
              `Electrical Pump Started - Need Attention - Plant: ${plant.plantName}`
            );

          if (old?.PS3 === 0 && device_data?.PS3 === 1)
            pushNotif(
              "Diesel Engine Pump Started",
              `Diesel Engine Pump Started - Need Attention - Plant: ${plant.plantName}`
            );

          const BATTERY_LOW_THRESHOLD = 12.0;

          if (
            old?.BAT1 > BATTERY_LOW_THRESHOLD &&
            device_data?.BAT1 <= BATTERY_LOW_THRESHOLD
          )
            pushNotif(
              "Battery Low",
              `Battery Low detected in Pump Room Plant: ${plant.plantName}, BAT 1: ${device_data.BAT1}`
            );

          if (
            old?.BAT2 > BATTERY_LOW_THRESHOLD &&
            device_data?.BAT2 <= BATTERY_LOW_THRESHOLD
          )
            pushNotif(
              "Battery Low",
              `Battery Low detected in Pump Room Plant: ${plant.plantName}, BAT 2: ${device_data.BAT2}`
            );
          if (old?.OPR === 1 && device_data?.OPR === 0)
            pushNotif(
              "Engine Oil Pressure Low",
              `Diesel Engine Oil Pressure is Low - Need Attention - Plant: ${plant.plantName}`
            );
          if (old?.WTP === 1 && device_data?.WTP === 0)
            pushNotif(
              "Engine Water Temperature High",
              `Diesel Engine water Pressure is High - Need Attention - Plant: ${plant.plantName}`
            );
          if (old?.BCH === 1 && device_data?.BCH === 0)
            pushNotif(
              "Battery Charger",
              `Diesel Engine Battery Charger Not working - Need Attention - Plant: ${plant.plantName}`
            );
          if (
            (parseInt(plant.headerPressure) > device_data?.PLS + 2 ||
              parseInt(plant.headerPressure) < device_data?.PLS - 2) &&
            old?.PLS !== device_data?.PLS
          )
            pushNotif(
              "Header Pressure Low",
              `Low Header pressure is detected(${device_data?.PLS}), Need Attention - Plant: ${plant.plantName}`
            );
          if (old?.WLS >= 75 && device_data?.WLS < 75)
            pushNotif(
              "Water Level Low",
              `Low Water Level is detected, take measure to re-fill immedeatly - Plant: ${plant.plantName}`
            );
          if (old?.DLS >= 75 && device_data?.DLS < 75)
            pushNotif(
              "Diesel Level Low",
              `Low Diesel Level is detected, take measure to re-fill immedeatly - Plant: ${plant.plantName}`
            );

          if (notifications.length > 0) {
            await Notification.insertMany(notifications);
          }
        }
        record.device_data = device_data;
      }

      await record.save(); // ⬅️ This will trigger the pre-save hook

      // ✅ Emit to Socket.IO room named by device_id
      if (req.io) {
        req.io.to(`device_${device_id}`).emit("live-data", {
          device_id,
          device_data,
          timestamp: new Date().toISOString(),
        });
      }

      return res.json({ message: "IOT Data Created Successfully" });
    } catch (error) {
      console.log(error.message);
      return next(error);
    }
  },
};

module.exports = iotController;
