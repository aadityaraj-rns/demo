
// Seeder (fixed forms part + minor safe cleanups)

const mongoose = require("mongoose"); // <- fixed import
const bcrypt = require("bcryptjs");
// const { faker } = require("@faker-js/faker"); // unused right now

// Local database connection string
const mongoURI = "mongodb://127.0.0.1:27017/firedesk";


const { default: mongoose } = require("mongoose");
const dbConnect = require("./database");
const Form = require("./models/admin/serviceForms/Form");
const Question = require("./models/admin/serviceForms/Question");
const User = require("./models/user");
const selfAudit = require("./models/admin/masterData/selfAudit");
const bcrypt = require("bcryptjs");
const category = require("./models/admin/masterData/category");
const state = require("./models/admin/masterData/state");

const adminUser = {
  name: "Firedesk Admin",
  email: "admin@gmail.com",
  phone: "7996646188",
  password: "admin",
  userType: "admin",
};
// Weekly,Fortnight,Monthly,Quarterly,Semi-Annual,Yearly
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
          "For reduced-voltage or reduced-current starting, record time controller is o",
          "Record time pump runs after starting for pumps having automatic stop fea",
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
    serviceName: "FIRE EXTINGUSHER SERVICE",
    sections: [
      {
        name: "A. Standard Inspection Check List",
        testFrequency: "",
        serviceType: "Inspection",
        questions: [
          "Fire Extingusher location in designated place, the fire extinguisher should be at a reasonable height that can beaccessible to mobile and non-mobile individuals.",
          "No obstruction to access or visibility, ensure there are no objects in front of the extinguisher, onthe floor, or below the extinguisher etc.",
          "Operating instructions on nameplate legible and facing outward",
          "Safety seals and tamper indicators not broken or missing",
          "Fullness determined by weighing or “hefting”",
          "Examination for obvious physical damage, corrosion, leakage, or clogged nozzle",
          "Pressure gauge reading or indicator in the operable range or position",
          "Condition of tires, wheels, carriage, hose, and nozzle checked (for wheeled units)",
          "HMIS (Hazardous Materials Information System ) label in place",
        ],
      },
      {
        name: "B. Standard Maintenance and Service  Checklist",
        testFrequency: "",
        serviceType: "Maintenance",
        questions: [
          "GPS location: Collect or verify the GPS location of the hydrant",
          "Exterior physical condition of the extinguisher is inspected.",
          "Stickers and labels are legable and the extinguisher type and instruction is clearly visible.",
          "Hose is removed and visually inspected",
          "Air is passed through the hose to ensure good working order.",
          "The extinguisher is inverted and felt for solid agent falling inside the cylinder.",
          "Zip tie or plastic tie removed from pin.",
          "A discharge valve is fit to the hose port.",
          "Pull pin is removed, inspected and set aside.",
          "The extinguisher is discharged to the appropriate receptable type.",
          "The valve is removed from the cylinder and set aside.",
          "The cylinder is inspected using a dental mirror and light or camera snake to ensure the interior of the cylinder lacks corrosion and is in good condition.",
          "The valve is inspected and rebuilt.",
          "The spring. valve stem and a-ring are removed and set aside.",
          "The valve is thoroughly cleaned and tested with compressed air for proper flow.",
          "New valve stem and a-rings are installed.",
          "The spring and syphon tube are reinstalled.",
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
          "Extinguisher rebuilt and labelled according to internal Inspection procedure above.",
          "Hydrostatic test label applied. including notes of the pressure at which the test was performed.",
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
        name: "B. Standard Maintenance and Service  Checklist",
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
        name: "C. Testing",
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
const selfAuditForm = {
  categories: [
    {
      categoryName: " FIRE EXITS AND EVACUATION",
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
            " Audible Alarms: Check if audible alarms can be heard throughout the workplace.",
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
            " Observations / Notes: [Insert Fire Safety checklist observations and corrective actions, if any]",
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
            " Observations / Notes: [Insert Fire Safety checklist observations and corrective actions, if any]",
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
            " Observations / Notes: [Insert Fire Safety checklist observations and corrective actions, if any]",
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
            " Observations / Notes: [Insert Fire Safety checklist observations and corrective actions, if any]",
          questionType: "Input",
        },
      ],
    },
    {
      categoryName: "FIRE SAFETY TRAINING",
      questions: [
        {
          questionText:
            " Fire Safety Training: Review training records to ensure employees have received fire safety training.",
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
            " Observations / Notes: [Insert Fire Safety checklist observations and corrective actions, if any]",
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
};
const categories = [
  {
    categoryName: "Pump Room",
  },
  {
    categoryName: "Fire Extinguishers",
  },
  {
    categoryName: "Fire Hydrant",
  },
];
const states = [
  { stateName: "Andhra Pradesh" },
  { stateName: "Arunachal Pradesh" },
  { stateName: "Assam" },
  { stateName: "Bihar" },
  { stateName: "Chhattisgarh" },
  { stateName: "Goa" },
  { stateName: "Gujarat" },
  { stateName: "Haryana" },
  { stateName: "Himachal Pradesh" },
  { stateName: "Jharkhand" },
  { stateName: "Karnataka" },
  { stateName: "Kerala" },
  { stateName: "Madhya Pradesh" },
  { stateName: "Maharashtra" },
  { stateName: "Manipur" },
  { stateName: "Meghalaya" },
  { stateName: "Mizoram" },
  { stateName: "Nagaland" },
  { stateName: "Odisha" },
  { stateName: "Punjab" },
  { stateName: "Rajasthan" },
  { stateName: "Sikkim" },
  { stateName: "Tamil Nadu" },
  { stateName: "Telangana" },
  { stateName: "Tripura" },
  { stateName: "Uttar Pradesh" },
  { stateName: "Uttarakhand" },
  { stateName: "West Bengal" },
  { stateName: "Andaman and Nicobar Islands" },
  { stateName: "Chandigarh" },
  { stateName: "Dadra and Nagar Haveli and Daman and Diu" },
  { stateName: "Delhi" },
  { stateName: "Jammu and Kashmir" },
  { stateName: "Ladakh" },
  { stateName: "Lakshadweep" },
  { stateName: "Puducherry" },
];

async function seedTables() {
  try {
    await dbConnect();
    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (existingAdmin) {
      console.log("Admin user already exists!");
    } else {
      const hashedPassword = await bcrypt.hash(adminUser.password, 8);
      const newAdmin = new User({
        ...adminUser,
        password: hashedPassword,
      });
      await newAdmin.save();
      console.log("Admin user created successfully");
    }
    const existingForms = await Form.find({
      serviceName: {
        $in: [
          "PUMP ROOM SERVICE",
          "FIRE EXTINGUSHER SERVICE",
          "FIRE HYDRANT SERVICE",
        ],
      },
    });
    if (existingForms.length > 0) {
      console.log("Forms already exist");
    } else {
      for (const formData of forms) {
        const form = new Form({
          serviceName: formData.serviceName,
          sectionName: [],
        });

        for (const section of formData.sections) {
          const sectionData = {
            name: section.name,
            testFrequency: section.testFrequency,
            serviceType: section.serviceType,
            questions: [],
          };

          for (const questionText of section.questions) {
            const newQuestion = new Question({ question: questionText });
            const savedQuestion = await newQuestion.save();
            sectionData.questions.push(savedQuestion._id);
          }

          form.sectionName.push(sectionData);
        }

        await form.save();
        console.log(`Form for ${formData.serviceName} created successfully`);
      }
    }
    const existingSelfAuditForm = await selfAudit.findOne();
    if (existingSelfAuditForm) {
      console.log("Self Audit Form already exists.");
    } else {
      const categories = selfAuditForm.categories;
      const newSelfAudit = new selfAudit({
        categories,
      });

      await newSelfAudit.save();
      console.log("Self Audit Form created successfully");
    }

    const existingCategory = await category.find({
      categoryName: {
        $in: ["Pump Room", "Fire Extinguishers", "Fire Hydrant"],
      },
    });
    if (existingCategory.length > 0) {
      console.log("Category already exist");
    } else {
      for (const categoryInput of categories) {
        const serviceName =
          categoryInput.categoryName === "Pump Room"
            ? "PUMP ROOM SERVICE"
            : categoryInput.categoryName === "Fire Extinguishers"
            ? "FIRE EXTINGUSHER SERVICE"
            : categoryInput.categoryName === "Fire Hydrant"
            ? "FIRE HYDRANT SERVICE"
            : "";
        const form = await Form.findOne({ serviceName }).select("_id");
        console.log(form);

        const newCategory = new category({
          formId: form._id,
          ...categoryInput,
        });

        await newCategory.save();
        console.log(
          `Category ${newCategory.categoryName} created successfully`
        );
      }
    }
    const existingState = await state.findOne();
    if (existingState) {
      console.log("states already exist");
    } else {
      for (const stateInput of states) {
        const newState = new state({
          ...stateInput,
        });
        await newState.save();
        console.log(`State ${newState.stateName} Created successfully`);
      }
    }
    console.log("Database seeding completed");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    mongoose.connection.close();
  }
}
seedTables();
