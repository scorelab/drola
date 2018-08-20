# DroLa Generalized
DroLa : A LoRa Base Low Power Wide Area Network for both Fixed and Moving Sensor Systems.

We introduce a Hardware unit for Sensor nodes which can easily connect with any kind of arduino base sensors and on any kind of environment Fixed or moving. DroLa End node consist with micro-controller, LoRa module, a separate battery and one or more arduino base sensor modules.

This system has three main modules
Application server
Lora Gateway
Sensor Node (LoRa_End_Node)

Hardware setup

Setup the Hardware units, Attaching your sensor modules to the schematics given. End node micro-controller should contain the given firmware. Communication channel and addresses of Lora modules should be according to the given firmware. You can write new functions to get your sensor data and call them inside main loop to pass to the send method. You can write your own code to handle the received messages which are specific to your application.

Setup the Hardware LoRa Gateway following the instruction given in the README file in the Gateway module

Software Setting Up:
Clone this project in your workspace. Follow the instructions given in main three modules to setup the system.
To setup the end node first create the hardware module and then upload the firmware customised by you according to your application.

To setup the gate way you can use a single board computer like a Raspberry PI and Attach the lora Gateway module for multichannel gateway or a normal Lora module for a single channel gate way then copy the Gateway module of this software to that single board computer and follow the instructions given in the README file of it.

TO setting up the Application server use can use a server machine or a Normal computer and follow the instructions in the README file of Application Server module.


For system architecture Refer [Blog: LET'S START JANA](https://letstartjana.blogspot.com/).
