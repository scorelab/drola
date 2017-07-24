#!/usr/bin/env python


#BS = 16
#pad = lambda s: s + (BS - len(s) % BS) * chr(BS - len(s) % BS)
#unpad = lambda s : s[:-ord(s[len(s)-1:])]

import base64
from Crypto.Cipher import AES
from Crypto import Random

import serial, time
ser = serial.Serial('/dev/ttyUSB0',9600)


class AESCipher:
    def __init__( self, key ,iv):
        self.key = key
        self.iv=iv

    def encrypt( self, raw ):
        #raw = pad(raw)
        cipher = AES.new( self.key, AES.MODE_CBC, self.iv )
        #return base64.b64encode( iv + cipher.encrypt( raw ) )
        return ( self.iv + cipher.encrypt( raw ) )

    def decrypt( self, enc ):
        #enc = base64.b64decode(enc)
        #iv = enc[:16]
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

while 1:
    data=ser.readline()
    print data[:-1]#,len(data)
    if len(data) > 40:
        plain = aes.decrypt(data[10:42])
        print "decrypted :", plain
    else:
        continue
    #ser.flushInput()
    time.sleep(1)
