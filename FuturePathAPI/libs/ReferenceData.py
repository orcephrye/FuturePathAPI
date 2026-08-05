#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 08/05/2026
# Description: Reference data tables for d20 FuturePath character sheets

import logging
from FuturePathAPI.libs import DBConnection, loadYamlDBConfig

log = logging.getLogger("ReferenceData")

CHARACTER_PATHS = [
    "Path of Strength (Strong Hero)",
    "Path of Dexterity (Fast Hero)",
    "Path of Constitution (Tough Hero)",
    "Path of Intelligence (Smart Hero)",
    "Path of Wisdom (Dedicated Hero)",
    "Path of Charisma (Charismatic Hero)",
    "Path of No Path (The Freelancer)",
    "Ovex Path",
]

SPECIES = [
    "Humans",
    "Volar",
    "Graylings",
    "Lepidonains",
    "Cryous",
    "Ovex",
    "Aconians",
    "Murids",
    "Avisari",
    "Khepri",
    "Sayor",
    "Kurgian",
    "Tygerion",
    "Xrototaxian",
    "Chronodes",
]

PROFESSIONS = [
    "Combat Medic",
    "Dimension Knight",
    "Dreadnought",
    "Engineer",
    "Envoy",
    "Electro-Mancer",
    "Field Officer",
    "Helix Warrior",
    "Shield Splicer",
    "Space Marine",
    "Starfighter",
    "Swindler",
    "Technosavant",
    "Tracer",
    "Xenophile",
]

OCCUPATIONS = [
    "Academic",
    "Adventurer",
    "Athlete",
    "Blue Collar",
    "Celebrity",
    "Creative",
    "Criminal",
    "Cyber-Specialist",
    "Dilettante",
    "Diplomat",
    "Doctor",
    "Emergency Services",
    "Entrepreneur",
    "Jobless",
    "Investigative",
    "Law Enforcement",
    "Mercenary",
    "Military",
    "Pioneer",
    "Religious",
    "Rural",
    "Student",
    "Spacer",
    "Technician",
    "White Collar",
]

ADVANTAGE_DIE_LEVELS = [
    "1d2",
    "1d2+1",
    "1d4+1",
    "1d4+2",
    "1d6+2",
    "1d6+3",
    "1d8+3",
    "1d8+4",
    "1d10+4",
    "1d10+5",
    "1d12+5",
    "1d12+6",
    "2d6+7",
    "2d8+7",
    "2d8+8",
    "2d10+8",
    "2d10+9",
    "2d12+9",
    "2d12+10",
]

SKILL_DIE_LEVELS = list(ADVANTAGE_DIE_LEVELS)

SIZES = [
    "Fine",
    "Diminutive",
    "Tiny",
    "Small",
    "Medium",
    "Large",
    "Huge",
    "Gargantuan",
    "Colossal",
]

_db_instance = None


def get_reference_db():
    global _db_instance
    if _db_instance is None:
        try:
            config = loadYamlDBConfig()
            db_name = config.get("dbName", "futurepathapi")
            _db_instance = DBConnection(databaseName=db_name)
        except Exception as e:
            log.error(f"Error connecting to DB: {e}")
            return None
    return _db_instance


def init_reference_tables(db_conn=None):
    if db_conn is None:
        db_conn = get_reference_db()
    if db_conn is None:
        return None

    tables_data = {
        "character_paths": [{"name": item} for item in CHARACTER_PATHS],
        "species": [{"name": item} for item in SPECIES],
        "professions": [{"name": item} for item in PROFESSIONS],
        "occupations": [{"name": item} for item in OCCUPATIONS],
        "advantage_die_levels": [
            {"level": i + 1, "die": item} for i, item in enumerate(ADVANTAGE_DIE_LEVELS)
        ],
        "skill_die_levels": [
            {"level": i + 1, "die": item} for i, item in enumerate(SKILL_DIE_LEVELS)
        ],
        "sizes": [{"name": item} for item in SIZES],
    }

    for table_name, data in tables_data.items():
        try:
            existing = list(db_conn.find(collection=table_name))
            if not existing:
                db_conn.insertMany(data, collection=table_name)
        except Exception as e:
            log.error(f"Error initializing table {table_name}: {e}")

    return db_conn
