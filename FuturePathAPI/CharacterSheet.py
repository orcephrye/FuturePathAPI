#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 02/15/2022
# Description: Form-fillable Web Character Sheet endpoint for d20 FuturePath

from flask import send_from_directory
from FuturePathAPI.initApp import app


@app.route("/v1/tasks/character_sheet/print", methods=["GET"])
@app.route("/v1/character_sheet/print", methods=["GET"])
@app.route("/v1/tasks/character_sheet", methods=["GET"])
@app.route("/v1/character_sheet", methods=["GET"])
@app.route("/tasks/character_sheet/print", methods=["GET"])
@app.route("/character_sheet/print", methods=["GET"])
@app.route("/tasks/character_sheet", methods=["GET"])
@app.route("/character_sheet", methods=["GET"])
def character_sheet():
    """
    :OPTIONS: GET
    :PATH: /v1/tasks/character_sheet, /tasks/character_sheet, /character_sheet, /tasks/character_sheet/print, or /character_sheet/print
    :DESC: Serves an interactive d20 FuturePath character sheet with responsive layout and printable view support.
    :Content-Type: text/html
    """
    return send_from_directory(app.static_folder, "character_sheet.html")

