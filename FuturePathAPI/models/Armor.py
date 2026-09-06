#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.2
# Date: 07/13/2026
# Description: Armor Crafting, Creation, and Serialization models

import logging
from typing import Any, Dict, List, Literal, Optional, Tuple

from pydantic import BaseModel, Field, computed_field, model_validator

from FuturePathAPI.libs.ArmorReferenceData import (
    ARMOR_BASELINE_TABLE,
    TECH_LEVEL_TABLE,
)
from FuturePathAPI.models import register_model
from FuturePathAPI.models.CraftingModels import CraftingType

log = logging.getLogger("CraftingModels")

# Speed diff tiers in ascending order of penalty
SPEED_TIERS = ["Normal", "-5ft", "-10ft", "Halved"]


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
    diminished_attributes: List[str] = Field(
        default_factory=list,
        description="List of attributes that have been diminished"
    )
    improved_attributes: List[str] = Field(
        default_factory=list,
        description="List of attributes that have been improved"
    )
    customization_log: List[dict] = Field(
        default_factory=list,
        description="Audit log of customizations and adjustments applied"
    )

    @model_validator(mode="after")
    def validate_masterwork_choices_count(self) -> 'ArmorCustomization':
        if len(self.masterwork_choices) > self.masterwork_level:
            raise ValueError("Cannot have more masterwork choices than the Masterwork Level")
        return self

    @computed_field
    @property
    def customization_slots_provided_by_tl(self) -> int:
        return self.tech_level + 1

    @computed_field
    @property
    def free_points_provided_by_tl(self) -> int:
        return int(max(self.tech_level - 1, 0))

    @computed_field
    @property
    def masterwork_points(self) -> int:
        return len([i for i in self.masterwork_choices if i in ("point", "points")])

    @computed_field
    @property
    def masterwork_slots(self) -> int:
        return len([i for i in self.masterwork_choices if i in ("slot", "slots")])

    @computed_field
    @property
    def total_points(self) -> int:
        return int(
            self.free_points_provided_by_tl
            + (self.negative_points_earned // 2)
            + self.masterwork_points
        )

    @computed_field
    @property
    def remaining_points(self) -> int:
        return self.total_points - self.points_spent

    @computed_field
    @property
    def customization_slots(self) -> int:
        return self.customization_slots_provided_by_tl + self.masterwork_slots

    @computed_field
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

    @computed_field
    @property
    def combat_tech_ac_bonus(self) -> int:
        """Calculates AC bonus against the chosen Combat Technique (+4 initially, +2 per extra point; +2 on Shirts)."""
        if self.protection_combat_tech_count <= 0 or not self.protection_combat_tech:
            return 0
        base = 2 if self.is_shirt else 4
        return base + ((self.protection_combat_tech_count - 1) * 2)

    @computed_field
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

    @computed_field
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

    @computed_field
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

    @computed_field
    @property
    def dr_units(self) -> int:
        trade_units = self.ac_traded_for_dr * 4 if (self.dr_units_from_trade == 0 and self.ac_traded_for_dr > 0) else self.dr_units_from_trade
        return trade_units + self.dr_units_from_points

    @computed_field
    @property
    def dr_units_spent(self) -> int:
        return int(
            (self.dr_all * 4)
            + (self.dr_kinetic * 2)
            + self.dr_chemical
            + self.dr_electrical
            + self.dr_thermal
        )

    @computed_field
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

    @computed_field
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
    ac_bonus: int = Field(0, ge=0, le=20, description="Base Armor Class AC bonus")
    max_dex_bonus: int = Field(9, ge=0, le=20, description="Base Maximum Dexterity Bonus allowed")
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

    @computed_field
    @property
    def dr_summary(self) -> str:
        """Returns the DR summary string."""
        return self.dr.dr_summary

    @computed_field
    @property
    def effective_dr(self) -> dict:
        """Returns the breakdown of effective DR against various damage types."""
        return {
            "all": self.dr.dr_all,
            "kinetic": self.dr.get_effective_dr("kinetic"),
            "chemical": self.dr.get_effective_dr("chemical"),
            "electrical": self.dr.get_effective_dr("electrical"),
            "thermal": self.dr.get_effective_dr("thermal"),
        }

    @computed_field
    @property
    def effective_ac(self) -> int:
        """Effective AC after accounting for AC traded out for DR."""
        return max(0, self.ac_bonus - self.dr.ac_traded_for_dr)

    @computed_field
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

    @computed_field
    @property
    def is_heavy(self) -> bool:
        """Heavy Armor is defined as any armor weighing 35 lbs or more."""
        return self.effective_weight_lbs >= 35.0

    @computed_field
    @property
    def effective_speed_diff(self) -> Literal["Normal", "-5ft", "-10ft", "Halved"]:
        """Calculates effective speed differential."""
        if self.specials.is_clumsy:
            return "Halved"
        return self.speed_diff

    @computed_field
    @property
    def technique_failure_chance(self) -> int:
        """Speed diff technique failure percentage (0%, 10%, 20%, 40%)."""
        mapping = {"Normal": 0, "-5ft": 10, "-10ft": 20, "Halved": 40}
        return mapping.get(self.effective_speed_diff, 0)

    @computed_field
    @property
    def combat_technique_disadvantage_level(self) -> int:
        """Disadvantage count on Disarm, Feint, Combination Melee Attack, and Melee Kick."""
        mapping = {"Normal": 0, "-5ft": 1, "-10ft": 2, "Halved": 3}
        return mapping.get(self.effective_speed_diff, 0)

    @computed_field
    @property
    def tl_extra_base_cost(self) -> float:
        """Extra Base Cost added by the Tech Level."""
        return TECH_LEVEL_TABLE.get(self.customization.tech_level, {}).get("extra_base_cost", 0.0)

    @computed_field
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

    @computed_field
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

    @computed_field
    @property
    def total_procure_diff(self) -> int:
        """Total Procure Difficulty including base, Tech Level, and special attributes."""
        tl_extra = TECH_LEVEL_TABLE.get(self.customization.tech_level, {}).get("extra_procure_diff", 0)
        regen_diff = 1 if self.specials.regeneration_count > 0 else 0
        return self.procure_diff + tl_extra + regen_diff

    @computed_field
    @property
    def required_proficiency_level(self) -> int:
        """Required Armor Proficiency Level (Archaic TL 0 or Clumsy adds +1)."""
        is_archaic = self.specials.is_archaic or (self.customization.tech_level == 0)
        archaic_mod = 1 if is_archaic else 0
        return self.level + archaic_mod

    @computed_field
    @property
    def craft_dc(self) -> int:
        """Craft DC = 12 + Tech Level + Armor Level + (2 per Masterwork level)."""
        return 12 + self.customization.tech_level + self.level + (2 * self.customization.masterwork_level)

    @computed_field
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

    @computed_field
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

    @computed_field
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

    def trade_ac_for_dr(
        self,
        trade_ac: Optional[int] = None,
        ac_traded_for_dr: Optional[int] = None,
        force: bool = False
    ) -> str:
        """
        Trades AC bonus for DR Units (1 AC = 4 DR Units).
        All AC to DR trading must happen before customization points are spent, unless force=True.
        """
        if (self.customization.points_spent > 0 or self.customization.negative_points_earned > 0) and not force:
            raise ValueError("All AC to DR trading must happen before customization points are earned or spent. Pass force=True to override.")

        if ac_traded_for_dr is not None:
            target_trade = int(ac_traded_for_dr)
        elif trade_ac is not None:
            target_trade = self.dr.ac_traded_for_dr + int(trade_ac)
        else:
            raise ValueError("Must specify either trade_ac (delta) or ac_traded_for_dr (total).")

        if target_trade < 0:
            raise ValueError(f"Cannot trade negative AC ({target_trade}).")

        if target_trade > self.ac_bonus:
            raise ValueError(f"Cannot trade {target_trade} AC. Armor only has {self.ac_bonus} base AC bonus (effective AC cannot drop below 0).")

        if target_trade < self.dr.ac_traded_for_dr:
            units_lost = (self.dr.ac_traded_for_dr - target_trade) * 4
            if self.dr.dr_units_remaining < units_lost:
                raise ValueError(
                    f"Cannot reduce traded AC by {self.dr.ac_traded_for_dr - target_trade} AC because {units_lost} DR units would be removed, but {self.dr.dr_units_spent} DR units are already spent."
                )

        old_trade = self.dr.ac_traded_for_dr
        self.dr.ac_traded_for_dr = target_trade
        self.dr.dr_units_from_trade = target_trade * 4

        self.customization.customization_log.append({
            "action": "trade_dr",
            "previous_ac_traded": old_trade,
            "new_ac_traded": target_trade,
            "dr_units_from_trade": self.dr.dr_units_from_trade,
            "effective_ac": self.effective_ac,
        })
        return f"Traded {target_trade} AC for {target_trade * 4} DR Units. Effective AC is now {self.effective_ac}."

    def spend_dr_units(
        self,
        dr_chemical: Optional[int] = None,
        dr_electrical: Optional[int] = None,
        dr_thermal: Optional[int] = None,
        dr_kinetic: Optional[int] = None,
        dr_all: Optional[int] = None,
        dr_type: Optional[str] = None,
        amount: Optional[int] = None,
        mode: str = "add"
    ) -> str:
        """
        Allocates available DR Units to specific or all-damage DR:
        1 unit = 1 Chemical/Electrical/Thermal, 2 units = 1 Kinetic, 4 units = 1 ALL.
        Total DR against any damage type capped at 10.
        """
        mode = mode.lower()
        new_chem = self.dr.dr_chemical
        new_elec = self.dr.dr_electrical
        new_therm = self.dr.dr_thermal
        new_kin = self.dr.dr_kinetic
        new_all = self.dr.dr_all

        if dr_type is not None and amount is not None:
            dt = dr_type.strip().lower()
            amt = int(amount)
            if dt in ("all", "a"):
                new_all = amt if mode == "set" else new_all + amt
            elif dt in ("kinetic", "k"):
                new_kin = amt if mode == "set" else new_kin + amt
            elif dt in ("chemical", "c"):
                new_chem = amt if mode == "set" else new_chem + amt
            elif dt in ("electrical", "electric", "e"):
                new_elec = amt if mode == "set" else new_elec + amt
            elif dt in ("thermal", "t"):
                new_therm = amt if mode == "set" else new_therm + amt
            else:
                raise ValueError(f"Unknown DR type '{dr_type}'. Must be 'all', 'kinetic', 'chemical', 'electrical', or 'thermal'.")
        else:
            if dr_all is not None:
                new_all = int(dr_all) if mode == "set" else new_all + int(dr_all)
            if dr_kinetic is not None:
                new_kin = int(dr_kinetic) if mode == "set" else new_kin + int(dr_kinetic)
            if dr_chemical is not None:
                new_chem = int(dr_chemical) if mode == "set" else new_chem + int(dr_chemical)
            if dr_electrical is not None:
                new_elec = int(dr_electrical) if mode == "set" else new_elec + int(dr_electrical)
            if dr_thermal is not None:
                new_therm = int(dr_thermal) if mode == "set" else new_therm + int(dr_thermal)

        if min(new_chem, new_elec, new_therm, new_kin, new_all) < 0:
            raise ValueError("Damage reduction values cannot be negative.")

        for dt_name, specific_val in [("Kinetic", new_kin), ("Chemical", new_chem), ("Electrical", new_elec), ("Thermal", new_therm)]:
            effective_val = new_all + specific_val
            if effective_val > 10:
                raise ValueError(f"DR stacks up to a maximum of 10. Effective DR for {dt_name} would be {effective_val} ({new_all} ALL + {specific_val} {dt_name}).")

        if self.specials.is_shirt and new_all > 5:
            raise ValueError("Shirt armor cannot provide more than 5 DR (ALL).")

        units_required = (new_all * 4) + (new_kin * 2) + new_chem + new_elec + new_therm
        total_available = self.dr.dr_units

        if units_required > total_available:
            raise ValueError(f"Insufficient DR units. Configuration requires {units_required} units, but only {total_available} units available ({self.dr.dr_units_remaining} remaining).")

        self.dr.dr_chemical = new_chem
        self.dr.dr_electrical = new_elec
        self.dr.dr_thermal = new_therm
        self.dr.dr_kinetic = new_kin
        self.dr.dr_all = new_all

        self.customization.customization_log.append({
            "action": "spend_dr",
            "units_spent": units_required,
            "units_remaining": total_available - units_required,
            "dr_summary": self.dr.dr_summary,
        })
        return f"DR configuration updated: {self.dr.dr_summary}. Used {units_required}/{total_available} DR Units ({self.dr.dr_units_remaining} remaining)."

    def add_masterwork(self, choice: str = "point", levels: int = 1) -> str:
        choice = choice.lower().strip()
        normalized = "point" if "point" in choice else "slot"
        if self.customization.masterwork_level + levels > 5:
            raise ValueError(f"Cannot increase Masterwork Level to {self.customization.masterwork_level + levels}. Maximum Masterwork Level is 5.")

        for _ in range(levels):
            self.customization.masterwork_choices.append(normalized)  # type: ignore[arg-type]
            self.customization.masterwork_level += 1

        self.customization.customization_log.append({
            "action": "masterwork_add",
            "added_levels": levels,
            "choice": normalized,
            "new_masterwork_level": self.customization.masterwork_level,
        })
        return (
            f"Added {levels} Masterwork Level(s) (choice: '{normalized}'). "
            f"Masterwork Level is now {self.customization.masterwork_level}. "
            f"Craft DC is {self.craft_dc} (+2/level). Structural Skill Rank 6+ and Advanced Build Materials required."
        )

    def remove_masterwork(self, levels: int = 1) -> str:
        if self.customization.masterwork_level - levels < 0:
            raise ValueError(f"Cannot decrease Masterwork Level below 0 (current: {self.customization.masterwork_level}).")

        for _ in range(levels):
            if not self.customization.masterwork_choices:
                self.customization.masterwork_level = max(0, self.customization.masterwork_level - 1)
                continue

            last_choice = self.customization.masterwork_choices[-1]
            if last_choice in ("point", "points"):
                if self.customization.remaining_points < 1:
                    raise ValueError("Cannot remove Masterwork level because the customization point provided by it has already been spent. Refund or adjust customizations first.")
            elif last_choice in ("slot", "slots"):
                if self.customization.remaining_slots < 1:
                    raise ValueError("Cannot remove Masterwork level because the customization slot provided by it is currently in use. Refund or adjust customizations first.")

            self.customization.masterwork_choices.pop()
            self.customization.masterwork_level -= 1

        self.customization.customization_log.append({
            "action": "masterwork_remove",
            "removed_levels": levels,
            "new_masterwork_level": self.customization.masterwork_level,
        })
        return f"Removed {levels} Masterwork Level(s). Masterwork Level is now {self.customization.masterwork_level}."

    def diminish_attribute(
        self,
        attribute: str,
        dr_type: Optional[str] = None,
        points: int = 1,
        description: str = ""
    ) -> Tuple[int, str]:
        attr_key = attribute.strip().lower()
        if attr_key in self.customization.improved_attributes:
            raise ValueError(f"Attribute '{attribute}' was previously improved. Armor crafting rules prohibit diminishing an attribute that has been improved.")

        neg_yield = 1
        diminish_desc = ""

        if attr_key in ("ac", "ac_bonus", "armor_class"):
            if self.ac_bonus <= 0:
                raise ValueError("AC bonus cannot be reduced below 0.")
            self.ac_bonus -= 1
            neg_yield = 2
            diminish_desc = f"Reduced AC bonus by 1 (now {self.ac_bonus})."

        elif attr_key in ("max_dex", "max_dex_bonus", "maximum_dex"):
            if self.max_dex_bonus <= 0:
                raise ValueError("Maximum Dexterity Bonus cannot be reduced below 0.")
            current_md = self.max_dex_bonus
            if current_md >= 7:
                neg_yield = 0
            elif current_md >= 4:
                neg_yield = 1
            else:
                neg_yield = 2

            past_md_neg = sum(
                log_item.get("points_yielded", 0)
                for log_item in self.customization.customization_log
                if log_item.get("action") == "diminish" and log_item.get("attribute") == "max_dex"
            )
            if past_md_neg + neg_yield > 4:
                neg_yield = max(0, 4 - past_md_neg)
                if neg_yield == 0:
                    raise ValueError("Maximum 4 Negative Points cap from Maximum Dex diminishment has been reached.")

            self.max_dex_bonus -= 1
            diminish_desc = f"Reduced Max Dex Bonus by 1 (now +{self.max_dex_bonus})."

        elif attr_key in ("speed", "speed_diff"):
            if "speed" in self.customization.diminished_attributes or "speed_diff" in self.customization.diminished_attributes:
                raise ValueError("Speed Diff diminishment can only be taken once.")

            curr_speed = self.speed_diff
            if curr_speed == "Halved":
                self.specials.is_clumsy = True
                diminish_desc = "Speed penalty exceeded Halved; Clumsy condition applied."
            else:
                curr_idx = SPEED_TIERS.index(curr_speed)
                self.speed_diff = SPEED_TIERS[curr_idx + 1]  # type: ignore[assignment]
                diminish_desc = f"Reduced speed tier from {curr_speed} to {self.speed_diff}."
            neg_yield = 1

        elif attr_key in ("weight", "weight_lbs"):
            self.weight_lbs += 5.0
            eff_weight = self.effective_weight_lbs
            if eff_weight >= 35.0:
                neg_yield = 2
                diminish_desc = f"Increased weight by 5 lbs (now {eff_weight} lbs, Heavy Armor)."
                if eff_weight > 45.0:
                    self.specials.is_clumsy = True
                    diminish_desc += " Clumsy condition triggered (> 45 lbs)."
            else:
                neg_yield = 1
                diminish_desc = f"Increased weight by 5 lbs (now {eff_weight} lbs)."

        elif attr_key in ("dr", "damage_reduction"):
            dt = (dr_type or "chemical").strip().lower()
            if dt in ("chemical", "c"):
                if self.dr.dr_chemical <= 0:
                    raise ValueError("Armor has 0 Chemical DR to diminish.")
                self.dr.dr_chemical -= 1
                neg_yield = 1
            elif dt in ("electrical", "electric", "e"):
                if self.dr.dr_electrical <= 0:
                    raise ValueError("Armor has 0 Electrical DR to diminish.")
                self.dr.dr_electrical -= 1
                neg_yield = 1
            elif dt in ("thermal", "t"):
                if self.dr.dr_thermal <= 0:
                    raise ValueError("Armor has 0 Thermal DR to diminish.")
                self.dr.dr_thermal -= 1
                neg_yield = 1
            elif dt in ("kinetic", "k"):
                if self.dr.dr_kinetic <= 0:
                    raise ValueError("Armor has 0 Kinetic DR to diminish.")
                self.dr.dr_kinetic -= 1
                neg_yield = 2
            elif dt in ("all", "a"):
                if self.dr.dr_all <= 0:
                    raise ValueError("Armor has 0 All-Damage DR to diminish.")
                self.dr.dr_all -= 1
                neg_yield = 3
            else:
                raise ValueError(f"Unknown DR type '{dr_type}'.")
            diminish_desc = f"Removed 1 DR ({dt.upper()})."

        else:
            neg_yield = max(1, int(points))
            diminish_desc = description or f"Custom diminishment on '{attribute}'."

        self.customization.negative_points_earned += neg_yield
        self.customization.diminished_attributes.append(attr_key)
        self.customization.customization_log.append({
            "action": "diminish",
            "attribute": attr_key,
            "points_yielded": neg_yield,
            "description": diminish_desc,
            "total_negative_points": self.customization.negative_points_earned,
        })
        return neg_yield, diminish_desc

    def improve_attribute(
        self,
        attribute: str,
        technique: Optional[str] = None,
        mount_size: Optional[str] = None,
        dr_type: Optional[str] = None,
        cost: Optional[int] = None,
        slots: Optional[int] = None,
        description: str = ""
    ) -> Tuple[int, int, str]:
        attr_key = attribute.strip().lower()
        if attr_key in self.customization.diminished_attributes:
            raise ValueError(f"Attribute '{attribute}' was previously diminished. Armor crafting rules prohibit improving an attribute that has been diminished.")

        cp_cost = 1
        slot_cost = 1
        improve_desc = ""

        if attr_key in ("dr", "damage_reduction"):
            cp_cost = 1
            slot_cost = 1
            self.dr.dr_units_from_points += 2
            improve_desc = "Gained 2 DR Units from 1 Customization Point."
            if dr_type:
                dt = dr_type.strip().lower()
                if dt in ("all", "a"):
                    raise ValueError("1 DR (ALL) requires 4 DR Units (2 Customization Points). Use /tasks/armor/spend_dr after acquiring units.")
                elif dt in ("kinetic", "k"):
                    self.dr.dr_kinetic += 1
                    improve_desc += " Allocated 2 units to +1 Kinetic DR."
                elif dt in ("chemical", "c"):
                    self.dr.dr_chemical += 2
                    improve_desc += " Allocated 2 units to +2 Chemical DR."
                elif dt in ("electrical", "electric", "e"):
                    self.dr.dr_electrical += 2
                    improve_desc += " Allocated 2 units to +2 Electrical DR."
                elif dt in ("thermal", "t"):
                    self.dr.dr_thermal += 2
                    improve_desc += " Allocated 2 units to +2 Thermal DR."

        elif attr_key in ("max_dex", "max_dex_bonus", "maximum_dex"):
            cp_cost = 2
            slot_cost = 1
            effective_total = self.effective_ac + self.max_dex_bonus + 1
            if effective_total > 10:
                raise ValueError(f"Total AC from Dex and Armor cannot exceed 10 (effective AC: {self.effective_ac}, proposed max dex: {self.max_dex_bonus + 1}, total: {effective_total}).")
            self.max_dex_bonus += 1
            improve_desc = f"Increased Maximum Dex Bonus by 1 (now +{self.max_dex_bonus})."

        elif attr_key in ("speed", "speed_diff"):
            cp_cost = 1
            slot_cost = 1
            if self.speed_diff == "Normal":
                raise ValueError("Armor speed penalty is already Normal (maximum speed tier).")
            curr_idx = SPEED_TIERS.index(self.speed_diff)
            self.speed_diff = SPEED_TIERS[curr_idx - 1]  # type: ignore[assignment]
            improve_desc = f"Improved speed penalty tier to {self.speed_diff}."

        elif attr_key in ("weight", "weight_lbs"):
            cp_cost = 1
            slot_cost = 1
            min_wt = 0.25 if self.level == 0 else float(self.level * 1.0)
            if self.weight_lbs <= min_wt:
                raise ValueError(f"Armor weight is already at the minimum allowed limit ({min_wt} lbs).")
            self.weight_lbs = max(min_wt, self.weight_lbs - 5.0)
            improve_desc = f"Reduced armor weight to {self.weight_lbs} lbs."

        elif attr_key in ("protection_combat_tech", "combat_tech", "technique_protection"):
            cp_cost = 1
            slot_cost = 1
            if not technique and not self.specials.protection_combat_tech:
                raise ValueError("Missing 'technique' parameter (e.g. Grapple, Disarm, Trip, Feint).")
            if technique and self.specials.protection_combat_tech and self.specials.protection_combat_tech.lower() != technique.lower():
                raise ValueError(f"Armor already protects against '{self.specials.protection_combat_tech}'. Armor can only protect against one Combat Technique.")
            if technique:
                self.specials.protection_combat_tech = technique.strip()
            self.specials.protection_combat_tech_count += 1
            bonus = self.specials.combat_tech_ac_bonus
            improve_desc = f"Protection against {self.specials.protection_combat_tech}: +{bonus} AC bonus."

        elif attr_key in ("regeneration", "regen"):
            if self.customization.tech_level < 2:
                raise ValueError("Regeneration requires Tech Level 2 or higher.")
            times = self.specials.regeneration_count
            cp_cost = 1 + (times // 2)
            slot_cost = 1
            self.specials.regeneration_count += 1
            improve_desc = f"Regeneration level {self.specials.regeneration_count}: provides {self.customization.tech_level} HP/turn."

        elif attr_key in ("stealth_assist", "stealth"):
            if self.customization.tech_level < 1:
                raise ValueError("Stealth Assist requires Tech Level 1 or higher.")
            if self.specials.stealth_assist_count >= self.customization.tech_level:
                raise ValueError(f"Stealth Assist cannot be taken more times ({self.specials.stealth_assist_count}) than the Tech Level ({self.customization.tech_level}).")
            cp_cost = 1
            slot_cost = 1
            self.specials.stealth_assist_count += 1
            improve_desc = f"Stealth Assist level {self.specials.stealth_assist_count}: +{self.specials.stealth_bonus} to Stealth checks."

        elif attr_key in ("weapon_mount", "mount"):
            if self.specials.weapon_mount_size:
                raise ValueError("Weapon Mount can only be taken once.")
            if self.specials.is_shirt:
                raise ValueError("Shirt armor cannot have a Weapon Mount.")
            m_size = str(mount_size or "Small").capitalize()
            if m_size not in ("Small", "Medium", "Large"):
                raise ValueError(f"Invalid weapon mount size '{mount_size}'. Must be Small, Medium, or Large.")
            cp_cost = 3
            slot_cost = {"Small": 1, "Medium": 2, "Large": 3}[m_size]
            self.specials.weapon_mount_size = m_size  # type: ignore[assignment]
            improve_desc = f"Weapon Mount ({m_size}): adds {self.specials.weapon_mount_weight_lbs} lbs and consumes {slot_cost} slots."

        elif attr_key in ("shirt", "is_shirt"):
            if self.customization.tech_level < 1:
                raise ValueError("Shirt armor requires Tech Level 1 or higher.")
            if self.specials.is_shirt:
                raise ValueError("Armor is already declared as a Shirt.")
            if self.level > 2:
                raise ValueError(f"Shirt armor cannot be constructed for Armor Level {self.level} (max Level 2 / 2 AC).")
            if self.specials.weapon_mount_size:
                raise ValueError("Shirt armor cannot have a Weapon Mount.")
            decl_costs = {0: 0, 1: 2, 2: 4}
            cp_cost = decl_costs.get(self.level, 0)
            slot_cost = 1
            self.specials.is_shirt = True
            improve_desc = f"Constructed as a Shirt (AL {self.level}, declaration cost: {cp_cost} CP). Base cost is doubled."

        elif attr_key in ("quick_slots", "quick_slot"):
            if self.customization.tech_level < 1:
                raise ValueError("Quick Slots requires Tech Level 1 or higher.")
            cp_cost = 1
            slot_cost = 1
            self.specials.quick_slots_count = self.customization.tech_level
            improve_desc = f"Quick Slots: added {self.specials.quick_slots_count} quick access slots."

        else:
            cp_cost = max(1, int(cost or 1))
            slot_cost = max(1, int(slots or 1))
            improve_desc = description or f"Custom improvement on '{attribute}'."

        if self.customization.remaining_points < cp_cost:
            raise ValueError(f"Insufficient Customization Points. Improvement '{attribute}' requires {cp_cost} CP, but only {self.customization.remaining_points} point(s) remaining.")

        if self.customization.remaining_slots < slot_cost:
            raise ValueError(f"Insufficient Customization Slots. Improvement '{attribute}' requires {slot_cost} slot(s), but only {self.customization.remaining_slots} slot(s) remaining.")

        self.customization.points_spent += cp_cost
        self.customization.number_of_improvements += slot_cost
        self.customization.improved_attributes.append(attr_key)
        self.customization.customization_log.append({
            "action": "improve",
            "attribute": attr_key,
            "cp_cost": cp_cost,
            "slots_cost": slot_cost,
            "description": improve_desc,
            "remaining_points": self.customization.remaining_points,
            "remaining_slots": self.customization.remaining_slots,
        })
        return cp_cost, slot_cost, improve_desc

    def evaluate_craft_roll(
        self,
        roll: int,
        natural_1: bool = False,
        is_recraft: bool = False,
        up_tech: bool = False,
        masterworking: bool = False
    ) -> Dict[str, Any]:
        target_dc = self.recraft_dc(up_tech=up_tech, masterworking=masterworking) if is_recraft else self.craft_dc
        supply_cost = self.craft_supply_cost
        craft_time = self.craft_time_days if not is_recraft else max(0.5, self.craft_time_days / 2.0)
        margin = roll - target_dc

        if natural_1:
            outcome = "Critical Failure"
            success = False
            materials_lost = supply_cost
            materials_saved = 0.0
            materials_spent = supply_cost
            discount_pct = 0
            details = (
                f"Critical failure on craft check (natural 1). 100% of supplies (${supply_cost:,.2f}) and time wasted. "
                + ("The existing armor item was destroyed!" if is_recraft else "The item was not created.")
            )
        elif roll < target_dc:
            outcome = "Failure"
            success = False
            materials_lost = round(supply_cost * 0.5, 2)
            materials_saved = round(supply_cost * 0.5, 2)
            materials_spent = materials_lost
            discount_pct = 0
            if is_recraft:
                fail_by = abs(margin)
                if fail_by < 5:
                    note = "Failed by < 5: Armor is intact. No improvements applied. Can retry in 24 hours."
                elif fail_by <= 10:
                    note = "Failed by 5-10: Armor receives 1 Scar of Item Damage. Must be repaired before another attempt."
                else:
                    note = "Failed by > 10: Armor receives maximum Item Damage without destruction. Takes 2x time to repair."
                details = f"Re-crafting failed (DC {target_dc}, rolled {roll}). 50% of materials lost (${materials_lost:,.2f}), 50% saved (${materials_saved:,.2f}). {note}"
            else:
                details = f"Crafting check failed (DC {target_dc}, rolled {roll}). Item was not crafted. 50% of materials lost (${materials_lost:,.2f}), 50% saved (${materials_saved:,.2f}). 50% of crafting labor time wasted."
        else:
            outcome = "Success"
            success = True
            materials_lost = 0.0
            max_discount = 40 if is_recraft else 50
            discount_pct = min(max_discount, (margin // 4) * 10)
            materials_saved = round(supply_cost * (discount_pct / 100.0), 2)
            materials_spent = round(supply_cost - materials_saved, 2)
            details = (
                f"Crafting successful! (DC {target_dc}, rolled {roll}, exceeded by +{margin}). "
                f"{discount_pct}% supplies saved through component recycling (${materials_saved:,.2f} saved). "
                f"Final supplies cost spent: ${materials_spent:,.2f}."
            )

        return {
            "roll": roll,
            "craft_dc": target_dc,
            "margin": margin,
            "outcome": outcome,
            "success": success,
            "is_critical_failure": bool(natural_1),
            "is_recraft": bool(is_recraft),
            "original_item_cost": self.total_cost,
            "original_supply_cost": supply_cost,
            "materials_lost": materials_lost,
            "materials_saved": materials_saved,
            "final_materials_spent": materials_spent,
            "discount_percent": discount_pct,
            "craft_time_days": craft_time,
            "structural_rank_required": self.structural_rank_required,
            "message": details,
        }
