const models = require("../models");
const express = require("express");
const router = express.Router();
var ejs = require('ejs');


router.get('/',function (req, res, next) {
    var shelters = models.Shelter.findAll();
    shelters.then(function(shelters) {
        res.render( "../views/index", {shelters: JSON.stringify(shelters)});
    }).catch(err => next(err));
});

module.exports = router;
