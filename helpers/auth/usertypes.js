const HOMELESS = 'h',
      EMPLOYEE = 'e',
      OWNER = 'o',
      ADMIN = 'a';
module.exports = {
    HOMELESS: HOMELESS,
    EMPLOYEE: EMPLOYEE,
    OWNER: OWNER,
    ADMIN: ADMIN,
    /**
     * Validates that a user type is real
     * @param {string} type the user type
     * @throws {Error} if the user type is invalid
     */
    validateUserType : function(type) {
        if (type == HOMELESS || type == OWNER || type == EMPLOYEE) {
            return;
        }
        throw new Error("Invalid user type");
    }
}
