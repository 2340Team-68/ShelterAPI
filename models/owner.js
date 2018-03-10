'use strict';
module.exports = (sequelize, DataTypes) => {
    var Owner = sequelize.define('Owner', {
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
