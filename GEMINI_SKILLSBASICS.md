# Skill System Summary

## Core Roll Formula
**1d20 + Skill Die + Ability Modifier + Miscellaneous Modifiers** vs **Difficulty Class (DC)** or **Opposed Check**.

## Skill Acquisition & Rank Rules
* **Skill Points:** Earned per level = `Character Path + INT Modifier` (minimum 1 point per level, even with negative INT mod). Unspent skill points roll over to subsequent levels.
* **Max Rank Limit:** `1/2 Character Level` (rounded up). 
  * *Exceptions:* **Language** and **Profession** ranks are not bound by the character level limit. (Language max rank is 10).
* **Favored Skills:**
  * Cost: **1 Skill Point** per rank (Non-Favored skills cost **2 Skill Points** per rank).
  * Gaining a Favored Skill (via Path or Class at level 1 or later) grants **1 free Skill Point** that must be spent immediately on that skill (if already maxed, point can be spent elsewhere).
  * **Language** is always a Favored Skill for all Paths.

## Skill Classifications & Types
* **Natural:** Usable at Rank 0 (Untrained). Untrained roll formula: `d20 + Ability Mod + Misc Mods` (no Skill Die).
* **Unnatural:** Marked with `*`. Requires at least Rank 1 (Trained) to use.
* **Trained vs Untrained:** Trained = Rank ≥ 1. Untrained = Rank 0.
* **Rank Dependent:** Pre-determines maximum achievable outcome or static benefits based on rank:
  * **Athletics:** Bonus to base movement speed and max carry capacity.
  * **Craft:** Determines Mastercrafting eligibility and rating.
  * **Perform:** Maximum ISK earned from performances.
  * **Language:** Number of languages known, fluency level, and comprehension of written/spoken fragments. Always Favored; max rank 10; uncapped by level.
  * **Medical:** Number of Hit Die rolled for health recovery.
* **Special Types:** Feat-based Skills (unlocked only via Feat) and Skill-like Abilities (scale automatically with level, e.g., Tech).

## Ranks & Competency Levels
Competency Levels act as training milestones, granting a static **Miscellaneous Modifier** (+0 to +5) and determining Skill Die:

| Skill Rank | Competency Level | Competency Bonus | Skill Die |
| :--- | :--- | :--- | :--- |
| **Rank 0** | Unexperienced | +0 | None (0) |
| **Rank 1** | Unexperienced | +0 | 1d2 |
| **Rank 2** | Novice | +1 | 1d2+1 |
| **Rank 3** | Novice | +1 | 1d4+1 |
| **Rank 4** | Intermediate | +2 | 1d4+2 |
| **Rank 5** | Intermediate | +2 | 1d6+2 |
| **Rank 6** | Competent | +3 | 1d6+3 |
| **Rank 7** | Competent | +3 | 1d8+3 |
| **Rank 8** | Expert | +4 | 1d8+4 |
| **Rank 9** | Expert | +4 | 1d10+4 |
| **Rank 10** | Master | +5 | 1d10+5 |

*Note: Skill Die Level includes the static Competency Level bonus.*

### Competency DC Requirements
* GMs can specify a required Competency Level for a DC (e.g., `Computer Use DC15 (Competent)`).
* If a character's competency differs from the required level, adjust the DC by **±3 points** (or **+4 DC per level below** for lower competency) per competency level difference.

## Using Skills & Time Rules
* **Time:** Standard non-combat skill check takes **1–2 minutes** of in-game time.
* **Combat / Rushing:** In combat, actions take rounds (3 sec/round). **Rushing** an action increases the DC by **+5**. Out-of-combat time estimates range from 10 seconds to 1 minute per round equivalent.
* **Taking 10 / Taking 20:**
  * Takes **10 or 20 minutes** of in-game time.
  * Replaces the d20 roll with 10 or 20 (`10/20 + Skill Rank + Competency Level + Misc Mods`).
  * **Requirements:** Narrative time permits, no active threats or distractions, and **no penalty for failure** (no damage, condition, or loss of retry ability).
  * Does not guarantee success if DC exceeds the total; cannot produce a critical success.
* **Trying Again:** Permitted if the skill has no penalty for failure. Some skills prohibit retries upon failure.
* **Aiding Another:**
  * Takes a **Standard Round** action in combat. Helper must be capable of performing the skill.
  * Aided character gains **Advantage** equal to the number of helpers.
  * Allows re-rolling failures up to the total number of helpers (maximum **3 re-rolls**).
* **Dividing Tasks:** Helpers split workload for speed (e.g., crafting large structures). All helpers must succeed. Cannot be combined with Taking 10/20.
* **Cooperative Checks:** Group works on a common task (e.g., Grand Encounters, Diplomacy, Perception). All roll individually; success threshold depends on task (e.g., 2+ succeed for negotiation, 1+ for clue finding).
* **Opposed Checks:** Roll vs opponent's check. Higher result wins. Ties resolved by higher key Ability Score (re-roll if tied again).
* **Profession Kits:** Tools required for certain skills (General Equipment). Non-masterwork kits have **20 uses** by default. Failed checks still consume a use.
* **Skill Synergy (Optional Rule):** If two skills logically apply (e.g., Sleight of Hand + Medical for surgery), roll both skill checks and use the higher result (must be agreed before rolling).

## Difficulty Class (DC) Scale & GM Guidelines
| Difficulty | DC | Example (Skill) |
| :--- | :--- | :--- |
| **Very Easy** | 0 | Read native language (*Automatic success, no roll*) |
| **Easy** | 5 | Climb a knotted rope (Athletics: Climb) |
| **Average** | 10 | Hear an approaching security guard (Perception) |
| **Tough** | 15 | Disarm an explosive (Disable Device / Demolitions) |
| **Challenging** | 20 | Fly spaceship through asteroid field (Pilot) |
| **Formidable** | 25 | Break into secure computer system (Computer Use) |
| **Heroic** | 30 | Surgery on alien species in combat zone (Medical: Surgery) |
| **Superheroic** | 35 | Bluff guard without badge into high-security area (Bluff) |
| **Nearly Impossible** | 40 | Track commando through alien forest after rain (Survival) |

* **Level Scaling:** Baseline DCs are calibrated for level ~10 characters. Adjust DCs by **2–5 points per 5 levels**. At level 1, DC 30+ is an automatic failure.
* **Advantage / Disadvantage:** Maximum of **3 Advantage dice** can be added to a roll.

## Ability Checks & Saving Throws
* **Ability Check Roll:** `d20 + Ability Mod`.
* **With Ability Affinity:** `d20 + Ability Die + Advantage Die`.
* **Ability Saving Throws:** React to avoid negative effects/damage; uses same roll formula.
* **Aiding:** Helper requires an Ability Score of **10+**. Cannot aid Saving Throws. Taking 10/20 does not apply to Ability Checks or Saving Throws.

## Skill List by Ability Theme
* **STR:** Athletics, Intimidate, Escape Artist
* **DEX:** Acrobatics, Escape Artist, Pilot, Ride, Sleight of Hand, Stealth
* **CON:** None
* **INT:** Computer Use, Craft, Decipher Script, Demolitions, Disable Device, Knowledge, Study, Bluff
* **WIS:** Perception, Sense Motive, Survival, Medical, Diplomacy, Demolitions, Handle Animal
* **CHA:** Bluff, Diplomacy, Disguise, Handle Animal, Intimidate, Perform

*(Note: Multi-ability skills include Bluff [INT/CHA], Demolitions [INT/WIS], Diplomacy [WIS/CHA], Escape Artist [STR/DEX], Handle Animal [WIS/CHA], and Intimidate [STR/CHA].)*
