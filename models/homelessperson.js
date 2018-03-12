'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 12;
module.exports = (sequelize, DataTypes) => {
  var HomelessPerson = sequelize.define('HomelessPerson', {
      name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
              notEmpty : {msg: 'Name cannot be empty'}
          }
      },
      email: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
          validate: {
              isEmail: {msg: 'Email is invalid'}
          }
      },
      password_hash: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
              notEmpty : {msg: 'Password cannot be empty'}
          }
      },
      // todo: allow the person to choose their tags
      // tags: {
      //     type:   DataTypes.ENUM,
      //     // values: ['YOUNG ADULTS', 'MEN', 'W0MEN', 'VETERANS', 'CHILDREN', 'NEWBORN', 'FAMILIES']
      // },
  }, {
      getterMethods: {
          getPassword_hash: function()  {
              return this.password_hash;
          },
          getName: function() {
              return this.name;
          },
          getEmail: function() {
              return this.email;
          }
      },
  });

  // HomelessPerson.associate = function(models) {
  //
  // };
  /**
   * registers a new homeless person and assigns it a shelter
   * @param {string} email the homeless person's email
   * @param {string} name the homeless person's name
   * @param {string} password the plaintext password to hash and store
   * @param {number} shelterId the id of the shelter the homeless person has
   * @return {Promise} the promise which determines if the action went through
   */
  HomelessPerson.register = function(email, name, password) {
      return bcrypt.hash(password, saltRounds).then(hash => {
          return HomelessPerson.build({
              email: email,
              name: name,
              password_hash: hash
          });
      }).then(homelessPerson => {
          return homelessPerson.save();
      }).then(homelessPerson => {
            return {id: homelessPerson.id};
      });
  };

  /**
   * Checks login credentials and gives user id if successful or -1 otherwise
   * @param {string}email the email of the homeless person
   * @param password the plain password of the homeless person
   * @return {Promise} which will resolve to either id or -1
   */
  HomelessPerson.login = function(email, password) {
      var homelessPersonPromise = HomelessPerson.find({where: {email: email}})
      var pwPromise = homelessPersonPromise.then( (homelessPerson) => {
          return homelessPerson.validatePassword(password);
      });
      var res = Promise.all([homelessPersonPromise, pwPromise])
          .then(([homelessPerson, passCheck]) => {
              if (homelessPerson == null) {
                throw new Error("Account/Password invalid");
              }
              var id = (passCheck) ? homelessPerson.id : -1;
              return {id: id, type: "homeless"};
          }, err => {
            throw new Error("Account/Password invalid");
          });
      return res;
  };

  /**
   * Determines if a hashed password is the correct one for a given user
   * @param {string} password the plaintext password to check
   * @return {boolean} whether the hashed password matches
   */
  HomelessPerson.prototype.validatePassword = function(password) {
      return bcrypt.compare(password, this.password_hash);
  };

  /**
   * Determines if a hashed password is the correct one for a given user
   * @param {string} id the id to get by
   * @return {Promise} whether the hashed password matches
   */
  HomelessPerson.getById = function(id) {
    var prom = HomelessPerson.findById(id)
      .then(function(result) {
        if (result == null) {
          var err = new Error("Homeless Person with id '"
            + id + "' not found");
          err.name = 404;
          throw err;
        }
        return result;
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
  return HomelessPerson;
};
