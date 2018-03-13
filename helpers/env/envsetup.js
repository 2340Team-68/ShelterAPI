const fs = require('fs');
const models = require("../../models");
const parse = require('csv-parse');

const setup = function(app) {
    if (app.get('env') === 'development') {
        return models.sequelize.sync({
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
    } else {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }
}
module.exports = {
    setup : setup
}
