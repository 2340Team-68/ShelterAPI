var Hapi = require('hapi');

// create the server
var server = new Hapi.Server({ port : 3000, host: 'localhost' });

server.route({
  method: 'GET',
  path: '/api',
  handler: function(req, h) {
    return {"api":"hello"}
  }
});

async function startServer() {
  await server.start() // start the Hapi server on your localhost
  console.log('Now Visit: http://localhost:' + server.info.port + '/YOURNAME');
}

startServer();

module.exports = server;
