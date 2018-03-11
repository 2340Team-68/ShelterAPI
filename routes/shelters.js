const models = require("../models");
const express = require("express");
const router = express.Router();

// TODO: check for params
/*
    GET a list of shelters
 */
router.get('/',function (req, res) {
    models.Shelter.findAll()
    .then(function(shelters) {
        res.status(200).send({shelters})
    });

    // use query params
    // TODO: parse in params if present
    // models.Shelter.findAll({
    //     where: {
    //         restrictions: req
    //     }
    // })
    // .then(function(shelters) {
    //     res.status(200).send({shelters})
    // });
});

/*
    GET a shelter with a specific name
 */
// TODO parse name from req
router.get('/:shelterName', function (req, res) {
    models.Shelter.find({
        where: {
            name: req.params.shelterName
        }
    }).then(function(result) {
        if (!result) {
            res.status(404).send("Shelter not found");
        } else {
            res.status(200).send(result.get({plain: true}));
        }
    });
});

/*
    PUT decrement shelter capacity
 */
router.put('/decrement', function(req, res) {
    // create entry in table
    models.Shelter.find({
        where: {
            name: req.body.shelterName
        }
    }).then(function(user) {
        return user.decrement('vacancies', {by: 1})
    }).then(function(result) {
        //todo: return reflected change
        res.status(200).send("Success! pls make another get call to see reflected change. I know it sucks...");
    }).catch(function(error) {
        console.log(error);
        res.status(500).send({error: error.message + ". This means vacancy can't go below 0"});
    });
});
module.exports = router;
