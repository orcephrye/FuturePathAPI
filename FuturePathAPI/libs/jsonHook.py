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
