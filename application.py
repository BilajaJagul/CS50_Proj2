#! /usr/bin/python

import os

from flask import Flask, render_template, request, session, jsonify, url_for
from flask_socketio import SocketIO, emit
from flask_session import Session
import requests
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = "OCML3BRawWEUeaxcuKHLpw"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"]='filesystem'
socketio = SocketIO(app)


@app.route("/")
def index():
    return render_template("first_time.html")

@app.route("/username", methods=["POST"])
def username_store():
    user_name = request.form.get('Username')
    session["username"] = user_name
    session["channels"]={}
    return jsonify({"success":True, "channels":['Channel No 1', 'Channel No 5', 'Channel No 2']})

@app.route("/channels", methods=["POST"])
def channel():
    user = request.form.get('Username')
    return jsonify({'success':True, 'channels':['Channel No 1','Channel No 2','Channel No 5']})

@app.route("/channel/<name>", methods=["GET"])
def channel_specific(name):
    return render_template("channel.html",name_of=name)

@socketio.on("Submit Message")
def message(data, namesapce='/chat'):
    message = data["transmission"]["message"]
    channel = data["transmission"]["channel"]
    time = data["transmission"]["time"]
    if session.get("channels"):
        if session["channels"].get(channel):
            if session["channels"][channel].get("message"):
                session["channels"][channel]["message"].append(message)
                session["channels"][channel]["time"].append(time)
            else:
                session["channels"][channel]["message"]=[message]
                session["channels"][channel]["time"]=[time]
        else:
            session["channels"][channel]={}
            session["channels"][channel]["message"]=[message]
            session["channels"][channel]["time"]=[time]
    else:
        session["channels"]={}
        session["channels"][channel]={}
        session["channels"][channel]["message"]=[message]
        session["channels"][channel]["time"]=[time]

    data = {"user":session["username"],"time":time,"message":message}
    print(data)
    socketio.emit("receive",{"data":data}, broadcast = True,namespace='/chat')

if __name__=="__main__":
    socketio.run(app)



