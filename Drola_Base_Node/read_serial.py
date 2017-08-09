#!/usr/bin/env python


from Crypto.Cipher import AES
from Crypto import Random
import json

import serial, time
ser = serial.Serial('/dev/ttyUSB0',9600)


class AESCipher:
    def __init__( self, key ,iv):
        self.key = key
        self.iv=iv

    def encrypt( self, raw ):
        cipher = AES.new( self.key, AES.MODE_CBC, self.iv )
        return ( self.iv + cipher.encrypt( raw ) )

    def decrypt( self, enc ):
        cipher = AES.new(self.key, AES.MODE_CBC, self.iv )

        return cipher.decrypt( enc )


key=bytearray([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31])
iv = bytearray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])

aes = AESCipher(str(key),str(iv))

#----------test AES------------------------
# text="abcdefghijklmnopqrstuvwxyz12345"
# # print "text len :", len(text)
# cypher = aes.encrypt(text)
# print "cypertext: ",cypher, len(cypher)
#
# plain = aes.decrypt(cypher)
# print "\nthis :", plain

#----------------------------------------------
error=0
while 1:
    dict={}
    data=ser.readline()
    id=data[:9]
    #print id#,len(data)
    if len(data) > 40:
        if len(data[10:42])==32:
            plain = aes.decrypt(data[10:42])
            lat=float(plain[1:10])
            lng=float(plain[11:20])

        if lat>99.0 and error<2:
            #print id,": GPS_NOT_DETECTED"
            error=error+1
        else:
            dict.__setitem__("id", int(id))
            dict.__setitem__("lat", lat)
            dict.__setitem__("lng", lng)
            if error >1 and lat<99.9:
                error=0
            print json.dumps(dict)
    else:
        continue
    #ser.flushInput()
    time.sleep(1)
