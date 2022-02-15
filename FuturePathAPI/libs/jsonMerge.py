#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 01/24/18
# Description:


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
