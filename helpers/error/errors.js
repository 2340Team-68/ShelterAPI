
/** wraps regular error but adds 'code' field for error codes */
class CodedError extends Error {
  /**
  * this is the default constructor for NotFoundError
  * @param {String} message the message for the not found error
  * @param {String} fileName the message for the not found error
  * @param {number} lineNumber the message for the not found error
  */
  constructor(...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
    /** @private */
    this.code = 500;
    this.name = "ServerError";
  }

  /**
  * getter for code
  * @return {number} the code
  */
  getCode() {
    return this.code;
  }

  /**
  * the coded error toString method
  * @return {String} the string representation of the coded error
  */
  toString() {
    var s = super.toString();
    return "[" + this.code + "] " + s;
  }

  /**
   * serialize the Error as json
   */
  serialize() {
    return {
      code: this.code,
      name: this.name,
      message: this.message
    };
  }
}

/**
* This error occurs when a specified resource item could not be found
*/
class NotFoundError extends CodedError {
  /**
  * this is the default constructor
  */
  constructor(...params) {
    super(...params);
    this.code = 404;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
    this.name = "NotFoundError";
  }
}

/**
* This error occurs when an someone is authenticated incorrectly or not at all
*/
class UnauthenticatedError extends CodedError {
  /**
  * this is the default constructor
  * @param {String} message the message for the not found error
  */
  constructor(...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
    this.code = 401;
    this.name = "UnauthenticatedError";
  }
}

/**
* This error occurs when an someone is not authorized to do what they are
* trying to do
*/
class UnauthorizedError extends CodedError {
  /**
  * this is the default constructor
  * @param {String} message the message for the not found error
  */
  constructor(...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
    this.code = 403;
    this.name = "UnauthorizedError";
  }
}

/**
* This error occurs when a resource to be created already exists
* (e.g. a user registration, but the email is already in use)
*/
class ConflictError extends CodedError {
  /**
  * this is the default constructor
  */
  constructor(...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
    this.code = 409;
    this.name = "ConflictError";
  }
}

/**
* This error occurs when a resource to be created already exists
* (e.g. a user registration, but the email is already in use)
*/
class NotImplementedError extends CodedError {
  /**
  * this is the default constructor
  */
  constructor(...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
    this.code = 501;
    this.name = "NotImplementedError";
  }
}

module.exports.CodedError = CodedError;
module.exports.NotFoundError = NotFoundError;
module.exports.UnauthenticatedError = UnauthenticatedError;
module.exports.UnauthorizedError = UnauthorizedError;
module.exports.ConflictError = ConflictError;
module.exports.NotImplementedError = NotImplementedError;
