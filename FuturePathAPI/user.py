#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 02/15/2022
# Description:


from flask import jsonify
from FuturePathAPI.initApp import app, END_POINT
from flask_login import login_required


utasks = [
    {
        'id': 1,
        'name': u'username_info',
        'description': u'Get information related too your account.',
        'uri': f"{END_POINT}/u/<username>/info"
    },
]


@app.route('/u', methods=['GET'])
def user_tasks():
    """
        This returns a list of possible username tasks
    :return: JSON
    """
    return jsonify({'Username Tasks': utasks})


@app.route('/u/<username>/info', methods=['GET'])
@login_required
def user_info():
    return jsonify({'WorkInProgress': "This end point has yet to be implemented"})
