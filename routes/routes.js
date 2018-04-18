const shelters = require("./shelters");
const user = require("./user");
const site = require("./site");
var appRouter = function (app) {
  // app.get("/", function(req, res) {
  //   res.status(200).send({"application": "ShelterAPI"});
  // });
  app.use("/", site);
  app.use("/shelters", shelters);
  app.use("/user", user);
}

module.exports = appRouter;
