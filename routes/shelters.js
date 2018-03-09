const models = require("../models");
const express = require("express");
const router = express.Router();

// TODO: check for params
/*
    get a list of shelters
 */
router.get('/',function (req, res) {
    models.Shelter.findAll()
    .then(function(shelters) {
        res.status(200).send({shelters})
    });

    // use query params
    // TODO: parse in params if present
    models.Shelter.findAll({
        where: {
            name: DataTypes.STRING,
            [or]: [
                {
                    latitude: DataTypes.DECIMAL,
                    longitude: DataTypes.DECIMAL,
                },
            ],
            capacity: DataTypes.INTEGER,
            restrictions: DataTypes.STRING,  // TODO: make sure this is enum
            address: DataTypes.STRING,
            phone: DataTypes.STRING,
            description: DataTypes.TEXT
        }
    }).then(function(shelters) {
        res.status(200).send({shelters})
    });
});

/*
    get a shelter with same name
 */
// TODO parse name from req
router.get('/:shelterId', function (req, res) {
    models.Shelter.findOne(Sequelize.transaction()).then(function(shelters) {
        res.status(200).send({shelters})
    });
});

module.exports = router;
