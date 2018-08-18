#LoRa_End_Node

#hardware setup
Use the schematic file and png file  which are under LoRa_End_Node/ directory for help of integrating your sensor modules to LoRa_End_Node

#Move the directories which are under Libraries(LoRa_End_Node/Libraries) to Your Arduino Library Directory
#Example for mac
'mv -r LoRa_End_Node/Libraries/* ~Documents/Arduino/libraries'

#Add the following libraries to arduino using Zip files which are available in the internet
'TinyGPS++'
'SoftwareSerial'

#configuration
set the values for the constants defined in LoRa_End_Node/node_config.h file.
