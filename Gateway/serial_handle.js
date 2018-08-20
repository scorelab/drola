const SerialPort = require('serialport');
const net = require('net');
const header = require('./parser');
const config = require('./config');
const crypto = require('./crypto');

//----------- Serial Connection -----------------------------

const port = new SerialPort(config.SER_PORT);//('/dev/cu.SLAB_USBtoUART'); //('/dev/ttyACM0');
//const Readline = SerialPort.parsers.Readline;s
const Delimiter = SerialPort.parsers.Delimiter;
const parser = port.pipe(new Delimiter({delimiter: Buffer.from('\n')}));
parser.on('data', handle);

//write();// Initial sending test data
//---------- TCP Client to forward data -------------


const client = new net.Socket();

client.connect(config.TCP_PORT, config.TCP_HOST, function() {
    console.log('------ Connected To Remote Application Server -------');
    //client.write("Hello From Client " + client.address().address);
});
//client.write("Hello From Client " + client.address().address);
//------------------------------------------------------

function write(header,msg){
  var data11= Buffer.from(msg, 'ascii');
  var buf = Buffer.concat([header,data11]);
  //console.log(buf);
  port.write(buf, function(err) {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
  //console.log('message written');
  });

}

function handle(buf){
  var data={'header':{},'message':""}

  raw_data=(buf.slice(7,51)).toString('ascii'); //String(buf);
  //parse header
  data.header = header.header_parser( buf.slice(0,7) );

  //decrypt message
  if(data.header.app == 131 ){
    //console.log(raw_data);
    data.message = crypto.decrypt(raw_data);
    //console.log(data)
    client.write(JSON.stringify(data));
  }
  else{
    console.log("ERR: Currupted data => " + String(buf));
  }

  //processes data considering header data


  //send ressponse
   var packet = {"header":{"sender":4294967295, "app":143, "type":7, "ttl":7, "mf":1, "seq_num":511},"msg":"06.870808,79.880714,0718,184477","mic":""};//[4294967295, 150, 4, 3, 1, 511];
   var header_buf = header.generate_header(packet.header);
   //console.log(header_buf);
   var enc_msg =  crypto.encrypt(packet.msg);
   write(header_buf, String(enc_msg));

}
