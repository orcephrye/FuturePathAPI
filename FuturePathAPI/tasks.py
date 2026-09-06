#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 02/15/2022
# Description:


from flask import jsonify

from FuturePathAPI.initApp import END_POINT, app, not_found

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
        "id": 1,
        "name": "rolling",
        "description": "Produces a random number between 1 and the rolling number. Optional is to add the number"
        'of dice rolls. You can also pass dice via JSON with the "/tasks/roll" endpoint',
        "uri": f"{END_POINT}/tasks/roll",
    },
    {
        "id": 2,
        "name": "character_sheet",
        "description": "Interactive form-fillable character sheet for d20 FuturePath with mobile, desktop, and multi-page print support.",
        "uri": f"{END_POINT}/tasks/character_sheet",
        "sub_endpoints": {
            "character_paths": f"{END_POINT}/tasks/character_sheet/character_paths",
            "species": f"{END_POINT}/tasks/character_sheet/species",
            "professions": f"{END_POINT}/tasks/character_sheet/professions",
            "occupations": f"{END_POINT}/tasks/character_sheet/occupations",
            "advantage_die_levels": f"{END_POINT}/tasks/character_sheet/advantage_die_levels",
            "skill_die_levels": f"{END_POINT}/tasks/character_sheet/skill_die_levels",
            "sizes": f"{END_POINT}/tasks/character_sheet/sizes",
        },
    },
    {
        "id": 3,
        "name": "ship_schematics_sheet",
        "description": "Interactive form-fillable ship schematics sheet for d20 FuturePath with mobile, desktop, and single-page print support.",
        "uri": f"{END_POINT}/tasks/ship_schematics_sheet",
        "sub_endpoints": {
            "hull_sizes": f"{END_POINT}/tasks/ship_schematics_sheet/hull_sizes",
            "hull_configurations": f"{END_POINT}/tasks/ship_schematics_sheet/hull_configurations",
            "quirks": f"{END_POINT}/tasks/ship_schematics_sheet/quirks",
            "ftl_drives": f"{END_POINT}/tasks/ship_schematics_sheet/ftl_drives",
            "hard_points_and_bays": f"{END_POINT}/tasks/ship_schematics_sheet/hard_points_and_bays",
            "weapon_types": f"{END_POINT}/tasks/ship_schematics_sheet/weapon_types",
            "bays": f"{END_POINT}/tasks/ship_schematics_sheet/bays",
            "function_upgrades": f"{END_POINT}/tasks/ship_schematics_sheet/function_upgrades",
            "attribute_upgrades": f"{END_POINT}/tasks/ship_schematics_sheet/attribute_upgrades",
            "accessories": f"{END_POINT}/tasks/ship_schematics_sheet/accessories",
            "species": f"{END_POINT}/tasks/ship_schematics_sheet/species",
        },
    },
    {
        "id": 4,
        "name": "armor",
        "description": "Armor crafting, customization, and reference system for d20 FuturePath.",
        "uri": f"{END_POINT}/tasks/armor",
        "sub_endpoints": {
            "create": f"{END_POINT}/tasks/armor/create",
            "craft": f"{END_POINT}/tasks/armor/craft",
            "trade_dr": f"{END_POINT}/tasks/armor/trade_dr",
            "spend_dr": f"{END_POINT}/tasks/armor/spend_dr",
            "masterwork": f"{END_POINT}/tasks/armor/masterwork",
            "diminish": f"{END_POINT}/tasks/armor/diminish",
            "improve": f"{END_POINT}/tasks/armor/improve",
            "craft_roll": f"{END_POINT}/tasks/armor/craft_roll",
            "baseline": f"{END_POINT}/tasks/armor/baseline",
            "tech_levels": f"{END_POINT}/tasks/armor/tech_levels",
            "special_attributes": f"{END_POINT}/tasks/armor/special_attributes",
            "customization_attributes": f"{END_POINT}/tasks/armor/customization_attributes",
            "crafting_rules": f"{END_POINT}/tasks/armor/crafting_rules",
            "examples": f"{END_POINT}/tasks/armor/examples",
            "all": f"{END_POINT}/tasks/armor/all",
        },
    },
]


@app.route("/tasks", methods=["GET"])
def get_tasks():
    """
    :OPTIONS: GET
    :PATH: /tasks
    :DESC: This returns a JSON blob showing the different end points from the '/tasks' directory.
    :Content-Type: application/json
    """
    return jsonify({"tasks": tasks})


@app.route("/tasks/<int:taskid>", methods=["GET"])
def get_tasks_id(taskid):
    """
    :OPTIONS: GET
    :PATH: /tasks/<int:taskid>
    :VARIABLES: id (integer)
    :DESC: This returns a JSON blod with information regarding a particular task
    :Content-Type: application/json
    """
    for item in tasks:
        if item["id"] == int(taskid):
            return jsonify(item)
    return not_found(404)


@app.route("/tasks/<name>", methods=["GET"])
def get_tasks_name(name):
    """
    :OPTIONS: GET
    :PATH: /tasks/<name>
    :VARIABLES: name (string)
    :DESC: This returns a JSON blod with information regarding a particular task.
    :Content-Type: application/json
    """
    for item in tasks:
        if item["name"] == name:
            return jsonify(item)
    return not_found(404)
