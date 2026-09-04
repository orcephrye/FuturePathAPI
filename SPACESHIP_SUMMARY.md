# Spaceship Summary & Foundations

Spaceships in Future Path are designed similarly to Characters, possessing core attributes, secondary stats, and unique quirks that define their capabilities in the galaxy.

## Ship Conflict Resolution

When using and interacting with Spaceships, players use a **2d10 system** instead of a d20, which also replaces the standard Advantage Die.

### Core 2d10 Rules
1. **Base Roll:** Roll 2d10 instead of 1d20.
2. **Exploding Dice:** If a d10 lands on 10, keep that value and roll it again, adding the new result. A die can only explode once.
3. **Critical Failure:** Occurs only when all rolled dice land on 1.
4. **Critical Success:** Occurs when at least 1 die explodes and the final result is greater than 20. (e.g., Roll a 10 and 5, reroll the 10 and get a 6. Total = 10 + 5 + 6 = 21).
5. **Advantage & Disadvantage:** 
   * Functions normally (canceling each other out, max stack of 3), but each Advantage grants an extra **1d10** and a static **+2** instead of an Advantage Die.
   * When rolling with Advantage, roll the total d10 pool (e.g., 1 Advantage = 3d10) and keep the **top two d10s**.
   * Determine critical success *before* adding the static +2 bonus per advantage.
6. **Modifiers:** All modifiers are based on the Spaceship's static systems or attributes. No additional dice are rolled.

### When to Use
The 2d10 system is used whenever a target DC or opposing check is modified by a Spaceship's Core System Attributes or Secondary Attributes. This includes using Ship Functions or when targeting/affecting a Spaceship.

***Note on Damage:** Dealing damage uses the separate **Battle Damage** system (which also uses d10s but against a Battle Damage Difficulty Check or BD-DC).*

## The Ship Core
The foundation of a spaceship. The Core acts as the power generator (Reactor) and distribution sub-system.
*   **Tech Level:** Dictates the maximum size of the ship, the type of FTL drive it can use, and the total points available to spend on Core System Attributes (CSA).
    *   **Tech 1:** 10 Points | Max Size: Large
    *   **Tech 2:** 15 Points | Max Size: Gargantuan
    *   **Tech 3:** 20 Points | Max Size: Colossal
    *   **Tech 4:** 25 Points | Max Size: Colossal

## The 6 Core System Attributes (CSA)
The modern galactic standard for shipbuilding. Points provided by the Ship Core are spent to balance these systems so as not to overload the reactor.

1.  '''Engines:''' The heart of sub-light mobility. Provides a bonus to Ship Tracking DC equal to the Engine's Modifier.
2.  '''Weapons:''' Offensive power. Allows the Weapons Officer to re-roll successful d10s up to the modifier value. Also adds to the repair DC for battle damage dealt to enemies.
3.  '''Structure:''' Physical hull integrity. Adds to the total number of successful d10s an enemy needs to deal Battle Damage. '''Penalty:''' Lowers Ship Tracking DC by the modifier value.
4.  **Shields:** Energy reflection. Increases the target number a d10 must hit to be successful. **Penalty:** Every +2 Modifier lowers the ship's Detection DC by 1.
5.  **Electronics:** Computer technology and cyberwarfare. Provides bonuses to Ship Functions like Hacking and sets the defense DC against enemy hackers.
6.  **Sensors:** Perception and comms. Used to scan for objects, detect stealthed ships, and find shield weaknesses (adding the Sensor Mod to Weapon d10 rolls).

## Secondary Ship Attributes
These are calculated stats directly affected by the 6 CSAs and Hull Size.

*   **Reflectors (Shields):** Base 4 + Shield Mod. The number an attacking d10 must meet/beat.
*   **Damage Resistance (Resistance):** Base 4 + Structure Mod. The number of successful d10s needed to deal Battle Damage.
*   **Battle Damage Defense (BD-DC):** The combination of Resistance and Reflectors (Default 4,4).
*   **Repair DC Bonus:** Equal to the Weapons Mod. Added to the DC when an enemy tries to repair damage dealt by this ship.
*   **Tactical Mobility:** Equals the Engines Mod + Helm Officer's Dexterity Mod + Helm Officer's Misc Bonuses to Pilot check. Added to Pilot functions and Ship Tracking DC.
*   **Initiative:** (Engines + Sensors) - Structure. Determines turn order.
*   **Passive Sensors:** 10 + Sensor Mod. The baseline for detecting other ships.
*   **Stealth DC:** Detection DC + Electronics Mod. Used during Silent Operations (Shields/Engines disabled).

## Sub Ship Attributes
Default stats provided by Hull Size and Configuration, modifiable by upgrades.

*   **Movement Speed:** Sub-light speed. Usually 4 squares of its size + 1 square per Engine Mod.
*   **FTL Engine/Speed:** Faster-Than-Light capability, limited by Core Tech Level.
*   **Passenger Capacity:** Base living capacity before taxing life support.
*   **Cargo Capacity:** Measured in Units (100lbs / 1 sq ft). Exceeding this cuts combat speed in half.
*   **Hard Points/Bays/Customization Slots:** Dictates how many weapons, facilities, and upgrades the ship can hold.

## Hull Sizes
Size predetermines base stats, Tracking DC modifiers, Battle Damage thresholds, passenger/cargo capacities, and available hard points/bays for military vs. civilian variants.

| Size | Tracking DC (Size Mod) | Detect DC | Battle Damage | Sq ft / Num of Squares | Pass. Cap. | Avg. Weight | Cargo Capacity | Cust. Bonus | Military Cost / Procure | Mil. HP | Mil. Bays | Civilian Cost / Procure | Civ. HP | Civ. Bays |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| '''Colossal''' | 8 (-2) | 6 | 5 | ~512,000+ ft / ~1,024 sq | 2000 | ~65,536 Tons | 65,000 Units | +3 | 2.9 Billion / 4 | 10 | 8 | 972 Million / 4 | 8 | 10 |
| '''Gargantuan''' | 8 (-2) | 7 | 4 | ~128,000+ ft / ~256 sq | 500 | ~16,384 Tons | 16,000 Units | +2 | 972 Million / 3 | 9 | 7 | 324 Million / 3 | 7 | 9 |
| '''Huge''' | 9 (-1) | 8 | 4 | ~32,000+ ft / ~64 sq | 120 | ~4096 Tons | 4,000 Units | +2 | 324 Million / 3 | 8 | 5 | 108 Million / 2 | 6 | 8 |
| '''Large''' | 9 (-1) | 9 | 3 | ~8,000+ ft / ~16 sq | 32 | ~1,024 Tons | 1,000 Units | +2 | 108 Million / 2 | 7 | 4 | 36 Million / 1 | 5 | 7 |
| '''Medium''' | 10 (0) | 9 | 3 | ~4,000+ ft / ~8 sq | 16 | ~512 Tons | 510 Units | +1 | 36 Million / 2 | 6 | 3 | 12 Million / 0 | 4 | 6 |
| '''Small''' | 11 (+1) | 9 | 2 | ~2,000+ ft / ~4 sq | 8 | ~256 Tons | 250 Units | +1 | 12 Million / 1 | 6 | 2 | 4 Million / 0 | 4 | 5 |
| '''Tiny''' | 11 (+1) | 10 | 2 | ~500+ ft / ~1 sq | 4 | ~64 Tons | 64 Units | +1 | 1.9 Million / 1 | 5 | 1 | 640,000 / 0 | 3 | 4 |
| '''Diminutive''' | 12 (+2) | 11 | 1 | ~125 ft / 16 per sq | 2 | ~16 Tons | 16 Units | +0 | 480,000 / 1 | 3 | 0 | 160,000 / 0 | 2 | 2 |
| '''Fine''' | 12 (+2) | 12 | 0 | <75 ft / 256 per sq | 1 | ~4 Tons | 4 Units | +0 | 240,000 / 0 | 2 | 0 | 80,000 / 0 | 1 | 1 |

### Hull Size Column Key
*   '''Size Mod:''' Acts like creature size modifiers; added to or taken from total Tracking DC.
*   **Detection DC:** How hard it is for other ships to "see" this ship passively.
*   **Battle Damage:** How much damage a ship can take before being disabled.
*   **Sq ft:** Anything more than ~1,024,000 sq ft is considered Super Colossal (a Space Station).
*   **Passenger Capacity:** Default living support before taxing systems (can be raised with bays).
*   **Cargo Capacity:** Max units before the ship becomes overburdened (cuts combat speed in half).
*   **Cust. Bonus:** Additional Customization Points provided by the hull size.
*   **Military vs Civilian:** Military ships are more expensive and have more Hard Points (HP). Civilian ships have more Bays.

## Hull Configurations
Specialized archetypes that give a space craft a more specialized purpose, modifying secondary attributes. It is not required; a ship can be a generic build.

### Barges
The 'pack mule' of the galaxy.
*   **Average Size:** Medium (Small - Large)
*   **Average Cost / Procure Diff:** 12 Million / 0
*   **Disadvantages:** -2 to Engines, -1 To Weapons, -2 Hard Points, -1 Bay (Taken up by extra Cargo Space)
*   **Advantages:** Cargo Space is one ship size modifier higher. Super common Bonus -1 to Procure Diff and 50% less time/cost to repair.

### Battle Cruisers
Flexible, heavy-hitting machines of war used as a counter for smaller ships.
*   **Average Size:** Large
*   **Average Cost / Procure Diff:** 120 Million / 3
*   **Disadvantages:** Cargo Capacity is one size lower, Passenger Cap is 8, -5 Attribute Points, -1 Customization point (Minimum 1)
*   **Advantages:** +2 Electronics, +2 Engines, +1 Non-Weapon Hard Point, Can pick one Ship Function to have by default without taking up Customization Points.

### Battle Ships
Massive war machines and the backbone of militaries.
*   **Average Size:** Huge (or Gargantuan)
*   **Average Cost / Procure Diff:** 384 Million / 4
*   **Disadvantages:** Cargo Capacity and Passenger Cap is one size smaller, -5 Attribute Points, -1 Customization Point (Minimum 1)
*   **Advantages:** +2 Weapons, +1 Structure, +1 Engines, Gains the 'Bombard' function for free. Gains one more Ship Function of your choice for free. +1 Hard Point (Weapon Only).

### Capital
Massive command ships and super carriers, acting as a base of operations.
*   **Average Size:** Colossal
*   **Average Cost / Procure Diff:** 3.2 Billion / 5
*   **Disadvantages:** -5 Attribute Points, -2 Engines, -2 Hard Points, -1 Customization Point (Minimum 1)
*   **Advantages:** +1 Bays, +2 Sensors, +2 Electronics. Passenger capacity is: 864. Special Position: **Supreme Commander** (leadership bonus to all ships in solar system). Choose any one Ship Function to be installed without cost.

### Carriers
Ships that make large fleets mobile, designed to hold and maintain smaller ships.
*   **Average Size:** Gargantuan (Huge - Colossal)
*   **Average Cost / Procure Diff:** 1.2 Billion / 4
*   **Disadvantages:** -5 Attribute Points, -2 Engines, -4 Hard Points, -1 Bay, -1 Customization Point (Minimum 1)
*   **Advantages:** +2 Sensors, +2 Electronics, Built in Repair Facility for ships two sizes and smaller. 
*   **Misc:** Can hold 6 large ships by default. Special Position: **Field Commander** (leadership bonus to all ships under its care).

### Cruisers
Flexible combat vessels, used as police craft or military portal/recon.
*   **Average Size:** Medium
*   **Average Cost / Procure Diff:** 40 Million / 2 (Military) | 10 Million / 0 (Civilian)
*   **Disadvantages:** -3 Attribute Points (Military) | -1 Structure, -1 Hard Point, -2 Attribute Points (Civilian)
*   **Advantages:** (Military) +1 Hard Point or +1 Bay, +2 Engines or +2 Electronics. Pick a free Ship Function. | (Civilian) +2 Engines, +2 Sensors. Luxury passenger bay (max 16).

### Drones
AI-controlled machines, ranging from military swarms to personal defense.
*   **Average Size:** Fine (Fine - Small)
*   **Average Cost / Procure Diff:** 100,000 / 0
*   **Disadvantages:** -1 across all Attributes.
*   **Advantages:** Can be used without a pilot. Programmed to defend/attack.
*   **Misc:** Swarm bonuses apply when 4+ are teamed. Requires a Drone Bay to deploy/control.

### Destroyers
Heavily armed medium ships designed to counter smaller swarms.
*   **Average Size:** Medium
*   **Average Cost / Procure Diff:** 38 Million / 3
*   **Disadvantages:** Illegal to own (Procure Diff +1), -3 Attribute Points, -1 Bay, Weapon Hard Points geared for 'Small' weapon size.
*   **Advantages:** +2 Hard Points, All weapons considered 'Gimbaled' (+1 Targeting). No penalties for targeting smaller craft.

### Dreadnoughts
Gargantuan "Station busters" with hyper-focused energy cannons.
*   **Average Size:** Gargantuan (Huge - Colossal)
*   **Average Cost / Procure Diff:** 3 Billion / 5
*   **Disadvantages:** -2 Engines, -5 Ability Points, -4 Hard Points, -3 Bays. Cannot cloak.
*   **Advantages:** Super gigantic hyper-focused energy cannon. Targets from 100x Huge Weapon distance. Deals 24d10 * 10 damage. Cooldown: (1d4 + 2) - Electric Mod rounds.

### Fighters
Single-pilot (or small crew) agile combat craft.
*   **Average Size:** Fine - Diminutive
*   **Average Cost / Procure Diff:** 480,000 / 1
*   **Disadvantages:** -2 Structure, Passenger Cap is 1
*   **Advantages:** +2 Engines. Gains the 'Feint' Ship Function for free.

### Frigates
Common police craft or VIP transport.
*   **Average Size:** Small (Small - Medium)
*   **Average Cost / Procure Diff:** 4-36 Million / 0-2
*   **Disadvantages:** -1 to Weapons
*   **Advantages:** +1 to Sensors, +1 Attribute Point. 50% less cost/time spent on repairs.

### Freighters
Industrial-scale cargo transportation ships.
*   **Average Size:** Huge
*   **Average Cost / Procure Diff:** 100 Million / 1
*   **Disadvantages:** -3 Engines, -2 Attribute Points
*   **Advantages:** Converted Cargo Bays provide double space. +2 Bays. Capacity 16,000 Units or one size higher. Tech 3 comes with 'Beam' function. 50% less cost/repair time.

### Industrial
Mining and refining factory ships.
*   **Average Size:** Large (Medium - Huge)
*   **Average Cost / Procure Diff:** 12 - 108 Million / 0 - 1
*   **Disadvantages:** -2 Engines, -2 Attribute Points, -3 Bays
*   **Advantages:** Free Industrial and Refinery Facilities. Tech 3 comes with 'Beam' function. Free 'Grapple' function.

### Shuttles
Personal transport vehicles.
*   **Average Size:** Tiny (Diminutive - Small)
*   **Average Cost / Procure Diff:** 2 Million / 0
*   **Disadvantages:** -2 Structure, -2 Electronics, -1 Hard Points
*   **Advantages:** +4 Engines, +2 Sensors, Basic Auto Pilot (AI +1), +1 Passenger for Diminutive, +2 for Tiny, +3 for Small.

## Space Stations
Artificial constructs without FTL drives. Anything over 1,024,000 Sq Ft is a station. They gain +1 Bay compared to a ship of similar size and can mount mixed weapon sizes on Huge hard points.

## Ship Quirks
Unique traits or defects that ships can gain over time or possess from construction, adding personality and specialized mechanics. Players can often remove them with the right skills, though some are permanent.

### Out Dated
Old and antiquated; more likely to gain other quirks.
*   **Negative:** Costs 25% less to buy; 50% less to sell. Permanent.
*   **Positive:** Choose another quirk and ignore its negative effect.

### Cranky
Internal components require physical encouragement to function.
*   **Negative:** If the ship receives 2 Battle Damage in one round, roll for the second damage and add its effect (Base DC 7).
*   **Positive:** None.

### Falling Apart
A "pile of junk" with constant maintenance needs.
*   **Negative:** 25% reduction in resale value. 20% daily chance of something breaking (1-10% Superficial, 11-80% Minor system/bay problem, 91-100% Major problem).
*   **Positive:** Crew gains **Advanced Jerry Rigging** feat for repairs to this ship only.

### Infested
Smelly, annoying space pests living off the ship systems.
*   **Negative:** Daily CON save (DC 12) for all on board or become **Nauseated** (or **Sickened**). Engineers take -1 to repair checks.
*   **Positive:** -10 Stealth for stowaways. Advantage to Comms when dealing with pirates/smugglers (who avoid the infestation).

### Bad Past
The ship is "wanted" in multiple systems due to previous owners.
*   **Negative:** Disadvantage to Comms in specific situations. People may attack without provocation.
*   **Positive:** 50/50 chance a person recognizing the ship will be a friend or foe.

### Artificial Intelligence
Fully aware AI computer linked to all systems (Highly Illegal).
*   **Negative:** Illegal to sell through official markets. Harsh penalties from authorities.
*   **Positive:** +1 to Sensors, Engines, and Electronics. The ship can drive itself.
*   **Misc:** AI possesses a personality (Optimist, Bully, Shy, etc.).

### Noisy
Constant humming, whizzing, and jittering.
*   **Negative:** -2 for all **Boost** function rolls.
*   **Positive:** None.

### Battle Scars
A hull that "speaks a thousand words" of past adventures.
*   **Negative:** -1 to Detection DC and +1 to Repair DC for Battle Damage.
*   **Positive:** Advantage to Comms when using **Intimidate**.

### Lucky
The ship survives scraps it shouldn't.
*   **Negative:** None.
*   **Positive:** Once per day, a player can reroll a check that uses one of the ship's Attribute modifiers.

### Cursed
Things just seem to suck when you're on this ship.
*   **Negative:** Once per day, negate the first Critical Success rolled for a ship-based attribute check.
*   **Positive:** None.
