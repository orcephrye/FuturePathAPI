#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 02/15/2022
# Description: Form-fillable Web Character Sheet endpoint for d20 FuturePath

from flask import render_template, request
from FuturePathAPI.initApp import app


@app.route("/tasks/character_sheet", methods=["GET"])
@app.route("/character_sheet", methods=["GET"])
def character_sheet():
    """
    :OPTIONS: GET
    :PATH: /tasks/character_sheet or /character_sheet
    :DESC: Serves an interactive, form-fillable d20 FuturePath character sheet with responsive layout and multi-page print support.
    :Content-Type: text/html
    """
    return render_template("character_sheet.html")
