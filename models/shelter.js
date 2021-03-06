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
      vacancies: {
          type: DataTypes.INTEGER,
          notNull: true,
          validate: {
              min: {
                  args: [0]
              }
          }
      },
      restrictions: {
          type:   DataTypes.STRING,
          // values: ['YOUNG ADULTS', 'MEN', 'W0MEN', 'VETERANS', 'CHILDREN', 'CHILDREN UNDER 5', 'NEWBORN', 'FAMILIES']
      },
      latitude: {
          type: DataTypes.FLOAT,
          allowNull: true,
          defaultValue: null,
          validate: { min: -90, max: 90 }
      },
      longitude: {
          type: DataTypes.FLOAT,
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
      // validate: {
      //     bothCoordsOrNone: function() {
      //         if ((this.latitude === null) === (this.longitude === null)) {
      //             // todo: handle this bih
      //             throw new Error('Require either both latitude and longitude or neither')
      //         }
      //     }
      // },
  });

  Shelter.associate = function(models) {
    // associations can be defined here
      models.Shelter.hasMany(models.Employee);
  };
  return Shelter;
}