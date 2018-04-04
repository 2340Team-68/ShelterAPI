'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 12;

const NotFoundError = require('../helpers/error/errors').NotFoundError;
const UnauthenticatedError =
  require('../helpers/error/errors').UnauthenticatedError;
const CodedError = require('../helpers/error/errors').CodedError;
const NotImplementedError =
  require('../helpers/error/errors').NotImplementedError;
const ConflictError = require('../helpers/error/errors').ConflictError;

const UserType = require('../helpers/auth/usertypes');

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
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
      type: {
        type: DataTypes.ENUM,
        allowNull: false,
        defaultValue: DataTypes.HOMELESS,
        values: UserType.getUserTypes()
      }
  });

  // User.associate = function(models) {
  //
  // };
  /**
   * registers a new user
   * @param {string} email the user's email
   * @param {string} name the user's name
   * @param {string} password the plaintext password to hash and store
   * @return {Promise} the promise with the saved user object in it
   */
  User.register = function(email, name, password, type = UserType.HOMELESS) {
    UserType.validateUserType(type);
    var user = bcrypt.hash(password, saltRounds)
      .then(hash => {
        return sequelize.model('User').create({
          email: email,
          name: name,
          password_hash: hash,
          type: type,
        })
      })
      .then((u) => {
        switch (type) {
          case UserType.HOMELESS:
            return sequelize.model('HomelessPerson').register(u);
            break;
          case UserType.ADMIN:
            throw new NotImplementedError("Admin not implemented");
            break;
          case UserType.EMPLOYEE:
            throw new NotImplementedError("Employee not implemented");
            break;
          case UserType.OWNER:
            throw new NotImplementedError("Owner not implemented");
            break;
          default:
            throw new CodedError("Type: " + type + "not implemented");
            break;
        }
      })
      .catch(err => {
        if (err.name == 'SequelizeUniqueConstraintError') {
          err = new ConflictError('Email already in use');
        }
        throw err;
      });
    // get any errors from individual register functions
    return user;
  };

  /**
   * Checks login credentials and gives user id if successful or -1 otherwise
   * @param {string} email the email of the homeless person
   * @param {string} password the plain password of the homeless person
   * @throws {UnauthenticatedError} if the information could not e authenticated
   * @return {Promise} which will resolve to either id or -1
   */
  User.login = function(email, password) {
    var userPromise = User.find({where: {email: email}});
    var pwPromise = userPromise.then((user) => {
        if (!user) {
            throw new NotFoundError("The email " + email + " does not exist");
        }
      return user.validatePassword(password);
    });
    // create a combined promise to check both user email and password
    var res = Promise.all([userPromise, pwPromise])
      .then(([user, passCheck]) => {
        if (user != null && passCheck) {
          return user;
        }
        throw new UnauthenticatedError("Invalid login information");
      });
    return res;
  };

  /**
   * Determines if a hashed password is the correct one for a given user
   * @param {string} password the plaintext password to check
   * @return {boolean} whether the hashed password matches
   */
  User.prototype.validatePassword = function(password) {
    return bcrypt.compare(password, this.password_hash);
  };

  /**
   * find a user by id
   * @param {string} id the user by
   * @throws {NotFoundError} if the user with the given id could not be found
   * @return {Promise} whether the user was found
   */
  User.getById = function(id) {
    var prom = User.findById(id)
      .then(function(result) {
        if (result == null) {
          var msg = "User with id '" + id + "' not found";
          throw new NotFoundError(msg);
        }
        return result;
      }).catch((err) => {
        if (err.code == undefined) {
          throw new CodedError(err.message,
            err.fileName, err.lineNumber);
        }
        throw err;
      });
    return prom;
  };

  /**
   * Turn the user to json for use by the client
   * @param {string[]} exclude the fields to exclude
   * @param {boolean} specific whether this should have user specifics
   * @return {Promise} containing the JSON for this user
   */
  User.prototype.toJSON = function (exclude=[], specific=true) {
    // clones the object so hashed_password attr. is not perm. deleted
    var values = Object.assign({}, this.get());
    delete values['password_hash'];
    for (let ex of exclude) {
      delete values[exclude];
    }
    if (specific) {
      return this.getSpecifics().then(sp => {
        values.specifics = sp;
        return values;
      });
    }
    return Promise.resolve(values);
  }

  /**
   * returns the specifics for the user based on it's type
   * @return {Promise} a promise containing the specific details for the user
   */
  User.prototype.getSpecifics = function () {
    var specifics;
    switch(this.type) {
      case UserType.HOMELESS:
        specifics = sequelize.model('HomelessPerson')
          .find({where: {user_id:this.id}});
        break;
      case UserType.ADMIN:
        throw new NotImplementedError("Admin not implemented");
        break;
      case UserType.EMPLOYEE:
        throw new NotImplementedError("Employee not implemented");
        break;
      case UserType.OWNER:
        throw new NotImplementedError("Owner not implemented");
        break;
      default:
        throw new NotImplementedError("Type: " + type + "not implemented");
        break;
    }
    return specifics.then(hm => hm.toJSON());
  };

  // define associations
  User.associate = function(models) {
    // models.User.hasOne(models.HomelessPerson);
  };

  return User;
};
