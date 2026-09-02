#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.2
# Date: 07/13/2026
# Description: Armor Crafting, Creation, and Serialization models

import logging
from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel, Field, model_validator

from FuturePathAPI.models import register_model
from FuturePathAPI.models.CraftingModels import CraftingType

log = logging.getLogger("CraftingModels")

# Baseline armor attributes by Armor Level (AL 0 to 9) at Tech Level 2 Baseline
ARMOR_BASELINE_TABLE: Dict[int, Dict[str, Any]] = {
    0: {"ac_bonus": 0, "max_dex_bonus": 9, "speed_diff": "Normal", "weight_lbs": 0.25, "base_cost": 10.0, "procure_diff": 0},
    1: {"ac_bonus": 1, "max_dex_bonus": 8, "speed_diff": "Normal", "weight_lbs": 5.0, "base_cost": 150.0, "procure_diff": 0},
    2: {"ac_bonus": 2, "max_dex_bonus": 7, "speed_diff": "Normal", "weight_lbs": 10.0, "base_cost": 350.0, "procure_diff": 0},
    3: {"ac_bonus": 3, "max_dex_bonus": 6, "speed_diff": "Normal", "weight_lbs": 15.0, "base_cost": 1000.0, "procure_diff": 0},
    4: {"ac_bonus": 4, "max_dex_bonus": 5, "speed_diff": "-5ft", "weight_lbs": 20.0, "base_cost": 2200.0, "procure_diff": 0},
    5: {"ac_bonus": 5, "max_dex_bonus": 4, "speed_diff": "-5ft", "weight_lbs": 25.0, "base_cost": 4500.0, "procure_diff": 0},
    6: {"ac_bonus": 6, "max_dex_bonus": 3, "speed_diff": "-10ft", "weight_lbs": 30.0, "base_cost": 9000.0, "procure_diff": 1},
    7: {"ac_bonus": 7, "max_dex_bonus": 2, "speed_diff": "-10ft", "weight_lbs": 35.0, "base_cost": 18000.0, "procure_diff": 1},
    8: {"ac_bonus": 8, "max_dex_bonus": 1, "speed_diff": "Halved", "weight_lbs": 40.0, "base_cost": 30000.0, "procure_diff": 2},
    9: {"ac_bonus": 9, "max_dex_bonus": 0, "speed_diff": "Halved", "weight_lbs": 45.0, "base_cost": 55000.0, "procure_diff": 2},
}

# Tech Level baseline rules (TL 0 to 4)
TECH_LEVEL_TABLE: Dict[int, Dict[str, Any]] = {
    0: {"max_ac_or_dr": 5, "customization_slots": 1, "free_points": 0, "extra_base_cost": 0.0, "extra_procure_diff": 1, "is_archaic": True},
    1: {"max_ac_or_dr": 6, "customization_slots": 2, "free_points": 0, "extra_base_cost": 0.0, "extra_procure_diff": 0, "is_archaic": False},
    2: {"max_ac_or_dr": 7, "customization_slots": 3, "free_points": 1, "extra_base_cost": 250.0, "extra_procure_diff": 0, "is_archaic": False},
    3: {"max_ac_or_dr": 8, "customization_slots": 4, "free_points": 2, "extra_base_cost": 1000.0, "extra_procure_diff": 1, "is_archaic": False},
    4: {"max_ac_or_dr": 9, "customization_slots": 5, "free_points": 3, "extra_base_cost": 3000.0, "extra_procure_diff": 1, "is_archaic": False},
}


class ArmorCustomization(BaseModel):
    tech_level: int = Field(2, ge=0, le=4, description="Tech Level (TL) 0 to 4")
    masterwork_level: int = Field(0, ge=0, le=5, description="Masterwork Level (0 to 5)")
    masterwork_choices: List[Literal["slot", "point", "slots", "points"]] = Field(
        default_factory=list,
        description="Choice per MW level: '+1 slot' or '+1 free point'"
    )
    points_spent: int = Field(0, ge=0, description="Total customization points spent.")
    number_of_improvements: int = Field(0, ge=0, description="Number of improvements.")
    negative_points_earned: int = Field(0, ge=0, description="Negative points earned.")

    @model_validator(mode="after")
    def validate_masterwork_choices_count(self) -> 'ArmorCustomization':
        if len(self.masterwork_choices) > self.masterwork_level:
            raise ValueError("Cannot have more masterwork choices than the Masterwork Level")
        return self

    @property
    def customization_slots_provided_by_tl(self) -> int:
        return self.tech_level + 1

    @property
    def free_points_provided_by_tl(self) -> int:
        return int(max(self.tech_level - 1, 0))

    @property
    def masterwork_points(self) -> int:
        return len([i for i in self.masterwork_choices if i in ("point", "points")])

    @property
    def masterwork_slots(self) -> int:
        return len([i for i in self.masterwork_choices if i in ("slot", "slots")])

    @property
    def total_points(self) -> int:
        return int(
            self.free_points_provided_by_tl
            + (self.negative_points_earned // 2)
            + self.masterwork_points
        )

    @property
    def remaining_points(self) -> int:
        return self.total_points - self.points_spent

    @property
    def customization_slots(self) -> int:
        return self.customization_slots_provided_by_tl + self.masterwork_slots

    @property
    def remaining_slots(self) -> int:
        return self.customization_slots - self.number_of_improvements


class SpecialAttributeConfig(BaseModel):
    """
    Configuration for optional special properties and attributes applied to Armor.
    """
    protection_combat_tech: Optional[str] = Field(
        None,
        description="Name of combat technique protected against (e.g. Grapple, Disarm, Trip, Feint, Push, Charge)"
    )
    protection_combat_tech_count: int = Field(0, ge=0, description="Number of times protection against combat technique is taken")
    regeneration_count: int = Field(0, ge=0, description="Regeneration level (Requires TL 2+)")
    stealth_assist_count: int = Field(0, ge=0, description="Stealth Assist level (Max = Tech Level)")
    weapon_mount_size: Optional[Literal["Small", "Medium", "Large"]] = Field(None, description="Weapon mount size if present")
    is_shirt: bool = Field(False, description="True if the armor is constructed as a Shirt (TL 1+)")
    quick_slots_count: int = Field(0, ge=0, description="Quick Slots count (Requires TL 1+)")
    is_clumsy: bool = Field(False, description="True if Clumsy penalty is active")
    is_archaic: bool = Field(False, description="True if Archaic penalty is active (TL 0)")

    @property
    def combat_tech_ac_bonus(self) -> int:
        """Calculates AC bonus against the chosen Combat Technique (+4 initially, +2 per extra point; +2 on Shirts)."""
        if self.protection_combat_tech_count <= 0 or not self.protection_combat_tech:
            return 0
        base = 2 if self.is_shirt else 4
        return base + ((self.protection_combat_tech_count - 1) * 2)

    @property
    def weapon_mount_weight_lbs(self) -> float:
        """Weight added by weapon mount (Small=5 lbs, Medium=10 lbs, Large=15 lbs)."""
        if self.weapon_mount_size == "Small":
            return 5.0
        elif self.weapon_mount_size == "Medium":
            return 10.0
        elif self.weapon_mount_size == "Large":
            return 15.0
        return 0.0

    @property
    def weapon_mount_slots_used(self) -> int:
        """Customization slots consumed by weapon mount (Small=1, Medium=2, Large=3)."""
        if self.weapon_mount_size == "Small":
            return 1
        elif self.weapon_mount_size == "Medium":
            return 2
        elif self.weapon_mount_size == "Large":
            return 3
        return 0

    @property
    def stealth_bonus(self) -> int:
        """Stealth skill bonus (+2 per point spent)."""
        return self.stealth_assist_count * 2


class ArmorDr(BaseModel):
    ac_traded_for_dr: int = Field(0, ge=0, description="Base AC traded for DR Units (1 AC = 4 DR units)")
    dr_units_from_trade: int = Field(0, ge=0, description="DR Units earned from trading AC")
    dr_units_from_points: int = Field(0, ge=0, description="DR Units earned from customization points (1 CP = 2 DR units)")
    dr_chemical: int = Field(0, ge=0, description="Specific Chemical DR (1 unit = 1 DR)")
    dr_electrical: int = Field(0, ge=0, description="Specific Electrical DR (1 unit = 1 DR)")
    dr_thermal: int = Field(0, ge=0, description="Specific Thermal DR (1 unit = 1 DR)")
    dr_kinetic: int = Field(0, ge=0, description="Specific Kinetic DR (2 units = 1 DR)")
    dr_all: int = Field(0, ge=0, description="All-Damage DR (4 units = 1 DR)")

    @model_validator(mode="after")
    def sync_dr_trade_units(self) -> 'ArmorDr':
        if self.ac_traded_for_dr > 0 and self.dr_units_from_trade == 0:
            self.dr_units_from_trade = self.ac_traded_for_dr * 4
        return self

    @property
    def dr_units(self) -> int:
        trade_units = self.ac_traded_for_dr * 4 if (self.dr_units_from_trade == 0 and self.ac_traded_for_dr > 0) else self.dr_units_from_trade
        return trade_units + self.dr_units_from_points

    @property
    def dr_units_spent(self) -> int:
        return int(
            (self.dr_all * 4)
            + (self.dr_kinetic * 2)
            + self.dr_chemical
            + self.dr_electrical
            + self.dr_thermal
        )

    @property
    def dr_units_remaining(self) -> int:
        return self.dr_units - self.dr_units_spent

    def get_effective_dr(self, damage_type: str) -> int:
        """Returns the total DR against a given damage type (capped at 10)."""
        dt = damage_type.strip().lower()
        specific = 0
        if dt in ("chemical", "c"):
            specific = self.dr_chemical
        elif dt in ("electrical", "electric", "e"):
            specific = self.dr_electrical
        elif dt in ("thermal", "t"):
            specific = self.dr_thermal
        elif dt in ("kinetic", "k"):
            specific = self.dr_kinetic
        return min(10, self.dr_all + specific)

    @property
    def dr_summary(self) -> str:
        """Returns a standard summary string of the DR configuration."""
        parts = []
        if self.dr_all > 0:
            parts.append(f"{self.dr_all} DR (A)")
        if self.dr_kinetic > 0:
            parts.append(f"{self.dr_kinetic} DR (K)")
        spec = []
        if self.dr_chemical > 0:
            spec.append(f"{self.dr_chemical}C")
        if self.dr_electrical > 0:
            spec.append(f"{self.dr_electrical}E")
        if self.dr_thermal > 0:
            spec.append(f"{self.dr_thermal}T")
        if spec:
            parts.append(f"DR ({', '.join(spec)})")
        return ", ".join(parts) if parts else "0"


@register_model
class Armor(CraftingType):
    item_type: Literal["Armor"] = "Armor"
    level: int = Field(..., ge=0, le=9, description="Armor Level (AL) 0 to 9")
    ac_bonus: int = Field(0, ge=0, le=9, description="Base Armor Class AC bonus")
    max_dex_bonus: int = Field(9, ge=0, le=9, description="Base Maximum Dexterity Bonus allowed")
    speed_diff: Literal["Normal", "-5ft", "-10ft", "Halved"] = Field("Normal", description="Base speed penalty")
    weight_lbs: float = Field(0.25, ge=0.0, description="Base weight of the armor at Tech Level 2 (lbs)")
    base_cost: float = Field(10.0, ge=0.0, description="Base cost in ISK")
    procure_diff: int = Field(0, ge=0, le=10, description="Base procure difficulty modification")
    dr: ArmorDr = Field(default_factory=ArmorDr, description="Armor damage reduction configuration")
    specials: SpecialAttributeConfig = Field(default_factory=SpecialAttributeConfig, description="Special armor attributes")
    customization: ArmorCustomization = Field(default_factory=ArmorCustomization, description="Armor customization and masterwork configuration")

    @classmethod
    def create_base(
        cls,
        item_id: str,
        name: str,
        level: int,
        tech_level: int = 2,
        description: str = ""
    ) -> 'Armor':
        """
        Factory method to create a standard base Armor initialized with table defaults.
        """
        base_data = ARMOR_BASELINE_TABLE.get(level, ARMOR_BASELINE_TABLE[0])
        tl_data = TECH_LEVEL_TABLE.get(tech_level, TECH_LEVEL_TABLE[2])
        return cls(
            id=item_id,
            name=name,
            description=description,
            level=level,
            ac_bonus=base_data["ac_bonus"],
            max_dex_bonus=base_data["max_dex_bonus"],
            speed_diff=base_data["speed_diff"],
            weight_lbs=base_data["weight_lbs"],
            base_cost=base_data["base_cost"],
            procure_diff=base_data["procure_diff"],
            specials=SpecialAttributeConfig(is_archaic=tl_data.get("is_archaic", False)),
            customization=ArmorCustomization(tech_level=tech_level)
        )

    @property
    def effective_ac(self) -> int:
        """Effective AC after accounting for AC traded out for DR."""
        return max(0, self.ac_bonus - self.dr.ac_traded_for_dr)

    @property
    def effective_weight_lbs(self) -> float:
        """
        Calculates effective weight taking Tech Level adjustments into account:
        - TL 0-1: +5 lbs per TL below TL 2 (+5 for TL 1, +10 for TL 0)
        - TL 3-4: -5 lbs per TL above TL 2 (-5 for TL 3, -10 for TL 4)
        - AL 0 is unaffected. AL 1+ minimum weight is 1 lb per Armor Level.
        - Adds weapon mount weight if installed.
        """
        mount_weight = self.specials.weapon_mount_weight_lbs
        if self.level == 0:
            return round(self.weight_lbs + mount_weight, 2)

        tl_diff = 2 - self.customization.tech_level
        adjusted_weight = self.weight_lbs + (tl_diff * 5.0)
        min_weight = float(self.level * 1.0)
        final_weight = max(min_weight, adjusted_weight) + mount_weight
        return round(final_weight, 2)

    @property
    def is_heavy(self) -> bool:
        """Heavy Armor is defined as any armor weighing 35 lbs or more."""
        return self.effective_weight_lbs >= 35.0

    @property
    def effective_speed_diff(self) -> Literal["Normal", "-5ft", "-10ft", "Halved"]:
        """Calculates effective speed differential."""
        if self.specials.is_clumsy:
            return "Halved"
        return self.speed_diff

    @property
    def technique_failure_chance(self) -> int:
        """Speed diff technique failure percentage (0%, 10%, 20%, 40%)."""
        mapping = {"Normal": 0, "-5ft": 10, "-10ft": 20, "Halved": 40}
        return mapping.get(self.effective_speed_diff, 0)

    @property
    def combat_technique_disadvantage_level(self) -> int:
        """Disadvantage count on Disarm, Feint, Combination Melee Attack, and Melee Kick."""
        mapping = {"Normal": 0, "-5ft": 1, "-10ft": 2, "Halved": 3}
        return mapping.get(self.effective_speed_diff, 0)

    @property
    def tl_extra_base_cost(self) -> float:
        """Extra Base Cost added by the Tech Level."""
        return TECH_LEVEL_TABLE.get(self.customization.tech_level, {}).get("extra_base_cost", 0.0)

    @property
    def effective_base_cost(self) -> float:
        """
        Base Cost for pricing:
        - For AL 0: Treated as $75 + TL Extra Base Cost for masterworking and customizations.
        - For AL 1+: Baseline Base Cost + TL Extra Base Cost.
        """
        if self.level == 0:
            return 75.0 + self.tl_extra_base_cost
        return self.base_cost + self.tl_extra_base_cost

    @property
    def total_cost(self) -> float:
        """
        Calculates final total cost of the Armor:
        Total = Base Cost * (1 + Masterwork Level + Customization Points Spent).
        Doubled if constructed as a Shirt.
        """
        base = self.effective_base_cost
        multiplier = 1 + self.customization.masterwork_level + self.customization.points_spent
        cost = base * multiplier
        if self.specials.is_shirt:
            cost *= 2.0
        return round(cost, 2)

    @property
    def total_procure_diff(self) -> int:
        """Total Procure Difficulty including base, Tech Level, and special attributes."""
        tl_extra = TECH_LEVEL_TABLE.get(self.customization.tech_level, {}).get("extra_procure_diff", 0)
        regen_diff = 1 if self.specials.regeneration_count > 0 else 0
        return self.procure_diff + tl_extra + regen_diff

    @property
    def required_proficiency_level(self) -> int:
        """Required Armor Proficiency Level (Archaic TL 0 or Clumsy adds +1)."""
        is_archaic = self.specials.is_archaic or (self.customization.tech_level == 0)
        archaic_mod = 1 if is_archaic else 0
        return self.level + archaic_mod

    @property
    def craft_dc(self) -> int:
        """Craft DC = 12 + Tech Level + Armor Level + (2 per Masterwork level)."""
        return 12 + self.customization.tech_level + self.level + (2 * self.customization.masterwork_level)

    @property
    def structural_rank_required(self) -> int:
        """Structural skill rank required (Rank 1: 0-3, Rank 2: 4-5, Rank 3: 6-7, Rank 4: 8-9; Masterworking requires Rank 6+)."""
        if self.customization.masterwork_level > 0:
            return 6
        if self.level <= 3:
            return 1
        elif self.level <= 5:
            return 2
        elif self.level <= 7:
            return 3
        return 4

    @property
    def craft_time_days(self) -> int:
        """Crafting time: 1 day per Skill Rank requirement (excluding masterwork)."""
        if self.level <= 3:
            return 1
        elif self.level <= 5:
            return 2
        elif self.level <= 7:
            return 3
        return 4

    @property
    def craft_supply_cost(self) -> float:
        """Crafting supplies cost: 1/2 of the total item cost."""
        return round(self.total_cost / 2.0, 2)

    def recraft_dc(self, up_tech: bool = False, masterworking: bool = False) -> int:
        """DC modifier for re-crafting: normal craft DC + 1 (Up-Teching) + 1 (Masterworking)."""
        dc = self.craft_dc
        if up_tech:
            dc += 1
        if masterworking:
            dc += 1
        return dc
