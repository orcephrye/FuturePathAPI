#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 07/13/2026
# Description: Crafting and Creation foundation models and DB manager

import logging
from typing import List, Literal, Optional

from pydantic import BaseModel, Field, model_validator

from FuturePathAPI.models import CraftingType, register_model

log = logging.getLogger("CraftingModels")


class ArmorCustomization(BaseModel):
    tech_level: int = Field(..., ge=0, le=4, description="Tech Level (AL) 0 to 4")
    masterwork_level: int = Field(0, ge=0, le=5, description="Masterwork Level (0 to 5)")
    masterwork_choices: List[Literal["slot", "point"]] = Field(
        default_factory=list,
        description="Choice per MW level: '+1 slot' or '+1 free point'"
    )
    points_spent: int = Field(0, ge=0, description="Total points spent.")
    number_of_improvements: int = Field(0, ge=0, description="Number of improvements.")
    negative_points_earned: int = Field(0, ge=0, description="Negative points earned.")

    @model_validator(mode="after")
    def validate_masterwork_choices_count(self) -> 'ArmorCustomization':
        if len(self.masterwork_choices) > self.masterwork_level:
            raise ValueError("Cannot more masterwork choices ie; adding Slots or Points, then the Masterwork Level")
        return self

    @property
    def customization_slots_provided_by_tl(self) -> int:
        return self.tech_level + 1

    @property
    def free_points_provided_by_tl(self) -> int:
        return int(max(self.tech_level - 1, 0))

    @property
    def total_points(self) -> int:
        return int((self.free_points_provided_by_tl +
                (self.negative_points_earned / 2) +
                len([i for i in self.masterwork_choices if i == "points"])))

    @property
    def remaining_points(self) -> int:
        return self.total_points - self.points_spent

    @property
    def customization_slots(self) -> int:
        return self.customization_slots_provided_by_tl + len([i for i in self.masterwork_choices if i == "slots"])

    @property
    def remaining_slots(self) -> int:
        return self.customization_slots - self.number_of_improvements



class SpecialAttributeConfig(BaseModel):
    """
    Configuration for optional special properties and attributes applied to Armor.
    """
    protection_combat_tech:  Optional[Literal["Push", "Disarm", "Grapple", "Overrun", "Trip", "Charge"]] = Field(None, description="Name of combat technique protected against")
    protection_combat_tech_count: int = Field(0, ge=0, description="The modifier for protection against combat technique is selected")
    regeneration_count: int = Field(0, ge=0, description="Regeneration level (Requires TL 2+)")
    stealth_assist_count: int = Field(0, ge=0, description="Stealth Assist level (Max = Tech Level)")
    weapon_mount_size: Optional[Literal["Small", "Medium", "Large"]] = Field(None, description="Weapon mount size if present")
    is_shirt: bool = Field(False, description="True if the armor is constructed as a Shirt (TL 1+)")
    quick_slots_count: int = Field(0, ge=0, description="Quick Slots count (Requires TL 1+)")
    is_clumsy: bool = Field(False, description="True if Clumsy penalty is active")
    is_archaic: bool = Field(False, description="True if Archaic penalty is active (TL 0)")

class ArmorDr(BaseModel):
    ac_traded_for_dr: int = Field(0, ge=0, description="Base AC traded for DR Units (1 AC = 4 DR units)")
    dr_units_from_trade: int = Field(0, ge=0, description="DR Units earned from trading AC")
    dr_units_from_points: int = Field(0, ge=0, description="DR Units earned from points")
    dr_chemical: int = Field(0, ge=0, description="DR Units spent on Chemical DR")
    dr_electrical: int = Field(0, ge=0, description="DR Units spent on Electrical DR")
    dr_thermal: int = Field(0, ge=0, description="DR Units spent on Thermal DR")
    dr_kinetic: int = Field(0, ge=0, description="DR Units spent on Kinetic DR (2 units = 1 DR)")
    dr_all: int = Field(0, ge=0, description="DR Units spent on All-Damage DR (4 units = 1 DR)")

    @property
    def dr_units(self) -> int:
        return self.dr_units_from_trade + self.dr_units_from_points

    @property
    def dr_units_spent(self) -> int:
        return int((self.dr_all * 4) + (self.dr_kinetic * 2) + self.dr_thermal + self.dr_chemical + self.dr_thermal)

    @property
    def dr_units_remaining(self) -> int:
        return self.dr_units - self.dr_units_spent

@register_model
class Armor(CraftingType):
    item_type: Literal["Armor"] = "Armor"
    level: int = Field(..., ge=0, le=9, description="Armor Level (AL) 0 to 9")
    ac_bonus: int = Field(1, ge=0, le=9, description="Base Armor Class AC bonus")
    max_dex_bonus: int = Field(9, ge=0, le=9, description="Base Maximum Dexterity Bonus allowed")
    speed_diff: Literal["Normal", "-5ft", "-10ft", "Halved"] = Field("Normal", description="Base speed penalty")
    weight_lbs: Literal[0.25, 5, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60] = Field(0.25, ge=0.25, description="Base weight of the armor at Tech Level 2 (lbs)")
    base_cost: float = Field(10, ge=10, description="Base cost in standard currency")
    procure_diff: int = Field(0, ge=0, le=5, description="Base procure difficulty modification")
    dr: ArmorDr = Field(default_factory=ArmorDr, description="Armor damage reduction configuration")
    specials: SpecialAttributeConfig = Field(default_factory=SpecialAttributeConfig)
    customization: ArmorCustomization = Field(default_factory=ArmorCustomization)
