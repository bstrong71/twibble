'use strict';
module.exports = function(sequelize, DataTypes) {
  var Twib = sequelize.define('Twib', {
    post: DataTypes.STRING,
    numlike: DataTypes.INTEGER
  }, {});

  Twib.associate = function(models) {
    Twib.belongsTo(models.User, {
      foreignKey: 'userId'
    })
    Twib.hasMany(models.Like, {
      foreignKey: 'twibId'
    })

  };

  return Twib;
};
