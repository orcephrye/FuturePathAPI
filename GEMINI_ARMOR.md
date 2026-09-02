# Armor System Summary

## Core Mechanics
*   **AC Formula:** `10 + Armor + Shield + Dexterity Mod + Size + Natural Armor + Misc Mod`.
*   **Armor Level (AL):** Directly correlates to the Armor AC Bonus and the required **Armor Proficiency Level**. (Ex: AL 3 requires Armor Proficiency Level 3).
*   **Max Dex Bonus:** Caps the amount of Dexterity modifier that can be added to AC.
    *   **Improvement:** 2 Customization Points = +1 Max Dex (Total AC from Dex + Armor capped at 10).
    *   **Diminishment:** Negative points based on starting Max Dex: 7–9 (0 Neg), 6–4 (1 Neg), 3–0 (2 Neg). Cannot drop below 0; max 4 negative points total.
*   **Speed Diff:** Heavier armor reduces movement (Normal -> -5ft -> -10ft -> Halved).
    *   Affects Run/Sprint/Dash/Swim/Climb movement (does NOT reduce base walking speed).
    *   **Technique Penalties:**
        *   `-5 ft`: 10% chance of Technique failure; Disadvantage on Disarm, Feint, Combination Melee Attack, Melee Kick.
        *   `-10 ft`: 20% chance of Technique failure; Double Disadvantage on Disarm, Feint, Combination Melee Attack, Melee Kick.
        *   `Halved`: 40% chance of Technique failure; Triple Disadvantage on Disarm, Feint, Combination Melee Attack, Melee Kick.
*   **Weight & Tech Level Adjustments:** 
    *   Tech Level 2 is the baseline.
    *   **Lower TL (0–1):** +5 lbs per Tech Level below TL 2 (+5 lbs for TL 1, +10 lbs for TL 0).
    *   **Higher TL (3–4):** -5 lbs per Tech Level above TL 2 (-5 lbs for TL 3, -10 lbs for TL 4).
    *   *Note:* Level 0 armor (+0 AC) is unaffected by TL weight changes. Minimum weight for AL 1+ is 1 lb per Armor Level.
    *   **Heavy Armor:** Any armor weighing 35 lbs or more.
    *   TL weight adjustments do not alter the base Speed Diff (speed changes occur only via customization).

## Armor and Attributes Table (Tech Level 2 Baseline)

| Armor Level | Armor AC Bonus | Max Dex Bonus | Speed Diff | Average Weight (TL 2) | Base Cost / Procure Diff |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **0** | +0 | +9 | Normal | 0.25 lbs | $10 / +0 |
| **1** | +1 | +8 | Normal | 5 lbs | $150 / +0 |
| **2** | +2 | +7 | Normal | 10 lbs | $350 / +0 |
| **3** | +3 | +6 | Normal | 15 lbs | $1,000 / +0 |
| **4** | +4 | +5 | -5 ft | 20 lbs | $2,200 / +0 |
| **5** | +5 | +4 | -5 ft | 25 lbs | $4,500 / +0 |
| **6** | +6 | +3 | -10 ft | 30 lbs | $9,000 / +1 |
| **7** | +7 | +2 | -10 ft | 35 lbs | $18,000 / +1 |
| **8** | +8 | +1 | Halved | 40 lbs | $30,000 / +2 |
| **9** | +9 | +0 | Halved | 45 lbs | $55,000 / +2 |

## Damage Reduction (DR) Trading
*   **Concept:** 1 AC traded = 4 **DR Units**.
*   **Conversion Rates:**
    *   1 Unit = 1 DR (Specific: Chemical, Electrical, Thermal)
    *   2 Units = 1 DR (Kinetic)
    *   4 Units = 1 DR (ALL)
*   **Stacking:** DR stacks but cannot exceed a total of 10.
*   **Timing:** All AC to DR trading must happen **before** customization points are earned or spent.
*   **Proficiency:** Trading AC for DR does NOT change the Armor Level or the required Armor Proficiency Level.

## Tech Levels (TL)

| Tech Level | Level Limit (Max AC/DR) | Max Customizations / Free Points | Extra Base Cost | Extra Procure Diff | Special Rules |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **TL 0** | +5 | 1 / 0 | +$0 | +1 | **Archaic** (+1 Prof level needed) |
| **TL 1** | +6 | 2 / 0 | +$0 | +0 | — |
| **TL 2** | +7 | 3 / 1 | +$250 | +0 | Baseline |
| **TL 3** | +8 | 4 / 2 | +$1,000 | +1 | — |
| **TL 4** | +9 | 5 / 3 | +$3,000 | +1 | — |

## Acquiring & Cost Calculation
*   **Base Cost:** `Base Cost = Armor Level Base Cost + Tech Level Extra Base Cost`.
    *   *Level 0 Exception:* For AL 0 (AC 0), treat Base Cost as `$75 + TL Extra Base Cost` when calculating Masterworking and Customization costs.
*   **Masterworking Cost:** Adds `Base Cost` per Masterwork level: `Base Cost * (1 + Masterwork Level)`.
*   **Customization Point Cost:** Each Customization Point spent adds the `Base Cost` to the total.
*   **Total Armor Cost Formula:** `Total = Base Cost * (1 + Masterwork Level + Customization Points Spent)`.
*   **Procurement Difficulty:** `Base Procure Diff + TL Extra Procure Diff + Attribute Modifiers` (e.g., Regeneration adds +1).
*   **Proficiency Requirement:** Characters cannot take full advantage of armor above their Armor Proficiency level. Archaic adds +1 to required proficiency.

## Crafting Basics
*   **Skill:** Requires **Structural** skill to be trained.
*   **Rank Requirements by Armor Level:**
    *   Rank 1: AL 0–3 (0–3 AC)
    *   Rank 2: AL 4–5 (4–5 AC)
    *   Rank 3: AL 6–7 (6–7 AC)
    *   Rank 4: AL 8–9 (8–9 AC)
*   **Cost:** 1/2 of total item cost in supplies/materials.
*   **Craft DC:** `12 + Tech Level + Armor Level + (2 per Masterwork level)`.
*   **Time:** 1 day per Skill Rank requirement (excluding Masterwork). Ex: AL 0–3 = 1 day, AL 4–5 = 2 days, AL 6–7 = 3 days, AL 8–9 = 4 days.
*   **Proficiency Restriction:** Cannot craft armor requiring proficiency > 1 level above character's current Armor Proficiency level.
*   **Collaboration:** Collaboration / dividing work is **not permitted** for armor crafting.

## Customization Process & Rules
1.  **Define Base:** Determine Tech Level and Masterwork Level.
2.  **Trade DR:** Perform any AC to DR conversions (uses DR Units). Must be done before spending customization points.
3.  **Map Points:** 1 Customization Point = 2 Negative Points. (Unused points are preserved for future re-crafting).
4.  **Spend Points:** Utilize Free Points (TL / Masterwork) and Negative Points.
    *   *Rule:* Cannot take a diminishment on an attribute and then spend points to improve the same attribute.
5.  **Calculate Final Cost:** `Total = Base Cost * (1 + Masterwork Level + Customization Points Spent)`.

### Attribute Customizations
*   **AC Bonus:**
    *   *Improvement:* Cannot spend points to increase AC. Pick a higher Armor Level.
    *   *Diminishment:* -1 AC yields 2 Negative points. Does not decrease armor cost or Armor Level.
*   **DR Bonus:**
    *   *Improvement (1 CP = 2 DR Units):* 1 CP = 2 DR (C/E/T), 1 CP = 1 DR (K), 2 CP = 1 DR (ALL).
    *   *Diminishment:* -1 DR (C/E/T) = 1 Neg; -1 DR (K) = 2 Neg; -1 DR (ALL) = 3 Neg.
    *   *Cap:* DR stacks up to a maximum of 10.
*   **Maximum Dex Bonus:**
    *   *Improvement:* 2 CP = +1 Max Dex (Total AC from Dex + Armor capped at 10).
    *   *Diminishment:* 7–9 (0 Neg), 6–4 (1 Neg), 3–0 (2 Neg). Cannot reduce below 0; max 4 Neg points total.
*   **Speed Diff:**
    *   *Improvement:* 1 CP = increase speed tier by 1 (Halved -> -10ft -> -5ft -> Normal).
    *   *Diminishment:* Decrease speed tier by 1 = 1 Neg point (can only be changed once).
*   **Weight:**
    *   *Improvement:* 1 CP = lower weight to match row in Armor Table, using that row's Speed instead of Armor Level speed. Determines Size category; prevents armor from being clunky / too large.
    *   *Diminishment:* 1 Neg point if it doesn't adjust Speed/Size; 2 Neg points if it adjusts Speed/Size.

## Masterworking
*   **Requirements:** **Skill Rank 6+** in Structural and **Advanced Build Materials**.
*   **Max Level:** +5.
*   **Bonus per Level:** +1 Customization Slot OR +1 Free Customization Point.
*   **Difficulty:** Increases Craft DC by **+2 per Masterwork level**.
*   **Cost:** Adds `Base Cost` per level to total cost.

## Re-Crafting
*   **Purpose:** Improve Tech Level or Masterwork Level only (cannot increase Armor Level).
*   **Prerequisite:** Item must be in working condition (repair Item Damage first).
*   **Cost:** Normal crafting cost. Reduce total by 10% for every 4 the Craft DC is beaten (max 40% discount).
*   **Time:** Halved (0.5 to 2 days).
*   **DC Modifier:** Normal Craft DC + 1 (Up-Teching) + 1 (Masterworking).
*   **Failure States:**
    *   *Fail by < 5:* Item fine, no improvement; retry in 24 hours.
    *   *Fail by 5–10:* 1 Scar (Item Damage); must repair before retry.
    *   *Fail by > 10:* Maximum Item Damage without destruction; takes 2x time to repair.
    *   *Crit Fail:* Item destroyed.

## Special Attributes
*   **Protection against Combat Techniques:** (1 point) Provides a **+4 AC bonus** against a single type of Combat Technique (e.g., Grapple, Disarm, Trip, Feint). Can be taken multiple times for the same technique (+2 AC per additional time: +4, +6, +8...). Can only protect against one technique type. (On a Shirt, provides only +2 AC).
*   **Regeneration:** (TL 2+, 1 point) Provides HP/turn equal to TL.
    *   *Cost multiplier:* Spending CP on Regen costs twice as much Base Cost.
    *   *Scaling:* For every 2 times taken, increases CP cost by +1.
    *   *Procure Diff:* +1.
    *   *Ammunition:* Uses pharmaceuticals (1 Carton = 5 rounds; priced as large ammunition).
    *   *Reloading (2 rounds):* Round 1 = Acquire ammo (Simple if in Quick Slot; Standard otherwise); Round 2 = Apply carton / Reload (Standard action; Simple with Quick Reload feat).
    *   *After Combat:* Can consume remaining charges to finish healing; premature reload wastes remaining charges.
*   **Stealth Assist:** (1 point, TL 1+) Provides +2 bonus to Stealth skill checks per point spent. Max points spent = Tech Level.
*   **Weapon Mount:** (3 points, 1 time only) Mounts an off-hand weapon (Small/Medium/Large).
    *   *Size adjustments:* Small (+5 lbs, 1 Slot), Medium (+10 lbs, 2 Slots), Large (+15 lbs, 3 Slots). Gigantic does not qualify.
    *   *Rules:* Treated as off-hand weapon for Two-Weapon Fighting; does not benefit from TWF feats. If already wielding an off-hand weapon, acts as bonus damage for it. Increases weight and applies speed diminishment rules.
*   **Shirt:** (TL 1+) Base Price is doubled. CP spent on Shirt cost double.
    *   *Declaration Cost:* Level 0 = 0 CP, Level 1 = 2 CP, Level 2 = 4 CP.
    *   *Limits:* Max 2 AC, 5 DR (ALL), or DR equivalent. Cannot be Clumsy or have Weapon Mount.
    *   *Layering Rules:* Easily hidden/worn under other armor. Outer AC bonus does not stack (use highest), but DR stacks. If both have Regen, only the shirt's regen applies. Protection vs Combat Tech provides +2 AC.
*   **Quick Slots:** (1 point, TL 1+) Provides slots equal to TL (1–4). Retrieve a small item (grenade, ammo, pharmaceutical carton) as a Simple action. Cannot store guns or medium/large items.
*   **Clumsy:** Free (triggered if speed < halved or weight > 45 lbs). Disadvantage on all saves and Athletics, Acrobatics, Pilot, Sleight of Hand, Medical. No Minor/Major hit benefits on combat accuracy checks; max 1 Advantage.
*   **Archaic:** (TL 0) Requires +1 Armor Proficiency Level above Armor Level to wear.

## Unarmed / Martial Arts Combat (Reference)
*(Source: Weapons Rules)*
*   **Core Mechanics:** Derived from combining Dexterity (Speed) and Strength (Power). Total Weapon Level is capped at **Level 6 (2d8 Non-Lethal)**.
*   **Speed (Dexterity Score):**
    *   10–13 (0–1): Single-Fire (Slow hitting)
    *   14–15 (2): Manual (Normal, average)
    *   16–17 (3): Semi-Auto (Hard to follow)
    *   18–19 (4): Fully-Auto (A flurry)
    *   20–21 (5): Super-Fast (Unseen hits)
*   **Power (Strength Score):**
    *   10–15 (0–2): Small (Little power)
    *   16–17 (3): Medium (Normal, average)
    *   18–19 (4): Large (Heavy hitting)
    *   20–21 (5): Gigantic (Like a ton of bricks)
*   **Damage Resolution:** 
    *   Roll calculated Hit Die + STR Modifier.
    *   If both scores result in a higher level than the cap, use the favorable Ability for the primary bonus and the other for the remainder.
    *   Default damage is **Non-Lethal** (subject to DR).
*   **Lethal Conversion:** Reduces damage die by one level. 
*   **Accessories:** (e.g., Metal, Powered, High Freq Gloves) Ignore their own damage die but provide **built-in customizations** (Accuracy, Critical Range, etc.) to the unarmed strike.
