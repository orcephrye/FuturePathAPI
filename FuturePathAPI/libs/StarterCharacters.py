#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 08/07/2026
# Description: Pydantic schemas and database seeding for d20 FuturePath starter characters.

import logging
from typing import Any, Dict, List, Optional, Union

from pydantic import BaseModel, ConfigDict, Field

from FuturePathAPI.libs import DBConnection, loadYamlDBConfig

log = logging.getLogger("StarterCharacters")


# ==============================================================================
# Pydantic Schemas for d20 FuturePath Character Sheet JSON Export/Import
# ==============================================================================

class IdentityCard(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    charName: Optional[str] = None
    playerName: Optional[str] = None
    species: Optional[str] = None
    charPath: Optional[str] = None
    pathLevel: Optional[Union[int, str]] = None
    classList: Optional[str] = None
    alignment: Optional[str] = None
    charSize: Optional[str] = None
    gender: Optional[str] = None
    height: Optional[str] = None
    hairColor: Optional[str] = None
    eyeColor: Optional[str] = None


class AbilityScoresCard(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    scoreSTR: Optional[Union[int, str]] = None
    scoreDEX: Optional[Union[int, str]] = None
    scoreCON: Optional[Union[int, str]] = None
    scoreINT: Optional[Union[int, str]] = None
    scoreWIS: Optional[Union[int, str]] = None
    scoreCHA: Optional[Union[int, str]] = None
    modSTR: Optional[Union[int, str]] = None
    modDEX: Optional[Union[int, str]] = None
    modCON: Optional[Union[int, str]] = None
    modINT: Optional[Union[int, str]] = None
    modWIS: Optional[Union[int, str]] = None
    modCHA: Optional[Union[int, str]] = None
    primaryAbility_STR: Optional[bool] = False
    primaryAbility_DEX: Optional[bool] = False
    primaryAbility_CON: Optional[bool] = False
    primaryAbility_INT: Optional[bool] = False
    primaryAbility_WIS: Optional[bool] = False
    primaryAbility_CHA: Optional[bool] = False


class HealthInjuryCard(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    hitDie: Optional[str] = None
    maxHP: Optional[Union[int, str]] = None
    tempHP: Optional[Union[int, str]] = None
    currentHP: Optional[Union[int, str]] = None
    nonlethalHP: Optional[Union[int, str]] = None


class AttributesCard(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    advantageDie: Optional[str] = None
    initiative: Optional[Union[int, str]] = None
    inertia: Optional[Union[int, str]] = None
    passivePerception: Optional[Union[int, str]] = None
    techProfCount: Optional[int] = 0


class SkillItem(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    Name: str
    Favored: Optional[bool] = False
    Rank: Optional[Union[int, str]] = 0
    KeyAbility: Optional[str] = Field(default="-", alias="Key Ability")
    MiscMod: Optional[Union[int, str]] = 0


class CoreSkillsCard(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    skillsPerLevel: Optional[Union[int, str]] = "0"
    unusedSkillPoints: Optional[Union[int, str]] = "0"
    skillsList: List[SkillItem] = Field(default_factory=list)


class NamedDescItem(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    Name: str
    Description: Optional[str] = ""


class SpeciesTraitsCard(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    speciesTraitsList: List[NamedDescItem] = Field(default_factory=list)


class PathTalentsCard(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    pathTalentsList: List[NamedDescItem] = Field(default_factory=list)


class FeatsCard(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    featsList: List[NamedDescItem] = Field(default_factory=list)


class ArmorItem(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    Name: str
    ACBonus: Optional[str] = Field(default="", alias="AC Bonus")
    MaxDex: Optional[str] = Field(default="", alias="Max Dex")
    SpeedPenalty: Optional[str] = Field(default="", alias="Speed Penalty")
    BonusAttributes: Optional[str] = Field(default="", alias="Bonus Attributes")


class ArmorDefensesCard(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    armorProfCount: Optional[int] = 0
    armorsList: List[ArmorItem] = Field(default_factory=list)


class WeaponItem(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    Name: str
    Damage: Optional[str] = ""
    Accuracy: Optional[str] = ""
    AP: Optional[str] = ""
    Critical: Optional[str] = ""
    Type: Optional[str] = ""
    Range: Optional[str] = ""
    Ammo: Optional[str] = ""
    Notes: Optional[str] = ""


class WeaponsCard(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    meleeProfCount: Optional[int] = 0
    rangedProfCount: Optional[int] = 0
    weaponsList: List[WeaponItem] = Field(default_factory=list)


class EquipmentItem(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    Name: str
    Qty: Optional[Union[int, str]] = "1"
    Weight: Optional[Union[float, str]] = ""
    TL: Optional[str] = ""
    Notes: Optional[str] = ""


class EquipmentCard(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    itemCraftProfCount: Optional[int] = 0
    totalGearWeight: Optional[Union[float, str]] = "0"
    equipmentList: List[EquipmentItem] = Field(default_factory=list)


class ProfessionBlock(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    Title: str
    Level: Optional[Union[int, str]] = ""
    Affinities: List[str] = Field(default_factory=list)
    Talents: List[NamedDescItem] = Field(default_factory=list)


class TechniqueItem(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    Name: str
    Range: Optional[str] = ""
    Effect: Optional[str] = ""


class TechniqueBlock(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    Level: Optional[Union[int, str]] = ""
    Profession: Optional[str] = ""
    DC: Optional[Union[int, str]] = ""
    Learned: Optional[Union[int, str]] = ""
    Uses: Optional[Union[int, str]] = ""
    Used: Optional[Union[int, str]] = ""
    Techniques: List[TechniqueItem] = Field(default_factory=list)


class PowerArmorMod(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    Name: str
    Description: Optional[str] = ""


class PowerArmorBlock(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    Type: str
    Class: Optional[str] = ""
    Mods: List[PowerArmorMod] = Field(default_factory=list)


class PowerArmorCard(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    powerArmorProfCount: Optional[int] = 0
    powerArmorList: List[PowerArmorBlock] = Field(default_factory=list)


class UILayout(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    theme: Optional[str] = "cosmic-dark"
    layoutLocked: Optional[bool] = True


class CharacterSheetSchema(BaseModel):
    """
    Root Pydantic Model for validating d20 FuturePath character sheets.
    """
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    id: str
    character_id: Optional[str] = None
    identityCard: Optional[IdentityCard] = Field(default_factory=IdentityCard)
    abilityScoresCard: Optional[AbilityScoresCard] = Field(default_factory=AbilityScoresCard)
    healthInjuryCard: Optional[HealthInjuryCard] = Field(default_factory=HealthInjuryCard)
    attributesCard: Optional[AttributesCard] = Field(default_factory=AttributesCard)
    coreSkills: Optional[CoreSkillsCard] = Field(default_factory=CoreSkillsCard)
    speciesTraitsCard: Optional[SpeciesTraitsCard] = Field(default_factory=SpeciesTraitsCard)
    pathTalentsCard: Optional[PathTalentsCard] = Field(default_factory=PathTalentsCard)
    featsCard: Optional[FeatsCard] = Field(default_factory=FeatsCard)
    armorDefensesCard: Optional[ArmorDefensesCard] = Field(default_factory=ArmorDefensesCard)
    weaponsCard: Optional[WeaponsCard] = Field(default_factory=WeaponsCard)
    equipmentCard: Optional[EquipmentCard] = Field(default_factory=EquipmentCard)
    professionsCard: Optional[List[ProfessionBlock]] = Field(default_factory=list)
    techniquesCard: Optional[List[TechniqueBlock]] = Field(default_factory=list)
    powerArmorCard: Optional[PowerArmorCard] = Field(default_factory=PowerArmorCard)
    languageCustomSkillsCard: Optional[List[SkillItem]] = Field(default_factory=list)
    UI_Layout: Optional[UILayout] = Field(default_factory=UILayout)


# ==============================================================================
# Official Starter Characters Dataset Built via Pydantic Schemas
# ==============================================================================

OFFICIAL_STARTER_CHARACTERS: List[CharacterSheetSchema] = [
    CharacterSheetSchema.model_validate({
        "id": "beckett_kane",
        "character_id": "beckett_kane",
        "identityCard": {
            "charName": "Beckett Kane",
            "playerName": "Starter Character",
            "species": "Humans",
            "charPath": "Path of Strength (Strong Hero)",
            "pathLevel": 1,
            "classList": "Space Marine (1)",
            "alignment": "Mercenary Contractor",
            "charSize": "Medium",
            "gender": "Male",
            "height": "6'1\"",
            "hairColor": "Brown",
            "eyeColor": "Hazel"
        },
        "abilityScoresCard": {
            "scoreSTR": 16, "modSTR": "+3", "primaryAbility_STR": True,
            "scoreDEX": 13, "modDEX": "+1",
            "scoreCON": 14, "modCON": "+2",
            "scoreINT": 10, "modINT": "+0",
            "scoreWIS": 12, "modWIS": "+1",
            "scoreCHA": 8,  "modCHA": "-1"
        },
        "healthInjuryCard": {
            "hitDie": "d10",
            "maxHP": 12,
            "currentHP": 12,
            "tempHP": 0,
            "nonlethalHP": 0
        },
        "attributesCard": {
            "advantageDie": "d4",
            "initiative": "+1",
            "inertia": 10,
            "passivePerception": 11,
            "techProfCount": 1
        },
        "coreSkills": {
            "skillsPerLevel": "3",
            "unusedSkillPoints": "0",
            "skillsList": [
                {"Name": "Athletics", "Favored": True, "Rank": 1, "Key Ability": "STR", "MiscMod": 0},
                {"Name": "Intimidate", "Favored": False, "Rank": 1, "Key Ability": "CHA", "MiscMod": 0},
                {"Name": "Survival", "Favored": False, "Rank": 1, "Key Ability": "WIS", "MiscMod": 0}
            ]
        },
        "speciesTraitsCard": {
            "speciesTraitsList": [
                {"Name": "Adaptable", "Description": "Gain +1 extra skill point at level 1 and +1 bonus feat."}
            ]
        },
        "pathTalentsCard": {
            "pathTalentsList": [
                {"Name": "Extreme Effort", "Description": "+2 bonus on physical checks involving brute force."}
            ]
        },
        "featsCard": {
            "featsList": [
                {"Name": "Personal Firearms Proficiency", "Description": "Proficient with personal ranged energy/ballistic firearms."},
                {"Name": "Armor Proficiency (Medium)", "Description": "No armor penalty to physical defense checks when wearing medium armor."}
            ]
        },
        "armorDefensesCard": {
            "armorProfCount": 2,
            "armorsList": [
                {"Name": "Tactical Marine Vest", "AC Bonus": "+4", "Max Dex": "+3", "Speed Penalty": "-5 ft", "Bonus Attributes": "Ballistic & Energy resistance"}
            ]
        },
        "weaponsCard": {
            "meleeProfCount": 2,
            "rangedProfCount": 2,
            "weaponsList": [
                {"Name": "Heavy Pulse Rifle", "Damage": "2d8", "Accuracy": "+4", "AP": "2", "Critical": "20/x2", "Type": "Energy", "Range": "80 ft", "Ammo": "30", "Notes": "Standard issue PMC rifle"},
                {"Name": "Tactical Combat Knife", "Damage": "1d4+3", "Accuracy": "+4", "AP": "0", "Critical": "19-20/x2", "Type": "Piercing", "Range": "Melee", "Ammo": "-", "Notes": "Titanium blade"}
            ]
        },
        "equipmentCard": {
            "itemCraftProfCount": 1,
            "totalGearWeight": "24",
            "equipmentList": [
                {"Name": "Field Medkit", "Qty": "1", "Weight": "3", "TL": "5", "Notes": "Restores 1d8 HP"},
                {"Name": "Comlink (Earbud)", "Qty": "1", "Weight": "0.1", "TL": "6", "Notes": "Encrypted long range"},
                {"Name": "Rations (5 days)", "Qty": "5", "Weight": "5", "TL": "4", "Notes": "Standard military paste"}
            ]
        },
        "UI_Layout": {
            "theme": "cosmic-dark",
            "layoutLocked": True
        }
    }),
    CharacterSheetSchema.model_validate({
        "id": "marara_sylavan",
        "character_id": "marara_sylavan",
        "identityCard": {
            "charName": "Marara Sylavan",
            "playerName": "Starter Character",
            "species": "Volar",
            "charPath": "Path of Wisdom (Dedicated Hero)",
            "pathLevel": 1,
            "classList": "Xenophile (1)",
            "alignment": "Botanical Institute / Field Researcher",
            "charSize": "Medium",
            "gender": "Female",
            "height": "5'7\"",
            "hairColor": "Leaf Green",
            "eyeColor": "Sea Blue"
        },
        "abilityScoresCard": {
            "scoreSTR": 10, "modSTR": "+0",
            "scoreDEX": 12, "modDEX": "+1",
            "scoreCON": 12, "modCON": "+1",
            "scoreINT": 14, "modINT": "+2",
            "scoreWIS": 16, "modWIS": "+3", "primaryAbility_WIS": True,
            "scoreCHA": 13, "modCHA": "+1"
        },
        "healthInjuryCard": {
            "hitDie": "d8",
            "maxHP": 9,
            "currentHP": 9,
            "tempHP": 0,
            "nonlethalHP": 0
        },
        "attributesCard": {
            "advantageDie": "d4",
            "initiative": "+1",
            "inertia": 10,
            "passivePerception": 15,
            "techProfCount": 2
        },
        "coreSkills": {
            "skillsPerLevel": "4",
            "unusedSkillPoints": "0",
            "skillsList": [
                {"Name": "Perception", "Favored": True, "Rank": 1, "Key Ability": "WIS", "MiscMod": 0},
                {"Name": "Treat Injury", "Favored": True, "Rank": 1, "Key Ability": "WIS", "MiscMod": 0},
                {"Name": "Knowledge (Earth & Life Sciences)", "Favored": False, "Rank": 1, "Key Ability": "INT", "MiscMod": 0},
                {"Name": "Survival", "Favored": False, "Rank": 1, "Key Ability": "WIS", "MiscMod": 0}
            ]
        },
        "speciesTraitsCard": {
            "speciesTraitsList": [
                {"Name": "Photosynthetic Skin", "Description": "Regenerates nonlethal damage faster under natural light."}
            ]
        },
        "pathTalentsCard": {
            "pathTalentsList": [
                {"Name": "Awareness", "Description": "Gain intuition and quick reaction to environmental hazards."}
            ]
        },
        "featsCard": {
            "featsList": [
                {"Name": "Xenobiology Specialist", "Description": "+2 bonus on Knowledge checks regarding alien lifeforms."}
            ]
        },
        "equipmentCard": {
            "itemCraftProfCount": 1,
            "totalGearWeight": "15",
            "equipmentList": [
                {"Name": "Bioscanner datapad", "Qty": "1", "Weight": "2", "TL": "6", "Notes": "Analyzes flora and fauna DNA"},
                {"Name": "Field Xenology Kit", "Qty": "1", "Weight": "5", "TL": "5", "Notes": "Specimen containers & reagents"}
            ]
        },
        "UI_Layout": {
            "theme": "emerald-matrix",
            "layoutLocked": True
        }
    }),
    CharacterSheetSchema.model_validate({
        "id": "cxaz_grayling",
        "character_id": "cxaz_grayling",
        "identityCard": {
            "charName": "Cxaz",
            "playerName": "Starter Character",
            "species": "Graylings",
            "charPath": "Path of Intelligence (Smart Hero)",
            "pathLevel": 1,
            "classList": "Engineer (1)",
            "alignment": "Independent Mechanic",
            "charSize": "Small",
            "gender": "Male",
            "height": "3'2\"",
            "hairColor": "None (Geometric Tattoos)",
            "eyeColor": "Dark"
        },
        "abilityScoresCard": {
            "scoreSTR": 8,  "modSTR": "-1",
            "scoreDEX": 15, "modDEX": "+2",
            "scoreCON": 10, "modCON": "+0",
            "scoreINT": 17, "modINT": "+3", "primaryAbility_INT": True,
            "scoreWIS": 12, "modWIS": "+1",
            "scoreCHA": 10, "modCHA": "+0"
        },
        "healthInjuryCard": {
            "hitDie": "d6",
            "maxHP": 6,
            "currentHP": 6,
            "tempHP": 0,
            "nonlethalHP": 0
        },
        "attributesCard": {
            "advantageDie": "d4",
            "initiative": "+2",
            "inertia": 10,
            "passivePerception": 11,
            "techProfCount": 4
        },
        "coreSkills": {
            "skillsPerLevel": "6",
            "unusedSkillPoints": "0",
            "skillsList": [
                {"Name": "Computer Use", "Favored": True, "Rank": 1, "Key Ability": "INT", "MiscMod": 0},
                {"Name": "Craft (Mechanical)", "Favored": True, "Rank": 1, "Key Ability": "INT", "MiscMod": 0},
                {"Name": "Craft (Electronic)", "Favored": True, "Rank": 1, "Key Ability": "INT", "MiscMod": 0},
                {"Name": "Disable Device", "Favored": False, "Rank": 1, "Key Ability": "INT", "MiscMod": 0},
                {"Name": "Repair", "Favored": True, "Rank": 1, "Key Ability": "INT", "MiscMod": 0}
            ]
        },
        "speciesTraitsCard": {
            "speciesTraitsList": [
                {"Name": "Grayling Telecom Link", "Description": "Can interface directly with wireless low-bandwidth networks."}
            ]
        },
        "pathTalentsCard": {
            "pathTalentsList": [
                {"Name": "Savant (Repair)", "Description": "Add bonus die on all complex electrical and mechanical repair tasks."}
            ]
        },
        "featsCard": {
            "featsList": [
                {"Name": "Gearhead", "Description": "+2 bonus on Repair and Disable Device checks."}
            ]
        },
        "equipmentCard": {
            "itemCraftProfCount": 2,
            "totalGearWeight": "12",
            "equipmentList": [
                {"Name": "Omni-Tool Rig", "Qty": "1", "Weight": "4", "TL": "6", "Notes": "Splicer and laser cutter"},
                {"Name": "Spare Circuitry & Wire Kit", "Qty": "1", "Weight": "3", "TL": "5", "Notes": "Components for field repairs"}
            ]
        },
        "UI_Layout": {
            "theme": "cyberpunk-neon",
            "layoutLocked": True
        }
    })
]


# ==============================================================================
# Database Helper Functions (Same Pattern as ReferenceData.py)
# ==============================================================================

_db_instance = None


def get_starter_characters_db():
    global _db_instance
    if _db_instance is None:
        try:
            config = loadYamlDBConfig()
            db_name = config.get("dbName", "futurepathapi")
            _db_instance = DBConnection(databaseName=db_name)
        except Exception as e:
            log.error(f"Error connecting to DB for StarterCharacters: {e}")
            return None
    return _db_instance


def init_starter_characters_table(db_conn=None):
    """
    Validates official starter characters using Pydantic and seeds the 'starter_characters' collection.
    """
    if db_conn is None:
        db_conn = get_starter_characters_db()
    if db_conn is None:
        return None

    try:
        existing = list(db_conn.find(collection="starter_characters"))
        if not existing:
            # Validate every model instance and serialize to dict using dump
            validated_data = [
                char_model.model_dump(by_alias=True)
                for char_model in OFFICIAL_STARTER_CHARACTERS
            ]
            db_conn.insertMany(validated_data, collection="starter_characters")
            log.info(f"Successfully initialized 'starter_characters' table with {len(validated_data)} entries.")
    except Exception as e:
        log.error(f"Error initializing 'starter_characters' table: {e}")

    return db_conn


def get_all_starter_characters(db_conn=None) -> List[Dict[str, Any]]:
    """
    Returns list of starter characters from the database, validated with Pydantic.
    """
    if db_conn is None:
        db_conn = get_starter_characters_db()
    if db_conn is None:
        return [char.model_dump(by_alias=True) for char in OFFICIAL_STARTER_CHARACTERS]

    try:
        records = list(db_conn.find(collection="starter_characters"))
        if not records:
            init_starter_characters_table(db_conn)
            records = list(db_conn.find(collection="starter_characters"))

        # Clean out internal MongoDB/TinyDB IDs if needed and validate
        results = []
        for doc in records:
            if "_id" in doc and not isinstance(doc["_id"], str):
                doc.pop("_id", None)
            try:
                validated = CharacterSheetSchema.model_validate(doc)
                results.append(validated.model_dump(by_alias=True))
            except Exception as val_err:
                log.warning(f"Validation warning for record {doc.get('id')}: {val_err}")
                results.append(doc)
        return results
    except Exception as e:
        log.error(f"Error fetching starter characters from DB: {e}")
        return [char.model_dump(by_alias=True) for char in OFFICIAL_STARTER_CHARACTERS]


def get_starter_character_by_id(char_id: str, db_conn=None) -> Optional[Dict[str, Any]]:
    """
    Retrieves a single starter character by ID, validated through Pydantic.
    """
    all_chars = get_all_starter_characters(db_conn=db_conn)
    for char in all_chars:
        if char.get("id") == char_id or char.get("character_id") == char_id:
            return char
    return None
