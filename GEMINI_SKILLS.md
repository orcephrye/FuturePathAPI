# Skills, Feat-Based Skills, and Skill-Like Abilities Summary

This document provides a comprehensive overview of all Standard Skills, Feat-Based Skills, and Skill-Like Abilities in d20 FuturePath, summarizing their key abilities, types, mechanics, DCs, actions, and special interactions.

---

## 1. Standard Skills

### Acrobatics
* **Ability:** Dexterity | **Type:** Unnatural
* **Traversing & Balance:** Allows movement across narrow or treacherous surfaces at half speed (DC 1–20 based on surface width: >3ft DC 1, 1–3ft DC 5, 7–11in DC 10, 2–6in DC 15, <2in DC 20). Flat-footed while balancing. Taking damage requires immediate check to avoid falling. Balancing pole grants +1 circumstance bonus.
* **Obstructed & Difficult Terrain Modifiers:** Adds +2 to +10 to base DC 10 depending on surface (gravel/sand +2, car/rubble +5, slippery wet +2, icy +5, sloped <45° +2, >45° +5, boat in rough water +2, storm +5, earthquake +10). Moving full speed on narrow/uneven surface is +10 DC.
* **Occupied Spaces:** Friendly space +0, Neutral +10, Surprised Enemy +15, Aware Enemy requires Overrun technique.
* **Jumping:** Long Jump DC = distance in feet (5ft DC 5, 10ft DC 10, 15ft DC 15, 20ft DC 20, +5 per 5ft beyond). High Jump DC = 4 × height in feet. DCs double without a 10ft running start. Speed modifiers: +4/-4 racial bonus per 10ft over/under 30ft land speed. Pole adds +2. Failing jump by ≤4 allows DC 20 Reflex save to catch ledge.
* **Falling:** DC 15 check ignores first 10 feet of fall distance.
* **Combat Uses:**
  * **Total Defense:** Adds `Acrobatics Rank / 2` (rounded up) to AC bonus.
  * **Feint:** Applies skill rank die to Bluff check when feinting.
  * **Initiative:** Adds Acrobatics skill die to opposing Initiative checks requiring full-body movement.

---

### Athletics
* **Ability:** Strength | **Type:** Rank Dependent
* **Rank Dependent Benefits:**
  * **Movement Speed:** +5ft base movement speed for every 4 ranks.
  * **Carrying Capacity:** +5 lbs unencumbered carrying capacity per rank.
* **Swim & Climb Checks:** Base DC 5 for normal conditions (checks only needed in unusual/volatile conditions or to move faster). Base swim/climb speed is 1/2 normal movement speed. Exceeding DC by 5 increases movement speed by +5ft.
* **Actions:**
  * **Catch Yourself Falling:** Climb DC + 10.
  * **Catch a Falling Character:** Requires initiative check (Climb DC + 5 × (10ft fallen distance)). If hit, immediately roll Climb check for yourself or both fall. Cannot exceed heavy load limit.
* **Special Rules:** Tiny or smaller creatures use Dex modifier instead of Str modifier for Climb and Swim checks. Athletic feat gives +2 misc bonus (+3 at lvl 10, +4 at lvl 20). Athletic Prowess feat adds `Athletics Rank / 2` (round up) as misc bonus to Intimidate.

---

### Bluff
* **Ability:** Charisma or Intelligence (Player's choice; cannot combine both) | **Type:** Natural
* **Deceive Someone:** Opposed by target's Sense Motive check. Takes 1+ rounds.
  * **DC Modifiers:** Target wants to believe (+5), Lie is believable (+0), Unlikely (-5), Far-fetched (-10), Impossible (-20), Target impaired/drunk (+5), Convincing proof (up to +10).
  * **Try Again:** Failed deception incurs a -10 penalty on subsequent attempts against the same target.
* **Feint in Combat:** Denies opponent Dex bonus to AC against next attack. DC = `10 + opponent's BAB + opponent's Wis Mod` (or `10 + opponent's Sense Motive bonus` if higher).
* **Secret Messages:** DC 15 for simple messages, DC 20 for complex. Takes 2× normal message duration. Opponents can intercept via opposed Sense Motive check. Failing by 5+ sends wrong message.

---

### Computer Use
* **Ability:** Intelligence | **Type:** Unnatural
* **Computer Hacking:**
  1. **Defeat Security:** Must be performed first. Basic DC 15 (1 rnd), Minimum DC 20 (2 rnds), Average DC 25 (3 rnds), Exceptional DC 35 (4 rnds), Maximum DC 40 (5 rnds). Fail by 10+ alerts admin.
  2. **Maintaining Access:** Hacker must roll `DC = 1/2 initial DC` each turn to stay in system. Beating DC by 10+ auto-succeeds all subsequent stay-in checks.
  3. **Hacking Actions:**
     * *Find File/Info:* DC = Size Mod (+1 Personal to +16 Corporate) + Security Level + Misc. Time: 2+ rnds.
     * *Disable/Enable System:* DC = 5 + Sec Level + Misc (1 rnd, can trip alarm).
     * *Overload Junction:* DC = 10 + Sec Level + Misc (1 rnd, causes AoE damage like grenades).
     * *Infect with Virus:* DC = 0 + Sec Level + Misc (1 rnd, failure trips alarm & prevents retry).
     * *Crash Computer:* DC = 5 + Sec Level + Misc (1 rnd, system reboots in 1d4 rnds).
     * *Manipulate Data:* DC = 10 + Sec Level + Misc (2 rnds, Nat 1 trips alarm).
* **Counter Hacking:** System admin attempts opposed Computer Use vs hacker.
  * *Deny Access:* Kicks hacker; hacker banned for 24h and takes disadvantage for a week.
  * *Identify:* Reveals location, PC model, or time in system (grants advantages on counter-hack).
* **Crafting Viruses:** Requires Rank 2 (Threat Level 1: Backdoor, File Mine, Spam-o-tron), Rank 3 (TL 2: Backdoor Worm, File Worm, Trojan, Try.Delete), or Rank 4 (TL 3: Backdoor Boot Sector, OverLoader 9000, Defective, Mind Funk). Takes 1 week of work. Customization points (+5 DC per point) gained for ranks above requirement.
* **Encrypt/Decrypt Message:** DC 12 (Simple, 2 rnds), DC 15 (Standard, 3 rnds), DC 20 (Advanced, 5 rnds), DC 30 (Top Secret, 7 rnds), DC 40 (Exotic, 10 rnds).
* **Ship Functions:** Used for Crypto, Hack, Jam, and Scan.

---

### Craft
* **Ability:** Intelligence (sub-skills) | **Type:** Rank Dependent
* **Structure & Ranks:** Divided into 5 sub-skills: Chemical, Electronic, Mechanical, Pharmaceutical, Structural.
  * **Rank 1:** Repair items.
  * **Rank 2:** Create items.
  * **Rank 3 + Item Crafting Branch Feat:** Masterwork items (+1 rank per additional masterwork level).
* **Bill of Materials (BOM):**
  * *Normal Materials:* 1/3 of item purchase price. Repairing costs 1/10 BOM per Battle Scar.
  * *Advanced Materials:* Required for complex/masterwork items. Costs 1/2 item purchase price (3× price of normal materials).
* **Craft Checks:**
  * Base DCs: General Equipment DC 12, Weapons & Armor DC 14, Space Ship Hull/Parts DC 12, Space Ship Accessories DC 14.
  * Modifiers: Masterworking adds +4 DC per level. Up-teching adds +4 DC per TL above base.
  * Beating DC by 4 saves 10% on BOM cost (max 50% savings). Exceeding DC by 5 can alternatively reduce crafting time by 1 day per 5. Cannot take 20.
  * Failures: Normal failure wastes 50% materials and time. Critical failure (Nat 1) wastes 100%.
* **Time:** Measured in 1-day increments (8–10h labor, inflicts Fatigued condition). Default is 2 days for personal items, 5 days for Large/Gigantic/Heavy items. General equipment time scales by size (Medium 24h, larger +24h/size, smaller -2h/size down to 20m min).
* **Sub-Skill Details:**
  * **Craft (Chemical):** Acids & Bases (Mild 1d6 DC 10 $50, Potent 2d6 DC 15 $250, Concentrated 3d6 DC 20 $1000). Explosives (DC 15, fail by 10+ detonates for 1/2 damage). Poisons (DC 15 + Procure Diff to identify). Requires Chemist/Demolitions Kit.
  * **Craft (Electronic):** Computers, surveillance, sensors, detonators, ship electronics. Requires Electrical Tool Kit.
  * **Craft (Mechanical):** Engines, weapons, gadgets, ship mechanical parts. Requires Mechanical Tool Kit.
  * **Craft (Pharmaceutical):** Antidotes (DC 15–30 based on disease Fort save DC), HP pharmaceuticals, preventative drugs (+$25 & +1 DC per 6h extended duration). Requires Pharmacist Kit.
  * **Craft (Structural):** Bags, clothing, armor, power armor, buildings, space ships. Scratch-built structures: Simple DC 15 ($100, 12h), Moderate DC 20 ($1k, 24h), Complex DC 25 ($10k, 60h), Advanced DC 30 ($100k, 600h).

---

### Diplomacy
* **Ability:** Charisma or Wisdom (Player's choice) | **Type:** Natural
* **Influence Attitude:** 30s interaction (or 1 standard action in combat at higher DC). Base DCs: Hostile 25+Cha, Unfriendly 20+Cha, Indifferent 15+Cha, Friendly 10+Cha, Helpful 0+Cha.
  * Exceeding DC by 5 shifts attitude +1 additional step (max 2 steps shift). Failing by 5+ decreases attitude by 1 step. Max 1 attempt per NPC per 24 hours. Ineffective on creatures with Int ≤ 6 or animals.
* **Make Request:** Requires Indifferent+ attitude. Modifiers: Simple advice -5, Detailed advice/aid +0, Unimportant secret/complex aid +5, Dangerous aid/secret knowledge +10, Aid risking punishment +15. Additional requests +5 each.
* **Gather Information & Bargaining:** Used to extract info without violence or negotiate prices where local markets allow.

---

### Disable Device
* **Ability:** Intelligence | **Type:** Unnatural (Requires proper toolkit for DC > 15)
* **Open Lock:** Pick mechanical locks (Lock Pick Kit) or bypass electronic locks (Electrical Tool Kit). Cheap DC 15, Average DC 25, High Quality DC 30, High Security DC 40, Ultra-High Security DC 50.
* **Disable Security Device:** Cheap DC 20, Average DC 25, High Quality DC 30, High Security DC 35, Ultra-High DC 40. Preventing tampering from being noticed adds +10 DC and takes 10 minutes.
* **Disable Robot / External Cybernetic:** Full-round action, DC 30, target must be pinned first. (Internal cybernetics require Surgery + Cybernetic Surgery feat).
* **Traps & Sabotage:** Simple mechanical device DC 10. Failing by ≤4 allows retry; failing by 5+ springs trap or creates faulty sabotage (fails after 1d4 rounds/mins). Can take 10 or 20 (except when preventing monitoring).

---

### Disguise
* **Ability:** Charisma | **Type:** Natural
* **Check & Perception:** Disguise check is opposed by observers' Perception checks. Creation takes 1d3 × 10 minutes.
* **Modifiers:** Minor details only +5, Different gender -2, Different race -2, Different age category -22, Different size category -10.
* **Impersonating Specific Individual:** Observers familiar with individual gain Perception bonus and automatically make suspicious opposed checks (once per meeting, or hourly/daily).

---

### Intimidate
* **Ability:** Charisma or Strength (Player's choice) | **Type:** Natural
* **Demoralize:** Standard action, 30ft range. DC = `10 + target HD + target Wis Mod`.
  * *Success:* Target is Shaken for 1 round (+1 round per 5 over DC).
* **Influence Attitude:** 30s conversation (or standard action in combat). DC = `10 + target HD + target Wis Mod`.
  * *Success:* Target provides info or limited safe assistance. After effect expires, target becomes Unfriendly and may report to authorities.
  * *Failure:* Fail by 5+ causes target to deceive or hinder. Each retry within 1 hour increases DC by +5.

---

### Knowledge
* **Ability:** Intelligence (by sub-category) | **Type:** Unnatural
* **Categories:**
  * **Culture:** Art, civics, society, street smarts, legal rights, government, business procedures.
  * **Current Events:** News, politics, sports, galactic events.
  * **History:** Ancient events, personalities, archaeology, antiquities, ancient tech.
  * **Science:** Astronomy, chemistry, mathematics, physics, engineering, modern tech.
  * **Philosophy:** Ethics, religion, psychology, sociology, criminology, occult.
* **Check Functions:** Identify objects (DC 10 common, 15 rare), Answer Questions/Recall (DC 10 easy, 15 basic), Appraising value, Predict Outcomes.
* **Assisting Study:** Knowledge can assist Study checks (takes 2× or 4× longer). Untrained check is a flat Intelligence check. Cannot take 20. Retries not permitted.

---

### Perception
* **Ability:** Wisdom | **Type:** Natural
* **Uses:** Notice hidden creatures (opposed vs Stealth), notice fine environmental details (DC -10 battle/garbage, DC 0 smell smoke/conversation, DC 15 whispered/concealed door, DC 20 secret door/key in lock, DC 25 bow drawn/burrowing creature), notice pickpocket (opposed vs Sleight of Hand), locate hidden traps.
* **Modifiers:** Distance +1 DC per 10ft, through closed door +5 DC, through wall +10 DC/ft thickness, distracted +5 DC, asleep +10 DC, invisible +20 DC.
* **Passive Perception:** Standard passive awareness when not actively searching.
  * `Passive Perception = 8 + (Perception Ranks / 2, round up) + Wis Mod + Misc Mods`
  * Max value without in-game advantages is 20. Grants 1/2 maximum Advantage Die value in applicable situations.

---

### Pilot
* **Ability:** Dexterity | **Type:** Unnatural
* **3D Flight & 2D Steering:** Controls vehicles and starships. Routine tasks do not require checks. Checks needed in combat, extreme weather, or during stunts/maneuvers. Vehicle maneuver modifier applies to checks.
* **Ship & Ground Vehicle Combat:** All active pilots roll simultaneously at the start of each round and declare action (Feint, Defensive, Offensive, Flee). Action succeeds against ships rolling lower.
* **Check Details:** Full-round action. Cannot take 10 or 20. Course charting uses Survival.

---

### Language
* **Ability:** None | **Type:** Rank Dependent
* **Main Language Skill & Learned Ranks:** Main Language skill rank determines maximum number of languages known. Max rank is 10 (not bound by Character Level limit). Always Favored and Trained.
* **Language Competency Ranks (per language):**
  * *Rank 1 (Inexperienced):* Identify language, understand simple words ("Danger!").
  * *Rank 2 (Novice):* Write/speak simple sentences.
  * *Rank 3 (Competent):* Basic conversation, noticeable accent.
  * *Rank 4 (Proficient):* Fluent, accent noticeable only to native speakers.
  * *Rank 5 (Expert):* Automatic success, treated as native 1st language.
* **Check Functions:** Identify unknown language (DC 15 major, DC 25 minor). Known languages require rolls only when corrupted/garbled. Retries not allowed for spoken communication.
* **Key Languages:** Low Common (~1000 words), High Common (nuanced/diplomatic), Species Languages, Jove Primal (ancient coalition language), Twin Languages (Carthaginian & Latin).

---

### Sense Motive
* **Ability:** Wisdom | **Type:** Natural
* **Uses:** Detect Bluff checks (opposed vs Bluff), assess trustworthiness.
* **Hunch:** DC 20 (gut assessment of social situation or impostor).
* **Discern Secret Message:** Opposed vs sender's Bluff check (-2 per missing info). Beating DC by 5+ intercepts message. Failing by 5+ infers false info. Retries allowed per Bluff attempt against character.

---

### Sleight of Hand
* **Ability:** Dexterity | **Type:** Unnatural
* **Tasks:** Palm coin-sized object (DC 10), steal item from person (DC 20, opposed vs target Perception; unusable in active combat if target is aware).
* **Hiding Object on Body:** Opposed by observer Perception (frisking searcher gains +4 bonus).
* **Drawing Hidden Weapon:** Move action DC 15 (otherwise a full-round action; Nat 1 drops weapon).
* **Action & Limits:** Move action. Untrained checks capped at DC 10 max (except hiding objects). Retry against same observer increases DC by +10.

---

### Stealth
* **Ability:** Dexterity | **Type:** Natural
* **Movement & Detection:** Opposed by observer Perception checks. Move half speed at no penalty; half to full speed incurs -5 penalty. Attacking, running, or charging ends stealth.
* **Size Modifiers:** Fine +16, Diminutive +12, Tiny +8, Small +4, Medium +0, Large -4, Huge -8, Gargantuan -12, Colossal -16.
* **Sniping:** At 100ft+ distance, make 1 ranged attack and immediately re-stealth at a `-(10 + Advantage Die)` penalty.
* **Special:** Creating a diversion via Bluff (Feint) allows Stealth attempt at -10 penalty. Invisibility grants +30 bonus (immobile) or +15 bonus (moving).

---

### Study
* **Ability:** Intelligence | **Type:** Natural
* **Observe Behavior:** Watch target from distance for clues (DC 15, stakeouts/stalking).
* **Analyze Clue:** Apply forensics to extracted clues (DC 15 + modifiers: +2/day elapsed, +5 outdoors, +2 to +6 disturbed scene). Retries not permitted.
* **Collect Evidence:** DC 15 check with Evidence Kit to prepare evidence for crime lab analysis (fail by 5+ ruins evidence; succeed by 10+ grants lab +2 bonus).
* **Researching Topic/Item/Event:** Takes 1d6 hours using computers, libraries, or labs. DC varies by topic obscurity (+5 to +15 for specific facts). Can take 10 or 20.

---

### Survival
* **Ability:** Wisdom | **Type:** Natural
* **Wilderness & Space Survival:** DC 10 (provides food/water for self + 1 person per 2 points over 10), DC 15 (grants advantage on severe weather Con saves). Retry every 12h. Automatically determine true north.
* **Navigation:** Plot courses across land/space. DC 15 (Short trip), DC 18 (Moderate), DC 22 (Long), DC 24 (Extreme), DC 26 (Intergalactic). Starship requires Class II sensors+. Beating DC by 5 avoids standard hazards.
* **Avoid Hazards:** Avoid unwanted company (DC 20 short / DC 30 long), plasma storm (DC 15), gravity burst (DC 25), supernova (DC 15), roaming black hole (DC 25).
* **Follow Tracks:** Base DC by ground (Very soft DC 5, Soft DC 10, Firm DC 15, Hard DC 20) + creature size (+8 Fine to -8 Colossal) + time (+1/24h) + weather (+1/hr rain, +10 fresh snow). Perception finds tracks; Survival interprets and tracks.

---

### Medical
* **Ability:** Wisdom | **Type:** Rank Dependent
* **Restrictions:** Cannot be used on oneself (self-administering items gives 1/2 HP recovery without check). Nonliving/inorganic creatures (constructs/robots) are immune.
* **Restore HP with Kit (DC 15):** Standard action. Target rolls HD based on healer's Competency Level (Unexperienced 1 HD up to Master 6 HD) + Wis Mod + Misc. Exceeding DC by 5 adds +1 HD (max +3 HD bonus). Masterworked kits add +1/level to check and HP, plus +1 HP per die.
* **Restore HP with Medical Item (DC 10):** Standard action. Success grants full item HP recovery + 1 HP/die per 5 points over DC 10 (max +3 HP/die).
* **Revive Condition (DC 15):** Full-round action with First Aid Kit. Removes Shaken, Dazed, Stunned, or wakes stable unconscious character.
* **Stabilize Dying (DC 20):** Target stabilizes at 1 HP and wakes up. Critical failure (Nat 1) inflicts 1d4 Con damage to patient.
* **Surgery (DC 20):** Requires Surgery Kit + 2 Ranks. Takes 1d4 hours (+1h per Con damage point). Field surgery incurs disadvantage unless healer has Surgery feat. Removes conditions, poisons, diseases, or installs cybernetics. Patient is fatigued for 12–48h.
* **Treat Disease / Poison (DC 15):** 10-minute check (disease) or standard action (poison). Adds healer's skill ranks as bonus to target's saving throw.
* **Long/Short Term Care (DC 15):** Patient heals `1/2 (round up) Level + Con Mod` HD per 24h. Beating DC 20 restores 1d4 in up to 3 ability scores (Nat 20 restores +4 in 3 scores).

---

## 2. Feat-Based Skills

Feat-Based Skills are special skills unlocked exclusively via Feats. They do **not** follow standard Skill Rank level limits; their ranks are automatically derived by combining ranks from specified parent skills.

### Demolitions
* **Associated Ability:** Wisdom or Intelligence (Chosen upon acquiring skill) | **Type:** Unnatural
* **Rank Calculation:** `Demolitions Rank = Craft (Chemical) Ranks + Knowledge (Science) Ranks` (OR `Disable Device Ranks + Craft Chemical / Science Ranks`). Does not follow level limits. Skill points cannot be spent directly on Demolitions.
* **Set Detonator:** Connecting detonator requires DC 5 check (Nat 1 detonates explosive). Disarm DC defaults to 10 or any value up to setter's check result.
* **Place Explosive Device:** Placed against fixed structures. DC 15 deals double damage to structure; DC 25 deals triple damage.
* **Disarm Explosive Device:** DC set by placer. Failing by >5 detonates explosive.
* **Equipment:** Requires Demolition Kit (-4 penalty without).

---

### Escape Artist
* **Associated Ability:** Strength or Dexterity (Chosen upon acquiring skill) | **Type:** Unnatural
* **Rank Calculation:** `Escape Artist Rank = Acrobatics Ranks + Athletics Ranks`. Does not follow level limits. Skill points cannot be spent directly.
* **Restraint DCs:**
  * Ropes / Bindings: DC = `Binder's Str Mod + Wis Mod + 10` (1 min).
  * Net / Entangle: DC 20 (1 full-round action).
  * Normal Manacles: DC 30 (1 min).
  * Masterwork Manacles: DC `30 + Masterwork Level` (1 min).
  * Tight Space: DC 30 (1+ min).
  * Grapple or Pin: Replaces Strength check vs Grappler's CMD (standard action).

---

### Perform
* **Associated Ability:** Charisma | **Type:** Rank Dependent
* **Rank Calculation:** `Perform Rank = Profession Ranks + points spent directly in Perform`. Does not follow normal rank level limits.
* **Benefits:** Increases character Credit Score by +1 per rank and doubles financial income per rank.
* **Categories:** Act, Comedy, Dance, Keyboard, Oratory, Percussion, String, Wind, Sing.
* **Daily Earnings:** DC 10 Routine (1d12 + Rank credits/day), DC 15 Enjoyable (3d12 + Rank), DC 20 Great (5d12 + Rank), DC 25 Memorable (8d12 + Rank), DC 30 Extraordinary (12d12 + Rank). Masterwork instruments grant advantage.

---

### Handle Animal
* **Associated Ability:** Wisdom or Charisma (Chosen upon acquiring skill) | **Type:** Unnatural
* **Rank Calculation:** `Handle Animal Rank = Diplomacy Ranks + Survival Ranks`. Does not follow level limits. Skill points cannot be spent directly.
* **Tasks & DCs:**
  * Handle Animal (DC 10, move action)
  * Push Animal (DC 25, full-round action)
  * Teach Trick (DC 15 or 20, 1 week; Int 1 max 3 tricks, Int 2 max 6 tricks)
  * Rear Wild Animal (DC 15 + HD of animal, domesticates up to 3 creatures)
  * Train General Purpose (DC 15–20: Combat Riding DC 20, Fighting DC 20, Guarding DC 20, Heavy Labor DC 15, Hunting DC 20).
* **Non-Animals:** Can handle creatures with Int 1–2 that are not animals at +5 DC.

---

## 3. Skill-Like Abilities

Skill-Like Abilities scale automatically with Character Level and do not require skill points.

### Tech (Knowledge Technology)
* **Associated Ability:** Intelligence | **Type:** Natural
* **Rank Calculation:** `Knowledge Technology Rank = Character Level / 2 (rounded up)` (e.g., Rank 10 at Level 19).
* **Crafting & Repairing Capacity:** Tech Level ranges from 0 to 4 (starts at 2 based on Species). Character can craft/repair items up to their Tech Level. Repairing an item +1 TL higher incurs a +5 DC penalty; items >1 TL higher cannot be repaired.
* **Identify Technology:**
  * Starship hull / Mecha frame / Robot superstructure: DC 10.
  * Function of mechanical system / cybernetic: DC 15.
  * Design specs of starship/mecha/robot: DC 20.
  * Unfamiliar / Alien items: Basic tool DC 10, Vehicular component DC 15, Cybernetic DC 20, Alien weapon DC 25, Alien artifact DC 30 (+5 DC per Progress Level step difference).

---

### Profession
* **Associated Ability:** Wisdom | **Type:** Natural
* **Rank Calculation:** `Profession Rank = Character Level / 2 (rounded up)` (e.g., Rank 10 at Level 19).
* **Check Uses:**
  * **Getting a Bonus:** Roll `d20 + Profession Rank` vs DC 20 once per week. Success awards bonus wealth (suggested `Credit Score - 3` value or +$250).
  * **Acting Professional:** Adds Profession rank as a bonus to Bluff checks when acting professional in workplace settings.
  * **Performance Support:** All Profession ranks add directly into the Perform skill.
