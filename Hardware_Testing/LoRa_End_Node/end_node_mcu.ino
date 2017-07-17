
/*
HardWare Used

--------*******************-------------
ATMega 1280
LoRa E45-TTL-100
GY-GPS-6MV2 
--------*******************-------------

This sample sketch demonstrates the Lora end node od drola project.
collects gps data from jps module throught TinyGPSPLus and Software serial Libraries and forwad data to LoRa module.
*/

#include <TinyGPS++.h>
#include <SoftwareSerial.h>

static const int RXPin = 10, TXPin = 11;
static const uint32_t GPSBaud = 9600;

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
    
  while (ss.available() > 0 && a==1){
    delay(2);
    if (gps.encode(ss.read())){
      displayInfo();
      delay(10);
    }
  }
  
  if (millis() > 5000 && gps.charsProcessed() < 10){
    Serial.println(F("No GPS detected: check wiring."));
    while(true)
    delay(1000);
  }
  
}
    
void displayInfo(){
  String disp;
  if (gps.location.isValid()){
    disp=disp+"L:";
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
  
    disp=disp+" D:";
    if (gps.date.isValid()){
      if (gps.date.month()< 10) disp=disp+"0";
      disp=disp+gps.date.month();
      disp=disp+"/";
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
      
      disp=disp+" T:";
      if (hrs< 10) disp=disp+"0";
      disp=disp+hrs;
      disp=disp+":";
      if ( mns< 10) disp=disp+"0";
      disp=disp+mns;
      disp=disp+":";
      if (gps.time.second() < 10) disp=disp+"0";
      disp=disp+gps.time.second();
      //Serial.print(F("."));
      //if (gps.time.centisecond() < 10) Serial.print(F("0"));
      //Serial.print(gps.time.centisecond());
      
    }
    else{
      //Serial.print(F("INVALID"));
    }
    Serial.println(disp);
    }
  
  else{
    Serial.println(F("PGS Not Fixed"));
    delay(1000);
  }
  
}
