const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("assignment7", "root", "", {
  host: "localhost",
  dialect: "mysql"
});

module.exports = sequelize;