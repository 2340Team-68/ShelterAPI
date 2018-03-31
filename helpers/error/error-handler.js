const CodedError = require('./errors').CodedError;
/**
 * this handles errors thrown throughout the code
 */
module.exports.ErrorHandler = function (err, req, res, next) {
  console.error(err.toString());
  if (err.code == undefined) {
    err = new CodedError(err.message, err.fileName, err.lineNumber);
    return res.status(500).send(err.serialize());
  }
  return res.status(err.code).send(err.serialize());
}
