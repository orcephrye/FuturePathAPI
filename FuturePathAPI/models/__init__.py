#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 07/13/2026

# Registry for CraftingType model subclasses.
MODEL_REGISTRY = {}

def register_model(arg=None):
    """
    Decorator to register a model class in MODEL_REGISTRY.
    Can be used as @register_model or @register_model("name").
    """
    def decorator(cls):
        name = None
        if isinstance(arg, str):
            name = arg
        elif hasattr(cls, "model_fields") and "item_type" in cls.model_fields:
            field = cls.model_fields["item_type"]
            from pydantic_core import PydanticUndefined
            if field.default is not PydanticUndefined:
                name = field.default
        if not name or not isinstance(name, str):
            name = cls.__name__
        MODEL_REGISTRY[name] = cls
        return cls

    if callable(arg):
        cls = arg
        arg = None
        return decorator(cls)
    else:
        return decorator

from FuturePathAPI.models.CraftingModels import (
    Action,
    ActionType,
    CraftingDbEntry,
    CraftingManager,
    CraftingType,
    Rule,
)

# Import model files to trigger registration
from FuturePathAPI.models.Armor import Armor, ArmorDr




