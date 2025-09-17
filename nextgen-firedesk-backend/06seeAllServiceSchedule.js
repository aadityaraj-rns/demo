// seed_strict_schema_all_assets.js
require("dotenv").config();
const mongoose = require("mongoose");
const dbConnect = require("./database");

const ServiceTickets = require("./models/organization/service/ServiceTickets");
const Asset = require("./models/organization/asset/Asset");
const FormResponse = require("./models/technician/FormResponse/FormResponse");
const Category = require("./models/admin/masterData/category");
const Form = require("./models/admin/serviceForms/Form");
const Question = require("./models/admin/serviceForms/Question");
const Technician = require("./models/organization/technician/Technician");

/**
 * Config (via env)
 *
 * PROCESS_ALL=true            -> process ALL assets in DB (careful)
 * OR
 * ASSET_COUNT=100             -> process first N assets
 * OR
 * BATCH_SIZE=100 & BATCH_SKIP=0 -> paged processing
 *
 * MAX_TICKETS=5000           -> global cap across run (tickets created)
 * START_DATE / END_DATE      -> schedule range (defaults provided)
 * 
 * Process first 100 
 * $env:ASSET_COUNT="100"; $env:MAX_TICKETS="5000"; node .\seeAllServiceSchedule2.js
 * 
 * 
 * Process all assets (be careful — may create many tickets):
 * 
 * $env:PROCESS_ALL="true"; $env:MAX_TICKETS="20000"; node .\seed_strict_schema_all_assets.js
 * 
 *Process assets in batches:
 * # first batch
$env:BATCH_SIZE="100"; $env:BATCH_SKIP="0"; node .\seed_strict_schema_all_assets.js

# second batch
$env:BATCH_SIZE="100"; $env:BATCH_SKIP="100"; node .\seed_strict_schema_all_assets.js

*limit tool ticket 
*$env:MAX_TICKETS="5000"; node .\seed_strict_schema_all_assets.js

Date Range
$env:START_DATE="2024-01-01"; $env:END_DATE="2025-08-30"; $env:COMPLETED_PROB="0.7";

 */
const PROCESS_ALL = (process.env.PROCESS_ALL || "false").toLowerCase() === "true";
const ASSET_COUNT = parseInt(process.env.ASSET_COUNT || "0", 10); // 0 => ignored
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || "100", 10);
const BATCH_SKIP = parseInt(process.env.BATCH_SKIP || "0", 10);
const MAX_TICKETS = parseInt(process.env.MAX_TICKETS || "5000", 10);

const START_DATE = process.env.START_DATE || "2024-01-01";
const END_DATE = process.env.END_DATE || "2025-08-30";

// probability of Completed vs Lapsed for past dates
const COMPLETED_PROB = parseFloat(process.env.COMPLETED_PROB || "0.7"); // 0.0 - 1.0

/* ------------------ helpers ------------------ */
function toDayStart(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addDays(d, days) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}
function addMonths(d, months) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + months);
  return x;
}

function buildSchedule(startStr, endStr) {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const out = [];

  // weekly (Inspection)
  let cur = toDayStart(start);
  while (cur <= end) {
    out.push({ serviceType: "Inspection", serviceFrequency: "Weekly", date: new Date(cur) });
    cur = addDays(cur, 7);
  }

  // monthly (Testing)
  cur = new Date(start);
  while (cur <= end) {
    out.push({ serviceType: "Testing", serviceFrequency: "Monthly", date: new Date(cur) });
    cur = addMonths(cur, 1);
  }

  // quarterly (Maintenance)
  cur = new Date(start);
  while (cur <= end) {
    out.push({ serviceType: "Maintenance", serviceFrequency: "Quarterly", date: new Date(cur) });
    cur = addMonths(cur, 3);
  }

  out.sort((a, b) => new Date(a.date) - new Date(b.date));
  return out;
}

function getGeoCheck(asset) {
  if (asset.location?.coordinates?.length === 2) {
    const [lon, lat] = asset.location.coordinates;
    return `${lat},${lon}`;
  }
  if (asset.geoLocation?.latitude && asset.geoLocation?.longitude) {
    return `${asset.geoLocation.latitude},${asset.geoLocation.longitude}`;
  }
  return `ASSET:${asset.assetId || asset._id}`;
}

async function buildQuestions(section) {
  if (!section || !section.questions || !section.questions.length) return [];
  // section.questions may contain ObjectIds or nested objects with _id
  const qIds = section.questions.map((q) => (q && q._id ? q._id : q));
  const qDocs = await Question.find({ _id: { $in: qIds } }).lean();
  const qMap = new Map(qDocs.map((q) => [String(q._id), q.question]));
  return qIds.map((qid) => ({
    question: qMap.get(String(qid)) || "Unknown question",
    answer: "OK",
    note: "Seeder auto-fill",
  }));
}

/**
 * Prefer technicians attached to plant(s) of the asset.
 * Fallback to org-level technicians if none found.
 * Returns array of technician.userId (ObjectId) values.
 */
async function fetchTechnicianUserIdsForAsset(asset) {
  const userIds = [];

  // normalize plantIds
  let plantIds = [];
  if (Array.isArray(asset.plantId)) plantIds = asset.plantId;
  else if (asset.plantId) plantIds = [asset.plantId];

  if (plantIds.length) {
    const plantTechs = await Technician.find({ plantId: { $in: plantIds } }).select("userId").lean();
    plantTechs.forEach((t) => t.userId && userIds.push(t.userId));
  }

  if (userIds.length === 0 && asset.orgUserId) {
    const orgTechs = await Technician.find({ orgId: asset.orgUserId }).select("userId").lean();
    orgTechs.forEach((t) => t.userId && userIds.push(t.userId));
  }

  return Array.from(new Set(userIds.map((u) => String(u)))).map((s) => new mongoose.Types.ObjectId(s));
}



/* ------------------ main ------------------ */
async function runSeeder() {
  try {
    await dbConnect();
    console.log("✅ Database connected");

    // build asset list based on configuration
    let assets = [];
    if (PROCESS_ALL) {
      console.log("Processing ALL assets in DB (PROCESS_ALL=true). This may take a long time.");
      assets = await Asset.find({}).lean();
    } else if (ASSET_COUNT && ASSET_COUNT > 0) {
      console.log(`Processing first ${ASSET_COUNT} assets (ASSET_COUNT)`);
      assets = await Asset.find({}).limit(ASSET_COUNT).lean();
    } else {
      console.log(`Processing batch skip=${BATCH_SKIP} size=${BATCH_SIZE}`);
      assets = await Asset.find({}).skip(BATCH_SKIP).limit(BATCH_SIZE).lean();
    }

    if (!assets.length) {
      console.log("No assets found to process. Exiting.");
      return;
    }

    console.log(`Found ${assets.length} assets to process.`);

    const schedule = buildSchedule(START_DATE, END_DATE);
    console.log(`Schedule entries per asset: ${schedule.length}`);

    let globalTicketCount = 0;
    let globalFormCount = 0;

    for (const asset of assets) {
      if (globalTicketCount >= MAX_TICKETS) break;

      console.log(`\n--- Asset ${asset.assetId || asset._id} ---`);
      const category = await Category.findById(asset.productCategoryId).lean();
      if (!category || !category.formId) {
        console.log("  Skipping: no category/form mapping");
        continue;
      }

      const formTemplate = await Form.findById(category.formId).lean();
      if (!formTemplate) {
        console.log("  Skipping: form template not found");
        continue;
      }

      // prefetch technicians for this asset
      const techUserIds = await fetchTechnicianUserIdsForAsset(asset);
      console.log(`  Technicians available for this asset: ${techUserIds.length}`);

      // per-asset counter for SER numbering if you prefer asset-specific; we'll use a global counter here
      for (const entry of schedule) {
        if (globalTicketCount >= MAX_TICKETS) break;

        const date = toDayStart(entry.date);
        let completedStatus;
        if (date > new Date()) {
          completedStatus = "Pending";
        } else {
          completedStatus = Math.random() < COMPLETED_PROB ? "Completed" : "Lapsed";
        }

        // pick a random tech for Completed or Lapsed (if available)
        let chosenTech = null;
        if ((completedStatus === "Completed" || completedStatus === "Lapsed") && techUserIds.length) {
          chosenTech = techUserIds[Math.floor(Math.random() * techUserIds.length)];
        }

        // build ticket payload (adjust fields as per your ServiceTickets schema)
        const ticketPayload = {
          assetsId: [asset._id],
          categoryId: asset.productCategoryId,
          orgUserId: asset.orgUserId,
          plantId: asset.plantId,
          serviceType: entry.serviceType,
          serviceFrequency: entry.serviceFrequency,
          date,
          expireDate: date,
          completedStatus,
          individualService: true,
        };

        // attach assigned/completed tech if chosen (field name: serviceDoneBy)
        if (chosenTech) ticketPayload.serviceDoneBy = chosenTech;

        const ticket = await ServiceTickets.create(ticketPayload);
        globalTicketCount++;

        // create FormResponse only for Completed
        if (completedStatus === "Completed") {
          // pick matching section
          const section = formTemplate.sectionName.find(
            (s) =>
              s.serviceType === entry.serviceType &&
              (s.testFrequency === "" || s.testFrequency === entry.serviceFrequency)
          );

          const questions = await buildQuestions(section);
          const reportNo = `SER-${String(++globalFormCount).padStart(4, "0")}`;

          const formPayload = {
            serviceTicketId: ticket._id,
            reportNo,
            sectionName: section ? section.name : entry.serviceType,
            questions,
            status: "Completed",
            statusUpdatedAt: date,
            managerRemark: "Initial setup",
            technicianRemark: "No issues found",
            geoCheck: getGeoCheck(asset),
          };

          if (chosenTech) formPayload.statusUpdatedBy = chosenTech;

          const form = await FormResponse.create(formPayload);
          // link back
          await ServiceTickets.findByIdAndUpdate(ticket._id, { submittedFormId: form._id }).catch(() => {});
          console.log(`  ✅ ticket ${ticket._id} & form ${reportNo} (${questions.length} q)`);
        } else {
          // Lapsed or Pending (no FormResponse created)
          if (completedStatus === "Lapsed") {
            console.log(`  ⚠ Lapsed ticket ${ticket._id} assignedTech=${chosenTech || "none"}`);
          } else {
            console.log(`  ⏳ Pending ticket ${ticket._id}`);
          }
        }
      } // schedule loop
    } // assets loop

    console.log(`\nDone. Tickets created: ${globalTicketCount}, Forms created: ${globalFormCount}`);
    console.log(`Stopped because ${globalTicketCount >= MAX_TICKETS ? "reached MAX_TICKETS" : "processed all configured assets"}`);
  } catch (err) {
    console.error("Seeder error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("DB disconnected");
  }
}

runSeeder();
