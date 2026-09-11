#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.2
# Date: 09/08/2026
# Description: General reference data tables and universal initialization for d20 FuturePath

import logging

from FuturePathAPI.libs import DBConnection, loadYamlDBConfig

log = logging.getLogger("ReferenceData")

SPECIES = [
    "Human",
    "Volar",
    "Grayling",
    "Lepidonain",
    "Cryous",
    "Ovex",
    "Aconian",
    "Murid",
    "Avisari",
    "Khepri",
    "Sayor",
    "Kurgian",
    "Tygerion",
    "Xrototaxian",
    "Chronodes",
]

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


def init_reference_tables(tables_data=None, db_conn=None, force_reload: bool = False):
    """
    Universal table initialization function for FuturePath reference data modules.
    Accepts a dictionary mapping collection names to seed data.
    If tables_data is None, seeds default base reference tables (species, sizes)
    and character reference tables for backward compatibility.
    """
    if tables_data is not None and not isinstance(tables_data, dict):
        db_conn = tables_data
        tables_data = None

    if db_conn is None:
        db_conn = get_reference_db()
    if db_conn is None:
        return None

    if tables_data is None:
        tables_data = {
            "species": [{"name": item} for item in SPECIES],
            "sizes": [{"name": item} for item in SIZES],
        }

    for table_name, data in tables_data.items():
        try:
            existing = list(db_conn.find(collection=table_name))
            needs_seed = not existing or force_reload
            if not needs_seed and table_name == "spaceship_hull_configurations":
                if any("Mods" not in doc for doc in existing if isinstance(doc, dict)):
                    needs_seed = True

            if needs_seed:
                if existing:
                    try:
                        db_conn.drop(collection=table_name)
                    except Exception:
                        pass
                db_conn.insertMany(data, collection=table_name)
        except Exception as e:
            log.error(f"Error initializing reference table '{table_name}': {e}")

    return db_conn
