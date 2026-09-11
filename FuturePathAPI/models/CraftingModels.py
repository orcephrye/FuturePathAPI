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
from typing import Any, Dict, List, Optional, Union

from pydantic import AliasChoices, BaseModel, Field, model_validator

from FuturePathAPI.libs import DBCollection, DBConnection, loadYamlDBConfig
from FuturePathAPI.models import MODEL_REGISTRY

log = logging.getLogger("CraftingModels")

class ActionType(str, Enum):
    ADD = "add"
    REMOVE = "remove"
    INCREASE = "increase"
    DECREASE = "decrease"
    REPLACE = "replace"

class ConditionOperator(str, Enum):
    EXACTLY_MATCHES = "exactly matches"
    DOES_NOT_MATCH = "does not match"
    IS_GREATER_THAN = "is greater than"
    IS_GREATER_THAN_OR_EQUAL = "is greater than or equal to"
    IS_LESS_THAN = "is less than"
    IS_LESS_THAN_OR_EQUAL = "is less than or equal to"
    IN = "in"
    NOT_IN = "not in"
    CONTAINS = "contains"
    DOES_NOT_CONTAIN = "does not contain"
    STARTS_WITH = "starts with"
    ENDS_WITH = "ends with"
    IS_NULL = "is null"
    IS_NOT_NULL = "is not null"

OperatorType = ConditionOperator
ConditionOperatorType = ConditionOperator


class Target(BaseModel):
    """
    Represents a target pointer to a JSON object or model attribute value using dot notation (e.g. '.key1.key2').
    Used for dynamic field-to-field comparisons in Conditions.
    """
    path: str = Field(..., description="Path pointing to a JSON or object attribute, e.g. '.key1.key2'")

    @model_validator(mode="before")
    @classmethod
    def validate_input(cls, data: Any) -> Any:
        if isinstance(data, str):
            return {"path": data}
        if isinstance(data, Target):
            return {"path": data.path}
        return data

    def __init__(self, path: Optional[Union[str, "Target"]] = None, **data):
        if isinstance(path, Target):
            data["path"] = path.path
        elif isinstance(path, str) and "path" not in data and "target" not in data:
            data["path"] = path
        elif "target" in data and "path" not in data:
            data["path"] = data.pop("target")
        super().__init__(**data)

    def __str__(self) -> str:
        return self.path

    def __repr__(self) -> str:
        return f"Target({self.path!r})"

    def __eq__(self, other: Any) -> bool:
        if isinstance(other, Target):
            return self.path == other.path
        if isinstance(other, str):
            return self.path == other
        return super().__eq__(other)

    def __hash__(self) -> int:
        return hash(self.path)

    def resolve(self, context: Any) -> Any:
        return Target.resolve_target_value(self.path, context)

    @staticmethod
    def resolve_target_value(path_input: Union[str, Any], context: Any) -> Any:
        """
        Resolves a target path (e.g. '.key1.key2' or 'attributes.strength') against context data (dict or object).
        """
        path = (path_input.path if isinstance(path_input, Target) else str(path_input)).strip()
        if path.startswith("."):
            path = path[1:]
        parts = path.split(".") if path else []
        if not parts:
            return None

        curr = context
        for part in parts:
            if curr is None:
                return None
            if isinstance(curr, dict) and part in curr:
                curr = curr[part]
            elif hasattr(curr, part):
                curr = getattr(curr, part)
            elif isinstance(curr, (list, tuple)) and part.isdigit() and int(part) < len(curr):
                curr = curr[int(part)]
            elif hasattr(curr, "attributes") and isinstance(curr.attributes, dict) and part in curr.attributes:
                curr = curr.attributes[part]
            elif hasattr(curr, "_get_target_attr"):
                try:
                    curr = curr._get_target_attr(part)
                except Exception:
                    return None
            else:
                return None
        return curr


class Action(BaseModel):
    action_type: Optional[ActionType] = None
    target: Optional[Union[Target, str]] = None
    value: Any = None
    parameters: Dict[str, Any] = Field(default_factory=dict)

    def compare(self, trigger: "Action") -> bool:
        return Action.compare_actions(self, trigger)

    @staticmethod
    def compare_actions(action: "Action", trigger: "Action") -> bool:
        """
        Compares an Action about to be applied against a Rule's trigger Action.
        Assumes the first parameter is the Action about to be applied and the
        second parameter is the Rule's trigger Action.
        Only compares filled-in values on the trigger.

        :param action: The Action about to be applied.
        :param trigger: The Rule's trigger Action.
        :return: True if all filled-in values on the trigger match the action, False otherwise.
        """
        if not isinstance(action, Action) or not isinstance(trigger, Action):
            return False

        if trigger.action_type is not None:
            if action.action_type != trigger.action_type:
                return False

        if trigger.target is not None:
            trig_target = trigger.target.path if isinstance(trigger.target, Target) else str(trigger.target)
            if trig_target.strip() != "":
                act_target = action.target.path if isinstance(action.target, Target) else str(action.target or "")
                if trig_target.lstrip(".") != act_target.lstrip("."):
                    return False

        if trigger.value is not None:
            if action.value != trigger.value:
                return False

        if trigger.parameters:
            for k, v in trigger.parameters.items():
                if k not in action.parameters or action.parameters[k] != v:
                    return False

        return True

    def matches(self, trigger: "Action") -> bool:
        """
        Object method using Action.compare with self as the Action about to be applied.

        :param trigger: The Rule's trigger Action.
        :return: True if this action matches the trigger, False otherwise.
        """
        return Action.compare_actions(self, trigger)

    def compare_to(self, trigger: "Action") -> bool:
        """
        Object method using Action.compare with self as the Action about to be applied.

        :param trigger: The Rule's trigger Action.
        :return: True if this action matches the trigger, False otherwise.
        """
        return Action.compare_actions(self, trigger)

    def is_triggered_by(self, action: "Action") -> bool:
        """
        Object method when called on a trigger Action to test if an applied action triggers it.

        :param action: The Action about to be applied.
        :return: True if the action triggers this, False otherwise.
        """
        return Action.compare_actions(action, self)


class Condition(BaseModel):
    """
    Evaluates an operator on a target field against a comparison value.
    The comparison value is strictly a Target, int, or str.
    """
    operator: ConditionOperator = Field(..., description="SQL-like comparison operator (e.g. 'exactly matches', 'is greater than', 'in', 'contains', 'does not contain').")
    value: Union[Target, int, str] = Field(..., description="Comparison value. Can be a Target (field pointer), int, or str.")

    @property
    def targets_field(self) -> str:
        return "target" if isinstance(self.value, Target) else "static"

    @property
    def is_value_target_static(self) -> bool:
        return self.targets_field == "static"

    @property
    def is_value_target(self) -> bool:
        return self.targets_field == "target"

    def evaluate(self, target_field: Union[Target, str], context: Any) -> bool:
        """
        Evaluates this Condition against context data for a given target field.

        :param target_field: The target field that the comparison operator works on.
        :param context: The context data (dict or model instance) to grab values from.
        :return: True if the condition holds, False otherwise.
        """
        left = Target.resolve_target_value(target_field, context)
        if self.is_value_target or isinstance(self.value, Target):
            right = Target.resolve_target_value(self.value, context)
        else:
            right = self.value

        op = self.operator
        try:
            if op == ConditionOperator.EXACTLY_MATCHES:
                return left == right
            elif op == ConditionOperator.DOES_NOT_MATCH:
                return left != right
            elif op == ConditionOperator.IS_GREATER_THAN:
                if left is None or right is None:
                    return False
                if isinstance(left, (int, float, str)) and isinstance(right, (int, float, str)):
                    try:
                        return float(left) > float(right)
                    except (ValueError, TypeError):
                        pass
                return left > right
            elif op == ConditionOperator.IS_GREATER_THAN_OR_EQUAL:
                if left is None or right is None:
                    return False
                if isinstance(left, (int, float, str)) and isinstance(right, (int, float, str)):
                    try:
                        return float(left) >= float(right)
                    except (ValueError, TypeError):
                        pass
                return left >= right
            elif op == ConditionOperator.IS_LESS_THAN:
                if left is None or right is None:
                    return False
                if isinstance(left, (int, float, str)) and isinstance(right, (int, float, str)):
                    try:
                        return float(left) < float(right)
                    except (ValueError, TypeError):
                        pass
                return left < right
            elif op == ConditionOperator.IS_LESS_THAN_OR_EQUAL:
                if left is None or right is None:
                    return False
                if isinstance(left, (int, float, str)) and isinstance(right, (int, float, str)):
                    try:
                        return float(left) <= float(right)
                    except (ValueError, TypeError):
                        pass
                return left <= right
            elif op == ConditionOperator.IN:
                if right is None:
                    return False
                return left in right
            elif op == ConditionOperator.NOT_IN:
                if right is None:
                    return True
                return left not in right
            elif op == ConditionOperator.CONTAINS:
                if left is None or right is None:
                    return False
                if isinstance(left, (list, tuple, set, dict)):
                    return right in left
                return str(right).lower() in str(left).lower()
            elif op == ConditionOperator.DOES_NOT_CONTAIN:
                if left is None or right is None:
                    return True
                if isinstance(left, (list, tuple, set, dict)):
                    return right not in left
                return str(right).lower() not in str(left).lower()
            elif op == ConditionOperator.STARTS_WITH:
                if left is None or right is None:
                    return False
                return str(left).startswith(str(right))
            elif op == ConditionOperator.ENDS_WITH:
                if left is None or right is None:
                    return False
                return str(left).endswith(str(right))
            elif op == ConditionOperator.IS_NULL:
                return left is None
            elif op == ConditionOperator.IS_NOT_NULL:
                return left is not None
        except Exception as e:
            log.warning(f"Error evaluating condition ({self}): {e}")
            return False
        return False


class RuleTiming(str, Enum):
    BEFORE = "before"
    AFTER = "after"


class Rule(BaseModel):
    id: str
    name: str
    timing: RuleTiming = Field(
        default=RuleTiming.BEFORE,
        description="Toggle between running before the Action is applied ('before') or afterwards ('after')."
    )
    trigger: Optional[Union[Action, str]] = Field(
        default=None,
        description="Trigger Action that activates this Rule when matched."
    )
    target: Optional[str] = Field(
        default=None,
        validation_alias=AliasChoices("target", "target_field", "field"),
        description="The target field that the comparison operator works on."
    )
    condition: Optional[Union[Condition, str]] = None
    actions: List[Action] = Field(default_factory=list)
    parameters: Dict[str, Any] = Field(default_factory=dict)

    @property
    def run_before(self) -> bool:
        return self.timing == RuleTiming.BEFORE

    @property
    def run_after(self) -> bool:
        return self.timing == RuleTiming.AFTER

    @model_validator(mode="before")
    @classmethod
    def normalize_rule(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "run_before" in data and "timing" not in data:
                data["timing"] = RuleTiming.BEFORE if data.pop("run_before") else RuleTiming.AFTER
            elif "timing" in data:
                t = str(data["timing"]).strip().lower()
                if t in ("before", "pre", "true"):
                    data["timing"] = RuleTiming.BEFORE
                elif t in ("after", "post", "false"):
                    data["timing"] = RuleTiming.AFTER
        return data


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
        target = action.target.path if isinstance(action.target, Target) else str(action.target or "")
        if target.startswith("."):
            target = target[1:]
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

    def _rule_matches_action(self, rule: Rule, action: Action) -> bool:
        if rule.trigger is None:
            return True
        if isinstance(rule.trigger, Action):
            return Action.compare(action, rule.trigger)
        if isinstance(rule.trigger, str):
            trig = rule.trigger.strip().lower()
            if trig in ("pre_action", "post_action"):
                return True
            action_type_val = action.action_type.value if action.action_type else ""
            if trig in (f"on_{action_type_val}", action_type_val):
                return True
        return False

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

    def evaluate_condition(
        self,
        condition: Union[Condition, str, None],
        context: Optional[Dict[str, Any]] = None,
        target_field: Optional[Union[Target, str]] = None,
    ) -> bool:
        """Evaluates a Condition model or legacy condition string in the context of this item and parameters."""
        if condition is None:
            return True
        ctx = context or {}
        if isinstance(condition, Condition):
            merged_context = self.model_dump()
            merged_context.update(ctx)
            tf = target_field or "target"
            return condition.evaluate(tf, merged_context)
        if isinstance(condition, str):
            if not condition or condition.strip() == "" or condition.strip().lower() == "true":
                return True
            try:
                eval_globals = {"__builtins__": {}}
                eval_locals = self.model_dump()
                eval_locals.update(ctx)
                return bool(eval(condition, eval_globals, eval_locals))
            except Exception as e:
                log.warning(f"Error evaluating condition '{condition}': {e}")
                return False
        return False

    def apply_action_with_rules(self, action: Action, context: Optional[Dict[str, Any]] = None) -> List[str]:
        """
        Evaluates rules that apply to this Action, modifies or executes them,
        and then applies the final action. Returns a list of logs/applied rule names.
        """
        ctx = context or {}
        act_target = action.target.path if isinstance(action.target, Target) else str(action.target or "")
        ctx.update({
            "action_type": action.action_type.value if action.action_type else "",
            "target": act_target,
            "value": action.value
        })

        applied_rules = []
        # Pre-action rules: check if they should modify or intercept the action
        for rule in self.rules:
            if rule.run_before:
                if self._rule_matches_action(rule, action):
                    target_field = rule.target or act_target
                    if self.evaluate_condition(rule.condition, ctx, target_field=target_field):
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
            if not rule.run_before:
                if self._rule_matches_action(rule, action):
                    target_field = rule.target or act_target
                    if self.evaluate_condition(rule.condition, ctx, target_field=target_field):
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
