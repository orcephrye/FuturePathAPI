#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 08/09/2026
# Description: Raw reference data endpoints for d20 FuturePath API

import logging

from flask import jsonify, request

from FuturePathAPI.initApp import END_POINT, app
from FuturePathAPI.libs.ReferenceData import (
    ADVANTAGE_DIE_LEVELS,
    CHARACTER_PATHS,
    DETRACTORS,
    MUTATION_DRAWBACKS,
    MUTATION_ENHANCEMENTS,
    OCCUPATIONS,
    PROFESSIONS,
    QUIRKS,
    SIZES,
    SKILL_DIE_LEVELS,
    SPECIES,
    get_reference_db,
    init_reference_tables,
)

log = logging.getLogger("data")

# Initialize reference tables on module load
try:
    init_reference_tables()
except Exception as e:
    log.error(f"Error initializing reference tables in data module: {e}")

data_endpoints = {
    "quirks": f"{END_POINT}/data/quirks",
    "detractors": f"{END_POINT}/data/detractors",
    "mutation_drawbacks": f"{END_POINT}/data/mutation_drawbacks",
    "mutation_enhancements": f"{END_POINT}/data/mutation_enhancements",
    "character_paths": f"{END_POINT}/data/character_paths",
    "species": f"{END_POINT}/data/species",
    "professions": f"{END_POINT}/data/professions",
    "occupations": f"{END_POINT}/data/occupations",
    "advantage_die_levels": f"{END_POINT}/data/advantage_die_levels",
    "skill_die_levels": f"{END_POINT}/data/skill_die_levels",
    "sizes": f"{END_POINT}/data/sizes",
}


def _get_table_data(table_name, key_field="name", fallback_list=None):
    db_conn = get_reference_db()
    if db_conn is not None:
        try:
            docs = list(db_conn.find(collection=table_name))
            if docs:
                items = []
                for doc in docs:
                    if key_field in doc:
                        items.append(doc[key_field])
                    elif "name" in doc:
                        items.append(doc["name"])
                    elif "die" in doc:
                        items.append(doc["die"])
                return items
        except Exception as e:
            log.error(f"Error fetching table '{table_name}': {e}")
    return fallback_list if fallback_list is not None else []


def _get_quirks_data():
    db_conn = get_reference_db()
    if db_conn is not None:
        try:
            docs = list(db_conn.find(collection="quirks"))
            if docs:
                for doc in docs:
                    if isinstance(doc, dict):
                        doc.pop("_id", None)
                return docs
        except Exception as e:
            log.error(f"Error fetching quirks: {e}")
    return QUIRKS


def _get_detractors_data():
    db_conn = get_reference_db()
    if db_conn is not None:
        try:
            docs = list(db_conn.find(collection="detractors"))
            if docs:
                for doc in docs:
                    if isinstance(doc, dict):
                        doc.pop("_id", None)
                return docs
        except Exception as e:
            log.error(f"Error fetching detractors: {e}")
    return DETRACTORS


def _get_mutation_drawbacks_data():
    db_conn = get_reference_db()
    if db_conn is not None:
        try:
            docs = list(db_conn.find(collection="mutation_drawbacks"))
            if docs:
                for doc in docs:
                    if isinstance(doc, dict):
                        doc.pop("_id", None)
                return docs
        except Exception as e:
            log.error(f"Error fetching mutation drawbacks: {e}")
    return MUTATION_DRAWBACKS


def _get_mutation_enhancements_data():
    db_conn = get_reference_db()
    if db_conn is not None:
        try:
            docs = list(db_conn.find(collection="mutation_enhancements"))
            if docs:
                for doc in docs:
                    if isinstance(doc, dict):
                        doc.pop("_id", None)
                if len(docs) == 1 and "cosmetic" in docs[0]:
                    return docs[0]
                elif docs:
                    return docs
        except Exception as e:
            log.error(f"Error fetching mutation enhancements: {e}")
    return MUTATION_ENHANCEMENTS


def _shorten_mutation_enhancements(data):
    if not isinstance(data, dict):
        return data

    shortened = {}
    for category, items in data.items():
        shortened_category = []
        for item in items:
            shortened_category.append({"Name": item.get('Name'),
                                       "Benefit": item.get('Benefit') if item.get('Benefit', "") else item.get('Description', ""),
                                       "MP Cost": item.get('MP Cost')})
        shortened[category] = shortened_category
    return shortened


@app.route("/data", methods=["GET"])
def get_data_index():
    """
    :OPTIONS: GET
    :PATH: /data
    :DESC: Returns a JSON blob showing all available raw reference data endpoints.
    :Content-Type: application/json
    """
    return jsonify({"data": data_endpoints})


@app.route("/data/quirks", methods=["GET"])
def get_data_quirks():
    """
    :OPTIONS: GET
    :PATH: /data/quirks
    :DESC: Returns a JSON array of objects representing all d20 FuturePath Quirks and Flaws.
    :Content-Type: application/json
    """
    return jsonify(_get_quirks_data())


@app.route("/data/detractors", methods=["GET"])
def get_data_detractors():
    """
    :OPTIONS: GET
    :PATH: /data/detractors
    :DESC: Returns a JSON array of objects representing all d20 FuturePath Detractors.
    :Content-Type: application/json
    """
    return jsonify(_get_detractors_data())


@app.route("/data/mutation_drawbacks", methods=["GET"])
@app.route("/data/mutationdrawbacks", methods=["GET"])
def get_data_mutation_drawbacks():
    """
    :OPTIONS: GET
    :PATH: /data/mutation_drawbacks, /data/mutationdrawbacks
    :DESC: Returns a JSON array of objects representing all d20 FuturePath Mutation Drawbacks.
    :Content-Type: application/json
    """
    return jsonify(_get_mutation_drawbacks_data())


@app.route("/data/mutation_enhancements", methods=["GET"])
@app.route("/data/mutationenhancements", methods=["GET"])
def get_data_mutation_enhancements():
    """
    :OPTIONS: GET
    :PATH: /data/mutation_enhancements, /data/mutationenhancements
    :DESC: Returns a JSON dataset representing all d20 FuturePath Mutation Enhancements. Supports optional 'short' query parameter (?short=true or ?short).
    :Content-Type: application/json
    """
    data = _get_mutation_enhancements_data()
    is_short = request.args.get("short") is not None and request.args.get("short").lower() != "false"
    if is_short:
        return jsonify(_shorten_mutation_enhancements(data))
    return jsonify(data)


@app.route("/data/character_paths", methods=["GET"])
@app.route("/data/paths", methods=["GET"])
def get_data_character_paths():
    """
    :OPTIONS: GET
    :PATH: /data/character_paths, /data/paths
    :DESC: Returns a JSON list of all official Character Paths.
    :Content-Type: application/json
    """
    return jsonify(_get_table_data("character_paths", key_field="name", fallback_list=CHARACTER_PATHS))


@app.route("/data/species", methods=["GET"])
def get_data_species():
    """
    :OPTIONS: GET
    :PATH: /data/species
    :DESC: Returns a JSON list of all currently known official species.
    :Content-Type: application/json
    """
    return jsonify(_get_table_data("species", key_field="name", fallback_list=SPECIES))


@app.route("/data/professions", methods=["GET"])
def get_data_professions():
    """
    :OPTIONS: GET
    :PATH: /data/professions
    :DESC: Returns a JSON list of all official Character Professions.
    :Content-Type: application/json
    """
    return jsonify(_get_table_data("professions", key_field="name", fallback_list=PROFESSIONS))


@app.route("/data/occupations", methods=["GET"])
def get_data_occupations():
    """
    :OPTIONS: GET
    :PATH: /data/occupations
    :DESC: Returns a JSON list of all official Occupations.
    :Content-Type: application/json
    """
    return jsonify(_get_table_data("occupations", key_field="name", fallback_list=OCCUPATIONS))


@app.route("/data/advantage_die_levels", methods=["GET"])
def get_data_advantage_die_levels():
    """
    :OPTIONS: GET
    :PATH: /data/advantage_die_levels
    :DESC: Returns a JSON list of all official Advantage Die levels.
    :Content-Type: application/json
    """
    return jsonify(_get_table_data("advantage_die_levels", key_field="die", fallback_list=ADVANTAGE_DIE_LEVELS))


@app.route("/data/skill_die_levels", methods=["GET"])
def get_data_skill_die_levels():
    """
    :OPTIONS: GET
    :PATH: /data/skill_die_levels
    :DESC: Returns a JSON list of all official Skill Die levels.
    :Content-Type: application/json
    """
    return jsonify(_get_table_data("skill_die_levels", key_field="die", fallback_list=SKILL_DIE_LEVELS))


@app.route("/data/sizes", methods=["GET"])
def get_data_sizes():
    """
    :OPTIONS: GET
    :PATH: /data/sizes
    :DESC: Returns a JSON list of all official Sizes.
    :Content-Type: application/json
    """
    return jsonify(_get_table_data("sizes", key_field="name", fallback_list=SIZES))

@app.route("/data/all", methods=["GET"])
def get_all_reference_data():
    """
    :OPTIONS: GET
    :PATH: /data/all
    :DESC: Returns a JSON list of all reference data endpoints.
    :Content-Type: application/json
    """
    return jsonify({
        "sizes": _get_table_data("sizes", key_field="name", fallback_list=SIZES),
        "skill_die_levels": _get_table_data("skill_die_levels", key_field="die", fallback_list=SKILL_DIE_LEVELS),
        "advantage_die_levels": _get_table_data("advantage_die_levels", key_field="die", fallback_list=ADVANTAGE_DIE_LEVELS),
        "occupations": _get_table_data("occupations", key_field="name", fallback_list=OCCUPATIONS),
        "professions": _get_table_data("professions", key_field="name", fallback_list=PROFESSIONS),
        "species": _get_table_data("species", key_field="name", fallback_list=SPECIES),
        "paths": _get_table_data("character_paths", key_field="name", fallback_list=CHARACTER_PATHS),
        "quirks": _get_quirks_data(),
        "detractors": _get_detractors_data(),
        "mutation_drawbacks": _get_mutation_drawbacks_data(),
        "mutation_enhancements": _shorten_mutation_enhancements(_get_mutation_enhancements_data()),
    })
