const faker = require("faker");
const models = require("../models");

var appRouter = function (app) {
  app.get("/", function(req, res) {
    res.status(200).send({"application": "ShelterAPI"});
  });
  app.get("/shelters", function(req,res) {
    models.Shelter.findAll()
    .then(function(shelters) {
      res.status(200).send({shelters})
    });
  });
}

module.exports = appRouter;
