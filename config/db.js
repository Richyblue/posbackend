const { Sequelize } = require('sequelize');
require('dotenv').config();
const db_name=process.env.DB_NAME;
const db_username=process.env.DB_USERNAME;
const db_password=process.env.DB_PASSWORD;
const db_host=process.env.DB_HOST;
const dialect=process.env.DIALECT;
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
const sequelize = new Sequelize(db_name, db_username, db_password, {
    host: db_host,
    dialect: dialect,
});

module.exports = sequelize;
