const models = require("../../models");
const parse = require('csv-parse');
const ShelterLoader = require('../db/shelterloader');
/**
 * Runs all necessary setup based on what environment the server is running on
 * @param {Object} app the express app currently running
 * @param {array} args any additional args
 * @return {Promise} result of setup
 */
const setup = function(app, args) {
    if (app.get('env') == 'development' || args[0] == 'reset') {
        return syncAndUpdateDB();
    } else {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }
}

function syncAndUpdateDB() {
    return models.sequelize.sync({
        force: true,
        logging: console.log
    }).then(() =>{
        ShelterLoader.validateShelterCapacities()
    }).then(() => {
        ShelterLoader.loadSheltersFromCSV()
    });
}

module.exports = {
    setup : setup
}
