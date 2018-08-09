
#include "parser.h"



//-------------generating message header for LoRa--------------

char*  generate_header(struct Header header, char header_arr[]){

  //add sender id to header
  for(int i=3; i>=0; i--)    // start with lowest byte of number
  {
    header_arr[i] = header.sender & 0xFF;  //convert to bytes
    header.sender >>= 8;            // get next byte into position
  }

  //add app id to header
  header_arr[4] = header.app;
  //set last two bytes of header
  header_arr[5] = (header.type << 5) | (header.ttl << 2) | (header.mf << 1) | (header.seq >> 8);
  header_arr[6] = header.seq;
  //header_arr[7] = 7;
  return header_arr;
  }

  

//--------------parser to get data from header-----------------

struct Header header_parser(char* data, struct Header header){

//parse sender id from the header
 uint32_t sender=0;
 for(int i=3; i>=0; i--)    // start with lowest byte of number
  {
    sender += uint32_t(data[i]) << 8*(3-i);  //calculate value od 32bit data step by spep
  }
  header.sender=sender;

  //parse app id from header
  header.app=data[4];
  //parse message_type from header
  header.type=(data[5] & 0b11100000)>>5;
  //parse ttl value from header
  header.ttl=(data[5] & 0b00011100)>>2;
  //parse more_frame bit from header
  header.mf=(data[5] & 0b00000010)>>1;
  //parse seq# from header
  header.seq =  uint16_t(data[5] & 0b00000001)<<8 | data[6];

  return header;
}
