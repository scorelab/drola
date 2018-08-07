
/*
HardWare Used

--------*******************-------------
ATMega 328P
LoRa E45-TTL-100
GY-GPS-6MV2
--------*******************-------------

This sample sketch demonstrates the Lora end node od drola project.
collects gps data from jps module throught TinyGPSPLus and Software serial Libraries and forwad data to LoRa module.
*/

#include <TinyGPS++.h>
#include <SoftwareSerial.h>
#include "AES1.h"
#include "Base64.h"

AES aes;

void gen_iv(byte  *iv);
String getGPSData();
void sendData(char *data);
void receiveData();
void handler(char *data);
static void smartDelay(unsigned long ms);

String id="123123123";//"456456456"; // node ID
int a;

static const int RXPin = 10, TXPin = 11;
static const uint32_t GPSBaud = 9600;

// The TinyGPS++ object
TinyGPSPlus gps;

// The serial connection to the GPS device
SoftwareSerial ss(RXPin, TXPin);

//AES Security key and IV
byte key[] = { 0x2B, 0x7E, 0x15, 0x16, 0x28, 0xAE, 0xD2, 0xA6, 0xAB, 0xF7, 0x15, 0x88, 0x09, 0xCF, 0x4F, 0x3C,0x2B, 0x7E, 0x15, 0x16, 0x28, 0xAE, 0xD2, 0xA6, 0xAB, 0xF7, 0x15, 0x88, 0x09, 0xCF, 0x4F, 0x3C };
char my_iv[N_BLOCK]; //= "aaaaaaaaaaaaaaaa";//{ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};
//byte iv [N_BLOCK] ;
char data[32];//= (unsigned char *)"L06.870808,79.880714,0718,184455";

char b64data[58];
char cipher[32];

//-----------------------------------------setup-----------------------------

void setup(){
  pinMode(3,INPUT); //gpio pin for AUX
  pinMode(4,OUTPUT);//gpio pin for M1
  pinMode(5,OUTPUT);//gpio pin for M2
  digitalWrite(3,HIGH);//initialize AUX
  digitalWrite(4,LOW);//initialize M1
  digitalWrite(5,LOW);//initialize m2

  Serial.begin(9600);
  ss.begin(GPSBaud);

  aes.set_key( key , sizeof(key));  // Get the globally defined key
  //gen_iv( my_iv );                  // Generate a random IV
  //sendIV();
}

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

char*  generate_header(struct Header header, char header_arr[]){

  //char header_arr[7];
  //add sender id to header
  for(int i=3; i>=0; i--)    // start with lowest byte of number
  {
    header_arr[i] = header.sender & 0xFF;  // or: = byte( number);
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

struct Header header_parser(byte* data, struct Header header){

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

//-------------------------------- main loop ----------------------------------------

void loop(){
      String data1="06.870808,79.880714,0718,184455";//getGPSData();
      strncpy(data,data1.c_str(),32);
      while(1){
          a=digitalRead(3);
              if(a==1){
                  sendData(data);
                  delay(100);
                  receiveData();
                  break;
               }else{
                  delay(100);
               }

             }
    smartDelay(970);

    if (millis() > 5000 && gps.charsProcessed() < 10){
        sendData("99.999999,99.999999,9999,999999");
        delay(1000);
      }

}

//--------------------------AES Encryption Decryption------------------------------------------------------------
uint8_t getrnd() {
    uint8_t really_random = *(volatile uint8_t *)0x3FF20E44;
    return really_random;
}

// Generate a random initialization vector
void gen_iv(byte  *iv) {
    for (int i = 0 ; i < N_BLOCK ; i++ ) {
        iv[i]= (byte) getrnd();
    }
}

void sendIV() {
  base64_encode( b64data, (char *)my_iv, N_BLOCK);
  Serial.println("IVb64:" + String(b64data));
}

void sendData(char *data){

        byte my_iv[N_BLOCK] = { 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};
        //strncpy(my_iv,"aaaaaaaaaaaaaaaa",16);
        aes.do_aes_encrypt(data, 32 , cipher, key, 256, my_iv);
        base64_encode(b64data, (char *)cipher, aes.get_size() );//Encode Encrypted data into base64
        //Serial.println (String(b64data));
        //heder data
        struct Header header={4294967295,131,5,3,1,511};
        char msg[58];
        //generate header
        generate_header(header,msg);
        //add message data to msg array
        memcpy(msg+7,b64data,44);
        
        Serial.println(String(msg));
        //delay(100);
  }

void receiveData(){
    if(Serial.available()) {
      String a=Serial.readString();
      byte my_iv2[N_BLOCK] = {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};
      int b64len=44;
      char data2[32]="";
      if(a.substring(0,9)=="456456456"){
          strncpy(b64data,a.substring(10).c_str(),b64len);// read the incoming data as string
          int len2=base64_decode(cipher, b64data, b64len);
          aes.do_aes_decrypt((char *)cipher, len2, data2, key, 256, my_iv2);
          data2[32]='\0';
          //Serial.println ("Plain: "+String(msg) +"  size: "+len2);
          Serial.println ("Dec@Arduino:"+a.substring(0,9)+","+String(data2));
          ///delay(1000);
      }
      else{
          Serial.println(a.substring(0,9));
      }
}
  }

//--------------------------------Handler------------------------------------------------------------

void handler(char *data){


  }

//--------------------------------Smart Delay---------------------------------------------------------

static void smartDelay(unsigned long ms)
{
  unsigned long start = millis();
  do
  {
    while (ss.available())
      gps.encode(ss.read());
  } while (millis() - start < ms);
}

//--------------------------------GPS Data---------------------------------------------------------

String getGPSData(){
  String disp="";

    disp=disp+"L";
    if (gps.location.isValid()){
      if (int(gps.location.lat())< 10) disp=disp+"0";
      disp=disp+String(gps.location.lat(),6);
      disp=disp+",";
      if (int(gps.location.lng())< 10) disp=disp+"0";
      disp=disp+String(gps.location.lng(), 6);
    }

    else{
      disp=disp+"00.000000,00.000000";
      //Serial.print(F("INVALID"));
    }

    disp=disp+",";//" D:";
    if (gps.date.isValid()){
      if (gps.date.month()< 10) disp=disp+"0";
      disp=disp+gps.date.month();
      //disp=disp+"/";
      if (gps.date.day()< 10) disp=disp+"0";
      disp=disp+gps.date.day();

    }
    else{
      disp=disp+"0000";
      //Serial.print(F("INVALID"));
    }

    disp=disp+",";//" T:";
    if (gps.time.isValid()){
      int hrs=gps.time.hour()+5;
      int mns=gps.time.minute()+30;
      hrs=hrs+mns/60;
      mns=mns%60;

      if (hrs< 10) disp=disp+"0";
      disp=disp+hrs;
      //disp=disp+":";
      if ( mns< 10) disp=disp+"0";
      disp=disp+mns;
      //disp=disp+":";
      if (gps.time.second() < 10) disp=disp+"0";
      disp=disp+gps.time.second();
      //Serial.print(F("."));
      //if (gps.time.centisecond() < 10) Serial.print(F("0"));
      //Serial.print(gps.time.centisecond());

    }
    else{
      disp=disp+"000000";
      //Serial.print(F("INVALID"));
    }
    //Serial.println(disp);
    return (disp);
 }
//----------------------------------------------End--------------------------------------
