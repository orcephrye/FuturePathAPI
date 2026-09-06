#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 09/05/2026
# Description: Armor crafting task placeholder and task endpoints for d20 FuturePath

import logging
import random
import uuid
from typing import Any, Dict, List, Optional, Tuple

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
from FuturePathAPI.libs.ReferenceData import get_reference_db
from FuturePathAPI.models.Armor import Armor
from FuturePathAPI.models.CraftingModels import CraftingManager

log = logging.getLogger("Armor")

# Initialize armor reference tables on module load
try:
    init_armor_reference_tables()
except Exception as e:
    log.error(f"Error initializing armor reference tables in Armor task module: {e}")

armor_task_endpoints = {
    "task": f"{END_POINT}/tasks/armor",
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
}


def _get_armor_docs(collection_name, fallback_data):
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
            log.error(f"Error fetching armor table '{collection_name}' in task module: {e}")
    return fallback_data


def _get_http_param(keys: List[str], default: Any = None) -> Any:
    """
    Extracts a parameter from HTTP request parameters (query string in request.args) first,
    falling back to form data or json body.
    """
    # 1. HTTP query parameters have highest priority
    if request.args:
        for k in keys:
            if k in request.args:
                val = request.args.get(k)
                if val is not None and val != "":
                    return val

    # 2. Check form data
    if request.form:
        for k in keys:
            if k in request.form:
                val = request.form.get(k)
                if val is not None and val != "":
                    return val

    # 3. Fallback to JSON body if provided there
    if request.is_json and isinstance(request.json, dict):
        for k in keys:
            if k in request.json:
                val = request.json.get(k)
                if val is not None and val != "":
                    return val

    return default


def _extract_armor_from_request() -> Tuple[Optional[Armor], Optional[str]]:
    """
    Extracts and validates an Armor model from incoming request.
    The POST json object is the Armor.
    Supports:
    - Root JSON dictionary containing Armor fields
    - Nested 'armor' or 'data' dictionary for backward compatibility
    - item_id lookup in CraftingManager from HTTP query parameters
    """
    if request.is_json and isinstance(request.json, dict):
        body = request.json
        # Check if wrapped in "armor" or "data"
        if "armor" in body and isinstance(body["armor"], dict) and "level" in body["armor"]:
            try:
                return Armor.model_validate(body["armor"]), None
            except Exception as e:
                return None, f"Invalid 'armor' dictionary: {e}"
        if "data" in body and isinstance(body["data"], dict) and "level" in body["data"]:
            try:
                return Armor.model_validate(body["data"]), None
            except Exception as e:
                return None, f"Invalid 'data' dictionary: {e}"

        # Direct root dictionary IS the Armor
        try:
            return Armor.model_validate(body), None
        except Exception as e:
            return None, f"Invalid Armor JSON payload: {e}"

    # Fallback: check item_id in HTTP parameters
    item_id = _get_http_param(["item_id", "itemId", "id"])
    if item_id and isinstance(item_id, str):
        try:
            mgr = CraftingManager()
            loaded = mgr.get_item(item_id)
            if isinstance(loaded, Armor):
                return loaded, None
            elif loaded is not None:
                return None, f"Item '{item_id}' found, but is of type {type(loaded).__name__}, not Armor."
        except Exception as e:
            log.warning(f"Error loading item {item_id} from database: {e}")

    return None, "No Armor data found in request. The POST request body must be the Armor JSON object."


def _format_armor_response(
    armor: Armor,
    message: str,
    extra: Optional[Dict[str, Any]] = None,
    save: bool = False,
    status_code: int = 200,
):
    """
    Builds a complete, consistent JSON response for an Armor instance.
    All data is pure JSON serialized via Pydantic model_dump.
    """
    res = armor.model_dump()
    res["armor"] = armor.model_dump()
    res["message"] = message

    if extra:
        res.update(extra)

    if save:
        try:
            mgr = CraftingManager()
            saved = mgr.save_item(armor)
            res["saved_to_db"] = bool(saved)
        except Exception as e:
            log.warning(f"Could not persist armor item {armor.id}: {e}")
            res["saved_to_db"] = False

    return jsonify(res), status_code


def _handle_create_base_armor(level=None, tech_level=None):
    """
    Creates a base Armor model using Armor Level and Tech Level starting values,
    and returns the Armor model in JSON form.
    Parameters can be passed as HTTP parameters or JSON body.
    """
    raw_level = _get_http_param(
        ["armor_level", "Armor Level", "armorLevel", "ArmorLevel", "level", "Level", "al", "AL"],
        default=level,
    )
    raw_tl = _get_http_param(
        ["tech_level", "Tech Level", "techLevel", "TechLevel", "tl", "TL"],
        default=tech_level if tech_level is not None else 2,
    )

    if raw_level is None:
        return jsonify({
            "error": "Missing required starting value 'armor_level' (Armor Level must be between 0 and 9)."
        }), 400

    try:
        al = int(raw_level)
    except (ValueError, TypeError):
        return jsonify({
            "error": f"Invalid Armor Level '{raw_level}'. Must be an integer between 0 and 9."
        }), 400

    if al < 0 or al > 9:
        return jsonify({
            "error": f"Armor Level {al} is out of bounds. Must be between 0 and 9."
        }), 400

    try:
        tl = int(raw_tl)
    except (ValueError, TypeError):
        return jsonify({
            "error": f"Invalid Tech Level '{raw_tl}'. Must be an integer between 0 and 4."
        }), 400

    if tl < 0 or tl > 4:
        return jsonify({
            "error": f"Tech Level {tl} is out of bounds. Must be between 0 and 4."
        }), 400

    item_id = _get_http_param(["item_id", "itemId", "id", "ID"])
    if not item_id:
        item_id = f"armor_al{al}_tl{tl}_{uuid.uuid4().hex[:8]}"

    name = _get_http_param(["name", "Name", "item_name", "itemName"])
    if not name:
        name = f"Base Armor (AL {al}, TL {tl})"

    description = _get_http_param(
        ["description", "Description"],
        default=f"Base level {al} armor at Tech Level {tl}.",
    )

    base_armor = Armor.create_base(
        item_id=str(item_id),
        name=str(name),
        level=al,
        tech_level=tl,
        description=str(description),
    )

    save_param = _get_http_param(["save", "Save", "persist", "Persist"], default=False)
    if isinstance(save_param, str):
        save_param = save_param.lower() in ("true", "1", "yes")

    return _format_armor_response(
        base_armor,
        message=f"Base Armor level {al} (Tech Level {tl}) created successfully.",
        save=bool(save_param),
    )


# -------------------------------------------------------------------------
# 1. Trading DR: Replacing AC bonus for DR Units
# -------------------------------------------------------------------------
@app.route("/tasks/armor/trade_dr", methods=["POST"])
@app.route("/tasks/armor/dr/trade", methods=["POST"])
def armor_trade_dr():
    """
    :OPTIONS: POST
    :PATH: /tasks/armor/trade_dr, /tasks/armor/dr/trade
    :DESC: Trades AC bonus for DR Units (1 AC = 4 DR Units). The POST JSON body is the Armor. Manipulation parameters come via HTTP parameters.
    :Content-Type: application/json
    """
    armor, err = _extract_armor_from_request()
    if err or not armor:
        return jsonify({"error": err or "Armor payload missing."}), 400

    force = _get_http_param(["force", "Force"], default=False)
    if isinstance(force, str):
        force = force.lower() in ("true", "1", "yes")

    trade_ac = _get_http_param(["trade_ac", "ac_to_trade", "trade", "ac_units", "amount"])
    ac_traded_for_dr = _get_http_param(["ac_traded_for_dr", "ac_traded", "total_ac_traded"])

    try:
        trade_ac_val = int(trade_ac) if trade_ac is not None else None
    except (ValueError, TypeError):
        return jsonify({"error": f"Invalid trade_ac value '{trade_ac}'."}), 400

    try:
        ac_traded_val = int(ac_traded_for_dr) if ac_traded_for_dr is not None else None
    except (ValueError, TypeError):
        return jsonify({"error": f"Invalid ac_traded_for_dr value '{ac_traded_for_dr}'."}), 400

    if trade_ac_val is None and ac_traded_val is None:
        return jsonify({"error": "Missing HTTP parameter 'trade_ac' (delta) or 'ac_traded_for_dr' (total)."}), 400

    try:
        msg = armor.trade_ac_for_dr(trade_ac=trade_ac_val, ac_traded_for_dr=ac_traded_val, force=bool(force))
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    save_param = _get_http_param(["save", "Save"], default=False)
    if isinstance(save_param, str):
        save_param = save_param.lower() in ("true", "1", "yes")

    return _format_armor_response(armor, message=msg, save=bool(save_param))


# -------------------------------------------------------------------------
# 2. Spending DR Units
# -------------------------------------------------------------------------
@app.route("/tasks/armor/spend_dr", methods=["POST"])
@app.route("/tasks/armor/dr/spend", methods=["POST"])
def armor_spend_dr():
    """
    :OPTIONS: POST
    :PATH: /tasks/armor/spend_dr, /tasks/armor/dr/spend
    :DESC: Spends available DR Units to acquire damage reduction: 1 unit = 1 DR (Chemical/Electrical/Thermal), 2 units = 1 DR (Kinetic), 4 units = 1 DR (ALL). Total DR stacks up to a maximum of 10. The POST JSON body is the Armor. Manipulation parameters come via HTTP parameters.
    :Content-Type: application/json
    """
    armor, err = _extract_armor_from_request()
    if err or not armor:
        return jsonify({"error": err or "Armor payload missing."}), 400

    mode = str(_get_http_param(["mode", "Mode"], default="add")).lower()

    dr_type = _get_http_param(["dr_type", "type", "damage_type"])
    amount = _get_http_param(["amount", "value", "dr"], default=None)

    if dr_type is not None and amount is not None:
        try:
            amt = int(amount)
        except (ValueError, TypeError):
            return jsonify({"error": f"Invalid amount '{amount}'."}), 400

        try:
            msg = armor.spend_dr_units(dr_type=str(dr_type), amount=amt, mode=mode)
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
    else:
        def get_int(keys):
            val = _get_http_param(keys, default=None)
            if val is not None:
                try:
                    return int(val)
                except (ValueError, TypeError):
                    pass
            return None

        dr_chem = get_int(["dr_chemical", "chemical", "DR_C", "C"])
        dr_elec = get_int(["dr_electrical", "electrical", "DR_E", "E"])
        dr_therm = get_int(["dr_thermal", "thermal", "DR_T", "T"])
        dr_kin = get_int(["dr_kinetic", "kinetic", "DR_K", "K"])
        dr_all = get_int(["dr_all", "all", "DR_ALL", "ALL"])

        if all(v is None for v in (dr_chem, dr_elec, dr_therm, dr_kin, dr_all)):
            return jsonify({
                "error": "No DR values provided in HTTP parameters. Specify 'dr_type' and 'amount', or individual DR fields (e.g. 'dr_chemical', 'dr_kinetic', 'dr_all')."
            }), 400

        try:
            msg = armor.spend_dr_units(
                dr_chemical=dr_chem,
                dr_electrical=dr_elec,
                dr_thermal=dr_therm,
                dr_kinetic=dr_kin,
                dr_all=dr_all,
                mode=mode,
            )
        except ValueError as e:
            return jsonify({"error": str(e)}), 400

    save_param = _get_http_param(["save", "Save"], default=False)
    if isinstance(save_param, str):
        save_param = save_param.lower() in ("true", "1", "yes")

    return _format_armor_response(armor, message=msg, save=bool(save_param))


# -------------------------------------------------------------------------
# 3. Masterworking: Adding or Removing Levels
# -------------------------------------------------------------------------
@app.route("/tasks/armor/masterwork", methods=["POST"])
@app.route("/tasks/armor/masterworking", methods=["POST"])
def armor_masterwork():
    """
    :OPTIONS: POST
    :PATH: /tasks/armor/masterwork, /tasks/armor/masterworking
    :DESC: Adds or removes Masterworking levels (0 to 5). Each level provides either +1 Customization Slot or +1 Free Customization Point. Increases Craft DC by +2 per level and requires Structural Skill Rank 6+. The POST JSON body is the Armor. Manipulation parameters come via HTTP parameters.
    :Content-Type: application/json
    """
    armor, err = _extract_armor_from_request()
    if err or not armor:
        return jsonify({"error": err or "Armor payload missing."}), 400

    action = str(_get_http_param(["action", "Action", "op"], default="add")).strip().lower()
    choice = str(_get_http_param(["choice", "Choice", "type"], default="point")).strip().lower()

    levels_param = _get_http_param(["levels", "level", "count", "amount"], default=1)
    try:
        levels = int(levels_param)
    except (ValueError, TypeError):
        return jsonify({"error": f"Invalid levels parameter '{levels_param}'."}), 400

    current_mw = armor.customization.masterwork_level

    if action == "set":
        target_mw = levels
        if target_mw > current_mw:
            action = "add"
            levels = target_mw - current_mw
        elif target_mw < current_mw:
            action = "remove"
            levels = current_mw - target_mw
        else:
            return _format_armor_response(armor, message=f"Armor is already Masterwork Level {current_mw}.")

    try:
        if action in ("add", "increase", "+"):
            msg = armor.add_masterwork(choice=choice, levels=levels)
        elif action in ("remove", "decrease", "delete", "-"):
            msg = armor.remove_masterwork(levels=levels)
        else:
            return jsonify({"error": f"Unknown action '{action}'. Must be 'add', 'remove', or 'set'."}), 400
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    save_param = _get_http_param(["save", "Save"], default=False)
    if isinstance(save_param, str):
        save_param = save_param.lower() in ("true", "1", "yes")

    return _format_armor_response(armor, message=msg, save=bool(save_param))


# -------------------------------------------------------------------------
# 4. Diminish an Attribute (Yields Negative Points)
# -------------------------------------------------------------------------
@app.route("/tasks/armor/diminish", methods=["POST"])
@app.route("/tasks/armor/customization/diminish", methods=["POST"])
def armor_diminish():
    """
    :OPTIONS: POST
    :PATH: /tasks/armor/diminish, /tasks/armor/customization/diminish
    :DESC: Diminishes an Armor attribute to yield Negative Points (2 Negative Points = 1 Customization Point). Cannot diminish an attribute that has already been improved. The POST JSON body is the Armor. Manipulation parameters come via HTTP parameters.
    :Content-Type: application/json
    """
    armor, err = _extract_armor_from_request()
    if err or not armor:
        return jsonify({"error": err or "Armor payload missing."}), 400

    attribute = _get_http_param(["attribute", "Attribute", "attr", "name"])
    if not attribute:
        return jsonify({"error": "Missing HTTP parameter 'attribute' to diminish."}), 400

    dr_type = _get_http_param(["dr_type", "type"])
    custom_pts = _get_http_param(["points", "points_yielded", "neg_points"], default=1)
    try:
        points = int(custom_pts)
    except (ValueError, TypeError):
        points = 1
    description = str(_get_http_param(["description", "desc"], default=""))

    try:
        neg_yield, diminish_desc = armor.diminish_attribute(
            attribute=str(attribute),
            dr_type=str(dr_type) if dr_type else None,
            points=points,
            description=description,
        )
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    msg = f"Diminished '{attribute}': {diminish_desc} Yielded {neg_yield} Negative Point(s). Total negative points earned: {armor.customization.negative_points_earned}."

    save_param = _get_http_param(["save", "Save"], default=False)
    if isinstance(save_param, str):
        save_param = save_param.lower() in ("true", "1", "yes")

    return _format_armor_response(armor, message=msg, save=bool(save_param))


# -------------------------------------------------------------------------
# 5. Improve an Attribute (Costs Customization Points)
# -------------------------------------------------------------------------
@app.route("/tasks/armor/improve", methods=["POST"])
@app.route("/tasks/armor/customization/improve", methods=["POST"])
def armor_improve():
    """
    :OPTIONS: POST
    :PATH: /tasks/armor/improve, /tasks/armor/customization/improve
    :DESC: Improves an Armor attribute using Customization Points (CP). By default, an improvement costs 1 CP and 1 slot. Cannot improve an attribute that has been diminished. The POST JSON body is the Armor. Manipulation parameters come via HTTP parameters.
    :Content-Type: application/json
    """
    armor, err = _extract_armor_from_request()
    if err or not armor:
        return jsonify({"error": err or "Armor payload missing."}), 400

    attribute = _get_http_param(["attribute", "Attribute", "attr", "name"])
    if not attribute:
        return jsonify({"error": "Missing HTTP parameter 'attribute' to improve."}), 400

    technique = _get_http_param(["technique", "tech", "combat_technique"])
    mount_size = _get_http_param(["mount_size", "size"])
    dr_type = _get_http_param(["dr_type", "type"])
    cost = _get_http_param(["cp_cost", "cost", "points"])
    slots = _get_http_param(["slots", "slots_cost"])
    description = _get_http_param(["description", "desc"], default="")

    try:
        cost_val = int(cost) if cost is not None else None
    except (ValueError, TypeError):
        cost_val = None

    try:
        slots_val = int(slots) if slots is not None else None
    except (ValueError, TypeError):
        slots_val = None

    try:
        cp_cost, slot_cost, improve_desc = armor.improve_attribute(
            attribute=str(attribute),
            technique=str(technique) if technique else None,
            mount_size=str(mount_size) if mount_size else None,
            dr_type=str(dr_type) if dr_type else None,
            cost=cost_val,
            slots=slots_val,
            description=str(description),
        )
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    msg = f"Improved '{attribute}': {improve_desc} Spent {cp_cost} CP, used {slot_cost} slot(s). Remaining: {armor.customization.remaining_points} CP, {armor.customization.remaining_slots} slots."

    save_param = _get_http_param(["save", "Save"], default=False)
    if isinstance(save_param, str):
        save_param = save_param.lower() in ("true", "1", "yes")

    return _format_armor_response(armor, message=msg, save=bool(save_param))


# -------------------------------------------------------------------------
# 6. Crafting Rolling Rules: Player Roll Evaluation & Material Accounting
# -------------------------------------------------------------------------
@app.route("/tasks/armor/craft_roll", methods=["POST"])
@app.route("/tasks/armor/roll", methods=["POST"])
def armor_craft_roll():
    """
    :OPTIONS: POST
    :PATH: /tasks/armor/craft_roll, /tasks/armor/roll
    :DESC: Evaluates a crafting roll for an Armor item against Craft DC (12 + TL + AL + 2*MW). Determines success or failure, supply materials lost or saved, and time required. The POST JSON body is the Armor. Manipulation parameters come via HTTP parameters.
    :Content-Type: application/json
    """
    armor, err = _extract_armor_from_request()
    if err or not armor:
        return jsonify({"error": err or "Armor payload missing."}), 400

    is_recraft = _get_http_param(["is_recraft", "recraft", "re_craft"], default=False)
    if isinstance(is_recraft, str):
        is_recraft = is_recraft.lower() in ("true", "1", "yes")

    up_tech = _get_http_param(["up_tech", "uptech"], default=False)
    if isinstance(up_tech, str):
        up_tech = up_tech.lower() in ("true", "1", "yes")

    masterworking_flag = _get_http_param(["masterworking", "mw"], default=False)
    if isinstance(masterworking_flag, str):
        masterworking_flag = masterworking_flag.lower() in ("true", "1", "yes")

    raw_roll = _get_http_param(["roll", "Roll", "check", "check_result", "result"])
    natural_1 = _get_http_param(["natural_1", "crit_fail", "critical_failure"], default=False)
    if isinstance(natural_1, str):
        natural_1 = natural_1.lower() in ("true", "1", "yes")

    if raw_roll is None:
        mod = _get_http_param(["modifier", "bonus", "skill_mod"])
        if mod is not None:
            try:
                die = random.randint(1, 20)
                actual_roll = die + int(mod)
                if die == 1:
                    natural_1 = True
            except (ValueError, TypeError):
                return jsonify({"error": f"Invalid skill modifier '{mod}'."}), 400
        else:
            return jsonify({"error": "Missing HTTP parameter 'roll' representing the player's Structural check result."}), 400
    else:
        try:
            actual_roll = int(raw_roll)
        except (ValueError, TypeError):
            return jsonify({"error": f"Invalid roll value '{raw_roll}'."}), 400

    try:
        eval_result = armor.evaluate_craft_roll(
            roll=actual_roll,
            natural_1=bool(natural_1),
            is_recraft=bool(is_recraft),
            up_tech=bool(up_tech),
            masterworking=bool(masterworking_flag),
        )
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    eval_result["armor"] = armor.model_dump()
    return jsonify(eval_result), 200


@app.route("/tasks/armor", methods=["GET", "POST"])
def armor_task_index():
    """
    :OPTIONS: GET, POST
    :PATH: /tasks/armor
    :DESC: Task endpoint for Armor crafting and reference system. POST or GET with armor_level creates a base armor.
    :Content-Type: application/json
    """
    if request.method == "POST":
        return _handle_create_base_armor()
    if request.args.get("armor_level") or request.args.get("level") or request.args.get("al"):
        return _handle_create_base_armor()

    return jsonify({
        "task": "armor",
        "status": "ready",
        "description": "Armor crafting and customization task endpoint for d20 FuturePath.",
        "endpoints": armor_task_endpoints,
    })


@app.route("/tasks/armor/create", methods=["GET", "POST"])
@app.route("/tasks/armor/craft", methods=["GET", "POST"])
@app.route("/tasks/armor/new", methods=["GET", "POST"])
def create_base_armor_endpoint():
    """
    :OPTIONS: GET, POST
    :PATH: /tasks/armor/create, /tasks/armor/craft, /tasks/armor/new
    :DESC: Creates a base Armor model with starting values (Armor Level and Tech Level). Returns the Armor model in JSON form.
    :Content-Type: application/json
    """
    return _handle_create_base_armor()


@app.route("/tasks/armor/create/<int:level>", methods=["GET"])
@app.route("/tasks/armor/create/<int:level>/<int:tech_level>", methods=["GET"])
@app.route("/tasks/armor/craft/<int:level>", methods=["GET"])
@app.route("/tasks/armor/craft/<int:level>/<int:tech_level>", methods=["GET"])
def create_base_armor_path_endpoint(level, tech_level=None):
    """
    :OPTIONS: GET
    :PATH: /tasks/armor/create/<level>, /tasks/armor/create/<level>/<tech_level>, /tasks/armor/craft/<level>, /tasks/armor/craft/<level>/<tech_level>
    :DESC: Creates a base Armor model with starting values in URL path. Returns the Armor model in JSON form.
    :Content-Type: application/json
    """
    return _handle_create_base_armor(level=level, tech_level=tech_level)



@app.route("/tasks/armor/item/<item_id>", methods=["GET"])
def get_armor_item_by_id(item_id):
    """
    :OPTIONS: GET
    :PATH: /tasks/armor/item/<item_id>
    :DESC: Retrieves a previously saved Armor model by its ID.
    :Content-Type: application/json
    """
    try:
        manager = CraftingManager()
        item = manager.get_item(item_id)
        if not item:
            return jsonify({"error": f"Armor item with ID '{item_id}' not found."}), 404
        return _format_armor_response(item, message=f"Armor '{item_id}' retrieved successfully.")
    except Exception as e:
        log.error(f"Error fetching item {item_id}: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/tasks/armor/baseline", methods=["GET"])
def get_armor_task_baseline():
    """
    :OPTIONS: GET
    :PATH: /tasks/armor/baseline
    :DESC: Returns baseline armor stats by Armor Level (AL 0-9) at Tech Level 2.
    :Content-Type: application/json
    """
    return jsonify(_get_armor_docs("armor_baseline", ARMOR_BASELINE_LIST))


@app.route("/tasks/armor/tech_levels", methods=["GET"])
def get_armor_task_tech_levels():
    """
    :OPTIONS: GET
    :PATH: /tasks/armor/tech_levels
    :DESC: Returns Tech Level rules (TL 0-4) for Armor.
    :Content-Type: application/json
    """
    return jsonify(_get_armor_docs("armor_tech_levels", TECH_LEVEL_LIST))


@app.route("/tasks/armor/special_attributes", methods=["GET"])
def get_armor_task_special_attributes():
    """
    :OPTIONS: GET
    :PATH: /tasks/armor/special_attributes
    :DESC: Returns special attributes that can be applied to Armor.
    :Content-Type: application/json
    """
    return jsonify(_get_armor_docs("armor_special_attributes", ARMOR_SPECIAL_ATTRIBUTES))


@app.route("/tasks/armor/customization_attributes", methods=["GET"])
def get_armor_task_customization_attributes():
    """
    :OPTIONS: GET
    :PATH: /tasks/armor/customization_attributes
    :DESC: Returns details about customization attributes for Armor.
    :Content-Type: application/json
    """
    return jsonify(_get_armor_docs("armor_customization_attributes", ARMOR_CUSTOMIZATION_ATTRIBUTES))


@app.route("/tasks/armor/crafting_rules", methods=["GET"])
def get_armor_task_crafting_rules():
    """
    :OPTIONS: GET
    :PATH: /tasks/armor/crafting_rules
    :DESC: Returns crafting, masterworking, and re-crafting rules for Armor.
    :Content-Type: application/json
    """
    return jsonify(_get_armor_docs("armor_crafting_rules", ARMOR_CRAFTING_RULES))


@app.route("/tasks/armor/examples", methods=["GET"])
def get_armor_task_examples():
    """
    :OPTIONS: GET
    :PATH: /tasks/armor/examples
    :DESC: Returns official example armors from the rules.
    :Content-Type: application/json
    """
    return jsonify(_get_armor_docs("armor_examples", ARMOR_EXAMPLES))


@app.route("/tasks/armor/all", methods=["GET"])
def get_all_armor_task_reference_data():
    """
    :OPTIONS: GET
    :PATH: /tasks/armor/all
    :DESC: Returns all armor reference data via the Armor task endpoint.
    :Content-Type: application/json
    """
    return jsonify({
        "baseline": _get_armor_docs("armor_baseline", ARMOR_BASELINE_LIST),
        "tech_levels": _get_armor_docs("armor_tech_levels", TECH_LEVEL_LIST),
        "special_attributes": _get_armor_docs("armor_special_attributes", ARMOR_SPECIAL_ATTRIBUTES),
        "customization_attributes": _get_armor_docs("armor_customization_attributes", ARMOR_CUSTOMIZATION_ATTRIBUTES),
        "crafting_rules": _get_armor_docs("armor_crafting_rules", ARMOR_CRAFTING_RULES),
        "examples": _get_armor_docs("armor_examples", ARMOR_EXAMPLES),
    })
