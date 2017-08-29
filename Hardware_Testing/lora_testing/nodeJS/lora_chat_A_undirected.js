/**
 * Created by namal on 6/11/17.
 */

var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var serialPort = new SerialPort("/dev/ttyUSB0", {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n")
});

serialPort.on("open", function () {
  console.log('open');
  serialPort.write("Hi I'm Add:ffff from CH:08\n");
  serialPort.on('data', function(data) {
    console.log(data);
  });

});
