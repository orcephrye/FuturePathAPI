#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 02/15/2022
# Description:


import yaml
import redis
import bcrypt
import logging
import traceback
from pymongo import MongoClient
from flask_login import UserMixin
from itsdangerous import URLSafeTimedSerializer as Serializer
from FuturePathAPI import MAINDIR


log = logging.getLogger('MongoDB')
DB_CONFIG = "/libs/db.yaml"
REDIS_CONFIG = "/libs/redis.yaml"
redisServer = None
tokenExpire = 43200


def loadYaml(filename=''):
    yamlFile = MAINDIR + filename
    with open(yamlFile, 'r') as f:
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
        finally:
            return redisServer
    config = loadYamlREDISConfig()
    tokenExpire = config.get('expire', 43200)
    redisServer = redis.StrictRedis(host=config.get('host', 'localhost'), port=config.get('port', 6379),
                                    db=config.get('db', 0))
    return redisServer


class MongoConnection(object):

    collections = ['usernames']
    defaultCollect = None
    connection = None
    db = None
    dbName = None

    def __init__(self, databaseName, **kwargs):
        try:
            config = loadYamlDBConfig()
            self.connection = MongoClient(host=kwargs.get('host', config.get('host', '127.0.0.1')),
                                          port=kwargs.get('port', config.get('port', 27017)),
                                          username=kwargs.get('username', config.get('username', 'server')),
                                          password=kwargs.get('password', config.get('password', '')),
                                          authSource=kwargs.get('authSource', config.get('authSource', 'admin')))
            self.db = self.connection[databaseName]
            self.defaultCollect = kwargs.get('collection', self.collections[0])
            self.dbName = databaseName
        except Exception as e:
            log.error(f'Error while creating MongoConnection: {e}')
            log.debug(f'[DEBUG] for MongoConnection: {traceback.format_exc()}')
            raise e
        super(MongoConnection, self).__init__()

    def insertMany(self, data, **kwargs):
        results = self.db[kwargs.get('collection', self.defaultCollect)].insert_many(data)
        return results.acknowledged and len(results.inserted_ids) == len(data)

    def insertOne(self, data, **kwargs):
        return self.db[kwargs.get('collection', self.defaultCollect)].insert_one(data).acknowledged

    def find(self, data=None, **kwargs):
        return self.db[kwargs.get('collection', self.defaultCollect)].find(data)

    def findOne(self, data=None, **kwargs):
        return self.db[kwargs.get('collection', self.defaultCollect)].find_one(data)

    def update(self, updateCriteria, data, **kwargs):
        updateType = {kwargs.get('updateType', '$set'): data}
        results = self.db[kwargs.get('collection', self.defaultCollect)].update_one(updateCriteria, updateType)
        return results.acknowledged and results.modified_count > 0

    def remove(self, data, **kwargs):
        return self.db[kwargs.get('collection', self.defaultCollect)].remove(data).get('n', False)

    def drop(self, **kwargs):
        return self.db[kwargs.get('collection', self.defaultCollect)].drop()

    def clearDB(self, dbName=None):
        if dbName:
            return [self.connection[dbName][collection].drop() for collection in self.collections]
        return [self.db[collection].drop() for collection in self.collections]

    def genCollection(self, collection):
        return MongoCollection(self, collection)

    def genCollections(self):
        return [MongoCollection(self, collection) for collection in self.collections]

    def showDatabase(self):
        return self.connection.list_database_names()

    def useDatabase(self, dbName):
        self.db = self.connection[dbName]
        return self

    def dropDatabase(self, dbName):
        return self.connection.drop_database(dbName)


class MongoCollection(object):

    collection = None

    def __init__(self, mongoConn, collection):
        self.mongoConn = mongoConn
        self.collection = collection

    def insertMany(self, data):
        return self.mongoConn.insertMany(data, collection=self.collection)

    def insertOne(self, data):
        return self.mongoConn.insertOne(data, collection=self.collection)

    def find(self, data=None):
        return self.mongoConn.find(data, collection=self.collection)

    def findOne(self, data=None):
        return self.mongoConn.findOne(data, collection=self.collection)

    def update(self, updateCriteria, data, updateType='$set'):
        return self.mongoConn.update(updateCriteria, data, collection=self.collection, updateType=updateType)

    def remove(self, data):
        return self.mongoConn.remove(data, collection=self.collection)

    def drop(self):
        return self.mongoConn.drop(collection=self.collection)

    @property
    def name(self):
        return self.collection


class UserManager(MongoConnection):

    coll = None
    config = None

    def __init__(self):
        self.config = loadYamlDBConfig()
        super(UserManager, self).__init__(databaseName=self.config.get('dbName', 'futurepathapi'))
        if self.db is None:
            raise Exception("ERROR: Unable to connect to DB!")
        self.coll = MongoCollection(self, 'usernames')
        self.r = getRedis()

    def check_user(self, username):
        return self.coll.findOne(data={'username': username})

    def create_user(self, username, password):
        if self.check_user(username):
            return None
        password = UserManager.hash_password(password)
        return self.coll.insertOne({'username': username, 'password': password, 'token': ''})

    def remove_user(self, username):
        if self.check_user(username):
            return self.coll.remove({'username': username})
        return None

    def applyToken(self, username, token):
        if not (username and token):
            return False
        return self.coll.update({'username': username}, {'token': token})

    def login(self, username, password):
        userData = self.check_user(username)
        if not userData:
            return None
        hashed = userData['password']
        if self.check_password(password, hashed):
            token = userData.get('token', '')
            tmpUserName = self.get_from_cache(token)
            if tmpUserName == username:
                return token
            token = Serializer(password).dumps(username).decode('utf-8')
            self.applyToken(username, token)
            self.r.setex(token, tokenExpire, username)
            return token
        return False

    def get_from_cache(self, key):
        output = self.r.get(key)
        if type(output) is bytes:
            return output.decode('utf-8')
        return output

    def set_too_cache(self, key, value):
        return self.r.setex(key, tokenExpire, value)

    @staticmethod
    def checkToken(token):
        try:
            return getRedis().get(token)
        except:
            return None

    @staticmethod
    def hash_password(password):
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    @staticmethod
    def check_password(password, hashed):
        return bcrypt.hashpw(password.encode('utf-8'), hashed.encode('utf-8')).decode('utf-8') == hashed


class User(UserMixin):

    def __init__(self, username):
        self._id = username
        self.username = username

    def __repr__(self):
        return '<User %s>' % self.username
