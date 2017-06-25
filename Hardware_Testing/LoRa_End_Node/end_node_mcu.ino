
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

void setup()
{
  pinMode(3,INPUT); //gpio pin for AUX
  pinMode(4,OUTPUT);//gpio pin for M1
  pinMode(5,OUTPUT);//gpio pin for M2
  digitalWrite(3,HIGH);//initialize AUX
  digitalWrite(4,LOW);//initialize M1
  digitalWrite(5,LOW);//initialize m2
  Serial.begin(9600);
  Serial1.begin(9600);

  
  ss.begin(GPSBaud);

  Serial.println(F("LoRa end Node demonstration"));
  
}

void loop()
{
  int a=digitalRead(3);
  
  while (ss.available() > 0 && a==1){
    delay(2);
    if (gps.encode(ss.read())){
      displayInfo();
      delay(10);
    }
  }
  
  if (millis() > 5000 && gps.charsProcessed() < 10)
  {
    Serial.println(F("No GPS detected: check wiring."));
    while(true);
  }
  
}

void displayInfo()
{
  Serial1.print(F("Loc: ")); 
  if (gps.location.isValid())
  {
    Serial1.print(gps.location.lat(), 6);
    Serial1.print(F(","));
    Serial1.print(gps.location.lng(), 6);
  }
  else
  {
    Serial.print(F("INVALID"));
  }

  Serial1.print(F("  D/T: "));
  if (gps.date.isValid())
  {
    Serial1.print(gps.date.month());
    Serial1.print(F("/"));
    Serial1.print(gps.date.day());
    Serial1.print(F("/"));
    Serial1.print(gps.date.year());
  }
  else
  {
    Serial.print(F("INVALID"));
  }

  Serial.print(F(" "));
  if (gps.time.isValid())
  {
    if (gps.time.hour() < 10) Serial.print(F("0"));
    Serial1.print(gps.time.hour());
    Serial1.print(F(":"));
    if (gps.time.minute() < 10) Serial.print(F("0"));
    Serial1.print(gps.time.minute());
    Serial1.print(F(":"));
    if (gps.time.second() < 10) Serial.print(F("0"));
    Serial1.print(gps.time.second());
    Serial1.print(F("."));
    if (gps.time.centisecond() < 10) Serial.print(F("0"));
    Serial1.print(gps.time.centisecond());
  }
  else
  {
    Serial.print(F("INVALID"));
  }

  Serial1.println();
}
