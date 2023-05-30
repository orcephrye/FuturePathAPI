#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 02/15/2022
# Description:


import traceback
import json
import functools
import re
from flask import jsonify, abort, request, render_template, Response
from numpy.random import choice
from itertools import product
from collections.abc import Iterable
from FuturePathAPI.initApp import app
from FuturePathAPI.libs import ReadWriteLock
from FuturePathAPI.libs.jsonTools import jsonHook
from FuturePathAPI.libs.FrozenDict import FrozenDict


confirmSyntax = re.compile(r'^(\d){0,3}d\d{1,2}(((\+|-)\d{1,2})*)$', re.IGNORECASE)
determineDie = re.compile(r'd\d{1,3}', re.IGNORECASE)
determineMultiplier = re.compile(r'^(\d){1,3}', re.IGNORECASE)
determineModifier = re.compile(r'(\+|-)\d{1,2}$', re.IGNORECASE)
splitString = re.compile(r'([\+|-])')
reverseSplitString = re.compile(r'(\d){0,3}d\d{1,2}')


"""
.. module:: Rolling
    :platform: Linux
    :synopsis: Random number generator for dice rolling.

"""


def randomPicker(choices, p):
    """
        A wrapper for the numpy choice
    :param choices: a list or iterable to choose from
    :param p: probabilities
    :return: (int)
    """
    return int(choice(list(choices), p=p))


@app.route('/tasks/roll/character/<level>', methods=['GET'])
def rollCharacter(level):
    """
        :OPTIONS: GET
        :PATH: /tasks/roll/character/<level>
        :VARIABLES: level (string= low/normal/high)
        :DESC: This returns a JSON blob with 6 numbers representing character stats.
        :Content-Type: application/json or application/html (if error)
    """

    accept = request.headers.get('Accept', 'application/json').lower().strip()
    level = level.lower().strip()
    if level == "normal":
        return jsonify(Rolling.NormalCharacterStats())
    elif level == "high":
        return jsonify(Rolling.HighFantasyCharacterStats())
    elif level == "low":
        return jsonify(Rolling.LowFantasyCharacterStats())
    else:
        if accept == 'application/json':
            response = jsonify({'Error code': 404, 'message': f"You entered  [{level}] as a Fantasy level to generate "
                                                              f"a character's stats. Valid options are 'normal', 'high'"
                                                              f", or 'low'."})
        else:
            response = Response(render_template('WrongCharacterLevel.html', level=level))
        response.status_code = 404
        return response


def covertToDigit(tmpStr):
    if tmpStr:
        if type(tmpStr) is bool:
            return 1
        tmpStr = str(tmpStr)
        if tmpStr.isdigit():
            return int(tmpStr)
    return 0


def parse_die_options(options):
    dieOptions = {}

    if 'dropLowest' in options:
        dropLowest = options.get('dropLowest', 0)
        if dropLowest:
            dropLowest = str(dropLowest)
            if dropLowest.lower() == "false":
                dropLowest = 0
            elif dropLowest.lower() == "true":
                dropLowest = 1
            else:
                dropLowest = int(dropLowest)
        dieOptions['dropLowest'] = dropLowest

    if 'rerollTotal' in options:
        dieOptions['rerollTotal'] = covertToDigit(options.get('rerollTotal', 0))
    if 'rerollDie' in options:
        dieOptions['rerollDie'] = covertToDigit(options.get('rerollDie', 0))
    if 'subAll' in options:
        dieOptions['subAll'] = covertToDigit(options.get('subAll', 0))
    if 'addAll' in options:
        dieOptions['addAll'] = covertToDigit(options.get('addAll', 0))

    return dieOptions


def parse_dice_options(options):

    options.pop('rerollTotal', None)
    options.pop('rerollDie', None)

    diceOptions = parse_die_options(options)

    if 'repeatRoll' in options:
        diceOptions['repeatRoll'] = covertToDigit(options.get('repeatRoll', 0))

    return diceOptions


@app.route('/tasks/roll/<dString>', methods=['GET'])
def roll_from_get(dString):
    """
        :OPTIONS: GET
        :PATH: /tasks/roll/<dString>
        :VARIABLES: dString (string) This stands for Die or Dice String.
        :PARAM: dropLowest, rerollTotal, rerollDie, subAll, addAll
        :DESC: The Die or Dice described in dString is analyzed for rolling. HTTP Parameters are passed to adjust the
            rolling.
        Examples:
            * /d20 (Roll a single twenty sided dice. Notice the lack of a 1 IE: 1d20 both are acceptable options)
            * /2d4+2 (Roll two four sided dice and add two to the total.
            * /1d20+1d4+2 (Roll one twenty sided die and then roll one four sided die total them together and add two.
            * /4d6?dropLowest=1 (Roll 4 six sided dice and then drop the lowest die. Provide the total of the
                remaining 3)

            * NOTE: Do not use Die options when rolling more than 1 one set of dice. IE: 1d20 or 2d4 but NOT
                1d20+2d4. Once more than 1 set of die is rolling the Die/Dice options are ignored. For more advanced
                rolling use JSON.

        dropLowest: (default value: False)
            This can be either False, True, or Int. True == 1. If True or 1 then this
            causes the roller to drop the lowest die before totalling the value. If the number is higher than 1 then
            it will drop the lowest die X number of times.
        rerollTotal: (default value: False)
            This needs to be an integer. This will cause the roller to reroll the
            dice if the die is below a certain value. This will attempt to reroll 101 times. Currently, there is no
            logic to control the number of reroll attempts.
        rerollDie: (default value: False)
            This has to be an Int or a list of Ints. This will actually remove that Int
            or list of Ints from the possible roll of the die. So that when the die is rolled it can never choose that
            number.
        subAll: (default value: 0)
            This has to be an Int. This adjusts the probability range of ALL die to be rolled
            by subtracting the Int value off ALL possible numbers before rolling.
        addAll: (default value: 0)
            This has to be an Int. This acts like subAll. It  adjusts the probability range of
            ALL die to be rolled by adding the Int value off ALL possible numbers before rolling.
        :Content-Type: application/json
     """

    if len(dString) > 36:
        abort(500)

    dieOptions = {}
    try:
        dieOptions = parse_die_options(request.args)
    except Exception as e:
        print(f"ERROR: {e}")
        abort(501)

    die = DieAnalyzer.die_str_analyzer(dString, dieOptions)

    return jsonify(DieRoller.roll_dice(dice=die[0], connectors=die[1], diceOptions={}))


@app.route('/tasks/roll', methods=['POST'])
def roll_from_json():
    """
    :OPTIONS: POST
    :PATH: /tasks/roll
    :DESC: This requires a JSON blob to be sent. It is a more advanced and comprehensive version of the roll_from_get
        function.

        Example One: (Equal too 2d4+2?dropLowest=1)

        .. code-block:: json

            {
                "dString": "2d4",
                "modifier": "+2",
                "dieOptions": {"dropLowest": "1"}
            }

        Example Two: (Same as above)

        .. code-block:: json

            {
                "dice": [
                    {
                        "id": 1,
                        "dString": "2d4",
                        "modifier": "+2",
                        "dieOptions": {"dropLowest": 1}
                        }
                    ]
            }

        Example Three: (Takes advantage of the 'dice' list to combine dice together using the 'connectorString')

        .. code-block:: json

            {
                "dice": [
                    {
                        "id": 1,
                        "dString": "d20",
                        "connectorString": "+"
                    },
                    {
                        "id": 2,
                        "dString": "d4",
                        "modifier": "+2"
                    }
                ]
            }

        Example Four: (rolling a new Character's ability score)

        .. code-block:: json

            {
                "dice": [
                    {
                        "id": 1,
                        "dString": "4d6",
                        "dieOptions": {"dropLowest": 1, "rerollTotal": 10}
                    }
                ],
                "diceOptions": {"repeatRoll": 6}
            }

        JSON Requirements:
            * Each die in the dice has to have an id. That id will be used to sort the correct order.
            * dString should only have 1 die roll in it. IE: 1d20 or 2d4 but NOT 1d20+2d4
            * Modifiers in the dString will be ignored. A modifier should be passed with the 'modifier' key.
            * 'connectorString' can only be a '+' or '-' and HAS to exist in order for the next die to be added.
            * dieOptions key is used to identify options to a specific dString and will be passed to only that roll.
            * diceOptions key is used outside the 'dice' list and will be applied globally.
            * The top keys are 'dice', 'diceOptions' and 'modifier'.
            * An item in the 'dice' list should have 'id, 'dString', and optionally 'modifier', 'connectorString',
              and 'dieOptions'.
            * dieOptions are: 'dropLowest', 'rerollTotal', 'rerollDie'. 'subAll', 'addAll'.
            * diceOptions are: 'dropLowest', 'subAll', 'addAll', 'repeatRoll'

        dropLowest: (default value: False)
            This can be either False, True, or Int. True == 1. If True or 1 then this
            causes the roller to drop the lowest die before totalling the value. If the number is higher than 1 then
            it will drop the lowest die X number of times.
        rerollTotal: (default value: False)
            Is for 'dieOptions' only. This needs to be an integer. This will cause the roller to reroll the
            dice if the die is below a certain value. This will attempt to reroll 101 times. Currently, there is no
            logic to control the number of reroll attempts.
        rerollDie: (default value: False)
            Is for 'dieOptions' only. This has to be an Int or a list of Ints. This will actually remove that Int
            or list of Ints from the possible roll of the die. So that when the die is rolled it can never choose that
            number.
        subAll: (default value: 0)
            This has to be an Int. This adjusts the probability range of ALL die to be rolled
            by subtracting the Int value off ALL possible numbers before rolling.
        addAll: (default value: 0)
            This has to be an Int. This acts like subAll. It  adjusts the probability range of
            ALL die to be rolled by adding the Int value off ALL possible numbers before rolling.
        repeatRoll: (default value: False)
            Is for 'diceOptions' only. This has to be an Int. This will take each die give in the 'dices' list
            and preform the same action Int number of times. Max 10. The return json will look as if the request was
            originally submitted asking for each roll. (Helpful for when testing)
    :Accept: application/json
    :Content-Type: application/json
    """
    if not request.json:
        abort(400)

    dice = DieAnalyzer.die_json_analyzer(request.json)

    for die in dice:
        print(f"{die}")

    if dice is None:
        abort(400)

    return jsonify(DieRoller.roll_dice(dice=dice[0], connectors=dice[1], diceOptions=dice[2]))


class Memorizer(object):
    """
        Decorator. Caches a function's return value each time it is called.
        If called later with the same arguments, the cached value is returned
        (not reevaluated).
    """
    def __init__(self, func):
        self._func = func
        self._cache = {}
        self._ReadL, self._WriteL = ReadWriteLock.generateLockPair()

    def __call__(self, *args, **kwargs):
        hashKey = hash((args, FrozenDict(**kwargs)))
        if self.__isHashInCache(hashKey):
            return self.__getHashValue(hashKey)
        self.__setHashValue(hashKey, self._func(*args, **kwargs))
        return self.__getHashValue(hashKey)

    def __repr__(self):
        """Return the function's docstring."""
        return self._func.__doc__

    def __get__(self, obj, objtype):
        """Support instance methods."""
        return functools.partial(self.__call__, obj)

    def __isHashInCache(self, hashKey):
        with self._ReadL:
            return hashKey in self._cache

    def __getHashValue(self, hashKey):
        with self._ReadL:
            return self._cache[hashKey]

    def __setHashValue(self, hashKey, hashValue):
        self._cache[hashKey] = hashValue


class ProbabilityMemorizer(Memorizer):
    pass


class DieAnylizerMemorizer(Memorizer):
    pass


class RollProbabilityGenerator(object):

    def __init__(self, *args, **kwargs):
        self.numberDict = dict()
        self.productCount = 0.0
        self.probabilityMap = []
        if args:
            self(*args, **kwargs)

    def _saveNumbers(self, number):
        self.productCount += 1
        number = sum(number)
        if number in self.numberDict:
            self.numberDict[number] = (self.numberDict[number] + 1)
        else:
            self.numberDict[number] = 1.0

    def _generateProbabilityMap(self):
        def caculateProbability(item):
            return item[1] / self.productCount
        self.probabilityMap = list(map(caculateProbability, sorted(self.numberDict.items())))
        return self.probabilityMap

    def __call__(self, *args, **kwargs):
        if self.probabilityMap:
            return self.probabilityMap
        list(filter(self._saveNumbers, product(*args, **kwargs)))
        self.numberDict = dict(sorted(self.numberDict.items()))
        return self._generateProbabilityMap()


@ProbabilityMemorizer
def _getProbability(die, repeat=1):
    return RollProbabilityGenerator(die, repeat=repeat)


@DieAnylizerMemorizer
def _determine_numbers(dString, rerollDie=None, subAll=0, addAll=0, **kwargs):
    # print(f'_determineNumbers:\n\tdString: {dString}\n\trerollDie:'
    #       f' {rerollDie}\n\tsubAll: {subAll}\n\taddAll: {addAll}')
    die = determineDie.search(dString)
    if not die:
        raise Exception('Cannot determine die!')
    die = DiePicker.get_die(int(die.group().strip('d')), rerollDie=rerollDie, subAll=subAll, addAll=addAll)
    if die is None:
        raise Exception('Die is not recognized member of the dice dictionary!')
    multipler = determineMultiplier.match(dString)
    if not multipler:
        return die, 1
    return die, int(multipler.group())


def _determine_modifier(dStringMod):
    m = determineModifier.search(dStringMod.strip())
    return m.group() if m else ''


def _add_modifier(dStringMod, roll):
    modifier = _determine_modifier(dStringMod)
    if not modifier:
        return roll
    try:
        mod = modifier[0:1]
        num = modifier[1:]
        if mod == '+':
            return roll + int(num)
        elif mod == '-':
            return roll - int(num)
        else:
            return roll
    except Exception as e:
        print(f"_add_modifier Error: {e}:{getStackTrace()}")
        return roll


class DiePicker(object):

    diceDict = {2: (1, 2),
                3: (1, 2, 3),
                4: (1, 2, 3, 4),
                6: (1, 2, 3, 4, 5, 6),
                8: (1, 2, 3, 4, 5, 6, 7, 8),
                10: (1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
                12: (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12),
                20: (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20),
                24: (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24),
                30: (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
                     28, 29, 30),
                100: (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
                      28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
                      52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75,
                      76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99,
                      100)}

    def __init__(self):
        pass

    @staticmethod
    def get_die(die, rerollDie=None, subAll=0, addAll=0, **kwargs):

        dieNumbers = None

        if rerollDie is None:
            dieNumbers = DiePicker.diceDict.get(die)
        elif rerollDie == 1:
            dieNumbers = DiePicker.reroll_ones(die)
        elif rerollDie is not None:
            dieNumbers = DiePicker.reroll_number(die, number=rerollDie)

        if dieNumbers is None:
            return dieNumbers

        if subAll:
            dieNumbers = tuple([x-subAll for x in dieNumbers])
        if addAll:
            dieNumbers = tuple([x+addAll for x in dieNumbers])

        return dieNumbers

    @staticmethod
    def reroll_ones(die):
        return DiePicker.get_die(die)[1:]

    @staticmethod
    def reroll_number(die, number):
        die = DiePicker.get_die(die)
        if die is None:
            return None

        def _removeNumber(numList, num):
            numList = list(numList)
            numList.pop(numList.index(num))
            return numList

        if isinstance(number, Iterable):
            for num in number:
                die = _removeNumber(die, num)
        else:
            die = _removeNumber(die, number)
        return tuple(die)


class Roller(object):

    def __init__(self):
        super(Roller, self).__init__()

    @staticmethod
    def _get_max_roll(die, multipler):
        if isinstance(multipler, Iterable):
            multipler = sum(multipler)
        return die[-1] * multipler

    @staticmethod
    def _roller(die, multipler):
        # print(f'_roller:\n\tdie: {die}\n\tmultipler: {multipler}')
        if type(multipler) is list:
            return sum([randomPicker(rpg.numberDict.keys(), p=rpg.probabilityMap)
                        for rpg in [_getProbability(die, repeat=m) for m in multipler]])
        rpg = _getProbability(die, repeat=multipler)
        return randomPicker(rpg.numberDict.keys(), p=rpg.probabilityMap)

    @staticmethod
    def _drop_lowest(die, multipler, dropLowest):
        if isinstance(multipler, Iterable):
            multipler = sum(multipler)

        if multipler <= dropLowest:
            raise Exception('The number of dice to drop is greater then or equal to the number of requested '
                            'dice to roll')

        multipler = [1] * multipler
        choices = [randomPicker(rpg.numberDict.keys(), p=rpg.probabilityMap)
                   for rpg in [_getProbability(die, repeat=m) for m in multipler]]
        if type(dropLowest) is not int:
            choices.pop(choices.index(min(choices)))
            return sum(choices)
        for x in range(int(dropLowest)):
            choices.pop(choices.index(min(choices)))
        return sum(choices)

    @staticmethod
    def _reroll_total(die, multipler, rerollTotal, dropLowest=False, **kwargs):
        if rerollTotal >= DieRoller._get_max_roll(die, multipler):
            raise Exception('Total is equal to or exceeds dice\'s max possible roll')

        if dropLowest:
            rollFunc = functools.partial(DieRoller._drop_lowest, dropLowest=dropLowest)
        else:
            rollFunc = DieRoller._roller

        count = 0
        while count < 11:
            total = rollFunc(die, multipler)
            if total > rerollTotal:
                return total
            count += 1
            if count == 11:
                raise Exception('Total Reroll attempts exceeded!')

    @staticmethod
    def get_probabilities(die, repeat=0):
        return _getProbability(die, repeat=repeat)

    @staticmethod
    def reducer(multipler):

        def _subtractor(val):
            return abs(val - 5)

        if multipler is None:
            return 1
        elif multipler <= 5:
            return multipler

        multiplerList = []
        while True:
            multiplerList.append(5)
            multipler = _subtractor(multipler)
            if multipler < 5:
                if multipler != 0:
                    multiplerList.append(multipler)
                break
        return multiplerList


class DieRoller(Roller):

    def __init__(self):
        super(DieRoller, self).__init__()

    def __call__(self, *args, **kwargs):
        return DieRoller.roll_die(*args, **kwargs)

    @staticmethod
    def roll_die(*args, **kwargs):
        # print("rollDie:\n\targs; %s\n\tkwargs: %s" % (args, kwargs))
        die, multipler = None, None
        if not args:
            return None
        elif isinstance(args[0], str):
            die, multipler = _determine_numbers(args[0], **kwargs)
        elif isinstance(args[0], tuple):
            die, multipler = args[0], args[1]
        multipler = DieRoller.reducer(multipler)
        if kwargs.get('rerollTotal') is not None:
            return DieRoller._reroll_total(die, multipler, **kwargs)
        if kwargs.get('dropLowest', False):
            return DieRoller._drop_lowest(die, multipler, kwargs.get('dropLowest'))
        return DieRoller._roller(die, multipler)

    @staticmethod
    def roll_total(die, modifier, dieOptions):
        # print("rollTotal:\n\tdie; %s\n\tmodifier: %s\n\tdieOptions: %s" % (die, modifier, dieOptions))
        roll = DieRoller.roll_die(*die, **dict(dieOptions))
        return _add_modifier(modifier, roll)

    @staticmethod
    def get_total_from_roll(diceRolls, connectors):
        total = diceRolls[0]

        for i, connector in enumerate(connectors, start=1):
            if connector.strip() == '+':
                total += diceRolls[i]
            elif connector.strip() == '-':
                total -= diceRolls[i]
            else:
                raise Exception(f'Connector: {connector} is not + or -!')

        return {"Total": total, "Dice": diceRolls}

    @staticmethod
    def roll_dice(dice, connectors, diceOptions):
        # print "rollDice:\n\tdice; %s\n\tconnectors: %s\n\tdiceOptions: %s" % (dice, connectors, diceOptions)
        connectors = DieRoller._checkConnectors(connectors)
        diceOptions = dict(diceOptions)
        try:
            repeatRoll = int(diceOptions.get('repeatRoll', 0))
            dropLowest = int(diceOptions.get('dropLowest', 0))
            subAll = int(diceOptions.get('subAll', 0))
            addAll = int(diceOptions.get('addAll', 0))
        except Exception as e:
            raise Exception("Failed to get/parse the dice options")

        if 0 < repeatRoll <= dropLowest:
            raise Exception('The number of dice to drop is greater then or equal to the number of requested '
                            'dice to roll')

        diceRolls = [[DieRoller.roll_total(die[0], die[1], die[2]) for die in dice]]
        for _ in range(repeatRoll-1):
            diceRolls.append([DieRoller.roll_total(die[0], die[1], die[2]) for die in dice])

        diceTotals = [sum(roll) for roll in diceRolls]

        for _ in range(int(dropLowest)):
            diceRolls.pop(diceTotals.index(min(diceTotals)))
            diceTotals.pop(diceTotals.index(min(diceTotals)))

        if type(subAll) is int and subAll > 0:
            for roll in diceRolls:
                for i, die in enumerate(roll):
                    roll[i] = die - subAll

        if type(addAll) is int and addAll > 0:
            for roll in diceRolls:
                for i, die in enumerate(roll):
                    roll[i] = die + addAll

        rollsAndTotals = [DieRoller.get_total_from_roll(rolls, connectors) for rolls in diceRolls]
        return {"Rolls": rollsAndTotals}

    @staticmethod
    def _checkConnectors(connectors):
        if type(connectors) is not list:
            raise Exception("Connectors are formatted incorrectly they are not in a list")
        for connection in connectors:
            if not isinstance(connection, str):
                raise Exception("Connectors should be a string please check JSON")
            if not (connection == "-" or connection == "+"):
                raise Exception("Connectors should ebe a single character of either '+' or a '-'.")
        return connectors


class DieAnalyzer(object):
    """
        This is designed to take input from API calls. There are 3 routes to rolling that all come here.
        1. GET Call. This using the route '/tasks/roll/<dice>' via a GET call.
        Examples: '/tasks/roll/d20' or '/tasks/roll/2d4'. To add a modifier simply append a + or - after the dice:
        '/tasks/roll/1d20+5'. You can also combine die into a group of dice: '/tasks/roll/1d20+1d4+2'. Lastly die
        options are passed via URL parameters. IE: '/tasks/roll/4d6?dropLowest=1' Get a full list of die options below.
        NOTE: GET call has major limitations.
            a) The die options provided are passed to all applicable dice.
            b) It cannot pass dice options only die options.

        2. A POST call that simply sends a single Die String which can have some basic options tag too it. Below is an
            example of this option.
        {
            "dString": "2d4",
            "modifier": "+2",
            "dieOptions": {"dropLowest": "1"}
        }
        The 'dieOptions' is optional. This is an easy way to dip your toe into API calls to construct die rolls.

        3. A POST call that can send multi dice with custom options per each die as well as global options for the
            whole role. This allows for complicated massive roles and is good for doing multiple but completely
            different roles that involve different rules.
        Example of a single die roll like the one from above:
        {
            "dice": [
                {
                    "id": 1,
                    "dString": "2d4",
                    "modifier": "+2",
                    "dieOptions": {"dropLowest": 1}
                }
            ]
        }
        Example of a FuturePath rank 4 skill check
        {
            "dice": [
                {
                    "id": 1,
                    "dString": "d20",
                    "connectorString": "+"
                },
                {
                    "id": 2,
                    "dString": "d4",
                    "modifier": "+2"
                }
            ]
        }
        Example of rolling a new Character's ability score.
        {
            "dice": [
                {
                    "id": 1,
                    "dString": "4d6",
                    "dieOptions": {"dropLowest": 1, "rerollTotal": 10}
                }
            ],
            "diceOptions": {"repeatRoll": 6}
        }
        JSON Requirements:
            1) Each die in the dice has to have an id. That id will be used to sort the correct order.
            2) dString should only have 1 die roll in it.
            3) Modifiers in the dString will be ignored. A modifier should be passed with the 'modifier' key.
            4) 'connectorString' can only be a '+' or '-' and HAS to exist in order for the next die to be added.
            5) dieOptions key is used to identify options to a specific dString and will be passed to only that roll.
            6) diceOptions key is used outside of the 'dice' list and will be applied globally.
            7) The top keys are 'dice', 'diceOptions' and 'modifier'.
            8) An item in the 'dice' list should have 'id, 'dString', and can have 'modifier', 'connectorString',
                and 'dieOptions'.
            9) dieOptions are: 'dropLowest', 'rerollTotal', 'rerollDie'. 'subAll', 'addAll'.
            10) diceOptions are: 'dropLowest', 'subAll', 'addAll', 'repeatRoll'

        dropLowest: (default value: False) This can be either False, True, or Int. True == 1. If True or 1 then this
            causes the roller to drop the lowest die before totalling the value. If the number is higher than 1 then
            it will drop the lowest die X number of times.
        rerollTotal: (default value: False) This needs to be an integer. This will cause the roller to reroll the
            dice if the die is below a certain value. This will attempt to reroll 101 times. Currently, there is no
            logic to control the number of reroll attempts.
        rerollDie: (default value: False) This has to be an Int or a list of Ints. This will actually remove that Int
            or list of Ints from the possible roll of the die. So that when the die is rolled it can never choose that
            number.
        subAll: (default value: 0) This has to be an Int. This adjusts the probability range of ALL die to be rolled
            by subtracting the Int value off ALL possible numbers before rolling.
        addAll: (default value: 0) This has to be an Int. This acts like subAll. It  adjusts the probability range of
            ALL die to be rolled by adding the Int value off ALL possible numbers before rolling.
        repeatRoll: (default value: False) This has to be an Int. This will take each die give in the 'dices' list
            and preform the same action Int number of times. Max 10. The return json will look as if the request was
            originally submitted asking for each roll. (Helpful for when testing)
    """

    def __init__(self):
        pass

    @staticmethod
    def die_str_analyzer(dString, dieOptions=None):

        def _convertSingleDie(die):
            return die[0], die[1], tuple(dieOptions.items())

        if dieOptions is None:
            dieOptions = {}

        dString = dString.strip().strip('+').strip('-').lower()
        if 'd' not in dString:
            raise Exception("Cannot analyze string for dice. Missing 'd'. String given: %s" % dString)
        ss = splitString.split(dString)

        index = 0
        maxLen = len(ss)-1
        dies = []
        dieConnectors = []
        tmpDieStr = ""

        while index <= maxLen:
            item = ss[index]
            if "+" in item or "-" in item:
                tmpDieStr += item
            elif tmpDieStr.endswith("+") or tmpDieStr.endswith("-") or tmpDieStr.endswith(""):
                if 'd' in item and tmpDieStr == "":
                    tmpDieStr = item
                elif 'd' in item:
                    dies.append((_determine_numbers(tmpDieStr[:-1], **dieOptions),
                                 _determine_modifier(tmpDieStr[:-1]), ()))
                    dieConnectors.append(tmpDieStr[-1])
                    tmpDieStr = item
                else:
                    tmpDieStr += item
            index += 1
        dies.append((_determine_numbers(tmpDieStr, **dieOptions), _determine_modifier(tmpDieStr), ()))

        if len(dies) > 1:
            return dies, dieConnectors, tuple(dieOptions.items())
        dies[0] = _convertSingleDie(dies[0])
        return dies, dieConnectors, ()

    @staticmethod
    def die_json_analyzer(dJSON):

        def _sortHelper(i):
            return i.get('id')

        try:
            dies = []
            dieConnectors = []
            if isinstance(dJSON, str):
                dJSON = json.loads(dJSON.strip(), object_hook=jsonHook)
            dJSON = jsonHook(dJSON)
            dice = sorted(dJSON.get('dice', list()), key=_sortHelper)
            diceOptions = tuple(parse_dice_options(dJSON.get('diceOptions', {})).items())

            if not dice and dJSON.get('dString'):
                dice.append(dJSON)

            for item in dice:
                dies.append(((str(item.get('dString')), str(item.get('modifier', '')),
                              tuple(parse_die_options(item.get('dieOptions', {})).items()))))
                if dice.index(item) < (len(dice)-1):
                    dieConnectors.append(item.get('connectorString'))

            loopN = len(dies) - 1
            index = 0

            while index <= loopN:
                dies[index] = (_determine_numbers(dies[index][0], **dict(dies[index][2])),
                               dies[index][1], dies[index][2])
                index += 1

            return dies, list(filter(None, dieConnectors)), diceOptions
        except Exception as e:
            print(f"Error: {e}:{getStackTrace()}")
            return None


class Rolling(object):
    """
        This class is best used imported into another python project as a library.
    """

    def __init__(self):
        pass

    @staticmethod
    def roller(die, dieOptions):
        die = DieAnalyzer.die_str_analyzer(die, dieOptions)
        return DieRoller.roll_dice(dice=die[0], connectors=die[1], diceOptions={})

    @staticmethod
    def json_roller(dJson):
        dice = DieAnalyzer.die_json_analyzer(dJson)
        return DieRoller.roll_dice(dice=dice[0], connectors=dice[1], diceOptions=dice[2])

    @staticmethod
    def d2(**kwargs):
        return Rolling.roller('d2', dieOptions=kwargs)

    @staticmethod
    def d3(**kwargs):
        return Rolling.roller('d3', dieOptions=kwargs)

    @staticmethod
    def d4(**kwargs):
        return Rolling.roller('d4', dieOptions=kwargs)

    @staticmethod
    def d6(**kwargs):
        return Rolling.roller('d6', dieOptions=kwargs)

    @staticmethod
    def d8(*args, **kwargs):
        return Rolling.roller('d8', dieOptions=kwargs)

    @staticmethod
    def d10(**kwargs):
        return Rolling.roller('d10', dieOptions=kwargs)

    @staticmethod
    def d12(**kwargs):
        return Rolling.roller('d12', dieOptions=kwargs)

    @staticmethod
    def d20(**kwargs):
        return Rolling.roller('d20', dieOptions=kwargs)

    @staticmethod
    def d24(**kwargs):
        return Rolling.roller('d24', dieOptions=kwargs)

    @staticmethod
    def d30(**kwargs):
        return Rolling.roller('d30', dieOptions=kwargs)

    @staticmethod
    def d100(**kwargs):
        return Rolling.roller('d100', dieOptions=kwargs)

    @staticmethod
    def percentile(**kwargs):
        # TODO: Change this to better reflect a Pen&Paper percentile roll using 2d10s.
        return Rolling.roller('d100', dieOptions=kwargs)

    @staticmethod
    def HighFantasyCharacterStats():
        roll = {
            "dice": [
                {
                    "id": 1,
                    "dString": "4d6",
                    "dieOptions": {"dropLowest": 1, "rerollTotal": 9}
                }
            ],
            "diceOptions": {"repeatRoll": 7, "dropLowest": 1}
        }
        return Rolling.json_roller(roll)

    @staticmethod
    def NormalCharacterStats():
        roll = {
            "dice": [
                {
                    "id": 1,
                    "dString": "4d6",
                    "dieOptions": {"dropLowest": 1, "rerollTotal": 8}
                }
            ],
            "diceOptions": {"repeatRoll": 6}
        }
        return Rolling.json_roller(roll)

    @staticmethod
    def LowFantasyCharacterStats():
        roll = {
            "dice": [
                {
                    "id": 1,
                    "dString": "3d6",
                    "dieOptions": {"rerollTotal": 7}
                }
            ],
            "diceOptions": {"repeatRoll": 6}
        }
        return Rolling.json_roller(roll)


def getStackTrace():
    """
        This is a useful troubleshooting tool
    :return:
    """
    return traceback.format_exc()
