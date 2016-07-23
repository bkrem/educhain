var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var async = require('async');

var logger = require(__libs+'/eris/eris-logger');
var taskManager = require(__js+'/taskManager');
var taskDb = require(__js+'/taskDb');

var init = function () {

    var log = logger.getLogger('eris.chain.server');

    var portHTTP = process.env.IDI_PORT || __settings.eris.server.port_http || 8082;
    var app = express();

    // Configure PORTAL
    // app.use('/'+(__settings.eris.server.contextPath || 'hello-eris'), express.static(__dirname + '/ui'));

    // Configure JSON parsing as default
    app.use(bodyParser.json());


    /**
     * ROUTING
     */

    // GET all available task objects
    app.get('/tasks', function (req, res) {
        async.waterfall([
            // Get all available task contract addresses
            taskManager.getAllTaskAddresses,
            // Map each address to the contract and callback an array of task objects
            function (addresses, callback) {
                async.map(addresses, taskManager.getTaskAtAddress, function (err, tasks) {
                    callback(err, tasks);
                });
            }
        ], function (err, tasks) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            console.log("GET /tasks: ", tasks);
            res.json({"data": tasks});
        });
    });

    // TODO add route for userid/address to get only related tasks `/mytasks`

    // GET single
    app.get('/task/:id', function (req, res) {
        taskManager.getTaskAtIndex(req.params.id, function (data) {
            res.send(data);
        });
    });

    app.get('/keyatidx/:idx', function (req, res) {
        taskManager.getTaskKeyAtIndex(req.params.idx, function (data) {
            res.send(data);
        });
    });

    // POST new task
    app.post('/tasks', function (req, res) {
        var task = req.body;

        log.debug("POST task: ", task);
        taskManager.addTask(task, function (err) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        });

        /* chain.addDeal(deal, function (error) {
            // needs timeout!
            db.listen.once( db.events.NEW_DEAL+'_'+deal.id, function(deal) {
                res.sendStatus(200);
            });
        }); */
    });

    http.createServer(app).listen(portHTTP, function () {
        console.log('Listening for HTTP requests on port ' + portHTTP + '.');
    });
};

module.exports = {init: init};
