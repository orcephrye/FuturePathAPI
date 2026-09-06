#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 09/05/2026
# Description: Armor crafting task placeholder and task endpoints for d20 FuturePath

import base64
import logging
import pickle
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
from FuturePathAPI.models.CraftingModels import CraftingDbEntry, CraftingManager

log = logging.getLogger("Armor")

# Speed diff tiers in ascending order of speed penalty
SPEED_TIERS = ["Normal", "-5ft", "-10ft", "Halved"]

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


def _extract_param(sources: List[Dict[str, Any]], keys: List[str], default=None):
    for src in sources:
        if not src or not isinstance(src, dict):
            continue
        for k in keys:
            if k in src:
                val = src[k]
                if val is not None and val != "":
                    return val
    return default


def _get_request_sources() -> List[Dict[str, Any]]:
    sources: List[Dict[str, Any]] = []
    if request.is_json and isinstance(request.json, dict):
        sources.append(request.json)
    if request.args:
        sources.append(request.args.to_dict())
    if request.form:
        sources.append(request.form.to_dict())
    return sources


def _extract_armor_from_request(sources: List[Dict[str, Any]]) -> Tuple[Optional[Armor], Optional[str]]:
    """
    Extracts or deserializes an Armor model from incoming request sources.
    Supports:
    - pickled_data / pickled_armor base64 string
    - 'armor' dictionary
    - 'data' dictionary
    - Root dictionary containing Armor fields
    - item_id lookup in CraftingManager
    """
    # 1. Check for pickled data
    pickled_str = _extract_param(sources, ["pickled_armor", "pickled_data", "pickle", "pickled"])
    if pickled_str and isinstance(pickled_str, str):
        try:
            raw_bytes = base64.b64decode(pickled_str.encode("utf-8"))
            deserialized = pickle.loads(raw_bytes)
            if isinstance(deserialized, Armor):
                return deserialized, None
            if isinstance(deserialized, CraftingDbEntry):
                entry_deserialized = CraftingManager.deserialize(deserialized)
                if isinstance(entry_deserialized, Armor):
                    return entry_deserialized, None
        except Exception as e:
            log.warning(f"Failed to deserialize pickled armor: {e}")

    # 2. Check for nested 'armor' dictionary
    armor_dict = _extract_param(sources, ["armor", "Armor"])
    if isinstance(armor_dict, dict):
        try:
            return Armor.model_validate(armor_dict), None
        except Exception as e:
            return None, f"Invalid 'armor' dictionary: {e}"

    # 3. Check for nested 'data' dictionary (CraftingDbEntry schema)
    data_dict = _extract_param(sources, ["data", "Data"])
    if isinstance(data_dict, dict):
        try:
            return Armor.model_validate(data_dict), None
        except Exception as e:
            return None, f"Invalid 'data' dictionary: {e}"

    # 4. Check if root dictionary contains armor fields
    for src in sources:
        if isinstance(src, dict) and "level" in src and ("ac_bonus" in src or "id" in src or "item_type" in src):
            try:
                return Armor.model_validate(src), None
            except Exception as e:
                return None, f"Invalid root armor payload: {e}"

    # 5. Check for item_id in local storage
    item_id = _extract_param(sources, ["item_id", "itemId", "id"])
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

    return None, "No Armor data found in request. Please provide 'armor', 'data', 'pickled_armor', or 'item_id'."


def _format_armor_response(
    armor: Armor,
    message: str,
    extra: Optional[Dict[str, Any]] = None,
    save: bool = False,
    status_code: int = 200,
):
    """
    Builds a complete, consistent JSON response for an Armor instance including pickled data.
    """
    db_entry = armor.to_db_entry()
    res = db_entry.model_dump()
    res["armor"] = armor.model_dump()
    res["pickled_armor"] = res["pickled_data"]
    res["level"] = armor.level
    res["tech_level"] = armor.customization.tech_level
    res["effective_ac"] = armor.effective_ac
    res["effective_weight_lbs"] = armor.effective_weight_lbs
    res["is_heavy"] = armor.is_heavy
    res["effective_speed_diff"] = armor.effective_speed_diff
    res["technique_failure_chance"] = armor.technique_failure_chance
    res["combat_technique_disadvantage_level"] = armor.combat_technique_disadvantage_level
    res["total_cost"] = armor.total_cost
    res["total_procure_diff"] = armor.total_procure_diff
    res["craft_dc"] = armor.craft_dc
    res["structural_rank_required"] = armor.structural_rank_required
    res["craft_time_days"] = armor.craft_time_days
    res["craft_supply_cost"] = armor.craft_supply_cost
    res["required_proficiency_level"] = armor.required_proficiency_level
    res["dr_summary"] = armor.dr_summary
    res["effective_dr"] = armor.effective_dr

    res["customization"] = {
        "tech_level": armor.customization.tech_level,
        "masterwork_level": armor.customization.masterwork_level,
        "masterwork_choices": armor.customization.masterwork_choices,
        "points_spent": armor.customization.points_spent,
        "number_of_improvements": armor.customization.number_of_improvements,
        "negative_points_earned": armor.customization.negative_points_earned,
        "total_points": armor.customization.total_points,
        "remaining_points": armor.customization.remaining_points,
        "customization_slots": armor.customization.customization_slots,
        "remaining_slots": armor.customization.remaining_slots,
        "diminished_attributes": armor.customization.diminished_attributes,
        "improved_attributes": armor.customization.improved_attributes,
        "customization_log": armor.customization.customization_log,
    }

    res["dr_info"] = {
        "ac_traded_for_dr": armor.dr.ac_traded_for_dr,
        "dr_units_from_trade": armor.dr.dr_units_from_trade,
        "dr_units_from_points": armor.dr.dr_units_from_points,
        "total_dr_units": armor.dr.dr_units,
        "dr_units_spent": armor.dr.dr_units_spent,
        "dr_units_remaining": armor.dr.dr_units_remaining,
        "dr_chemical": armor.dr.dr_chemical,
        "dr_electrical": armor.dr.dr_electrical,
        "dr_thermal": armor.dr.dr_thermal,
        "dr_kinetic": armor.dr.dr_kinetic,
        "dr_all": armor.dr.dr_all,
        "dr_summary": armor.dr.dr_summary,
    }

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
    and returns the pickled Armor model in its JSON form.
    """
    sources = _get_request_sources()

    raw_level = _extract_param(
        sources,
        ["armor_level", "Armor Level", "armorLevel", "ArmorLevel", "level", "Level", "al", "AL"],
        default=level,
    )
    raw_tl = _extract_param(
        sources,
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

    item_id = _extract_param(sources, ["item_id", "itemId", "id", "ID"])
    if not item_id:
        item_id = f"armor_al{al}_tl{tl}_{uuid.uuid4().hex[:8]}"

    name = _extract_param(sources, ["name", "Name", "item_name", "itemName"])
    if not name:
        name = f"Base Armor (AL {al}, TL {tl})"

    description = _extract_param(
        sources,
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

    save_param = _extract_param(sources, ["save", "Save", "persist", "Persist"], default=False)
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
    :DESC: Trades AC bonus for DR Units (1 AC = 4 DR Units). All AC to DR trading must happen before customization points are spent.
    :Content-Type: application/json
    """
    sources = _get_request_sources()
    armor, err = _extract_armor_from_request(sources)
    if err or not armor:
        return jsonify({"error": err or "Armor payload missing."}), 400

    # Rule: All AC to DR trading must happen before customization points are earned or spent.
    force = _extract_param(sources, ["force", "Force"], default=False)
    if isinstance(force, str):
        force = force.lower() in ("true", "1", "yes")

    if (armor.customization.points_spent > 0 or armor.customization.negative_points_earned > 0) and not force:
        return jsonify({
            "error": "All AC to DR trading must happen before customization points are earned or spent. Pass 'force=true' to override."
        }), 400

    # Parameter: trade_ac (incremental change) or ac_traded_for_dr (absolute value)
    trade_ac = _extract_param(sources, ["trade_ac", "ac_to_trade", "trade", "ac_units", "amount"])
    ac_traded_for_dr = _extract_param(sources, ["ac_traded_for_dr", "ac_traded", "total_ac_traded"])

    if ac_traded_for_dr is not None:
        try:
            target_trade = int(ac_traded_for_dr)
        except (ValueError, TypeError):
            return jsonify({"error": f"Invalid ac_traded_for_dr value '{ac_traded_for_dr}'."}), 400
    elif trade_ac is not None:
        try:
            target_trade = armor.dr.ac_traded_for_dr + int(trade_ac)
        except (ValueError, TypeError):
            return jsonify({"error": f"Invalid trade_ac value '{trade_ac}'."}), 400
    else:
        return jsonify({"error": "Missing parameter 'trade_ac' (delta) or 'ac_traded_for_dr' (total)."}), 400

    if target_trade < 0:
        return jsonify({"error": f"Cannot trade negative AC ({target_trade})."}), 400

    if target_trade > armor.ac_bonus:
        return jsonify({
            "error": f"Cannot trade {target_trade} AC. Armor only has {armor.ac_bonus} base AC bonus (effective AC cannot drop below 0)."
        }), 400

    # If reducing traded AC, verify DR units aren't already allocated
    if target_trade < armor.dr.ac_traded_for_dr:
        units_lost = (armor.dr.ac_traded_for_dr - target_trade) * 4
        if armor.dr.dr_units_remaining < units_lost:
            return jsonify({
                "error": f"Cannot reduce traded AC by {armor.dr.ac_traded_for_dr - target_trade} AC because {units_lost} DR units would be removed, but {armor.dr.dr_units_spent} DR units are already spent."
            }), 400

    old_trade = armor.dr.ac_traded_for_dr
    armor.dr.ac_traded_for_dr = target_trade
    armor.dr.dr_units_from_trade = target_trade * 4

    armor.customization.customization_log.append({
        "action": "trade_dr",
        "previous_ac_traded": old_trade,
        "new_ac_traded": target_trade,
        "dr_units_from_trade": armor.dr.dr_units_from_trade,
        "effective_ac": armor.effective_ac,
    })

    save_param = _extract_param(sources, ["save", "Save"], default=False)
    return _format_armor_response(
        armor,
        message=f"Traded {target_trade} AC for {target_trade * 4} DR Units. Effective AC is now {armor.effective_ac}.",
        save=bool(save_param),
    )


# -------------------------------------------------------------------------
# 2. Spending DR Units
# -------------------------------------------------------------------------
@app.route("/tasks/armor/spend_dr", methods=["POST"])
@app.route("/tasks/armor/dr/spend", methods=["POST"])
def armor_spend_dr():
    """
    :OPTIONS: POST
    :PATH: /tasks/armor/spend_dr, /tasks/armor/dr/spend
    :DESC: Spends available DR Units to acquire damage reduction: 1 unit = 1 DR (Chemical/Electrical/Thermal), 2 units = 1 DR (Kinetic), 4 units = 1 DR (ALL). Total DR stacks up to a maximum of 10.
    :Content-Type: application/json
    """
    sources = _get_request_sources()
    armor, err = _extract_armor_from_request(sources)
    if err or not armor:
        return jsonify({"error": err or "Armor payload missing."}), 400

    mode = str(_extract_param(sources, ["mode", "Mode"], default="add")).lower()

    # Targets
    new_chem = armor.dr.dr_chemical
    new_elec = armor.dr.dr_electrical
    new_therm = armor.dr.dr_thermal
    new_kin = armor.dr.dr_kinetic
    new_all = armor.dr.dr_all

    # Check for single dr_type + amount
    dr_type = _extract_param(sources, ["dr_type", "type", "damage_type"])
    amount = _extract_param(sources, ["amount", "value", "dr"], default=None)

    if dr_type and amount is not None:
        try:
            amt = int(amount)
        except (ValueError, TypeError):
            return jsonify({"error": f"Invalid amount '{amount}'."}), 400

        dt = str(dr_type).strip().lower()
        if dt in ("all", "a"):
            new_all = amt if mode == "set" else new_all + amt
        elif dt in ("kinetic", "k"):
            new_kin = amt if mode == "set" else new_kin + amt
        elif dt in ("chemical", "c"):
            new_chem = amt if mode == "set" else new_chem + amt
        elif dt in ("electrical", "electric", "e"):
            new_elec = amt if mode == "set" else new_elec + amt
        elif dt in ("thermal", "t"):
            new_therm = amt if mode == "set" else new_therm + amt
        else:
            return jsonify({"error": f"Unknown DR type '{dr_type}'. Must be 'all', 'kinetic', 'chemical', 'electrical', or 'thermal'."}), 400
    else:
        # Check for individual type keys
        dr_dict = _extract_param(sources, ["dr", "DR", "dr_allocation"], default={})
        if not isinstance(dr_dict, dict):
            dr_dict = {}

        def get_val(keys, current):
            val = _extract_param([dr_dict, *sources], keys, default=None)
            if val is not None:
                try:
                    int_val = int(val)
                    return int_val if mode == "set" else current + int_val
                except (ValueError, TypeError):
                    pass
            return current

        new_all = get_val(["dr_all", "all", "DR_ALL", "ALL"], new_all)
        new_kin = get_val(["dr_kinetic", "kinetic", "DR_K", "K"], new_kin)
        new_chem = get_val(["dr_chemical", "chemical", "DR_C", "C"], new_chem)
        new_elec = get_val(["dr_electrical", "electrical", "DR_E", "E"], new_elec)
        new_therm = get_val(["dr_thermal", "thermal", "DR_T", "T"], new_therm)

    # Check bounds
    if min(new_chem, new_elec, new_therm, new_kin, new_all) < 0:
        return jsonify({"error": "Damage reduction values cannot be negative."}), 400

    # Rule: DR stacks up to a maximum of 10 for any damage type
    for dt_name, specific_val in [("Kinetic", new_kin), ("Chemical", new_chem), ("Electrical", new_elec), ("Thermal", new_therm)]:
        effective_dr = new_all + specific_val
        if effective_dr > 10:
            return jsonify({
                "error": f"DR stacks up to a maximum of 10. Effective DR for {dt_name} would be {effective_dr} ({new_all} ALL + {specific_val} {dt_name})."
            }), 400

    # Shirt Rule: A Shirt cannot provide more than 5 DR (ALL) or equivalent
    if armor.specials.is_shirt and new_all > 5:
        return jsonify({"error": "Shirt armor cannot provide more than 5 DR (ALL)."}), 400

    # Calculate total units required
    units_required = (new_all * 4) + (new_kin * 2) + new_chem + new_elec + new_therm
    total_available_units = armor.dr.dr_units

    if units_required > total_available_units:
        return jsonify({
            "error": f"Insufficient DR units. Requested DR requires {units_required} units, but only {total_available_units} units available ({armor.dr.dr_units_remaining} remaining)."
        }), 400

    armor.dr.dr_chemical = new_chem
    armor.dr.dr_electrical = new_elec
    armor.dr.dr_thermal = new_therm
    armor.dr.dr_kinetic = new_kin
    armor.dr.dr_all = new_all

    armor.customization.customization_log.append({
        "action": "spend_dr",
        "units_spent": units_required,
        "units_remaining": total_available_units - units_required,
        "dr_summary": armor.dr.dr_summary,
    })

    save_param = _extract_param(sources, ["save", "Save"], default=False)
    return _format_armor_response(
        armor,
        message=f"DR configuration updated: {armor.dr.dr_summary}. Used {units_required}/{total_available_units} DR Units ({armor.dr.dr_units_remaining} remaining).",
        save=bool(save_param),
    )


# -------------------------------------------------------------------------
# 3. Masterworking: Adding or Removing Levels
# -------------------------------------------------------------------------
@app.route("/tasks/armor/masterwork", methods=["POST"])
@app.route("/tasks/armor/masterworking", methods=["POST"])
def armor_masterwork():
    """
    :OPTIONS: POST
    :PATH: /tasks/armor/masterwork, /tasks/armor/masterworking
    :DESC: Adds or removes Masterworking levels (0 to 5). Each level provides either +1 Customization Slot or +1 Free Customization Point. Increases Craft DC by +2 per level and requires Structural Skill Rank 6+.
    :Content-Type: application/json
    """
    sources = _get_request_sources()
    armor, err = _extract_armor_from_request(sources)
    if err or not armor:
        return jsonify({"error": err or "Armor payload missing."}), 400

    action = str(_extract_param(sources, ["action", "Action", "op"], default="add")).strip().lower()
    choice = str(_extract_param(sources, ["choice", "Choice", "type"], default="point")).strip().lower()
    if choice not in ("point", "slot", "points", "slots"):
        choice = "point"
    normalized_choice = "point" if "point" in choice else "slot"

    levels_param = _extract_param(sources, ["levels", "level", "count", "amount"], default=1)
    try:
        levels = int(levels_param)
    except (ValueError, TypeError):
        return jsonify({"error": f"Invalid levels parameter '{levels_param}'."}), 400

    current_mw = armor.customization.masterwork_level

    # If action is 'set', determine delta
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

    if action in ("add", "increase", "+"):
        if current_mw + levels > 5:
            return jsonify({
                "error": f"Cannot increase Masterwork Level to {current_mw + levels}. Maximum Masterwork Level is 5."
            }), 400

        for _ in range(levels):
            armor.customization.masterwork_choices.append(normalized_choice)
            armor.customization.masterwork_level += 1

        armor.customization.customization_log.append({
            "action": "masterwork_add",
            "added_levels": levels,
            "choice": normalized_choice,
            "new_masterwork_level": armor.customization.masterwork_level,
        })
        msg = (
            f"Added {levels} Masterwork Level(s) (choice: '{normalized_choice}'). "
            f"Masterwork Level is now {armor.customization.masterwork_level}. "
            f"Craft DC is {armor.craft_dc} (+2/level). Structural Skill Rank 6+ and Advanced Build Materials required."
        )

    elif action in ("remove", "decrease", "delete", "-"):
        if current_mw - levels < 0:
            return jsonify({
                "error": f"Cannot decrease Masterwork Level below 0 (current: {current_mw})."
            }), 400

        for _ in range(levels):
            if not armor.customization.masterwork_choices:
                armor.customization.masterwork_level = max(0, armor.customization.masterwork_level - 1)
                continue

            last_choice = armor.customization.masterwork_choices[-1]
            if last_choice in ("point", "points"):
                if armor.customization.remaining_points < 1:
                    return jsonify({
                        "error": "Cannot remove Masterwork level because the customization point provided by it has already been spent. Refund or adjust customizations first."
                    }), 400
            elif last_choice in ("slot", "slots"):
                if armor.customization.remaining_slots < 1:
                    return jsonify({
                        "error": "Cannot remove Masterwork level because the customization slot provided by it is currently in use. Refund or adjust customizations first."
                    }), 400

            armor.customization.masterwork_choices.pop()
            armor.customization.masterwork_level -= 1

        armor.customization.customization_log.append({
            "action": "masterwork_remove",
            "removed_levels": levels,
            "new_masterwork_level": armor.customization.masterwork_level,
        })
        msg = f"Removed {levels} Masterwork Level(s). Masterwork Level is now {armor.customization.masterwork_level}."

    else:
        return jsonify({"error": f"Unknown action '{action}'. Must be 'add', 'remove', or 'set'."}), 400

    save_param = _extract_param(sources, ["save", "Save"], default=False)
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
    :DESC: Diminishes an Armor attribute to yield Negative Points (2 Negative Points = 1 Customization Point). Cannot diminish an attribute that has already been improved.
    :Content-Type: application/json
    """
    sources = _get_request_sources()
    armor, err = _extract_armor_from_request(sources)
    if err or not armor:
        return jsonify({"error": err or "Armor payload missing."}), 400

    attribute = _extract_param(sources, ["attribute", "Attribute", "attr", "name"])
    if not attribute:
        return jsonify({"error": "Missing 'attribute' parameter to diminish."}), 400

    attr_key = str(attribute).strip().lower()

    # Rule: You cannot gain a Diminishment/Negative on an Attribute to then spend points on that same Attribute.
    if attr_key in armor.customization.improved_attributes:
        return jsonify({
            "error": f"Attribute '{attribute}' was previously improved. Armor crafting rules prohibit diminishing an attribute that has been improved."
        }), 400

    neg_yield = 1
    diminish_desc = ""

    if attr_key in ("ac", "ac_bonus", "armor_class"):
        # Rule: -1 AC yields 2 Negative points. Doesn't decrease cost or Armor Level.
        if armor.ac_bonus <= 0:
            return jsonify({"error": "AC bonus cannot be reduced below 0."}), 400
        armor.ac_bonus -= 1
        neg_yield = 2
        diminish_desc = f"Reduced AC bonus by 1 (now {armor.ac_bonus})."

    elif attr_key in ("max_dex", "max_dex_bonus", "maximum_dex"):
        # Rule: Starting Max Dex: 7-9 (0 Neg), 6-4 (1 Neg), 3-0 (2 Neg). Cannot drop below 0; max 4 Neg total.
        if armor.max_dex_bonus <= 0:
            return jsonify({"error": "Maximum Dexterity Bonus cannot be reduced below 0."}), 400

        current_md = armor.max_dex_bonus
        if current_md >= 7:
            neg_yield = 0
        elif current_md >= 4:
            neg_yield = 1
        else:
            neg_yield = 2

        # Check max 4 negative points earned from max_dex
        past_md_neg = sum(
            log_item.get("points_yielded", 0)
            for log_item in armor.customization.customization_log
            if log_item.get("action") == "diminish" and log_item.get("attribute") == "max_dex"
        )
        if past_md_neg + neg_yield > 4:
            neg_yield = max(0, 4 - past_md_neg)
            if neg_yield == 0:
                return jsonify({"error": "Maximum 4 Negative Points cap from Maximum Dex diminishment has been reached."}), 400

        armor.max_dex_bonus -= 1
        diminish_desc = f"Reduced Max Dex Bonus by 1 (now +{armor.max_dex_bonus})."

    elif attr_key in ("speed", "speed_diff"):
        # Rule: Decreasing speed tier yields 1 Negative point. Can only change this attribute once.
        if "speed" in armor.customization.diminished_attributes or "speed_diff" in armor.customization.diminished_attributes:
            return jsonify({"error": "Speed Diff diminishment can only be taken once."}), 400

        curr_speed = armor.speed_diff
        if curr_speed == "Halved":
            # Decreasing beyond halved triggers Clumsy
            armor.specials.is_clumsy = True
            diminish_desc = "Speed penalty exceeded Halved; Clumsy condition applied."
        else:
            curr_idx = SPEED_TIERS.index(curr_speed)
            armor.speed_diff = SPEED_TIERS[curr_idx + 1]
            diminish_desc = f"Reduced speed tier from {curr_speed} to {armor.speed_diff}."
        neg_yield = 1

    elif attr_key in ("weight", "weight_lbs"):
        # Rule: 1 Neg point if it doesn't adjust Speed/Size; 2 Neg points if it adjusts Speed/Size (>=35 lbs Heavy or >45 lbs Clumsy)
        armor.weight_lbs += 5.0
        eff_weight = armor.effective_weight_lbs
        if eff_weight >= 35.0:
            neg_yield = 2
            diminish_desc = f"Increased weight by 5 lbs (now {eff_weight} lbs, Heavy Armor)."
            if eff_weight > 45.0:
                armor.specials.is_clumsy = True
                diminish_desc += " Clumsy condition triggered (> 45 lbs)."
        else:
            neg_yield = 1
            diminish_desc = f"Increased weight by 5 lbs (now {eff_weight} lbs)."

    elif attr_key in ("dr", "damage_reduction"):
        # Rule: -1 DR (C/E/T) = 1 Neg; -1 DR (K) = 2 Neg; -1 DR (ALL) = 3 Neg.
        dr_type = str(_extract_param(sources, ["dr_type", "type"], default="chemical")).strip().lower()
        if dr_type in ("chemical", "c"):
            if armor.dr.dr_chemical <= 0:
                return jsonify({"error": "Armor has 0 Chemical DR to diminish."}), 400
            armor.dr.dr_chemical -= 1
            neg_yield = 1
        elif dr_type in ("electrical", "electric", "e"):
            if armor.dr.dr_electrical <= 0:
                return jsonify({"error": "Armor has 0 Electrical DR to diminish."}), 400
            armor.dr.dr_electrical -= 1
            neg_yield = 1
        elif dr_type in ("thermal", "t"):
            if armor.dr.dr_thermal <= 0:
                return jsonify({"error": "Armor has 0 Thermal DR to diminish."}), 400
            armor.dr.dr_thermal -= 1
            neg_yield = 1
        elif dr_type in ("kinetic", "k"):
            if armor.dr.dr_kinetic <= 0:
                return jsonify({"error": "Armor has 0 Kinetic DR to diminish."}), 400
            armor.dr.dr_kinetic -= 1
            neg_yield = 2
        elif dr_type in ("all", "a"):
            if armor.dr.dr_all <= 0:
                return jsonify({"error": "Armor has 0 All-Damage DR to diminish."}), 400
            armor.dr.dr_all -= 1
            neg_yield = 3
        else:
            return jsonify({"error": f"Unknown DR type '{dr_type}'."}), 400
        diminish_desc = f"Removed 1 DR ({dr_type.upper()})."

    else:
        # Generic / Custom diminishment
        custom_pts = _extract_param(sources, ["points", "points_yielded", "neg_points"], default=1)
        try:
            neg_yield = max(1, int(custom_pts))
        except (ValueError, TypeError):
            neg_yield = 1
        diminish_desc = _extract_param(sources, ["description", "desc"], default=f"Custom diminishment on '{attribute}'.")

    armor.customization.negative_points_earned += neg_yield
    armor.customization.diminished_attributes.append(attr_key)
    armor.customization.customization_log.append({
        "action": "diminish",
        "attribute": attr_key,
        "points_yielded": neg_yield,
        "description": diminish_desc,
        "total_negative_points": armor.customization.negative_points_earned,
    })

    save_param = _extract_param(sources, ["save", "Save"], default=False)
    return _format_armor_response(
        armor,
        message=f"Diminished '{attribute}': {diminish_desc} Yielded {neg_yield} Negative Point(s). Total negative points earned: {armor.customization.negative_points_earned}.",
        save=bool(save_param),
    )


# -------------------------------------------------------------------------
# 5. Improve an Attribute (Costs Customization Points)
# -------------------------------------------------------------------------
@app.route("/tasks/armor/improve", methods=["POST"])
@app.route("/tasks/armor/customization/improve", methods=["POST"])
def armor_improve():
    """
    :OPTIONS: POST
    :PATH: /tasks/armor/improve, /tasks/armor/customization/improve
    :DESC: Improves an Armor attribute using Customization Points (CP). By default, an improvement costs 1 CP and 1 slot. Cannot improve an attribute that has been diminished.
    :Content-Type: application/json
    """
    sources = _get_request_sources()
    armor, err = _extract_armor_from_request(sources)
    if err or not armor:
        return jsonify({"error": err or "Armor payload missing."}), 400

    attribute = _extract_param(sources, ["attribute", "Attribute", "attr", "name"])
    if not attribute:
        return jsonify({"error": "Missing 'attribute' parameter to improve."}), 400

    attr_key = str(attribute).strip().lower()

    # Rule: You cannot gain a Diminishment/Negative on an Attribute to then spend points on that same Attribute.
    if attr_key in armor.customization.diminished_attributes:
        return jsonify({
            "error": f"Attribute '{attribute}' was previously diminished. Armor crafting rules prohibit improving an attribute that has been diminished."
        }), 400

    cp_cost = 1
    slot_cost = 1
    improve_desc = ""

    if attr_key in ("dr", "damage_reduction"):
        # Rule: 1 CP = 2 DR Units (1 CP = 2 DR (C/E/T), 1 CP = 1 DR (K), 2 CP = 1 DR (A)).
        cp_cost = 1
        slot_cost = 1
        armor.dr.dr_units_from_points += 2
        improve_desc = "Gained 2 DR Units from 1 Customization Point."

        # Optional immediate allocation
        dr_type = _extract_param(sources, ["dr_type", "type"])
        if dr_type:
            dt = str(dr_type).strip().lower()
            if dt in ("all", "a"):
                # Requires 4 units (2 CP)
                return jsonify({"error": "1 DR (ALL) requires 4 DR Units (2 Customization Points). Use /tasks/armor/spend_dr after acquiring units."}), 400
            elif dt in ("kinetic", "k"):
                armor.dr.dr_kinetic += 1
                improve_desc += " Allocated 2 units to +1 Kinetic DR."
            elif dt in ("chemical", "c"):
                armor.dr.dr_chemical += 2
                improve_desc += " Allocated 2 units to +2 Chemical DR."
            elif dt in ("electrical", "electric", "e"):
                armor.dr.dr_electrical += 2
                improve_desc += " Allocated 2 units to +2 Electrical DR."
            elif dt in ("thermal", "t"):
                armor.dr.dr_thermal += 2
                improve_desc += " Allocated 2 units to +2 Thermal DR."

    elif attr_key in ("max_dex", "max_dex_bonus", "maximum_dex"):
        # Rule: 2 CP = +1 Max Dex. Total AC from Dex + Armor capped at 10.
        cp_cost = 2
        slot_cost = 1
        effective_total_ac = armor.effective_ac + armor.max_dex_bonus + 1
        if effective_total_ac > 10:
            return jsonify({
                "error": f"Total AC from Dex and Armor cannot exceed 10 (effective AC: {armor.effective_ac}, proposed max dex: {armor.max_dex_bonus + 1}, total: {effective_total_ac})."
            }), 400
        armor.max_dex_bonus += 1
        improve_desc = f"Increased Maximum Dex Bonus by 1 (now +{armor.max_dex_bonus})."

    elif attr_key in ("speed", "speed_diff"):
        # Rule: 1 CP = increase speed tier by 1 (Halved -> -10ft -> -5ft -> Normal).
        cp_cost = 1
        slot_cost = 1
        if armor.speed_diff == "Normal":
            return jsonify({"error": "Armor speed penalty is already Normal (maximum speed tier)."}), 400
        curr_idx = SPEED_TIERS.index(armor.speed_diff)
        armor.speed_diff = SPEED_TIERS[curr_idx - 1]
        improve_desc = f"Improved speed penalty tier to {armor.speed_diff}."

    elif attr_key in ("weight", "weight_lbs"):
        # Rule: 1 CP = lower weight by 5 lbs (min weight = 1 lb per Armor Level; AL 0 = 0.25 lbs).
        cp_cost = 1
        slot_cost = 1
        min_wt = 0.25 if armor.level == 0 else float(armor.level * 1.0)
        if armor.weight_lbs <= min_wt:
            return jsonify({"error": f"Armor weight is already at the minimum allowed limit ({min_wt} lbs)."}), 400
        armor.weight_lbs = max(min_wt, armor.weight_lbs - 5.0)
        improve_desc = f"Reduced armor weight to {armor.weight_lbs} lbs."

    elif attr_key in ("protection_combat_tech", "combat_tech", "technique_protection"):
        # Rule: 1 CP, 1 slot. Provides +4 AC bonus (+2 on Shirt). Stacks +2 per extra time. One technique only.
        cp_cost = 1
        slot_cost = 1
        technique = _extract_param(sources, ["technique", "tech", "combat_technique"])
        if not technique and not armor.specials.protection_combat_tech:
            return jsonify({"error": "Missing 'technique' parameter (e.g. Grapple, Disarm, Trip, Feint)."}), 400

        if technique and armor.specials.protection_combat_tech and armor.specials.protection_combat_tech.lower() != technique.lower():
            return jsonify({
                "error": f"Armor already protects against '{armor.specials.protection_combat_tech}'. Armor can only protect against one Combat Technique."
            }), 400

        if technique:
            armor.specials.protection_combat_tech = str(technique).strip()
        armor.specials.protection_combat_tech_count += 1
        bonus = armor.specials.combat_tech_ac_bonus
        improve_desc = f"Protection against {armor.specials.protection_combat_tech}: +{bonus} AC bonus."

    elif attr_key in ("regeneration", "regen"):
        # Rule: TL 2+, 1 CP base, +1 CP for every 2 times taken. HP/turn equal to TL. Procure Diff +1.
        if armor.customization.tech_level < 2:
            return jsonify({"error": "Regeneration requires Tech Level 2 or higher."}), 400
        times = armor.specials.regeneration_count
        cp_cost = 1 + (times // 2)
        slot_cost = 1
        armor.specials.regeneration_count += 1
        improve_desc = f"Regeneration level {armor.specials.regeneration_count}: provides {armor.customization.tech_level} HP/turn."

    elif attr_key in ("stealth_assist", "stealth"):
        # Rule: TL 1+, 1 CP. Max times = Tech Level. +2 Stealth bonus per point.
        if armor.customization.tech_level < 1:
            return jsonify({"error": "Stealth Assist requires Tech Level 1 or higher."}), 400
        if armor.specials.stealth_assist_count >= armor.customization.tech_level:
            return jsonify({
                "error": f"Stealth Assist cannot be taken more times ({armor.specials.stealth_assist_count}) than the Tech Level ({armor.customization.tech_level})."
            }), 400
        cp_cost = 1
        slot_cost = 1
        armor.specials.stealth_assist_count += 1
        improve_desc = f"Stealth Assist level {armor.specials.stealth_assist_count}: +{armor.specials.stealth_bonus} to Stealth checks."

    elif attr_key in ("weapon_mount", "mount"):
        # Rule: 3 CP. Taken once only. Small (+5 lbs, 1 slot), Medium (+10 lbs, 2 slots), Large (+15 lbs, 3 slots).
        if armor.specials.weapon_mount_size:
            return jsonify({"error": "Weapon Mount can only be taken once."}), 400
        if armor.specials.is_shirt:
            return jsonify({"error": "Shirt armor cannot have a Weapon Mount."}), 400

        mount_size = str(_extract_param(sources, ["mount_size", "size"], default="Small")).capitalize()
        if mount_size not in ("Small", "Medium", "Large"):
            return jsonify({"error": f"Invalid weapon mount size '{mount_size}'. Must be Small, Medium, or Large."}), 400

        cp_cost = 3
        slot_cost = {"Small": 1, "Medium": 2, "Large": 3}[mount_size]
        armor.specials.weapon_mount_size = mount_size  # type: ignore[assignment]
        improve_desc = f"Weapon Mount ({mount_size}): adds {armor.specials.weapon_mount_weight_lbs} lbs and consumes {slot_cost} slots."

    elif attr_key in ("shirt", "is_shirt"):
        # Rule: TL 1+. AL 0 = 0 CP, AL 1 = 2 CP, AL 2 = 4 CP. Base cost doubled. Max 2 AC, 5 DR (ALL).
        if armor.customization.tech_level < 1:
            return jsonify({"error": "Shirt armor requires Tech Level 1 or higher."}), 400
        if armor.specials.is_shirt:
            return jsonify({"error": "Armor is already declared as a Shirt."}), 400
        if armor.level > 2:
            return jsonify({"error": f"Shirt armor cannot be constructed for Armor Level {armor.level} (max Level 2 / 2 AC)."}), 400
        if armor.specials.weapon_mount_size:
            return jsonify({"error": "Shirt armor cannot have a Weapon Mount."}), 400

        decl_costs = {0: 0, 1: 2, 2: 4}
        cp_cost = decl_costs.get(armor.level, 0)
        slot_cost = 1
        armor.specials.is_shirt = True
        improve_desc = f"Constructed as a Shirt (AL {armor.level}, declaration cost: {cp_cost} CP). Base cost is doubled."

    elif attr_key in ("quick_slots", "quick_slot"):
        # Rule: TL 1+, 1 CP. Provides slots equal to TL (1-4).
        if armor.customization.tech_level < 1:
            return jsonify({"error": "Quick Slots requires Tech Level 1 or higher."}), 400
        cp_cost = 1
        slot_cost = 1
        armor.specials.quick_slots_count = armor.customization.tech_level
        improve_desc = f"Quick Slots: added {armor.specials.quick_slots_count} quick access slots."

    else:
        # Generic / Custom improvement
        cp_cost = max(1, int(_extract_param(sources, ["cp_cost", "cost", "points"], default=1)))
        slot_cost = max(1, int(_extract_param(sources, ["slots", "slots_cost"], default=1)))
        improve_desc = _extract_param(sources, ["description", "desc"], default=f"Custom improvement on '{attribute}'.")

    # Validate remaining points and slots
    if armor.customization.remaining_points < cp_cost:
        return jsonify({
            "error": f"Insufficient Customization Points. Improvement '{attribute}' requires {cp_cost} CP, but only {armor.customization.remaining_points} point(s) remaining."
        }), 400

    if armor.customization.remaining_slots < slot_cost:
        return jsonify({
            "error": f"Insufficient Customization Slots. Improvement '{attribute}' requires {slot_cost} slot(s), but only {armor.customization.remaining_slots} slot(s) remaining."
        }), 400

    armor.customization.points_spent += cp_cost
    armor.customization.number_of_improvements += slot_cost
    armor.customization.improved_attributes.append(attr_key)
    armor.customization.customization_log.append({
        "action": "improve",
        "attribute": attr_key,
        "cp_cost": cp_cost,
        "slots_cost": slot_cost,
        "description": improve_desc,
        "remaining_points": armor.customization.remaining_points,
        "remaining_slots": armor.customization.remaining_slots,
    })

    save_param = _extract_param(sources, ["save", "Save"], default=False)
    return _format_armor_response(
        armor,
        message=f"Improved '{attribute}': {improve_desc} Spent {cp_cost} CP, used {slot_cost} slot(s). Remaining: {armor.customization.remaining_points} CP, {armor.customization.remaining_slots} slots.",
        save=bool(save_param),
    )


# -------------------------------------------------------------------------
# 6. Crafting Rolling Rules: Player Roll Evaluation & Material Accounting
# -------------------------------------------------------------------------
@app.route("/tasks/armor/craft_roll", methods=["POST"])
@app.route("/tasks/armor/roll", methods=["POST"])
def armor_craft_roll():
    """
    :OPTIONS: POST
    :PATH: /tasks/armor/craft_roll, /tasks/armor/roll
    :DESC: Evaluates a crafting roll for an Armor item against Craft DC (12 + TL + AL + 2*MW). Determines success or failure, supply materials lost or saved, and time required.
    :Content-Type: application/json
    """
    sources = _get_request_sources()
    armor, err = _extract_armor_from_request(sources)
    if err or not armor:
        return jsonify({"error": err or "Armor payload missing."}), 400

    # Check for re-crafting flags
    is_recraft = _extract_param(sources, ["is_recraft", "recraft", "re_craft"], default=False)
    if isinstance(is_recraft, str):
        is_recraft = is_recraft.lower() in ("true", "1", "yes")

    up_tech = _extract_param(sources, ["up_tech", "uptech"], default=False)
    if isinstance(up_tech, str):
        up_tech = up_tech.lower() in ("true", "1", "yes")

    masterworking_flag = _extract_param(sources, ["masterworking", "mw"], default=False)
    if isinstance(masterworking_flag, str):
        masterworking_flag = masterworking_flag.lower() in ("true", "1", "yes")

    # Determine Craft DC
    if is_recraft:
        target_dc = armor.recraft_dc(up_tech=bool(up_tech), masterworking=bool(masterworking_flag))
    else:
        target_dc = armor.craft_dc

    # Supply cost: 1/2 of total item cost
    supply_cost = armor.craft_supply_cost
    craft_time = armor.craft_time_days if not is_recraft else max(0.5, armor.craft_time_days / 2.0)

    # Extract roll from player
    raw_roll = _extract_param(sources, ["roll", "Roll", "check", "check_result", "result"])
    natural_1 = _extract_param(sources, ["natural_1", "crit_fail", "critical_failure"], default=False)
    if isinstance(natural_1, str):
        natural_1 = natural_1.lower() in ("true", "1", "yes")

    if raw_roll is None:
        # If modifier provided, simulate a roll
        mod = _extract_param(sources, ["modifier", "bonus", "skill_mod"])
        if mod is not None:
            try:
                die = random.randint(1, 20)
                actual_roll = die + int(mod)
                if die == 1:
                    natural_1 = True
            except (ValueError, TypeError):
                return jsonify({"error": f"Invalid skill modifier '{mod}'."}), 400
        else:
            return jsonify({"error": "Missing 'roll' parameter representing the player's Structural check result."}), 400
    else:
        try:
            actual_roll = int(raw_roll)
        except (ValueError, TypeError):
            return jsonify({"error": f"Invalid roll value '{raw_roll}'."}), 400

    margin = actual_roll - target_dc

    if natural_1:
        # Critical failure: 100% of materials and time wasted; item destroyed if recrafting
        outcome = "Critical Failure"
        success = False
        materials_lost = supply_cost
        materials_saved = 0.0
        materials_spent = supply_cost
        discount_pct = 0
        details = (
            f"Critical failure on craft check (natural 1). 100% of supplies (${supply_cost:,.2f}) and time wasted. "
            + ("The existing armor item was destroyed!" if is_recraft else "The item was not created.")
        )

    elif actual_roll < target_dc:
        # Non-critical failure: 50% of materials and time wasted
        outcome = "Failure"
        success = False
        materials_lost = round(supply_cost * 0.5, 2)
        materials_saved = round(supply_cost * 0.5, 2)
        materials_spent = materials_lost
        discount_pct = 0

        if is_recraft:
            fail_by = abs(margin)
            if fail_by < 5:
                recraft_note = "Failed by < 5: Armor is intact. No improvements applied. Can retry in 24 hours."
            elif fail_by <= 10:
                recraft_note = "Failed by 5-10: Armor receives 1 Scar of Item Damage. Must be repaired before another attempt."
            else:
                recraft_note = "Failed by > 10: Armor receives maximum Item Damage without destruction. Takes 2x time to repair."
            details = f"Re-crafting failed (DC {target_dc}, rolled {actual_roll}). 50% of materials lost (${materials_lost:,.2f}), 50% saved (${materials_saved:,.2f}). {recraft_note}"
        else:
            details = f"Crafting check failed (DC {target_dc}, rolled {actual_roll}). Item was not crafted. 50% of materials lost (${materials_lost:,.2f}), 50% saved (${materials_saved:,.2f}). 50% of crafting labor time wasted."

    else:
        # Success!
        outcome = "Success"
        success = True
        materials_lost = 0.0
        # Savings: for every 4 the DC is beaten, save 10% (max 40% if recraft, 50% if normal craft)
        max_discount = 40 if is_recraft else 50
        discount_pct = min(max_discount, (margin // 4) * 10)
        materials_saved = round(supply_cost * (discount_pct / 100.0), 2)
        materials_spent = round(supply_cost - materials_saved, 2)
        details = (
            f"Crafting successful! (DC {target_dc}, rolled {actual_roll}, exceeded by +{margin}). "
            f"{discount_pct}% supplies saved through component recycling (${materials_saved:,.2f} saved). "
            f"Final supplies cost spent: ${materials_spent:,.2f}."
        )

    response_payload = {
        "roll": actual_roll,
        "craft_dc": target_dc,
        "margin": margin,
        "outcome": outcome,
        "success": success,
        "is_critical_failure": bool(natural_1),
        "is_recraft": bool(is_recraft),
        "original_item_cost": armor.total_cost,
        "original_supply_cost": supply_cost,
        "materials_lost": materials_lost,
        "materials_saved": materials_saved,
        "final_materials_spent": materials_spent,
        "discount_percent": discount_pct,
        "craft_time_days": craft_time,
        "structural_rank_required": armor.structural_rank_required,
        "message": details,
        "armor": armor.model_dump(),
        "pickled_armor": armor.to_db_entry().pickled_data,
    }

    return jsonify(response_payload), 200


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
    :DESC: Creates a base Armor model with starting values (Armor Level and Tech Level). Returns the pickled Armor in JSON form.
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
    :DESC: Creates a base Armor model with starting values in URL path. Returns the pickled Armor in JSON form.
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
