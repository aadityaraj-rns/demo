const cron = require("node-cron");
const Notification = require("./models/Notification");
const ServiceTickets = require("./models/organization/service/ServiceTickets");
const Asset = require("./models/organization/asset/Asset");

const task = async () => {
  try {
    const today = new Date();
    // const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    await ServiceTickets.updateMany(
      { expireDate: { $lt: endOfDay }, completedStatus: "Pending" },
      { $set: { completedStatus: "Lapsed" } }
    );

    // 2️⃣ Handle all service due notifications
    const inserted = await handleServiceDueNotifications(endOfDay);
    console.log(`[cron] created ${inserted} notifications`);
    await handleDueHpTestNotification();

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    await Notification.deleteMany({
      createdAt: { $lt: sevenDaysAgo },
    });
  } catch (error) {
    console.log(error);
  }
};
async function handleDueHpTestNotification() {
  try {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    const in7DaysStart = new Date(startOfToday);
    in7DaysStart.setDate(in7DaysStart.getDate() + 7);
    const in7DaysEnd = new Date(endOfToday);
    in7DaysEnd.setDate(in7DaysEnd.getDate() + 7);

    const in15DaysStart = new Date(startOfToday);
    in15DaysStart.setDate(in15DaysStart.getDate() + 15);
    const in15DaysEnd = new Date(endOfToday);
    in15DaysEnd.setDate(in15DaysEnd.getDate() + 15);

    const upcomingDueAssets = await Asset.find({
      $or: [
        { nextHpTestDue: { $gte: startOfToday, $lte: endOfToday } }, // today
        { nextHpTestDue: { $gte: in7DaysStart, $lte: in7DaysEnd } }, // +7 days
        { nextHpTestDue: { $gte: in15DaysStart, $lte: in15DaysEnd } }, // +15 days
      ],
    })
      .populate({ path: "productId", select: "productName" })
      .select(
        "plantId orgUserId assetId productId productCategoryId type subType capacity capacityUnit location building nextHpTestDue"
      );
    const notifications = [];

    for (const asset of upcomingDueAssets) {
      const dueDate = new Date(asset.nextHpTestDue).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      );

      let windowLabel = "on";
      if (
        asset.nextHpTestDue >= in7DaysStart &&
        asset.nextHpTestDue <= in7DaysEnd
      ) {
        windowLabel = "in 7 days (on)";
      } else if (
        asset.nextHpTestDue >= in15DaysStart &&
        asset.nextHpTestDue <= in15DaysEnd
      ) {
        windowLabel = "in 15 days (on)";
      }

      const message =
        `Asset ID: ${asset.assetId}, ` +
        `Asset Name: ${asset.productId?.productName || "N/A"}, ` +
        `Type: ${asset.type}${asset.subType ? " " + asset.subType : ""}, ` +
        `Capacity: ${asset.capacity} ${asset.capacityUnit || ""}, ` +
        `Location: ${asset.location}, Building: ${asset.building} ` +
        `is due for HP-Test ${windowLabel} ${dueDate}.`;

      notifications.push({
        plantId: asset.plantId,
        categoryId: asset.productCategoryId,
        userId: asset.orgUserId,
        title: "HP-Test Reminder",
        message,
      });
    }

    /* ─────────────── 4. Bulk-insert (skip dups) ───────────── */
    if (notifications.length > 0) {
      const hpResult = await Notification.insertMany(notifications, {
        ordered: false,
      });
      console.log(`[cron] HP-Test notices inserted: ${hpResult.length}`);
    }
  } catch (err) {
    console.error("[HP-Test cron]", err);
  }
}

async function handleServiceDueNotifications(endOfDay) {
  // Fetch tickets due today
  const tickets = await ServiceTickets.find({
    completedStatus: "Pending",
    date: { $lte: endOfDay },
    expireDate: { $lte: endOfDay },
  })
    .populate([
      {
        path: "assetsId",
        populate: [
          { path: "technicianUserId", select: "name deviceToken" },
          { path: "productId", select: "productName" },
        ],
        select:
          "productCategoryId plantId assetId productId technicianUserId type subType capacity capacityUnit location building",
      },
      { path: "groupServiceId", select: "groupId" },
    ])
    .select("assetsId orgUserId groupServiceId individualService expireDate");

  // ---------- build one big array of docs ----------
  const docs = [];

  for (const ticket of tickets) {
    const isIndividual = ticket?.individualService;
    const expire = ticket?.expireDate.toDateString();

    // — build message —
    let message;
    if (isIndividual) {
      const a = ticket?.assetsId[0] || {};
      message =
        `Service Due for Asset ID: ${a.assetId}, ` +
        `Asset Name: ${a.productId?.productName}, ` +
        `Type: ${a.type} ${a.subType}, ` +
        `Capacity: ${a.capacity} ${a.capacityUnit}, ` +
        `Location: ${a.location}, Building: ${a.building} by ${expire}`;
    } else {
      const buildings = [
        ...new Set(ticket?.assetsId.map((a) => a.building).filter(Boolean)),
      ].join(", ");
      const locations = [
        ...new Set(ticket?.assetsId.map((a) => a.location).filter(Boolean)),
      ].join(", ");

      message =
        `Service Due for Group ID: ${ticket?.groupServiceId?.groupId}, ` +
        `Buildings: ${buildings}, Locations: ${locations} by ${expire}`;
    }

    // — org user —
    docs.push({
      userId: ticket?.orgUserId,
      plantId: ticket?.plantId,
      categoryId: ticket?.productCategoryId,
      title: "Service Due",
      message,
    });

    // — technicians (dedup) —
    const techIds = new Set();

    if (isIndividual) {
      for (const tech of ticket?.assetsId?.[0]?.technicianUserId || []) {
        techIds.add(String(tech._id));
      }
    } else {
      for (const asset of ticket?.assetsId) {
        for (const tech of asset.technicianUserId || []) {
          techIds.add(String(tech._id));
        }
      }
    }

    techIds.forEach((id) =>
      docs.push({ userId: id, title: "Service Due", message })
    );
  }

  // ---------- single bulk-insert ----------
  if (docs.length === 0) return 0;

  const result = await Notification.insertMany(docs, { ordered: false });
  return result.length; // 👈 count inserted
}

cron.schedule("0 9 * * *", task, {
  timezone: "Asia/Kolkata",
});
