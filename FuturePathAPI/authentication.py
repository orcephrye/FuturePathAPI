#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 02/15/2022
# Description:


from flask import jsonify, abort, request
from FuturePathAPI.initApp import app, END_POINT
from flask_login import LoginManager, login_required, current_user
from FuturePathAPI.libs.MongoDataBase import User, UserManager


login_manager = LoginManager()
login_manager.init_app(app)
um = UserManager()


authentication_tasks = [
    {
        'id': 1,
        'name': u'Authenticate',
        'description': u'With a POST command submitting Username and Password via JSON to get a 24 hour temporary '
                       u'TOKEN in return. The login formate is: "{"username": <username>, "password": <password>}"',
        'uri': f"{END_POINT}/login"
    },
    {
        'id': 2,
        'name': u'test',
        'description': u'Test your token works correctly. A valid response to should "{"Auth": "Auth Test"}"',
        'uri': f"{END_POINT}/login/protected"
    }
]


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


@app.route('/login/protected', methods=['GET'])
@login_required
def testAuth():
    return jsonify({'Auth': "Auth Test"}), 200


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


@app.route('/login', methods=['GET', 'POST'])
def authentication():
    """
        Login request
    :return:
    """
    if request.method == 'GET' or request.method == 'OPTION':
        return jsonify({'Authentication Tasks': authentication_tasks})

    if not request.json:
        abort(400)
    username = request.json.get('username')
    password = request.json.get('password')
    if not username or not password:
        return jsonify({'Malformed': "This request was malformed!"}), 400
    try:
        token = um.login(username, password)
    except Exception as e:
        return jsonify({'Exception': "There was a failure of some kind the exception is: %s" % e}), 500
    if token:
        return jsonify({'Token': "%s" % token}), 200
    else:
        return jsonify({'Username': "The username %s and/or password are not correct" % username}), 401
