/*
    Default user routes for testing and demo
    Default use will be a homeless person
 */

const models = require('../models');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const router = express.Router();

// app.use( bodyParser.json());       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//     extended: true
// }));
// app.use(express.json());       // to support JSON-encoded bodies

/*
    POST a new user
 */
router.post('/', function(req, res) {
    // create entry in table
    models.HomelessPerson.create(
        {
            name: req.body.name,
            email: req.body.email,
            password_hash: req.body.password,
        }
    ).then(function(result) {
        // res.send(result.get({plain: true}));
        res.status(200).send(result.get({plain: true}));
    }).catch(function(error) {
        console.log(error);
        res.status(500).send({error: error.message});
    });
});

/*
    POST info of logged in user. If login is succ you get resp of user json obj.
 */
router.post('/login', function(req, res) {
    // search for entry in table based on req query params
    models.HomelessPerson.find({
        where: {
            email: req.body.email,
            password_hash: req.body.password
        }
    }).then(function(result) {
        if (!result) {
            res.status(404).send("User not found");
        } else {
            res.status(200).send(result.get({plain: true}));
        }
    });
});

router.get('/logout', function(req, res) {
    // just log em out

})

module.exports = router;
