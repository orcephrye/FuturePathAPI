#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 09/05/2026
# Description: Reference data tables for d20 FuturePath armor system and crafting

import logging
from typing import Any, Dict, List

from FuturePathAPI.libs.ReferenceData import get_reference_db

log = logging.getLogger("ArmorReferenceData")

# Baseline armor attributes by Armor Level (AL 0 to 9) at Tech Level 2 Baseline
ARMOR_BASELINE_TABLE: Dict[int, Dict[str, Any]] = {
    0: {
        "level": 0,
        "ac_bonus": 0,
        "max_dex_bonus": 9,
        "speed_diff": "Normal",
        "weight_lbs": 0.25,
        "base_cost": 10.0,
        "procure_diff": 0,
    },
    1: {
        "level": 1,
        "ac_bonus": 1,
        "max_dex_bonus": 8,
        "speed_diff": "Normal",
        "weight_lbs": 5.0,
        "base_cost": 150.0,
        "procure_diff": 0,
    },
    2: {
        "level": 2,
        "ac_bonus": 2,
        "max_dex_bonus": 7,
        "speed_diff": "Normal",
        "weight_lbs": 10.0,
        "base_cost": 350.0,
        "procure_diff": 0,
    },
    3: {
        "level": 3,
        "ac_bonus": 3,
        "max_dex_bonus": 6,
        "speed_diff": "Normal",
        "weight_lbs": 15.0,
        "base_cost": 1000.0,
        "procure_diff": 0,
    },
    4: {
        "level": 4,
        "ac_bonus": 4,
        "max_dex_bonus": 5,
        "speed_diff": "-5ft",
        "weight_lbs": 20.0,
        "base_cost": 2200.0,
        "procure_diff": 0,
    },
    5: {
        "level": 5,
        "ac_bonus": 5,
        "max_dex_bonus": 4,
        "speed_diff": "-5ft",
        "weight_lbs": 25.0,
        "base_cost": 4500.0,
        "procure_diff": 0,
    },
    6: {
        "level": 6,
        "ac_bonus": 6,
        "max_dex_bonus": 3,
        "speed_diff": "-10ft",
        "weight_lbs": 30.0,
        "base_cost": 9000.0,
        "procure_diff": 1,
    },
    7: {
        "level": 7,
        "ac_bonus": 7,
        "max_dex_bonus": 2,
        "speed_diff": "-10ft",
        "weight_lbs": 35.0,
        "base_cost": 18000.0,
        "procure_diff": 1,
    },
    8: {
        "level": 8,
        "ac_bonus": 8,
        "max_dex_bonus": 1,
        "speed_diff": "Halved",
        "weight_lbs": 40.0,
        "base_cost": 30000.0,
        "procure_diff": 2,
    },
    9: {
        "level": 9,
        "ac_bonus": 9,
        "max_dex_bonus": 0,
        "speed_diff": "Halved",
        "weight_lbs": 45.0,
        "base_cost": 55000.0,
        "procure_diff": 2,
    },
}

ARMOR_BASELINE_LIST: List[Dict[str, Any]] = list(ARMOR_BASELINE_TABLE.values())

# Tech Level baseline rules (TL 0 to 4)
TECH_LEVEL_TABLE: Dict[int, Dict[str, Any]] = {
    0: {
        "tech_level": 0,
        "name": "Level 0",
        "max_ac_or_dr": 5,
        "customization_slots": 1,
        "free_points": 0,
        "extra_base_cost": 0.0,
        "extra_procure_diff": 1,
        "is_archaic": True,
        "special_rules": "Archaic (+1 Armor Proficiency level needed to wear)",
    },
    1: {
        "tech_level": 1,
        "name": "Level 1",
        "max_ac_or_dr": 6,
        "customization_slots": 2,
        "free_points": 0,
        "extra_base_cost": 0.0,
        "extra_procure_diff": 0,
        "is_archaic": False,
        "special_rules": "None",
    },
    2: {
        "tech_level": 2,
        "name": "Level 2",
        "max_ac_or_dr": 7,
        "customization_slots": 3,
        "free_points": 1,
        "extra_base_cost": 250.0,
        "extra_procure_diff": 0,
        "is_archaic": False,
        "special_rules": "Baseline",
    },
    3: {
        "tech_level": 3,
        "name": "Level 3",
        "max_ac_or_dr": 8,
        "customization_slots": 4,
        "free_points": 2,
        "extra_base_cost": 1000.0,
        "extra_procure_diff": 1,
        "is_archaic": False,
        "special_rules": "None",
    },
    4: {
        "tech_level": 4,
        "name": "Level 4",
        "max_ac_or_dr": 9,
        "customization_slots": 5,
        "free_points": 3,
        "extra_base_cost": 3000.0,
        "extra_procure_diff": 1,
        "is_archaic": False,
        "special_rules": "None",
    },
}

TECH_LEVEL_LIST: List[Dict[str, Any]] = list(TECH_LEVEL_TABLE.values())

ARMOR_SPECIAL_ATTRIBUTES: List[Dict[str, Any]] = [
    {
        "Name": "Protection against Combat Techniques",
        "Cost": 1,
        "CostType": "Customization Point",
        "Prerequisites": "None",
        "Repeatable": True,
        "MaxTimes": None,
        "Summary": "Provides +4 AC bonus against a single type of Combat Technique (e.g., Grapple, Disarm, Trip, Feint). Stacks (+2 AC per additional time: +4, +6, +8...). Can only protect against one technique type. (On a Shirt, provides only +2 AC).",
        "Rules": {
            "BaseACBonus": 4,
            "AdditionalACBonus": 2,
            "ShirtBaseACBonus": 2,
            "MaxTechniqueTypes": 1,
        },
    },
    {
        "Name": "Regeneration",
        "Cost": 1,
        "CostType": "Customization Point",
        "CostMultiplier": 2,
        "Prerequisites": "Tech Level 2+",
        "Repeatable": True,
        "MaxTimes": None,
        "ProcureDiffMod": 1,
        "Summary": "Provides HP/turn equal to Tech Level. Spending CP on Regen costs twice as much Base Cost. For every 2 times taken, increases CP cost by +1. Increases Procure Diff by +1. Uses pharmaceutical cartons as ammunition (1 carton = 5 rounds). 2-round reload in combat.",
        "Rules": {
            "HPPerTurn": "Equal to Armor Tech Level",
            "Ammunition": "Pharmaceutical Carton (5 rounds; price of large ammunition)",
            "ReloadCombat": "Round 1: Acquire Ammo (Simple if in Quick Slot; Standard otherwise); Round 2: Apply Carton / Reload (Standard action; Simple with Quick Reload feat)",
            "AfterCombat": "Can consume remaining charges to finish healing; premature reload wastes remaining charges",
        },
    },
    {
        "Name": "Stealth Assist",
        "Cost": 1,
        "CostType": "Customization Point",
        "Prerequisites": "Tech Level 1+",
        "Repeatable": True,
        "MaxTimes": "Tech Level",
        "Summary": "Provides +2 bonus to Stealth skill checks per point spent. Can only be taken up to the Tech Level of the armor.",
        "Rules": {
            "BonusPerPoint": 2,
            "MaxPoints": "Equal to Tech Level (1-4)",
        },
    },
    {
        "Name": "Weapon Mount",
        "Cost": 3,
        "CostType": "Customization Point",
        "Prerequisites": "None",
        "Repeatable": False,
        "MaxTimes": 1,
        "Summary": "Mounts an off-hand weapon (Small/Medium/Large). Treated as off-hand weapon for Two-Weapon Fighting; does not benefit from TWF feats. If already wielding an off-hand weapon, acts as bonus damage. Increases weight and applies speed diminishment rules based on size.",
        "Rules": {
            "Small": {"WeightLbs": 5.0, "SlotsRequired": 1},
            "Medium": {"WeightLbs": 10.0, "SlotsRequired": 2},
            "Large": {"WeightLbs": 15.0, "SlotsRequired": 3},
            "Gigantic": "Does not qualify",
        },
    },
    {
        "Name": "Shirt",
        "Cost": "Level 0: 0 CP, Level 1: 2 CP, Level 2: 4 CP",
        "CostType": "Customization Point",
        "BaseCostMultiplier": 2,
        "CustomizationCostMultiplier": 2,
        "Prerequisites": "Tech Level 1+",
        "Repeatable": False,
        "MaxTimes": 1,
        "Summary": "Base Price is doubled. Spending Customization Points on a Shirt costs double. Max 2 AC, 5 DR (ALL), or DR equivalent. Cannot be Clumsy or have Weapon Mount. Can be worn under other armor (outer AC does not stack, use highest; DR stacks). Only shirt regen applies if both have regen. Protection vs Combat Tech provides +2 AC.",
        "Rules": {
            "DeclarationCosts": {"Level 0": 0, "Level 1": 2, "Level 2": 4},
            "MaxAC": 2,
            "MaxDRAll": 5,
            "Restrictions": ["Cannot be Clumsy", "Cannot have Weapon Mount"],
            "Layering": "Easily hidden/worn under other armor. Outer AC bonus does not stack (use highest), but DR stacks.",
        },
    },
    {
        "Name": "Quick Slots",
        "Cost": 1,
        "CostType": "Customization Point",
        "Prerequisites": "Tech Level 1+",
        "Repeatable": False,
        "MaxTimes": 1,
        "Summary": "Provides quick access slots equal to the Tech Level (1-4). Allows the wearer to retrieve a small item (grenade, ammo magazine, pharmaceutical carton) as a Simple action. Cannot store guns or medium/large items.",
        "Rules": {
            "SlotsProvided": "Equal to Tech Level (1-4)",
            "ActionType": "Simple action to retrieve small item",
            "Restrictions": "Cannot store guns or medium/large items",
        },
    },
    {
        "Name": "Clumsy",
        "Cost": 0,
        "CostType": "Free (Penalty Condition)",
        "Prerequisites": "Triggered if speed < halved or weight > 45 lbs",
        "Repeatable": False,
        "MaxTimes": 1,
        "Summary": "Disadvantage on all saving throws and Athletics, Acrobatics, Pilot, Sleight of Hand, Medical checks. No Minor/Major hit benefits on combat accuracy checks; max 1 Advantage.",
        "Rules": {
            "Triggers": ["Speed reduced below halved", "Weight exceeds 45 lbs"],
            "Penalties": [
                "Disadvantage on all saving throws",
                "Disadvantage on Athletics, Acrobatics, Pilot, Sleight of Hand, Medical",
                "No Minor or Major hit benefits on combat accuracy checks",
                "Cannot benefit from more than 1 Advantage",
            ],
        },
    },
    {
        "Name": "Archaic",
        "Cost": 0,
        "CostType": "Free (Penalty Condition)",
        "Prerequisites": "All Tech Level 0 Armor",
        "Repeatable": False,
        "MaxTimes": 1,
        "Summary": "Requires +1 Armor Proficiency Level above Armor Level to wear without penalties.",
        "Rules": {
            "ProficiencyModifier": 1,
            "AppliesTo": "Tech Level 0 Armor",
        },
    },
]

ARMOR_CUSTOMIZATION_ATTRIBUTES: Dict[str, Any] = {
    "AC Bonus": {
        "Name": "AC Bonus",
        "Description": "Player can adjust the AC Bonus of the Armor.",
        "Improvement": "Cannot spend points to increase AC level. Simply pick a higher-level armor.",
        "Diminishment": "Instantly yields 2 negative points instead of one. Does not decrease the cost of the armor or its Level.",
        "ImprovementCost": None,
        "DiminishmentPoints": 2,
    },
    "DR Bonus": {
        "Name": "DR Bonus",
        "Description": "Provides Damage Reduction to Armor for different types of attacks. DR stacks but cannot exceed 10. All AC to DR trading must happen before customization points are earned or spent.",
        "TradingRules": "1 AC traded = 4 DR Units (1 unit = 1 DR Chemical/Electrical/Thermal, 2 units = 1 DR Kinetic, 4 units = 1 DR ALL).",
        "Improvement": "Costs 1 Customization point. Gains 2 DR Units: 1 CP = 2 DR (C/E/T), 1 CP = 1 DR (Kinetic), 2 CP = 1 DR (ALL).",
        "Diminishment": "Removing 1 DR (C/E/T) yields 1 Negative point; removing 1 DR (Kinetic) yields 2 Negative points; removing 1 DR (ALL) yields 3 Negative points.",
        "Cap": 10,
        "UnitsPerACTraded": 4,
        "UnitsPerCP": 2,
        "DRUnitCosts": {
            "Chemical": 1,
            "Electrical": 1,
            "Thermal": 1,
            "Kinetic": 2,
            "ALL": 4,
        },
        "DiminishmentYields": {
            "Chemical": 1,
            "Electrical": 1,
            "Thermal": 1,
            "Kinetic": 2,
            "ALL": 3,
        },
    },
    "Maximum Dex": {
        "Name": "Maximum Dex",
        "Description": "Player can adjust the maximum Dex bonus allowed while wearing the Armor.",
        "Improvement": "Costs 2 customization points = +1 Max Dex. Total combined AC from Dex and Armor can never exceed 10.",
        "Diminishment": "Negative points based on starting Max Dex: 7-9 (0 Neg), 6-4 (1 Neg), 3-0 (2 Neg). Cannot drop below 0; max 4 Negative points total.",
        "ImprovementCost": 2,
        "MaxCombinedACDex": 10,
        "MaxNegativePoints": 4,
        "DiminishmentTiers": [
            {"DexRange": "7-9", "NegativePoints": 0},
            {"DexRange": "4-6", "NegativePoints": 1},
            {"DexRange": "0-3", "NegativePoints": 2},
        ],
    },
    "Speed Diff": {
        "Name": "Speed Diff",
        "Description": "Player can adjust the speed penalty for wearing armor (Normal -> -5ft -> -10ft -> Halved). Affects Run/Sprint/Dash/Swim/Climb movement, not base walking speed.",
        "Tiers": ["Normal", "-5ft", "-10ft", "Halved"],
        "Improvement": "Costs 1 Customization point. Increases speed to the next higher tier.",
        "Diminishment": "Decreasing speed yields 1 negative point. Can only be changed once.",
        "Penalties": {
            "Normal": {"TechniqueFailureChance": 0, "DisadvantageLevel": 0},
            "-5ft": {
                "TechniqueFailureChance": 10,
                "DisadvantageLevel": 1,
                "AffectedTechniques": ["Disarm", "Feint", "Combination Melee Attack", "Melee Kick"],
            },
            "-10ft": {
                "TechniqueFailureChance": 20,
                "DisadvantageLevel": 2,
                "AffectedTechniques": ["Disarm", "Feint", "Combination Melee Attack", "Melee Kick"],
            },
            "Halved": {
                "TechniqueFailureChance": 40,
                "DisadvantageLevel": 3,
                "AffectedTechniques": ["Disarm", "Feint", "Combination Melee Attack", "Melee Kick"],
            },
        },
    },
    "Weight": {
        "Name": "Weight",
        "Description": "Armor weight and bulk. Baseline is Tech Level 2. Lower TL (0-1): +5 lbs per TL below 2; Higher TL (3-4): -5 lbs per TL above 2. AL 0 is unaffected. Min weight for AL 1+ is 1 lb/level. 35+ lbs is Heavy Armor.",
        "Improvement": "Costs 1 Customization point. Lower weight to match row in Armor Table, using that row's Speed instead of Armor Level speed. Determines Size category.",
        "Diminishment": "Yields 1 Negative point if it doesn't adjust Speed/Size; yields 2 Negative points if it adjusts Speed/Size.",
        "HeavyThresholdLbs": 35.0,
        "MinWeightPerLevelLbs": 1.0,
    },
    "Special Attributes": {
        "Name": "Special Attributes",
        "Description": "Special customizable features: Protection against Combat Techniques, Regeneration, Stealth Assist, Weapon Mount, Shirt, Quick Slots, Clumsy, Archaic.",
    },
}

ARMOR_CRAFTING_RULES: Dict[str, Any] = {
    "Skill": "Structural (trained)",
    "RankRequirements": [
        {"SkillRanks": 1, "ArmorLevels": "0-3 (0-3 AC)", "CraftDays": 1},
        {"SkillRanks": 2, "ArmorLevels": "4-5 (4-5 AC)", "CraftDays": 2},
        {"SkillRanks": 3, "ArmorLevels": "6-7 (6-7 AC)", "CraftDays": 3},
        {"SkillRanks": 4, "ArmorLevels": "8-9 (8-9 AC)", "CraftDays": 4},
    ],
    "SuppliesCost": "1/2 of total item cost in crafting supplies",
    "CraftDCFormula": "12 + Tech Level + Armor Level + (2 per Masterwork level)",
    "ProficiencyRestriction": "Cannot craft armor requiring proficiency > 1 level above character's current Armor Proficiency level",
    "Collaboration": "Collaboration / dividing work is not permitted for armor crafting",
    "Masterworking": {
        "Requirements": "Skill Rank 6+ in Structural and Advanced Build Materials",
        "MaxLevel": 5,
        "BonusPerLevel": "+1 Customization Slot OR +1 Free Customization Point",
        "CraftDCModifier": "+2 per Masterwork level",
        "CostPerLevel": "Base Cost per level (Base Cost * (1 + Masterwork Level))",
    },
    "ReCrafting": {
        "Restrictions": "Cannot increase Armor Level. Can only improve Tech Level or Masterwork Level. Must repair Item Damage first.",
        "Cost": "Normal crafting cost. 10% discount for every 4 the Craft DC is beaten (max 40% discount).",
        "Time": "Halved (0.5 to 2 days)",
        "DCModifier": "Normal Craft DC + 1 (Up-Teching) + 1 (Masterworking)",
        "FailureStates": {
            "FailByLessThan5": "Item fine, no improvement; retry in 24 hours",
            "FailBy5To10": "1 Scar (Item Damage); must repair before retry",
            "FailByMoreThan10": "Maximum Item Damage without destruction; takes 2x time to repair",
            "CritFail": "Item destroyed",
        },
    },
}

ARMOR_EXAMPLES: List[Dict[str, Any]] = [
    # Tech Level 0
    {"name": "Padded Armor", "tech_level": 0, "level": 1, "ac_bonus": 1, "dr": "0", "max_dex_bonus": 8, "proficiency_level": 2, "speed_diff": "Normal", "weight": "15 lbs", "weight_lbs": 15.0, "cost": "$150", "procure_diff": 1, "masterworked": "-", "customization": "0 / 0 / 0(1)", "bonus_attributes": "Archaic"},
    {"name": "Leather Armor", "tech_level": 0, "level": 2, "ac_bonus": 2, "dr": "0", "max_dex_bonus": 7, "proficiency_level": 3, "speed_diff": "-5 ft", "weight": "20 lbs", "weight_lbs": 20.0, "cost": "$350", "procure_diff": 1, "masterworked": "-", "customization": "0 / 0 / 0(1)", "bonus_attributes": "Archaic"},
    {"name": "Mstr Leather Armor", "tech_level": 0, "level": 2, "ac_bonus": 2, "dr": "2 DR (K)", "max_dex_bonus": 7, "proficiency_level": 3, "speed_diff": "-5ft", "weight": "20 lbs", "weight_lbs": 20.0, "cost": "$1,050", "procure_diff": 2, "masterworked": "1/+1P", "customization": "0 / 1 / 1(1)", "bonus_attributes": "Archaic"},
    {"name": "Studded Leather", "tech_level": 0, "level": 3, "ac_bonus": 2, "dr": "2 DR (K)", "max_dex_bonus": 5, "proficiency_level": 4, "speed_diff": "-5ft", "weight": "25 lbs", "weight_lbs": 25.0, "cost": "$1,000", "procure_diff": 1, "masterworked": "-", "customization": "0 / 0 / 0(1)", "bonus_attributes": "Archaic"},
    {"name": "Wooden", "tech_level": 0, "level": 3, "ac_bonus": 3, "dr": "0", "max_dex_bonus": 6, "proficiency_level": 4, "speed_diff": "-10ft", "weight": "30 lbs", "weight_lbs": 30.0, "cost": "$2,000", "procure_diff": 1, "masterworked": "-", "customization": "2 / 1 / 1(1)", "bonus_attributes": "Archaic, Protection Against Grapple +4"},
    {"name": "Chain Armor", "tech_level": 0, "level": 4, "ac_bonus": 4, "dr": "0", "max_dex_bonus": 5, "proficiency_level": 5, "speed_diff": "-10ft", "weight": "30 lbs", "weight_lbs": 30.0, "cost": "$2,200", "procure_diff": 1, "masterworked": "-", "customization": "0 / 0 / 0(1)", "bonus_attributes": "Archaic"},
    {"name": "Full Plate", "tech_level": 0, "level": 5, "ac_bonus": 5, "dr": "2 DR (K)", "max_dex_bonus": 4, "proficiency_level": 6, "speed_diff": "Halved", "weight": "40 lbs", "weight_lbs": 40.0, "cost": "$9,000", "procure_diff": 1, "masterworked": "-", "customization": "2 / 1 / 1(1)", "bonus_attributes": "Archaic, Clumsy"},
    {"name": "Mstr Full Plate", "tech_level": 0, "level": 5, "ac_bonus": 5, "dr": "2 DR (K)", "max_dex_bonus": 4, "proficiency_level": 6, "speed_diff": "-10ft", "weight": "35 lbs", "weight_lbs": 35.0, "cost": "$13,500", "procure_diff": 2, "masterworked": "1/+1P", "customization": "0 / 1 / 1(1)", "bonus_attributes": "Archaic"},

    # Tech Level 1
    {"name": "Gilly Suit", "tech_level": 1, "level": 0, "ac_bonus": 0, "dr": "0", "max_dex_bonus": 5, "proficiency_level": 2, "speed_diff": "Normal", "weight": "0.25 lbs", "weight_lbs": 0.25, "cost": "$85", "procure_diff": 0, "masterworked": "-", "customization": "2 / 1 / 1(2)", "bonus_attributes": "Stealth Assist +2"},
    {"name": "Basic Light Armor", "tech_level": 1, "level": 1, "ac_bonus": 1, "dr": "0", "max_dex_bonus": 8, "proficiency_level": 1, "speed_diff": "Normal", "weight": "10 lbs", "weight_lbs": 10.0, "cost": "$150", "procure_diff": 0, "masterworked": "-", "customization": "0 / 0 / 0(2)", "bonus_attributes": "-"},
    {"name": "Ballistic Vest", "tech_level": 1, "level": 1, "ac_bonus": 0, "dr": "1 DR (A)", "max_dex_bonus": 7, "proficiency_level": 2, "speed_diff": "Normal", "weight": "10 lbs", "weight_lbs": 10.0, "cost": "$350", "procure_diff": 0, "masterworked": "-", "customization": "0 / 0 / 0(2)", "bonus_attributes": "-"},
    {"name": "Hybrid Vest", "tech_level": 1, "level": 2, "ac_bonus": 1, "dr": "1 DR (A)", "max_dex_bonus": 7, "proficiency_level": 2, "speed_diff": "Normal", "weight": "15 lbs", "weight_lbs": 15.0, "cost": "$350", "procure_diff": 0, "masterworked": "-", "customization": "0 / 0 / 0(2)", "bonus_attributes": "-"},
    {"name": "Hazard Suit", "tech_level": 1, "level": 2, "ac_bonus": 1, "dr": "DR (3C, 1T)", "max_dex_bonus": 7, "proficiency_level": 2, "speed_diff": "Normal", "weight": "15 lbs", "weight_lbs": 15.0, "cost": "$350", "procure_diff": 0, "masterworked": "-", "customization": "0 / 0 / 0(2)", "bonus_attributes": "-"},
    {"name": "Kevlar Vest", "tech_level": 1, "level": 3, "ac_bonus": 2, "dr": "2 DR (K)", "max_dex_bonus": 6, "proficiency_level": 3, "speed_diff": "-5 ft", "weight": "20 lbs", "weight_lbs": 20.0, "cost": "$1,000", "procure_diff": 0, "masterworked": "-", "customization": "0 / 0 / 0(2)", "bonus_attributes": "-"},
    {"name": "Mstr Kevlar Vest", "tech_level": 1, "level": 3, "ac_bonus": 3, "dr": "1 DR (K)", "max_dex_bonus": 6, "proficiency_level": 3, "speed_diff": "-5 ft", "weight": "20 lbs", "weight_lbs": 20.0, "cost": "$3,000", "procure_diff": 1, "masterworked": "1/+1P", "customization": "0 / 1 / 1(2)", "bonus_attributes": "-"},
    {"name": "Plated Vest", "tech_level": 1, "level": 3, "ac_bonus": 3, "dr": "0", "max_dex_bonus": 6, "proficiency_level": 3, "speed_diff": "-5 ft", "weight": "20 lbs", "weight_lbs": 20.0, "cost": "$1,000", "procure_diff": 0, "masterworked": "-", "customization": "0 / 0 / 0(2)", "bonus_attributes": "-"},
    {"name": "Kevlar Body Armor", "tech_level": 1, "level": 4, "ac_bonus": 3, "dr": "2 DR (K)", "max_dex_bonus": 6, "proficiency_level": 3, "speed_diff": "-5 ft", "weight": "25 lbs", "weight_lbs": 25.0, "cost": "$2,200", "procure_diff": 0, "masterworked": "-", "customization": "0 / 0 / 0(2)", "bonus_attributes": "-"},
    {"name": "Tactical Body Armor", "tech_level": 1, "level": 4, "ac_bonus": 3, "dr": "0", "max_dex_bonus": 5, "proficiency_level": 4, "speed_diff": "-5 ft", "weight": "25 lbs", "weight_lbs": 25.0, "cost": "$4,400", "procure_diff": 0, "masterworked": "-", "customization": "2 / 1 / 1(2)", "bonus_attributes": "Quick Slot 1"},
    {"name": "Mstr Tactical Body Armor", "tech_level": 1, "level": 4, "ac_bonus": 4, "dr": "0", "max_dex_bonus": 5, "proficiency_level": 4, "speed_diff": "-5 ft", "weight": "25 lbs", "weight_lbs": 25.0, "cost": "$6,600", "procure_diff": 1, "masterworked": "1/+1P", "customization": "0 / 1 / 1(2)", "bonus_attributes": "Quick Slot 1"},
    {"name": "Full Riot Gear", "tech_level": 1, "level": 5, "ac_bonus": 5, "dr": "0", "max_dex_bonus": 4, "proficiency_level": 5, "speed_diff": "-10ft", "weight": "30 lbs", "weight_lbs": 30.0, "cost": "$4,500", "procure_diff": 0, "masterworked": "-", "customization": "0 / 0 / 0(2)", "bonus_attributes": "-"},
    {"name": "Full Plated Armor", "tech_level": 1, "level": 6, "ac_bonus": 6, "dr": "0", "max_dex_bonus": 3, "proficiency_level": 6, "speed_diff": "-10ft", "weight": "35 lbs", "weight_lbs": 35.0, "cost": "$9,000", "procure_diff": 1, "masterworked": "-", "customization": "0 / 0 / 0(2)", "bonus_attributes": "-"},

    # Tech Level 2
    {"name": "Improved Personal Vest", "tech_level": 2, "level": 1, "ac_bonus": 1, "dr": "0", "max_dex_bonus": 8, "proficiency_level": 2, "speed_diff": "Normal", "weight": "5 lbs", "weight_lbs": 5.0, "cost": "$1,050", "procure_diff": 1, "masterworked": "1/+1P", "customization": "0 / 2 / 1(3)", "bonus_attributes": "Shirt"},
    {"name": "Improved Light Armor", "tech_level": 2, "level": 2, "ac_bonus": 2, "dr": "0", "max_dex_bonus": 7, "proficiency_level": 2, "speed_diff": "Normal", "weight": "10 lbs", "weight_lbs": 10.0, "cost": "$600", "procure_diff": 0, "masterworked": "-", "customization": "0 / 0 / 0(3)", "bonus_attributes": "-"},
    {"name": "Improved Hazard Suit", "tech_level": 2, "level": 2, "ac_bonus": 1, "dr": "DR (4C, 2T)", "max_dex_bonus": 7, "proficiency_level": 2, "speed_diff": "Normal", "weight": "10 lbs", "weight_lbs": 10.0, "cost": "$1,200", "procure_diff": 0, "masterworked": "-", "customization": "0 / 1 / 1(3)", "bonus_attributes": "-"},
    {"name": "Improved Ballistic Vest", "tech_level": 2, "level": 3, "ac_bonus": 1, "dr": "2 DR (A)", "max_dex_bonus": 6, "proficiency_level": 3, "speed_diff": "Normal", "weight": "15 lbs", "weight_lbs": 15.0, "cost": "$1,250", "procure_diff": 0, "masterworked": "-", "customization": "0 / 0 / 0(3)", "bonus_attributes": "-"},
    {"name": "Stealth Suit", "tech_level": 2, "level": 3, "ac_bonus": 2, "dr": "4 DR (T)", "max_dex_bonus": 6, "proficiency_level": 3, "speed_diff": "Normal", "weight": "15 lbs", "weight_lbs": 15.0, "cost": "$2,500", "procure_diff": 0, "masterworked": "-", "customization": "0 / 1 / 1(3)", "bonus_attributes": "Stealth Assist +2"},
    {"name": "Mstr Stealth Suit", "tech_level": 2, "level": 3, "ac_bonus": 3, "dr": "4 DR (T)", "max_dex_bonus": 6, "proficiency_level": 3, "speed_diff": "Normal", "weight": "15 lbs", "weight_lbs": 15.0, "cost": "$7,500", "procure_diff": 1, "masterworked": "2/+2P", "customization": "0 / 3 / 3(3)", "bonus_attributes": "Stealth Assist +4"},
    {"name": "Basic Regeneration Suit", "tech_level": 2, "level": 4, "ac_bonus": 3, "dr": "0", "max_dex_bonus": 6, "proficiency_level": 4, "speed_diff": "-5ft", "weight": "20 lbs", "weight_lbs": 20.0, "cost": "$7,450", "procure_diff": 1, "masterworked": "-", "customization": "0 / 1 / 1(3)", "bonus_attributes": "Regeneration +2"},
    {"name": "Improved Tactical Body Armor", "tech_level": 2, "level": 4, "ac_bonus": 4, "dr": "0", "max_dex_bonus": 5, "proficiency_level": 4, "speed_diff": "-5 ft", "weight": "20 lbs", "weight_lbs": 20.0, "cost": "$4,900", "procure_diff": 0, "masterworked": "-", "customization": "0 / 1 / 1(3)", "bonus_attributes": "Quick Slot 2"},
    {"name": "Mounted Medium Armor", "tech_level": 2, "level": 4, "ac_bonus": 3, "dr": "0", "max_dex_bonus": 5, "proficiency_level": 4, "speed_diff": "-10ft", "weight": "35 lbs", "weight_lbs": 35.0, "cost": "$9,800", "procure_diff": 0, "masterworked": "-", "customization": "4 / 3 / 1(3)", "bonus_attributes": "Weapon Mount (Small)"},
    {"name": "Improved Medium Armor", "tech_level": 2, "level": 5, "ac_bonus": 5, "dr": "0", "max_dex_bonus": 4, "proficiency_level": 5, "speed_diff": "-5ft", "weight": "25 lbs", "weight_lbs": 25.0, "cost": "$4,750", "procure_diff": 0, "masterworked": "-", "customization": "0 / 0 / 0(3)", "bonus_attributes": "-"},
    {"name": "Improved Hybrid Vest", "tech_level": 2, "level": 5, "ac_bonus": 2, "dr": "3 DR (A)", "max_dex_bonus": 4, "proficiency_level": 5, "speed_diff": "-5ft", "weight": "25 lbs", "weight_lbs": 25.0, "cost": "$4,750", "procure_diff": 0, "masterworked": "-", "customization": "0 / 0 / 0(3)", "bonus_attributes": "-"},
    {"name": "Grounded Armor", "tech_level": 2, "level": 5, "ac_bonus": 3, "dr": "8 DR (E)", "max_dex_bonus": 4, "proficiency_level": 5, "speed_diff": "-5ft", "weight": "25 lbs", "weight_lbs": 25.0, "cost": "$4,750", "procure_diff": 0, "masterworked": "-", "customization": "0 / 0 / 0(3)", "bonus_attributes": "-"},
    {"name": "Thermal Plated Armor", "tech_level": 2, "level": 6, "ac_bonus": 4, "dr": "8 DR (T)", "max_dex_bonus": 3, "proficiency_level": 6, "speed_diff": "-10ft", "weight": "30 lbs", "weight_lbs": 30.0, "cost": "$9,250", "procure_diff": 1, "masterworked": "-", "customization": "0 / 0 / 0(3)", "bonus_attributes": "-"},
    {"name": "Hybrid Tactical Armor", "tech_level": 2, "level": 6, "ac_bonus": 2, "dr": "4 DR (A)", "max_dex_bonus": 3, "proficiency_level": 6, "speed_diff": "-10ft", "weight": "30 lbs", "weight_lbs": 30.0, "cost": "$18,500", "procure_diff": 1, "masterworked": "-", "customization": "0 / 1 / 1(3)", "bonus_attributes": "Quick Slot 2"},
    {"name": "Enhanced Steel Plating", "tech_level": 2, "level": 7, "ac_bonus": 6, "dr": "2 DR (K)", "max_dex_bonus": 3, "proficiency_level": 7, "speed_diff": "-10ft", "weight": "35 lbs", "weight_lbs": 35.0, "cost": "$18,250", "procure_diff": 1, "masterworked": "-", "customization": "0 / 0 / 0(3)", "bonus_attributes": "-"},
    {"name": "Improved Heavy Armor", "tech_level": 2, "level": 7, "ac_bonus": 7, "dr": "0", "max_dex_bonus": 2, "proficiency_level": 7, "speed_diff": "-10ft", "weight": "35 lbs", "weight_lbs": 35.0, "cost": "$18,250", "procure_diff": 1, "masterworked": "-", "customization": "0 / 0 / 0(3)", "bonus_attributes": "-"},
    {"name": "Mstr Improved Heavy Armor", "tech_level": 2, "level": 7, "ac_bonus": 7, "dr": "0", "max_dex_bonus": 2, "proficiency_level": 7, "speed_diff": "-5ft", "weight": "25 lbs", "weight_lbs": 25.0, "cost": "$73,000", "procure_diff": 2, "masterworked": "1/+1P", "customization": "0 / 2 / 2(3)", "bonus_attributes": "-"},
    {"name": "Full Printed Steel", "tech_level": 2, "level": 7, "ac_bonus": 5, "dr": "2 DR (A)", "max_dex_bonus": 2, "proficiency_level": 7, "speed_diff": "-10ft", "weight": "35 lbs", "weight_lbs": 35.0, "cost": "$18,250", "procure_diff": 1, "masterworked": "-", "customization": "0 / 0 / 0(3)", "bonus_attributes": "-"},

    # Tech Level 3
    {"name": "Nano Mesh Shirt", "tech_level": 3, "level": 0, "ac_bonus": 0, "dr": "1 DR (A)", "max_dex_bonus": 9, "proficiency_level": 0, "speed_diff": "Normal", "weight": "1 lbs", "weight_lbs": 1.0, "cost": "$3,030", "procure_diff": 1, "masterworked": "-", "customization": "0 / 2 / 2(4)", "bonus_attributes": "Shirt"},
    {"name": "Mstr Nano Mesh Shirt", "tech_level": 3, "level": 1, "ac_bonus": 1, "dr": "1 DR (A)", "max_dex_bonus": 8, "proficiency_level": 1, "speed_diff": "Normal", "weight": "1 lbs", "weight_lbs": 1.0, "cost": "$8,050", "procure_diff": 2, "masterworked": "2/+2P", "customization": "0 / 4 / 3(4)", "bonus_attributes": "Shirt"},
    {"name": "Advanced Personal Vest", "tech_level": 3, "level": 1, "ac_bonus": 1, "dr": "0", "max_dex_bonus": 8, "proficiency_level": 0, "speed_diff": "Normal", "weight": "1 lbs", "weight_lbs": 1.0, "cost": "$3,450", "procure_diff": 1, "masterworked": "-", "customization": "0 / 2 / 1(4)", "bonus_attributes": "Shirt"},
    {"name": "Advanced Light Armor", "tech_level": 3, "level": 2, "ac_bonus": 2, "dr": "0", "max_dex_bonus": 7, "proficiency_level": 2, "speed_diff": "Normal", "weight": "5 lbs", "weight_lbs": 5.0, "cost": "$1,350", "procure_diff": 1, "masterworked": "-", "customization": "0 / 0 / 0(4)", "bonus_attributes": "-"},
    {"name": "Mstr Advanced Light Armor", "tech_level": 3, "level": 2, "ac_bonus": 2, "dr": "1 DR (A)", "max_dex_bonus": 7, "proficiency_level": 2, "speed_diff": "Normal", "weight": "5 lbs", "weight_lbs": 5.0, "cost": "$6,750", "procure_diff": 2, "masterworked": "1/+1P", "customization": "0 / 3 / 2(4)", "bonus_attributes": "Protection Against Grapple +4"},
    {"name": "Stealth Shirt", "tech_level": 3, "level": 2, "ac_bonus": 1, "dr": "0", "max_dex_bonus": 7, "proficiency_level": 2, "speed_diff": "Normal", "weight": "5 lbs", "weight_lbs": 5.0, "cost": "$4,050", "procure_diff": 1, "masterworked": "-", "customization": "2 / 3 / 2(4)", "bonus_attributes": "Shirt, Stealth Assist +2"},
    {"name": "Advanced Hazard Suit", "tech_level": 3, "level": 3, "ac_bonus": 1, "dr": "DR (6C, 2T)", "max_dex_bonus": 6, "proficiency_level": 3, "speed_diff": "Normal", "weight": "10 lbs", "weight_lbs": 10.0, "cost": "$2,000", "procure_diff": 1, "masterworked": "-", "customization": "0 / 0 / 0(4)", "bonus_attributes": "-"},
    {"name": "Nano Mesh Regen", "tech_level": 3, "level": 3, "ac_bonus": 1, "dr": "0", "max_dex_bonus": 7, "proficiency_level": 3, "speed_diff": "Normal", "weight": "10 lbs", "weight_lbs": 10.0, "cost": "$10,000", "procure_diff": 2, "masterworked": "-", "customization": "0 / 2 / 2(4)", "bonus_attributes": "Regeneration +6"},
    {"name": "Responsive Armor", "tech_level": 3, "level": 3, "ac_bonus": 3, "dr": "0", "max_dex_bonus": 6, "proficiency_level": 3, "speed_diff": "Normal", "weight": "10 lbs", "weight_lbs": 10.0, "cost": "$6,000", "procure_diff": 1, "masterworked": "-", "customization": "0 / 2 / 2(4)", "bonus_attributes": "Protection Against Trip +6"},
    {"name": "Advanced Ballistic Vest", "tech_level": 3, "level": 4, "ac_bonus": 0, "dr": "4 DR (A)", "max_dex_bonus": 5, "proficiency_level": 4, "speed_diff": "Normal", "weight": "15 lbs", "weight_lbs": 15.0, "cost": "$3,200", "procure_diff": 0, "masterworked": "-", "customization": "0 / 0 / 0(4)", "bonus_attributes": "-"},
    {"name": "Advanced Tactical Body Armor", "tech_level": 3, "level": 4, "ac_bonus": 4, "dr": "1 DR (K)", "max_dex_bonus": 5, "proficiency_level": 4, "speed_diff": "-5 ft", "weight": "25 lbs", "weight_lbs": 25.0, "cost": "$9,600", "procure_diff": 0, "masterworked": "-", "customization": "0 / 2 / 2(4)", "bonus_attributes": "Quick Slot 3"},
    {"name": "Advanced Mounted Armor", "tech_level": 3, "level": 5, "ac_bonus": 4, "dr": "0", "max_dex_bonus": 4, "proficiency_level": 5, "speed_diff": "-5ft", "weight": "25 lbs", "weight_lbs": 25.0, "cost": "$22,000", "procure_diff": 1, "masterworked": "-", "customization": "2 / 3 / 1(4)", "bonus_attributes": "Weapon Mount (Small)"},
    {"name": "Advanced Medium Armor", "tech_level": 3, "level": 5, "ac_bonus": 5, "dr": "0", "max_dex_bonus": 4, "proficiency_level": 5, "speed_diff": "-5ft", "weight": "20 lbs", "weight_lbs": 20.0, "cost": "$5,500", "procure_diff": 1, "masterworked": "-", "customization": "0 / 0 / 0(4)", "bonus_attributes": "-"},
    {"name": "Regeneration Suit", "tech_level": 3, "level": 6, "ac_bonus": 6, "dr": "0", "max_dex_bonus": 3, "proficiency_level": 6, "speed_diff": "-5ft", "weight": "25 lbs", "weight_lbs": 25.0, "cost": "$50,000", "procure_diff": 2, "masterworked": "-", "customization": "0 / 2 / 2(4)", "bonus_attributes": "Regeneration +6"},
    {"name": "Shielded Suit", "tech_level": 3, "level": 6, "ac_bonus": 1, "dr": "5 DR (A)", "max_dex_bonus": 3, "proficiency_level": 6, "speed_diff": "-5ft", "weight": "25 lbs", "weight_lbs": 25.0, "cost": "$10,000", "procure_diff": 1, "masterworked": "-", "customization": "0 / 0 / 0(4)", "bonus_attributes": "-"},
    {"name": "Advanced Hybrid Vest", "tech_level": 3, "level": 7, "ac_bonus": 3, "dr": "4 DR (A)", "max_dex_bonus": 2, "proficiency_level": 7, "speed_diff": "-10ft", "weight": "30 lbs", "weight_lbs": 30.0, "cost": "$19,000", "procure_diff": 2, "masterworked": "-", "customization": "0 / 0 / 0(4)", "bonus_attributes": "-"},
    {"name": "Advanced Heavy Armor", "tech_level": 3, "level": 7, "ac_bonus": 7, "dr": "0", "max_dex_bonus": 2, "proficiency_level": 7, "speed_diff": "-5ft", "weight": "25 lbs", "weight_lbs": 25.0, "cost": "$38,000", "procure_diff": 2, "masterworked": "-", "customization": "0 / 1 / 1(4)", "bonus_attributes": "-"},
    {"name": "Shielded Hybrid Plating", "tech_level": 3, "level": 8, "ac_bonus": 4, "dr": "4 DR (A)", "max_dex_bonus": 1, "proficiency_level": 8, "speed_diff": "-10ft", "weight": "35 lbs", "weight_lbs": 35.0, "cost": "$31,000", "procure_diff": 2, "masterworked": "-", "customization": "0 / 0 / 0(4)", "bonus_attributes": "-"},
    {"name": "Full Nano-Mesh Shielded Suit", "tech_level": 3, "level": 8, "ac_bonus": 8, "dr": "1 DR (A)", "max_dex_bonus": 1, "proficiency_level": 8, "speed_diff": "-10ft", "weight": "35 lbs", "weight_lbs": 35.0, "cost": "$93,000", "procure_diff": 3, "masterworked": "-", "customization": "0 / 2 / 1(4)", "bonus_attributes": "-"},

    # Tech Level 4
    {"name": "Cloak Suit", "tech_level": 4, "level": 0, "ac_bonus": 0, "dr": "0", "max_dex_bonus": 8, "proficiency_level": 0, "speed_diff": "Normal", "weight": "0.25 lbs", "weight_lbs": 0.25, "cost": "$9,030", "procure_diff": 1, "masterworked": "-", "customization": "0 / 3 / 3(5)", "bonus_attributes": "Shirt, Stealth Assist +6"},
    {"name": "High Tech Personal Vest", "tech_level": 4, "level": 1, "ac_bonus": 1, "dr": "1 DR (K)", "max_dex_bonus": 8, "proficiency_level": 1, "speed_diff": "Normal", "weight": "1 lbs", "weight_lbs": 1.0, "cost": "$9,450", "procure_diff": 1, "masterworked": "-", "customization": "0 / 3 / 2(5)", "bonus_attributes": "Shirt"},
    {"name": "Superior Hazard Suit", "tech_level": 4, "level": 2, "ac_bonus": 1, "dr": "DR (10C, 6T)", "max_dex_bonus": 7, "proficiency_level": 2, "speed_diff": "Normal", "weight": "1 lbs", "weight_lbs": 1.0, "cost": "$10,050", "procure_diff": 1, "masterworked": "-", "customization": "0 / 2 / 2(5)", "bonus_attributes": "-"},
    {"name": "Superior Shield Suit", "tech_level": 4, "level": 3, "ac_bonus": 0, "dr": "DR (4A, 1K)", "max_dex_bonus": 6, "proficiency_level": 3, "speed_diff": "Normal", "weight": "5 lbs", "weight_lbs": 5.0, "cost": "$12,000", "procure_diff": 1, "masterworked": "-", "customization": "0 / 3 / 2(5)", "bonus_attributes": "-"},
    {"name": "Superior Tactical Body Armor", "tech_level": 4, "level": 4, "ac_bonus": 4, "dr": "2 DR (K)", "max_dex_bonus": 5, "proficiency_level": 4, "speed_diff": "Normal", "weight": "10 lbs", "weight_lbs": 10.0, "cost": "$15,600", "procure_diff": 1, "masterworked": "-", "customization": "0 / 3 / 3(5)", "bonus_attributes": "Quick Slot 4"},
    {"name": "Hyper Reactive Regen Shirt", "tech_level": 4, "level": 4, "ac_bonus": 2, "dr": "1 DR (K)", "max_dex_bonus": 6, "proficiency_level": 4, "speed_diff": "Normal", "weight": "10 Lbs", "weight_lbs": 10.0, "cost": "$36,400", "procure_diff": 2, "masterworked": "-", "customization": "4 / 4 / 3(5)", "bonus_attributes": "Regeneration +8"},
    {"name": "Superior Ballistic Vest", "tech_level": 4, "level": 5, "ac_bonus": 0, "dr": "5 DR (A)", "max_dex_bonus": 4, "proficiency_level": 5, "speed_diff": "Normal", "weight": "15 lbs", "weight_lbs": 15.0, "cost": "$9,500", "procure_diff": 1, "masterworked": "-", "customization": "0 / 0 / 0(5)", "bonus_attributes": "-"},
    {"name": "Superior Mounted Armor", "tech_level": 4, "level": 6, "ac_bonus": 6, "dr": "0", "max_dex_bonus": 3, "proficiency_level": 6, "speed_diff": "-5ft", "weight": "20 lbs", "weight_lbs": 20.0, "cost": "$48,000", "procure_diff": 2, "masterworked": "-", "customization": "0 / 3 / 1(5)", "bonus_attributes": "Weapon Mount (Small)"},
    {"name": "Superior Full Body Armor", "tech_level": 4, "level": 7, "ac_bonus": 6, "dr": "2 DR (K)", "max_dex_bonus": 3, "proficiency_level": 7, "speed_diff": "-5ft", "weight": "25 lbs", "weight_lbs": 25.0, "cost": "$63,000", "procure_diff": 2, "masterworked": "-", "customization": "0 / 3 / 2(5)", "bonus_attributes": "-"},
    {"name": "Superior Hybrid Vest", "tech_level": 4, "level": 9, "ac_bonus": 4, "dr": "5 DR (A)", "max_dex_bonus": 0, "proficiency_level": 9, "speed_diff": "-10ft", "weight": "35 lbs", "weight_lbs": 35.0, "cost": "$58,000", "procure_diff": 2, "masterworked": "-", "customization": "0 / 0 / 0(5)", "bonus_attributes": "-"},
    {"name": "Enhanced Shielded Hybrid Plating", "tech_level": 4, "level": 9, "ac_bonus": 7, "dr": "DR (2A, 2E)", "max_dex_bonus": 1, "proficiency_level": 9, "speed_diff": "-10ft", "weight": "35 lbs", "weight_lbs": 35.0, "cost": "$232,000", "procure_diff": 3, "masterworked": "-", "customization": "0 / 3 / 2(5)", "bonus_attributes": "-"},
    {"name": "Full Infinity Armor", "tech_level": 4, "level": 9, "ac_bonus": 9, "dr": "1 DR (A)", "max_dex_bonus": 1, "proficiency_level": 9, "speed_diff": "Halved", "weight": "40 lbs", "weight_lbs": 40.0, "cost": "$290,000", "procure_diff": 3, "masterworked": "-", "customization": "2 / 4 / 2(5)", "bonus_attributes": "-"},
    {"name": "Mstr Full Infinity Armor", "tech_level": 4, "level": 9, "ac_bonus": 9, "dr": "DR (1A, 1C,E,T)", "max_dex_bonus": 1, "proficiency_level": 9, "speed_diff": "Halved", "weight": "40 lbs", "weight_lbs": 40.0, "cost": "$812,000", "procure_diff": 4, "masterworked": "5/+4P,+1P", "customization": "2 / 8 / 5(5+1)", "bonus_attributes": "Regeneration +12"},
]


def init_armor_reference_tables(db_conn=None):
    """
    Initializes armor reference tables in the database if they do not exist.
    """
    if db_conn is None:
        db_conn = get_reference_db()
    if db_conn is None:
        return None

    tables_data = {
        "armor_baseline": ARMOR_BASELINE_LIST,
        "armor_tech_levels": TECH_LEVEL_LIST,
        "armor_special_attributes": ARMOR_SPECIAL_ATTRIBUTES,
        "armor_customization_attributes": [ARMOR_CUSTOMIZATION_ATTRIBUTES],
        "armor_crafting_rules": [ARMOR_CRAFTING_RULES],
        "armor_examples": ARMOR_EXAMPLES,
    }

    for table_name, data in tables_data.items():
        try:
            existing = list(db_conn.find(collection=table_name))
            if not existing:
                db_conn.insertMany(data, collection=table_name)
        except Exception as e:
            log.error(f"Error initializing armor table {table_name}: {e}")

    return db_conn
