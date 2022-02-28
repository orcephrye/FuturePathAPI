#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 02/15/2022
# Description:


from flask import jsonify
from FuturePathAPI.initApp import app, not_found, END_POINT


"""
    {
        'id': 2,
        'name': u'character_creation',
        'description': u'Creating a new character',
        'steps': {1: {'name': 'rollDice', 'uri': "", 'type': 'GET'},
                  2: {'name': 'setAbilities', 'type': 'POST', 'uri': ""},
                  3: {'name': 'getSpecies', 'type': 'GET', 'uri': ""},
                  4: {'name': 'setSpecie', 'type': 'POST', 'uri': ""},
                  5: {'name': 'getBaseClasses', 'type': 'GET', 'uri': ""},
                  6: {'name': 'setBaseClasses', 'type': 'POST', 'uri': ""},
                  7: {'name': 'getTalents', 'type': 'GET', 'uri': ""},
                  8: {'name': 'setTalents', 'type': 'POST', 'uri': ""},
                  9: {'name': 'getFeats', 'type': 'GET', 'uri': ""},
                  10: {'name': 'setFeats', 'type': 'POST', 'uri': ""}},
        'uri': ""
    },
"""

tasks = [
    {
        'id': 1,
        'name': u'rolling',
        'description': u'Produces a random number between 1 and the rolling number. Optional is to add the number'
                       u'of dice rolls. You can also pass dice via JSON with the "/tasks/roll" endpoint',
        'uri': f"{END_POINT}/tasks/roll"
    }
]


@app.route('/tasks', methods=['GET'])
def get_tasks():
    """
    :OPTIONS: GET
    :PATH: /tasks
    :DESC: This returns a JSON blob showing the different end points from the '/tasks' directory.
    :Content-Type: application/json
    """
    return jsonify({'tasks': tasks})


@app.route('/tasks/<int:taskid>', methods=['GET'])
def get_tasks_id(taskid):
    """
    :OPTIONS: GET
    :PATH: /tasks/<int:taskid>
    :VARIABLES: id (integer)
    :DESC: This returns a JSON blod with information regarding a particular task
    :Content-Type: application/json
    """
    for item in tasks:
        if item['id'] == int(taskid):
            return jsonify(item)
    return not_found(404)


@app.route('/tasks/<name>', methods=['GET'])
def get_tasks_name(name):
    """
    :OPTIONS: GET
    :PATH: /tasks/<name>
    :VARIABLES: name (string)
    :DESC: This returns a JSON blod with information regarding a particular task.
    :Content-Type: application/json
    """
    for item in tasks:
        if item['name'] == name:
            return jsonify(item)
    return not_found(404)
