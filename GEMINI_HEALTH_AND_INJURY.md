# Health and Injury Summary

## Hit Points & Hit Dice
*   **Hit Dice (HD):** d6, d8, or d10 based on Path.
*   **Leveling HP:** Roll HD + CON modifier (1st level gets max HD value).
*   **Temporary HP:** Expiration causing HP to drop to 0 or negative causes the character to pass out at 0 HP (Unstable/Dying state).
*   **Constitution HP:** Temporary/permanent CON changes alter max HP (healable via normal healing), not temporary HP.

---

## Injury & Damage Mechanics

### DR (Damage Reduction) vs. Extra Damage
*   **Default:** DR subtracts directly from damage.
*   **Extra Damage Stacking:** DR increases by **1/2 of Base DR (round up) per Extra Damage** of the attack.
    *   *Formula:* `Effective DR = Base DR + (1/2 * Base DR * Extra Damage)`
    *   *Example:* 4 DR vs. 1 Extra Damage = 6 DR total.

### Nonlethal Damage
*   Dealt by unarmed attacks or subdual weapons. Lethal weapons can deal nonlethal at a disadvantage.
*   Does not reduce HP. Defender rolls **CON save of DC 5 + damage** or takes **temporary CON damage**:
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

### Damage Types & Target Defenses
1.  **Chemical:** Sub-types: Acid, Base. (Acid, chemical burns, bio weapons).
2.  **Electrical:** Direct contact with electricity or magnetism.
3.  **Kinetic:** Sub-types: Piercing, Bludgeoning, Slicing. (Default damage type; shockwaves, sonic).
4.  **Thermal:** Sub-types: Cold, Heat, Radiation. (Heat, radiation, extreme cold).

*   **Defenses:** DR (max 10), **Strength** (takes x0.5 damage), **Immunity** (takes x0 damage), **Weakness** (+1 damage), **Vulnerable** (takes x2 critical damage).

#### Detailed Rules for Damage Types
*  For detailed rules on shorthand formats, combination/double types, spaceship MASS magnitudes, and modifiers, see 
@./GEMINI_DAMAGE_TYPES.md

---

## Death, Dying, and Cheating Death

### Unstable and Dying (0 HP)
*   **Status:** Unconscious. Takes **1d4 CON damage** every round.
*   **Attacked:** Taking damage while unstable forces an additional **1d4 CON damage**.
*   **Death:** Occurs when CON score reaches 0.
*   **Stabilizing:** DC 20 Medical check as a **Standard Action**. If successful, health returns to 1 HP (CON damage is not restored).

### Cheating Death (Futuristic Revival)
*   **Methods:** Rejuvenate body (advanced biology/cyborg tech) or Transfer mind (brain transplant/digital upload/psionics).
*   **Costs:** High, typically reduces Credit score.
*   **GM Penalty Options:** 
    *   Permanent ability damage (-2 to one or -1 to two).
    *   XP reset to level minimum.
    *   Lose 1 level.
    *   Permanent HP loss or reduced HD size.
    *   Gain a Difficulty without bonus points.
    *   Change body (species, sex, appearance).
    *   Corporate ownership / indentured servitude.
    *   Societal shunning / criminalization.

---

## Healing

### In-Combat Healing
1.  **Medical Skill:** Standard Use Item action + Medical/First Aid Kit. HP restored scales with Skill Competency Level.
2.  **Medical Items:** (e.g., Healing Concoction). Used without a Medical check, HP restored is **1/2 the dice roll value**.
3.  **Medical Items + Medical Skill:** Administered with a **DC 10 Medical check**.
    *   *Natural 1:* Critical failure, nothing happens.
    *   *Failure (< 10):* Target receives 1/2 of item HP.
    *   *Success (>= 10):* Target receives normal item HP roll.
    *   *Bonuses:* Every 5 points above DC 10 adds **+1 HP per Die** provided by the item (max bonus +3).

### Out-of-Combat Healing
*   **Natural Healing:** 8 hours rest restores **1 HD + CON modifier** (uses largest HD if multiclassed).
*   **Bed Rest (24 hrs):** Restores **1/4 max HP**.
*   **Long/Short Term Care:** Restores **1/2 max HP** (administered by another).
*   *Note:* A player cannot perform Medical checks on themselves.

### Ability Healing
*   **Natural:** Heals **1 point per affected ability per day** of 8 hours uninterrupted rest (starts 24 hours after injury).
*   **Medical Skill (DC 20, non-combat):** Success restores **+1d4 in up to 3 different damaged abilities**. **Natural 20** restores **+4 in up to 3 different damaged abilities**. Limit once per 24 hours.

### Kits
*   Medical Kit, First Aid Kit, and Surgery Kit. Default 20 uses (advanced kits have 10 uses and grant Advantage).

---

## Item Damage & Repair
*   **Battle Scars:** Items take Battle Scars in combat when an attack's damage in a single group turn exceeds the item's **Hardness**.
*   **Resiliency:** The number of Battle Scars an item can sustain before breaking.
*   **Default Item Stats:** Resiliency 2 / Hardness 5 (R2/H5).

