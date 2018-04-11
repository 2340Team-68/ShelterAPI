const models = require("../../models");
const parse = require('csv-parse');
const fs = require('fs');

const DEFAULT_FILE ='homeless_shelter_database.csv';

var loadSheltersFromCSV = function(filename = DEFAULT_FILE) {
    // read the csv file
    var inputFile = filename;
    var parser = parse({delimiter: ','}, function (err, data) {
        // when all shelter are available,then process them
        // create an enum of restrictions
        data.forEach(function(line) {
            if (line[0] === 'Unique Key') {
                return;
            }
            line = line.map(el => el.trim());
            // create database entry
            models.Shelter.createFromCSV(line);
        });
    });
    // read the inputFile, feed the contents to the parser
    return fs.createReadStream(inputFile).pipe(parser);
}

var validateShelterCapacities = function() {
    // manually add check so capacity can't go below zero bcs sequelize and MySql are kinda shit at this
    return models.sequelize.query(
        "CREATE TRIGGER trig_vacancies_check BEFORE UPDATE ON Shelters \n" +
        "FOR EACH ROW \n" +
        "BEGIN \n" +
        "IF NEW.vacancies<0 THEN \n" +
        "SET NEW.vacancies=0; \n" +
        "CALL raise_error;\n" +
        " END IF; \n" +
        "END"
    );
}

module.exports = {
    loadSheltersFromCSV : loadSheltersFromCSV,
    validateShelterCapacities : validateShelterCapacities
}
