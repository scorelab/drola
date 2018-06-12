#!/usr/bin/env python

import os, re
from Crypto.Cipher import AES
import serial, time
import sys
#from twisted.python import log
#from twisted.internet import reactor
#from autobahn.twisted.websocket import WebSocketClientProtocol, WebSocketClientFactory
#from twisted.internet.defer import Deferred, inlineCallbacks
import json
from pymongo import MongoClient

def sleep(delay):
    d = Deferred()
    reactor.callLater(delay, d.callback, None)
    return d

#------------------------ Websocket class to send data-------------------------------
'''
class MyClientProtocol(WebSocketClientProtocol):

    def onConnect(self, response):
        print("Server connected: {0}".format(response.peer))

    @inlineCallbacks
    def onOpen(self):
        print("WebSocket connection open.")
        while True:
            try:
                data1 = ser.readline()
                #print data1
                data = getSerialData(data1, aes, error)
                #print data
                #data = json.dumps([{'lat': 6.837226, 'lng': 80.137721, 'name': 'namal'}])
                                   #{'lat': 6.837226, 'lng': 80.137721, 'name': 'namal'}])
                if data!=None:
                    self.sendMessage(data.encode('utf8'))
                    #self.sendMessage(b"\x00\x01\x03\x04", isBinary=True)
                    yield sleep(0.5)
            except:
                print "unhandled error"

    def onMessage(self, payload, isBinary):
        if isBinary:
            print("Binary message received: {0} bytes".format(len(payload)))
        else:
            print("Text message received: {0}".format(payload.decode('utf8')))

    def onClose(self, wasClean, code, reason):
        print("WebSocket connection closed: {0}".format(reason))
'''
#--------------------------- AES Cyper Class ---------------------------------------------

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

#----------test AES------------------------
# text="abcdefghijklmnopqrstuvwxyz12345"
# # print "text len :", len(text)
# cypher = aes.encrypt(text)
# print "cypertext: ",cypher, len(cypher)
#
# plain = aes.decrypt(cypher)
# print "\nthis :", plain
#----------------------------------------------

#---------- Function to Read Serial Data-----------
def getSerialData(data,aes,error):
    dict = {}
    id = data[:9]
    #print id,len(data)
    if len(data) > 40:

        if len(data[10:42]) == 32:
            plain = aes.decrypt(data[10:42])
            #print plain
            lat = float(plain[1:10])
            lng = float(plain[11:20])
            date = float(plain[21:25])
            time = float(plain[26:32])

        if lat > 99.0 and error < 2:
            # print id,": GPS_NOT_DETECTED"
            error = error + 1
        else:
            dict.__setitem__("node", id)
            dict.__setitem__("lat", lat)
            dict.__setitem__("lng", lng)
            dict.__setitem__("date", int(date))
            dict.__setitem__("time", int(time))
            if error > 1 and lat < 99.9:
                error = 0
            return dict #json.dumps(dict)
    else:
        return None

#------------------------ Main Function ---------------------------------------------

if __name__ == '__main__':

    client = MongoClient('mongodb://localhost:27017/drola?replicaSet=rs0')
    db = client['drola']
    collection = db['nodes']

    files = [f for f in os.listdir('/dev/') if re.match(r'ttyUSB', f)]
    for i in files:
        print i
    device='/dev/ttyUSB'+raw_input("port number : ")

    key = bytearray(
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
         29, 30, 31])
    iv = bytearray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])

    aes = AESCipher(str(key), str(iv))
    ser = serial.Serial(device, 9600)
    error = 0

    #---------------------------- Insert Data to Remote mongodb ------------------------------------------
    while True:
        try:
            data1 = ser.readline()
            data = getSerialData(data1, aes, error)
            #{ "drone": "123123123", "lat":80.674523, "lon":46.897623, "date":1223, "time":334423 }
            if data!=None:
                print data
                result = collection.insert_one(data)
                time.sleep(0.5);
        except:
            print "unhandled error"

    #--------------------- send data through web sockets ---------------------------------
    # log.startLogging(sys.stdout)
    # factory = WebSocketClientFactory(u"ws://127.0.0.1:9000")
    # factory.protocol = MyClientProtocol
    # reactor.connectTCP("127.0.0.1", 9000, factory)
    # reactor.run()
    #------------------------------------------------
