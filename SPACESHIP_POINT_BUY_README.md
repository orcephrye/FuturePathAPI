# Spaceship Core System Attribute (CSA) Point-Buy Tool

A lightweight, zero-dependency Node.js CLI tool and module designed to automate point-buy allocation for the **6 Core System Attributes** in the *d20 FuturePath* TTRPG system.

---

## The 6 Core System Attributes (CSA)

* **Engines**
* **Weapons**
* **Structure**
* **Shields**
* **Electronics**
* **Sensors**

---

## Core Mechanics & Rules

1. **Official Point-Buy Cost Table:**
   Attributes range from **7** to **20**. Baseline score is **10** (cost: 0).
   
   | Score | Cost | Score | Cost | Score | Cost |
   | :---: | :---: | :---: | :---: | :---: | :---: |
   | **7** | -4 pts | **12** | 2 pts | **17** | 13 pts |
   | **8** | -2 pts | **13** | 3 pts | **18** | 17 pts |
   | **9** | -1 pt  | **14** | 5 pts | **19** | 21 pts |
   | **10**| 0 pts  | **15** | 7 pts | **20** | 25 pts |
   | **11**| 1 pt   | **16** | 10 pts | | |

2. **Modifier Breakpoints:**
   Attribute modifiers upgrade on **even scores**:
   * Score 10–11: $+0$
   * Score 12–13: $+1$
   * Score 14–15: $+2$
   * Score 16–17: $+3$
   * Score 18–19: $+4$
   * Score 20: $+5$
   * Score 8–9: $-1$
   * Score 7: $-2$

3. **Logical Spending Philosophy:**
   The tool prioritizes purchasing in increments of **2 points before 1 point** to hit modifier thresholds rather than stranding points on odd numbers.

4. **Negative Modifiers Rule:**
   Negative attribute reductions (scores below 10) are **only permitted if the reclaimed points directly enable a priority attribute to reach a higher modifier threshold**.
   * *Example:* If Weapons is at 14 ($+2$ mod), taking Sensors from 10 to 8 yields 2 points. If Weapons needs 5 points to reach 16 ($+3$ mod), moving Weapons to 15 would still only provide a $+2$ modifier. In this scenario, Sensors will **not** be reduced.
   * If a negative reduction is valid, the tool reclaims only the **minimum** points necessary (e.g., dropping to 9 instead of 8 if 1 point suffices).

---

## Requirements

* **Node.js** (v14+ recommended).
* Zero third-party npm packages required.

---

## Command-Line Options

| Flag | Short | Description | Default |
| :--- | :---: | :--- | :---: |
| `--points <n>` | `-p` | Total point budget to spend. | `15` |
| `--priority <list>` | `-pri` | Comma-separated list of attributes to prioritize. | `[]` |
| `--distribution <mode>` | `-d` | Distribution method: `concentrate` or `spread`. | `concentrate` |
| `--even-distribution`, `--spread` | | Alias for `--distribution spread`. Divides points evenly across priority attributes. | `false` |
| `--starting <config>`, `--base` | `-s`, `-b` | Custom starting scores (`JSON`, `Attr:Val`, or `10,10,12,8,10,10`). | All `10` |
| `--allow-negatives [limit]`, `--allow-negative` | `-n` | Enable negative reductions down to limit (7–9). | `8` |
| `--negative-floor <limit>`, `--negative-limit` | | Set the minimum score limit for negative reductions. | `8` |
| `--negative-priority <list>` | `-np` | Attributes eligible for negative reduction in order. | `[]` |
| `--verbose` | `-v` | Display detailed point breakdown and modifiers. | `false` |
| `--json` | | Output clean JSON (default when not verbose). | `true` |
| `--help` | `-h` | Show usage documentation. | — |

---

## CLI Examples

### 1. Default Even Spread (No Priority)
Creates the most balanced distribution possible across all 6 attributes.
```bash
node spaceship_point_buy.js
```
**Output:**
```json
{
  "Engines": 14,
  "Weapons": 12,
  "Structure": 12,
  "Shields": 12,
  "Electronics": 12,
  "Sensors": 12
}
```

---

### 2. Single Prioritized Attribute
Maximizes the chosen attribute first, then spends remaining points on unspecified attributes.
```bash
node spaceship_point_buy.js --priority Weapons
```
**Output:**
```json
{
  "Engines": 12,
  "Weapons": 17,
  "Structure": 10,
  "Shields": 10,
  "Electronics": 10,
  "Sensors": 10
}
```

---

### 3. Multiple Prioritized Attributes (Priority Order)
Distributes points to prioritize earlier attributes while maintaining modifier breakpoints.
```bash
node spaceship_point_buy.js --priority Weapons,Engines -v
```
**Output:**
```text
Final Core System Attributes:
{
  "Engines": 14,
  "Weapons": 16,
  "Structure": 10,
  "Shields": 10,
  "Electronics": 10,
  "Sensors": 10
}

Breakdown:
  Engines     : 14 (Mod: +2) [Cost: +5]
  Weapons     : 16 (Mod: +3) [Cost: +10]
  Structure   : 10 (Mod: +0) [Cost: +0]
  Shields     : 10 (Mod: +0) [Cost: +0]
  Electronics : 10 (Mod: +0) [Cost: +0]
  Sensors     : 10 (Mod: +0) [Cost: +0]

Total Points Spent: 15 / 15
```

---

### 4. Concentrated vs. Even Distribution (Spread)
Compare allocating 15 points across `Sensors, Shields, Structure`:

**Concentrated (Default):** Focuses on maximizing the top priority first before allocating remainder:
```bash
node spaceship_point_buy.js --points 15 --priority Sensors,Shields,Structure -v
```
*Output: `Sensors: 16 (+3), Shields: 14 (+2), Structure: 10 (+0)`*

**Even Distribution (`--even-distribution` / `--distribution spread`):** Distributes points evenly among the selected priority attributes with preference to the top priority:
```bash
node spaceship_point_buy.js --points 15 --priority Sensors,Shields,Structure --even-distribution -v
```
*Output: `Sensors: 14 (+2), Shields: 14 (+2), Structure: 14 (+2)`*

With 12 points:
*Output: `Sensors: 14 (+2), Shields: 14 (+2), Structure: 12 (+1)` (Structure slightly lower)*

With 17 points:
*Output: `Sensors: 15 (+2), Shields: 14 (+2), Structure: 14 (+2)` (Sensors 1 above both)*

---

### 5. All 6 Attributes Specified
Distributes points evenly, assigning the highest values to the attributes at the start of the list.
```bash
node spaceship_point_buy.js --priority Weapons,Engines,Structure,Shields,Electronics,Sensors
```
**Output:**
```json
{
  "Weapons": 14,
  "Engines": 12,
  "Structure": 12,
  "Shields": 12,
  "Electronics": 12,
  "Sensors": 12
}
```

---

### 5. Negative Attributes Enabling a Modifier Bump
Allows reducing `Sensors` down to 8 to reclaim 2 points, enabling `Weapons` to reach 18 ($+4$ modifier).
```bash
node spaceship_point_buy.js --priority Weapons --allow-negatives 8 --negative-priority Sensors -v
```
**Output:**
```text
Final Core System Attributes:
{
  "Engines": 10,
  "Weapons": 18,
  "Structure": 10,
  "Shields": 10,
  "Electronics": 10,
  "Sensors": 8
}

Breakdown:
  Engines     : 10 (Mod: +0) [Cost: +0]
  Weapons     : 18 (Mod: +4) [Cost: +17]
  Structure   : 10 (Mod: +0) [Cost: +0]
  Shields     : 10 (Mod: +0) [Cost: +0]
  Electronics : 10 (Mod: +0) [Cost: +0]
  Sensors     :  8 (Mod: -1) [Cost: -2]

Total Points Spent: 15 / 15
```

---

### 6. Custom Starting Scores (Applying Hull Configuration Bonuses First)
FuturePath rules dictate that Hull Configuration adjustments apply **before** point buy.
* Example: A **Battle Ship** gains $+2$ Weapons, $+2$ Shields, $+1$ Structure, and $-3$ Attribute Points ($15 - 3 = 12$ points to spend).
```bash
node spaceship_point_buy.js --starting Weapons:12,Shields:12,Structure:11 --points 12 --priority Weapons -v
```
**Output:**
```text
Final Core System Attributes:
{
  "Engines": 10,
  "Weapons": 17,
  "Structure": 11,
  "Shields": 12,
  "Electronics": 10,
  "Sensors": 11
}

Breakdown:
  Engines     : 10 (Mod: +0) [Cost: +0]
  Weapons     : 17 (Mod: +3) [Cost: +11]
  Structure   : 11 (Mod: +0) [Cost: +0]
  Shields     : 12 (Mod: +1) [Cost: +0]
  Electronics : 10 (Mod: +0) [Cost: +0]
  Sensors     : 11 (Mod: +0) [Cost: +1]

Total Points Spent: 12 / 12
```

---

## Programmatic Usage (Node.js Module)

You can import `pointBuy` into your own JavaScript scripts:

```javascript
const { pointBuy, getCost, getModifier } = require('./spaceship_point_buy.js');

const finalScores = pointBuy({
    points: 15,
    priority: ['Weapons', 'Engines'],
    allowNegatives: true,
    negativeLimit: 8,
    negativePriority: ['Sensors'],
    startScores: {
        Engines: 10,
        Weapons: 10,
        Structure: 10,
        Shields: 10,
        Electronics: 10,
        Sensors: 10
    }
});

console.log(finalScores);
// Output:
// {
//   Engines: 14,
//   Weapons: 16,
//   Structure: 10,
//   Shields: 10,
//   Electronics: 10,
//   Sensors: 10
// }
```

### Module Exports
* `pointBuy(options)`: Main solver function.
* `getCost(score)`: Returns point cost for a score (7–20).
* `getModifier(score)`: Computes $\lfloor(\text{score} - 10) / 2\rfloor$.
* `CORE_ATTRIBUTES`: Array of the 6 official attribute names.
* `SCORE_COSTS`: Full cost dictionary.
