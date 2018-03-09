'use strict';
// var Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  var HomelessPerson = sequelize.define('HomelessPerson', {
      name: {
          type: DataTypes.STRING,
          notNull: true,
          notEmpty: true,
      },
      email: {
          type: DataTypes.STRING,
          isEmail: true,
          unique: true,
      },
      password_hash: {
          type: DataTypes.STRING,
          notEmpty: true,
          notNull: true,
      },
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

  HomelessPerson.associate = function(models) {

  };
  /**
  * Determines if a hashed password is the correct one for a given user
  * @param {string} hashed_pw the hashed password to check
  * @return {boolean} whether the hashed password matches
  */
  HomelessPerson.prototype.validatePassword = function(hashed_pw) {
    return this.password_hash === hashed_pw;
  };
  return HomelessPerson;
};
