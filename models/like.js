'use strict';
module.exports = function(sequelize, DataTypes) {
  var Like = sequelize.define('Like', {
    twibId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});

  Like.associate = function(models) {
    Like.belongsTo(models.User, {
      foreignKey: 'userId'
    })

    Like.belongsTo(models.Twib, {
      foreignKey: 'twibId'
    })
  };

  return Like;
};
