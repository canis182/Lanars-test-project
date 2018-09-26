const db = require("../../configs/db");
const sequelize = require("sequelize");

const User = db.define("user", {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: sequelize.INTEGER
  },
  name: {
    type: sequelize.STRING,
    allowNull: true
  },
  email: {
    type: sequelize.STRING,
    primaryKey: true,
    allowNull: true
  },
  password: {
    type: sequelize.STRING,
    allowNull: true
  },
  phone: {
    type: sequelize.STRING,
    allowNull: true
  }
});

db.sync({forse: true})

module.exports = { User, db };
