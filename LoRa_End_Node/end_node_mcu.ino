
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
#include <AESLib.h>

static const int RXPin = 10, TXPin = 11;
static const uint32_t GPSBaud = 9600;

uint8_t key[] = {0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31};
uint8_t iv[] = {0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15};


// The TinyGPS++ object
TinyGPSPlus gps;

// The serial connection to the GPS device
SoftwareSerial ss(RXPin, TXPin);

void setup(){
  pinMode(3,INPUT); //gpio pin for AUX
  pinMode(4,OUTPUT);//gpio pin for M1
  pinMode(5,OUTPUT);//gpio pin for M2
  digitalWrite(3,HIGH);//initialize AUX
  digitalWrite(4,LOW);//initialize M1
  digitalWrite(5,LOW);//initialize m2

  Serial.begin(9600);
  ss.begin(GPSBaud);
  //Serial.println(F("LoRa end Node demonstration"));
}

void loop(){
  int a=digitalRead(3);
  char data[] = "L06.870808,79.880714,0718,184455";// L<latitude>,<longitude>,<date>,<time>
  aes_context ctx;
            ctx = aes256_cbc_enc_start(key, iv);
            aes_cbc_enc_continue(ctx, data, 32);
            aes_cbc_enc_finish(ctx);
            Serial.println(data);
            delay(1000);
//  while (ss.available() > 0 && a==1){
//    Serial.println("gps is available");
//    delay(2);
//    if (gps.encode(ss.read())){
//      if (gps.location.isValid()){
//            //String data1=getGPSData();
//            aes_context ctx;
//            ctx = aes256_cbc_enc_start(key, iv);
//            aes_cbc_enc_continue(ctx, data, 32);
//            aes_cbc_enc_finish(ctx);
//            Serial.println(data);
//            delay(1000);
//        }else{
//            return(F("PGS Not Fixed"));
//            delay(1000);
//        }
//      delay(10);
//    }
//    else{
//      Serial.println("Error , cannot read gps");
//      delay(1000);
//      }
//  }
//
//  if (millis() > 5000 && gps.charsProcessed() < 10){
//    Serial.println(F("No GPS detected: check wiring."));
//    //while(true)
//    delay(1000);
//  }

}


String getGPSData(){
  String disp="";

    //disp=disp+"L:";
    if (gps.location.isValid()){
      if (int(gps.location.lat())< 10) disp=disp+"0";
      disp=disp+String(gps.location.lat(),6);
      disp=disp+",";
      if (int(gps.location.lng())< 10) disp=disp+"0";
      disp=disp+String(gps.location.lng(), 6);
    }

    else{
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
      //Serial.print(F("INVALID"));
    }

    if (gps.time.isValid()){
      int hrs=gps.time.hour()+5;
      int mns=gps.time.minute()+30;
      hrs=hrs+mns/60;
      mns=mns%60;

      disp=disp+",";//" T:";
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
      //Serial.print(F("INVALID"));
    }
    //Serial.println(disp);
    return (disp);
    }



