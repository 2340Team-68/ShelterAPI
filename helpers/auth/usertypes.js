const HOMELESS = 'h',
      EMPLOYEE = 'e',
      OWNER = 'o',
      ADMIN = 'a';

const getUserTypes = function() {
    return [HOMELESS, EMPLOYEE, OWNER, ADMIN];
}

/**
 * Validates that a user type is real
 * @param {string} type the user type
 * @throws {Error} if the user type is invalid
 */
const validateUserType = function(type) {
    var types = getUserTypes();
    for (let t of types) {
        if (type == t) {
            return;
        }
    }
    throw new TypeError("Invalid user type");
}

module.exports = {
    HOMELESS: HOMELESS,
    EMPLOYEE: EMPLOYEE,
    OWNER: OWNER,
    ADMIN: ADMIN,
    getUserTypes: getUserTypes,
    validateUserType: validateUserType
}
