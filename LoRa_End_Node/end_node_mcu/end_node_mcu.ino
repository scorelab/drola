
/*
HardWare Used
--------*******************-------------
ATMega 328P (Arduino Pro Mini)
LoRa E45-TTL-100 As Lora Radio Module 
GY-GPS-6MV2 As Sensor
--------*******************-------------

This sample sketch demonstrates the Lora end node od drola project.
collects gps data from jps module throught TinyGPSPLus and Software serial Libraries and forwad data to LoRa module.
*/

#include <TinyGPS++.h>
#include <SoftwareSerial.h>
#include <AES1.h>
#include <Base64.h>
#include "node_config.h"
#include "parser.h"

AES aes;

//void gen_iv(byte  *iv);
String getGPSData();
void handler(char *data);
static void smartDelay(unsigned long ms);

int a;

static const int RXPin = 10, TXPin = 11;
static const uint32_t GPSBaud = 9600;

// The serial connection to the GPS device
SoftwareSerial ss(RXPin, TXPin);

//AES Security key and IV
byte key[32]; //{ 0x2B, 0x7E, 0x15, 0x16, 0x28, 0xAE, 0xD2, 0xA6, 0xAB, 0xF7, 0x15, 0x88, 0x09, 0xCF, 0x4F, 0x3C,0x2B, 0x7E, 0x15, 0x16, 0x28, 0xAE, 0xD2, 0xA6, 0xAB, 0xF7, 0x15, 0x88, 0x09, 0xCF, 0x4F, 0x3C };
//char my_iv[N_BLOCK]; //{ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};
//byte iv [N_BLOCK] ;
char data[32];//= (unsigned char *)"L06.870808,79.880714,0718,184455";

char b64data[58];
char cipher[32];


// The TinyGPS++ object
TinyGPSPlus gps;

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

  strncpy(key, KEY, 32);
  aes.set_key( key , sizeof(key));  // Get the globally defined key
  //gen_iv( my_iv );                  // Generate a random IV
  //sendIV();
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
    smartDelay(LOOP_DELAY);

    if (millis() > 5000 && gps.charsProcessed() < 10){
        sendData("99.999999,99.999999,9999,999999");
        delay(1000);
      }

}

//--------------------------AES Encryption Decryption------------------------------------------------------------
//uint8_t getrnd() {
//    uint8_t really_random = *(volatile uint8_t *)0x3FF20E44;
//    return really_random;
//}
//
//// Generate a random initialization vector
//void gen_iv(byte  *iv) {
//    for (int i = 0 ; i < N_BLOCK ; i++ ) {
//        iv[i]= (byte) getrnd();
//    }
//}
//
//void sendIV() {
//  base64_encode( b64data, (char *)MY_IV, N_BLOCK);
//  Serial.println("IVb64:" + String(b64data));
//}

void sendData(char *data){

    char msg[58];
    //heder data
    struct Header header={NODE_ID,APP_ID,5,3,1,511};
    //generate header
    generate_header(header,msg);

    //encrypt message
    byte my_iv[N_BLOCK];// = { 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};
    strncpy(my_iv,MY_IV,16);
    aes.do_aes_encrypt(data, 32 , cipher, key, 256, my_iv);
    base64_encode(b64data, (char *)cipher, aes.get_size() );//Encode Encrypted data into base64
        
    //add message data to msg array
    memcpy(msg+7,b64data,44);

   Serial.println(String(msg));
   //delay(100);
  }

void receiveData(){
  
    if(Serial.available()) {
      
      String aa = Serial.readString();
      byte buff[58];
      aa.getBytes(buff, aa.length());
      byte buff2[7];
      aa.getBytes(buff2,7);
      struct Header header={0,0,0,0,0,0};
      header=header_parser(buff2, header);
      //Serial.println(header.app);
      //Serial.println(aa.substring(0,18));
      
      byte my_iv2[N_BLOCK];// = {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};
      strncpy(my_iv2,MY_IV,16);
      int b64len=44;
      char data2[32]="";
      
      String buff_data = (char*)(buff+7);
      
      //Serial.println(buff_data);
      if( aa.length() > 7 ){
          memcpy(b64data,buff+7,b64len);// read the incoming data as string
          int len2=base64_decode(cipher, b64data, b64len);
          aes.do_aes_decrypt((char *)cipher, len2, data2, key, 256, my_iv2);
          data2[32]='\0';
          //Serial.println ("Plain: "+String(msg) +"  size: "+len2);
          Serial.println ("Dec@Arduino: App:" + String(header.app)+", Data: " + String(data2));
          ///delay(1000);
      }
      else{
          ;//Serial.println(buff_data);
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
