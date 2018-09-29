const db = require("../../configs/db");
const sequelize = require("sequelize");

const User = db.define("user", {
  id: {
    type: sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    // allowNull: false
  },
  name: {
    type: sequelize.STRING,
    allowNull: true
  },
  email: {
    type: sequelize.STRING,
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

const Item = db.define("item", {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: sequelize.INTEGER
  },
  image: {
    type: sequelize.STRING,
    allowNull: true,
  },
  created_at: {
    type: sequelize.INTEGER,
    allowNull: true
  },
  title: {
    type: sequelize.STRING,
    allowNull: true
  },
  description: {
    type: sequelize.STRING,
    allowNull: true
  }
}, { underscored: true });

const Img = db.define("img", {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: sequelize.INTEGER
  },
  path: {
    type: sequelize.STRING,
    allowNull: true
  }
}, { underscored: true });

Item.belongsTo(User);
Img.belongsTo(Item);

module.exports = { User, Item, Img };
