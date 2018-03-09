const models = require("./models");
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const routes = require("./routes/routes.js");

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

var server = app.listen(3000, function () {
    // sync database
    // test input
    models.sequelize.sync()
        .then(() => models.HomelessPerson.create({ // this is a test
            name: "bob",
            email: "bob@gmail.com",
            password_hash: "pass"
        }));
    console.log("app running on port.", server.address().port);
});
