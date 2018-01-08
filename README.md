#drola
DroLa: A Drone Monitoring System using LORA

We have introduced a separate Hardware unit for drones which can easily mount on any kind of commercial or non-commercial drones. DroLa End node consist with a GPS module, microcontroller, LoRa module and a separate battery.

Set the units up according to the schematics given. The end node microcontroller should contain the given firmware. Communication channel and addresses of Lora modules should be according to the given firmware.

Clone this project at the Base station. Run the following command to install the node module dependencies.
cd to the Drola_Base_Node folder and run the following:

`npm install`

Connect the configured base station LoRa module to the base station computer. You can start the web server by running following command (in Drola_Base_Node foler).

`npm start`

Then start the Web socket server and web socket client to see the end node locations on the browser application.

`cd Drola_Base_node`

`python socket_server.py`

`python read_serial.py`

Then open a browser tab and go to the following URL, and you will see all the locations of the live End Nodes.

http://localhost:3000/

You can test the API by running socket_client.py instead of read_serial.py. It will show you some hardcoded locations.

Trusted zones are not implemented yet to protect AES keys. The keys are hardcoded in this version.
  
Base Node Application

![Base Node App](/Drola_Base_Node/Drola_snap_4.png?raw=true "Optional Title1")

DroLa End Node

![End Node](/LoRa_End_Node/Drola_end_node.jpg?raw=true "Optional Title2")

For more information please refer the [Wiki](https://github.com/NamalJayasuriya/drola/wiki/Drola) page.
