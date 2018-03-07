const models = require("../models");
const express = require("express");
const router = express.Router();

router.get('/',function (req, res) {
  models.Shelter.findAll()
  .then(function(shelters) {
    res.status(200).send({shelters})
  });
});

module.exports = router;
