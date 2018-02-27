var express = require("express");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var re=require("socket");
//var CronJob = require('cron').CronJob;

var app = express();
app.use(cookieParser());
app.use(bodyParser.json());

var router = express.Router();
var path = __dirname + '/';

router.use(function (req,res,next) {
    next();
});

router.get("/",function(req,res){
    //checkAndredirect(req,res);
    res.sendFile(path + "web/index.html");
});
router.get("/sign-up.html",function(req,res){
    //checkAndredirect(req,res);
    res.sendFile(path + "web/sign-up.html");
});
router.get("/sign-in.html",function(req,res){
    //checkAndredirect(req,res);
    res.sendFile(path + "web/sign-in.html");
});

app.use("/",router);
app.use("/css",express.static('web/css'));
app.use("/js",express.static('web/js'));
app.use("/images",express.static('web/images'));
app.use("/fonts",express.static('web/fonts'));


app.listen(3000,function(){
    console.log("Communicaton link, Live at Port 3000");
});

///================Web socket server ======================//
/*
var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + 'Data Socket is listening on port 8080');
});

var wsServer = new WebSocketServer({
    httpServer: server,

    autoAcceptConnections: false
});

var listners=[];
function notifyListners(){
    for (var j=0;j=listners.length;j++){
        if(listners[j]!=undefined) {
            listners[j].sendUTF(JSON.stringify([{lat: 8.742579, lng: 80.288086, name: "dr1"}, {
                lat: 8.118373,
                lng: 80.310059,
                name: "dr2"
            }, {lat: 7.748414, lng: 80.573730, name: "dr3"}]));
        }
    }

}

wsServer.on('request', function(request) {

    var connection = request.accept('dronelink', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            listners.push(connection);
            console.log(listners);
            new CronJob('* * * * * *', function() {
                connection.sendUTF(JSON.stringify([{lat:8+Math.random(),lng:80+Math.random(),name:"dr1"},{lat:8+Math.random(),lng:80+Math.random(),name:"dr2"},{lat:8+Math.random(),lng:80+Math.random(),name:"dr3"}]));
            }, null, true, 'America/Los_Angeles');

        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

*/
