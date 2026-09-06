#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 08/09/2026
# Description: Raw reference data endpoints for d20 FuturePath API

import logging

from flask import jsonify, request

from FuturePathAPI.initApp import END_POINT, app
from FuturePathAPI.libs.ArmorReferenceData import (
    ARMOR_BASELINE_LIST,
    ARMOR_CRAFTING_RULES,
    ARMOR_CUSTOMIZATION_ATTRIBUTES,
    ARMOR_EXAMPLES,
    ARMOR_SPECIAL_ATTRIBUTES,
    TECH_LEVEL_LIST,
    init_armor_reference_tables,
)
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

log = logging.getLogger("data")

# Initialize reference tables on module load
try:
    init_reference_tables()
    init_spaceship_reference_tables()
    init_armor_reference_tables()
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
    "spaceship": f"{END_POINT}/data/spaceship",
    "all_spaceship_reference_data": f"{END_POINT}/data/all_spaceship_reference_data",
    "armor": f"{END_POINT}/data/armor",
    "all_armor_reference_data": f"{END_POINT}/data/all_armor_reference_data",
}

armor_data_endpoints = {
    "baseline": f"{END_POINT}/data/armor/baseline",
    "tech_levels": f"{END_POINT}/data/armor/tech_levels",
    "special_attributes": f"{END_POINT}/data/armor/special_attributes",
    "customization_attributes": f"{END_POINT}/data/armor/customization_attributes",
    "crafting_rules": f"{END_POINT}/data/armor/crafting_rules",
    "examples": f"{END_POINT}/data/armor/examples",
    "all": f"{END_POINT}/data/all_armor_reference_data",
}

spaceship_data_endpoints = {
    "hull_sizes": f"{END_POINT}/data/spaceship/hull_sizes",
    "hull_configurations": f"{END_POINT}/data/spaceship/hull_configurations",
    "quirks": f"{END_POINT}/data/spaceship/quirks",
    "ftl_drives": f"{END_POINT}/data/spaceship/ftl_drives",
    "hard_points_and_bays": f"{END_POINT}/data/spaceship/hard_points_and_bays",
    "weapon_types": f"{END_POINT}/data/spaceship/weapon_types",
    "bays": f"{END_POINT}/data/spaceship/bays",
    "function_upgrades": f"{END_POINT}/data/spaceship/function_upgrades",
    "attribute_upgrades": f"{END_POINT}/data/spaceship/attribute_upgrades",
    "accessories": f"{END_POINT}/data/spaceship/accessories",
    "all": f"{END_POINT}/data/all_spaceship_reference_data",
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
                    elif "Name" in doc:
                        items.append(doc["Name"])
                    elif "name" in doc:
                        items.append(doc["name"])
                    elif "die" in doc:
                        items.append(doc["die"])
                return items
        except Exception as e:
            log.error(f"Error fetching table '{table_name}': {e}")
    if fallback_list is not None:
        if fallback_list and isinstance(fallback_list[0], dict):
            return [
                doc.get(key_field) or doc.get("Name") or doc.get("name")
                for doc in fallback_list
                if (doc.get(key_field) or doc.get("Name") or doc.get("name"))
            ]
        return fallback_list
    return []


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


def _get_character_paths_data():
    db_conn = get_reference_db()
    if db_conn is not None:
        try:
            docs = list(db_conn.find(collection="character_paths"))
            if docs:
                for doc in docs:
                    if isinstance(doc, dict):
                        doc.pop("_id", None)
                return docs
        except Exception as e:
            log.error(f"Error fetching character paths: {e}")
    return CHARACTER_PATHS


def _get_professions_data():
    db_conn = get_reference_db()
    if db_conn is not None:
        try:
            docs = list(db_conn.find(collection="professions"))
            if docs:
                for doc in docs:
                    if isinstance(doc, dict):
                        doc.pop("_id", None)
                return docs
        except Exception as e:
            log.error(f"Error fetching professions: {e}")
    return PROFESSIONS


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
    return jsonify(_get_character_paths_data())


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
    return jsonify(_get_professions_data())


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

def _get_armor_data(table_name, fallback_data):
    db_conn = get_reference_db()
    if db_conn is not None:
        try:
            docs = list(db_conn.find(collection=table_name))
            if docs:
                for doc in docs:
                    if isinstance(doc, dict):
                        doc.pop("_id", None)
                if isinstance(fallback_data, dict) and len(docs) == 1:
                    return docs[0]
                return docs
        except Exception as e:
            log.error(f"Error fetching armor table '{table_name}': {e}")
    return fallback_data


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
        "character_professions": _get_professions_data(),
        "species": _get_table_data("species", key_field="name", fallback_list=SPECIES),
        "paths": _get_table_data("character_paths", key_field="name", fallback_list=CHARACTER_PATHS),
        "character_paths": _get_character_paths_data(),
        "quirks": _get_quirks_data(),
        "detractors": _get_detractors_data(),
        "mutation_drawbacks": _get_mutation_drawbacks_data(),
        "mutation_enhancements": _shorten_mutation_enhancements(_get_mutation_enhancements_data()),
        "armor_baseline": _get_armor_data("armor_baseline", ARMOR_BASELINE_LIST),
        "armor_tech_levels": _get_armor_data("armor_tech_levels", TECH_LEVEL_LIST),
        "armor_special_attributes": _get_armor_data("armor_special_attributes", ARMOR_SPECIAL_ATTRIBUTES),
        "armor_customization_attributes": _get_armor_data("armor_customization_attributes", ARMOR_CUSTOMIZATION_ATTRIBUTES),
        "armor_crafting_rules": _get_armor_data("armor_crafting_rules", ARMOR_CRAFTING_RULES),
        "armor_examples": _get_armor_data("armor_examples", ARMOR_EXAMPLES),
    })


def _get_spaceship_data(table_name, fallback_data):
    db_conn = get_reference_db()
    if db_conn is not None:
        try:
            docs = list(db_conn.find(collection=table_name))
            if docs:
                for doc in docs:
                    if isinstance(doc, dict):
                        doc.pop("_id", None)
                if isinstance(fallback_data, dict) and len(docs) == 1:
                    return docs[0]
                return docs
        except Exception as e:
            log.error(f"Error fetching spaceship table '{table_name}': {e}")
    return fallback_data


@app.route("/data/spaceship", methods=["GET"])
def get_spaceship_data_index():
    """
    :OPTIONS: GET
    :PATH: /data/spaceship
    :DESC: Returns a JSON blob showing all available raw spaceship reference data endpoints.
    :Content-Type: application/json
    """
    return jsonify({"spaceship_data": spaceship_data_endpoints})


@app.route("/data/spaceship/hull_sizes", methods=["GET"])
@app.route("/data/spaceship/sizes", methods=["GET"])
def get_data_spaceship_hull_sizes():
    """
    :OPTIONS: GET
    :PATH: /data/spaceship/hull_sizes, /data/spaceship/sizes
    :DESC: Returns a JSON list of all official Spaceship Hull Sizes and their base stats.
    :Content-Type: application/json
    """
    return jsonify(_get_spaceship_data("spaceship_hull_sizes", HULL_SIZES))


@app.route("/data/spaceship/hull_configurations", methods=["GET"])
@app.route("/data/spaceship/configurations", methods=["GET"])
def get_data_spaceship_hull_configurations():
    """
    :OPTIONS: GET
    :PATH: /data/spaceship/hull_configurations, /data/spaceship/configurations
    :DESC: Returns a JSON list of all official Spaceship Hull Configurations.
    :Content-Type: application/json
    """
    return jsonify(_get_spaceship_data("spaceship_hull_configurations", HULL_CONFIGURATIONS))


@app.route("/data/spaceship/quirks", methods=["GET"])
@app.route("/data/spaceship/ship_quirks", methods=["GET"])
def get_data_spaceship_quirks():
    """
    :OPTIONS: GET
    :PATH: /data/spaceship/quirks, /data/spaceship/ship_quirks
    :DESC: Returns a JSON list of all official Spaceship Quirks.
    :Content-Type: application/json
    """
    return jsonify(_get_spaceship_data("spaceship_quirks", SHIP_QUIRKS))


@app.route("/data/spaceship/ftl_drives", methods=["GET"])
@app.route("/data/spaceship/ftl_drive_types", methods=["GET"])
def get_data_spaceship_ftl_drives():
    """
    :OPTIONS: GET
    :PATH: /data/spaceship/ftl_drives, /data/spaceship/ftl_drive_types
    :DESC: Returns a JSON list of all official Spaceship FTL Drive Types.
    :Content-Type: application/json
    """
    return jsonify(_get_spaceship_data("spaceship_ftl_drives", SPACESHIP_FTL_DRIVES))


@app.route("/data/spaceship/hard_points_and_bays", methods=["GET"])
@app.route("/data/spaceship/hardpoints_and_bays", methods=["GET"])
def get_data_spaceship_hard_points_and_bays():
    """
    :OPTIONS: GET
    :PATH: /data/spaceship/hard_points_and_bays, /data/spaceship/hardpoints_and_bays
    :DESC: Returns a JSON list of hard points, bays, and customization slot bonuses per hull size.
    :Content-Type: application/json
    """
    return jsonify(_get_spaceship_data("spaceship_hard_points_and_bays", SPACECRAFT_HARD_POINTS_AND_BAYS))


@app.route("/data/spaceship/weapon_types", methods=["GET"])
@app.route("/data/spaceship/weapons", methods=["GET"])
def get_data_spaceship_weapon_types():
    """
    :OPTIONS: GET
    :PATH: /data/spaceship/weapon_types, /data/spaceship/weapons
    :DESC: Returns a JSON list of official Spaceship Weapon Types, costs, ammo, and bonuses.
    :Content-Type: application/json
    """
    return jsonify(_get_spaceship_data("spaceship_weapon_types", SHIP_WEAPON_TYPES))


@app.route("/data/spaceship/bays", methods=["GET"])
@app.route("/data/spaceship/ship_bays", methods=["GET"])
def get_data_spaceship_bays():
    """
    :OPTIONS: GET
    :PATH: /data/spaceship/bays, /data/spaceship/ship_bays
    :DESC: Returns a JSON list of official Spaceship Bays and Facilities.
    :Content-Type: application/json
    """
    return jsonify(_get_spaceship_data("spaceship_bays", SHIP_BAYS))


@app.route("/data/spaceship/function_upgrades", methods=["GET"])
def get_data_spaceship_function_upgrades():
    """
    :OPTIONS: GET
    :PATH: /data/spaceship/function_upgrades
    :DESC: Returns a JSON list of official Spaceship Function Upgrades.
    :Content-Type: application/json
    """
    return jsonify(_get_spaceship_data("spaceship_function_upgrades", SHIP_FUNCTION_UPGRADES))


@app.route("/data/spaceship/attribute_upgrades", methods=["GET"])
def get_data_spaceship_attribute_upgrades():
    """
    :OPTIONS: GET
    :PATH: /data/spaceship/attribute_upgrades
    :DESC: Returns a JSON object with Core System Attribute upgrade costs and rules.
    :Content-Type: application/json
    """
    return jsonify(_get_spaceship_data("spaceship_attribute_upgrades", SHIP_ATTRIBUTE_UPGRADES))


@app.route("/data/spaceship/accessories", methods=["GET"])
def get_data_spaceship_accessories():
    """
    :OPTIONS: GET
    :PATH: /data/spaceship/accessories
    :DESC: Returns a JSON list of official Spaceship Accessories.
    :Content-Type: application/json
    """
    return jsonify(_get_spaceship_data("spaceship_accessories", SHIP_ACCESSORIES))


@app.route("/data/spaceship/all", methods=["GET"])
@app.route("/data/all_spaceship_reference_data", methods=["GET"])
@app.route("/data/all_spaceship_refernce_data", methods=["GET"])
def get_all_spaceship_reference_data():
    """
    :OPTIONS: GET
    :PATH: /data/spaceship/all, /data/all_spaceship_reference_data, /data/all_spaceship_refernce_data
    :DESC: Returns a JSON object of all spaceship reference data endpoints.
    :Content-Type: application/json
    """
    return jsonify({
        "hull_sizes": _get_spaceship_data("spaceship_hull_sizes", HULL_SIZES),
        "hull_configurations": _get_spaceship_data("spaceship_hull_configurations", HULL_CONFIGURATIONS),
        "ship_quirks": _get_spaceship_data("spaceship_quirks", SHIP_QUIRKS),
        "quirks": _get_spaceship_data("spaceship_quirks", SHIP_QUIRKS),
        "ftl_drives": _get_spaceship_data("spaceship_ftl_drives", SPACESHIP_FTL_DRIVES),
        "hard_points_and_bays": _get_spaceship_data("spaceship_hard_points_and_bays", SPACECRAFT_HARD_POINTS_AND_BAYS),
        "weapon_types": _get_spaceship_data("spaceship_weapon_types", SHIP_WEAPON_TYPES),
        "bays": _get_spaceship_data("spaceship_bays", SHIP_BAYS),
        "function_upgrades": _get_spaceship_data("spaceship_function_upgrades", SHIP_FUNCTION_UPGRADES),
        "attribute_upgrades": _get_spaceship_data("spaceship_attribute_upgrades", SHIP_ATTRIBUTE_UPGRADES),
        "accessories": _get_spaceship_data("spaceship_accessories", SHIP_ACCESSORIES),
    })


@app.route("/data/armor", methods=["GET"])
def get_armor_data_index():
    """
    :OPTIONS: GET
    :PATH: /data/armor
    :DESC: Returns a JSON blob showing all available raw armor reference data endpoints.
    :Content-Type: application/json
    """
    return jsonify({"armor_data": armor_data_endpoints})


@app.route("/data/armor/baseline", methods=["GET"])
@app.route("/data/armor/baseline_table", methods=["GET"])
def get_data_armor_baseline():
    """
    :OPTIONS: GET
    :PATH: /data/armor/baseline, /data/armor/baseline_table
    :DESC: Returns baseline armor stats by Armor Level (AL 0-9) at Tech Level 2.
    :Content-Type: application/json
    """
    return jsonify(_get_armor_data("armor_baseline", ARMOR_BASELINE_LIST))


@app.route("/data/armor/tech_levels", methods=["GET"])
@app.route("/data/armor/techlevels", methods=["GET"])
def get_data_armor_tech_levels():
    """
    :OPTIONS: GET
    :PATH: /data/armor/tech_levels, /data/armor/techlevels
    :DESC: Returns Tech Level rules (TL 0-4) for Armor.
    :Content-Type: application/json
    """
    return jsonify(_get_armor_data("armor_tech_levels", TECH_LEVEL_LIST))


@app.route("/data/armor/special_attributes", methods=["GET"])
@app.route("/data/armor/specials", methods=["GET"])
def get_data_armor_special_attributes():
    """
    :OPTIONS: GET
    :PATH: /data/armor/special_attributes, /data/armor/specials
    :DESC: Returns special attributes that can be applied to Armor.
    :Content-Type: application/json
    """
    return jsonify(_get_armor_data("armor_special_attributes", ARMOR_SPECIAL_ATTRIBUTES))


@app.route("/data/armor/customization_attributes", methods=["GET"])
@app.route("/data/armor/attributes", methods=["GET"])
def get_data_armor_customization_attributes():
    """
    :OPTIONS: GET
    :PATH: /data/armor/customization_attributes, /data/armor/attributes
    :DESC: Returns details about customization attributes for Armor.
    :Content-Type: application/json
    """
    return jsonify(_get_armor_data("armor_customization_attributes", ARMOR_CUSTOMIZATION_ATTRIBUTES))


@app.route("/data/armor/crafting_rules", methods=["GET"])
@app.route("/data/armor/crafting", methods=["GET"])
def get_data_armor_crafting_rules():
    """
    :OPTIONS: GET
    :PATH: /data/armor/crafting_rules, /data/armor/crafting
    :DESC: Returns crafting, masterworking, and re-crafting rules for Armor.
    :Content-Type: application/json
    """
    return jsonify(_get_armor_data("armor_crafting_rules", ARMOR_CRAFTING_RULES))


@app.route("/data/armor/examples", methods=["GET"])
def get_data_armor_examples():
    """
    :OPTIONS: GET
    :PATH: /data/armor/examples
    :DESC: Returns official example armors from the rules.
    :Content-Type: application/json
    """
    return jsonify(_get_armor_data("armor_examples", ARMOR_EXAMPLES))


@app.route("/data/armor/all", methods=["GET"])
@app.route("/data/all_armor_reference_data", methods=["GET"])
def get_all_armor_reference_data():
    """
    :OPTIONS: GET
    :PATH: /data/armor/all, /data/all_armor_reference_data
    :DESC: Returns a JSON object of all armor reference data endpoints.
    :Content-Type: application/json
    """
    return jsonify({
        "baseline": _get_armor_data("armor_baseline", ARMOR_BASELINE_LIST),
        "tech_levels": _get_armor_data("armor_tech_levels", TECH_LEVEL_LIST),
        "special_attributes": _get_armor_data("armor_special_attributes", ARMOR_SPECIAL_ATTRIBUTES),
        "customization_attributes": _get_armor_data("armor_customization_attributes", ARMOR_CUSTOMIZATION_ATTRIBUTES),
        "crafting_rules": _get_armor_data("armor_crafting_rules", ARMOR_CRAFTING_RULES),
        "examples": _get_armor_data("armor_examples", ARMOR_EXAMPLES),
    })


