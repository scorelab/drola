
function message_parser(id, str_data){

  var data_arr = str_data.split(",");
  //{ "node": 123123123, "lat":6.900553, "lng":79.861119, "date":1223, "time":334430 }
  var json_data = { "node": 0, "lat":0, "lng":0, "date":0, "time":0 };
  json_data.node = id;
  json_data.lat = parseFloat(data_arr[0]);
  json_data.lng = parseFloat(data_arr[1]);
  json_data.date = parseInt(data_arr[2]);
  json_data.time = parseInt(data_arr[3]);

  return json_data;
}

module.exports = {

    MESSAGE_PARSER : message_parser

}
