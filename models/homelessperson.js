'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 12;
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
  HomelessPerson.checkIn = function(userId, shelterId) {
    console.log("checkIn(" + userId + "," + shelterId + ") called");
    let err = new ConflictError("Already checked into a shelter");
    err.name = 412;
    return HomelessPerson.find({where: {id: userId}})
      .then(homelessperson => {
        if (homelessperson.getDataValue("ShelterId")) {
            console.log("threw " + err);
            throw err;
        } else {
          // update the value in the ShelterId field
          homelessperson.update({
              ShelterId: shelterId
          }).then(() => {});
        }
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
    return HomelessPerson.find({where: {id: userId}})
      .then(homelessperson => {
        if (homelessperson.getDataValue("ShelterId")) {
          // update the value in the ShelterId field
          homelessperson.update({
              ShelterId: null
          }).then(() => {});
        }
        throw err;
      });
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
