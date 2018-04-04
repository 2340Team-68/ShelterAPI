'use strict';
const ConflictError = require('../helpers/error/errors').ConflictError;

module.exports = (sequelize, DataTypes) => {
    var Shelter = sequelize.define('Shelter', {
        name: {
            type: DataTypes.STRING,
            notNull: true,
            notEmpty: true,
            get: function() {
                return this.getDataValue("name");
            }
        },
        capacity: {
            type: DataTypes.INTEGER,
            notNull: true,
            get: function() {
                return this.getDataValue("capacity");
            }
          },
        vacancies: {
            type: DataTypes.INTEGER,
            notNull: true,
            validate: {
                min: {
                    args: [0]
                }
            },
            get: function() {
                return this.getDataValue("vacancies");
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
        models.Shelter.belongsToMany(models.Employee, {
          as: 'Shelters',
          through: {
            model: models.Role,
            unique: false
          },
          foreignKey: 'shelter_id'
        });

        models.Shelter.hasMany(models.HomelessPerson);
    };

    /**
     * Creates a shelter given a line in from a CSV
     * @param {string} line format:"name, cap, restr, lng, lat, addr, desc, phone"
     * @return {Promise} the created shelter stuff
     * @throws {Error} if the line is empty or undefined
    */
    Shelter.createFromCSV = function(line) {
      if (line === '' || line === undefined) {
        throw new Error("Line given must be defined");
      }
      // get the string of restrictions
      var restrictions = line[3].split('/'),
          restrArray = restrictions.map(function(restr) {
            return restr.toLowerCase();/* = restr.toLowerCase();*/
          });
      var restrStr = restrArray.join(',');
      return Shelter.create({
        "name": line[1],
        "capacity": parseInt(line[2]),
        "vacancies": parseInt(line[2]),
        "restrictions": restrStr,
        "longitude": parseFloat(line[4]).toPrecision(8),
        "latitude": parseFloat(line[5]).toPrecision(8),
        "address": line[6],
        "description": line[7],
        "phone": line[8]
      })
    }

      /**
       * Check the vacancy of the given shelter
       * @param id
       * @returns {PromiseLike<T> | Promise<T> | *}
       */
    Shelter.checkVacancy = function(id, count=1) {
        console.log("checkVacancy(" + id + ") called");
        return Shelter.getById(id)
            .then(shelter => {
                console.log(shelter.getDataValue("name"));
                let vacancies = shelter.getDataValue("vacancies");
                let msg = "No vacancies for " + shelter.getDataValue("name");
                if (vacancies < count) {
                    if (vacancies != 0) {
                        msg = "Not enough vacancies for "
                            + shelter.getDataValue("name") +" (" + count
                            + " requested, " + vacancies + " available)";
                    }
                    throw new ConflictError(msg);
                }
                return shelter;
            });
    }

      /**
       * increment the shelter's vacancies
       * @param shelter
       */
    Shelter.incrementVacancy = function(shelter, count=1) {
        console.log("vacancies incremented");
        return shelter.increment('vacancies', {by: count})
          .then(s => s.reload());
    }

      /**
       * decrement the shelter's vacancies
       * @param shelter
       */
      Shelter.decrementVacancy = function(shelter, count=1) {
          console.log("vacancies decremented");
          return shelter.decrement('vacancies', {by: count})
            .then(s => s.reload());
      }

      /**
       * find a shelter by its id
       * @param {int} id the id to get by
       * @return {Promise} whether the shelter was found
       */
      Shelter.getById = function(id) {
          var prom = Shelter.findById(id)
              .then(function(shelter) {
                  if (shelter == null) {
                      var err = new Error("Shelter with id '"
                          + id + "' not found");
                      err.name = 404;
                      throw err;
                  }
                  return shelter;
              }).catch(function(error) {
                  console.log(error);
                  var code = 500;
                  if (error.name == 404) {
                      code = 404;
                  }
                  throw error;
              });
          return prom;
      };

    return Shelter;
}
