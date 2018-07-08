import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import { json } from 'body-parser';
import { MongoClient } from 'mongodb';

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);


// -----------------express app------------------------------------
app.use(cookieParser());
app.use(json());
const router = Router();

app.use('/', router);

app.use(express.static('web'));


// ----------------------mongo changeStream---------------------------------------
// pipeline for watching mongo change stream
const pipeline = [
  {
    $match: {
      'fullDocument.node': { $exists: true, $gt: '' },
      $and: [{ operationType: 'insert' }],
    },
  },
];

//create a MongoClient connection

const url = "mongodb://localhost:27017/drola?replicaSet=rs0";
MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) =>{
  if (err) {
    console.log(err)
    throw err
  };
  var dbo = db.db("drola");
  const collection = dbo.collection("nodes");
  let changeStream = collection.watch(pipeline);

  // start listen to changes
  changeStream.on("change", (change)=> {
        //console.log(change.fullDocument);
        //forward the notified changes to client via socket
        socket.emit('data', change.fullDocument);
    });
});
//---------------------------------------------------------------


// ------------------socket connection------------------------
// create a socket connection using socket.io
const Socket = io.on('connection', (socket) => {
  // socket.emit('data', { hello: 'world' });
  // log to the console when acknowledgement received from the client
  socket.on('ack', (data) => {
    console.log(data);
  });
  return socket;
});


//-----------------------------------------------------------
const port = 3000;
server.listen(port, () => {
  console.log(`Communication link, Live at Port ${port}`);
});
//--------------------------------------------------------
