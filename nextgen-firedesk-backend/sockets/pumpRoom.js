const PumpIOTLiveData = require("../models/PumpIOTLiveData");

module.exports = (io, socket) => {
  // Subscribe client to a device-specific room and send latest data immediately
  socket.on("subscribe:device", async ({ device_id }) => {
    if (!device_id) return;

    // Join the device room
    socket.join(`device_${device_id}`);
    console.log(`Socket ${socket.id} joined room device_${device_id}`);

    try {
      // ⬇️ Fetch the latest stored data from DB
      const data = await PumpIOTLiveData.findOne({ device_id }).lean();

      // Emit it directly to this socket (not to the whole room)
      if (data) {
        socket.emit("live-data", {
          device_id: data.device_id,
          device_data: data.device_data,
          timestamp: data.updatedAt,
        });
      } else {
        socket.emit("live-data", null); // or a placeholder message
      }
    } catch (err) {
      console.error("Failed to fetch device data:", err);
      socket.emit("live-data:error", {
        message: "Failed to fetch initial device data",
      });
    }
  });

  socket.on("unsubscribe:device", ({ device_id }) => {
    if (!device_id) return;
    socket.leave(`device_${device_id}`);
    console.log(`Socket ${socket.id} left room device_${device_id}`);
  });
};
