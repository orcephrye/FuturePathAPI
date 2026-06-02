#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 02/15/2022
# Description:


from flask import jsonify

from FuturePathAPI import (
    Rolling,  # noqa: F401
    authentication,  # noqa: F401
    tasks,  # noqa: F401
    user,  # noqa: F401
)

# These imports are unused by serve to activate other Flask App routes
from FuturePathAPI.initApp import END_POINT, app

options = [
    {
        "id": 1,
        "name": "tasks",
        "description": "Most actions including all non-authenticated actions are listed under the tasks directory. "
        "For more information run GET on the provided URI.",
        "uri": f"{END_POINT}/tasks",
    },
    {
        "id": 2,
        "name": "authentication",
        "description": "Authenticate using your username and password to get a temporary Token. For more information "
        "run GET on the provided URI.",
        "uri": f"{END_POINT}/login",
    },
    {
        "id": 3,
        "name": "u",
        "description": "'u' is short for 'user'. Access under this directory requires a TOKEN provided by "
        "authentication.",
        "uri": f"{END_POINT}/u",
    },
    {
        "id": 4,
        "name": "Read_the_Docs",
        "description": "Visit the documentation via a web browser: "
        "http://api.d20futurepath.com/docs/build/html/d20FuturePathAPI.html",
        "uri": "http://api.d20futurepath.com/docs/build/html/d20FuturePathAPI.html",
    },
]


@app.route("/", methods=["GET"])
def index():
    """
    :OPTIONS: GET
    :PATH: /
    :DESC: This returns a JSON blob showing the different actions/paths from the root/index of the API.
    :Content-Type: application/json
    """
    return jsonify({"FuturePath API Options": options})


def main():
    """
        This should NOT be called even when debuging. Use run.py instead.
    :return:
    """
    app.run(port=8000, debug=True)
    # socketio.run(app)


if __name__ == "__main__":
    # This should NOT be called even when debuging. Use run.py instead.
    main()
