// Seeder (fixed forms part + minor safe cleanups)

const mongoose = require("mongoose"); // <- fixed import
const bcrypt = require("bcryptjs");
// const { faker } = require("@faker-js/faker"); // unused right now

// Local database connection string
const mongoURI = "mongodb://127.0.0.1:27017/firedesk";

// Import your Mongoose models
const User = require("./models/user");
const Category = require("./models/admin/masterData/category");
const City = require("./models/admin/masterData/city");
const Industry = require("./models/admin/masterData/industry");
const Client = require("./models/admin/client/Client");
const Technician = require("./models/organization/technician/Technician");
const Manager = require("./models/organization/manager/Manager");
const State = require("./models/admin/masterData/state");
const Form = require("./models/admin/serviceForms/Form");
const Question = require("./models/admin/serviceForms/Question");
const selfAudit = require("./models/admin/masterData/selfAudit");

// Data from the first seeder, which takes precedence
const adminUser = {
  name: "Firedesk Admin",
  email: "admin@gmail.com",
  phone: "7996646188",
  password: "admin",
  userType: "admin",
};

// ---- FORMS TEMPLATE DATA (used only for seeding) ----
const forms = [
  {
    serviceName: "PUMP ROOM SERVICE",
    sections: [
      {
        name: "A.1. Standard Inspection Check List - Weekly Inspection",
        testFrequency: "Weekly",
        serviceType: "Inspection",
        questions: [
          "Intake air louvers in pump room appear operational.",
          "Pump suction, discharge, and bypass valves are open.",
          "No piping or hoses leak.",
          "Fire pump leaking one drop of water per second at seals.",
          "Suction line pressure is normal.",
          "System line pressure is normal.",
          "Wet pit suction screens are unobstructed and in place",
          "Water flow test valves are in the closed position",
        ],
      },
      {
        name: "A.2. Standard Inspection Check List - Monthly Inspection",
        testFrequency: "Monthly",
        serviceType: "Inspection",
        questions: [
          "Remove battery corrosion; clean and dry battery case.",
          "Check battery charger and charger rate.",
          "Equalize charge in battery system.",
          "Exercise isolating switch and circuit breaker.",
          "Inspect, clean, and test circuit breakers.",
        ],
      },
      {
        name: "A.3. Standard Inspection Check List - Quarterly Inspection",
        testFrequency: "Quarterly",
        serviceType: "Inspection",
        questions: [
          "Check crankcase breather on diesel pump for proper operation.",
          "Clean water strainer in cooling system for diesel fire pump.",
          "Check exhaust system insulation for integrity.",
          "Check exhaust system clearance to combustibles to prevent fire hazard.",
          "Check battery terminals to ensure they are clean and tight.",
        ],
      },
      {
        name: "A.4. Standard Inspection Check List - Yearly Inspection",
        testFrequency: "Yearly",
        serviceType: "Inspection",
        questions: [
          "Suction line control valves are sealed open.",
          "Discharge line control valves are sealed open.",
          "Bypass line control valves are sealed open.",
          "All control valves are accessible.",
          "Suction reservoir is full.",
        ],
      },
      {
        name: "B.1. Maintenance: Quarterly",
        testFrequency: "Quarterly",
        serviceType: "Maintenance",
        questions: [
          "Clean strainer.",
          "Clean filter.",
          "Clean dirt leg.",
          "Clean crankcase breather.",
          "Clean water strainer of cooling system.",
          "Clean and tighten battery terminals.",
          "Examine wire insulation for breaks, cracks, or chafing.",
        ],
      },
      {
        name: "B.2. Maintenance: Semi-Annual (diesel pumps only)",
        testFrequency: "Semi-Annual",
        serviceType: "Maintenance",
        questions: [
          "Test antifreeze level.",
          "Inspect flexible exhaust section of diesel exhaust piping.",
          "Clean boxes, panels, and cabinets.",
          "Test all safeties and alarms for proper operation.",
        ],
      },
      {
        name: "B.3. Maintenance: Yearly",
        testFrequency: "Yearly",
        serviceType: "Maintenance",
        questions: [
          "Lubricate pump bearings.",
          "Lubricate coupling.",
          "Lubricate right-angle gear drive.",
          "Grease motor bearings.",
          "Replace flexible hoses and connector.",
          "Replace oil at 50 hours or annually.",
          "Replace oil filter at 50 hours or annually.",
          "Calibrate pressure switch settings.",
          "Check accuracy of pressure sensors.",
          "Clean pump room louvers.",
          "Remove water and foreign material from diesel fuel tank.",
          "Rod out the heat exchanger or cooling system.",
          "Fire pump controller in service.",
          "Jockey pump controller in service.",
        ],
      },
      {
        name: "C.1. Testing - Weekly",
        testFrequency: "Weekly",
        serviceType: "Testing",
        questions: [
          "Operate electric fire pumps for 10 minutes monthly.",
          "Operate diesel fire pump for 30 minutes weekly.",
          "Check packing gland tightness (slight leak at no flow).",
          "For reduced-voltage or reduced-current starting, record time controller is on.",
          "Record time pump runs after starting for pumps having automatic stop feature.",
          "Record time for diesel engine to crank.",
          "Record time for diesel engine to reach running speed.",
          "Check controller alarms.",
          "Record any notes that the inspector believes to be significant.",
        ],
      },
      {
        name: "C.2. Testing - Monthly",
        testFrequency: "Monthly",
        serviceType: "Testing",
        questions: [
          "Exercise isolating switch and circuit breaker.",
          "Test antifreeze to determine protection level.",
          "Test batteries for specific gravity or state of charge.",
          "Test circuit breakers and fuses for proper operation.",
        ],
      },
      {
        name: "C.3. Testing - Yearly",
        testFrequency: "Yearly",
        serviceType: "Testing",
        questions: [
          "Operate manual starting means.",
          "Operate safety devices and alarms.",
        ],
      },
    ],
  },
  {
    serviceName: "FIRE EXTINGUSHER SERVICE", // keep spelling consistent with category map below
    sections: [
      {
        name: "A. Standard Inspection Check List",
        testFrequency: "",
        serviceType: "Inspection",
        questions: [
          "Fire Extingusher location in designated place, the fire extinguisher should be at a reasonable height that can be accessible to mobile and non-mobile individuals.",
          "No obstruction to access or visibility, ensure there are no objects in front of the extinguisher, on the floor, or below the extinguisher etc.",
          "Operating instructions on nameplate legible and facing outward",
          "Safety seals and tamper indicators not broken or missing",
          "Fullness determined by weighing or “hefting”",
          "Examination for obvious physical damage, corrosion, leakage, or clogged nozzle",
          "Pressure gauge reading or indicator in the operable range or position",
          "Condition of tires, wheels, carriage, hose, and nozzle checked (for wheeled units)",
          "HMIS (Hazardous Materials Information System) label in place",
        ],
      },
      {
        name: "B. Standard Maintenance and Service Checklist",
        testFrequency: "",
        serviceType: "Maintenance",
        questions: [
          "GPS location: Collect or verify the GPS location of the hydrant",
          "Exterior physical condition of the extinguisher is inspected.",
          "Stickers and labels are legible and the extinguisher type and instruction is clearly visible.",
          "Hose is removed and visually inspected",
          "Air is passed through the hose to ensure good working order.",
          "The extinguisher is inverted and felt for solid agent falling inside the cylinder.",
          "Zip tie or plastic tie removed from pin.",
          "A discharge valve is fit to the hose port.",
          "Pull pin is removed, inspected and set aside.",
          "The extinguisher is discharged to the appropriate receptacle type.",
          "The valve is removed from the cylinder and set aside.",
          "The cylinder is inspected using a dental mirror and light or camera snake to ensure the interior of the cylinder lacks corrosion and is in good condition.",
          "The valve is inspected and rebuilt.",
          "The spring, valve stem and o-ring are removed and set aside.",
          "The valve is thoroughly cleaned and tested with compressed air for proper flow.",
          "New valve stem and o-rings are installed.",
          "The cylinder threads are cleaned and the cylinder wiped free of any dust or dirt.",
          "A maintenance/service verification collar is installed to the cylinder.",
          "The valve is reinstalled to the appropriate torque.",
          "The fire extinguisher is recharged with the appropriate agent.",
        ],
      },
      {
        name: "C. Testing",
        testFrequency: "",
        serviceType: "Testing",
        questions: [
          "Hydrostatic testing is required",
          "External examination completed and passed.",
          "Internal examination completed and passed.",
          "Fill test completed and passed.",
          "Extinguisher rebuilt and labelled according to internal inspection procedure above.",
          "Hydrostatic test label applied, including notes of the pressure at which the test was performed.",
        ],
      },
    ],
  },
  {
    serviceName: "FIRE HYDRANT SERVICE",
    sections: [
      {
        name: "A. Standard Inspection Check List",
        testFrequency: "",
        serviceType: "Inspection",
        questions: [
          "Are the hydrant point and fire box easily visible?",
          "Is there a sign indicating the hydrant location?",
          "Is it clear from obstructions e.g. vehicles, storage of goods, vegetation?",
          "Is it easily accessible?",
          "Is the hydrant outlet located about 18 inches above ground level (applicable to pillar hydrant)?",
          "Is it protected from possible impact damage? (e.g. by guard rails etc.)",
          "Is the hydrant free from any sign of corrosion?",
          "Is the canvas hose connection device on the hydrant in good working condition?",
          "Is the rubber washer intact & in good condition?",
          "Is the hand wheel / T-bar available & in good condition?",
          "Are the hydrant and piping free from water leakage?",
          "Are the hose, nozzle and coupling provided in the fire box?",
          "Are the hose, nozzle and coupling in good condition?",
          "Is the fire box locked and the key conveniently secured in a break glass box?",
        ],
      },
      {
        name: "B. Standard Maintenance Check List",
        testFrequency: "",
        serviceType: "Maintenance",
        questions: [
          "GPS location: Collect or verify the GPS location of the hydrant",
          "Leakage: Check for leakage at the flanges, operating nut, and nozzle caps.",
          "Lubrication: Check the operating nut lubrication and maintain as needed",
          "Air is passed through the hose to ensure good working order.",
        ],
      },
      {
        name: "C. Standard Testing Check List",
        testFrequency: "",
        serviceType: "Testing",
        questions: [
          "Operation: Test the hydrant valve for operation",
          "Water clarity: Inspect the water clarity",
          "Isolation valves: Ensure that the isolation valves are open",
        ],
      },
    ],
  },
];

// ---- SELF-AUDIT TEMPLATE (minimal, schema-agnostic: name + categories) ----
const selfAudits = [
  {
    name: "Fire Safety Self Audit",
    categories: [
      {
        categoryName: "FIRE EXITS AND EVACUATION",
        questions: [
          {
            questionText:
              "Emergency Exits: Verify that all emergency exits are clearly marked and unobstructed.",
            questionType: "Yes/No",
          },
          {
            questionText:
              "Exit Signs and Lighting: Check if exit signs are illuminated and visible in case of power failure.",
            questionType: "Yes/No",
          },
          {
            questionText:
              "Evacuation Plan: Ensure that the workplace has an updated evacuation plan posted.",
            questionType: "Yes/No",
          },
          {
            questionText:
              "Observations / Notes:[Insert Fire Safety checklist observations and corrective actions, if any]",
            questionType: "Input",
          },
        ],
      },
      {
        categoryName: "FIRE ALARM SYSTEM",
        questions: [
          {
            questionText:
              "Fire Alarms: Inspect fire alarm systems for proper functioning and regular testing.",
            questionType: "Yes/No",
          },
          {
            questionText:
              "Audible Alarms: Check if audible alarms can be heard throughout the workplace.",
            questionType: "Yes/No",
          },
          {
            questionText:
              "Fire Drills: Verify that regular fire drills are conducted with documented results.",
            questionType: "Yes/No",
          },
          {
            questionText:
              "Observations / Notes: [Insert Fire Safety checklist observations and corrective actions, if any]",
            questionType: "Input",
          },
        ],
      },
      {
        categoryName: "FIRE EXTINGUISHERS",
        questions: [
          {
            questionText:
              "Extinguisher Types: Inspect fire extinguishers for the appropriate type based on potential hazards.",
            questionType: "Yes/No",
          },
          {
            questionText:
              "Extinguisher Locations: Check if fire extinguishers are easily accessible and properly mounted.",
            questionType: "Yes/No",
          },
          {
            questionText:
              "Extinguisher Inspections: Ensure that fire extinguishers are inspected as required.",
            questionType: "Yes/No",
          },
          {
            questionText:
              "Observations / Notes: [Insert Fire Safety checklist observations and corrective actions, if any]",
            questionType: "Input",
          },
        ],
      },
      {
        categoryName: "SPRINKLER SYSTEMS",
        questions: [
          {
            questionText:
              "Sprinkler Locations: Verify that sprinkler heads are not blocked and provide adequate coverage.",
            questionType: "Yes/No",
          },
          {
            questionText:
              "System Maintenance: Check if sprinkler systems are properly maintained and inspected.",
            questionType: "Yes/No",
          },
          {
            questionText:
              "Activation Mechanism: Ensure that the sprinkler system is automatically activated when needed.",
            questionType: "Yes/No",
          },
          {
            questionText:
              "Observations / Notes: [Insert Fire Safety checklist observations and corrective actions, if any]",
            questionType: "Input",
          },
        ],
      },
      {
        categoryName: "FIRE SUPPRESSION EQUIPMENT",
        questions: [
          {
            questionText:
              "Suppression Equipment: Inspect any additional fire suppression systems in place (e.g., foam, gas).",
            questionType: "Yes/No",
          },
          {
            questionText:
              "Proper Functioning: Check that fire suppression equipment is in good working condition.",
            questionType: "Yes/No",
          },
          {
            questionText:
              "Maintenance Records: Verify that maintenance records for fire suppression equipment are available.",
            questionType: "Yes/No",
          },
          {
            questionText:
              "Observations / Notes: [Insert Fire Safety checklist observations and corrective actions, if any]",
            questionType: "Input",
          },
        ],
      },
      {
        categoryName: "FIRE HAZARDS AND HOUSEKEEPING",
        questions: [
          {
            questionText:
              "Combustible Materials: Identify and address potential fire hazards related to combustible materials.",
            questionType: "Yes/No",
          },
          {
            questionText:
              "Housekeeping: Ensure that work areas are kept clean and free from clutter.",
            questionType: "Yes/No",
          },
          {
            questionText:
              "Electrical Hazards: Check for electrical hazards that may lead to fire incidents.",
            questionType: "Yes/No",
          },
          {
            questionText:
              "Observations / Notes: [Insert Fire Safety checklist observations and corrective actions, if any]",
            questionType: "Input",
          },
        ],
      },
      {
        categoryName: "FIRE SAFETY TRAINING",
        questions: [
          {
            questionText:
              "Fire Safety Training: Review training records to ensure employees have received fire safety training.",
            questionType: "Yes/No",
          },
          {
            questionText:
              "Training Frequency: Verify that fire safety training is conducted at least annually.",
            questionType: "Yes/No",
          },
          {
            questionText:
              "Fire Safety Roles: Ensure that designated employees understand their roles during emergencies.",
            questionType: "Yes/No",
          },
          {
            questionText:
              "Observations / Notes: [Insert Fire Safety checklist observations and corrective actions, if any]",
            questionType: "Input",
          },
        ],
      },
      {
        categoryName: "FIRE SAFETY SIGNAGE",
        questions: [
          {
            questionText:
              "Fire Safety Signs: Check if fire safety signs are placed appropriately (e.g., 'No Smoking' signs).",
            questionType: "Yes/No",
          },
          {
            questionText:
              "Fire Extinguisher Signs: Ensure that fire extinguisher location signs are visible and legible.",
            questionType: "Yes/No",
          },
          {
            questionText:
              "Exit Signs: Verify that exit signs are properly illuminated and well-maintained.",
            questionType: "Yes/No",
          },
          {
            questionText:
              "Observations / Notes: [Insert Fire Safety checklist observations and corrective actions, if any]",
            questionType: "Input",
          },
        ],
      },
    ],
  },
];

//***
// Seeder
const seedAllData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoURI, {});
    console.log("MongoDB connected successfully!");

    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    // --- 1. Seeding Admin, Forms, Questions, and Self-Audits (precedence) ---
    console.log("Seeding Admin, Forms, Questions, and Self-Audits...");

    const adminUserExists = await User.findOne({
      email: adminUser.email,
      userType: "admin",
    });
    if (!adminUserExists) {
      await User.create({
        ...adminUser,
        password: await bcrypt.hash(adminUser.password, 10),
      });
      console.log("Admin user created.");
    } else {
      console.log("Admin user already exists. Skipping.");
    }

    const formsCreated = await Form.find({});
    if (formsCreated.length === 0) {
      // FIX: use the declared `forms` array (not `formsData`)
      for (const formData of forms) {
        const formDoc = await Form.create({
          formName: formData.serviceName,
          serviceName: formData.serviceName,
          status: "Active",
        });

        for (const section of formData.sections) {
          const questionsToInsert = section.questions.map((q) => ({
            question: q,
            testFrequency: section.testFrequency,
            serviceType: section.serviceType,
            formId: formDoc._id,
          }));
          await Question.insertMany(questionsToInsert);
        }
      }
      console.log("Forms and questions seeded successfully!");
    } else {
      console.log("Forms and questions already exist. Skipping.");
    }

    const selfAuditsCreated = await selfAudit.find({});
    if (selfAuditsCreated.length === 0) {
      for (const sa of selfAudits) {
        // Minimal insert that matches typical template schema
        await selfAudit.create({
          name: sa.name,
          categories: sa.categories,
        });
      }
      console.log("Self-audits seeded successfully!");
    } else {
      console.log("Self-audits already exist. Skipping.");
    }

    // --- 2. Master Data Seeding ---
    console.log("Seeding Master Data...");

    await State.deleteMany({});
    const statesToInsert = [
      { stateName: "Andhra Pradesh", status: "Active" },
      { stateName: "Arunachal Pradesh", status: "Active" },
      { stateName: "Assam", status: "Active" },
      { stateName: "Bihar", status: "Active" },
      { stateName: "Chhattisgarh", status: "Active" },
      { stateName: "Goa", status: "Active" },
      { stateName: "Gujarat", status: "Active" },
      { stateName: "Haryana", status: "Active" },
      { stateName: "Himachal Pradesh", status: "Active" },
      { stateName: "Jharkhand", status: "Active" },
      { stateName: "Karnataka", status: "Active" },
      { stateName: "Kerala", status: "Active" },
      { stateName: "Madhya Pradesh", status: "Active" },
      { stateName: "Maharashtra", status: "Active" },
      { stateName: "Manipur", status: "Active" },
      { stateName: "Meghalaya", status: "Active" },
      { stateName: "Mizoram", status: "Active" },
      { stateName: "Nagaland", status: "Active" },
      { stateName: "Odisha", status: "Active" },
      { stateName: "Punjab", status: "Active" },
      { stateName: "Rajasthan", status: "Active" },
      { stateName: "Sikkim", status: "Active" },
      { stateName: "Tamil Nadu", status: "Active" },
      { stateName: "Telangana", status: "Active" },
      { stateName: "Tripura", status: "Active" },
      { stateName: "Uttar Pradesh", status: "Active" },
      { stateName: "Uttarakhand", status: "Active" },
      { stateName: "West Bengal", status: "Active" },
    ];
    const states = await State.insertMany(statesToInsert);
    const stateMap = new Map(
      states.map((state) => [state.stateName, state._id])
    );

    await City.deleteMany({});
    const citiesToInsert = [
      {
        cityName: "Visakhapatnam",
        status: "Active",
        stateId: stateMap.get("Andhra Pradesh"),
      },
      {
        cityName: "Vijayawada",
        status: "Active",
        stateId: stateMap.get("Andhra Pradesh"),
      },
      {
        cityName: "Guntur",
        status: "Active",
        stateId: stateMap.get("Andhra Pradesh"),
      },
      {
        cityName: "Nellore",
        status: "Active",
        stateId: stateMap.get("Andhra Pradesh"),
      },
      {
        cityName: "Itanagar",
        status: "Active",
        stateId: stateMap.get("Arunachal Pradesh"),
      },
      {
        cityName: "Tawang",
        status: "Active",
        stateId: stateMap.get("Arunachal Pradesh"),
      },
      {
        cityName: "Pasighat",
        status: "Active",
        stateId: stateMap.get("Arunachal Pradesh"),
      },
      {
        cityName: "Guwahati",
        status: "Active",
        stateId: stateMap.get("Assam"),
      },
      { cityName: "Silchar", status: "Active", stateId: stateMap.get("Assam") },
      {
        cityName: "Dibrugarh",
        status: "Active",
        stateId: stateMap.get("Assam"),
      },
      { cityName: "Jorhat", status: "Active", stateId: stateMap.get("Assam") },
      { cityName: "Patna", status: "Active", stateId: stateMap.get("Bihar") },
      { cityName: "Gaya", status: "Active", stateId: stateMap.get("Bihar") },
      {
        cityName: "Muzaffarpur",
        status: "Active",
        stateId: stateMap.get("Bihar"),
      },
      {
        cityName: "Bhagalpur",
        status: "Active",
        stateId: stateMap.get("Bihar"),
      },
      {
        cityName: "Raipur",
        status: "Active",
        stateId: stateMap.get("Chhattisgarh"),
      },
      {
        cityName: "Bilaspur",
        status: "Active",
        stateId: stateMap.get("Chhattisgarh"),
      },
      {
        cityName: "Durg-Bhilainagar",
        status: "Active",
        stateId: stateMap.get("Chhattisgarh"),
      },
      {
        cityName: "Korba",
        status: "Active",
        stateId: stateMap.get("Chhattisgarh"),
      },
      { cityName: "Panaji", status: "Active", stateId: stateMap.get("Goa") },
      {
        cityName: "Vasco da Gama",
        status: "Active",
        stateId: stateMap.get("Goa"),
      },
      { cityName: "Margao", status: "Active", stateId: stateMap.get("Goa") },
      {
        cityName: "Ahmedabad",
        status: "Active",
        stateId: stateMap.get("Gujarat"),
      },
      { cityName: "Surat", status: "Active", stateId: stateMap.get("Gujarat") },
      {
        cityName: "Vadodara",
        status: "Active",
        stateId: stateMap.get("Gujarat"),
      },
      {
        cityName: "Rajkot",
        status: "Active",
        stateId: stateMap.get("Gujarat"),
      },
      {
        cityName: "Faridabad",
        status: "Active",
        stateId: stateMap.get("Haryana"),
      },
      {
        cityName: "Gurugram",
        status: "Active",
        stateId: stateMap.get("Haryana"),
      },
      {
        cityName: "Panipat",
        status: "Active",
        stateId: stateMap.get("Haryana"),
      },
      {
        cityName: "Ambala",
        status: "Active",
        stateId: stateMap.get("Haryana"),
      },
      {
        cityName: "Shimla",
        status: "Active",
        stateId: stateMap.get("Himachal Pradesh"),
      },
      {
        cityName: "Dharamshala",
        status: "Active",
        stateId: stateMap.get("Himachal Pradesh"),
      },
      {
        cityName: "Mandi",
        status: "Active",
        stateId: stateMap.get("Himachal Pradesh"),
      },
      {
        cityName: "Ranchi",
        status: "Active",
        stateId: stateMap.get("Jharkhand"),
      },
      {
        cityName: "Jamshedpur",
        status: "Active",
        stateId: stateMap.get("Jharkhand"),
      },
      {
        cityName: "Dhanbad",
        status: "Active",
        stateId: stateMap.get("Jharkhand"),
      },
      {
        cityName: "Bokaro",
        status: "Active",
        stateId: stateMap.get("Jharkhand"),
      },
      {
        cityName: "Bengaluru",
        status: "Active",
        stateId: stateMap.get("Karnataka"),
      },
      {
        cityName: "Mysuru",
        status: "Active",
        stateId: stateMap.get("Karnataka"),
      },
      {
        cityName: "Hubballi-Dharwad",
        status: "Active",
        stateId: stateMap.get("Karnataka"),
      },
      {
        cityName: "Mangaluru",
        status: "Active",
        stateId: stateMap.get("Karnataka"),
      },
      {
        cityName: "Thiruvananthapuram",
        status: "Active",
        stateId: stateMap.get("Kerala"),
      },
      { cityName: "Kochi", status: "Active", stateId: stateMap.get("Kerala") },
      {
        cityName: "Kozhikode",
        status: "Active",
        stateId: stateMap.get("Kerala"),
      },
      {
        cityName: "Thrissur",
        status: "Active",
        stateId: stateMap.get("Kerala"),
      },
      {
        cityName: "Bhopal",
        status: "Active",
        stateId: stateMap.get("Madhya Pradesh"),
      },
      {
        cityName: "Indore",
        status: "Active",
        stateId: stateMap.get("Madhya Pradesh"),
      },
      {
        cityName: "Gwalior",
        status: "Active",
        stateId: stateMap.get("Madhya Pradesh"),
      },
      {
        cityName: "Jabalpur",
        status: "Active",
        stateId: stateMap.get("Madhya Pradesh"),
      },
      {
        cityName: "Mumbai",
        status: "Active",
        stateId: stateMap.get("Maharashtra"),
      },
      {
        cityName: "Pune",
        status: "Active",
        stateId: stateMap.get("Maharashtra"),
      },
      {
        cityName: "Nagpur",
        status: "Active",
        stateId: stateMap.get("Maharashtra"),
      },
      {
        cityName: "Nashik",
        status: "Active",
        stateId: stateMap.get("Maharashtra"),
      },
      {
        cityName: "Aurangabad",
        status: "Active",
        stateId: stateMap.get("Maharashtra"),
      },
      {
        cityName: "Imphal",
        status: "Active",
        stateId: stateMap.get("Manipur"),
      },
      {
        cityName: "Shillong",
        status: "Active",
        stateId: stateMap.get("Meghalaya"),
      },
      {
        cityName: "Tura",
        status: "Active",
        stateId: stateMap.get("Meghalaya"),
      },
      {
        cityName: "Aizawl",
        status: "Active",
        stateId: stateMap.get("Mizoram"),
      },
      {
        cityName: "Kohima",
        status: "Active",
        stateId: stateMap.get("Nagaland"),
      },
      {
        cityName: "Dimapur",
        status: "Active",
        stateId: stateMap.get("Nagaland"),
      },
      {
        cityName: "Bhubaneswar",
        status: "Active",
        stateId: stateMap.get("Odisha"),
      },
      {
        cityName: "Cuttack",
        status: "Active",
        stateId: stateMap.get("Odisha"),
      },
      {
        cityName: "Rourkela",
        status: "Active",
        stateId: stateMap.get("Odisha"),
      },
      {
        cityName: "Brahmapur",
        status: "Active",
        stateId: stateMap.get("Odisha"),
      },
      {
        cityName: "Chandigarh",
        status: "Active",
        stateId: stateMap.get("Punjab"),
      },
      {
        cityName: "Ludhiana",
        status: "Active",
        stateId: stateMap.get("Punjab"),
      },
      {
        cityName: "Amritsar",
        status: "Active",
        stateId: stateMap.get("Punjab"),
      },
      {
        cityName: "Jalandhar",
        status: "Active",
        stateId: stateMap.get("Punjab"),
      },
      {
        cityName: "Jaipur",
        status: "Active",
        stateId: stateMap.get("Rajasthan"),
      },
      {
        cityName: "Jodhpur",
        status: "Active",
        stateId: stateMap.get("Rajasthan"),
      },
      {
        cityName: "Udaipur",
        status: "Active",
        stateId: stateMap.get("Rajasthan"),
      },
      {
        cityName: "Kota",
        status: "Active",
        stateId: stateMap.get("Rajasthan"),
      },
      {
        cityName: "Gangtok",
        status: "Active",
        stateId: stateMap.get("Sikkim"),
      },
      {
        cityName: "Chennai",
        status: "Active",
        stateId: stateMap.get("Tamil Nadu"),
      },
      {
        cityName: "Coimbatore",
        status: "Active",
        stateId: stateMap.get("Tamil Nadu"),
      },
      {
        cityName: "Madurai",
        status: "Active",
        stateId: stateMap.get("Tamil Nadu"),
      },
      {
        cityName: "Tiruchirappalli",
        status: "Active",
        stateId: stateMap.get("Tamil Nadu"),
      },
      {
        cityName: "Hyderabad",
        status: "Active",
        stateId: stateMap.get("Telangana"),
      },
      {
        cityName: "Warangal",
        status: "Active",
        stateId: stateMap.get("Telangana"),
      },
      {
        cityName: "Nizamabad",
        status: "Active",
        stateId: stateMap.get("Telangana"),
      },
      {
        cityName: "Agartala",
        status: "Active",
        stateId: stateMap.get("Tripura"),
      },
      {
        cityName: "Lucknow",
        status: "Active",
        stateId: stateMap.get("Uttar Pradesh"),
      },
      {
        cityName: "Kanpur",
        status: "Active",
        stateId: stateMap.get("Uttar Pradesh"),
      },
      {
        cityName: "Ghaziabad",
        status: "Active",
        stateId: stateMap.get("Uttar Pradesh"),
      },
      {
        cityName: "Agra",
        status: "Active",
        stateId: stateMap.get("Uttar Pradesh"),
      },
      {
        cityName: "Varanasi",
        status: "Active",
        stateId: stateMap.get("Uttar Pradesh"),
      },
      {
        cityName: "Dehradun",
        status: "Active",
        stateId: stateMap.get("Uttarakhand"),
      },
      {
        cityName: "Haridwar",
        status: "Active",
        stateId: stateMap.get("Uttarakhand"),
      },
      {
        cityName: "Rishikesh",
        status: "Active",
        stateId: stateMap.get("Uttarakhand"),
      },
      {
        cityName: "Haldwani",
        status: "Active",
        stateId: stateMap.get("Uttarakhand"),
      },
      {
        cityName: "Kolkata",
        status: "Active",
        stateId: stateMap.get("West Bengal"),
      },
      {
        cityName: "Howrah",
        status: "Active",
        stateId: stateMap.get("West Bengal"),
      },
      {
        cityName: "Durgapur",
        status: "Active",
        stateId: stateMap.get("West Bengal"),
      },
      {
        cityName: "Siliguri",
        status: "Active",
        stateId: stateMap.get("West Bengal"),
      },
    ];
    const cities = await City.insertMany(citiesToInsert);

    await Industry.deleteMany({});
    const industriesToInsert = [
      { industryName: "Manufacturing", status: "Active" },
      { industryName: "IT Services", status: "Active" },
      { industryName: "Hospitality", status: "Active" },
      { industryName: "Retail", status: "Active" },
      { industryName: "Healthcare", status: "Active" },
      { industryName: "Construction", status: "Active" },
      { industryName: "Education", status: "Active" },
      { industryName: "Real Estate", status: "Active" },
      { industryName: "Logistics", status: "Active" },
      { industryName: "Banking & Finance", status: "Active" },
      { industryName: "Energy", status: "Active" },
    ];
    const industries = await Industry.insertMany(industriesToInsert);

    // Categories are dependent on Forms, so we handle them after
    await Category.deleteMany({});
    const formsFromDb = await Form.find({}); // <- renamed to avoid shadowing
    let categories = [];
    if (formsFromDb.length > 0) {
      const formMap = new Map(
        formsFromDb.map((form) => [form.serviceName, form._id])
      );
      const categoriesToInsert = [
        {
          categoryName: "Fire Extinguishers",
          status: "Active",
          formId: formMap.get("FIRE EXTINGUSHER SERVICE"),
        },
        {
          categoryName: "Fire Hydrant",
          status: "Active",
          formId: formMap.get("FIRE HYDRANT SERVICE"),
        },
        {
          categoryName: "Pump Room",
          status: "Active",
          formId: formMap.get("PUMP ROOM SERVICE"),
        },
      ];
      categories = await Category.insertMany(categoriesToInsert);
      console.log("Categories seeded successfully!");
    } else {
      console.log("Forms were not seeded, skipping category seeding.");
    }

    console.log("Master data seeded successfully!");

    // --- 3. User Data Seeding (excluding admin) ---
    console.log("Seeding User and Core Business Data...");

    await User.deleteMany({ userType: { $ne: "admin" } });

    const orgUsersData = [
      {
        name: "Synergy Manufacturing Pvt. Ltd.",
        userType: "organization",
        phone: "9876543210",
        email: "contact@synergy-mfg.com",
        password: hashedPassword,
        loginID: "ORG001",
        status: "Active",
      },
      {
        name: "Apollo Hospitals Group",
        userType: "organization",
        phone: "9876543211",
        email: "admin@apollohospitals.com",
        password: hashedPassword,
        loginID: "ORG002",
        status: "Active",
      },
      {
        name: "Tech-Forward Solutions Inc.",
        userType: "organization",
        phone: "9876543212",
        email: "it@techforward.com",
        password: hashedPassword,
        loginID: "ORG003",
        status: "Active",
      },
    ];
    const orgUsers = await User.insertMany(orgUsersData);
    console.log("Organization users created with login IDs:");
    orgUsers.forEach((user) =>
      console.log(`- User ID: ${user._id}, Login ID: ${user.loginID}`)
    );
    console.log("------------------------");

    const managerUsersData = [
      {
        name: "Suresh Mishra",
        userType: "manager",
        phone: "9911111111",
        email: "suresh.mishra@synergy-mfg.com",
        password: hashedPassword,
        loginID: "MNGR001",
        status: "Active",
      },
      {
        name: "Priya Sharma",
        userType: "manager",
        phone: "9911111112",
        email: "priya.sharma@apollohospitals.com",
        password: hashedPassword,
        loginID: "MNGR002",
        status: "Active",
      },
      {
        name: "Anil Kumar",
        userType: "manager",
        phone: "9911111113",
        email: "anil.kumar@synergy-mfg.com",
        password: hashedPassword,
        loginID: "MNGR003",
        status: "Active",
      },
      {
        name: "Anjali Gupta",
        userType: "manager",
        phone: "9911111114",
        email: "anjali.gupta@techforward.com",
        password: hashedPassword,
        loginID: "MNGR004",
        status: "Active",
      },
      {
        name: "Rahul Deshpande",
        userType: "manager",
        phone: "9911111115",
        email: "rahul.desh@apollohospitals.com",
        password: hashedPassword,
        loginID: "MNGR005",
        status: "Active",
      },
      {
        name: "Neha Singh",
        userType: "manager",
        phone: "9911111116",
        email: "neha.singh@techforward.com",
        password: hashedPassword,
        loginID: "MNGR006",
        status: "Active",
      },
    ];
    const managerUsers = await User.insertMany(managerUsersData);
    console.log("Manager users created with login IDs:");
    managerUsers.forEach((user) =>
      console.log(`- User ID: ${user._id}, Login ID: ${user.loginID}`)
    );
    console.log("------------------------");

    const technicianUsersData = [
      {
        name: "Rajesh Patil",
        userType: "technician",
        phone: "9922222221",
        email: "rajesh.patil@synergy-mfg.com",
        password: hashedPassword,
        loginID: "TECH001",
        status: "Active",
      },
      {
        name: "Mohan Lal",
        userType: "technician",
        phone: "9922222222",
        email: "mohan.lal@apollohospitals.com",
        password: hashedPassword,
        loginID: "TECH002",
        status: "Active",
      },
      {
        name: "Fatima Khan",
        userType: "technician",
        phone: "9922222223",
        email: "fatima.khan@techforward.com",
        password: hashedPassword,
        loginID: "TECH003",
        status: "Active",
      },
      {
        name: "Arjun Reddy",
        userType: "technician",
        phone: "9922222224",
        email: "arjun.reddy@synergy-mfg.com",
        password: hashedPassword,
        loginID: "TECH004",
        status: "Active",
      },
      {
        name: "Sanjay Dixit",
        userType: "technician",
        phone: "9922222225",
        email: "sanjay.dixit@apollohospitals.com",
        password: hashedPassword,
        loginID: "TECH005",
        status: "Active",
      },
      {
        name: "David Fernandes",
        userType: "technician",
        phone: "9922222226",
        email: "david.fernandes@techforward.com",
        password: hashedPassword,
        loginID: "TECH006",
        status: "Active",
      },
      {
        name: "Vikram Sharma",
        userType: "technician",
        phone: "9922222227",
        email: "vikram.sharma@synergy-mfg.com",
        password: hashedPassword,
        loginID: "TECH007",
        status: "Active",
      },
      {
        name: "Suman Kumari",
        userType: "technician",
        phone: "9922222228",
        email: "suman.kumari@apollohospitals.com",
        password: hashedPassword,
        loginID: "TECH008",
        status: "Active",
      },
      {
        name: "Tarun Rao",
        userType: "technician",
        phone: "9922222229",
        email: "tarun.rao@techforward.com",
        password: hashedPassword,
        loginID: "TECH009",
        status: "Active",
      },
    ];
    const technicianUsers = await User.insertMany(technicianUsersData);
    console.log("Technician users created with login IDs:");
    technicianUsers.forEach((user) =>
      console.log(`- User ID: ${user._id}, Login ID: ${user.loginID}`)
    );
    console.log("------------------------");

    // --- 4. Core Business Data Seeding ---
    await Client.deleteMany({});
    await Manager.deleteMany({});
    await Technician.deleteMany({});

    // This gets all category IDs to assign to each client
    const allCategoryIds = categories.map((cat) => ({ categoryId: cat._id }));

    const clients = await Client.insertMany(
      orgUsers.map((user, index) => {
        const cityId = cities[index % cities.length]._id;
        return {
          userId: user._id,
          clientType: user.userType,
          orgName: user.name,
          state: states[index % states.length]._id,
          cityId: cityId,
          industryId: industries[index % industries.length]._id,
          categories: allCategoryIds,
          gst: `27DEM0000${index + 1}`,
          pincode: `5700${index + 1}`,
          address: `${user.name} Head Office, Pune`,
        };
      })
    );
    console.log("Clients created.");
    console.log("Clients created with the following data:");
    clients.forEach((client) =>
      console.log(
        `- Client ID: ${client._id}, Org Name: ${client.orgName}, User ID: ${client.userId}`
      )
    );
    console.log("------------------------");

    // Assign 2 managers and 3 technicians to each client
    const managersToInsert = [];
    const techniciansToInsert = [];
    let managerIndex = 0;
    let techIndex = 0;

    clients.forEach((client) => {
      for (let i = 0; i < 2; i++) {
        managersToInsert.push({
          userId: managerUsers[managerIndex]._id,
          orgUserId: client.userId,
          state: client.state,
          city: client.cityId,
          managerId: `MGR-ID-${managerIndex + 1}`,
        });
        managerIndex++;
      }
      for (let i = 0; i < 3; i++) {
        techniciansToInsert.push({
          userId: technicianUsers[techIndex]._id,
          orgId: client.userId, // keep as-is if your Technician schema expects `orgId`
          state: client.state,
          city: client.cityId,
          technicianId: `TEC-ID-${techIndex + 1}`,
          technicianType: "In House",
        });
        techIndex++;
      }
    });

    await Manager.insertMany(managersToInsert);
    console.log("Managers created with the following data:");
    managersToInsert.forEach((manager) =>
      console.log(
        `- Manager ID: ${manager.managerId}, User ID: ${manager.userId}, Org User ID: ${manager.orgUserId}`
      )
    );
    console.log("------------------------");

    await Technician.insertMany(techniciansToInsert);
    console.log("Technicians created with the following data:");
    techniciansToInsert.forEach((technician) =>
      console.log(
        `- Technician ID: ${technician.technicianId}, User ID: ${technician.userId}, Org ID: ${technician.orgId}`
      )
    );
    console.log("------------------------");

    console.log("Managers and Technicians created and linked to clients. 🚀");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await mongoose.disconnect().catch(() => {});
    console.log("Database connection closed.");
  }
};

seedAllData();
