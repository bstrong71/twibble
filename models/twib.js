'use strict';
module.exports = function(sequelize, DataTypes) {
  var Twib = sequelize.define('Twib', {
    post: DataTypes.STRING,
    numlike: DataTypes.INTEGER
  }, {});

  Twib.associate = function(models) {
    Twib.belongsTo(models.User, {
      foreignKey: 'twibId'
    })
    Twib.hasOne(models.User, {
      foreignKey: 'twibId',
      otherKey: 'userId',
      through: 'likes'
    })
  }

  return Twib;
};
