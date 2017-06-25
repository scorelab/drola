import serial, time
ser = serial.Serial('/dev/ttyUSB0',9600)
#while True:
ser.write('aaaaaa')
print ser.read(6)
#time.sleep(0.1)