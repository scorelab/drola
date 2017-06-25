
/**
 * Created by namal on 6/11/17.
 */

var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var slip = require( 'node-slip' );

var serialPort = new SerialPort("/dev/ttyUSB1", {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n")
});

function hex(str) {
        var arr = [];
        for (var i = 0, l = str.length; i < l; i ++) {
            var ascii = str.charCodeAt(i);
            arr.push(ascii);
        }
        return new Buffer(arr);
}

serialPort.on("open", function () {

  console.log("open");
  serialPort.write(hex("\xff\xff\x08 Hi I'm Add:f8f8 from CH:08 \n"));
  serialPort.on('data', function(data) {
    console.log(data);
  });

  console.log('wrote');
});



