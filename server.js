// zapisac w zeszycie

// builtin modules
var http = require('http');
var url = require('url');

// external modules
var static = require('node-static');
var mongodb = require('mongodb');
var cookies = require('cookies');
var uuid = require('uuid');

// our modules
var common = require('./common');
var config = require('./config');
var lib = require('./lib');
var rest = require('./rest');

// global objects
var fileServer = new static.Server(config.frontendDir);
var httpServer = http.createServer();

// handling HTTP requests
httpServer.on('request', function (req, rep) {

    // maintain the existing session or create new one
    var appCookies = new cookies(req, rep);
    var session = appCookies.get('session');
    var now = Date.now();
    if(!session || !common.sessions[session]) {
        session = uuid.v4();
        common.sessions[session] = { from: req.connection.remoteAddress, created: now, touched: now, login: null, role: 0 };
        console.log('New session ' + session + ': ' + JSON.stringify(common.sessions[session]));
    } else {
        common.sessions[session].touched = now;
    }
    appCookies.set('session', session, { httpOnly: false });

    var endpoint = url.parse(req.url, true).pathname;
    var query = url.parse(req.url, true).query;
    // create object name from endpoint url: /example/data => example.data
    var objName = endpoint.replace(/\//g, ' ').trim().replace(/\s/g, '.');

    lib.getPayload(req, rep, function(rep, payload) {

        if(rest[objName] && typeof rest[objName] == 'function') {
            try {
                console.log(session + ' endpoint=' + endpoint + ' XHR rest.' + objName, req.method, 'query=' + JSON.stringify(query), 'payload=' + JSON.stringify(payload));
                rest[objName]({ response: rep, method: req.method, query: query, payload: payload, session: session });
            } catch(ex) {
                lib.sendError(rep, 500, 'Server error ');
            }
        } else {
            console.log(req.method, endpoint);
            fileServer.serve(req, rep);
        }
    });

});

console.log('APP2020 backend started');

mongodb.MongoClient.connect(config.dbUrl, { useUnifiedTopology: true }, function(err, connection) {
    if(err) {
        console.error("Cannot connect, is the database engine started?");
        process.exit(0);
    }
    console.log("Database connected");
    common.initializeData(connection.db(config.database));
    try {
        httpServer.listen(config.port);
        console.log("HTTP server is listening on the port " + config.port);
    } catch(ex) {
        console.error("Port " + config.listeningPort + " cannot be used");
        process.exit(0);
    }
});;