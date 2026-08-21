# Skill System Summary

## Core Roll Formula
**1d20 + Skill Die + Ability Modifier + Miscellaneous Modifiers** vs **Difficulty Class (DC)** or **Opposed Check**.

## Skill Acquisition & Rank Rules
* **Skill Points:** Earned per level = `Character Path + INT Modifier` (minimum 1 point per level, even with negative INT mod). Unspent skill points roll over to subsequent levels.
* **Skill Ranks:** Ranks range from **1 through 20**.
* **Max Rank Limit:** Equal to **Character Level** (Max Rank = Character Level, up to 20).
  * *Exceptions:* **Language** and **Feat-based skills** are not bound by the character level limit (Language max rank is 10).
* **Favored Skills:**
  * Cost: **1 Skill Point** per rank (Non-Favored skills cost **2 Skill Points** per rank).
  * Gaining a Favored Skill (via Path or Class at level 1 or at any other level) grants **1 free Skill Point** that must be spent immediately on that skill (if already maxed, the point can be spent or saved as the player wishes).
  * **Language** is always a Favored Skill for all Paths.

## Skill Classifications & Types
* **Natural:** Usable at Rank 0 (Untrained). Untrained roll formula: `d20 + Ability Mod + Misc Mods` (no Skill Die).
* **Unnatural:** Marked with `*`. Requires at least Rank 1 (Trained) to use. Cannot be used at all if untrained (Rank 0).
* **Trained vs Untrained:** Trained = Rank ≥ 1. Untrained = Rank 0.
* **Rank Dependent:** Pre-determines maximum achievable outcome or static benefits based on rank:
  * **Athletics:** Bonus to base movement speed and max carry capacity.
  * **Craft:** Determines when one can Mastercraft and by how much.
  * **Perform:** Directly determines maximum possible amount of ISK earned in a performance.
  * **Language:** Number of languages known, fluency level, and comprehension of written/spoken fragments. Always Favored; max rank 10; uncapped by level.
  * **Medical:** Amount of Hit Die used to roll for recovery of health.
* **Special Types:** Feat-based Skills (unlocked only via Feat, uncapped by level) and Skill-like Abilities (scale automatically with level, e.g., Tech).

## Ranks & Competency Levels
Competency Levels act as training milestones, granting a static **Miscellaneous Modifier** (+0 to +8) and determining the **Skill Die**:

* **Unexperienced:** Rank 0–2 (+0 bonus)
* **Novice:** Rank 3–5 (+1 bonus)
* **Intermediate:** Rank 6–8 (+2 bonus)
* **Experienced:** Rank 9–11 (+3 bonus)
* **Competent:** Rank 12–14 (+4 bonus)
* **Expert:** Rank 15–17 (+5 bonus)
* **Master:** Rank 18–20 (+6 to +8 bonus: Rank 18 = +6, Rank 19 = +7, Rank 20 = +8)

### Skill Rank / Die Levels & Success Probabilities

| Skill Rank* | Competency Level | Competency Bonus | Skill Die | DC5 | DC10 | DC15 | DC20 | DC25 | DC30 | DC35 | DC40 | DC45 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **0** | Unexperienced | +0 | None (0) | 80.00% | 55.00% | 30.00% | 5.00% | 0.00% | 0.00% | 0.00% | 0.00% | 0.00% |
| **1** | Unexperienced | +0 | d2 | 87.50% | 62.50% | 37.50% | 12.50% | 0.00% | 0.00% | 0.00% | 0.00% | 0.00% |
| **2** | Unexperienced | +0 | 2d2 | 95.00% | 70.00% | 45.00% | 20.00% | 0.00% | 0.00% | 0.00% | 0.00% | 0.00% |
| **3** | Novice | +1 | 2d2+1 | 98.75% | 75.00% | 50.00% | 25.00% | 1.25% | 0.00% | 0.00% | 0.00% | 0.00% |
| **4** | Novice | +1 | d4+d2+1 | 99.38% | 80.00% | 55.00% | 30.00% | 5.63% | 0.00% | 0.00% | 0.00% | 0.00% |
| **5** | Novice | +1 | 2d4+1 | 99.69% | 85.00% | 60.00% | 35.00% | 10.31% | 0.00% | 0.00% | 0.00% |
| **6** | Intermediate | +2 | 2d4+2 | 100.00% | 89.69% | 65.00% | 40.00% | 15.00% | 0.31% | 0.00% | 0.00% |
| **7** | Intermediate | +2 | d6+d4+2 | 100.00% | 92.92% | 70.00% | 45.00% | 20.00% | 2.08% | 0.00% | 0.00% |
| **8** | Intermediate | +2 | 2d6+2 | 100.00% | 95.14% | 75.00% | 50.00% | 25.00% | 4.86% | 0.00% | 0.00% |
| **9** | Experienced | +3 | 2d6+3 | 100.00% | 97.22% | 79.86% | 55.00% | 30.00% | 7.78% | 0.14% | 0.00% |
| **10** | Experienced | +3 | d8+d6+3 | 100.00% | 97.92% | 83.96% | 60.00% | 35.00% | 12.08% | 1.04% | 0.00% |
| **11** | Experienced | +3 | 2d8+3 | 100.00% | 98.44% | 87.27% | 65.00% | 40.00% | 16.56% | 2.73% | 0.00% |
| **12** | Competent | +4 | 2d8+4 | 100.00% | 99.22% | 90.62% | 69.92% | 45.00% | 20.78% | 4.38% | 0.08% | 0.00% |
| **13** | Competent | +4 | d10+d8+4 | 100.00% | 99.37% | 92.50% | 74.37% | 50.00% | 25.63% | 7.50% | 0.63% | 0.00% |
| **14** | Competent | +4 | 2d10+4 | 100.00% | 99.50% | 94.00% | 78.25% | 55.00% | 30.50% | 11.00% | 1.75% | 0.00% |
| **15** | Expert | +5 | 2d10+5 | 100.00% | 99.80% | 95.80% | 82.20% | 59.95% | 35.20% | 14.20% | 2.80% | 0.05% |
| **16** | Expert | +5 | d12+d10+5 | 100.00% | 99.83% | 96.50% | 85.00% | 64.58% | 40.17% | 18.50% | 5.00% | 0.42% |
| **17** | Expert | +5 | 2d12+5 | 100.00% | 99.86% | 97.08% | 87.36% | 68.78% | 45.14% | 22.92% | 7.64% | 1.22% |
| **18** | Master | +6 | 2d12+6 | 100.00% | 99.97% | 98.06% | 90.07% | 73.06% | 50.00% | 26.94% | 9.93% | 1.94% |
| **19** | Master | +7 | 2d6+d12+7 | 100.00% | 100.00% | 99.59% | 94.62% | 80.09% | 57.44% | 32.91% | 12.88% | 2.41% |
| **20** | Master | +8 | 4d6+8 | 100.00% | 100.00% | 99.98% | 98.23% | 87.04% | 64.92% | 40.02% | 16.77% | 2.96% |

*\* Note: Skill Rank is Skill Rank level (1–20), NOT Character Level. Probabilities reflect `d20 + Skill Die` alone and do not include Ability Modifiers, Miscellaneous Modifiers, or Advantage.*

### Competency DC Requirements
* GMs can specify a required Competency Level for a DC (e.g., `Computer Use DC15 (Competent)`).
* If a character's competency differs from the required level, adjust the DC by **±3 points** (or **+4 DC per level below** for lower competency) per competency level difference.

## Using Skills & Time Rules
* **Time:** Standard non-combat skill check takes **1–2 minutes** of in-game time.
* **Combat / Rushing:** In combat, actions take rounds (3 sec/round). **Rushing** an action increases the DC by **+5**. Out-of-combat time estimates range from 10 seconds to 1 minute per round equivalent.
* **Taking 10 / Taking 20:**
  * Takes **10 or 20 minutes** of in-game time.
  * Replaces the d20 roll with 10 or 20 (`20/10 + Skill Rank + Competency Level + Misc Mods`).
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
