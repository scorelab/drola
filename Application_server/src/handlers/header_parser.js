

    //generating message header for LoRa
    function  generate_header(header){
      var header_buff =  new Buffer(7);
      //add sender id to header
      for(var i=3; i>=0; i--)    // start with lowest byte of number
      {
        header_buff[i] = header.sender & 0xFF; // convert to bytes
        header.sender >>= 8;            // get next byte into position
      }
      //add app id to headerheader_arr
      header_buff[4] = header.app & 0xFF;
      //set last two bytes of header
      header_buff[5] = (header.type << 5) | (header.ttl << 2) | (header.mf << 1) | (header.seq_num >> 8);
      header_buff[6] = header.seq_num & 0xFF;
      return header_buff;
    },

    //parser to get data from header
    function header_parser(buffer){

      var header_data = {"sender":0, "app":0, "type":0, "ttl":0, "mf":0, "seq_num":0};
      //parse sender id from the header
      header_data.sender = buffer.readUInt32LE(0);
      //parse app id from header[5]
      header_data.app = buffer.readUInt8(4);
      var val_5 = buffer.readUInt8(5) & 0xFF;
      //parse message_type from header
      header_data.type = ( val_5 & 0b11100000)>>5;
      //parse ttl value from header
      header_data.ttl = (val_5 & 0b00011100)>>2;
      //parse more_frame bit from header
      header_data.mf = (val_5 & 0b00000010)>>1;
      //parse seq# from header
      header_data.seq_num =  (val_5 & 0b00000001)<<8 | buffer.readUInt8(6) & 0xFF;

      return(header_data);
    }

    module.exports = {

        GENERATE_HEADER : generate_header,
        HEADER_PARSER : header_parser

    }
