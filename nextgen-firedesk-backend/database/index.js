// firedesk-backend/database/index.js
/* const mongoose = require("mongoose");

const dbConnect = () => {
  const mongoUri = process.env.MONGODB_CONNECTION_STRING || process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("❌ No MongoDB connection string found. Set MONGODB_CONNECTION_STRING or MONGO_URI.");
    process.exit(1);
  }

  return mongoose
    .connect(mongoUri) // ⚡ No need for deprecated options in Mongoose 6+
    .then(() => console.log(`✅ MongoDB connected using URI: ${mongoUri}`))
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
      process.exit(1);
    });
}; */
// MOdified to use the indx.js from config
const mongoose = require("mongoose");
const { MONGODB_CONNECTION_STRING } = require("../config/index");

const dbConnect = () => {
  const mongoUri = MONGODB_CONNECTION_STRING;

  if (!mongoUri) {
    console.error("❌ No MongoDB connection string found in config.");
    process.exit(1);
  }

  return mongoose
    .connect(mongoUri) // ⚡ Mongoose 6+ doesn’t need extra options
    .then(() => {
      console.log(`✅ MongoDB connected to host: ${mongoose.connection.host}`);
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
      process.exit(1);
    });
};

// 👉 Export the function directly so server.js can just call dbConnect()
module.exports = dbConnect;
