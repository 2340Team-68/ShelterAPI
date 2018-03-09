'use strict';
module.exports = (sequelize, DataTypes) => {
    var Owner = sequelize.define('Owner', {
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

    Owner.associate = function(models) {
        models.Owner.hasOne(models.Shelter);
    };

    /**
     * Determines if a hashed password is the correct one for a given user
     * @param {string} hashed_pw the hashed password to check
     * @return {boolean} whether the hashed password matches
     */
    Owner.prototype.validatePassword = function(hashed_pw) {
        return password_hash === hashed_pw;
    };

    return Owner;
};
