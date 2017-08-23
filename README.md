# drola
DroLa : A Drone Monitering System using LORA

We introduce a seperate Hardware unit for drones which can easily mount on any kind of commercial or non-commercial drones. DroLa End node consist with a GPS module, microcontroller, LoRa module and a seperate battery.

setup the units according to the shematics given. End node microcontroller should contain the given firmware. Communication hannel and addresses of Lora modules should be according to the given firmware.

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
  
DroLa End Node Shematic

![Alt text1](/LoRa_End_Node/drola_end_node.png?raw=true "Optional Title1")

DroLa Base Node Shematic

![Alt text2](/Drola_Base_Node/hardware/drola_base_node.png?raw=true "Optional Title2")
