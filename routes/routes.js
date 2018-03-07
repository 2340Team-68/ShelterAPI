// const faker = require("faker");
const shelters = require("./shelters");

var appRouter = function (app) {
  app.get("/", function(req, res) {
    res.status(200).send({"application": "ShelterAPI"});
  });
  app.use("/shelters", shelters);
}

module.exports = appRouter;
