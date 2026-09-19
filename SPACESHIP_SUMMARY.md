# Spaceship Summary & Foundations

Spaceships in Future Path are designed similarly to Characters, possessing core attributes, secondary stats, and unique quirks that define their capabilities in the galaxy.

---

## Ship Conflict Resolution

When using and interacting with Spaceships, players roll **2d10** instead of a d20. This system also replaces the standard Advantage Die.

### Core 2d10 Rules
1. **Base Roll:** Roll 2d10 instead of 1d20.
2. **Exploding Dice:** If a d10 lands on 10, keep that value, roll that die again, and add the new result. A die can only explode once.
3. **Critical Failure:** Occurs only when all rolled dice land on 1.
4. **Critical Success:** Occurs when at least 1 die explodes and the final result is greater than 20 (e.g., Roll a 10 and 5; reroll the 10 and get a 6. Total = 10 + 5 + 6 = 21). Determine critical success *before* adding static bonuses.
5. **Advantage & Disadvantage:** 
   * Disadvantages cancel out advantages, and vice versa; max total is 3.
   * Instead of an Advantage Die, each Advantage grants an extra **1d10** and a static **+2**.
   * When rolling with Advantage, roll the total d10 pool (e.g., 1 Advantage = 3d10) and keep the **top two d10s**, then add +2 per advantage.
6. **Modifiers:** All modifiers are based on the Spaceship's static systems or attributes. No additional dice are rolled.
7. **Skill Usage:** When using a Skill, if the Skill is at all trained, gain **+1** to the total, plus an additional **+1** for each Competency level above novice.

### When to Use
The 2d10 system is used whenever a target DC or opposing check is modified by a Spaceship's Core System Attributes or Secondary Attributes. This includes activating Ship Functions or targeting/affecting a Spaceship.

> [!NOTE]
> **Dealing Damage:** Dealing damage uses the separate **Battle Damage** system (which also uses d10s rolled against a Battle Damage Difficulty Check or BD-DC).

---

## The Ship Core

The foundation of a spaceship is its Core, acting as the power generator (Reactor), power distribution network, and master sub-system.
* **Tech Level:** Dictates the maximum hull size, the type of FTL drive compatible with the ship, the base Customization Points, and the total point budget for the 6 Core System Attributes (CSA).

| Tech Level | CSA Point Budget | Max Hull Size | Base Cust. Points |
| :---: | :---: | :---: | :---: |
| **1** | 10 Points | Large | 1 |
| **2** | 15 Points | Gargantuan | 1 |
| **3** | 20 Points | Colossal | 2 |
| **4** | 25 Points | Colossal | 3 |

---

## The 6 Core System Attributes (CSA)

Modern galactic standard for shipbuilding balances power through 6 primary attributes to avoid overloading the Core reactor:

1. **Engines:** Heart of sub-light mobility. Provides a bonus to Ship Tracking DC equal to the Engine Modifier. Essential for pilot maneuvers.
2. **Weapons:** Offensive firepower. Allows the Weapons Officer to reroll successful d10s up to the modifier value. Also adds to the repair DC for battle damage dealt to enemy ships.
3. **Structure:** Physical hull integrity and internal bulkheads. Adds to the total number of successful d10s an attacker must roll to deal Battle Damage. **Penalty:** Lowers Ship Tracking DC by the modifier value.
4. **Shields:** Energy reflection fields. Increases the target number a d10 must hit to be successful and inflict damage. **Penalty:** Every +2 Modifier lowers the ship's Detection DC by 1 (unless shields are powered down).
5. **Electronics:** Mainframe computer networks and cyberwarfare. Provides bonuses to Ship Functions like Hacking and sets the defense DC against enemy hackers.
6. **Sensors:** Perception, radar, and long-range communications. Scans for objects, detects stealthed ships, and identifies shield weaknesses (adding the Sensor Mod to Weapon attack d10 rolls on a successful Weakness Scan).

---

## Secondary Ship Attributes

Calculated stats directly derived from the 6 CSAs, Hull Size, and crew performance:

* **Reflectors (Shields):** Base 4 + Shield Mod. The minimum number an incoming attack d10 must meet or beat to count as a success.
* **Damage Resistance (Structure):** Base 4 + Structure Mod. The total number of successful d10s an attacker must roll to inflict 1 Battle Damage.
* **Battle Damage Defense (BD-DC):** Expressed as (Resistance, Reflectors). Default baseline is (4, 4).
* **Repair DC Bonus:** Equal to the Weapon Mod. Added to the Battle Damage Repair DC dealt to enemy ships.
* **Tactical Mobility:** Engines Mod + Helm Officer's Dexterity Mod + Helm Officer's Misc Bonuses to Pilot checks. Added to Pilot checks and Tracking DC.
* **Ship Tracking DC:** The primary target DC for targeting and locking onto the ship:
  $$\text{Tracking DC} = 10 + (\text{Tactical Mobility} + \text{Shield Mod}) - \text{Structure Mod} \pm \text{Size Mod}$$
* **Initiative:** $(\text{Engines} + \text{Sensors}) - \text{Structure}$. Determines turn order and phase precedence.
* **Passive Sensors:** $10 + \text{Sensor Mod}$. Baseline detection score. Ships with a Detection DC at or below this value are detected automatically.
* **Stealth DC:** $\text{Detection DC} + \text{Electronics Mod}$ (if positive). Used during Silent Operations (Shields and Engines disabled; no active transmissions).

---

## Sub Ship Attributes

Default physical parameters determined by Hull Size and Configuration, modifiable by upgrades:

* **Movement Speed:** Sub-light combat speed. Typically 4 squares of its size + 1 square per Engine Mod.
* **FTL Engine/Speed:** Faster-Than-Light drive capability, limited by Core Tech Level.
* **Passenger Capacity:** Default living support capacity before taxing life support systems.
* **Cargo Capacity:** Measured in Units (1 Unit = 100 lbs and/or 1 cu ft). Exceeding this overburden's the vessel and cuts combat speed in half (absolute max is $2\times$ capacity with all corridors packed).
* **Hard Points / Bays / Customization Slots:** Defines physical equipment mounts, internal compartments, and modular upgrades.

---

## Hull Sizes

Hull Size establishes baseline attributes, tracking modifiers, battle damage capacities, living/cargo volumes, and hard point / bay allocations:

| Size | Tracking DC (Size Mod) | Detect DC | Battle Damage | Sq Ft / Num of Squares | Pass. Cap. | Avg. Weight | Cargo Capacity | Cust. Bonus | Weapon/Bay Size | Military Cost / Procure | Mil. HP | Mil. Bays | Civilian Cost / Procure | Civ. HP | Civ. Bays |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Colossal** | 8 (-2) | 6 | 5 | ~512,000+ ft / ~1,024 sq | 2,000 | ~65,536 Tons | 65,000 Units | +3 | Huge | $2.9 Billion / 4 | 10 | 8 | $972 Million / 4 | 8 | 10 |
| **Gargantuan** | 8 (-2) | 7 | 4 | ~128,000+ ft / ~256 sq | 500 | ~16,384 Tons | 16,000 Units | +2 | Huge | $972 Million / 3 | 9 | 7 | $324 Million / 3 | 7 | 9 |
| **Huge** | 9 (-1) | 8 | 4 | ~32,000+ ft / ~64 sq | 120 | ~4,096 Tons | 4,000 Units | +2 | Large | $324 Million / 3 | 8 | 5 | $108 Million / 2 | 6 | 8 |
| **Large** | 9 (-1) | 9 | 3 | ~8,000+ ft / ~16 sq | 32 | ~1,024 Tons | 1,000 Units | +2 | Large | $108 Million / 2 | 7 | 4 | $36 Million / 1 | 5 | 7 |
| **Medium** | 10 (0) | 9 | 3 | ~4,000+ ft / ~8 sq | 16 | ~512 Tons | 510 Units | +1 | Medium | $36 Million / 2 | 6 | 3 | $12 Million / 0 | 4 | 6 |
| **Small** | 11 (+1) | 9 | 2 | ~2,000+ ft / ~4 sq | 8 | ~256 Tons | 250 Units | +1 | Medium | $12 Million / 1 | 6 | 2 | $4 Million / 0 | 4 | 5 |
| **Tiny** | 11 (+1) | 10 | 2 | ~500+ ft / ~1 sq | 4 | ~64 Tons | 64 Units | +1 | Small | $1.9 Million / 1 | 5 | 1 | $640,000 / 0 | 3 | 4 |
| **Diminutive** | 12 (+2) | 11 | 1 | ~125 ft / 16 per sq | 2 | ~16 Tons | 16 Units | +0 | Small | $480,000 / 1 | 3 | 0 | $160,000 / 0 | 2 | 2 |
| **Fine** | 12 (+2) | 12 | 0 | <75 ft / 256 per sq | 1 | ~4 Tons | 4 Units | +0 | Small | $240,000 / 0 | 2 | 0 | $80,000 / 0 | 1 | 1 |

### Hull Size Column Key
* **Size Mod:** Added to or subtracted from total Tracking DC.
* **Detection DC:** How difficult it is for other ships to passively detect this vessel.
* **Battle Damage Capacity:** Number of Battle Damage points the ship can sustain before being disabled.
* **Sq Ft:** Constructs larger than ~1,024,000 sq ft are classified as Space Stations (Super Colossal).
* **Cust. Bonus:** Additional Customization Points granted by hull size.
* **Military vs. Civilian:** Military ships cost more and prioritize Hard Points (HP). Civilian craft are cheaper and prioritize interior Bays.

---

## Hull Configurations

Specialized design archetypes tailoring a vessel for specific roles. A ship can also be built as a generic hull without an archetype.

> [!IMPORTANT]
> **Order of Operations:** All Disadvantages and Advantages that impact Attribute Points and Core System Attributes are applied **before** point buying happens. For example, if a ship configuration gains +2 to Shields, the ship starts with 10 in all attributes except Shields, which starts at 12. Then the player spends their Tech Level Point Buy budget to further customize the ship. Customization Points are spent **after** Point Buy in the order of ship creation.

### Barges
The pack mules of the galaxy; ubiquitous, cheap, and modular.
* **Average Size:** Medium (Small to Large)
* **Cost / Procure Diff:** $12 Million / 0
* **Disadvantages:** -2 Engines, -1 Weapons, -2 Hard Points, -1 Bay (absorbed by cargo)
* **Advantages:** Cargo Space is one ship size modifier higher. Super common (-1 Procure Diff, 50% less repair time/cost).

### Battle Cruisers
Fast, heavy-hitting warships designed to counter smaller craft and escort battle fleets.
* **Average Size:** Large
* **Cost / Procure Diff:** $120 Million / 3
* **Disadvantages:** Cargo Capacity one size lower, Passenger Cap is 8, -3 Attribute Points, -1 Customization Point (Min 1)
* **Advantages:** +2 Electronics, +2 Engines, Pick either: [+1 Engines or +1 Electronics], +1 Non-Weapon Hard Point, Can pick 1 Ship Function to have by default without taking up Customization Points.

### Battle Ships
Massive warships serving as military backbones.
* **Average Size:** Huge (or Gargantuan)
* **Cost / Procure Diff:** $384 Million / 4
* **Disadvantages:** Cargo and Passenger capacities one size lower, -3 Attribute Points, -1 Customization Point (Min 1)
* **Advantages:** +2 Weapons, +2 Shields, +1 Structure, Pick either: [+1 Engines or +1 Electronics], Gains one more Ship Function of your choice for free, +1 Hard Point (Weapon Only).

### Capital Ships
Command leviathans and super-carriers acting as mobile naval headquarters.
* **Average Size:** Colossal
* **Cost / Procure Diff:** $3.2 Billion / 5
* **Disadvantages:** -3 Attribute Points, -2 Engines, -2 Hard Points, -1 Customization Point (Min 1)
* **Advantages:** +1 Bay, +2 Sensors, +2 Electronics, Pick either: [+1 Shields or +1 Structure], Passenger capacity 864. Grants **Supreme Commander** bridge position (leadership bonus across the solar system). Choose 1 Ship Function to install at no cost.

### Carriers
Fleet-support vessels carrying and deploying wings of smaller craft.
* **Average Size:** Gargantuan (Huge to Colossal)
* **Cost / Procure Diff:** $1.2 Billion / 4
* **Disadvantages:** -3 Attribute Points, -2 Engines, -4 Hard Points, -1 Bay, -1 Customization Point (Min 1)
* **Advantages:** +2 Sensors, +2 Electronics, Pick either: [+1 Engine or +1 Structure], built-in Repair Facility for ships $\le 2$ sizes smaller. Holds 6 Large ships by default (or 12 Medium, 24 Small, 96 Tiny, 384 Diminutive, 1,536 Fine). Additional Hangar/Drone Bays add capacity. Special bridge position: **Field Commander**.

### Cruisers
Flexible combat vessels used in naval recon or law enforcement, with civilian VIP luxury conversions.
* **Average Size:** Medium
* **Cost / Procure Diff:** $40 Million / 2 (Military) | $10 Million / 0 (Civilian)
* **Disadvantages:** -2 Attribute Points (Military) | -1 Structure, -1 Hard Point, -2 Attribute Points (Civilian)
* **Advantages:** 
  * *Military:* +1 Hard Point or +1 Bay (Pick one), +1 Sensors, [+2 Engines or +2 Electronics] (Pick one), 1 free Ship Function.
  * *Civilian:* +2 Engines, +2 Sensors, Luxury Passenger Bay (accommodates 16).

### Destroyers
Heavily armed anti-swarm screening combatants with minimalist crews.
* **Average Size:** Medium
* **Cost / Procure Diff:** $38 Million / 3 (Illegal to own without military license; +1 Procure Diff)
* **Disadvantages:** -2 Attribute Points, -1 Bay, Weapon Hard Points locked to 'Small' size.
* **Advantages:** +2 Hard Points, all weapons considered 'Gimbaled' (+1 Targeting for free), no penalties when targeting smaller craft.

### Dreadnoughts
Devastating planetary and station siege craft armed with massive focused energy weaponry.
* **Average Size:** Gargantuan (Huge to Colossal)
* **Cost / Procure Diff:** $3.0 Billion / 5
* **Disadvantages:** -2 Engines, -5 Ability Points, -4 Hard Points, -3 Bays. Cannot cloak or stealth; cannot warp while cooling down.
* **Advantages:** Gigantic focused energy cannon. Targets from $100\times$ Huge weapon distance; deals $24\text{d}10 \times 10$ damage. Cooldown: $(1\text{d}4 + 2) - \text{Electronics Mod}$ rounds (min 2).

### Drones
Autonomous or remotely piloted AI craft.
* **Average Size:** Fine (Fine to Small)
* **Cost / Procure Diff:** $100,000 / 0
* **Disadvantages:** -1 across all Attributes.
* **Advantages:** Unmanned; programmable attack/defense. Swarms of 4+ gain Tracking DC advantages vs. projectile attacks. Requires a host Drone Bay.

### Fighters
Agile single-seat interceptors and strike craft.
* **Average Size:** Fine to Diminutive
* **Cost / Procure Diff:** $480,000 / 1
* **Disadvantages:** -2 Structure, Passenger capacity is 1.
* **Advantages:** +2 Engines, gains 'Feint' Ship Function for free.

### Frigates
Versatile patrol, escort, and security craft.
* **Average Size:** Small (Small to Medium)
* **Cost / Procure Diff:** $4–36 Million / 0–2
* **Disadvantages:** -1 Weapons.
* **Advantages:** +1 Sensors, +1 Attribute Point, 50% less repair time/cost.

### Freighters
Large-scale commercial cargo haulers.
* **Average Size:** Huge
* **Cost / Procure Diff:** $100 Million / 1
* **Disadvantages:** -3 Engines, -1 Attribute Points.
* **Advantages:** Converted Cargo Bays give double space. +2 Bays. Capacity 16,000 Units (or 1 size higher). Tech 3 includes free 'Beam' function. 50% reduction in base hull and repair costs.

### Industrial
Mining, salvage, and refinery factory ships.
* **Average Size:** Large (Medium to Huge)
* **Cost / Procure Diff:** $12–108 Million / 0–1
* **Disadvantages:** -2 Engines, -1 Attribute Points, -3 Bays.
* **Advantages:** Free Industrial Facility and Refinery Facility. Tech 3 includes free 'Beam' function. Free 'Grapple' function.

### Shuttles
Short-range personnel runabouts and utility transports.
* **Average Size:** Tiny (Diminutive to Small)
* **Cost / Procure Diff:** $2 Million / 0
* **Disadvantages:** -2 Structure, -2 Electronics, -1 Hard Point.
* **Advantages:** +4 Engines, +2 Sensors, Basic Autopilot AI (+1), bonus passenger slots (+1 Diminutive, +2 Tiny, +3 Small).

---

## FTL Drives

FTL drives enable interstellar travel. A ship can mount drives up to its Core Tech Level and comes standard with an Assisted Jump Drive. Mounting a secondary FTL consumes **1 Bay and 1 Hard Point** (cannot use Customization Points).

| Tech | Drive Name | Range Rating | Warp Factor | Price / Diff | Durability | Key Properties |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **1** | Assisted Jump Drive | Medium | 10+ | $50,000 / 0 | 0 | Requires Jump Gate station. |
| **1** | Warp Drive (The Hopper) | Medium | 1–4 | $150,000 / 0 | +2 | Pulsed space-time contraction; common. |
| **2** | Assisted Adv. Jump Drive | Large | 10+ | $100,000 / 0 | 0 | Extended range with Jump Gate station. |
| **2** | Warp Drive (The Skimmer) | Large | 1–7 | $300,000 / 0 | +1 | Skims contracted space at high pulse frequency. |
| **2** | Slip Stream Drive | Large | 1–7 | $450,000 / 1 | +3 | Subspace tears; 30s prep, +4 to enemy tracking. |
| **3** | Personal Jump Drive | Medium (Large assist) | 10+ | $1,000,000 / 0 | 0 | Independent Warp 10 jump without gate; 1 jump/tank. |
| **3** | Warp Drive (High Pulse) | Large | 1–8 | $3,500,000 / 1 | +2 | Lossless energy conduits, smooth rapid transition. |
| **3** | Phase Shift Drive | Large | 1–7 | $5,000,000 / 2 | +6 | Massless acceleration; 6s (2 turns) tear creation. |
| **4** | Adv. Personal Jump Drive | Large (Extreme assist)| 10+ | $10,000,000 / 1 | 0 | Long-range independent Warp 10 jumps. |
| **4** | Expert Warp Drive | Extreme | 1–9 | $15,000,000 / 2 | +3 | Elite personal warp device. |
| **4** | Adv. Slip Stream Drive | Extreme | 1–8 | $25,000,000 / 3 | +8 | Internal phase tears (1 turn); silent exit stealth. |

---

## Ship Positions & Functions

Crew members take up stations on the bridge to unlock active Ship Functions:

### Key Bridge Positions
* **Helm Officer (Engines):** Governs sub-light maneuvering and Tactical Mobility.
* **Weapons Officer (Weapons):** Controls offensive hard points and damage mitigation.
* **Captain (Charisma):** Directs crew, grants leadership bonuses and tactical coordination.
* **Communications / Sensor Officer (Sensors):** Controls scanner arrays, ECM/ECCM, and comms.
* **Chief Engineer (Structure):** Oversees reactor stability, field repairs, and overclocking.
* **Science Officer (Electronics):** Cyberwarfare, system boosting, and shield harmonics.
* **Medical Officer (Medical):** Health maintenance, trauma surgery, and bridge stabilization.

### Function Categories

Ship Functions are specialized actions and abilities—similar to Character Skills—performed during combat or operational phases. Standard Functions are available baseline to ships and crew based on their assigned Bridge Position. Advanced Functions require specialized hardware upgrades (consuming a Bay, Hard Point, or Customization Slot) or specific Character Feats.

#### Standard Functions
Available by default to all ships; activated by crew members occupying the appropriate bridge position (or universal to any console).

* **Universal (All Crew):**
  * **Change Position (N/A):** Move to a new bridge station/officer role. Takes 1 round (can be rushed with an Acrobatics check DC 10 + conditions). The Captain can instantly take over any station in emergencies.
  * **Shield Manipulation (Knowledge: Science):** Alter shield frequencies to counter enemy sensors and weapons. Opposes enemy scans to block *Gather Information*, increases the disconnect DC for active hackers, reduces enemy *Scan Weakness* attack bonuses, or cancels enemy attack d10s if the enemy hasn't scanned.
  * **Weapons Assist (Dexterity, or Int/Wis with Feats):** Any non-Weapons officer rolls an accuracy check against target Tracking DC to convert a failed friendly attack d10 into a success or grant a reroll before weapon rerolls are made.
* **Captain (Charisma):**
  * **Give Command (Charisma / Leadership):** Directs and assists an officer (DC 10). Grants +1 (+1 per 4 DC beaten) to that officer's roll, or grants bonus attack pool points / rerolls to the Weapons Officer.
  * **Encourage Crew (Charisma / Leadership):** Delivers a rallying speech (DC 12 + active officers + round number; 1/combat) granting *Give Command* bonuses to all bridge crew simultaneously (except Weapons).
* **Science Officer (Electronics):**
  * **Boost (Electronics):** Diverts Electronics modifier points (DC 10) into Engines, Weapons, Shields, or Sensors for 1–2 rounds (1-turn cooldown per boosted attribute); can also assist another officer's Electronics check without cooldown.
  * **Hack / Counter-Hack (Electronics & Sensors):** Infiltrates enemy systems across 3 progressive phases (Gain Access, Information Gathering / Disruption, System Harm / Battle Damage) to disable attributes, lock weapon hard points, power down bays, or inflict direct system damage.
* **Communications / Sensor Officer (Sensors):**
  * **Scan (Sensors & Wisdom):** Conducts passive sweeps or active scans. In combat: identifies ship weaknesses to add +(1 + Sensors Mod) to weapon attack d10s, fulfills targeting accuracy checks against stealthed vessels, and gathers system intelligence.
  * **Hack / Counter-Hack (Electronics & Sensors):** Shares cyberwarfare offensive capabilities with the Science Officer (or assists in joint hacking).
* **Helm Officer (Engines / Pilot):**
  * **Fly Offensively / Defensively (Tactical Mobility / Pilot):** Opposed Pilot check against a target vessel. Flying Offensively reduces the required d10 successes for friendly Battle Damage by 1 (min 1); Flying Defensively forces the enemy to score 1 additional success to deal Battle Damage.
  * **Close / Widen Distance (Engines / Pilot):** Opposed Pilot check to shift the combat distance band (Short, Medium, Long, Huge, Vast, Astronomic).
  * **Pursue / Intercept (Engines / Pilot):** Chase maneuver to close down an evasive craft, cut off its vector, or set up a Ramming attack.
  * **Ram (Engines):** High-impact collision executed at Short range after a successful intercept. Roll d%: >50% causes Battle Damage to both ships; ≤50% inflicts Battle Damage only on the target vessel (friendly repair DC is fixed at 7).
* **Weapons Officer (Weapons):**
  * **Fire (Weapons):** Standard attack action rolling the ship's Battle Pool (1d10 per active hard point) against enemy Battle Damage Defense (BD-DC). Allows rerolls up to the Weapons Modifier and determines damage using the 2d6 Battle Damage Chart.
  * **Bombard (Weapons):** Concentrates all firepower on a single target, granting a bonus special attack d10 (success on 4+) and rerolling 7s on the Battle Damage chart (weapons suffer 2 turns of cooldown strain).
* **Chief Engineer (Structure / Craft):**
  * **Repair (Craft: Structure / Mechanics, Ship Bays):** Emergency field repairs rolling against the Battle Damage repair DC to remove damage and restore disabled ship systems.
  * **Boost (Engines Only):** Routes auxiliary reactor power (DC 10) to temporarily increase Engine modifier output for 1–2 rounds.
  * **Counter-Hack (Electronics):** Defensive cyber check opposing an active intruder's roll to detect, trace, and expel enemy hackers from ship networks.
* **Medical Officer (Medical):**
  * **Medical (Medical Skill, Medical Bay):** Employs medical equipment to heal crew Hit Points, revive dazed/stunned/unconscious crew, stabilize dying crew members, perform emergency trauma surgery, or treat diseases and toxins.

#### Advanced Functions
Require dedicated hardware installations (Bays, Hard Points, or Customization Slots) or specialized Character Feats.

* **Universal (All Crew):**
  * **Beam (Electronics | Transporter Bay):** Dematerializes matter into energy and beams it to/from target coordinates or another vessel (DC 20+ in adverse conditions; transporter pad size scales from Medium to Colossal).
* **Captain (Charisma):**
  * **Commanding Presence (Charisma | Character Feat):** Passive command aura granting all non-command crew members a bonus equal to $\lceil\frac{1}{2}\text{Charisma}\rceil$ on rolls for $1 + \text{CHA mod}$ rounds per day.
  * **Direct Assistance (Charisma):** Captain personally oversees a single bridge station, granting that officer continuous Advantage on all actions and automatic *Give Command* checks each turn.
* **Science Officer (Electronics):**
  * **Cloak (Electronics | Cloaking Bay / Hard Point):** Activates stealth fields (Frequency Absorbent, Wave Disrupting, or Hybrid Full Spectrum) to drastically raise the ship's Detection DC against sensors.
  * **Crypto (Electronics | Crypto Bay / Customization Slot):** Quantum cryptographic array that encrypts friendly comms, deciphers intercepted enemy transmissions, and prevents hackers from eavesdropping on internal channels.
* **Communications / Sensor Officer (Sensors & Electronics):**
  * **Sensor Spoofing / Decoy Projection (Sensors / Electronics | Decoy Launcher):** Projects phantom signatures or launches physical chaff decoys, forcing enemy scans/targeting to roll with Disadvantage or granting a 50% chance to divert incoming guided missiles.
  * **Crypto (Electronics | Crypto Bay / Customization Slot):** Secures fleet communications and cracks hostile ciphers.
  * **Jam (Electronics | Jammer Hard Point):** Emits electronic countermeasures to blind enemy sensors, scramble comms, shut down hostile drones, abort enemy transporter beams, spoof missile locks, or de-sync active hackers.
* **Helm Officer (Engines):**
  * **Emergency Evasive Thrusters (Engines | Aux Thruster Upgrade):** Violent evasive burst (opposed Pilot check by 4+); forces attacker to need 3 additional success d10s and increases Tracking DC, but requires 3 turns of engine cooldown.
  * **Feint (Engines | Advanced Defensive Flying):** Complex evasive maneuvers granting +4 Tracking DC and forcing attackers to roll 2 additional success d10s (imposes cumulative Disadvantage on subsequent feints in the same battle).
  * **Grapple (Engines | Grappler Mount / Bay):** Deploys robotic arms, magnetic harpoons, clamps, or tractor beams to latch onto an enemy vessel, denying its Engine bonus to Tracking DC and enabling automatic Ramming.
* **Weapons Officer (Weapons):**
  * **Concentrated Fire (Weapons):** Focused targeting on specific enemy subsystems; attack d10s rolling 9–10 count double, and raises maximum subsystem damage from 5 to 7.
  * **Defensive Fire (Weapons | Point Defense):** Assigns active projectile, laser, or plasma hard points to point defense, rolling 1d10 per dedicated mount to intercept and destroy incoming missiles or small strike craft.
* **Chief Engineer (Structure / Core):**
  * **Overclock Core (Structure / Core | Reactor):** Overclocks reactor output (Craft DC $14 + \text{Tech Level}$) to gain 2+ floating attribute bonus points to distribute freely; failure strains the core or blows capacitors.
  * **Cloak (Electronics | Cloaking Bay / Hard Point):** Regulates core harmonics and power distribution for active cloaking fields.
  * **Grapple (Engines | Grappler Mount / Bay):** Operates physical winches, magnetic tethers, or tractor beam emitters to capture or position enemy craft.
* **Medical Officer (Medical):**
  * **Resuscitation / Life Support (Medical Bay / Facility Class 3+):** Places fallen crew in cryogenic stasis or resuscitates recently deceased personnel (dead $<12$ hours, body $\ge 90\%$ intact) back to life at 1 HP and 1 CON.
  * **Long / Short Automated Care (Medical Bay / Facility):** Medical bay systems automate intensive therapy, granting continuous natural healing and ability score recovery without requiring manual daily care checks.

---

## Space Stations

Artificial space installations lacking FTL capability:
* **Scale:** Constructs $>1,024,000$ sq ft are classified as Space Stations. They are divided into structural segments, each possessing the minimum hit points of a Colossal vessel.
* **Bays & Hard Points:** Standard hard point allotment for size, but receives **+1 additional Bay**.
* **Mixed Weapon Hard Points:** Huge hard points can hold mixed smaller mounts:
  * 1 Huge Mount = 2 Large Weapons = 3 Medium Weapons = 4 Small Weapons.
* **Firing Arcs:** Stations $>1,024,000$ sq ft can only direct up to 50% of their total weapons at any single craft at a time.
* **Life Support:** Station personnel capacity equals the corresponding ship size multiplied by 10 ($10\times$).

---

## Ship Quirks

Quirks add distinctive personality, history, and mechanical trade-offs:

### Out Dated
Antiquated systems more prone to odd behavior.
* **Negative:** 25% lower purchase price; 50% reduction in resale value. Permanent.
* **Positive:** Pick another quirk and ignore its negative effect.

### Cranky
Internal conduits require physical coaxing to cycle.
* **Negative:** If the ship takes 2 Battle Damage in one round, roll for the second damage and apply its side effect (Base DC 7).
* **Positive:** None.

### Falling Apart
A weathered jalopy with chronic maintenance issues.
* **Negative:** 25% resale reduction. 20% daily chance of system failure (d100 roll):
  * *1–10%:* Superficial rattles.
  * *11–20%:* Minor Engine failure (-1 Engines).
  * *21–30%:* Minor Weapon glitch (-1 Weapons).
  * *31–40%:* Minor Structural crack (-1 Hit Die).
  * *41–50%:* Minor Shield fluctuation (-1 Shields).
  * *51–60%:* Minor Electrical fault (-1 Electronics; flickering lights).
  * *61–70%:* Minor Sensor ghosting (-1 Sensors).
  * *71–80%:* Random bay disabled.
  * *91–100%:* Major problem (requires replacement materials).
* **Positive:** Crew gains **Advanced Jerry Rigging** feat for repairs to this ship only.

### Infested
Persistent space pests living inside bulkheads and wiring conduits.
* **Negative:** Daily CON save (DC 12) for all on board or become **Nauseated** (or **Sickened** if already nauseated) for 1d4 days (cured by 1 day rest off-ship or Treat Disease DC 15). Engineers suffer -1 to repair checks.
* **Positive:** Stowaways suffer -10 Stealth. Advantage on Comms checks with pirates and smugglers.

### Bad Past
Previous owners left an infamous criminal or political record.
* **Negative:** Disadvantage on Comms in sensitive situations; hostiles may attack unprovoked.
* **Positive:** 50% chance any recognizing contact is friendly or allied.

### Artificial Intelligence
Unregistered, sentient AI wired into primary systems (Highly Illegal).
* **Negative:** Severely illegal to sell or operate in civilized space. Harsh criminal penalties. Cannot be negated by 'Out Dated'.
* **Positive:** +1 to Sensors, Engines, and Electronics. The ship can pilot and defend itself.
* **Personalities:** Optimist, Bully, Physio, Shy/Unsure, Overachiever, Whimsical.

### Noisy
Pervasive bulk-head rattling, humming, and jittering.
* **Negative:** -2 penalty on all Boost function checks.
* **Positive:** None.

### Battle Scars
A hull hardened and pockmarked by historical combat engagements.
* **Negative:** -1 Detection DC; +1 to Repair DC for Battle Damage.
* **Positive:** Advantage on Comms checks when using **Intimidate**.

### Lucky
The vessel miraculously slips through lethal fire.
* **Negative:** None.
* **Positive:** Once per day, a player can reroll any check that uses one of the ship's attribute modifiers.

### Cursed
Maddening jinxes plague everyday operations.
* **Negative:** Once per day, negates the first Critical Success rolled for a ship-based check.
* **Positive:** None.

### Experimental
Brand new prototype with manufacturer bugs.
* **Negative:** Once per day, roll 1d6 (1: Engines, 2: Weapons, 3: Structure, 4: Shields, 5: Electronics, 6: Sensors); that attribute drops to 10 until repaired (DC $12 + \text{Tech Level} + \text{Hull Size}$; Engineer can take 20).
* **Positive:** If the Engineer scores a Critical Success on the repair check, add their Intelligence Modifier as a bonus to that attribute score.

---

## Designing a Custom SpaceShip (Builder Checklist)

1. **Determine Core Tech Level:** Establishes starting CSA points, max hull size, base customization points, and FTL drive tier.
2. **Select Hull Configuration:** Choose an archetype (or remain generic) and apply attribute, slot, and function adjustments.
3. **Select Hull Size:** Determines base hull cost, civilian/military Hard Points and Bays, cargo/passenger capacities, and tracking/detection DCs.
4. **Allocate CSA Points:** Spend Tech Level points across the 6 CSAs using the point-buy table.
5. **Determine Masterworking:** Crafters with Rank 5 in shipbuilding skills can add up to +3 CSA points (+25% base cost per point).
6. **Select FTL Drive:** Mount a compatible FTL system.
7. **Equip Hard Points & Bays:**
   * Purchase weapons and ammunition (2% base weapon price per magazine).
   * Install facilities into available Bays.
   * Spend Customization Points on CSA Upgrades (Class 1–5) or specialized accessories.
8. **Calculate Secondary Attributes:** Compute Reflectors, Damage Resistance, BD-DC, Tactical Mobility, Tracking DC, and Initiative.
9. **Assign Ship Quirks (Optional):** Add thematic perks and defects.
