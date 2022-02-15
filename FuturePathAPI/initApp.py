#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 02/15/2022
# Description:


from flask import Flask, jsonify, abort, make_response, request
from flask_login import LoginManager, login_required, current_user
from flask_socketio import SocketIO
from FuturePathAPI.libs import MongoDataBase
from FuturePathAPI.libs.MongoDataBase import User, UserManager

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
login_manager = LoginManager()
login_manager.init_app(app)
socketio = SocketIO(app)
um = UserManager()


def user_required(func):
    cu = current_user

    @login_required
    def func_wrapper(*args, **kwargs):
        username = str(kwargs.get('username'))
        if cu.username == username:
            return func(*args, **kwargs)
        return jsonify({'Username': "The username %s is Unauthorized" % username}), 401
    func_wrapper.__name__ = func.__name__
    return func_wrapper


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)


@login_manager.request_loader
def load_user(data, *args, **kwargs):
    token = data.headers.get('Token')
    if token is None:
        token = data.args.get('Token')

    if token is not None:
        username = um.checkToken(token)
        if username:
            return User(username)
    return None


@app.route('/login', methods=['POST'])
def authentication():
    """
        Login request
    :return:
    """
    if not request.json:
        abort(400)
    username = request.json.get('username')
    password = request.json.get('password')
    if not username or not password:
        return jsonify({'Malformed': "This request was malformed!"}), 400
    try:
        token = um.login(username, password)
    except Exception as e:
        # print "There was a failure of some kind the exception is: %s" % e
        return jsonify({'Exception': "There was a failure of some kind the exception is: %s" % e}), 500
    if token:
        return jsonify({'Token': "%s" % token}), 200
    else:
        return jsonify({'Username': "The username %s and/or password are not correct" % username}), 401


# @app.route("/callback", methods=["GET"])
# def callback():
#     """
#         Callback
#     :return:
#     """
#     auth_code = request.args.get('code', default="", type=str)
#     if not auth_code:
#         abort(501)
#     pike13CallBack = pike13URL + pike13OauthArgs % (auth_code, redirect_uri, clientID, clientSecret)
#     resp = requests.post(pike13CallBack)
#     print "Response Code: %s" % resp.status_code
#     print "Response: %s" % resp.content
