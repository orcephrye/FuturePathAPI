# Spaceship Crafting & Customization

---

## 1. Ship Creation & Point Allocation

Spaceships are engineered around a central Core reactor that provides a dedicated point budget for the 6 Core System Attributes (CSA): Engines, Weapons, Structure, Shields, Electronics, and Sensors.

* **Reactor Balancing:** Attributes must be balanced to prevent overloading the Core power grid.
* **Unspent Points:** Points not allocated during initial construction are banked. They can be spent or realigned later at any certified shipyard or engineering drydock.
* **Optimal Allocation Rule:** It is always mathematically advantageous to spend points in increments of **2 before 1** (e.g., one attribute at 12 is superior to two attributes at 11).

### Core Tech Level Point Budgets
| Tech Level | CSA Points | Max Hull Size | Base Cust. Points |
| :---: | :---: | :---: | :---: |
| **1** | 10 | Large | 1 |
| **2** | 15 | Gargantuan | 1 |
| **3** | 20 | Colossal | 2 |
| **4** | 25 | Colossal | 3 |

### CSA Score Point Costs
All attributes start at baseline **10** (costing 0 points).

| Score | Cost | Score | Cost | Score | Cost |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **7** | -4 pts | **12** | 2 pts | **17** | 13 pts |
| **8** | -2 pts | **13** | 3 pts | **18** | 17 pts |
| **9** | -1 pt  | **14** | 5 pts | **19** | 21 pts |
| **10**| 0 pts  | **15** | 7 pts | **20** | 25 pts |
| **11**| 1 pt   | **16** | 10 pts | | |

### Customization Points Formula
Customization Points (Slots) allow installing modular systems, CSA upgrades, and accessories without consuming dedicated weapon Hard Points or interior Bays.

$$\text{Total Customization Points} = \text{Tech Level Base} + \text{Hull Size Bonus} - \text{Configuration Penalty}$$

* **Hull Size Customization Bonus:**
  * Colossal: **+3**
  * Gargantuan, Huge, Large: **+2**
  * Medium, Small, Tiny: **+1**
  * Diminutive, Fine: **+0**
* **Hull Configuration Reductions:**
  * Battle Cruisers, Battle Ships, Capital Ships, and Carriers suffer **-1 Customization Point** (minimum 1).

### Converting Hard Points & Bays to Customization Points
A ship can gain additional Customization Points by permanently converting exterior mounts or internal compartments:
* **1 Hard Point $\rightarrow$ 1 Customization Point** (designated an *Upgrade Point*).
* **1 Bay $\rightarrow$ 2 Customization Points** (designated an *Upgrade Bay*).
* *Restriction:* Converted slots can never be reverted, cannot mount weapons/standard bays, and cannot be targeted separately in combat.

### Configuration CSA Penalties & Baseline Adjustments
> [!IMPORTANT]
> **Order of Operations:** All Disadvantages and Advantages that modify Attribute Points and Core System Attributes are applied **before** point buying happens. (e.g., if a configuration grants $+2$ to Shields, the ship starts with 10 in all attributes except Shields which starts at 12, and then the builder spends their Tech Level Point Buy budget). Customization Points are spent **after** Point Buy.

* **-5 Attribute Points:** Dreadnought
* **-3 Attribute Points:** Battle Cruiser, Battle Ship, Capital Ship, Carrier
* **-2 Attribute Points:** Military Cruiser, Civilian Cruiser, Destroyer
* **-1 Attribute Points:** Freighter, Industrial
* **+1 Attribute Point:** Frigate
* **-1 Across All Attributes:** Drones

---

## 2. Crafting Rules & Timelines

Spaceship fabrication and structural repairs require **Craft Electronics, Craft Mechanics, and Craft Structure**.

### Construction Facilities & Labor
* **Shipyard Requirement:** Initial hull construction must take place in an orbital or planetary shipyard.
* **Shipyard Scale Limits:**
  * **Standard Yard:** Up to 50 workers (constructs Fine to Medium hulls).
  * **Heavy Yard:** Up to 500 workers (required for Large and Huge hulls).
  * **Super Heavy Yard:** Up to 5,000 workers (required for Gargantuan and Colossal hulls).
* **Labor Rates:**
  * Flat group rate of **$10,000/day** for a standard shipyard crew of 50 skilled laborers (**$200/day per individual worker**).
  * Completion bonus: **1/1,000th (0.1%)** of the final ship cost.
* **Materials Cost:** Materials cost is based on the final base hull price of the ship (excluding modular weapons/accessories unless also fabricated from raw stock).

### Construction Times (Solo Worker Days)
Work can be divided among skilled laborers up to the facility's maximum crew limit:

| Hull Size | Hull Days | Facility Required | Weapon Size | Weapon Days | Bay Type | Craft Days | Assembly Days |
| :--- | :---: | :--- | :--- | :---: | :--- | :---: | :---: |
| **Colossal** | 36,450 | Super Heavy Yard | **Huge** | 80 | **Large Bay** | 40 | 4 |
| **Gargantuan** | 12,150 | Super Heavy Yard | **Large** | 40 | **Normal Bay** | 20 | 2 |
| **Huge** | 4,050 | Heavy Yard | **Medium** | 20 | **Assembly (L)**| — | 4 |
| **Large** | 1,350 | Heavy Yard | **Small** | 10 | **Assembly (N)**| — | 2 |
| **Medium** | 450 | Standard Yard | | | | | |
| **Small** | 150 | Standard Yard | | | | | |
| **Tiny** | 50 | Standard Yard | | | | | |
| **Diminutive**| 20 | Standard Yard | | | | | |
| **Fine** | 10 | Standard Yard | | | | | |

> [!NOTE]
> **Dividing Work & Assembly:** Crafting days for hulls, weapons, and bays can be divided across the contracted crew. However, **Bay Assembly time cannot be divided**. Building a bay directly into the hull during initial ship construction bypasses assembly time entirely.

* **Upgrades & Accessories Installation:** Installing an upgrade or accessory takes **1 full day** outside FTL (equivalent to repairing a major ship failure).

---

## 3. Specialized Crafting

### A. Ship Functions
Requires at least **Rank 3** in the associated attribute's crafting skill:
* **Engines & Weapons:** Craft Mechanics.
* **Structure:** Craft Structure.
* **Shields, Electronics, & Sensors:** Craft Electronics.
* **Classification Progression:** Function Class 1 requires **Rank 4**; Class 2 requires **Rank 5**; Class 3 requires **Rank 6**, etc.

### B. FTL Drives
Requires at least **Rank 3** in **Craft Mechanics, Craft Electronics, AND Craft Structure**.
* Follows Craft Structure facility rules.
* FTL drives **cannot be Mastercrafted**.
* Installing a secondary FTL consumes **1 Bay and 1 Hard Point** (cannot use Customization Points).

### C. Weapons & Ammunition Crafting
* **Weapon Crafting:** Requires **Rank 4** in the appropriate skill:
  * Projectile & Missile: Craft Mechanics.
  * Laser: Craft Electronics.
  * Plasma: Craft Electronics and Craft Chemical.
* **Masterworked Weapons (Class 1–5):** Requires **Rank 6** for Class 1, **Rank 7** for Class 2, etc. (Plasma masterworking costs $3\times$ standard).
* **Ammunition Crafting:** Requires **Rank 3** in the relevant skill (Rank 4+ for Masterworked ammo):
  * Projectile ammo: Craft Mechanics.
  * Laser crystals: Craft Chemical.
  * Plasma charges: Craft Chemical.
  * Missiles: Craft Mechanics and Craft Chemical.

### D. Ship Attribute Upgrades Crafting
* Upgrading a CSA system from Class 0 to 5 requires:
  * **Class 0:** Rank 2 in the relevant skill.
  * **Class 1:** Rank 3 in the relevant skill.
  * **Class 2:** Rank 4 in the relevant skill (adds +1 rank per class).

### E. Accessories Crafting
* Standard accessories require **Rank 3 in Craft Mechanics and Rank 3 in Craft Electronics**.
* Each Classification upgrade requires +1 rank in both skills.

### F. Masterworking Spaceships
* **Hull Masterworking:** A crafter with **Rank 5** in the 3 primary skills (*Craft Electronics, Craft Mechanics, Craft Structure*) grants **+1 CSA point per skill** (maximum **+3 points total**).
* **Cost Impact:** Each masterworked CSA point increases the base hull price by **+25% (+1/4)**. Must be done during initial construction; cannot be retrofitted.
* **Upgrade Masterworking:** Masterworking an attribute upgrade doubles its final credit cost and adds +1 score per class level.

---

## 4. Maintenance & Repairs

* **Battle Damage Repair:** Takes 2 consecutive rounds of successful checks by an Engineer. Side effects take 1 round.
* **Field Repairs:** Outside of a shipyard, repairs take **twice as long** ($2\times$) and the ship cannot be engaged in FTL travel.
* **Docking Bay Repairs:** A host ship/station with a Docking Bay can perform repairs if it also has an Industrial or Engineering bay/facility.

---

## 5. Pricing Tables (Hull, Weapons, FTL, Upgrades & Accessories)

### A. Base Hull Costs (Military vs. Civilian)
Determined by Hull Size.

| Size | Weapon / Bay Size | Civilian Cost | Civilian HP / Bays | Military Cost | Military HP / Bays | Cust. Bonus |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Colossal** | Huge | $972,000,000 | 8 HP / 10 Bays | $2,900,000,000 | 10 HP / 8 Bays | +3 |
| **Gargantuan**| Huge | $324,000,000 | 7 HP / 9 Bays | $972,000,000 | 9 HP / 7 Bays | +2 |
| **Huge** | Large | $108,000,000 | 6 HP / 8 Bays | $324,000,000 | 8 HP / 5 Bays | +2 |
| **Large** | Large | $36,000,000 | 5 HP / 7 Bays | $108,000,000 | 7 HP / 4 Bays | +2 |
| **Medium** | Medium | $12,000,000 | 4 HP / 6 Bays | $36,000,000 | 6 HP / 3 Bays | +1 |
| **Small** | Medium | $4,000,000 | 4 HP / 5 Bays | $12,000,000 | 6 HP / 2 Bays | +1 |
| **Tiny** | Small | $640,000 | 3 HP / 4 Bays | $1,900,000 | 5 HP / 1 Bay | +1 |
| **Diminutive**| Small | $160,000 | 2 HP / 2 Bays | $480,000 | 3 HP / 0 Bays | +0 |
| **Fine** | Small | $80,000 | 1 HP / 1 Bay | $240,000 | 2 HP / 0 Bays | +0 |

---

### B. Weapon Hard Point Costs & Ammunition
Weapons mount into Hard Points matching the ship's Weapon Size rating.

| Weapon Type | Small Mount (Fine–Tiny) | Medium Mount (Small–Med) | Large Mount (Large–Huge) | Huge Mount (Garg–Col) | Std. Mag Ammo Capacity |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Projectile** | $80,000 | $320,000 | $1,280,000 | $2,560,000 | 6 rounds |
| **Laser** | $156,250 | $625,000 | $1,250,000 | $5,000,000 | $\infty$ (Eng/Elec $\ge 7$) |
| **Plasma** | $234,375 | $937,500 | $1,875,000 | $6,500,000 | 4 rounds |
| **Missile** | $195,300 | $590,625 | $3,125,000 | $6,250,000 | 3 missiles |

#### Ammunition Costs (Per Magazine)
1 magazine volume = 1 Cargo Unit (Small mounts), 2 Units (Medium–Huge mounts), 3 Units (Super Colossal).

| Weapon Type | Small Mount | Medium Mount | Large Mount | Huge Mount |
| :--- | :---: | :---: | :---: | :---: |
| **Projectile** | $1,600 | $6,400 | $25,600 | $102,400 |
| **Laser Crystals (1)** | $52,000 | $208,350 | $833,350 | $3,333,350 |
| **Plasma** | $4,700 | $18,750 | $75,000 | $300,000 |
| **Missile** | $3,900 | $15,625 | $62,500 | $250,000 |

---

### C. FTL Drive Pricing & Specifications

| Tech | Drive Name | Range Rating | Warp Factor | Price / Diff | Durability | Notes |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **1** | Assisted Jump Drive | Medium | 10+ | $50,000 / 0 | 0 | Requires Jump Gate station. |
| **1** | Warp Drive (The Hopper) | Medium | 1–4 | $150,000 / 0 | +2 | Pulsed warp field. |
| **2** | Assisted Adv. Jump Drive | Large | 10+ | $100,000 / 0 | 0 | Extended Jump Gate travel. |
| **2** | Warp Drive (The Skimmer) | Large | 1–7 | $300,000 / 0 | +1 | Skims shrunken space. |
| **2** | Slip Stream Drive | Large | 1–7 | $450,000 / 1 | +3 | Subspace tears (30s prep, +4 enemy tracking). |
| **3** | Personal Jump Drive | Medium (Large assist) | 10+ | $1,000,000 / 0 | 0 | Independent Warp 10; 1 jump per recharge. |
| **3** | Warp Drive (High Pulse) | Large | 1–8 | $3,500,000 / 1 | +2 | Lossless conduits, rapid transitions. |
| **3** | Phase Shift Drive | Large | 1–7 | $5,000,000 / 2 | +6 | Massless acceleration; 6s (2 turns) tear creation. |
| **4** | Adv. Personal Jump Drive | Large (Extreme assist)| 10+ | $10,000,000 / 1 | 0 | Elite independent Warp 10 jumps. |
| **4** | Expert Warp Drive | Extreme | 1–9 | $15,000,000 / 2 | +3 | Cruising speeds up to Warp 9. |
| **4** | Adv. Slip Stream Drive | Extreme | 1–8 | $25,000,000 / 3 | +8 | Internal 1-turn tears; exits out of phase. |

---

### D. CSA Base Upgrade Costs (Class 0 to 5)
Upgrading an attribute to Class $X$ costs:

$$\text{Upgrade Cost} = \text{Base Cost} \times (X + 1)$$

*(e.g., Class 0 = $1\times$ Base; Class 1 = $2\times$ Base; Class 2 = $3\times$ Base; Class 3 = $4\times$ Base). Masterworked upgrades double ($2\times$) the final price.* Requires **1 Customization Point** per upgrade.

| Hull Size | Engines | Weapons | Structure | Shields | Electronics | Sensors |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Fine** | $50,000 | $50,000 | $45,000 | $60,000 | $60,000 | $40,000 |
| **Diminutive**| $100,000 | $100,000 | $90,000 | $120,000 | $120,000 | $80,000 |
| **Tiny** | $150,000 | $150,000 | $135,000 | $180,000 | $180,000 | $120,000 |
| **Small** | $200,000 | $200,000 | $180,000 | $240,000 | $240,000 | $160,000 |
| **Medium** | $250,000 | $250,000 | $225,000 | $300,000 | $300,000 | $200,000 |
| **Large** | $300,000 | $300,000 | $270,000 | $360,000 | $360,000 | $240,000 |
| **Huge** | $350,000 | $350,000 | $315,000 | $420,000 | $420,000 | $280,000 |
| **Gargantuan**| $400,000 | $400,000 | $360,000 | $480,000 | $480,000 | $320,000 |
| **Colossal** | $450,000 | $450,000 | $405,000 | $540,000 | $540,000 | $360,000 |

---

### E. Ship Bay & Facility Costs
* **Bay Size Rule:** Requires Tiny+ hulls (takes 2 slots on Diminutive/Fine).
* **Facility Rule:** Requires Large+ hulls (takes 2 Bays; occupies only 1 Bay on Gargantuan/Colossal hulls).

| Bay / Facility Name | Min. Size | Base Price | Scaling Rule | Key Benefit |
| :--- | :---: | :---: | :--- | :--- |
| **Cargo Bay** | None | $20,000 | Doubles per size above Small | Adds $+50\%$ base cargo capacity. |
| **Passenger Bay** | Tiny+ | $20,000 | Doubles per size above Small | Adds base passenger count. Luxury costs $2\times$ ($0.5\times$ cap); Cramped carries $2\times$. |
| **Science Bay** | Small+ | $15,000 | Triples per class level | Acts as Chemical/Electronic Kit ($+X$ craft bonus). |
| **Medical Bay** | Tiny+ | $25,000 | Flat base | Medical/Surgical Kit ($+2$ treatment). Class 3 resuscitates. |
| **Medical Facility** | Large+ | $500,000 | Flat base | Multi-patient ($+4$ Medical, doubles as Pharmacy Kit). |
| **Industrial Bay** | Tiny+ | $15,000 | Triples per class level | $+0.5/\text{lvl}$ Chemical, $+1/\text{lvl}$ Mechanical crafting. |
| **Industrial Facility**| Large+ | $250,000 | Triples per class level | Multi-worker; $+0.5/\text{lvl}$ bonus to repair Battle Damage. |
| **Engineering Bay** | Tiny+ | $30,000 | Triples per class level | $+1/\text{lvl}$ Electronics & Mechanics. In-combat mods. |
| **Engineering Facility**| Large+ | $500,000 | Triples per class level | $+1/\text{lvl}$ to all repairs made on this vessel. |
| **Astrometrics Bay** | Tiny+ | $25,000 | Triples per class level | Doubles sensor range; $+1/\text{lvl}$ scan, $+0.5/\text{lvl}$ vs. stealth. |
| **Refinery Bay** | Tiny+ | $35,000 | Doubles per size & class | Refines 100 units/day per class; reduces raw weight 50%. |
| **Refinery Facility** | Large+ | $200,000 | Doubles per size & class | Refines $500 + 150/\text{class}$ units/day. |
| **Docking Bay** | Small+ | $10,000 | Doubles per size above Small | Docks 1 ship 2 sizes smaller. |
| **Detention Bay** | Tiny+ | $15,000 | Doubles per size above Small | Containment brig ($+5$ escape DC); doubles as $0.5\times$ passenger bay. |
| **Hydroponics Bay** | Small+ | $20,000 | Doubles per size above Small | Extends life support 50%; $+2$ organic chemical crafting. |
| **Armory** | Tiny+ | $25,000 | Doubles per size above Small | Equip gear as Move Action; $+2$ personal gear maintenance. |
| **ELINT Center** | Medium+| $30,000 | Doubles per size above Small | $+2$ to Hacking, Jamming, Counter-Hacking; supports Crypto. |
| **Recreation Bay** | Small+ | $15,000 | Doubles per size above Small | Halves fatigue recovery; $+1$ Will & Initiative for 24h. |

---

### F. Ship Function Modules & Accessories

| Item Name | Slot Required | Min. Size / Req. | Base Cost | Description |
| :--- | :---: | :---: | :---: | :--- |
| **Transporter Bay (Beam)** | 1 Bay *(no Cust)* | Small+ | $100,000 | Enables Beam function (+$100k per size/class). |
| **Cloaking Device (Cloak)** | 1 HP & 1 Bay *(1 can be Cust)*| Tiny+ | $200,000 | +3 Detection DC (+2/class; +$200k per size/class). Shields offline while active. |
| **Crypto Computer (Crypto)** | 1 Bay or 1 Cust | Tiny+ | $50,000 | Enables Crypto (+1 bonus/class; +$50k per size/class). |
| **Jammer (Jam)** | 1 HP *(no Cust)* | Tiny+ | $50,000 | Enables Jam function (+1 bonus/class; +$50k per size/class). |
| **Grappler (Grapple)** | 1 HP *(no Cust)* | Tiny+ | $50,000 | Enables Grapple function (+$50k per size/class). |
| **Warp Field Expander** | 1 HP & 1 Bay | Large+, Warp FTL | $450,000 | Extends warp field around companion ship (+$450k/size above Large). |
| **Jump Assistance Drive** | 1 HP & 1 Bay | Medium+, Jump FTL | $30,000 | Acts as localized Jump Gate for other ships (+$30k/size above Medium). |
| **Shield Extender** | 1 Bay | Small+ | $1,500,000 | Projects shields to protect adjacent allies (+$1M/size above Small). |
| **Shield Enhancer** | 1 HP | Small+ | $600,000 | +1 Reflector value and +1 Shield-based DR (+$600k/size above Small). |
| **Phase Discriminator** | 1 HP | Tech Level 2+ | $500,000 | Bonus to Scan vs. out-of-phase ships (+$500k per +1 sensor bonus, max +6). |
| **Plasma Flow Enhancer** | 1 Bay | None | $200,000 | +1 Warp speed ($400k Large, $600k Gargantuan). |
| **Engine Boosters** | 1 HP or 1 Cust | Pilot Rank 1+ | $250,000 | +2 on active Pilot checks (+$250k/size above Tiny). |
| **Drone Controller** | 1 HP & 1 Bay | Medium+ | $500,000 | Controls 2 drones, holds 4 (+$500k per class or size above Medium). |
| **Reactor Auxiliary Capacitor**| 1 Cust | Engineering Bay | $150,000 | +2 to Overclock Core checks; absorbs failed overclock backlash. |
| **Holographic Decoy Launcher**| 1 HP | Tiny+ | $120,000 | Grants +2 Electronics; 75% guided missile miss chance (+$120k/size above Tiny). |
| **Fire-Control Matrix** | 1 HP or 1 Cust | None | $300,000 | +1 to attack d10s; eliminates Defensive Fire -2 penalty. |
| **Hull Nanite Repair Pods** | 1 Cust | None | $400,000 | Repair checks performed as Move Action or grant +2 bonus. |
| **Advanced Recycler Grid** | 1 Cust | None | $80,000 | Increases passenger capacity by 25%; +2 saves vs. toxins/infestations. |
