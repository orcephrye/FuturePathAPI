---
name: spaceship-point-buy
description: >-
  Automates Core System Attribute (CSA) point-buy allocation for d20 FuturePath spaceships using spaceship_point_buy.js.
  Use when the user asks to buy, allocate, or optimize spaceship attributes, or as a tool during spaceship creation,
  designing custom hulls, building archetypes (Fighters, Cruisers, Battleships, Carriers, Freighters), or setting up ship schematics.
---

# Spaceship Point Buy & Attribute Allocation Skill

This skill provides step-by-step guidance and CLI execution instructions to allocate the 6 Core System Attributes (Weapons, Shields, Engines, Structure, Sensors, Electronics) for any d20 FuturePath starship.

It uses the deterministic script [`spaceship_point_buy.js`](../../spaceship_point_buy.js) to optimize attribute scores toward even modifier breakpoints, handle hull configuration adjustments, and distribute remainder points.

---

## 1. Spaceship Creation Order of Operations

When creating a spaceship from scratch or prompted to generate attributes:

1. **Establish Base Scores:**
   Every Core System Attribute starts at **10** (0 modifier).
2. **Apply Hull Configuration Adjustments:**
   Apply any CSA bonuses or penalties from the chosen Hull Configuration **before** point buy:
   * **Barges:** Engines -2, Weapons -1
   * **Battle Cruisers:** Electronics +2, Engines +2, plus pick one (+1 Engines or +1 Electronics); -3 Attribute Point budget penalty
   * **Battle Ships:** Weapons +2, Shields +2, Structure +1, plus pick one (+1 Engines or +1 Electronics); -3 Attribute Point budget penalty
   * **Capital:** Bays +1, Sensors +2, Electronics +2, plus pick one (+1 Shields or +1 Structure); Engines -2; -3 Attribute Point budget penalty
   * **Carriers:** Sensors +2, Electronics +2, plus pick one (+1 Engines or +1 Structure); Engines -2; -3 Attribute Point budget penalty
   * **Cruisers (Military):** Pick one (+2 Engines or +2 Electronics), Sensors +1; -2 Attribute Point budget penalty
   * **Cruisers (Civilian):** Engines +2, Sensors +2, Structure -1; -2 Attribute Point budget penalty
   * **Destroyers:** -2 Attribute Point budget penalty
   * **Dreadnoughts:** Engines -2; -5 Attribute Point budget penalty
   * **Drones:** -1 to all 6 Attributes
   * **Fighters:** Engines +2, Structure -2
   * **Frigates:** Sensors +1, Weapons -1; +1 Attribute Point budget bonus
   * **Freighters:** Engines -3; -1 Attribute Point budget penalty
   * **Industrial:** Engines -2; -1 Attribute Point budget penalty
   * **Shuttles:** Engines +4, Sensors +2, Structure -2, Electronics -2
3. **Determine Point-Buy Budget:**
   * Default starting budget is **15 points** (or Tech Level base: Tech 1 = 10, Tech 2 = 15, Tech 3 = 20, Tech 4 = 25).
   * Apply any attribute point modifier from the Hull Configuration (e.g. 15 points - 3 points = 12 points for a Battleship or Battle Cruiser).
4. **Determine Attribute Priority Order:**
   Rank attributes based on the ship's intended role:
   * **Interceptor / Escort Fighter:** `engines,weapons,shields`
   * **Warship / Battleship:** `weapons,shields,structure,engines`
   * **Recon / Electronic Warfare:** `electronics,sensors,engines`
   * **Carrier / Fleet Command:** `electronics,sensors,shields,structure`
   * **Hauler / Heavy Transport:** `structure,shields,engines`
   * **Balanced / Patrol:** Leave priority empty or specify top 1–2 attributes.
5. **Determine Negative Attribute Permissions:**
   If the ship design permits reducing non-essential systems (e.g., dropping Weapons on a pure science/recon vessel, or dropping Electronics on a rugged gunboat), enable `--allow-negative` and set `--negative-priority`.

---

## 2. Running the Tool

Execute [`spaceship_point_buy.js`](../../spaceship_point_buy.js) using `run_command`:

```bash
node spaceship_point_buy.js --points <POINTS> [OPTIONS]
```

### Common Options
* `--points <num>`: Points budget to spend (after configuration penalties/bonuses).
* `--base <w,sh,e,st,se,el>`: Starting base scores after hull configuration attribute adjustments (e.g. `12,12,11,11,10,10`).
* `--priority <attr1,attr2,...>`: Comma-separated list of attributes to prioritize in order.
* `--distribution <concentrate|spread>`: Concentration mode (default: `concentrate` maximizes 1st priority first; `spread` distributes points evenly across priority attributes).
* `--even-distribution`: Boolean flag alias for `--distribution spread`.
* `--allow-negative`: Enable reducing non-priority attributes down to the floor.
* `--negative-priority <attr1,...>`: Preferred attributes to reduce first.
* `--negative-floor <7|8|9>`: Minimum allowed score for reduced attributes (default: 8).
* `--json`: Outputs raw JSON suitable for programmatic parsing.

### Point Cost Reference
| Score | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
| :---: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **Cost** | -4 | -2 | -1 | 0 | 1 | 2 | 3 | 5 | 7 | 10 | 13 | 17 | 21 | 25 |

---

## 3. Standard Usage Examples

### Example A: Fast Interceptor Fighter (Tech 2, 15 Points)
Fighter starts with base modifiers: Engines +2 (12), Structure -2 (8).
User wants maximum speed and punch:
```bash
node spaceship_point_buy.js \
  --points 15 \
  --base 10,10,12,8,10,10 \
  --priority engines,weapons \
  --json
```

### Example B: Military Cruiser (Tech 2: 15 - 2 = 13 Points)
Cruiser configuration chosen perks: +2 Engines, +1 Sensors. Disadvantage: -2 Points.
User prioritizes Weapons and Shields:
```bash
node spaceship_point_buy.js \
  --points 13 \
  --base 10,10,12,10,11,10 \
  --priority weapons,shields \
  --json
```

### Example C: Min-Maxed Combat Vessel with Negative Reduction
Min-maxing Weapons and Shields, willing to sacrifice Electronics and Sensors (down to 8):
```bash
node spaceship_point_buy.js \
  --points 15 \
  --priority weapons,shields \
  --allow-negative \
  --negative-priority electronics,sensors \
  --negative-floor 8 \
  --json
```

---

## 4. Post-Allocation Calculation Checklist

After receiving the final scores from `spaceship_point_buy.js`:

1. **Modifiers:**
   $$\text{Mod} = \lfloor(\text{Score} - 10) / 2\rfloor$$
2. **Battle Damage Defense (Resistance, Reflectors):**
   * $\text{Damage Resistance} = 4 + \text{Structure Mod}$
   * $\text{Reflectors} = 4 + \text{Shield Mod}$
3. **Tactical Mobility:**
   $$\text{Tactical Mobility} = \text{Engines Mod} + \text{Helm Officer Dex Mod} + \text{Pilot Feats}$$
4. **Ship Tracking DC:**
   $$\text{Tracking DC} = 10 + (\text{Tactical Mobility} + \text{Shield Mod}) - \text{Structure Mod} \pm \text{Size Mod}$$
5. **Initiative:**
   $$\text{Initiative} = (\text{Engines Mod} + \text{Sensors Mod}) - \text{Structure Mod}$$
6. **Stealth DC (Silent Running):**
   $$\text{Stealth DC} = \text{Hull Detection DC} + \max(0, \text{Electronics Mod})$$

---

## References
* [`SPACESHIP_POINT_BUY_README.md`](../../SPACESHIP_POINT_BUY_README.md) - Full CLI documentation and JavaScript API.
* [`SPACESHIP_SUMMARY.md`](../../SPACESHIP_SUMMARY.md) - Spaceship stats, size tables, hull configurations, and combat formulas.
* [`SPACESHIP_CRAFTING.md`](../../SPACESHIP_CRAFTING.md) - Shipyard construction, custom facilities, and weapon slots.
