const secrets = require('../../config/secret');
const jwt = require('jsonwebtoken');
const UserType = require('./usertypes');

const JWT_ALGORITHM = 'HS256';
const DEFAULT_EXPIRATION = "30d";
/**
* Checks to make sure the dataobject contains minimum required information
* @param {Object} data the data to validate
* @throws {Error} if the data is missing a critical component
*/
function validateData(data) {
    if (data) {
        if (data.id) {
            return;
        } else {
            throw new Error("ID required for token generation");
        }
    }
    throw new Error("Data must not be null");
}

module.exports = {
    /**
    * Creates an authorization token for a user to log in with
    * @param {string} userType the user type
    * @param {Object} data an object including (at least) the id of the user
    * @param {Object} options additional options
    * @return {Object} the token object
    */
    login: function(userType, data, options = {}) {
        UserType.validateUserType(userType); // validate the user type
        let ops = { expiresIn: DEFAULT_EXPIRATION };
        validateData(data); // check that minimum required data is there
        //set up the options
        if (options.expiresIn) {
            ops.expiresIn = options.expiresIn;
        }
        // generate the token
        var token = jwt.sign({
            authLevel: userType,
            data: data
        }, secrets.secret, ops);

        return token;
    },
    /**
     * Decodes a token, making sure it is valid first
     * @param {string} token the token to decode
     * @return {Promise} a promise with the decoded token on success
     * @throws {Error} if the token is null or invalid, or tampering is evident
     */
    decode: function(token) {
        var promise = new Promise((resolve, reject) => {
            if (token == undefined) {
                reject(new Error('Null or invalid token provided'))
            }
            let ops = {
                algorithms: [JWT_ALGORITHM]
            }
            jwt.verify(token, secrets.secret, ops, (err, decoded) => {
                err ? reject(err) : resolve(decoded);
            });
        });
        return promise;
    }
}
