'use strict';
module.exports = function(sequelize, DataTypes) {
  var Like = sequelize.define('Like', {
    twibId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});

  Like.associate = function(models) {
    Like.belongsTo(models.User, {
      as: 'Users',
      foreignKey: 'userId'
    })

    Like.belongsTo(models.Twib, {
      as: 'Twibs',
      foreignKey: 'twibId'
    })
  };

  return Like;
};
