#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 02/15/2022
# Description:


from flask import Flask, jsonify, make_response
import os

# For Testing only
# from flask_cors import CORS


BASE_URL = "http://api.d20futurepath.com"
PREFIX_VER = "/v1"
END_POINT = f"{BASE_URL}{PREFIX_VER}"


app = Flask(__name__)
app.secret_key = os.urandom(16)
# For testing only
# CORS(app)  # Commit out


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)
