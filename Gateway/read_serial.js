var CryptoJS = require("crypto-js"); //npm install --save-dev crypto-js
const SerialPort = require('serialport');

var esp8266_iv  = 'AAAAAAAAAAAAAAAAAAAAAA==';//'YWFhYWFhYWFhYWFhYWFhYssQ=='
var AESKey = '2B7E151628AED2A6ABF7158809CF4F3C2B7E151628AED2A6ABF7158809CF4F3C';

var plain_iv =  new Buffer( esp8266_iv , 'base64').toString('hex');
var iv = CryptoJS.enc.Hex.parse( plain_iv );
var key= CryptoJS.enc.Hex.parse( AESKey );

//----------------------------------------

const port = new SerialPort('/dev/cu.usbmodem1411');//('/dev/cu.SLAB_USBtoUART'); //('/dev/ttyACM0');
const Readline = SerialPort.parsers.Readline;
//const parser = new Readline();
//read data from serial
//port.pipe(parser);

const Delimiter = SerialPort.parsers.Delimiter;
const parser = port.pipe(new Delimiter({delimiter: Buffer.from('\n')}));
parser.on('data', handle );

write();// Initial sending test data

//------------------------------------------------------

function decrypt(data){ // Decrypt Data  ( data=base4_encode(aes256_encrypted )
  var bytes  = CryptoJS.AES.decrypt( data.substr(10), key , { iv: iv} );
  var plaintext = bytes.toString(CryptoJS.enc.Base64);
  var decoded_b64msg =  new Buffer(plaintext , 'base64').toString('ascii');
  console.log("Dec@JS:",data.substr(0,9),"->", decoded_b64msg);
  write();// temporary reply to test
}

function encrypt(data){
  var base64 =data.toString(CryptoJS.enc.Base64);
  var encrypted = CryptoJS.AES.encrypt(base64, key, {iv: iv});
  return String("456456456,"+encrypted);
}

function write(){
  port.write(encrypt("06.870808,79.880714,0718,184466"), function(err) {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
  //console.log('message written');
  });

}

function handle(buf){
  data=buf.toString('ascii');//String(buf);
  if(data.substr(0,9)=="123123123"){
    if(data.substr(10).length > 30){
      //console.log(data.substr(10));
      decrypt(data)
    }
    else{
      console.log("ERR: Currupted data => "+data.substr(10));
    }
  }
  else{
    console.log("ERR: Node ID not identified => "+data);
  }

}
