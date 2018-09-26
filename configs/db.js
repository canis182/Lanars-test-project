const Sequelize = require("sequelize");

module.exports = new Sequelize("lanars", "canis182", 12345, {
    host: '127.0.0.1' ,
    dialect: 'postgres',
    operatorsAliases: false,
  
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
