#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 02/15/2022
# Description:


from flask import jsonify
from FuturePathAPI.initApp import app, END_POINT
from FuturePathAPI import authentication
from FuturePathAPI import user
from FuturePathAPI import tasks
from FuturePathAPI import Rolling


options = [
    {
        'id': 1,
        'name': u'tasks',
        'description': u'Most actions including all non-authenticated actions are listed under the tasks directory. '
                       u'For more information run GET on the provided URI.',
        'uri': f"{END_POINT}/tasks"
    },
    {
        'id': 2,
        'name': u'authentication',
        'description': u'Authenticate using your username and password to get a temporary Token. For more information '
                       u'run GET on the provided URI.',
        'uri': f"{END_POINT}/login"
    },
    {
        'id': 3,
        'name': u'u',
        'description': u'\'u\' is short for \'user\'. Access under this directory requires a TOKEN provided by '
                       u'authentication.',
        'uri': f"{END_POINT}/u"
    }
]


@app.route('/', methods=['GET'])
def index():
    """
    :OPTIONS: GET
    :PATH: /
    :DESC: This returns a JSON blob showing the different actions/paths from the root/index of the API.
    :Content-Type: application/json
    """
    return jsonify({'FuturePath API Options': options})


def main():
    app.run(port=8000, debug=True)
    # socketio.run(app)


if __name__ == '__main__':
    main()
