'use strict';
// var Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  var HomelessPerson = sequelize.define('HomelessPerson', {
      id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV1,
          primaryKey: true,
          unique: true
      },
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
