#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 02/15/2022
# Description: Form-fillable Web Character Sheet endpoint and reference data endpoints for d20 FuturePath

from flask import jsonify, send_from_directory
from FuturePathAPI.initApp import app
from FuturePathAPI.libs.ReferenceData import get_reference_db, init_reference_tables
from FuturePathAPI.libs.StarterCharacters import (
    init_starter_characters_table,
    get_all_starter_characters,
    get_starter_character_by_id
)

# Initialize reference and starter character tables on module load
try:
    init_reference_tables()
    init_starter_characters_table()
except Exception:
    pass



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


def _get_table_data(table_name, key_field="name"):
    db_conn = get_reference_db()
    if db_conn is None:
        return []
    docs = list(db_conn.find(collection=table_name))
    items = []
    for doc in docs:
        if key_field in doc:
            items.append(doc[key_field])
        elif "name" in doc:
            items.append(doc["name"])
        elif "die" in doc:
            items.append(doc["die"])
    return items

@app.route("/tasks/character_sheet/paths", methods=["GET"])
def get_character_paths():
    """
    :OPTIONS: GET
    :PATH: /tasks/character_sheet/paths, /v1/tasks/character_sheet/paths
    :DESC: Returns a JSON list of all official Character Paths.
    :Content-Type: application/json
    """
    return jsonify(_get_table_data("character_paths", key_field="name"))


@app.route("/tasks/character_sheet/species", methods=["GET"])
def get_species():
    """
    :OPTIONS: GET
    :PATH: /tasks/character_sheet/species, /v1/tasks/character_sheet/species
    :DESC: Returns a JSON list of all currently known official species.
    :Content-Type: application/json
    """
    return jsonify(_get_table_data("species", key_field="name"))


@app.route("/tasks/character_sheet/professions", methods=["GET"])
def get_professions():
    """
    :OPTIONS: GET
    :PATH: /tasks/character_sheet/professions, /v1/tasks/character_sheet/professions
    :DESC: Returns a JSON list of all official Character Professions.
    :Content-Type: application/json
    """
    return jsonify(_get_table_data("professions", key_field="name"))


@app.route("/tasks/character_sheet/occupations", methods=["GET"])
def get_occupations():
    """
    :OPTIONS: GET
    :PATH: /tasks/character_sheet/occupations, /v1/tasks/character_sheet/occupations
    :DESC: Returns a JSON list of all official Occupations.
    :Content-Type: application/json
    """
    return jsonify(_get_table_data("occupations", key_field="name"))


@app.route("/tasks/character_sheet/advantage_die_levels", methods=["GET"])
def get_advantage_die_levels():
    """
    :OPTIONS: GET
    :PATH: /tasks/character_sheet/advantage_die_levels, /v1/tasks/character_sheet/advantage_die_levels
    :DESC: Returns a JSON list of all official Advantage Die levels.
    :Content-Type: application/json
    """
    return jsonify(_get_table_data("advantage_die_levels", key_field="die"))


@app.route("/tasks/character_sheet/skill_die_levels", methods=["GET"])
def get_skill_die_levels():
    """
    :OPTIONS: GET
    :PATH: /tasks/character_sheet/skill_die_levels
    :DESC: Returns a JSON list of all official Skill Die levels.
    :Content-Type: application/json
    """
    return jsonify(_get_table_data("skill_die_levels", key_field="die"))


@app.route("/tasks/character_sheet/sizes", methods=["GET"])
def get_sizes():
    """
    :OPTIONS: GET
    :PATH: /tasks/character_sheet/sizes
    :DESC: Returns a JSON list of all official Sizes.
    :Content-Type: application/json
    """
    return jsonify(_get_table_data("sizes", key_field="name"))


@app.route("/v1/tasks/character_sheet/starter_characters", methods=["GET"])
@app.route("/tasks/character_sheet/starter_characters", methods=["GET"])
def get_starter_characters():
    """
    :OPTIONS: GET
    :PATH: /tasks/character_sheet/starter_characters, /v1/tasks/character_sheet/starter_characters
    :DESC: Returns a list of pre-seeded starter character sheets.
    :Content-Type: application/json
    """
    characters = get_all_starter_characters()
    return jsonify(characters)


@app.route("/v1/tasks/character_sheet/starter_characters/<char_id>", methods=["GET"])
@app.route("/tasks/character_sheet/starter_characters/<char_id>", methods=["GET"])
def get_starter_character(char_id):
    """
    :OPTIONS: GET
    :PATH: /tasks/character_sheet/starter_characters/<char_id>, /v1/tasks/character_sheet/starter_characters/<char_id>
    :DESC: Returns a specific starter character sheet JSON payload by ID.
    :Content-Type: application/json
    """
    character = get_starter_character_by_id(char_id)
    if not character:
        return jsonify({"error": f"Starter character '{char_id}' not found"}), 404
    return jsonify(character)



