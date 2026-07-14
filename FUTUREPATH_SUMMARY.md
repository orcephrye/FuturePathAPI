# d20 FuturePath - System Reference & Project Context Summary

This document compiles all Gemini context and rules files for the d20 FuturePath role-playing game system. It is designed to serve as a comprehensive system reference for external projects.

## Table of Contents
1. [[#1. Project & Wiki Meta-Context|Project & Wiki Meta-Context]]
2. [[#2. System Differences Summary|System Differences Summary]]
3. [[#3. Ability Themes|Ability Themes]]
4. [[#4. Proficiency Tree|Proficiency Tree]]
5. [[#5. Advantage System|Advantage System]]
6. [[#6. Skill System|Skill System]]
7. [[#7. Health & Injury|Health & Injury]]
8. [[#8. Damage Types & Attributes|Damage Types & Attributes]]
9. [[#9. Conditions|Conditions]]

---

## 1. Project & Wiki Meta-Context

d20 FuturePath is a science fiction themed pen-and-paper role-playing game sometimes noted as a Table Top Role Playing Game (TTRPG). It uses a modified version of the d20 system called d20+. It is inspired by d20 Modern, d20 Future, and Pathfinder/PFSRD. The creators of Future Path want a game that embraces the Sci-Fi genre, incorporates cool technology, and features an entire galaxy as a Campaign Setting.

### Tech Stack
- **Frontend:** MediaWiki
- **Database:** MariaDB

### Coding Standards
- All of this is written in WikiText ie: WikiMedia's own Markdown like format. [https://en.wikipedia.org/wiki/Help:Wikitext]
- All text files ie: "*.txt" should be written in WikiText or embedded HTML within WikiText
- There are some files that are in PDF or SVG format. These are all Character Sheets for the game.
- Note that bolding text is surrounded by triple quotes or '''text to be bold''', Do not use double asterisks ie: **text to be bold** instead use '''text to be bold'''
- Links to other pages are wrapped in brackets [[other page]] In here whitespaces are replaced with underscores and pages are found as other_page.txt

### Project Structure
- Current all files are located in a single directory. They are all txt files written in a custom Markdown format called WikiText
- Each txt text file is considered a page for the game. Each page is hosted on a MediaWiki site that displays all the rules for game play.

---

## 2. System Differences Summary

### 1. d20+ Resolution System
*   **Variable Dice:** Uses a d20 plus additional unique dice (Advantage, Skill, and Weapon dice) rather than large static modifiers.
*   **Dice Levels:** Dice size increases as characters level up. Different progressions exist for Skills, Weapons, and Advantage dice.
*   **Philosophy:** Focuses on rolling more dice, reducing roll frequency to improve pace, and mitigating static modifiers for dynamic play.

### 2. Advantage & Disadvantage
*   **Advantage Die (Ad):** Provided by the character's Path; results are added (Advantage) or subtracted (Disadvantage).
*   **Scaling:** Stays relevant at high levels (replaces static +2/-2). Variable results mean players roll the die (e.g., 1d4+1) instead of using a fixed number.
*   **Max Stack:** Stacks up to a maximum of 3 dice.

### 3. Combat Economy
*   **Rounds:** 3 seconds (1 Standard Action per round).
*   **Group Initiative:** Static Team Initiative determines order. Teams are split into **Vanguard** and **Rearguard** groups who act together.
*   **Tactical Opportunity:** Replaces "Attacks of Opportunity"; applies modifiers to the target's next turn to avoid breaking flow.
*   **Extra Damage:** Replaces "Extra Attacks." Granted when Accuracy exceeds target AC by 2 or more; accuracy improves via the Advantage Die.

### 4. Path vs. Class
*   **Path (General):** (e.g., Strong, Fast, Smart). Determines Hit Die, Advantage Die growth, and Extra Damage. Path Level = Character Level (Max 20).
*   **Class (Specific):** (e.g., Combat Medic, Tracer). Provides unique features and abilities. Max 10 levels per class; multi-classing is encouraged.

### 5. Skill System
*   **Rank Dependent:** Skill Rank predetermines the quality/best possible outcome (e.g., Rank 1 allows basic identification; Rank 5 is master/fluent).
*   **Natural vs. Unnatural:** Natural skills are usable at Rank 0; Unnatural require training (Rank 1) to apply Ability Modifiers.

### 6. Language System
*   **Individual Skills:** Each language is its own skill with a Rank (1–5).
*   **Fluency:** Rank 1 represents basic learning; Rank 5 represents total fluency and accent control.
*   **Progression:** Spending a point on the "Language" skill grants a new language at Rank 1.

### 7. Techniques
*   **Sci-Fi Prowess:** A system for high-tech maneuvers and abilities that function similarly to "spells," allowing for fantastical feats of science.

### 8. Wealth & Procurement
*   **Credit System:** Uses **Credit Score** (monthly purchasing power) and **ISC** (hard cash). High-cost purchases permanently reduce Credit Score.
*   **Procure Difficulty:** A rating used to determine how rare or difficult an item is to acquire.

### 9. Tech Level (TL)
*   **Capability Limits:** Limits what a character can use, repair, or craft without penalty. Characters inherit the TL of their starting civilization.
*   **Story Growth:** Characters can earn the ability to master higher TLs through the adventure.

### 10. Campaign Setting
*   **Galactic Scale:** A setting featuring a wide variety of civilizations with mixed Tech Levels, ranging from primitive worlds to star-spanning empires, with vast unexplored space.

---

## 3. Ability Themes

Six core **Ability Themes** represent a character's capabilities: **Strength (STR)**, **Dexterity (DEX)**, **Constitution (CON)**, **Intelligence (INT)**, **Wisdom (WIS)**, and **Charisma (CHA)**. 

### Score, Modifier, and Die Values
*   **Modifier Formula:** `(Ability Score / 2) - 5` (round down).
*   **Die size:** Calculated from the Modifier, rounded up to the nearest even number as the Die value (negative values subtract dice).

| Score | Modifier | Die | Score | Modifier | Die |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | -5 | -d6 | **16-17** | +3 | +d4 |
| **2-3** | -4 | -d6 | **18-19** | +4 | +d4 |
| **4-5** | -3 | -d4 | **20-21** | +5 | +d6 |
| **6-7** | -2 | -d4 | **22-23** | +6 | +d6 |
| **8-9** | -1 | -d2 | **24-25** | +7 | +d8 |
| **10-11**| 0 | - | **26-27** | +8 | +d8 |
| **12-13**| +1 | +d2 | **28-29** | +9 | +d10 |
| **14-15**| +2 | +d2 | **30-31** | +10 | +d10 |
| **32-33**| +11 | +d12 | | | |

### Ability Themes Description
*   **Strength (STR):** *Power, Muscle, Capacity.* Melee attack accuracy & damage; carrying capacity.
*   **Dexterity (DEX):** *Quickness, Finesse, Subtlety.* Ranged attack accuracy, stealth, sleight of hand, acrobatics, piloting, and Initiative (1/2 DEX + 1/2 WIS).
*   **Constitution (CON):** *Vitality, Durability, Toughness.* Max HP per level, dying stabilization checks, poison/disease resistance, and alcohol tolerance.
*   **Intelligence (INT):** *Comprehension, Brilliance, Industrious.* Knowledge skills, crafting/repairing, disabling devices, investigation, and strategic combat bonuses (Smart Hero).
*   **Wisdom (WIS):** *Intuition, Focus, Awareness.* Perception, Sense Motive, Treat Injury, Professions, and Initiative (1/2 DEX + 1/2 WIS).
*   **Charisma (CHA):** *Glamour, Dominating, Presence.* Influencing others, leadership, Bluff, Intimidate, Diplomacy, and Disguise.

### Changing Ability Scores
*   **Level Ups:** Score increases occur at **4th, 8th, 12th, 16th, and 20th level**.
*   **Score Limit:** Maximum PC score is **30** (can only exceed via items or difficulty rules).
*   **Ability Damage:** Temp ability loss heals naturally at **1 point per affected ability per day** (see Health & Injury for details).
*   **Aging (Optional):** Senior Citizens take `-2 CON`, `-1 STR or DEX`, `-1 CHA` and gain `+2 INT or WIS`, `+2 free Knowledge Skill Points`, and `+1 Profession Rank`.

---

## 4. Proficiency Tree

Every character has a **Proficiency Tree** with six branches: **Technology**, **Melee Combat**, **Ranged Combat**, **Armor**, **Power Armor**, and **Item Use**.

### Training Points & Starting Levels
*   **Training Points:** 1 point per level starting at Level 2 (Feats like *Training Expert* and *Power Armor Expert* grant extra points).
*   **Starting Distributions (Lvl 1):**
    *   **Technology:** Determined by Species (Default is 2).
    *   **Melee & Ranged:** 1 in each, plus 2 points to distribute (Melee 2/Ranged 2, Melee 1/Ranged 3, or Melee 3/Ranged 1).
    *   **Armor:** 2.
    *   **Power Armor:** 0 (Locked).
    *   **Item Use:** 0.

### Branches

#### 1. Technology (4 Levels)
*   **Upgrade Cost:** **2 Training Points** per level.
*   **Usage:** Determines crafting, repairing, and scientific understanding.
*   **Repairing:** Can repair items up to **1 Tech Level higher** than own.
*   **Crafting:** Can craft items up to own Tech Level. Cannot "Up Tech" items above own Tech level.
*   **Bonus:** Grants a miscellaneous bonus when identifying technology.

#### 2. Melee & Ranged Combat (9 Levels)
*   **Usage:** Unlocks weapon use by level. Maximum weapon level is 8 (Level 9 exists for modifiers).
*   **Modifier Attributes:** Weapons with *Exotic*, *Clunky*, or *Masterworked* attributes require **+1 higher Proficiency Level** to wield (e.g., Laser Sniper Rifle is Level 5, but Clunky, requiring Level 6 Ranged).
*   **Non-Proficient Penalties:** Wielding a weapon above proficiency prevents taking advantages and inflicts **1 Disadvantage per level difference**. Cannot fire/use if total disadvantages exceed 3.
*   **Heavy Weapons:** Levels 6+ cost **2 Training Points** instead of 1 (unless the character has *Heavy Melee/Ranged Weapon Training* feats).

#### 3. Armor (10 Levels)
*   **Usage:** Determines armor AC bonus/level. (Sacrificing AC for DR still counts as the base armor level).
*   **Modifier Attributes:** *Archaic* or *Clumsy* armor requires **+1 higher Proficiency Level** (does not stack; max +1).
*   **Non-Proficient Penalties:** Can wear **exactly 1 level higher** than proficiency, but movement speed is halved and all checks suffer disadvantage. Cannot wear armor >1 level higher.
*   **Heavy Armor:** Levels 7+ cost **2 Training Points** instead of 1 (unless the character has *Heavy Armor Training* feat).

#### 4. Item Use (2 Levels)
*   **Level 0 (Default):** Use items of own Tech Level or lower. Can use +1 Masterwork items of own Tech Level or lower. Higher items take disadvantage.
*   **Level 1:** Use items of all Tech Levels. Same/lower Tech items can be used at any Masterwork level. Higher Tech items can only be used if they are +1 Masterwork or lower.
*   **Level 2:** Can use all items of any Tech and Masterwork level without disadvantage.
*   **Special Rules:**
    *   *Legendary Items:* Treated as Tech Level 0 and Masterwork +5 for this tree (though Tech 5 for crafting).
    *   *Self-Crafted:* A character ignores Item Use requirements for any item they personally crafted.

#### 5. Power Armor (5 Levels)
*   **Unlock:** Requires the *Power Armor Expert* feat to unlock (provides the first point and Grade E access).
*   **Progression:** Level 1 allows Class/Grade E Power Armor; Level 5 allows Class/Grade A Power Armor.

### Retraining

#### General Rules
*   **Timing:** Allowed only during level up.
*   **Rate:** Move **1 point per level** to another branch. Retraining a 2-point level allows buying two 1-point levels elsewhere.
*   **Class Requirements:** If a class places a restriction on a branch (e.g., Dimension Knight limits Ranged to 1), excess points in that branch can be retrained immediately on level up to meet the requirement. This counts as the retraining for that level.

#### Alternative Game Modes (GM Discretion)
1.  **Hardcore:** If retraining >1 level, the character gains no proficiency level that turn.
2.  **Strict:** Retraining is impossible; excess points are permanently lost.
3.  **Reserve:** Excess points are put in a reserve. They are temporarily lost, but the character gains 2 points per level on subsequent level ups until the reserve is depleted.

---

## 5. Advantage System

### Advantage & Disadvantage
Used for situational difficulty adjustments on accuracy checks, skill checks, and saving throws.
**Formula:** `1d20 +/- Advantage Die + Modifiers`

### Advantage Die (Ad) Levels
Die size increases based on Path progression. Levels below are **Die Levels**, not character levels. Most characters reach Level 16 naturally; Levels 17–20 are typically achieved through Feats, Abilities, or Techniques.
*   **Lvl 1:** 0-1 (d2-1)
*   **Lvl 2:** 1d2
*   **Lvl 3:** 1d2+1
*   **Lvl 4:** 1d4+1
*   **Lvl 5:** 1d4+2
*   **Lvl 6:** 1d6+2
*   **Lvl 7:** 1d6+3
*   **Lvl 8:** 1d8+3
*   **Lvl 9:** 1d8+4
*   **Lvl 10:** 1d10+4
*   **Lvl 11:** 1d10+5
*   **Lvl 12:** 1d12+5
*   **Lvl 13:** 1d12+6
*   **Lvl 14:** 2d6+7
*   **Lvl 15:** 2d8+7
*   **Lvl 16:** 2d8+8
*   **Lvl 17:** 2d10+8
*   **Lvl 18:** 2d10+9
*   **Lvl 19:** 2d12+9
*   **Lvl 20:** 2d12+10

### Core Rules
*   **Stacking:** Multiple sources of advantage stack up to a maximum of **3 dice**. 
*   **Single Set:** High-level Advantage Dice (e.g., 2d6+7) and **Skill Rank Dice** count as a single "die set" toward the 3-die limit.
*   **Cancellation:** Advantage and Disadvantage cancel each other out on a 1-for-1 basis.
*   **D2 Rolls:** Roll any die; Odd = 1, Even = 2.
*   **Inability to Act:** If an action requires more than 3 Disadvantage dice (a cumulative total after cancellation), it cannot be attempted.
*   **Shorthand:** Notated as `XAd` (e.g., `1d20 + 2Ad`).

### Luck Mechanics
Affects the d20 roll itself, rather than adding dice. Represents metaphysical or otherworldly influence.
*   **Luck:** Roll 2d20, take highest.
*   **Extra Lucky:** Roll 3d20, take highest.
*   **Unlucky:** Roll 2d20, take lowest.
*   **Extra Unlucky:** Roll 3d20, take lowest.

---

## 6. Skill System

### Core Roll
**1d20 + Skill Die + Ability Modifier + Miscellaneous Modifiers** vs **Difficulty Class (DC)**.

### Skill Types
*   **Favored:** Costs 1 point per rank (Non-favored costs 2). Gaining a Favored Skill (via Path or Class) grants 1 free Skill Point specifically for that skill.
*   **Natural:** Usable at Rank 0 (Untrained). Roll: `d20 + Ability Mod + Misc Mods`.
*   **Unnatural:** Requires at least Rank 1 (Trained) to use.
*   **Rank Dependent:** Skill Rank predetermines the level of reward/success (e.g., Language fluency, Crafting complexity).

### Ranks & Competency
Max Rank = 1/2 Character Level (round up).
Competency Levels provide a static bonus and can be used as DC requirements (adjusting DC by +/- 4 per level difference).
*   **Unexperienced (Rank 0-1):** +0 Bonus | Die: 0 (Rank 0), 1d2 (Rank 1)
*   **Novice (Rank 2-3):** +1 Bonus | Die: 1d2+1 (Rank 2), 1d4+1 (Rank 3)
*   **Intermediate (Rank 4-5):** +2 Bonus | Die: 1d4+2 (Rank 4), 1d6+2 (Rank 5)
*   **Competent (Rank 6-7):** +3 Bonus | Die: 1d6+3 (Rank 6), 1d8+3 (Rank 7)
*   **Expert (Rank 8-9):** +4 Bonus | Die: 1d8+4 (Rank 8), 1d10+4 (Rank 9)
*   **Master (Rank 10):** +5 Bonus | Die: 1d10+5

### Rank Dependent Skills
*   **Athletics:** Affects base movement speed and carrying capacity.
*   **Craft:** Determines Masterwork capabilities.
*   **Perform:** Determines maximum ISC earned from performances.
*   **Profession:** Affects monthly income and total Credit Score.
*   **Language:** Determines fluency levels (1–5) and comprehension limits.
*   **Treat Injury:** Determines the number of Hit Die used for health recovery.

### Using Skills
*   **Opposing Checks:** Roll vs another character's skill result. Tie goes to higher key Ability Score.
*   **Taking 10/20:** Spend 10 or 20 minutes (out of combat/distractions) to treat d20 as 10 or 20. Requires no immediate threat or penalty for failure.
*   **Aiding Another:** Helper rolls vs DC. Success grants leader **1 + (amount over DC)** as a bonus.
*   **Dividing Tasks:** Multiple characters handle sections of work; all must succeed for the task to complete.
*   **Cooperative Checks:** All players roll individually; only one needs to succeed (e.g., Searching).
*   **Ability Checks:** d20 + Ability Die. Add Ability Mod only if the character has **Affinity**.

### Skill List by Ability
*   **STR:** Athletics, Intimidate, Escape Artist
*   **DEX:** Acrobatics, Escape Artist, Pilot, Ride, Sleight of Hand, Stealth
*   **INT:** Computer Use, Craft, Decipher Script, Demolitions, Disable Device, Knowledge, Study, Bluff
*   **WIS:** Perception, Profession, Sense Motive, Survival, Treat Injury, Diplomacy, Handle Animal
*   **CHA:** Bluff, Diplomacy, Disguise, Handle Animal, Intimidate, Perform

---

## 7. Health & Injury

### Hit Points & Hit Dice
*   **Hit Dice (HD):** d6, d8, or d10 based on Path.
*   **Leveling HP:** Roll HD + CON modifier (1st level gets max HD value).
*   **Temporary HP:** Dropping to 0 or below when temp HP expires knocks the character unconscious (Unstable/Dying).
*   **Constitution HP:** Temporary/permanent CON changes alter max HP (healable), not temp HP.

### Injury & Damage Mechanics

#### DR (Damage Reduction) vs. Extra Damage
*   **Default:** DR subtracts directly from damage.
*   **Extra Damage Stacking:** DR increases by **1/2 of DR (round up) per Extra Damage** of the attack.
    *   *Formula:* `Effective DR = Base DR + (1/2 * Base DR * Extra Damage)`
    *   *Example:* 4 DR vs. 1 Extra Damage = 6 DR total.

#### Nonlethal Damage
*   Dealt by unarmed attacks or subdual weapons. Lethal weapons can deal nonlethal at a disadvantage.
*   Does not reduce HP. Defender must roll a **CON save of DC 5 + damage** or take **temporary CON damage**:
    *   *CON damage:* `1 + (1 for every 5 points failed by)`
*   **Milestones of Temp CON Damage:**
    *   CON drops to **7**: Shaken.
    *   CON drops to **5**: Dazed.
    *   CON drops to **3 or below**: Unconscious.
*   **Single-Blow Triggers:**
    *   **3+ CON damage:** Auto-Shaken (Dazed if already Shaken).
    *   **4+ CON damage:** Auto-Dazed (Unconscious if already Dazed).
    *   **5 CON damage:** Auto-Unconscious.
*   *Recovery:* All temp CON damage is restored after a full rest.

#### Damage Types & Target Defenses
1.  **Chemical:** Acid, Base, planetary hazards.
2.  **Electrical:** Electricity, magnetism.
3.  **Kinetic:** Shockwaves, sonic, Piercing, Bludgeoning, Slicing (Default type).
4.  **Thermal:** Heat, Cold, Radiation.

*   **Defenses:** DR (max 10), **Strength** (takes x0.5 damage), **Immunity** (takes x0 damage), **Weakness** (+1 damage), **Vulnerable** (takes x2 critical damage).

##### Detailed Rules for Damage Types
*  For detailed rules on shorthand formats, combination/double types, spaceship MASS magnitudes, and modifiers, see the **Damage Types & Attributes** section.

### Death, Dying, and Cheating Death

#### Unstable and Dying (0 HP)
*   **Status:** Unconscious. Takes **1d4 CON damage** every round in combat (every 20 mins out of combat).
*   **Attacked:** Taking damage while unstable forces an immediate **1d4 CON damage**.
*   **Death:** Occurs when CON score reaches 0.
*   **Stabilizing:** DC 20 Treat Injury check as a Full Round action. Health returns to 1 (CON damage is not restored).

#### Cheating Death (Futuristic Revival)
*   **Methods:** Rejuvenate body (advanced biology/cyborg tech) or Transfer mind (brain transplant/digital upload/psionics).
*   **Costs:** High, typically reduces Credit score.
*   **GM Penalty Options:** 
    *   Permanent ability damage (-2 to one or -1 to two).
    *   XP reset to level minimum.
    *   Lose 1 level.
    *   Permanent HP loss or reduced HD size.
    *   Gain a Difficulty without bonus points.
    *   Change body (species, sex, appearance).
    *   Corporate ownership/indentured servitude.
    *   Societal shunning.

### Healing

#### In-Combat Healing
1.  **Treat Injury Skill:** Full Round Action + Kit. HP restored scales with Skill Rank.
2.  **Medical Items:** (e.g., Healing Concoction). No check required. Restores flat item HP.
3.  **Medical Items + Treat Injury:** Administered to another character. **DC 10 check**.
    *   *Result < 10 (Failure):* Target receives only 1/2 item HP.
    *   *Result >= 10 (Success):* Target gets full item HP.
    *   *Bonuses:* Every 5 points above DC 10 adds **+1 HP per Die/Round** of the item (max +6 at roll of 40).
    *   *Natural 20:* Maximum possible healing including all bonuses.

#### Out-of-Combat Healing
*   **Natural Healing:** 8 hours rest restores **1 HD + CON modifier** (uses largest HD if multiclassed).
*   **Bed Rest (24 hrs):** Restores **1/4 max HP**.
*   **Long/Short Term Care:** Restores **1/2 max HP** (administered by another).
*   *Note:* A player cannot use Treat Injury on themselves.

#### Ability Healing
*   **Natural:** Heals **1 point per affected ability per day** of 8 hours uninterrupted rest (starts 24 hours after injury).
*   **Treat Injury (DC 20, non-combat):** Success restores **+1d4** to up to 3 damaged abilities. **Natural 20** restores **+4** to up to 3 damaged abilities. Limit once per 24 hours.

#### Kits
*   Medical, First Aid, and Surgery Kits. Default 20 uses (advanced kits have 10 uses and grant Advantage).

---

## 8. Damage Types & Attributes

### Damage Type Format & Shorthand
* **Shorthand Notation:** Shown in parentheses on tables and character sheets (e.g., Weapon `1d6(T)` or Armor `0/1(C)`).
  * **T:** Thermal
  * **C:** Chemical
  * **K:** Kinetic
  * **E:** Electrical
  * **A:** ALL Damage Types
* **Delimiters & Combinations:**
  * Multiple types are comma-delimited: `(E,K)`
  * Sub-types are separated by a semicolon after the main type: `(T; Heat, C)` (represents Thermal with Heat sub-type, combined with Chemical).
* **Text Usage:** Rules and general text should write out damage types fully (e.g., `Thermal (Cold)`).

### Core Damage Types
* **Kinetic (K):** Primitive, momentum-based (e.g., swords, bullets, blunt objects). Most common, easiest to use, and hardest to defend against. Kinetic-specific DR is harder to generate than other types.
* **Thermal (T):** Exchange of atomic energy. Has three distinct, separate subtypes:
  * **Thermal (Hot):** Extreme heat (default thermal damage).
  * **Thermal (Cold):** Rapid heat loss.
  * **Thermal (Radiation):** Radiated energy exchanges (sunlight, gamma rays, etc.).
* **Electrical (E):** Raw electrical power focused to harm.
* **Chemical (C):** Damage from chemical reactions (excluding fire, which is Thermal). Often inflicts the **Linger** status or is used in Chemical Throwers to create hazardous tactical zones.

### Complex & Special Damage Types
* **Double Types:** e.g., `Kinetic-Kinetic`, `Thermal-Thermal`. 
  * Represents "doubling down" on a single type.
  * Ignores the target's DR and Strength against that damage type.
  * Deals **2x Weakness** bonus damage.
  * If the target is **Vulnerable**, deals a **x3 critical** instead.
* **Combination Types:** e.g., `Kinetic & Thermal`. 
  * Combines two distinct types (maximum of two). Roll normal damage (no splitting or rolling twice).
  * If the target has DR against either type, it applies.
  * Weaknesses and Strengths to either type apply, but **Weaknesses trump Strengths** (e.g., Weakness to Thermal + Strength to Electric vs. a Thermal & Electric attack results in Weakness applying).
* **NONE:** Uncategorized damage. **Ignores all DR**.
* **ALL:** Combines all four core types (`Kinetic & Thermal & Electrical & Chemical`). Only **Total DR** applies; damage-type-specific DR has no effect.
* **NONE & ALL:** Ignores all DR (like NONE) and doubles down on all damage types (like ALL/Double Type). Targets cannot use DR, and any weakness deals **x3 damage** (triple damage).

### Space Ship MASS Magnitudes
* **MASS Magnitude:** Special type applied to space ship weapons by default. Magnifies damage on a logarithmic scale based on ship weapon size:
  * **MASS 1:** Small
  * **MASS 2:** Medium
  * **MASS 3:** Large
  * **MASS 4:** Huge
* **Damage Scale:** The MASS value indicates the number of extra '0's added to the damage total against non-ship/non-shield targets (e.g., MASS 1 = x10 damage, MASS 2 = x100 damage).
* **Space Combat:** Shields and hulls naturally account for these numbers, so MASS adjustments are not calculated in ship-to-ship combat.
* **Normal vs. Shields:** Normal character weapons (MASS 0) used against a ship's shield have their damage **divided by 10** and are considered non-lethal.

### Target Defenses & Modifiers
* **Weakness:** Bonus damage when a species/object has a weakness to a specific type, e.g., `1W(T; Hot)` adds `+1` damage. Maximum weakness value is **10**.
* **Vulnerable:** All damage of this type is a **x2 critical**.
* **Strength:** All damage of this type is **halved** (takes x0.5 damage).
* **Immunity:** All damage of this type is negated (takes x0 damage).

---

## 9. Conditions

### Core Rules
1.  **Stacking:** Apply all conditions if possible; if conflicting, apply the most severe.
2.  **Initiative Penalty:** Team static Initiative base score is reduced by **1** for each unique condition possessed by at least one member when combat starts.
3.  **Duration/Progression:** 
    *   Gaining the same round-duration condition extends the duration to the new limit.
    *   Gaining the same "until rest" condition in a track increases the severity to the next step.

### Standard Conditions & Tracks

#### Blinded & Deafened
*   **Blinded:** Total concealment on everything. Takes **3Ad (Disadvantage)** on all melee attacks, DEX, and Perception checks. Cannot read or perform visual tasks.
*   **Deafened:** Takes **1Ad (Disadvantage)** on Initiative and Perception. Passive Perception reduced by 1/2 WIS modifier (round down).

#### Confused & Entangled
*   **Confused:** Mentally befuddled; all targets are enemies. **1Ad (Disadvantage)** on INT and WIS checks. If attacked, must target the last attacker. Otherwise, acts randomly.
*   **Entangled:** **1Ad (Disadvantage)** on Attacks and DEX saves. Anchored = immobile; Unanchored = half speed, no running/charging. Attackers gain **1Ad (Advantage)** against an entangled target.

#### Fatigue Track: `[Winded -> Fatigued -> Exhausted]`
*   **Winded:** Same as Fatigued, but removed by a 1-minute breather. Becoming Winded while Winded = Fatigued.
*   **Fatigued:** Half speed. **1Ad (Disadvantage)** on STR/DEX saves and Combat Melee Techniques. Melee attacks take -1. Temp -2 DEX (affects AC/skills). Requires 8 hrs rest.
*   **Exhausted:** No Bonus Actions, Run, or Sprint. No Combat Melee Techniques. Melee attacks take **1Ad (Disadvantage)**, Ranged -2. Temp -2 STR, -4 DEX. No Extra Damage. Cleared by 8 hrs uninterrupted rest.

#### Fear Track: `[Frightened -> Cowering -> Panicked]`
*   **Frightened:** **1Ad (Disadvantage)** on all actions.
*   **Cowering:** Frozen. Lose DEX to AC, saves, and skills. **2Ad (Disadvantage)** on all actions. Lasts ~10 rounds (DC 13 WIS check to break).
*   **Panicked:** Must flee by the most direct route. Can only defend, cannot attack.

#### Grapple Track: `[Grappled -> Pinned]`
*   **Grappled:** Can only attack with bare hands, light weapons, or try to escape. Lose DEX to AC (except against the grappler).
*   **Pinned:** Immobile. Lose DEX to AC against all attackers.

#### Incapacitation & Helpless
*   **Helpless / Incapacitated / Unconscious:** Paralyzed, sleeping, or unconscious. Effective AC = 5 + size mod. Vulnerable to *Coup de Grace*. Passive Perception reduced to 1/4 (round down), no skill checks.
*   *Exhaustion Sleep:* Requires 10 hrs rest to recover; no Passive Perception while asleep.

#### Nausea Track: `[Nauseated -> Sickened]`
*   **Nauseated:** Cannot gain Advantage. Takes **2Ad (Disadvantage)** on all attention-requiring actions.
*   **Sickened:** Treated as Nauseated. Lose **1 CON per day** (rolled) until cured via Treat Injury or death occurs.

#### Prone
*   Standing up is a **Simple Action** but prevents taking a **Bonus Action** that round (no Full Attack/Extra attack).
*   Melee attacks take **1Ad (Disadvantage)**; cannot use Combat or Class-based Techniques.
*   Gains **1Ad (Advantage)** on Ranged attacks against targets > 10 feet away.

#### Shaken Track: `[Shaken -> Dazed -> Stunned -> Paralyzed]`
*   **Shaken:** **1Ad (Disadvantage)** on attacks, saves, and skill checks.
*   **Dazed:** Cannot gain Advantage. **2Ad (Disadvantage)** on all actions. Retains normal AC. Lasts 1 round.
*   **Stunned:** Lose DEX to AC, drop held items, cannot attack or move. Lasts 1 round.
*   **Paralyzed:** Cannot move or act. Considered Helpless.

#### Unstable / Dying
*   Triggered at 0 HP. Character rolls **1d4 CON damage** each turn in combat (every 20 mins out of combat).
*   Stabilized by a DC 20 Treat Injury check (Full Round action).
*   Movement restricted to walk speed only. Default ignored by enemies.

### Expanded/Specialty Conditions
*   **Burning:** Takes **1d6 Thermal damage** at start of turn. Lasts 1d4 rounds. Extinguish: Simple Action + DC 15 DEX check.
*   **Electrified:** Takes **1d6 Electrical damage** at start of turn. **1Ad (Disadvantage)** on DEX checks.
*   **Bleeding:** Takes **1d4 damage** at start of turn (ignores DR). Lasts until healed or DC 15 Treat Injury.
*   **Encumbered:** Half speed. **1Ad (Disadvantage)** on DEX skills and saves.
*   **Overloaded:** Speed 5ft. Lose DEX to AC. **2Ad (Disadvantage)** on STR/DEX checks.
*   **Invisible:** +30 Stealth if immobile, +15 if moving. Attackers take **3Ad (Disadvantage)**.
*   **Hidden:** Using Stealth undetected. Targets are Flat-Footed to them.
*   **Irradiated:** **1Ad (Disadvantage)** on all Ability checks. Prolonged exposure causes permanent CON loss.
*   **Suffocating:** Holds breath for rounds = **2x CON score**. Then, DC 15 CON check each round (increases by +1/rd) or falls Unconscious & Unstable.
*   **Stasis:** Helpless but immune to aging and all damage.
*   **Broken:** (Object/Vehicle) At/below half HP. **2Ad (or -4)** to checks using it.
*   **Dilapidated:** (Structure) 1/2 normal DR; risks collapse if damaged.
