

//parser to get data from header
function header_parser(buffer){

  var header_data = [];
  //parse sender id from the header
  header_data[0] = buffer.readUInt32LE(0);
  //parse app id from header
  header_data[1] = buffer.readUInt8(4);
  var val_5 = buffer.readUInt8(5) & 0xFF;
  //parse message_type from header
  header_data[2] = ( val_5 & 0b11100000)>>5;
  //parse ttl value from header
  header_data[3] = (val_5 & 0b00011100)>>2;
  //parse more_frame bit from header
  header_data[4] = (val_5 & 0b00000010)>>1;
  //parse seq# from header
  header_data[5] =  (val_5 & 0b00000001)<<8 | buffer.readUInt8(6) & 0xFF;

  return(header_data);
}


//generating message header for LoRa
function  generate_header(header_data){
  var header_buff =  new Buffer(7);
  //add sender id to header
  for(var i=3; i>=0; i--)    // start with lowest byte of number
  {
    header_buff[i] = header_data[0] & 0xFF;  // or: = byte( number);
    header_data[0] >>= 8;            // get next byte into position
  }
  //add app id to headerheader_arr
  header_buff[4] = header_data[1] & 0xFF;
  //set last two bytes of header
  header_buff[5] = (header_data[2] << 5) | (header_data[3] << 2) | (header_data[4] << 1) | (header_data[5] >> 8);
  header_buff[6] = header_data[5] & 0xFF;
  return header_buff;
  }
