'use strict';
module.exports = function(sequelize, DataTypes) {
  var Twib = sequelize.define('Twib', {
    post: DataTypes.STRING,
    numlike: DataTypes.INTEGER
  }, {});

  Twib.associate = function(models) {
    Twib.belongsTo(models.User, {
      as: 'Users',
      foreignKey: 'userId'
    })
    Twib.hasMany(models.Like, {
      as: 'Likes',
      foreignKey: 'twibId'
    })

  };

  return Twib;
};
