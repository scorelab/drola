let express = require("express");
let cookieParser = require('cookie-parser');
let path = require('path');
let expressValidator = require('express-validator');
let flash = require('connect-flash');
let session = require('express-session');
let passport = require('passport');
let mongoose = require('mongoose');

//let re=require("socket");

// Connecting database
mongoose.connect('MONGODB_URI || Local mongoose database link');

// Initializing express app
let app = express();
app.use(cookieParser());

// Setting the view-engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let index = require('./routes/index');
let admin = require('./routes/admin');

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        let namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Associating the routes
app.use("/",index);
app.use('/admin', admin);
app.use("/css",express.static('web/css'));
app.use("/assets",express.static('web/assets'));
app.use("/js",express.static('web/js'));
app.use("/images",express.static('web/images'));
app.use("/fonts",express.static('web/fonts'));


app.listen(3000,function(){
    console.log("Communicaton link, Live at Port 3000");
});

///================Web socket server ======================//
/*
let WebSocketServer = require('websocket').server;
let http = require('http');

let server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + 'Data Socket is listening on port 8080');
});

let wsServer = new WebSocketServer({
    httpServer: server,

    autoAcceptConnections: false
});

let listners=[];
function notifyListners(){
    for (let j=0;j=listners.length;j++){
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

    let connection = request.accept('dronelink', request.origin);
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






