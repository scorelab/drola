
const change_stream = require('./database/change_stream');
const config = require('../config.js');



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
    change_stream.NOTIFY_DATABASE_CHANGES(socket);

    //----------------insert data---------------------------
    if (config.MODE == "test"){
      insert_temp_data();
    }
    else if (config.MODE == "live") {
      insert_data();
    }
    else{
      console.log("ERR : Mode "+config.MODE+"is Not Defined");
    }
  }

function insert_data(){

}
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

  module.exports.BACK_END_SERVICE = back_end_service;
