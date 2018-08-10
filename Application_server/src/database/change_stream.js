
const MongoClient = require('mongodb').MongoClient;
const MongoClient1 = require('mongodb').MongoClient;
const config = require('../../config.js');
const assert = require("assert");

// pipeline for watching mongo change stream
// const pipeline = [
//   {
//     $match: {
//       'fullDocument.node': { $exists: true, $gt: '' },
//       $and: [{ operationType: 'insert' }],
//     },
//   },
// ];

const pipeline = [
  {
    $project: { documentKey: false }
  }
];

const url = "mongodb://"+config.MONGO_HOST+":"+config.MONGO_PORT+"/"+config.DATABASE+"?replicaSet="+config.REPLICA_SET;

function notify_db_changes(socket){
 MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) =>{
          if (err) {
            console.log(err)
            throw err
          };
          var dbo = db.db(config.DATABASE);
          const collection = dbo.collection(config.COLLECTION);
          let changeStream = collection.watch(pipeline);

          // start listen to changes
          console.log("Notofying Changes...");
          changeStream.on("change", (change)=> {
              console.log(change.fullDocument.node+", "+change.fullDocument.lat+", "+change.fullDocument.lng+","+change.fullDocument.time);
              //forward the notified changes to client via socket
              socket.emit('data', change.fullDocument);
          })

  })
}
function insert_data(data){
   MongoClient1.connect(url,{ useNewUrlParser: true }, (err, db) =>{
        if (err) {
            console.log(err)
            throw err
        };
        var dbo = db.db("drola");
        const collection = dbo.collection("nodes");
        let changeStream = collection.watch(pipeline);

        collection.insert(data, function(err) {
              assert.ifError(err);
        })

    })
   //console.log( data );
}

module.exports = {

    NOTIFY_DATABASE_CHANGES : notify_db_changes,
    INSERT_ONE : insert_data

}
