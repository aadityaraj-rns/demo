const mongoose = require("mongoose");
const dbConnect = require("./database");
const user = require("./models/user");
const city = require("./models/admin/masterData/city");
const Plant = require("./models/organization/plant/Plant");

// organizationId
const loginID = "ORG001";

async function plantSeeder() {
  try {
    await dbConnect();
    console.log("✅ Database connected, seeding started...");

    const userData = await user
      .findOne({ userType: "organization", loginID })
      .select("_id name");

    if (!userData) {
      console.log("❌ Organization Not Found");
      return;
    }

    const cities = await city.find();
    const cityMap = new Map(cities.map((city) => [city.cityName, city._id]));

    const plantData = [
      {
        plantName: "Synergies Castings Ltd",
        address:
          "Plot No. 3 & 4, Near Visakhapatnam Special Economic Zone, Duvvada, Visakhapatnam – 530046, Andhra Pradesh, India",
        cityId: cityMap.get("Visakhapatnam"),
      },
      {
        plantName: "Synergy Shipping Pvt. Ltd.",
        address:
          "5th Floor, 'PERIERA MANOR', Main Road, Daba Gardens, Visakhapatnam – 530020, Andhra Pradesh, India",
        cityId: cityMap.get("Visakhapatnam"),
      },
    ];

    // 🔹 Get current count for plantId generation
    let plantCount = await Plant.countDocuments({ orgUserId: userData._id });
    const orgNameSlice = userData.name.toString().slice(0, 2).toUpperCase();

    const plantsToInsert = [];
    for (const plant of plantData) {
      plantCount++;
      const cityData = await city.findById(plant.cityId).select("cityName");
      const citySlice = cityData.cityName.toString().slice(0, 3).toUpperCase();

      plantsToInsert.push({
        plantId: `${orgNameSlice}-${citySlice}-${plantCount
          .toString()
          .padStart(4, "0")}`,
        orgUserId: userData._id,
        plantName: plant.plantName,
        address: plant.address,
        cityId: plant.cityId,
        plantImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_ljff2QGyXvPEGtZPIDH-Gd_BPDMj1crsxA&s", // no image in seeder
      });
    }

    // 🔹 Insert all plants at once
    await Plant.insertMany(plantsToInsert);

    console.log("✅ Plants seeded successfully");
  } catch (error) {
    console.log("❌ Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔒 Database connection closed");
  }
}

plantSeeder();
