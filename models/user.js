'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    display_name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {});

  User.associate = function(models) {
    User.belongsToMany(models.Twib, {
      foreignKey: 'userId',
      otherKey: 'twibId',
      through: 'likes'
    });
  };

  return User;
};
