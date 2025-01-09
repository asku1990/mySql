require('dotenv').config();

const config = {
  development: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306')
  },
  // You can add more environments like production, testing etc.
};

module.exports = config;