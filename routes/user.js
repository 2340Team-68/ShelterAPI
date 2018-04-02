const models = require('../models');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const auth = require('../helpers/auth/authentication');
const UserType = require('../helpers/auth/usertypes');
const UnauthorizedError = require('../helpers/error/errors').UnauthorizedError;
const UnauthenticatedError =
    require('../helpers/error/errors').UnauthenticatedError;
const router = express.Router();

// app.use( bodyParser.json());       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//     extended: true
// }));
// app.use(express.json());       // to support JSON-encoded bodies

/*
    POST a new user
 */
router.post('/register', function(req, res, next) {
    // create entry in table
    models.User.register(
        req.body.email,
        req.body.name,
        req.body.password,
        UserType.HOMELESS)
        .then(function(user) {
            let payload = { id: user.id };
            let token = auth.generateJWT(UserType.HOMELESS, payload);
            res.status(200).send({ id:user.id, auth: true, token: token });
        }).catch(err => next(err));
});

/*
    GET info of logged in user if login is succ
 */
router.post('/login', function(req, res, next) {
    // search for entry in table based on req query params
    models.User.login(req.body.email, req.body.password)
        .then(function(user) {
            let data = { id: user.id };
            let token = auth.generateJWT(UserType.HOMELESS, data);
            res.status(200).send({id: data.id, auth: true, token: token});
        }).catch(err => next(err));
});

/*
    GET current user
    // todo: extend functionality to support owners and admins eventually
 */
router.get('/', (req, res, next) => {
    let authToken = req.headers['x-access-token'];
    if (!authToken) {
        // todo: put into a method or part of seperate module
        throw new UnauthenticatedError("No auth token provided");
    }
    auth.decode(authToken) // de
        .then(decoded => {
            // if the user searched for is not the user logged in
            if (decoded.authLevel != UserType.HOMELESS) {
                throw new UnauthorizedError();
            } else {
                return models.User.getById(decoded.data.id)
            }
        }).then(homelessPerson => {
            return homelessPerson.toJSON().then(ujson => {
                return res.status(200).send(ujson);
            })
        }).catch(err => next(err));
});

 // TODO move checkIn/checkout logic to controller
// todo: add feature to reserve multiple spots
/**
 * check user into shelter
 */
router.put('/checkIn/:shelterId', (req, res, next) => {
    console.log("PUT request being parsed");
    let shelterId = req.params.shelterId;
    console.log("shelterId: " + shelterId);
    let authToken = req.headers['x-access-token'];
    if (!authToken) {
        throw new UnauthenticatedError('No token provided');
    }

    auth.decode(authToken)

        .then(decoded => {
            let userId = decoded.data.id;
            // if the user searched for is not the user logged in
            if (decoded.authLevel != UserType.HOMELESS) {
                throw new UnauthorizedError();
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
        }).catch(err => next(err));
});

/**
 * check user out of shelter
 */
router.put('/checkOut/:shelterId', (req, res, next) => {
    console.log("PUT request being parsed");
    let shelterId = req.params.shelterId;
    console.log("shelterId: " + shelterId);
    let authToken = req.headers['x-access-token'];
    if (!authToken) {
        // console.log("E1 "+ err.message);
        throw new UnauthenticatedError();
    }

    auth.decode(authToken) //
        .then(decoded => {
            let userId = decoded.data.id;
            // if the user searched for is not the user logged in
            if (decoded.authLevel != UserType.HOMELESS) {
                throw new UnauthorizedError();
            } else {
                return models.Shelter.getById(shelterId)
                    .then((result) => {
                        return models.HomelessPerson.checkOut(userId, shelterId)
                            .then(() => {
                                (result.shelter).increment('vacancies', {by: 1});
                                console.log("vacancies decremented");
                            })
                    });
            }
        }).then(() => {
            res.status(200).send("Pls make another call to get updated value");
        }).catch(err => next(err));
})

module.exports = router;
