'use strict';
module.exports = (sequelize, DataTypes) => {
  var HomelessPerson = sequelize.define('HomelessPerson', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password_hash: DataTypes.STRING
  }, {});
  HomelessPerson.associate = function(models) {

  };
  /**
  * Determines if a hashed password is the correct one for a given user
  * @param {string} hashed_pw the hashed password to check
  * @return {boolean} whether the hashed password matches
  */
  HomelessPerson.prototype.validatePassword = function(hashed_pw) {
    return password_hash === hashed_pw;
  };
  return HomelessPerson;
};
