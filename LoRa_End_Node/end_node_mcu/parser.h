#ifndef __PARSER__
#define __PARSER__

#include <stdint.h>
#include <string.h>


//------------------------------header message parser---------------------------
struct Header {
  uint32_t sender;  //< 2^32
  uint8_t app;  // < 2^8
  uint8_t type; // <8
  uint8_t ttl;  // <8
  uint8_t mf;   // 0/1
  uint16_t seq;  // <512
};

//-------------generating message header for LoRa--------------
char*  generate_header(struct Header header, char header_arr[]);

//--------------parser to get data from header-----------------
struct Header header_parser(char* data, struct Header header);

#endif
