'use strict';
module.exports = (sequelize, DataTypes) => {
  var Shelter = sequelize.define('Shelter', {
      id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV1,
          primaryKey: true,
          unique: true
      },
      name: {
          type: DataTypes.STRING,
          notNull: true,
          notEmpty: true,
      },
      capacity: {
          type: DataTypes.INTEGER,
          notNull: true,
        },
      restrictions: {
          type:   DataTypes.ENUM,
          values: ['YOUNG ADULTS', 'MEN', 'W0MEN', 'VETERANS', 'CHILDREN', 'NEWBORN', 'FAMILIES']
      },
      latitude: {
          type: DataTypes.DECIMAL,
          allowNull: true,
          defaultValue: null,
          validate: { min: -90, max: 90 }
      },
      longitude: {
          type: DataTypes.DECIMAL,
          allowNull: true,
          defaultValue: null,
          validate: { min: -180, max: 180 }
      },
      address: { // Maybe split this up later
          type: DataTypes.STRING,
          allowNull: false,
          notEmpty: true,
      },
      phone: { // 1234567890 (first 3 area code, then rest)
          type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
  }, {
      validate: {
          bothCoordsOrNone: function() {
              if ((this.latitude === null) === (this.longitude === null)) {
                  // todo: handle this bih
                  throw new Error('Require either both latitude and longitude or neither')
              }
          }
      },
  });

  Shelter.associate = function(models) {
    // associations can be defined here
      models.Shelter.hasMany(models.Employee);
  };
  return Shelter;
}