# Robot Companions Reference (Gemini Context File)

[Official Robot Companion Character Sheet](https://drive.google.com/file/d/1lTVPItaRrVrvc8kWDo2BhdEiC5XPYGRX/view?usp=sharing)

## 1. Character Creation Workflow & General Rules
* **Workflow:** Pick Chassis Size & Technology Type $\rightarrow$ Spend ability points via modified Point Buy $\rightarrow$ Choose Locomotion $\rightarrow$ Select starting Software Programs/Upgrades & mount Hard Points $\rightarrow$ Choose starting Robotic Feature $\rightarrow$ Choose 3 Favored Skills & spend 1 starting skill point $\rightarrow$ Choose 1 starting Feat $\rightarrow$ Level up one level at a time.
* **Leveling up:** If the Robot starts at a higher level than 1, level it up exactly one level at a time.

---

## 2. Chassis Size & Point Buy
Chassis size determines **AC Bonus**, **Hit Die**, **Ability Points**, and **Hard Point Slots**.
A Large robot does **not** occupy 4 squares (it is 1 square), but friendly combatants **cannot** move through its occupied square.

| Chassis Size | AC Bonus | Hit Die | Ability Points | Hard Point Slots |
| :--- | :---: | :---: | :---: | :--- |
| **Tiny** | +2 | d4 | 9 | 1 Small |
| **Small** | +1 | d6 | 10 | 2 Small |
| **Medium** | +0 | d8 | 10 | 1 Small, 1 Medium **OR** 3 Small |
| **Large** | -1 | d10 | 11 | 1 Small, 1 Large **OR** 2 Medium |

### Modified Point Buy System
All robots start with base attributes: **Str 9, Dex 9, Con 10, Wis 3, Int 8, Cha 5**.
Buying points scales relative to the starting base of the attribute:
* Raising from `[Base]` to `[Base + 1]` costs **1 point** (e.g., Wis 3 $\rightarrow$ 4 costs 1; Str 9 $\rightarrow$ 10 costs 1).
* Raising from `[Base + 1]` to `[Base + 2]` costs **2 points** (e.g., Wis 4 $\rightarrow$ 5 costs 2; Str 10 $\rightarrow$ 11 costs 2).
* Raising from `[Base + 2]` to `[Base + 3]` costs **3 points**, and so on.

---

## 3. Technology Types
Technology provides natural AC, attribute modifiers, and kinetic/energy damage resistances (DR).

* **Mechanical Tech:** Servos are metallic compound frames powered by electricity.
  * **Natural AC:** +1
  * **Attribute Modifiers:** +1 Strength
  * **Specials:** DR 1 Kinetic and Thermal.
* **Synthetic Based Tech:** Bioengineered organic machinery powered by biological means.
  * **Natural AC:** +1
  * **Attribute Modifiers:** +1 Dexterity, +1 Constitution
  * **Specials:** DR 1 Electrical.
* **Cybernetic Tech:** Biologic/Mechanical hybrid using motor servos and carbon-based parts.
  * **Natural AC:** +0
  * **Attribute Modifiers:** +2 to either Strength or Dexterity, +1 Constitution
  * **Specials:** DR 1 Kinetic.
* **Hydraulic Plasma Tech:** Movement and hydraulics powered by plasma manipulation. High computing.
  * **Natural AC:** +0 (+1 AC if built at Tech level 4).
  * **Attribute Modifiers:** +2 Strength, +1 Dexterity.
  * **Specials:** Requires Tech level 3. DR 1 Kinetic.
* **Nanotech / Nanocomposite:** Swarm nanocomposites with fluid reconstruction and self-assembly.
  * **Natural AC:** +0
  * **Attribute Modifiers:** +2 Dexterity, -1 Strength.
  * **Specials:** Self-Repairing Nanites (combat regen +1 HP/round, twice out-of-combat heal rate). Fluid Form (squeeze through tight gaps two sizes smaller without penalty once per encounter). Electrical Weakness 2.
* **Photonic / Hard-Light Tech:** Hard-light projectors and crystal focusing matrices.
  * **Natural AC:** +2 against ranged, +0 against melee.
  * **Attribute Modifiers:** +2 Intelligence, +1 Dexterity, -2 Constitution.
  * **Specials:** Refraction Array (DR 2 Thermal, immune to sight-blindness and laser gaze). Kinetic Weakness 2.

---

## 4. Locomotion
Determines base speed. Robots can have multiple forms of locomotion, but only one primary.

* **Active Flight:** 60ft. Base DC for flying in difficult terrain (e.g., storms) is reduced to **10** (instead of 15).
* **Gliding/Hover:** 40ft. Can hover in place (like a helicopter). Difficult terrain base DC is reduced to **10**.
* **Quadrupedalism:** 40ft.
* **Rolling:** 40ft on artificial surfaces (streets/sidewalks), but reduced to **20ft** in off-road situations (even if not difficult terrain).
* **Bipedal/Multipedal:** 30ft. Humanoid bipeds or insectoid multi-legged platforms. Bipeds have forelimbs acting as basic manipulators (hold items, open doors), while multi-legged gain Advantage to resist being tripped/knocked prone.
* **Tracked/Treaded:** 30ft. Heavy tank treads; ignores rough/off-road movement penalties, and gains +2 to resist being shoved or forced backward.

---

## 5. Software/Programs/Apps (Define Function)
* **Skill Programs:** Unlocks a new non-standard skill (excluding `Athletics` and `Profession`, which robots cannot learn).
* **Skill Upgrade:** +1 Misc Bonus to target skill at Lvl 1, 5, 10, 15, 20 (retroactive).
* **Task Prioritizer Upgrade:** +1 Misc Bonus to a selected Skill or Hard Point. If weapon: choice of **+1 Accuracy** OR **+1 Damage**. Can be taken multiple times.
* **Assistance Protocol Upgrade (Critical):** Enables the robot to provide and receive aid on skill checks. Without this, a robot cannot assist or be assisted.
* **Medical Triage Program:** Unlocks `Treat Injury` skill with +1 Misc Bonus. Heals **+1 HP per Robot level** on successful Treat Injury checks.
* **Medical Support Program:** Within 5ft of owner, robot can use a Simple action to add its Advantage Die to owner's Treat Injury check. On success, heals **+1 HP per Robot level**.
* **Medical Upgrade:** *(Requires Triage or Support)* Adds another Advantage Die to the associated check; on success, adds the die result to total HP recovered.
* **Tactical Awareness Program:** Owner uses robot's Passive Perception if higher. If robot is not surprised, owner is not caught flat-footed/surprised.
* **Tactical Defense Program:** Within 5ft of owner, robot uses a Reaction to absorb AoE damage (e.g. grenades). Owner takes 1/2 damage (no damage on successful Dex save) and can save even if grenade lands in their square. Prevents owner from being flanked.
* **Tactical Offense Program:** Adds robot's Advantage Die to weapon damage once (does not apply to Extra Damage).
* **Tactical Support Program:** Within 5ft of owner, robot uses a Simple action to add its Advantage Die to owner's accuracy check.
* **Infiltration Program:** Unlocks `Stealth` skill. Moves stealthily without speed penalties. +1 Misc bonus to Stealth. Gains Advantage against unaware targets (including other machines) when successfully in stealth.
* **Infiltration Support Upgrade:** *(Requires Stealth)* If robot is stealthy, allies within 10ft gain a Stealth bonus equal to **+1 for every 2 points** the robot's Stealth check beats the opposing Perception.
* **Universal Translator App:** Unlocks `Language` as favored skill. Can decipher unknown alien dialects/scripts (DC 15 Study/Knowledge). Owner gains Advantage on Diplomacy and Bluff checks when translating through the robot.
* **Electronic Warfare App:** Once per encounter (Standard action), Computer Use check vs target Wis save to jam target (Disadvantage on ranged attacks/sensors for 1 round).
* **LiDAR Mapping App:** Owner gains Advantage on Survival/Navigation checks. Party gains +1 Initiative in rooms/corridors scanned by the robot.
* **Overclocking App:** Once per encounter (Simple action), redlines processing core for 3 rounds. Robot gains +10ft speed, +1 Accuracy on all attacks, and its Advantage Die tier increases by one step. Takes 1d6 Kinetic/Internal damage bypassing DR upon termination.

---

## 6. Hard Points (Equipment & Weapon Mounting)
Weapons and gear must mount to Hard Points. Clunky weapons occupy **2 slots** (of any size).
Robots **cannot** use Archaic weapons. They suffer a **-1 penalty to Accuracy and Damage** on weapons with the Exotic attribute.

* **Weapon Hard Point:** Mounts weapons up to max level by size: **Small** (Levels 0–2), **Medium** (Levels 0–5), **Large** (Levels 0–8).
* **Medical Hard Point:** Uses First Aid/Medical Kits as ammo (requires physical contact). Unlocks `Treat Injury` skill. Rank = Medical HP MW Level + Chassis MW Level. **Uses Dexterity instead of Wisdom** as the associated ability.
* **Professional Kit Hard Point:** Uses a professional kit as ammo to unlock a skill or task. Rank = Kit HP MW Level + Chassis MW Level. Uses the highest ability score if combining multiple skills.
* **Surveillance Hard Point:** Unlocks `Study` and `Perception` for surveillance and reporting.
* **Scanner Hard Point:** Mounts equipment scanners. Robot can assist another player's check as a helper, but cannot perform the skill itself.
* **Single Use Item Hard Point:** Delivers Syringes or Grenades. Ammo capacity by HP size: **Small = 3, Medium = 5, Large = 7**.
* **Multi Use Item Hard Point:** Mounts items like containers or force fields. Activated by Robot, or by owner if adjacent.
* **Emulation of Animal Attack Hard Point:** Emulates an Animal Natural Attack (damage die = HP size). Poison secondary effects have ammo limits: **Small = 3, Medium = 5, Large = 7**.
* **Power Link Hard Point:** Auxiliary generator linkage and power-routing matrix. **Small:** powers any Small/Medium energy device or console indefinitely via cable. **Medium:** recharges up to 2 energy cells per hour of downtime, or grants an adjacent ally a +2 temporary shield bonus. **Large:** powers vehicle engines, ship subsystems, or outpost consoles; grants owner Advantage on adjacent Repair and Craft (Electronic) checks.

---

## 7. Robotic Features
Features improve at specific levels as dictated by the Technology Levels Table.

| Robotic Feature | Requirements | Description |
| :--- | :---: | :--- |
| **Sturdy Frame** | MW Mechanical (or Chemical if Synthetic) | +1 Kinetic DR per improvement. |
| **Autonomous Repairing** | Synthetic or Cybernetic | Repairs +1 HP/round per improvement. |
| **Electrified Movement** | Mechanical, Cybernetic, or Hydraulic | +1 Dexterity score per improvement. |
| **Mechanized Precision** | Mechanical or Cybernetic | +1 to weapon proficiency advantage rolls per improvement. |
| **Artificial Strength** | Mechanical or Hydraulic | +1 Strength score per improvement. |
| **Advanced Sensors** | None | +1 Misc Bonus to Perception and Passive Perception. |
| **Reinforced Plating** | None | +1 AC on every other improvement (at levels 1, 10, 20). |
| **Thermal Insulation** | Mechanical, Cybernetic, or Hydraulic | +1 Thermal DR per improvement. |
| **Corrosion Resistance** | Masterwork Chemical | +1 Chemical DR per improvement. |
| **Non-conductive** | Synthetic | +1 Electrical DR per improvement. |
| **Resilient Tissue** | Synthetic or Cybernetic | +1 Constitution per improvement. |
| **Infrared/Thermal Optics** | None | Upgraded thermal lenses and software. Grants thermal-vision (heat signature darkvision, ignores smoke/foliage) and +1 to Perception per improvement. |
| **Modular Interface** | None | Expandable software directories and ports. Unlocks 1 extra Subroutine (trick) or Software App slot per improvement. |
| **Strobe Spotlight** | None | High-intensity LED cone spotlight (30ft). Flash blind (once/encounter): adjacent targets Dex save (DC 10 + Dex Mod) or Dazed for 1 round. Spotlight cone range increases by +15ft and DC by +1 per improvement. |

---

## 8. Skills, Feats & Leveling
* **Skills:** Pick 3 Favored at Lvl 1 from: `Perception`, `Study`, `Language` (picking a language again instantly grants 5 ranks), `Computer Use`, `Craft`, `Disable Device`, `Knowledge`.
* **Skill Points:** Gains exactly **1 skill point** per level. Intelligence has no effect on robot skill points.
* **Feats:** Gains 1 starting feat from the [Robotic Feats List](file:///home/rye/PycharmProjects/d20FuturePathWiki/wiki_raw_text/RoboticFeats.txt).
* **Level 1 Table Bonuses (CRITICAL):** Level 1 bonuses (Robotic Feat, Software, Feature) are **already included** in starting creation stats. Do not add them as extra bonuses!
* **Advantage Die:** The Advantage Die on the table directly replaces the companion's current Advantage Die.

### Technology Levels Table
| Robot Level | Advantage Die | Bonuses |
| :---: | :---: | :--- |
| **1st** | 1d2 | Robotic Feat, Software, Robotic Feature |
| **2nd** | 1d2 + 1 | Subroutine |
| **3rd** | 1d4 + 1 | Attack Improvement OR Armor Improvement (AC +1) |
| **4th** | 1d4 + 2 | Ability Score +1 |
| **5th** | 1d4 + 2 | Subroutine, Feature Improvement |
| **6th** | 1d6 + 2 | Extra Damage, Robotic Feat |
| **7th** | 1d6 + 3 | Advanced Robotic Feature, Software Program/Upgrade |
| **8th** | 1d8 + 3 | Attack Improvement OR Armor Improvement (AC +1) |
| **9th** | 1d8 + 3 | Ability Score +2 **OR** Feature Improvement |
| **10th** | 1d8 + 4 | Feature Improvement **OR** new Robotic Feature |
| **11th** | 1d8 + 4 | Robotic Feat, Subroutine |
| **12th** | 1d10 + 4 | Extra Damage |
| **13th** | 1d10 + 5 | Attack or Armor Improvement, Software Program/Upgrade |
| **14th** | 1d10 + 5 | Ability Score +2 **OR** Feature Improvement |
| **15th** | 1d12 + 5 | Subroutine, Robotic Feat |
| **16th** | 1d12 + 6 | Feature Improvement |
| **17th** | 1d12 + 6 | Attack Improvement OR Armor Improvement (AC +1) |
| **18th** | 2d6 + 6 | Extra Damage, Software Program/Upgrade |
| **19th** | 2d6 + 7 | Ability Score +1, Subroutine |
| **20th** | 2d6 + 7 | Attack or Armor Improvement, Feature Improvement |

---

## 9. Subroutines
Learned AI behaviors utilizing the adaptive Behavioral Learning Algorithm.

* **Aid:** Companion can use 'Aid Another' action on skills it possesses. Owner can also aid companion.
* **Attack On Sight:** Instantly attacks unknowns. Owner can roll initiative and attempt a DC 15 Computer Use check as a reaction to stop the robot if the owner acts before it. Otherwise, grants surprise round potential.
* **Guard:** Menacingly blocks a passage or targets. Attacks only if attacked.
* **Watch:** Companion remains stealthy (Stealth check) and uses Perception to raise an alarm (sirens, strobes, network alerts) upon detecting unknowns.
* **Bombard:** (Flying/Glide only) Advanced charge; allows companion to keep moving after charging, or drop an object on an enemy using a standard ranged attack (Dexterity).
* **Deliver:** Delivers an object over long distance/time (DC 10 Survival check per day of travel).
* **Detect:** Advantage on Perception/Study to pinpoint explosives, traps, passages, etc. Cannot retry.
* **Distract:** Uses Feint combat technique to grab target's attention.
* **Fake Malfunction:** Disguises itself as non-operational or damaged. Wis check DC `12 + (1/4th Robot Level, rounded down)` to see through.
* **Get Help:** Trainer designates up to [Int score] creatures as "help." Companion journeys to find and retrieve them.
* **Identify:** Extensive database allows the Robot to attempt to identify an object or phrase as if trained in all Knowledge and Crafting skills with **2 ranks**.
* **Lie (Illegal):** Installs unauthorized deceptive logic. Unlocks `Bluff` as a class skill with a +2 Misc Bonus and 1 Rank. Makes the robot **Illegal**.
* **Monitor:** Monitors communications/electronic systems. Acts like a Perception check. If comms are encrypted, can only detect existence.
* **Urban Tracking:** Gains Advantage on Survival checks while in an urban environment.
* **Stay:** Companion waits in place, defending itself only if attacked.
* **Rescue Protocol:** Moves to adjacent down/helpless/unconscious ally, secures them as a free action, and drags them up to half speed away from hostiles.
