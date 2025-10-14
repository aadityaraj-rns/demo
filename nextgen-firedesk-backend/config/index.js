const dotenv = require("dotenv");
dotenv.config();

const {
  PORT,
  DATABASE_URL,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  SMS_AUTH_KEY,
  SMS_AUTH_TOKEN,
  SMS_SENDERID,
} = process.env;

module.exports = {
  PORT,
  DATABASE_URL,
  DB_HOST: DB_HOST || 'localhost',
  DB_PORT: DB_PORT || 5432,
  DB_NAME: DB_NAME || 'firedesk',
  DB_USER: DB_USER || 'postgres',
  DB_PASSWORD: DB_PASSWORD || 'password',
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  SMS_AUTH_KEY,
  SMS_AUTH_TOKEN,
  SMS_SENDERID,
};
