# Spaceship Crafting & Customization

## 1. Ship Creation & Point Allocation
Ships are built around a Core that provides a point budget for the 6 Core System Attributes (CSA).
*   '''Balancing:''' Attributes must be balanced to avoid overloading the Reactor/Core.
*   '''Unspent Points:''' Points not spent during initial construction are banked. They can be spent or re-aligned later at any facility that supports ship crafting or repair.

### Tech Level Point Budgets
| Tech Level | Points | Max Size | Cust. Points |
| :--- | :--- | :--- | :--- |
| 1 | 10 | Large | 1 |
| 2 | 15 | Gargantuan | 1 |
| 3 | 20 | Colossal | 2 |
| 4 | 25 | Colossal | 3 |

### CSA Score Point Costs
*   '''7:''' -4 pts | '''8:''' -2 pts | '''9:''' -1 pt | '''10:''' 0 pts
*   '''11:''' 1 pt | '''12:''' 2 pts | '''13:''' 3 pts | '''14:''' 5 pts
*   '''15:''' 7 pts | '''16:''' 10 pts | '''17:''' 13 pts | '''18:''' 17 pts
*   '''19:''' 21 pts | '''20:''' 25 pts

* When spending points to build a SpaceShip it is preferred to spend them in increments of 2 before spending them on 1. 
* IE: 1 Core System Attribute that is 12 is better than 2 Core System Attributes with a score of 11.

---

## 2. Crafting Rules & Timelines
Shipbuilding and repairs require '''Craft Electronics, Craft Mechanics, and Craft Structure''' skills.

### Construction Facilities & Labor
*   '''Ship Yard:''' Required for initial construction.
*   '''Labor Limits:''' Work can be divided among skilled laborers:
    *   '''Standard Yard:''' Up to 50 people.
    *   '''Heavy Yard:''' Up to 500 people.
    *   '''Super Heavy Yard:''' Up to 5,000 people.
*   '''Labor Costs:''' Flat daily group rate of $10,000/day for a standard shipyard crew of 50 ($200/day per individual worker), plus a completion bonus (1/1000th ship cost).

### Construction Times (Days)
| Ship Size | Time | Weapon Size | Time | Bay Type | Time |
| :--- | :--- | :--- | :--- | :--- | :--- |
| '''Colossal''' | 36,450 | '''Huge''' | 80 | '''Large Bay''' | 40 |
| '''Gargantuan''' | 12,150 | '''Large''' | 40 | '''Normal Bay''' | 20 |
| '''Huge''' | 4,050 | '''Medium''' | 20 | '''Assembly (L)''' | 4 |
| '''Large''' | 1,350 | '''Small''' | 10 | '''Assembly (N)''' | 2 |
| '''Medium''' | 450 | | | | |
| '''Small''' | 150 | | | | |
| '''Tiny''' | 50 | | | | |
| '''Diminutive''' | 20 | | | | |
| '''Fine''' | 10 | | | | |

---

## 3. Specialized Crafting
### Ship Functions
Requires at least Rank 3 in the associated attribute's skill.
*   '''Engines/Weapons:''' Craft Mechanics.
*   '''Structure:''' Craft Structure.
*   '''Shields/Electronics/Sensors:''' Craft Electronics.
*   '''Class Progression:''' Function Class 1 requires 4 ranks; Class 2 requires 5 ranks, etc.

### FTL Drives
Requires at least '''Rank 3''' in Craft Mechanics, Craft Electronics, and Craft Structure. FTL creation follows Craft Structure rules and '''cannot be Mastercrafted'''.

### Masterworking
*   '''Requirement:''' Rank 5 in the relevant crafting skill(s).
*   '''Benefit:''' +1 CSA point per relevant skill (Max +3 total).
*   '''Cost:''' Each extra point increases the ship's base price by '''1/4'''. Masterworking must be done during initial construction.

---

## 4. Maintenance & Repairs
*   '''Repairs:''' Takes 2 rounds for BD or 1 round for side effects. 
*   '''Field Repairs:''' Takes '''twice as long''' outside a shipyard. The ship cannot be in FTL.
*   '''Facilities:''' A Docking Bay can support repairs if the host ship/station has an Industrial or Engineering bay.

---

## 5. Pricing Tables (Hull, Weapons, Attributes & Accessories)

To reliably price and customize a spaceship, use the following cost tables compiled from '''Ship_Equipment.txt''' and '''Space_Ships.txt'''.

### A. Base Hull Costs (Military vs. Civilian)
Determined by the ship's Hull Size.
*   '''Colossal:''' Military $2.9 Billion | Civilian $972 Million
*   '''Gargantuan:''' Military $972 Million | Civilian $324 Million
*   '''Huge:''' Military $324 Million | Civilian $108 Million
*   '''Large:''' Military $108 Million | Civilian $36 Million
*   '''Medium:''' Military $36 Million | Civilian $12 Million
*   '''Small:''' Military $12 Million | Civilian $4 Million
*   '''Tiny:''' Military $1.9 Million | Civilian $640,000
*   '''Diminutive:''' Military $480,000 | Civilian $160,000
*   '''Fine:''' Military $240,000 | Civilian $80,000

### B. Weapon Hard Point Costs
*   '''Small Weapons''' (for Fine to Tiny hulls):
    *   Projectile: $80,000 | Laser: $156,250 | Plasma: $234,375 | Missile: $195,300
*   '''Medium Weapons''' (for Small to Medium hulls):
    *   Projectile: $320,000 | Laser: $625,000 | Plasma: $937,500 | Missile: $590,625
*   '''Large Weapons''' (for Large to Huge hulls):
    *   Projectile: $1,280,000 | Laser: $1,250,000 | Plasma: $1,875,000 | Missile: $3,125,000
*   '''Huge Weapons''' (for Gargantuan to Colossal hulls):
    *   Projectile: $2,560,000 | Laser: $5,000,000 | Plasma: $6,500,000 | Missile: $6,250,000
*   '''Ammo Cost (per Mag):''' 2% of the weapon's base cost. (Laser Crystals are single-use focusing crystals costing ~$52,000 to $3,333,350 based on size).

### C. CSA Base Upgrade Costs
To upgrade a CSA to a Classification from Class 1 to 5, multiply the base cost by the new Class (e.g., Small Engine Class 2 = $200,000 base * 3 = $600,000). Masterworked upgrades double the final price.
*   '''Fine:''' Engines $50k | Weapons $50k | Structure $45k | Shields $60k | Electronics $60k | Sensors $40k
*   '''Diminutive:''' Engines $100k | Weapons $100k | Structure $90k | Shields $120k | Electronics $120k | Sensors $80k
*   '''Tiny:''' Engines $150k | Weapons $150k | Structure $135k | Shields $180k | Electronics $180k | Sensors $120k
*   '''Small:''' Engines $200k | Weapons $200k | Structure $180k | Shields $240k | Electronics $240k | Sensors $160k
*   '''Medium:''' Engines $250k | Weapons $250k | Structure $225k | Shields $300k | Electronics $300k | Sensors $200k
*   '''Large:''' Engines $300k | Weapons $300k | Structure $270k | Shields $360k | Electronics $360k | Sensors $240k
*   '''Huge:''' Engines $350k | Weapons $350k | Structure $315k | Shields $420k | Electronics $420k | Sensors $280k
*   '''Gargantuan:''' Engines $400k | Weapons $400k | Structure $360k | Shields $480k | Electronics $480k | Sensors $320k
*   '''Colossal:''' Engines $450k | Weapons $450k | Structure $405k | Shields $540k | Electronics $540k | Sensors $360k

### D. Ship Bay Costs
*   '''Cargo Bay / Passenger Bay:''' $20,000 for Small (doubles per size increment higher).
*   '''Science Bay / Industrial Bay:''' $15,000 starting level 1 (cost triples per level higher).
*   '''Engineering Bay:''' $30,000 starting level (triples per level).
*   '''Astrometrics Bay:''' $25,000 starting level (triples per level).
*   '''Refinery Bay:''' $35,000 base (doubles per size and level).
*   '''Docking Bay:''' $10,000 for Small (doubles per size increment higher).
*   '''Medical Bay:''' $25,000 | '''Medical Facility:''' $500,000
*   '''Industrial Facility:''' $250,000 starting level (triples per level).
*   '''Engineering Facility:''' $500,000 starting level (triples per level).
*   '''Refinery Facility:''' $200,000 (Size Large) base (doubles per size and level).
*   '''Detention Bay:''' $15,000 for Small (doubles per size increment higher).
*   '''Hydroponics Bay:''' $20,000 for Small (doubles per size increment higher).
*   '''Armory:''' $25,000 for Small (doubles per size increment higher).
*   '''ELINT Center:''' $30,000 for Small (doubles per size increment higher).
*   '''Recreation Bay:''' $15,000 for Small (doubles per size increment higher).

### E. Ship Accessories & Upgrades
*   '''Transporter Bay (Beam):''' $100,000 starting cost (+$100,000 per size or class).
*   '''Cloaking Device (Cloak):''' $200,000 starting cost (+$200,000 per size and class).
*   '''Crypto Computer (Crypto):''' $50,000 starting cost (+$50,000 per size or class).
*   '''Jammer (Jam):''' $50,000 starting cost (+$50,000 per size or class).
*   '''Grappler (Grapple):''' $50,000 starting cost (+$50,000 per size or class).
*   '''Warp Field Expander:''' $450,000 base cost (+$450,000 per size above Large). Slot: 1 HP & 1 Bay.
*   '''Jump Assistance Drive:''' $30,000 base cost (+$30,000 per size above Medium). Slot: 1 HP & 1 Bay.
*   '''Shield Extender:''' $1,500,000 base cost (+$1,000,000 per size above Small). Slot: 1 Bay.
*   '''Shield Enhancer:''' $600,000 base cost (+$600,000 per size above Small). Slot: 1 HP.
*   '''Phase Discriminator:''' $500,000 base cost (+$500,000 per +1 sensor bonus, max +6). Slot: 1 HP.
*   '''Plasma Flow Enhancer:''' $200,000 base cost ($400,000 for Large, $600,000 for Gargantuan). Slot: 1 Bay.
*   '''Engine Boosters:''' $250,000 base cost (+$250,000 per size above Tiny). Slot: 1 HP or 1 Cust. Slot.
*   '''Drone Controller:''' $500,000 base cost (+$500,000 per upgrade or size above Medium). Slot: 1 HP & 1 Bay.
*   '''Reactor Auxiliary Capacitor:''' $150,000. Slot: 1 Cust. Slot.
*   '''Holographic Decoy Launcher:''' $120,000 (+$120,000 per size above Tiny). Slot: 1 HP.
*   '''Fire-Control Matrix:''' $300,000. Slot: 1 HP or 1 Cust. Slot.
*   '''Hull Nanite Repair Pods:''' $400,000. Slot: 1 Cust. Slot.
*   '''Advanced Recycler Grid:''' $80,000. Slot: 1 Cust. Slot.
