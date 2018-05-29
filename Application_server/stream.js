var MongoClient = require('mongodb').MongoClient;
const assert = require("assert");

var url = "mongodb://localhost:27017/drola?replicaSet=rs0";


MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("drola");

  const collection = dbo.collection("nodes");

  setTimeout(function() {
    collection.insert({ "drone": "123123123", "lat":80.674523, "lon":46.897623, "date":1223, "time":334423 }, function(err) {
      assert.ifError(err);
    });
  }, 4000);
  setTimeout(function() {
    collection.insert({ "drone": "456456456", "lat":80.674565, "lon":46.89765, "date":1225, "time":334455 }, function(err) {
      assert.ifError(err);
    });
  }, 8000);


});
