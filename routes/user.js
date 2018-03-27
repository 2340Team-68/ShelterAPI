const models = require('../models');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const auth = require('../helpers/auth/authentication');
const UserType = require('../helpers/auth/usertypes');
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
            let data = { id: result.id };
            let token = auth.login(UserType.HOMELESS, data);
            res.status(200).send({id: data.id, auth: true, token: token});
        }).catch(function(error) {
        console.log(error);
        let messages = error.errors.map((el, i) => el.message)
        res.status(500).send({auth:false, errors: messages});
    });
});

/*
    GET info of logged in user if login is succ
 */
router.post('/login', function(req, res) {
    // search for entry in table based on req query params
    models.HomelessPerson.login(req.body.email, req.body.password)
        .then(function(result) {
            let data = { id: result.id };
            let token = auth.login(UserType.HOMELESS, data);
            res.status(200).send({id: data.id, auth: true, token: token});
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

/*
    GET an existing user by id
    // todo: extend functionality to support owners and admins eventually
    // todo: move id from params to jwt
 */
router.get('/:id', (req, res) => {
    let id = req.params.id;
    let authToken = req.headers['x-access-token'];
    const permissionError = new Error('You do not have the permissions to '
        + 'access this.');
    permissionError.name = 401;
    if (!authToken) {
        // todo: put into a method or part of seperate module
        console.log("E1 "+ err.message);
        return res.status(401).send({
            auth: false,
            message: 'No token provided.'
        });
    }
    auth.decode(authToken) // de
        .then(decoded => {
            // if the user searched for is not the user logged in
            if (decoded.authLevel != UserType.HOMELESS || decoded.data.id != id) {
                throw permissionError;
            } else {
                return models.HomelessPerson.getById(decoded.data.id)
            }
        }).then(homelessPerson => {
        res.status(200).send(homelessPerson);
    }).catch(err => {
        res.status(err.name).send({message: err.message})
    });
});

/*
    update checked-in table when user checks in
 */
router.put('/checkIn/:userId/:shelterId', (req, res) => {
    console.log("PUT request being parsed");
    let shelterId = req.params.shelterId;
    console.log("shelterId: " + shelterId);
    let userId = req.params.userId; // todo: send in jwt instead
    let authToken = req.headers['x-access-token'];
    const permissionError = new Error('You do not have the permissions to '
        + 'access this.');
    permissionError.name = 401;
    if (!authToken) {
        // console.log("E1 "+ err.message);
        return res.status(401).send({
            auth: false,
            message: 'No token provided.'
        });
    }

    auth.decode(authToken) // de
        .then(decoded => {
            // if the user searched for is not the user logged in
            if (decoded.authLevel != UserType.HOMELESS || decoded.data.id != userId) {
                throw permissionError;
            } else {
                return models.Shelter.checkVacancy(shelterId)
                    .then((result) => {
                        return models.HomelessPerson.checkIn(userId, shelterId)
                            .then(() => {
                                (result.shelter).decrement('vacancies', {by: 1});
                                console.log("vacancies decremented");
                            })
                    });
            }
        }).then(() => {
            res.status(200).send("Pls make another call to get updated value");
        }).catch(err => {
            res.send({message: err.name + " " + err.message})
        });
});

module.exports = router;