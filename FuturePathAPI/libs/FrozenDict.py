#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 02/15/2022
# Description:


class FrozenDict(dict):

    def __new__(cls, *args, **kwargs):
        return super(FrozenDict, cls).__new__(cls, args)

    def __hash__(self):
        """
            This is here to make the Dict hashable. Normally it is not and simply adding this magic function doesn't
            mean that the dict is hashable. Making the dict immutable helps to make this hashable accurate.
        :return:
        """
        return hash(self.__str__())

    @staticmethod
    def _readonly(self, *args, **kwards):
        """
            Oh the fun. This is a custom class that is set below it to override all other functions that could possibly
            change the state of the data.
        :param args:
        :param kwards:
        :return:
        """
        raise TypeError("Cannot modify Immutable Instance")

    __delattr__ = __setattr__ = __setitem__ = pop = update = setdefault = clear = popitem = _readonly
