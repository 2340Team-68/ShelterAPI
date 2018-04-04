'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 12;
const ConflictError = require('../helpers/error/errors').ConflictError;
const NotFoundError = require('../helpers/error/errors').NotFoundError;

module.exports = (sequelize, DataTypes) => {
    var HomelessPerson = sequelize.define('HomelessPerson', {
        bedsReserved: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
              min: 0,
            }
        },
        // todo: allow the person to choose their tags
          // tags: {
          //     type:   DataTypes.ENUM,
          //     // values: ['YOUNG ADULTS', 'MEN', 'W0MEN', 'VETERANS', 'CHILDREN', 'NEWBORN', 'FAMILIES']
          // },
    }, {
        // getterMethods: {
        //     getPassword_hash: function()  {
        //         return this.password_hash;
        //     },
        //     getName: function() {
        //         return this.name;
        //     },
        //     getEmail: function() {
        //         return this.email;
        //     }
        // },
    });

    // define associations
    HomelessPerson.associate = function(models) {
        models.HomelessPerson.belongsTo(models.User, {
            foreignKey: 'user_id',
            allowNull: false
        });
    };

    /**
     * registers a new homeless person and assigns it a shelter
     * @param {string} user the user created to parent this instance
     * @return {Promise} the promise with the saved user object in it
     */
    HomelessPerson.register = function(user) {
        console.log(user.id);
        return HomelessPerson.create({
          user_id: user.id
        }).then((hm) => user);
    };

    /**
     * check user into a shelter
     * @param userId
     * @param shelterId
     */
    HomelessPerson.checkIn = function(userId, shelterId, bedCount = 1) {
        console.log("checkIn(" + userId + "," + shelterId + ") called");
        let err = new ConflictError("Already checked into a shelter");
        // this is done out of order, since we should check vacancy
        // before allowing a user to associate
        let shelterValid = sequelize.model('Shelter')
            .checkVacancy(shelterId, bedCount);
        let hPerson = HomelessPerson.find({where: {user_id: userId}});
        return Promise.all([shelterValid, hPerson])
            .then(([shelter, homelessperson]) => {
                if (homelessperson == undefined) {
                    throw new NotFoundError("User by given id does not exist");
                }
                if (homelessperson.getDataValue("ShelterId")) { // why
                    console.log("threw " + err);
                    throw err;
                } else {
                    // update the value in the ShelterId field
                    return homelessperson.update({
                        ShelterId: shelterId,
                        bedsReserved: bedCount
                    }).then(() => {
                        return shelter;
                    });
                }
            }).then(shelter => {
                // console.log(shelter);
                return sequelize.model('Shelter')
                    .decrementVacancy(shelter, bedCount);
            });
    };

    /**
     * check use out of shelter
     * @param userId
     * @param shelterId
     */
    HomelessPerson.checkOut = function(userId, shelterId) {
        console.log("checkOut(" + userId + "," + shelterId + ") called");
        let err = new ConflictError("User is not checked into a shelter");
        let err1 = new ConflictError("User is not checked into this shelter");
        return HomelessPerson.find({where: {user_id: userId}})
            .then(homelessperson => {
                let dbshelterid = homelessperson.getDataValue("ShelterId");
                let bedCount = homelessperson.getDataValue("bedsReserved");
                // check if user is checked into a shelter
                if (dbshelterid) {
                    // if the shelterId in db matches shelterId from request
                    if (dbshelterid != shelterId) {
                      throw err1;
                    }
                    // update the value in the ShelterId field
                    return homelessperson.update({
                        ShelterId: null,
                        bedsReserved: 0
                    }).then(() => bedCount);
                } else {
                  throw err;
                }
            }).then(bedCount => {
                // decrement the vacancy of the shelter
                return sequelize.model('Shelter').getById(shelterId)
                    .then(shelter => {
                      return sequelize.model('Shelter').incrementVacancy(shelter, bedCount);
                    })
            })
    }

  /**
      stop model's json representation from showing the hashed_password
   */
  HomelessPerson.prototype.toJSON =  function (exclude=[], specific = true) {
    // clones the object so hashed_password attr. is not perm. deleted
    var values = Object.assign({}, this.get());
    if (specific) {
      delete values['user_id'];
      delete values['createdAt'];
      delete values['updatedAt'];
    }
    for (let ex of exclude) {
      delete values[exclude];
    }
    return values;
  }

  return HomelessPerson;
};
