#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 02/15/2022
# Description:


from pymongo import MongoClient
from flask_login import UserMixin
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
import redis
import bcrypt


redisServer = redis.StrictRedis(host='localhost', port=6379, db=0)


host = "127.0.0.1"
port = 27017
# dbusername = ""
# dbpassword = ""
dbName = "FuturePathAPI"
tokenExpire = 43200


class MongoConnection(object):

    connection = None
    db = None

    def __init__(self):
        try:
            self.connection = MongoClient(host=host, port=port)
            self.db = self.connection[dbName]
        except Exception as e:
            # print "An Exception occurred: %s" % e
            e.message
        super(MongoConnection, self).__init__()

    def insert(self, collection, data):
        if self.db is None:
            return None
        return self.db[collection].insert_one(data)

    def find(self, collection, data=None):
        if self.db is None:
            return None
        return self.db[collection].find_one(data)

    def update(self, collection, updateCriteria, data):
        if self.db is None:
            return None
        setData = {'$set': data}
        return self.db[collection].update_one(updateCriteria, setData)

    def remove(self, collection, data):
        if self.db is None:
            return None
        return self.db[collection].remove(data)


class UserManager(MongoConnection):

    collection = 'usernames'

    def __init__(self):
        super(UserManager, self).__init__()
        if self.db is None:
            raise Exception("ERROR: Unable to connect to DB!")

    def check_user(self, username):
        return self.find(self.collection, {'username': username})

    def create_user(self, username, password):
        if self.check_user(username):
            return None
        password = UserManager.hash_password(password)
        return self.insert(self.collection, {'username': username, 'password': password, 'token': ''})

    def remove_user(self, username):
        if self.check_user(username):
            return self.remove(self.collection, {'username': username})
        return None

    def applyToken(self, username, token):
        if not (username and token):
            return False
        username = {'username': username}
        token = {'token': token}
        return self.update(self.collection, username, token)

    def login(self, username, password):
        userData = self.check_user(username)
        if not userData:
            return None
        hashed = str(userData['password'])
        if self.check_password(str(password), str(hashed)):
            token = str(userData.get('token'))
            tmpUserName = redisServer.get(token)
            if tmpUserName == username:
                return token
            token = Serializer(password).dumps(username)
            self.applyToken(username, token)
            redisServer.setex(token, tokenExpire, username)
            return token
        return False

    @staticmethod
    def checkToken(token):
        return redisServer.get(token)

    @staticmethod
    def hash_password(password):
        return bcrypt.hashpw(password, bcrypt.gensalt())

    @staticmethod
    def check_password(password, hashed):
        return bcrypt.hashpw(password, hashed) == hashed


class User(UserMixin):

    def __init__(self, username):
        self._id = username
        self.username = username

    def __repr__(self):
        return '<User %s>' % self.username
