"""
Chat Server
===========

This simple application uses WebSockets to run a primitive chat server.
"""
import hashlib
import json

import os
import gevent
from flask import Flask, render_template
from flask.ext.socketio import SocketIO, emit
import time
from slackclient import SlackClient

SLACK_CHANNEL = os.environ.get("SLACK_CHANNEL","C03JWFXGJ")
SLACK_API_TOKEN = os.environ['SLACK_API_TOKEN']

app = Flask(__name__)
app.debug = 'DEBUG' in os.environ

socketio = SocketIO(app)


class ChatBackend(object):
    """Interface for listening on slack RTM api and shoot events!"""

    def __init__(self):
        self.socket_connections = 0
        self.users = {}
        self.sc = SlackClient(SLACK_API_TOKEN)
        self.connected_to_rtm = False
        self.channel_info = {}

    def send_to_slack(self, msg):
        msg = json.loads(msg)
        post_data = {
            "channel": SLACK_CHANNEL,
             "text": msg["text"],
             "username": msg["username"],
             "icon_url" : self.gravatarUrl(msg["username"])
        }
        self.sc.server.api_call("chat.postMessage", **post_data)

    def send_to_console(self, msg):
        """Send given data to the registered client.
        Automatically discards invalid connections."""
        print "Received a message through slack API: %s" % msg
        if(msg.get("subtype","") == "bot_message"):
          msg.update({
              "real_name" : "bot",
              "profile": {
                    "image_32" : msg["icons"]["image_48"]
                }
          })
        elif("ok" in self.users and self.users["ok"] and "user" in msg):
            user = next((user for user in self.users["members"] if user['id'] == msg["user"]), None)
            msg.update(user) if user is not None else ""

        socketio.emit('message', msg, namespace='/receive')

    def run(self):
        """Listens for new messages in slack, and sends them to clients."""
        self.users = json.loads(self.sc.server.api_call('users.list'))
        self.update_member_count()
        if self.sc.rtm_connect():
            print "Connected to slack RTM"
            socketio.emit('rtm_connected', namespace='/receive')
            self.connected_to_rtm = True
            while True:
                for msg in self.sc.rtm_read():
                    if msg["type"] == "message" and msg["channel"] == SLACK_CHANNEL:
                        gevent.spawn(self.send_to_console , msg)
                time.sleep(1)
                gevent.sleep()

    def start(self):
        """Maintains a slack RTM subscription in the background."""
        gevent.spawn(self.run)

    def update_member_count(self):
        self.channel_info = json.loads(self.sc.server.api_call("channels.info", **{"channel": SLACK_CHANNEL}))

    @classmethod
    def gravatarUrl(self, username):
        default_gravatar = "http://fedsonslack.com/img/fos_icon.png"
        grav_url = "https://www.gravatar.com/avatar/%s?default=%s" % (hashlib.md5(username.lower()).hexdigest() , default_gravatar)
        return grav_url


chats = ChatBackend()
chats.start()

@app.route('/')
def hello():
    return render_template('index.html')

@socketio.on('connect', namespace="/submit")
def handle_connection():
    print "client connected! and connection is : %s" % chats.connected_to_rtm
    chats.socket_connections += 1
    if chats.connected_to_rtm:
        params = {
            "members": len(chats.channel_info["channel"]["members"]),
            "connections": chats.socket_connections - 1
        }
        emit('rtm_connected',params, namespace='/submit')
    print "connected again! connections are now at %s" % chats.socket_connections

    gevent.sleep()

@socketio.on('disconnect', namespace="/submit")
def handle_disconnection():
    chats.socket_connections -= 1
    print "another one bites the dust! connections are now at %s" % chats.socket_connections

@socketio.on('message', namespace="/submit")
def handle_message(message):
    print('received message from console: ' + message)
    chats.send_to_slack(message)
    gevent.sleep()


@socketio.on('message', namespace="/receive")
def handle_receive(message):
    print('hmmm dunno: ' + message)


if __name__ == '__main__':
    from socketio.server import SocketIOServer
    from socketio.namespace import BaseNamespace
    from debugger import SocketIODebugger
    app.debug=True
    class MyNamespace(BaseNamespace):
      def on_my_message(self, data):
          handle_message()
    app = SocketIODebugger(app, evalex=True, namespace=MyNamespace)

    SocketIOServer(('localhost', 5000), app, resource='socket.io', policy_server=False).serve_forever()
    # socketio.run(app)



