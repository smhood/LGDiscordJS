var Sequelize = require('sequelize');
var db = require('./_db');

var User = db.define('user', {
  username: {
    type: Sequelize.STRING,
    unique: true,
    primaryKey: true
  },
  postcount: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  groups: {
    type: Sequelize.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = User
