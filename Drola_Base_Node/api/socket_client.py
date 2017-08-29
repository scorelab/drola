from autobahn.twisted.websocket import WebSocketClientProtocol, \
    WebSocketClientFactory

from twisted.internet.defer import Deferred, inlineCallbacks
import json


def sleep(delay):
    d = Deferred()
    reactor.callLater(delay, d.callback, None)
    return d


class MyClientProtocol(WebSocketClientProtocol):

    def onConnect(self, response):
        print("Server connected: {0}".format(response.peer))

    @inlineCallbacks
    def onOpen(self):
        print("WebSocket connection open.")

        # start sending messages every second ..
        while True:
            data = json.dumps([{'lat': 6.837226, 'lng': 80.137721, 'name': 'namal'}])
                               #{'lat': 6.837226, 'lng': 80.137721, 'name': 'namal'}])
            self.sendMessage(data.encode('utf8'))
            #self.sendMessage(b"\x00\x01\x03\x04", isBinary=True)
            yield sleep(1)

    def onMessage(self, payload, isBinary):
        if isBinary:
            print("Binary message received: {0} bytes".format(len(payload)))
        else:
            print("Text message received: {0}".format(payload.decode('utf8')))

    def onClose(self, wasClean, code, reason):
        print("WebSocket connection closed: {0}".format(reason))


if __name__ == '__main__':

    import sys

    from twisted.python import log
    from twisted.internet import reactor

    log.startLogging(sys.stdout)

    factory = WebSocketClientFactory(u"ws://127.0.0.1:9000")
    factory.protocol = MyClientProtocol

    reactor.connectTCP("127.0.0.1", 9000, factory)
    reactor.run()