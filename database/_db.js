var Sequelize = require('sequelize')
var CONFIG = require('./../config.json');

var db = new Sequelize(CONFIG.database, CONFIG.dbUser, CONFIG.dbPassword);

module.exports = db;
