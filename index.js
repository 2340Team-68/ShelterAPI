const models = require("./models");
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const routes = require("./routes/routes.js");
const fs = require('fs');
var parse = require('csv-parse');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

// // read the csv file
// var inputFile = 'homeless_shelter_database.csv';
// var parser = parse({delimiter: ','}, function (err, data) {
//     // when all shelter are available,then process them
//     // note: array element at index 0 contains the row of headers that we should skip
//     data.forEach(function(line) {
//         // create country object out of parsed fields
//         var shelter = {
//             "name": line[1],
//             "capacity": line[2],
//             "restrictions": line[3],
//             "longitude": line[4],
//             "latitude": line[5],
//             "address": line[6],
//             "description": line[7],
//             "phone": line[8]
//         };
//         console.log(JSON.stringify(shelter));
//     });
// });

// // read the inputFile, feed the contents to the parser
// fs.createReadStream(inputFile).pipe(parser);

var server = app.listen(3000, function () {
    // sync database
    models.sequelize.sync({
        force: true,
        logging: console.log
    })
        .then(() =>
        // manually add check so capacity can't go below zero bcs sequelize and MySql are kinda shit at this
        models.sequelize.query(
            "CREATE TRIGGER trig_vacancies_check BEFORE UPDATE ON Shelters \n" +
            "FOR EACH ROW \n" +
            "BEGIN \n" +
            "IF NEW.vacancies<0 THEN \n" +
            "SET NEW.vacancies=0; \n" +
            "CALL raise_error;\n" +
            " END IF; \n" +
            "END"
        ))
        // .then(() => models.HomelessPerson.create({ // this is a test
        //     name: 'bob',
        //     email: "bob@gmail.com",
        //     password_hash: 'pass'
        // }))
        .then(function() {
            // read the csv file
            var inputFile = 'homeless_shelter_database.csv';
            var parser = parse({delimiter: ','}, function (err, data) {
                // when all shelter are available,then process them
                // create an enum of restrictions
                data.forEach(function(line) {
                    if (line[0] === 'Unique Key') {
                        return;
                    }
                    // get the string of restrictions
                    var restrictions = line[3].split('/');
                    var restrArray = [];
                    var count = 0;
                    restrictions.forEach(function(restr) {
                        restrArray[count] = restr.toLowerCase();/* = restr.toLowerCase();*/
                        count++;
                    });
                    var restrStr = restrArray.join(',');
                    console.log(restrStr);
                    // create database entry
                    models.Shelter.create({
                        "name": line[1],
                        "capacity": parseInt(line[2]),
                        "vacancies": parseInt(line[2]),
                        "restrictions": restrStr,
                        "longitude": parseFloat(line[4]).toPrecision(8),
                        "latitude": parseFloat(line[5]).toPrecision(8),
                        "address": line[6],
                        "description": line[7],
                        "phone": line[8]
                    })
                });
            });
            // read the inputFile, feed the contents to the parser
            fs.createReadStream(inputFile).pipe(parser);
        });
    console.log("app running on port.", server.address().port);
});
