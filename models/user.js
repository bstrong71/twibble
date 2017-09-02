'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    display_name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {});

  User.associate = function(models) {

    User.hasMany(models.Twib, {
      as: 'Twibs',
      foreignKey: 'userId'
    })
    User.hasMany(models.Like, {
      as: 'Likes',
      foreignKey: 'userId'
    })

  };

  return User;
};
