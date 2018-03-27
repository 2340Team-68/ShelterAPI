// /*
//     Default user routes for testing and demo
//     Default use will be a homeless person
//  */
// const models = require('../models');
// const bodyParser = require('body-parser');
// const express = require('express');
// const app = express();
// const auth = require('../helpers/auth/authentication');
// const UserType = require('../helpers/auth/usertypes');
// const router = express.Router();
//
// // app.use( bodyParser.json());       // to support JSON-encoded bodies
// // app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
// //     extended: true
// // }));
// // app.use(express.json());       // to support JSON-encoded bodies
//
// /*
//     GET list of all users
//     // todo: make this work
//  */
// router.get('/', function(req, res) {
//     // get list of shelters. Filter based on params.
//     models.HomelessPerson.(req.body.email,
//                                    req.body.name,
//                                    req.body.password)
//     .then(function(result) {
//         let data = { id: result.id };
//         let token = auth.login(UserType.HOMELESS, data);
//         res.status(200).send({id: data.id, auth: true, token: token});
//     }).catch(function(error) {
//         console.log(error);
//         let messages = error.errors.map((el, i) => el.message)
//         res.status(500).send({auth:false, errors: messages});
//     });
// });
//
// /*
//     GET an existing user by username
//     // todo: extend functionality to support owners and admins eventually
//  */
// router.get('/:username', (req, res) => {
//     let id = req.params.username;
//     let authToken = req.headers['x-access-token'];
//     const permissionError = new Error('You do not have the permissions to '
//         + 'access this.');
//     permissionError.name = 401;
//     if (!authToken) {
//         console.log("E1 "+ err.message);
//         return res.status(401).send({
//             auth: false,
//             message: 'No token provided.'
//         });
//     }
//     auth.decode(authToken) // de
//     .then(decoded => {
//         // if the user searched for is not the user logged in
//         if (decoded.authLevel != UserType.HOMELESS || decoded.data.id != id) {
//             throw permissionError;
//         } else {
//             return models.HomelessPerson.getById(decoded.data.id)
//         }
//     }).then(homelessPerson => {
//         res.status(200).send(homelessPerson);
//     }).catch(err => {
//         res.status(err.name).send({message: err.message})
//     });
// });
//
// module.exports = router;
