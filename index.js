const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const routes = require("./routes/routes.js");
const EnvSetup = require("./helpers/env/envsetup");
const ErrorHandler = require("./helpers/error/error-handler").ErrorHandler;

const arguments = process.argv.slice(2);
if (arguments[0]) {
  process.env.NODE_ENV = arguments[0];
}

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
routes(app);
app.use(ErrorHandler);

var server = app.listen(3000, function () {
    // sync database depending on enironment
    EnvSetup.setup(app);
    console.log(app.get('env'))
    console.log("app running on port.", server.address().port);
});
