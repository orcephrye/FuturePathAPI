#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 07/13/2026
# Description: TinyDB database support

import logging
import os

import bcrypt
from itsdangerous import URLSafeTimedSerializer as Serializer
from tinydb import TinyDB

from FuturePathAPI import MAINDIR
from FuturePathAPI.libs import getRedis, loadYamlDBConfig, tokenExpire

log = logging.getLogger("TinyDB")
_fallback_cache = {}


def matches_query(doc, query):
    if not query:
        return True
    for key, val in query.items():
        if key not in doc or doc[key] != val:
            return False
    return True


class TinyDBConnection(object):
    collections = [
        "usernames",
        "character_paths",
        "species",
        "professions",
        "occupations",
        "advantage_die_levels",
        "skill_die_levels",
        "sizes",
    ]
    defaultCollect = None
    connection = None
    db = None
    dbName = None

    def __init__(self, databaseName, **kwargs):
        self.dbName = databaseName
        tiny_db_path = kwargs.get("tinydb_path", os.path.join(MAINDIR, "libs", "db.json"))
        # Ensure directories exist
        db_dir = os.path.dirname(tiny_db_path)
        if db_dir and not os.path.exists(db_dir):
            os.makedirs(db_dir, exist_ok=True)
        self.connection = TinyDB(tiny_db_path)
        self.db = self.connection
        self.defaultCollect = kwargs.get("collection", self.collections[0])
        super(TinyDBConnection, self).__init__()

    def insertMany(self, data, **kwargs):
        table = self.db.table(kwargs.get("collection", self.defaultCollect))
        inserted_ids = table.insert_multiple(data)
        return len(inserted_ids) == len(data)

    def insertOne(self, data, **kwargs):
        table = self.db.table(kwargs.get("collection", self.defaultCollect))
        doc_id = table.insert(data)
        return doc_id is not None

    def find(self, data=None, **kwargs):
        table = self.db.table(kwargs.get("collection", self.defaultCollect))
        if not data:
            return table.all()
        return [doc for doc in table.all() if matches_query(doc, data)]

    def findOne(self, data=None, **kwargs):
        table = self.db.table(kwargs.get("collection", self.defaultCollect))
        if not data:
            all_docs = table.all()
            return all_docs[0] if all_docs else None
        for doc in table.all():
            if matches_query(doc, data):
                return doc
        return None

    def update(self, updateCriteria, data, **kwargs):
        table = self.db.table(kwargs.get("collection", self.defaultCollect))
        matching_ids = []
        for doc in table.all():
            if matches_query(doc, updateCriteria):
                matching_ids.append(doc.doc_id)
        if not matching_ids:
            return False
        updated_ids = table.update(data, doc_ids=matching_ids)
        return len(updated_ids) > 0

    def remove(self, data, **kwargs):
        table = self.db.table(kwargs.get("collection", self.defaultCollect))
        matching_ids = []
        for doc in table.all():
            if matches_query(doc, data):
                matching_ids.append(doc.doc_id)
        if not matching_ids:
            return 0
        table.remove(doc_ids=matching_ids)
        return len(matching_ids)

    def drop(self, **kwargs):
        collection_name = kwargs.get("collection", self.defaultCollect)
        self.db.drop_table(collection_name)
        return True

    def clearDB(self, dbName=None):
        for collection in self.collections:
            self.db.drop_table(collection)
        return True

    def genCollection(self, collection):
        return TinyDBCollection(self, collection)

    def genCollections(self):
        return [TinyDBCollection(self, collection) for collection in self.collections]

    def showDatabase(self):
        return list(self.db.tables())

    def useDatabase(self, dbName):
        self.dbName = dbName
        return self

    def dropDatabase(self, dbName):
        self.db.purge_tables()
        return True


class TinyDBCollection(object):
    collection = None

    def __init__(self, dbConn, collection):
        self.dbConn = dbConn
        self.collection = collection

    def insertMany(self, data):
        return self.dbConn.insertMany(data, collection=self.collection)

    def insertOne(self, data):
        return self.dbConn.insertOne(data, collection=self.collection)

    def find(self, data=None):
        return self.dbConn.find(data, collection=self.collection)

    def findOne(self, data=None):
        return self.dbConn.findOne(data, collection=self.collection)

    def update(self, updateCriteria, data, updateType="$set"):
        return self.dbConn.update(
            updateCriteria, data, collection=self.collection, updateType=updateType
        )

    def remove(self, data):
        return self.dbConn.remove(data, collection=self.collection)

    def drop(self):
        return self.dbConn.drop(collection=self.collection)

    @property
    def name(self):
        return self.collection


class UserManager(TinyDBConnection):
    coll = None
    config = None

    def __init__(self):
        self.config = loadYamlDBConfig()
        super(UserManager, self).__init__(
            databaseName=self.config.get("dbName", "futurepathapi")
        )
        if self.db is None:
            raise Exception("ERROR: Unable to connect to DB!")
        self.coll = TinyDBCollection(self, "usernames")
        self.r = getRedis()

    def check_user(self, username):
        return self.coll.findOne(data={"username": username})

    def create_user(self, username, password):
        if self.check_user(username):
            return None
        password = UserManager.hash_password(password)
        return self.coll.insertOne(
            {"username": username, "password": password, "token": ""}
        )

    def remove_user(self, username):
        if self.check_user(username):
            return self.coll.remove({"username": username})
        return None

    def applyToken(self, username, token):
        if not (username and token):
            return False
        return self.coll.update({"username": username}, {"token": token})

    def login(self, username, password):
        userData = self.check_user(username)
        if not userData:
            return None
        hashed = userData["password"]
        if self.check_password(password, hashed):
            token = userData.get("token", "")
            tmpUserName = self.get_from_cache(token)
            if tmpUserName == username:
                return token
            token = Serializer(password).dumps(username)
            if isinstance(token, bytes):
                token = token.decode("utf-8")
            self.applyToken(username, token)
            self.set_too_cache(token, username)
            return token
        return False

    def get_from_cache(self, key):
        try:
            output = self.r.get(key) if self.r else None
            if type(output) is bytes:
                return output.decode("utf-8")
            if output is not None:
                return output
        except Exception:
            pass
        return _fallback_cache.get(key)

    def set_too_cache(self, key, value):
        _fallback_cache[key] = value
        try:
            if self.r:
                return self.r.setex(key, tokenExpire, value)
        except Exception:
            pass
        return True

    @staticmethod
    def checkToken(token):
        try:
            r = getRedis()
            output = r.get(token) if r else None
            if type(output) is bytes:
                return output.decode("utf-8")
            if output is not None:
                return output
        except Exception:
            pass
        # Fallback to local dict cache
        if token in _fallback_cache:
            return _fallback_cache[token]
        # Fallback to database query
        try:
            um = UserManager()
            user_data = um.coll.findOne({"token": token})
            if user_data:
                return user_data.get("username")
        except Exception:
            pass
        return None

    @staticmethod
    def hash_password(password):
        return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    @staticmethod
    def check_password(password, hashed):
        return (
            bcrypt.hashpw(password.encode("utf-8"), hashed.encode("utf-8")).decode(
                "utf-8"
            )
            == hashed
        )
