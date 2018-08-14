
const change_stream = require('./database/change_stream');
const config = require('../config.js');
const msg_parser = require('./handlers/message_parser');
const net = require('net');


function back_end_service(io){
    console.log("\n-------Back End Services Started--------\n");


    // ------------------socket connection------------------------
    //create a socket connection using socket.io
    var socket = io.on('connection', (socket) => {
      socket.on('ack', (data) => {
        console.log(data);
      });
      return socket;
    });

    //-------------------mongo change stream---------------------
    console.log("------- Notofying DB Changes... ---------");
    change_stream.NOTIFY_DATABASE_CHANGES(socket);

    //----------------insert data---------------------------
    if (config.MODE == "test"){
      insert_temp_data();
    }
    else if (config.MODE == "live") {
      insert_data_from_server();
    }
    else{
      console.log("ERR : Mode "+config.MODE+"is Not Defined");
    }
  }
    // ------------------TCP Server---------------------
    //Create server
    let sockets = [];

    const server = net.createServer();
        server.listen(config.TCP_PORT, config.TCP_HOST, () => {
          console.log('------- TCP Server is running on port ' + config.TCP_PORT + ' --------');
    });

  //----------litening live data through sserver and write to real time data base--------
  function insert_data_from_server(){
        //----------- server i listenenig ------------------
        server.on('connection', function(sock) {
          console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
          sockets.push(sock);

            //---------- 'data' event handler ---------------
            sock.on('data', function(data) {
                var json_data = JSON.parse(data.toString('utf8'));
                //ToDo Verify mesage header
                //ToDo decrypt message
                var json_msg = msg_parser.MESSAGE_PARSER(json_data.header.sender, json_data.message);
                console.log('DATA : '+JSON.stringify(json_msg)); // + sock.remoteAddress
                //insert data to realtime database
                change_stream.INSERT_ONE(json_msg);

                // Write the data back to all the connected, the client will receive it as data from the server
                //sockets.forEach(function(sock, index, array) {
                //    sock.write(sock.remoteAddress + ':' + sock.remotePort + " said " + data + '\n');
                //});
            });

            //--------- 'close' event handler --------------
            sock.on('close', function(data) {
                let index = sockets.findIndex(function(o) {
                    return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
                })
                if (index !== -1) sockets.splice(index, 1);
                console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
            });
        });
  }

//-----------method to insert dummy data to real time database-------------

function insert_temp_data(){

  var d1 = { "node": 123123123, "lat":6.899715, "lng":79.860403, "date":1223, "time":334423 };
  var d2 = { "node": 123123123, "lat":6.901068, "lng":79.859513, "date":1223, "time":334424 };
  var d3 = { "node": 123123123, "lat":6.902857, "lng":79.858891, "date":1223, "time":334425 };
  var d4 = { "node": 123123123, "lat":6.905040, "lng":79.858773, "date":1223, "time":334426 };
  var d5 = { "node": 123123123, "lat":6.904944, "lng":79.860618, "date":1223, "time":334427 };
  var d6 = { "node": 123123123, "lat":6.904955, "lng":79.862324, "date":1223, "time":334428 };
  var d7 = { "node": 123123123, "lat":6.903056, "lng":79.862042, "date":1223, "time":334429 };
  var d8 = { "node": 123123123, "lat":6.900553, "lng":79.861119, "date":1223, "time":334430 };


    console.log("INserting data...");
    //var t=1000;
    setTimeout(function() {
      change_stream.INSERT_ONE(d1);
    }, 1000);
    setTimeout(function() {
        change_stream.INSERT_ONE(d2);
      }, 2000);
      setTimeout(function() {
          change_stream.INSERT_ONE(d3);
        }, 3000);
        setTimeout(function() {
            change_stream.INSERT_ONE(d4);
          }, 4000);
          setTimeout(function() {
              change_stream.INSERT_ONE(d5);
            }, 5000);
            setTimeout(function() {
                change_stream.INSERT_ONE(d6);
              }, 6000);
              setTimeout(function() {
                  change_stream.INSERT_ONE(d7);
                }, 7000);
                setTimeout(function() {
                    change_stream.INSERT_ONE(d8);
                  }, 8000);

   }

//--------------export moduless-------------------

  module.exports.BACK_END_SERVICE = back_end_service;
