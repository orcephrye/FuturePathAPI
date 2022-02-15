#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 02/15/2022
# Description:


from flask import jsonify
from flask_login import login_required
from FuturePathAPI import initApp
from FuturePathAPI.initApp import app, not_found
from Rolling import Rolling

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
                       u'of dice rolls',
        'uri': "http://ip.ad.dr.ess/tasks/roll/d<dice number>/<optional:numer of rolls>"
    },
    {
        'id': 2,
        'name': u'weapon_crafting',
        'description': u'Creating a new custom weapon',
        'uri': ""
    }
]


@app.route('/tasks', methods=['GET'])
def get_tasks():
    """
        This returns a list of possible tasks
    :return:
    """
    return jsonify({'tasks': tasks})


@app.route('/tasks/<int:id>', methods=['GET'])
def get_tasks_id(taskid):
    """
        This returns information regarding a particular task
    :param taskid: a integervalue
    :return:
    """
    for item in tasks:
        if item['id'] == taskid:
            return jsonify(item)
    return not_found(404)


@app.route('/tasks/<name>', methods=['GET'])
def get_tasks_name(name):
    for item in tasks:
        if item['name'] == name:
            return jsonify(item)
    return not_found(404)


@app.route('/protected', methods=['GET'])
@login_required
def testAuth():
    return jsonify({'Auth': "Auth Test"}), 200


def main():
    app.run(debug=True)
    # socketio.run(app)


if __name__ == '__main__':
    main()
