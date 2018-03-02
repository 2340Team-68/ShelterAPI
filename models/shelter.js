'use strict';
module.exports = (sequelize, DataTypes) => {
  var Shelter = sequelize.define('Shelter', {
    name: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    restrictions: DataTypes.STRING,  // TODO: change to enum later
    latitude: DataTypes.DECIMAL,
    longitude: DataTypes.DECIMAL,
    address: DataTypes.STRING,       // Maybe split this up later
    phone: DataTypes.STRING,         // 1234567890 (first 3 area code, then rest)
    description: DataTypes.TEXT
  }, {});
  Shelter.associate = function(models) {
    // associations can be defined here
  };
  return Shelter;
};
