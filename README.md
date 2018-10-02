# drola
DroLa : A Drone Monitering System using LORA

We introduce a seperate Hardware unit for drones which can easily mount on any kind of commercial or non-commercial drones. DroLa End node consist with a GPS module, microcontroller, LoRa module and a seperate battery. You can use GSM900A, GSM800A modules. 

setup the units according to the shematics given. End node microcontroller should contain the given firmware. Communication channel and addresses of Lora modules should be according to the given firmware.

Clone this project at the Base station. Run the following command to install the node module dependencies.

`npm install`

Connect the configured base station lora module to the base station computer. You can start the web server by running following command.

`npm start`

Then you should start the Web socket server and web socket client to see the the end node locations at the browser application.

`cd Drola_Base_node`

`pyhton socket_server.py`

`python read_serial.py`

Then open a browser tab and goto the following url it will see all the locations of the live End Nodes.

http://localhost:3000/

you can test the api by running socket_client.py instead of read_serial.py . It will show you some hardcoded locations.

Truted zones are not implemented yet to protect AES keys. The keys are hardcoded in this version.
  
Base Node Application

![Base Node App](/Drola_Base_Node/Drola_snap_4.png?raw=true "Optional Title1")

DroLa End Node

![End Node](/LoRa_End_Node/Drola_end_node.jpg?raw=true "Optional Title2")

For more informationa please refer the [Wiki](https://github.com/NamalJayasuriya/drola/wiki/Drola)page.
