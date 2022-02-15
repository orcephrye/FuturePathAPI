#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 01/24/18
# Description:


from typing import Dict


def jsonHook(jsonInput: str) -> Dict:
    """ Decode properly formatted json in a robust way. Meant to be used as an object_hook for the Python json lib.
        Usage:  json.loads(json_string, object_hook=jsonHook)

    - :param jsonInput: Valid json object
    - :return: dict object
    """

    def _decode_str(data):
        tmpStr = data.lower()
        if tmpStr == 'true':
            return True
        elif tmpStr == 'false':
            return False
        elif tmpStr == 'none' or tmpStr == 'null':
            return None
        return data

    def _decode_list(data):
        rv = []
        for item in data:
            if isinstance(item, bytes):
                try:
                    item = _decode_str(item.decode())
                except:
                    item = item.decode(errors='ignore')
            elif isinstance(item, list):
                item = _decode_list(item)
            elif isinstance(item, dict):
                item = _decode_dict(item)
            rv.append(item)
        return rv

    def _decode_dict(data):
        rv = {}
        for key, value in data.items():
            if isinstance(key, bytes):
                key = key.decode()
            if isinstance(value, bytes):
                try:
                    value = _decode_str(value.decode())
                except:
                    value = value.decode(errors='ignore')
            elif isinstance(value, list):
                value = _decode_list(value)
            elif isinstance(value, dict):
                value = _decode_dict(value)
            rv[key] = value
        return rv

    return _decode_dict(jsonInput)


def mergeJson(mainJson, secondJson):

    def listParser(list1, list2):
        newList = []
        newList.extend(list1)
        while list1 or list2:
            values = compareItem(list1, list2)
            if values is True:
                newList = list2
                break
            elif values is False:
                break
            else:
                item1, item2 = values
                newList[newList.index(item1)] = mergeJson(item1, item2)
                list1.pop(list1.index(item1))
                list2.pop(list2.index(item2))
        newList.extend(list2)
        return newList

    def compareItem(item1, item2):
        if type(item1) is dict and type(item2) is dict:
            for key in item1.keys():
                if key in item2.keys():
                    return item1[key], item2[key]
        elif type(item1) is list and type(item2) is list:
            for x in item1:
                for y in item2:
                    if compareItem(x, y):
                        return x, y
        else:
            return item1 == item2
        return False

    def dictIntersectionIter(dict1, dict2):
        for key in set.intersection(set(dict1), set(dict2)):
            yield key

    def dictDifferenceIter(dict1, dict2):
        for key in set.difference(set(dict2), set(dict1)):
            yield key

    if type(mainJson) is list and type(secondJson) is list:
        return listParser(mainJson, secondJson)
    elif type(mainJson) is dict and type(secondJson) is dict:
        for key in dictIntersectionIter(mainJson, secondJson):
            mainJson[key] = mergeJson(mainJson[key], secondJson[key])
        for key in dictDifferenceIter(mainJson, secondJson):
            mainJson[key] = secondJson[key]
        return mainJson
    else:
        return secondJson