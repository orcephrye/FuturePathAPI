#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 08/07/2026
# Description: Pydantic schemas and database seeding for d20 FuturePath starter characters.

import glob
import json
import logging
import os
from pathlib import Path
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
    homeworld: Optional[str] = None
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
    extraDamage: Optional[Union[int, str]] = 0
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
    Lvl: Optional[Union[int, str]] = "1"
    Damage: Optional[str] = ""
    Accuracy: Optional[str] = ""
    AP: Optional[str] = ""
    Critical: Optional[str] = ""
    Type: Optional[str] = ""
    Range: Optional[str] = ""
    isMelee: Optional[bool] = False
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


class LanguageCustomSkillsCard(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    featSkillsList: List[SkillItem] = Field(default_factory=list, alias="featSkillsList")
    langSkillsList: List[SkillItem] = Field(default_factory=list, alias="langSkillsList")


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
    languageCustomSkillsCard: Optional[Union[LanguageCustomSkillsCard, List[SkillItem]]] = Field(
        default_factory=LanguageCustomSkillsCard
    )
    UI_Layout: Optional[UILayout] = Field(default_factory=UILayout)


# ==============================================================================
# Dynamic Loader & Official Starter Characters Dataset
# ==============================================================================

def load_starter_characters_from_disk(data_dir: Optional[str] = None) -> List[CharacterSheetSchema]:
    """
    Gathers all '*.json' files in the 'FuturePathAPI/libs/starter_characters_data/' directory,
    ensures 'id' and 'character_id' are set to the file name stem, validates each character
    with CharacterSheetSchema, and returns the list of validated character sheets.
    """
    if data_dir is None:
        data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "starter_characters_data")

    characters: List[CharacterSheetSchema] = []
    json_pattern = os.path.join(data_dir, "*.json")
    json_files = sorted(glob.glob(json_pattern))

    for json_file in json_files:
        try:
            with open(json_file, "r", encoding="utf-8") as f:
                raw_data = json.load(f)

            # Assign id and character_id from filename (e.g. beckett_kane.json -> 'beckett_kane')
            char_id = Path(json_file).stem
            raw_data["id"] = char_id
            raw_data["character_id"] = char_id

            validated = CharacterSheetSchema.model_validate(raw_data)
            characters.append(validated)
        except Exception as e:
            log.error(f"Error loading starter character from '{json_file}': {e}")

    return characters


OFFICIAL_STARTER_CHARACTERS: List[CharacterSheetSchema] = load_starter_characters_from_disk()


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


def init_starter_characters_table(db_conn=None, force_reload: bool = False):
    """
    Validates official starter characters using Pydantic and seeds the 'starter_characters' collection.
    """
    if db_conn is None:
        db_conn = get_starter_characters_db()
    if db_conn is None:
        return None

    try:
        existing = list(db_conn.find(collection="starter_characters"))
        if not existing or force_reload or len(existing) != len(OFFICIAL_STARTER_CHARACTERS):
            if existing:
                try:
                    db_conn.drop(collection="starter_characters")
                except Exception:
                    pass
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
        if not records or len(records) != len(OFFICIAL_STARTER_CHARACTERS):
            init_starter_characters_table(db_conn, force_reload=True)
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
