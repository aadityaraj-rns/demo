const mongoose = require("mongoose");
const dbConnect = require("./database");
const ServiceTickets = require("./models/organization/service/ServiceTickets");
const Asset = require("./models/organization/asset/Asset");
const FormResponse = require("./models/technician/FormResponse/FormResponse");
const category = require("./models/admin/masterData/category");
const Form = require("./models/admin/serviceForms/Form");

const assetId = "SY-EX-0004";

const assetJson = [
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "07/01/2024",
    status: "Completed",
    managerRemark: "Initial setup",
    technicianRemark: "No issues found",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "07/08/2024",
    status: "Completed",
    managerRemark: "Initial setup",
    technicianRemark: "No issues found",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "07/15/2024",
    status: "Completed",
    managerRemark: "Initial setup",
    technicianRemark: "No issues found",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "07/22/2024",
    status: "Completed",
    managerRemark: "Initial setup",
    technicianRemark: "No issues found",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "07/29/2024",
    status: "Completed",
    managerRemark: "Initial setup",
    technicianRemark: "No issues found",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "08/05/2024",
    status: "Completed",
    managerRemark: "Initial setup",
    technicianRemark: "No issues found",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "08/12/2024",
    status: "Completed",
    managerRemark: "Initial setup",
    technicianRemark: "No issues found",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "08/19/2024",
    status: "Completed",
    managerRemark: "Initial setup",
    technicianRemark: "No issues found",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "08/26/2024",
    status: "Completed",
    managerRemark: "Initial setup",
    technicianRemark: "No issues found",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "09/02/2024",
    status: "Completed",
    managerRemark: "Initial setup",
    technicianRemark: "No issues found",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "09/09/2024",
    status: "Completed",
    managerRemark: "Initial setup",
    technicianRemark: "No issues found",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "09/16/2024",
    status: "Completed",
    managerRemark: "Initial setup",
    technicianRemark: "No issues found",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "09/23/2024",
    status: "Completed",
    managerRemark: "Initial setup",
    technicianRemark: "No issues found",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "09/30/2024",
    status: "Completed",
    managerRemark: "Initial setup",
    technicianRemark: "No issues found",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "10/07/2024",
    status: "Completed",
    managerRemark: "Initial setup",
    technicianRemark: "No issues found",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "10/14/2024",
    status: "Completed",
    managerRemark: "Initial setup",
    technicianRemark: "No issues found",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "10/21/2024",
    status: "Completed",
    managerRemark: "Initial setup",
    technicianRemark: "No issues found",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "10/28/2024",
    status: "Completed",
    managerRemark: "Initial setup",
    technicianRemark: "No issues found",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "11/04/2024",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "No issues found",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "11/11/2024",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "No issues found",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "11/18/2024",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "No issues found",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "11/25/2024",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "No issues found",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "12/02/2024",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "No issues found",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "12/09/2024",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "No issues found",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "12/16/2024",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "12/23/2024",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "12/30/2024",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "01/06/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "01/13/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "01/20/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "01/27/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "02/03/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "02/10/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "02/17/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "02/24/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "03/03/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "03/10/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "03/17/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "03/24/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "03/31/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "04/07/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "04/14/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "04/21/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "04/28/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "05/05/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "05/12/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "05/19/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "05/26/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "06/02/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "06/09/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Inspection",
    serviceFrequency: "Weekly",
    date: "06/16/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Testing",
    serviceFrequency: "Monthly",
    date: "07/01/2024",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Testing",
    serviceFrequency: "Monthly",
    date: "07/31/2024",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Testing",
    serviceFrequency: "Monthly",
    date: "08/30/2024",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Testing",
    serviceFrequency: "Monthly",
    date: "09/29/2024",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Testing",
    serviceFrequency: "Monthly",
    date: "10/29/2024",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Testing",
    serviceFrequency: "Monthly",
    date: "11/28/2024",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Testing",
    serviceFrequency: "Monthly",
    date: "12/28/2024",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Testing",
    serviceFrequency: "Monthly",
    date: "01/27/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Testing",
    serviceFrequency: "Monthly",
    date: "02/26/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Testing",
    serviceFrequency: "Monthly",
    date: "03/28/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Testing",
    serviceFrequency: "Monthly",
    date: "04/27/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Testing",
    serviceFrequency: "Monthly",
    date: "05/27/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Maintenance",
    serviceFrequency: "Quarterly",
    date: "07/01/2024",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Maintenance",
    serviceFrequency: "Quarterly",
    date: "09/29/2024",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Maintenance",
    serviceFrequency: "Quarterly",
    date: "12/28/2024",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
  {
    serviceType: "Maintenance",
    serviceFrequency: "Quarterly",
    date: "03/28/2025",
    status: "Completed",
    managerRemark: "Ok",
    technicianRemark: "Passed test",
  },
];

async function serviceSeeder() {
  try {
    await dbConnect();
    console.log("✅ Database connected, seeding started...");

    const assetInfo = await Asset.findOne({ assetId }).select(
      "productCategoryId orgUserId plantId"
    );
    if (!assetInfo) {
      console.log("❌ Asset not found");
      return;
    }

    const categoryFind = await category
      .findById(assetInfo.productCategoryId)
      .select("formId");
    if (!categoryFind.formId) {
      console.log("❌ Service form not assigned to the category");
      return;
    }

    const formFind = await Form.findById(categoryFind.formId);

    if (!formFind) {
      console.log("❌ Form not found");
      return;
    }

    const findService = await ServiceTickets.findOne({ assetsId: assetInfo });
    if (findService) {
      console.log(`❌ Service already present for the assetId ${assetId}`);
      return;
    }

    // Build serviceTickets array
    const servicesToInsert = assetJson.map((entry) => ({
      individualService: true,
      categoryId: assetInfo.productCategoryId._id,
      orgUserId: assetInfo.orgUserId,
      plantId: assetInfo.plantId,
      assetsId: [assetInfo._id],
      serviceType: entry.serviceType,
      serviceFrequency: entry.serviceFrequency,
      date: new Date(entry.date),
      expireDate: new Date(entry.date),
      completedStatus: entry.status,
    }));

    // Insert multiple services in one go
    const insertedServices = await ServiceTickets.insertMany(servicesToInsert);

    // Count how many forms already exist for this asset
    let formCount = await ServiceTickets.countDocuments({
      completedStatus: { $nin: ["Pending", "Lapsed"] },
      assetsId: assetInfo._id,
    });

    // For each service, create a form response AND link it back
    for (let idx = 0; idx < insertedServices.length; idx++) {
      const service = insertedServices[idx];
      const entry = assetJson[idx];
      const section = formFind?.sectionName?.find(
        (s) =>
          s.serviceType === entry.serviceType &&
          (s.testFrequency === "" || s.testFrequency === entry.serviceFrequency)
      );

      const reportNo = `SER-${String(++formCount).padStart(4, "0")}`;

      // 1. Create form
      const form = await FormResponse.create({
        serviceTicketId: service._id,
        reportNo,
        sectionName: section ? section.name : null,
        status: entry.status,
        statusUpdatedAt: new Date(entry.date),
        managerRemark: entry.managerRemark,
        technicianRemark: entry.technicianRemark,
      });

      // 2. Update ticket with form ID
      await ServiceTickets.findByIdAndUpdate(service._id, {
        submittedFormId: form._id,
      });

      console.log(`✅ Service & Form linked for ${entry.serviceType}`);
    }

    console.log("🎉 All Services & Forms created and linked successfully");
  } catch (error) {
    console.error("❌ Error inserting services:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔒 Database connection closed");
  }
}

serviceSeeder();
