#install usb serial device driver for Gateway
CP210x USB to UART Bridge VCP Drivers

#installation
npm install serialport --build-from-source --save
npm install --save-dev crypto-js

#configuration
set the values for the constants defined in Gateway/config.js file.

#run Gateway
cd your_path_to_project_root/Gateway
sudo node serial_handle.js
