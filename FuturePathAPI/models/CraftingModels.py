#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 07/13/2026
# Description: Crafting and Creation foundation models and DB manager

import base64
import logging
import pickle
from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field

from FuturePathAPI.libs import DBCollection, DBConnection, loadYamlDBConfig
from FuturePathAPI.models import MODEL_REGISTRY

log = logging.getLogger("CraftingModels")


class ActionType(str, Enum):
    ADD = "add"
    REMOVE = "remove"
    INCREASE = "increase"
    DECREASE = "decrease"
    REPLACE = "replace"


class Action(BaseModel):
    action_type: ActionType
    target: str
    value: Any = None
    parameters: Dict[str, Any] = Field(default_factory=dict)


class Rule(BaseModel):
    id: str
    name: str
    trigger: str
    condition: str
    actions: List[Action] = Field(default_factory=list)
    parameters: Dict[str, Any] = Field(default_factory=dict)


class CraftingType(BaseModel):
    id: str
    name: str
    description: str = Field("", description="A description of the item")
    item_type: str
    rules: List[Rule] = Field(default_factory=list)
    attributes: Dict[str, Any] = Field(default_factory=dict)

    def pickle_object(self) -> bytes:
        """Pickles the Python Class instance to bytes."""
        return pickle.dumps(self)

    @classmethod
    def unpickle_object(cls, data: bytes) -> 'CraftingType':
        """Unpickles the data to return a Python Class instance."""
        obj = pickle.loads(data)
        if not isinstance(obj, cls):
            raise TypeError(f"Unpickled object is not an instance of {cls.__name__}")
        return obj

    def to_db_entry(self) -> 'CraftingDbEntry':
        """Converts the CraftingType instance into a CraftingDbEntry database model."""
        return CraftingDbEntry(
            id=self.id,
            item_id=self.id,
            crafting_type=self.item_type,
            data=self.model_dump(),
            pickled_data=None,
        )

    def _has_target_attr(self, obj_or_target: Any, target: Optional[str] = None) -> bool:
        if target is None:
            target = str(obj_or_target)
            obj = self
        else:
            obj = obj_or_target

        if hasattr(obj, target):
            return True
        elif '.' in target:
            new_name, new_target = target.split(".", 1)
            if hasattr(obj, new_name):
                return self._has_target_attr(getattr(obj, new_name), new_target)
        return False

    def _get_target_attr(self, obj_or_target: Any, target: Optional[str] = None) -> Any:
        if target is None:
            target = str(obj_or_target)
            obj = self
        else:
            obj = obj_or_target

        if hasattr(obj, target):
            return getattr(obj, target)
        elif '.' in target:
            new_name, new_target = target.split(".", 1)
            if hasattr(obj, new_name):
                return self._get_target_attr(getattr(obj, new_name), new_target)
        raise ValueError(f"Target '{target}' is not a valid attribute")

    def _set_target_attr(self, obj_or_target: Any, target_or_value: Any = None, value: Any = None):
        if value is None and target_or_value is not None and isinstance(obj_or_target, str):
            target = obj_or_target
            val = target_or_value
            obj = self
        else:
            obj = obj_or_target
            target = str(target_or_value)
            val = value

        if hasattr(obj, target):
            return setattr(obj, target, val)
        elif '.' in target:
            new_name, new_target = target.split(".", 1)
            if hasattr(obj, new_name):
                return self._set_target_attr(getattr(obj, new_name), new_target, val)
        raise ValueError(f"Target '{target}' is not a valid attribute")

    def _get_target_schema(self, target: str, schemadict: dict) -> dict:
        if target in schemadict.get('properties', {}):
            return schemadict.get('properties', {}).get(target, {})
        elif '.' in target:
            new_target = target[target.find(".")+1:]
            new_name = target[:target.find(".")]
            if hasattr(self, new_name):
                return self._get_target_schema(new_target, getattr(getattr(self, new_name, None), 'model_json_schema', lambda *args: {})())
        raise ValueError(f"Target '{target}' is not schema property")

    def add(self, target: str, value: Any = None) -> 'CraftingType':
        oldV = self._get_target_attr(target)
        if isinstance(oldV, list):
            oldV.append(value)
        elif isinstance(oldV, dict):
            oldV = oldV.copy()
            oldV.update(value)
        self._set_target_attr(target, oldV)
        return self

    def remove(self, target: str, value: Any = None) -> 'CraftingType':
        oldV = self._get_target_attr(target)
        if isinstance(oldV, list):
            oldV = [x for x in oldV if x != value]
        elif isinstance(oldV, dict):
            oldV = oldV.copy()
            oldV.pop(value)
        self._set_target_attr(target, oldV)
        return self

    def increase(self, target: str) -> 'CraftingType':
        target_schema = self._get_target_schema(target, self.model_json_schema())
        oldV = self._get_target_attr(self, target)
        if 'enum' in target_schema:
            self._set_target_attr(self, target, target_schema['enum'][target_schema['enum'].index(oldV)+1])
        else:
            self._set_target_attr(self, target, oldV + 1)
        return self

    def decrease(self, target: str) -> 'CraftingType':
        target_schema = self._get_target_schema(target, self.model_json_schema())
        oldV = self._get_target_attr(self, target)
        if 'enum' in target_schema:
            self._set_target_attr(self, target, target_schema['enum'][target_schema['enum'].index(oldV) + 1])
        else:
            self._set_target_attr(self, target, oldV + -1)
        return self

    def replace(self, target: str, value: Any = None) -> 'CraftingType':
        self._set_target_attr(self, target, value)
        return self

    def apply_action(self, action: Action):
        """Applies an Action to this CraftingType instance."""
        target = action.target
        val = action.value
        action_type = action.action_type

        if target.startswith("attributes."):
            attr_key = target.split(".", 1)[1]
            self._apply_dict_action(self.attributes, attr_key, action_type, val)
        elif hasattr(self, target):
            current_val = getattr(self, target)
            new_val = self._calculate_new_value(current_val, action_type, val)
            setattr(self, target, new_val)
        else:
            self._apply_dict_action(self.attributes, target, action_type, val)

    def _calculate_new_value(self, current_val, action_type: ActionType, val):
        if action_type == ActionType.ADD:
            if isinstance(current_val, list):
                if isinstance(val, list):
                    return [*current_val, *val]
                return [*current_val, val]
            elif isinstance(current_val, dict) and isinstance(val, dict):
                merged = current_val.copy()
                merged.update(val)
                return merged
            elif isinstance(current_val, (int, float, str)) and isinstance(val, (int, float, str)):
                return current_val + val
            return val
        elif action_type == ActionType.REMOVE:
            if isinstance(current_val, list):
                if isinstance(val, list):
                    return [x for x in current_val if x not in val]
                return [x for x in current_val if x != val]
            elif isinstance(current_val, dict):
                copied = current_val.copy()
                if isinstance(val, list):
                    for k in val:
                        copied.pop(k, None)
                else:
                    copied.pop(val, None)
                return copied
            return None
        elif action_type == ActionType.INCREASE:
            return current_val + val
        elif action_type == ActionType.DECREASE:
            return current_val - val
        elif action_type == ActionType.REPLACE:
            return val
        return current_val

    def _apply_dict_action(self, d: dict, key: str, action_type: ActionType, val):
        if key not in d:
            if action_type == ActionType.ADD or action_type == ActionType.REPLACE:
                d[key] = val
            elif action_type == ActionType.INCREASE or action_type == ActionType.DECREASE:
                d[key] = val if action_type == ActionType.INCREASE else -val
            return

        current_val = d[key]
        d[key] = self._calculate_new_value(current_val, action_type, val)

    def evaluate_condition(self, condition: str, context: Dict[str, Any]) -> bool:
        """Evaluates a condition string in the context of this item and parameters."""
        if not condition or condition.strip() == "" or condition.strip().lower() == "true":
            return True
        try:
            eval_globals = {"__builtins__": {}}
            eval_locals = self.model_dump()
            eval_locals.update(context)
            return bool(eval(condition, eval_globals, eval_locals))
        except Exception as e:
            log.warning(f"Error evaluating condition '{condition}': {e}")
            return False

    def apply_action_with_rules(self, action: Action, context: Optional[Dict[str, Any]] = None) -> List[str]:
        """
        Evaluates rules that apply to this Action, modifies or executes them,
        and then applies the final action. Returns a list of logs/applied rule names.
        """
        ctx = context or {}
        ctx.update({
            "action_type": action.action_type.value,
            "target": action.target,
            "value": action.value
        })

        applied_rules = []
        # Pre-action rules: check if they should modify or intercept the action
        for rule in self.rules:
            if rule.trigger in ["pre_action", f"on_{action.action_type.value}"]:
                if self.evaluate_condition(rule.condition, ctx):
                    applied_rules.append(rule.name)
                    for rule_action in rule.actions:
                        self.apply_action(rule_action)

                    if "override_value" in rule.parameters:
                        action.value = rule.parameters["override_value"]
                    if "override_target" in rule.parameters:
                        action.target = rule.parameters["override_target"]

        # Apply the primary action
        self.apply_action(action)

        # Post-action rules
        for rule in self.rules:
            if rule.trigger == "post_action":
                if self.evaluate_condition(rule.condition, ctx):
                    applied_rules.append(rule.name)
                    for rule_action in rule.actions:
                        self.apply_action(rule_action)

        return applied_rules


class CraftingDbEntry(BaseModel):
    id: str
    item_id: str
    crafting_type: str
    data: Dict[str, Any]
    pickled_data: Optional[str] = None

    def deserialize(self) -> CraftingType:
        """Deserializes the data (or unpickles pickled_data) into the appropriate CraftingType subclass."""
        if self.pickled_data:
            try:
                if isinstance(self.pickled_data, str):
                    pickled_bytes = base64.b64decode(self.pickled_data)
                else:
                    pickled_bytes = self.pickled_data
                return pickle.loads(pickled_bytes)
            except Exception:
                pass

        cls = MODEL_REGISTRY.get(self.crafting_type)
        if cls:
            return cls.model_validate(self.data)

        return CraftingType.model_validate(self.data)


class CraftingManager(DBConnection):
    coll = None
    config = None

    def __init__(self):
        self.config = loadYamlDBConfig()
        super(CraftingManager, self).__init__(
            databaseName=self.config.get("dbName", "futurepathapi")
        )
        if self.db is None:
            raise Exception("ERROR: Unable to connect to DB!")
        self.coll = DBCollection(self, "crafted_items")

    def save_item(self, item: CraftingType) -> bool:
        """Saves or updates a CraftingType item in the database."""
        db_entry = item.to_db_entry()
        existing = self.coll.findOne({"item_id": item.id})
        if existing:
            return self.coll.update({"item_id": item.id}, db_entry.model_dump())
        return self.coll.insertOne(db_entry.model_dump())

    def get_item(self, item_id: str) -> Optional[CraftingType]:
        """Retrieves and deserializes a CraftingType item from the database."""
        doc = self.coll.findOne({"item_id": item_id})
        if not doc:
            return None
        db_entry = CraftingDbEntry.model_validate(doc)
        return db_entry.deserialize()

    def remove_item(self, item_id: str) -> bool:
        """Removes an item from the database."""
        return bool(self.coll.remove({"item_id": item_id}))
