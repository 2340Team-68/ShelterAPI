const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const routes = require("./routes/routes.js");
const EnvSetup = require("./helpers/env/envsetup")

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);


var server = app.listen(3000, function () {
    // sync database depending on enironment
    EnvSetup.setup(app);
    console.log("app running on port.", server.address().port);
});
