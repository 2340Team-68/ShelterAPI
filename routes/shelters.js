const models = require("../models");
const express = require("express");
const router = express.Router();

// TODO: check for params
/*
    GET a list of shelters
 */
router.get('/',function (req, res, next) {
    models.Shelter.findAll()
    .then(function(shelters) {
        res.status(200).send({shelters})
    }).catch(err => next(err));

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
    GET a shelter by id
 */
// TODO parse name from req
router.get('/:shelterId', function (req, res, next) {
    models.Shelter.find({
        where: {
            id: req.params.shelterId
        }
    }).then(function(result) {
        if (!result) {
            throw new errors.NotFoundError("Shelter not found");
        } else {
            res.status(200).send(result.get({plain: true}));
        }
    }).catch(err => next(err));
});

/*
 * PUT decrement shelter capacity
 */
router.put('/decrement', function(req, res, next) {
    // create entry in table
    models.Shelter.find({
        where: {
            name: req.body.shelterName
        }
    }).then(function(user) {
        if (!user) {
            throw new errors.NotFoundError("Shelter not found");
        } else {
            return user.decrement('vacancies', {by: 1})
        }
    }).then(function(result) {
        res.status(200).send("Success! pls make another get call to see reflected change. I know it sucks...");
    }).catch(err => next(err));
});
module.exports = router;
