const { default: mongoose } = require("mongoose");
const mongoURI = "mongodb://127.0.0.1:27017/firedesk";

// Import your Mongoose models
const Category = require("./models/admin/masterData/category");
const Product = require("./models/admin/product");

const seedProducts = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoURI, {});
    console.log("MongoDB connected successfully!");

    const pumpRoomCategory = await Category.findOne({
      categoryName: "Pump Room",
    });
    const extinguishersCategory = await Category.findOne({
      categoryName: "Fire Extinguishers",
    });
    const hydrantCategory = await Category.findOne({
      categoryName: "Fire Hydrant",
    });

    if (!pumpRoomCategory || !extinguishersCategory || !hydrantCategory) {
      console.error(
        "Error: One or more categories not found. Please ensure the categories are seeded and the database name is correct."
      );
      await mongoose.disconnect();
      return;
    }

    console.log("Seeding products...");

    const products = [
      // --- Products for "Fire Extinguishers" Category ---
      {
        categoryId: extinguishersCategory._id,
        productName: "Powder",
        testFrequency: "One Year",
        variants: [
          {
            type: "ABC Powder",
            subType: ["Stored Pressure", "Cartridge-Operated"],
            description: "Multipurpose ABC powder extinguisher.",
            image: "https://example.com/images/abc-powder.png",
          },
          {
            type: "BC Powder",
            subType: ["Stored Pressure", "Cartridge-Operated"],
            description: "BC powder extinguisher for Class B & C fires.",
            image: "https://example.com/images/bc-powder.png",
          },
          {
            type: "D Powder",
            subType: ["Stored Pressure", "Cartridge-Operated"],
            description: "D powder extinguisher for combustible metal fires.",
            image: "https://example.com/images/d-powder.png",
          },
        ],
      },
      {
        categoryId: extinguishersCategory._id,
        productName: "Foam",
        testFrequency: "Two Years",
        variants: [
          {
            type: "AFFF",
            subType: ["Stored Pressure", "Cartridge-Operated"],
            description: "Aqueous Film-Forming Foam (AFFF) extinguisher.",
            image: "https://example.com/images/afff-foam.png",
          },
          {
            type: "Foam",
            subType: ["Stored Pressure", "Cartridge-Operated"],
            description: "Standard foam extinguisher.",
            image: "https://example.com/images/foam.png",
          },
          {
            type: "Protein Foam",
            subType: ["Stored Pressure", "Cartridge-Operated"],
            description: "Protein foam extinguisher for specific fire types.",
            image: "https://example.com/images/protein-foam.png",
          },
        ],
      },
      {
        categoryId: extinguishersCategory._id,
        productName: "Clean Agent",
        testFrequency: "Three Years",
        variants: [
          {
            type: "HFC-236fa (Int-200)",
            subType: ["Stored Pressure"],
            description: "Clean agent extinguisher with HFC-236fa.",
            image: "https://example.com/images/hfc-236fa.png",
          },
          {
            type: "HFC-225ea (FM-200)",
            subType: ["Stored Pressure"],
            description: "Clean agent extinguisher with HFC-225ea.",
            image: "https://example.com/images/hfc-225ea.png",
          },
          {
            type: "FK-5-1-12 (Novec 1230)",
            subType: ["Stored Pressure", "Cartridge-Operated"],
            description: "Clean agent extinguisher with Novec 1230.",
            image: "https://example.com/images/novec-1230.png",
          },
          {
            type: "IG-541 (Inert Gas Mix)",
            subType: ["Stored Pressure", "Cartridge-Operated"],
            description: "Clean agent extinguisher with inert gas mix.",
            image: "https://example.com/images/ig-541.png",
          },
        ],
      },
      {
        categoryId: extinguishersCategory._id,
        productName: "CO2",
        testFrequency: "Five Years",
        variants: [
          {
            type: "CO2",
            subType: ["Stored Pressure", "Cartridge-Operated"],
            description:
              "Carbon dioxide extinguisher, safe for electrical fires.",
            image: "https://example.com/images/co2.png",
          },
        ],
      },
      {
        categoryId: extinguishersCategory._id,
        productName: "Water",
        testFrequency: "One Year",
        variants: [
          {
            type: "Water",
            subType: ["Stored Pressure", "Cartridge-Operated"],
            description: "Water extinguisher for Class A fires.",
            image: "https://example.com/images/water.png",
          },
          {
            type: "Water Mist",
            subType: ["Stored Pressure", "Cartridge-Operated"],
            description: "Water mist extinguisher, safe for electrical fires.",
            image: "https://example.com/images/water-mist.png",
          },
        ],
      },
      {
        categoryId: extinguishersCategory._id,
        productName: "Wet Chemical",
        testFrequency: "One Year",
        variants: [
          {
            type: "Potassium Acetate-Based",
            subType: ["Stored Pressure", "Cartridge-Operated"],
            description:
              "Wet chemical extinguisher for Class K (kitchen) fires.",
            image: "https://example.com/images/wet-chemical-pa.png",
          },
          {
            type: "Potassium Carbonate-Based",
            subType: ["Stored Pressure", "Cartridge-Operated"],
            description:
              "Wet chemical extinguisher for Class K (kitchen) fires.",
            image: "https://example.com/images/wet-chemical-pc.png",
          },
        ],
      },

      // --- Products for "Fire Hydrant" Category ---
      {
        categoryId: hydrantCategory._id,
        productName: "Dry Barrel",
        testFrequency: "Two Years",
        variants: [
          {
            type: "Standard",
            subType: ["Pillar / Outdoor"],
            description:
              "Dry barrel hydrant with a pillar design for outdoor use.",
            image: "https://example.com/images/dry-barrel-pillar.png",
          },
        ],
      },
      {
        categoryId: hydrantCategory._id,
        productName: "Wall Hydrant",
        testFrequency: "One Year",
        variants: [
          {
            type: "Standard",
            subType: ["Pillar / Outdoor Wet", "Wall-Mounted"],
            description: "Standard hydrant for wall or outdoor mounting.",
            image: "https://example.com/images/wall-hydrant.png",
          },
        ],
      },
      {
        categoryId: hydrantCategory._id,
        productName: "Post Hydrant",
        testFrequency: "One Year",
        variants: [
          {
            type: "Standard",
            subType: ["Pillar / Street"],
            description: "Standard post hydrant for street-side installation.",
            image: "https://example.com/images/post-hydrant.png",
          },
        ],
      },
      {
        categoryId: hydrantCategory._id,
        productName: "Underground / Buried",
        testFrequency: "Two Years",
        variants: [
          {
            type: "Standard",
            subType: ["Buried / Access Valve"],
            description:
              "Underground hydrant with access valve for hidden installation.",
            image: "https://example.com/images/underground-hydrant.png",
          },
        ],
      },
      {
        categoryId: hydrantCategory._id,
        productName: "Wall Hydrant with Hose Reel",
        testFrequency: "One Year",
        variants: [
          {
            type: "Standard",
            subType: ["High-Rise Pumped", "Indoor Hose Reel"],
            description:
              "Wall hydrant with an integrated hose reel for indoor use.",
            image: "https://example.com/images/wall-hydrant-hosereel.png",
          },
        ],
      },
      // --- Products for "Pump Room" Category ---
      {
        categoryId: pumpRoomCategory._id,
        productName: "Electric Driven",
        testFrequency: "One Year",
        variants: [
          {
            type: "Horizontal Split Case",
            subType: ["Double Suction"],
            description: "Electric-driven horizontal split case pump.",
            image: "https://example.com/images/electric-hsc.png",
          },
          {
            type: "Vertical Turbine",
            subType: ["Deep Well"],
            description:
              "Electric-driven vertical turbine pump for deep wells.",
            image: "https://example.com/images/electric-vt.png",
          },
        ],
      },
      {
        categoryId: pumpRoomCategory._id,
        productName: "Diesel Driven",
        testFrequency: "One Year",
        variants: [
          {
            type: "Horizontal Split Case",
            subType: ["Double Suction"],
            description: "Diesel-driven horizontal split case pump.",
            image: "https://example.com/images/diesel-hsc.png",
          },
          {
            type: "Vertical Turbine",
            subType: ["Deep Well"],
            description: "Diesel-driven vertical turbine pump for deep wells.",
            image: "https://example.com/images/diesel-vt.png",
          },
        ],
      },
      {
        categoryId: pumpRoomCategory._id,
        productName: "Jockey Pump",
        testFrequency: "One Year",
        variants: [
          {
            type: "Centrifugal",
            subType: ["Pressure Maintenance"],
            description:
              "Centrifugal jockey pump for maintaining system pressure.",
            image: "https://example.com/images/jockey-centrifugal.png",
          },
          {
            type: "Multistage",
            subType: ["High Pressure"],
            description: "Multistage jockey pump for high-pressure systems.",
            image: "https://example.com/images/jockey-multistage.png",
          },
        ],
      },
      {
        categoryId: pumpRoomCategory._id,
        productName: "Portable Pump",
        testFrequency: "Five Years",
        variants: [
          {
            type: "Centrifugal",
            subType: ["Trailer-Mounted"],
            description: "Trailer-mounted portable centrifugal pump.",
            image: "https://example.com/images/portable-centrifugal.png",
          },
        ],
      },
    ];

    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Product seeding completed! 🚀");
    await mongoose.disconnect();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error seeding products:", error);
    await mongoose.disconnect();
  }
};

seedProducts();
