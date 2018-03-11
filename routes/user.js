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
    models.HomelessPerson.register(req.body.email,
                                   req.body.name,
                                   req.body.password)
    .then(function(result) {
        console.log(result);
        res.status(200).send({id:result.id});
    }).catch(function(error) {
        console.log(error);
        let messages = error.errors.map((el, i) => el.message)
        res.status(500).send({errors: messages});
    });
});

/*
    GET an existing user by id
 */
router.get('/:id', function(req, res) {
    // create entry in table
    let id = req.params.id;
    models.HomelessPerson.findById(id)
    .then(function(result) {
        if (result == null) {
            var err = new Error("Homeless Person with id '"
                + id + "' not found" );
            err.name = 404;
            throw err;
        }
        res.status(200).send(result);
    }).catch(function(error) {
        console.log(error);
        var code = 500;
        if (error.name == 404) {
            code = 404;
        }
        res.status(code).send({error: error.message});
    });
});

/*
    GET info of logged in user if login is succ
 */
router.post('/login', function(req, res) {
    // search for entry in table based on req query params
    models.HomelessPerson.login(req.body.email, req.body.password)
    .then(function(result) {
        console.log(result);
        res.status(200).send(result);
    }).catch((error) => {
            console.log(error);
            var code = 500;
            if (error.name == 404) {
                code = 404;
            }
            res.status(code).send({error: error.message});
        }
    );
});

router.get('/logout', function(req, res) {
    // just log em out

})

module.exports = router;
