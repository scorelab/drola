

var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//----------------------mongo changeStream---------------------------------------
//pipeline for watching mongo change stream
const pipeline = [
  {
    $match: {
      'fullDocument.drone': {$exists:true, $gt : ""},
      $and: [{operationType: "insert" }]
    }
  },
];

//create a MongoClient connection
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/drola?replicaSet=rs0";
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("drola");
  const collection = dbo.collection("nodes");
  let changeStream = collection.watch(pipeline);

  // start listen to changes
  changeStream.on("change", function(change) {
        //console.log(change.fullDocument);
        //forward the notified changes to client via socket
        socket.emit('data', change.fullDocument);
    });
});
//---------------------------------------------------------------
//-----------------express app------------------------------------
app.use(cookieParser());
app.use(bodyParser.json());
var router = express.Router();
var path = __dirname + '/';

router.use(function (req,res,next) {
    next();
});

router.get("/",function(req,res){
    res.sendFile(path + "web/index.html");
});

app.use("/",router);
app.use("/css",express.static('web/css'));
app.use("/js",express.static('web/js'));
app.use("/images",express.static('web/images'));
app.use("/fonts",express.static('web/fonts'));

//------------------socket connection------------------------
//create a socket connection using socket.io
socket= io.on('connection', function (socket) {
  // socket.emit('data', { hello: 'world' });
  //log to the console when acknoledgement received from the client
  socket.on('ack', function (data) {
    console.log(data);
    });
  return socket;
  });
//-----------------------------------------------------------
server.listen(3000,function(){
    console.log("Communicaton link, Live at Port 3000");
});
//--------------------------------------------------------
