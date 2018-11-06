const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
//const re=require("socket");
const CronJob = require('cron').CronJob;

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

const router = express.Router();
const path = __dirname + '/';

router.use((req, res, next) => next());

router.get("/", (req, res) => {
    //checkAndredirect(req,res);
    res.sendFile(path + "web/index.html");
});

app.use("/", router);
app.use("/css", express.static('web/css'));
app.use("/js", express.static('web/js'));
app.use("/images", express.static('web/images'));
app.use("/fonts", express.static('web/fonts'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Communicaton link, Live at Port ${port}`);
});

///================Web socket server ======================//
/*
const WebSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer((request, response) => {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, () => {
    console.log((new Date()) + 'Data Socket is listening on port 8080');
});

const wsServer = new WebSocketServer({
    httpServer: server,

    autoAcceptConnections: false
});

const listners=[];
function notifyListners(){
    for (const j=0;j=listners.length;j++){
        if(listners[j]!=undefined) {
            listners[j].sendUTF(JSON.stringify([{lat: 8.742579, lng: 80.288086, name: "dr1"}, {
                lat: 8.118373,
                lng: 80.310059,
                name: "dr2"
            }, {lat: 7.748414, lng: 80.573730, name: "dr3"}]));
        }
    }

}

wsServer.on('request', (request) => {

    const connection = request.accept('dronelink', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', (message) => {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            listners.push(connection);
            console.log(listners);
            new CronJob('* * * * * *', () => {
                connection.sendUTF(JSON.stringify([{lat:8+Math.random(),lng:80+Math.random(),name:"dr1"},{lat:8+Math.random(),lng:80+Math.random(),name:"dr2"},{lat:8+Math.random(),lng:80+Math.random(),name:"dr3"}]));
            }, null, true, 'America/Los_Angeles');

        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', (reasonCode, description) => {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

*/






