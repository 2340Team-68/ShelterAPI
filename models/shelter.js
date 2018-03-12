'use strict';
module.exports = (sequelize, DataTypes) => {
  var Shelter = sequelize.define('Shelter', {
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
  // associations can be defined here
  //   models.Shelter.belongsToMany(models.Owner, {through:'ownership', onDelete: 'cascade'});
  //   models.Shelter.belongsToMany(models.Employee, {through:'employment', onDelete: 'cascade'});
    Shelter.associate = function(models) {
      models.Shelter.belongsToMany(models.Employee, { as: 'Shelters',
        through: {
          model: models.Role,
          unique: false
        },
        foreignKey: 'shelter_id'
      });
  };
  return Shelter;
}
