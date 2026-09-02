#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 09/02/2026
# Description: Form-fillable Web Ship Schematics Sheet endpoint and reference data endpoints for d20 FuturePath

import logging

from flask import jsonify, send_from_directory

from FuturePathAPI.initApp import app
from FuturePathAPI.libs.ReferenceData import SPECIES, get_reference_db
from FuturePathAPI.libs.SpaceShipReferenceData import (
    HULL_CONFIGURATIONS,
    HULL_SIZES,
    SHIP_ACCESSORIES,
    SHIP_ATTRIBUTE_UPGRADES,
    SHIP_BAYS,
    SHIP_FUNCTION_UPGRADES,
    SHIP_QUIRKS,
    SHIP_WEAPON_TYPES,
    SPACECRAFT_HARD_POINTS_AND_BAYS,
    SPACESHIP_FTL_DRIVES,
    init_spaceship_reference_tables,
)

log = logging.getLogger("ShipSchematicsSheet")

# Initialize spaceship reference tables on module load
try:
    init_spaceship_reference_tables()
except Exception as e:
    log.error(f"Error initializing spaceship reference tables in ShipSchematicsSheet: {e}")


@app.route("/tasks/ship_schematics_sheet/print", methods=["GET"])
@app.route("/ship_schematics_sheet/print", methods=["GET"])
@app.route("/tasks/ship_schematics_sheet", methods=["GET"])
@app.route("/ship_schematics_sheet", methods=["GET"])
@app.route("/tasks/shipschematicssheet", methods=["GET"])
@app.route("/shipschematicssheet", methods=["GET"])
def ship_schematics_sheet():
    """
    :OPTIONS: GET
    :PATH: /tasks/ship_schematics_sheet, /ship_schematics_sheet, /tasks/ship_schematics_sheet/print, /ship_schematics_sheet/print
    :DESC: Serves an interactive d20 FuturePath spaceship schematics sheet with responsive layout and single-page print support.
    :Content-Type: text/html
    """
    return send_from_directory(app.static_folder, "ship_schematics_sheet.html")


def _get_table_docs(collection_name, fallback_data):
    db_conn = get_reference_db()
    if db_conn is not None:
        try:
            docs = list(db_conn.find(collection=collection_name))
            if docs:
                for doc in docs:
                    if isinstance(doc, dict):
                        doc.pop("_id", None)
                if isinstance(fallback_data, dict) and len(docs) == 1:
                    return docs[0]
                return docs
        except Exception as e:
            log.error(f"Error fetching collection '{collection_name}': {e}")
    return fallback_data


@app.route("/tasks/ship_schematics_sheet/hull_sizes", methods=["GET"])
@app.route("/tasks/ship_schematics_sheet/sizes", methods=["GET"])
def get_ship_sheet_hull_sizes():
    """
    :OPTIONS: GET
    :PATH: /tasks/ship_schematics_sheet/hull_sizes, /tasks/ship_schematics_sheet/sizes
    :DESC: Returns a JSON list of all official Spaceship Hull Sizes and baseline stats.
    :Content-Type: application/json
    """
    return jsonify(_get_table_docs("spaceship_hull_sizes", HULL_SIZES))


@app.route("/tasks/ship_schematics_sheet/hull_configurations", methods=["GET"])
@app.route("/tasks/ship_schematics_sheet/configurations", methods=["GET"])
def get_ship_sheet_hull_configurations():
    """
    :OPTIONS: GET
    :PATH: /tasks/ship_schematics_sheet/hull_configurations, /tasks/ship_schematics_sheet/configurations
    :DESC: Returns a JSON list of all official Spaceship Hull Configurations.
    :Content-Type: application/json
    """
    return jsonify(_get_table_docs("spaceship_hull_configurations", HULL_CONFIGURATIONS))


@app.route("/tasks/ship_schematics_sheet/quirks", methods=["GET"])
def get_ship_sheet_quirks():
    """
    :OPTIONS: GET
    :PATH: /tasks/ship_schematics_sheet/quirks
    :DESC: Returns a JSON list of all official Spaceship Quirks.
    :Content-Type: application/json
    """
    return jsonify(_get_table_docs("spaceship_quirks", SHIP_QUIRKS))


@app.route("/tasks/ship_schematics_sheet/ftl_drives", methods=["GET"])
def get_ship_sheet_ftl_drives():
    """
    :OPTIONS: GET
    :PATH: /tasks/ship_schematics_sheet/ftl_drives
    :DESC: Returns a JSON list of all official Spaceship FTL Drive Types.
    :Content-Type: application/json
    """
    return jsonify(_get_table_docs("spaceship_ftl_drives", SPACESHIP_FTL_DRIVES))


@app.route("/tasks/ship_schematics_sheet/hard_points_and_bays", methods=["GET"])
def get_ship_sheet_hard_points_and_bays():
    """
    :OPTIONS: GET
    :PATH: /tasks/ship_schematics_sheet/hard_points_and_bays
    :DESC: Returns a JSON list of hard points, bays, and customization slot bonuses per hull size.
    :Content-Type: application/json
    """
    return jsonify(_get_table_docs("spaceship_hard_points_and_bays", SPACECRAFT_HARD_POINTS_AND_BAYS))


@app.route("/tasks/ship_schematics_sheet/weapon_types", methods=["GET"])
def get_ship_sheet_weapon_types():
    """
    :OPTIONS: GET
    :PATH: /tasks/ship_schematics_sheet/weapon_types
    :DESC: Returns a JSON list of official Spaceship Weapon Types.
    :Content-Type: application/json
    """
    return jsonify(_get_table_docs("spaceship_weapon_types", SHIP_WEAPON_TYPES))


@app.route("/tasks/ship_schematics_sheet/bays", methods=["GET"])
def get_ship_sheet_bays():
    """
    :OPTIONS: GET
    :PATH: /tasks/ship_schematics_sheet/bays
    :DESC: Returns a JSON list of official Spaceship Bays and Facilities.
    :Content-Type: application/json
    """
    return jsonify(_get_table_docs("spaceship_bays", SHIP_BAYS))


@app.route("/tasks/ship_schematics_sheet/function_upgrades", methods=["GET"])
def get_ship_sheet_function_upgrades():
    """
    :OPTIONS: GET
    :PATH: /tasks/ship_schematics_sheet/function_upgrades
    :DESC: Returns a JSON list of official Spaceship Function Upgrades.
    :Content-Type: application/json
    """
    return jsonify(_get_table_docs("spaceship_function_upgrades", SHIP_FUNCTION_UPGRADES))


@app.route("/tasks/ship_schematics_sheet/attribute_upgrades", methods=["GET"])
def get_ship_sheet_attribute_upgrades():
    """
    :OPTIONS: GET
    :PATH: /tasks/ship_schematics_sheet/attribute_upgrades
    :DESC: Returns a JSON object of Core System Attribute upgrade costs and rules.
    :Content-Type: application/json
    """
    return jsonify(_get_table_docs("spaceship_attribute_upgrades", SHIP_ATTRIBUTE_UPGRADES))


@app.route("/tasks/ship_schematics_sheet/accessories", methods=["GET"])
def get_ship_sheet_accessories():
    """
    :OPTIONS: GET
    :PATH: /tasks/ship_schematics_sheet/accessories
    :DESC: Returns a JSON list of official Spaceship Accessories.
    :Content-Type: application/json
    """
    return jsonify(_get_table_docs("spaceship_accessories", SHIP_ACCESSORIES))


@app.route("/tasks/ship_schematics_sheet/species", methods=["GET"])
def get_ship_sheet_species():
    """
    :OPTIONS: GET
    :PATH: /tasks/ship_schematics_sheet/species
    :DESC: Returns a JSON list of official Species names for Spaceship species make / theme.
    :Content-Type: application/json
    """
    db_conn = get_reference_db()
    if db_conn is not None:
        try:
            docs = list(db_conn.find(collection="species"))
            if docs:
                return jsonify([d.get("name") or d.get("Name") for d in docs if d.get("name") or d.get("Name")])
        except Exception as e:
            log.error(f"Error fetching species table: {e}")
    return jsonify(SPECIES)


@app.route("/tasks/ship_schematics_sheet/all", methods=["GET"])
def get_ship_sheet_all_data():
    """
    :OPTIONS: GET
    :PATH: /tasks/ship_schematics_sheet/all
    :DESC: Returns a consolidated JSON object containing all spaceship reference data needed for the schematics sheet.
    :Content-Type: application/json
    """
    return jsonify({
        "hull_sizes": _get_table_docs("spaceship_hull_sizes", HULL_SIZES),
        "hull_configurations": _get_table_docs("spaceship_hull_configurations", HULL_CONFIGURATIONS),
        "quirks": _get_table_docs("spaceship_quirks", SHIP_QUIRKS),
        "ftl_drives": _get_table_docs("spaceship_ftl_drives", SPACESHIP_FTL_DRIVES),
        "hard_points_and_bays": _get_table_docs("spaceship_hard_points_and_bays", SPACECRAFT_HARD_POINTS_AND_BAYS),
        "weapon_types": _get_table_docs("spaceship_weapon_types", SHIP_WEAPON_TYPES),
        "bays": _get_table_docs("spaceship_bays", SHIP_BAYS),
        "function_upgrades": _get_table_docs("spaceship_function_upgrades", SHIP_FUNCTION_UPGRADES),
        "attribute_upgrades": _get_table_docs("spaceship_attribute_upgrades", SHIP_ATTRIBUTE_UPGRADES),
        "accessories": _get_table_docs("spaceship_accessories", SHIP_ACCESSORIES),
        "species": SPECIES,
    })
