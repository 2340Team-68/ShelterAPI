'use strict';
module.exports = (sequelize, DataTypes) => {
    var Employee = sequelize.define('Employee', {
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
    },{
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

    Employee.associate = function(models) {
        models.Employee.belongsToMany(models.Shelter, { as: 'Employees',
            through: {
                model: models.Role,
                unique: false
            },
            foreignKey: 'employee_id'
        });
    };

    /**
     * Determines if a hashed password is the correct one for a given user
     * @param {string} hashed_pw the hashed password to check
     * @return {boolean} whether the hashed password matches
     */
    // todo: use bcrypt when using
    Employee.prototype.validatePassword = function(hashed_pw) {
        return this.getPassword_hash() === hashed_pw;
    };

    /**
     stop model's json representation from showing the hashed_password
     */
    Employee.prototype.toJSON =  function () {
        // clones the object so hashed_password attr. is not perm. deleted
        var values = Object.assign({}, this.get());

        delete values.password_hash;
        return values;
    }

    return Employee;
};
