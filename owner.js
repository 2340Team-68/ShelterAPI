// 'use strict';
// const bcrypt = require('bcrypt');
// const saltRounds = 12;
// module.exports = (sequelize, DataTypes) => {
//     var Owner = sequelize.define('Owner', {
//         name: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             validate: {
//                 notEmpty : {msg: 'Name cannot be empty'}
//             }
//         },
//         email: {
//             type: DataTypes.STRING,
//             unique: true,
//             allowNull: false,
//             validate: {
//                 isEmail: {msg: 'Email is invalid'}
//             }
//         },
//         password_hash: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             validate: {
//                 notEmpty : {msg: 'Password cannot be empty'}
//             }
//         },
//     }, {
//         getterMethods: {
//             getPassword_hash: function()  {
//                 return this.password_hash;
//             },
//             getName: function() {
//                 return this.name;
//             },
//             getEmail: function() {
//                 return this.email;
//             }
//         },
//     });
//
//     Owner.associate = function(models) {
//         models.Owner.belongsToMany(models.Shelter, {through:'ownership', onDelete: 'cascade'});
//     };
//     /**
//      * registers a new owner and assigns it a shelter
//      * @param {string} email the owner's email
//      * @param {string} name the owner's name
//      * @param {string} password the plaintext password to hash and store
//      * @param {number} shelterId the id of the shelter the owner has
//      * @return {Promise} the promise which determines if the action went through
//      */
//     Owner.register = function(email, name, password, shelterId) {
//         return bcrypt.hash(password, saltRounds).then(hash => {
//             return Owner.build({
//                 email: email,
//                 name: name,
//                 password_hash: hash
//             });
//         }).then(owner => {
//             return owner.addShelter([shelterId]);
//         }).then(owner => {
//             return owner.save();
//         }).then(owner => {
//             return {id: owner.id};
//         }, err => {
//             return err;
//         });
//     };
//
//     /**
//      * Checks login credentials and gives user id if successful or -1 otherwise
//      * @param email the email of the owner
//      * @param password the plain password of the owner
//      * @return a promise which will resolve to either id or -1
//      */
//     Owner.login = function(email, password) {
//         var ownerPromise = Owner.find({email: email})
//         var pwPromise = ownerPromise.then( (owner) => {
//             return owner.validatePassword(password);
//         });
//         var res = Promise.all([ownerPromise, pwPromise])
//             .then(([owner, passCheck]) => {
//                 return (passCheck) ? owner.id : -1;
//             });
//         return res;
//     };
//
//     /**
//      * Determines if a hashed password is the correct one for a given user
//      * @param {string} password the plaintext password to check
//      * @return {boolean} whether the hashed password matches
//      */
//     Owner.prototype.validatePassword = function(password) {
//         return bcrypt.compare(password, this.getPassword_hash());
//     };
//
//     return Owner;
// };
