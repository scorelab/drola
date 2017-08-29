import serial, time
ser = serial.Serial('/dev/ttyUSB1',9600)

#while True:
ser.write('\xff\xff\x08bbbbbb')

print ser.read(6)
#time.sleep(0.1)