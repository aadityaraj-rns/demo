/* const mongoose = require("mongoose");
const { MONGODB_CONNECTION_STRING } = require("../config/index");

const dbConnect = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(MONGODB_CONNECTION_STRING);
    console.log(`Database connected to host:${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

module.exports = dbConnect; */

const mongoose = require("mongoose");

// Pick Mongo URI from either env var (works in local + Docker)
const mongoUri = process.env.MONGODB_CONNECTION_STRING || process.env.MONGO_URI;

if (!mongoUri) {
  console.error("❌ No MongoDB connection string found. Set MONGODB_CONNECTION_STRING or MONGO_URI.");
  process.exit(1);
}

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(`✅ MongoDB connected using URI: ${mongoUri}`))
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

