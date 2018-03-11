// const faker = require("faker");
const shelters = require("./shelters");
const user = require("./user");

var appRouter = function (app) {
  app.get("/", function(req, res) {
    res.status(200).send({"application": "ShelterAPI"});
  });
  app.use("/shelters", shelters);
  app.use("/user", user);
}

module.exports = appRouter;
