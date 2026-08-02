#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 07/13/2026

import logging
import os
import redis
import yaml
from flask_login import UserMixin
from FuturePathAPI import MAINDIR

log = logging.getLogger("Database")
DB_CONFIG = "/libs/db.yaml"
REDIS_CONFIG = "/libs/redis.yaml"
redisServer = None
tokenExpire = 43200


def loadYaml(filename=""):
    yamlFile = MAINDIR + filename
    with open(yamlFile, "r") as f:
        return yaml.load(f, Loader=yaml.SafeLoader)


def loadYamlDBConfig():
    try:
        return loadYaml(DB_CONFIG)
    except:
        return dict()


def loadYamlREDISConfig():
    try:
        return loadYaml(REDIS_CONFIG)
    except:
        return dict()


def getRedis(checkConn=False):
    global redisServer
    global tokenExpire
    if redisServer is not None:
        if checkConn is False:
            return redisServer
        try:
            redisServer.ping()
        except redis.ConnectionError as e:
            print(e.message)
            redisServer = None
        return redisServer
    config = loadYamlREDISConfig()
    tokenExpire = config.get("expire", 43200)
    try:
        redisServer = redis.StrictRedis(
            host=config.get("host", "localhost"),
            port=config.get("port", 6379),
            db=config.get("db", 0),
        )
    except Exception:
        redisServer = None
    return redisServer


class User(UserMixin):
    def __init__(self, username):
        self._id = username
        self.username = username

    def __repr__(self):
        return "<User %s>" % self.username


# Dynamic DB routing based on DB_TYPE env variable
DB_TYPE = os.environ.get("DB_TYPE", "TinyDB").strip()

if DB_TYPE.lower() == "mongodb":
    from FuturePathAPI.libs.MongoDataBase import MongoConnection as DBConnection
    from FuturePathAPI.libs.MongoDataBase import MongoCollection as DBCollection
    from FuturePathAPI.libs.MongoDataBase import UserManager
else:
    from FuturePathAPI.libs.TinyDataBase import TinyDBConnection as DBConnection
    from FuturePathAPI.libs.TinyDataBase import TinyDBCollection as DBCollection
    from FuturePathAPI.libs.TinyDataBase import UserManager
