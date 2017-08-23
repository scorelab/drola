
import json
from autobahn.twisted.websocket import WebSocketServerProtocol,WebSocketServerFactory
from twisted.internet import reactor
from twisted.python import log
import sys
import time

class MyServerProtocol(WebSocketServerProtocol):
    connections = list()

    def onConnect(self, request):
        print "---------conected---------"
        self.connections.append(self)

    def onOpen(self):
        print("WebSocket connection open.")

    def onClose(self, wasClean, code, reason):
        if self.connections.__contains__(self):
            self.connections.remove(self)

    def onMessage(self, payload, isBinary):
        if isBinary:
            print("Binary message received: {0} bytes".format(len(payload)))
        else:
            print("Text message received: {0}".format(payload.decode('utf8')))
        if payload.decode('utf8')!="Start":
            self.broadcast_message(payload)
            #self.sendMessage(payload, isBinary)
            #self.broadcast_message([{'lat' : 6.837226,'lng' : 80.137721, 'name' : 'namal'},{'lat' : 6.837226,'lng' : 80.137721, 'name' : 'namal'}])

    @classmethod
    def broadcast_message(cls, data):
        #payload = json.dumps(data, ensure_ascii = False)
        for c in set(cls.connections):
            reactor.callFromThread(cls.sendMessage, c, data)

if __name__ == '__main__':
    log.startLogging(sys.stdout)
    factory = WebSocketServerFactory(u"ws://127.0.0.1:9000")
    factory.protocol = MyServerProtocol
    reactor.listenTCP(9000, factory)
    reactor.run()




