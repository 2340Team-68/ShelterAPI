'use strict';
module.exports = (sequelize, DataTypes) => {
    var Employee = sequelize.define('Employee', {
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
    },{
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

    Employee.associate = function(models) {
        models.Employee.belongsTo(models.Shelter);
    };

    /**
     * Determines if a hashed password is the correct one for a given user
     * @param {string} hashed_pw the hashed password to check
     * @return {boolean} whether the hashed password matches
     */
    Employee.prototype.validatePassword = function(hashed_pw) {
        return this.getPassword_hash() === hashed_pw;
    };
    return Employee;
};
