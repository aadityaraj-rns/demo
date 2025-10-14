// firedesk-backend/database/index.js
const { Sequelize } = require("sequelize");
const { DATABASE_URL, DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = require("../config/index");

let sequelize;

if (DATABASE_URL) {
  // Production (Heroku/Render style)
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    logging: false,
    dialectOptions: {
      ssl: process.env.NODE_ENV === "production"
        ? { require: true, rejectUnauthorized: false }
        : false,
    },
  });
} else {
  // Local connection
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres",
    logging: false,
  });
}

const dbConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ PostgreSQL connected: ${DB_NAME}@${DB_HOST}:${DB_PORT}`);

    // Import all models + setup associations
    const db = require("../models/index");
    if (db.defineAssociations) {
      db.defineAssociations();
    }

    // Sync all models
    await sequelize.sync({ alter: true });
    console.log("✅ Database synchronized");

    return sequelize;
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err);
    process.exit(1);
  }
};

module.exports = { sequelize, dbConnect };
