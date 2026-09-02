/*jslint browser:true, devel:true, long:true, unordered:true, white:true, for:true, this:true*/
/*global bootstrap*/

// Default Fallback Datasets
const FALLBACK_HULL_SIZES = [
    {
        battle_damage_capacity: 5,
        bays: "4 / 12",
        cargo_capacity_units: 32768,
        cost_baseline: "50,000,000+ Credits",
        customization_points: 0,
        detect_dc: 6,
        dimensions: "~100,000+ ft / ~1,000,000+ Tons",
        hard_points: "12 / 24",
        name: "Colossal",
        passenger_capacity: "1,000+",
        procure_diff: 55,
        size_modifier: -8,
        square_feet: "100,000+ sq ft",
        tracking_dc_bonus: -8,
        weapon_size_max: "Colossal"
    },
    {
        battle_damage_capacity: 4,
        bays: "2 / 6",
        cargo_capacity_units: 16384,
        cost_baseline: "15,000,000 Credits",
        customization_points: 0,
        detect_dc: 7,
        dimensions: "~25,000-100,000 ft / ~500,000 Tons",
        hard_points: "8 / 16",
        name: "Gargantuan",
        passenger_capacity: 256,
        procure_diff: 45,
        size_modifier: -4,
        square_feet: "32,000 sq ft",
        tracking_dc_bonus: -4,
        weapon_size_max: "Gargantuan"
    },
    {
        battle_damage_capacity: 4,
        bays: "1 / 4",
        cargo_capacity_units: 4096,
        cost_baseline: "5,000,000 Credits",
        customization_points: 0,
        detect_dc: 8,
        dimensions: "~10,000-25,000 ft / ~65,000 Tons",
        hard_points: "6 / 12",
        name: "Huge",
        passenger_capacity: 128,
        procure_diff: 38,
        size_modifier: -2,
        square_feet: "16,000 sq ft",
        tracking_dc_bonus: -2,
        weapon_size_max: "Huge"
    },
    {
        battle_damage_capacity: 3,
        bays: "1 / 3",
        cargo_capacity_units: 1024,
        cost_baseline: "1,500,000 Credits",
        customization_points: 0,
        detect_dc: 9,
        dimensions: "~6,000-10,000 ft / ~8,000 Tons",
        hard_points: "4 / 8",
        name: "Large",
        passenger_capacity: 64,
        procure_diff: 32,
        size_modifier: -1,
        square_feet: "8,000 sq ft",
        tracking_dc_bonus: -1,
        weapon_size_max: "Large"
    },
    {
        battle_damage_capacity: 3,
        bays: "0 / 2",
        cargo_capacity_units: 510,
        cost_baseline: "500,000 Credits",
        customization_points: 1,
        detect_dc: 9,
        dimensions: "~4,000+ ft / ~512 Tons",
        hard_points: "2 / 4",
        name: "Medium",
        passenger_capacity: 16,
        procure_diff: 27,
        size_modifier: 0,
        square_feet: "4,000 sq ft",
        tracking_dc_bonus: 0,
        weapon_size_max: "Medium"
    },
    {
        battle_damage_capacity: 2,
        bays: "0 / 1",
        cargo_capacity_units: 128,
        cost_baseline: "200,000 Credits",
        customization_points: 2,
        detect_dc: 9,
        dimensions: "~2,000 ft / ~64 Tons",
        hard_points: "1 / 2",
        name: "Small",
        passenger_capacity: 6,
        procure_diff: 23,
        size_modifier: 1,
        square_feet: "2,000 sq ft",
        tracking_dc_bonus: 1,
        weapon_size_max: "Small"
    },
    {
        battle_damage_capacity: 2,
        bays: "0 / 0",
        cargo_capacity_units: 32,
        cost_baseline: "75,000 Credits",
        customization_points: 3,
        detect_dc: 10,
        dimensions: "~1,000 ft / ~8 Tons",
        hard_points: "1 / 1",
        name: "Tiny",
        passenger_capacity: 2,
        procure_diff: 20,
        size_modifier: 2,
        square_feet: "1,000 sq ft",
        tracking_dc_bonus: 2,
        weapon_size_max: "Tiny"
    },
    {
        battle_damage_capacity: 1,
        bays: "0 / 0",
        cargo_capacity_units: 8,
        cost_baseline: "30,000 Credits",
        customization_points: 4,
        detect_dc: 11,
        dimensions: "~500 ft / ~1 Ton",
        hard_points: "0 / 1",
        name: "Diminutive",
        passenger_capacity: 1,
        procure_diff: 17,
        size_modifier: 4,
        square_feet: "500 sq ft",
        tracking_dc_bonus: 4,
        weapon_size_max: "Diminutive"
    },
    {
        battle_damage_capacity: 0,
        bays: "0 / 0",
        cargo_capacity_units: 1,
        cost_baseline: "10,000 Credits",
        customization_points: 5,
        detect_dc: 12,
        dimensions: "~250 ft / ~250 lbs",
        hard_points: "0 / 0",
        name: "Fine",
        passenger_capacity: 0,
        procure_diff: 14,
        size_modifier: 8,
        square_feet: "250 sq ft",
        tracking_dc_bonus: 8,
        weapon_size_max: "Fine"
    }
];

const FALLBACK_HULL_CONFIGS = [
    "Barges", "Battle Cruisers", "Battle Ships", "Capital", "Carriers",
    "Cruisers (Military)", "Cruisers (Civilian)", "Drones", "Destroyers",
    "Dreadnoughts", "Fighters", "Frigates", "Freighters", "Industrial", "Shuttles"
];

const FALLBACK_SPECIES = [
    "Human", "Volar", "Grayling", "Lepidonain", "Cryous", "Ovex",
    "Aconian", "Murid", "Avisari", "Khepri", "Sayor", "Kurgian",
    "Tygerion", "Xrototaxian", "Chronodes"
];

const FALLBACK_FTL_DRIVES = [
    "Assisted Jump Drive", "Warp Drive (The Hopper)", "Assisted Advanced Jump Drive",
    "Warp Drive (The Skimmer)", "Slip Stream Drive", "Personal Jump Drive",
    "Warp Drive (The High Pulse Drive)", "Phase Shift Drive",
    "Personal Advanced Jump Drive", "Expert Warp Drive", "Advanced Slip Stream Drive"
];

const FALLBACK_QUIRKS = [
    {
        name: "Out Dated",
        negative_effect: "Disadvantage to all repair rolls and maintenance.",
        positive_effect: "Common replacement parts cost 25% less."
    },
    {
        name: "Cranky",
        negative_effect: "Takes twice as long to prep systems or spin up FTL.",
        positive_effect: "+1 to resist enemy cyber hacks due to strange system quirks."
    },
    {
        name: "Falling Apart",
        negative_effect: "Loose plating vibrates and rattles loudly (-2 to Stealth DC).",
        positive_effect: "Easy maintenance access panels provide +2 to quick patch repairs."
    },
    {
        name: "Infested",
        negative_effect: "Small vermin occasionally chew wires, giving disadvantage on sensor sweeps.",
        positive_effect: "Natural pest bio-alarms warn crew of incoming boarders."
    },
    {
        name: "Bad Past",
        negative_effect: "Known criminal transponder signature brings scrutiny from authorities.",
        positive_effect: "Underworld factions and smugglers treat the vessel with respect."
    },
    {
        name: "Artificial Intelligence (AI)",
        negative_effect: "AI may dispute questionable or suicidal orders from the captain.",
        positive_effect: "AI can execute one ship function per round autonomously."
    },
    {
        name: "Noisy",
        negative_effect: "Audible engine hum grants -1 to Stealth DC.",
        positive_effect: "+1 Tactical Mobility due to overclocked exhaust manifolds."
    },
    {
        name: "Battle Scars",
        negative_effect: "Armor hull has permanent dings and scorches.",
        positive_effect: "Imposing battle-hardened appearance gives +2 to intimidation rolls."
    },
    {
        name: "Lucky",
        negative_effect: "Crew can grow overly reliant on fortune.",
        positive_effect: "Once per session, reroll any failed ship check."
    },
    {
        name: "Cursed",
        negative_effect: "Natural 1s count as catastrophic system failures.",
        positive_effect: "Crew is hyper-vigilant (+1 to Passive Sensors)."
    },
    {
        name: "Experimental",
        negative_effect: "Standard replacement parts require custom calibration.",
        positive_effect: "One chosen ship function receives permanent Advantage."
    }
];

// State Variables
let shipData = {
    configurations: FALLBACK_HULL_CONFIGS,
    ftlDrives: FALLBACK_FTL_DRIVES,
    hullSizes: FALLBACK_HULL_SIZES,
    quirks: FALLBACK_QUIRKS,
    species: FALLBACK_SPECIES
};

let hardPointRowsCount = 0;
let bayRowsCount = 0;
let quirkRowsCount = 0;
let diceRollHistory = [];
let currentRollAction = "Check";
let currentRollBonus = 0;
let currentAdvantage = 0;
let draggedCardElement = null;

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", function () {
    loadSavedCardOrder();
    loadLayoutLockState();
    loadNotesPrintState();
    loadThemePreference();
    fetchSpaceshipReferenceData();
    initializeDefaultRows();
    recalculateShipAttributes();
    updateTableOfContents();
    initDragAndDrop();
});

// Fetch Reference Data from Backend
function fetchSpaceshipReferenceData() {
    fetch("/tasks/ship_schematics_sheet/all")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(function (data) {
            if (data.hull_sizes && Array.isArray(data.hull_sizes)) {
                shipData.hullSizes = data.hull_sizes;
            }
            if (data.hull_configurations && Array.isArray(data.hull_configurations)) {
                shipData.configurations = data.hull_configurations;
            }
            if (data.quirks && Array.isArray(data.quirks)) {
                shipData.quirks = data.quirks;
            }
            if (data.ftl_drives && Array.isArray(data.ftl_drives)) {
                shipData.ftlDrives = data.ftl_drives;
            }
            if (data.species && Array.isArray(data.species)) {
                shipData.species = data.species;
            }
            populateReferenceDatalists();
            buildThemeModals();
        })
        .catch(function (err) {
            console.warn("Could not fetch remote reference data, using fallbacks:", err);
            populateReferenceDatalists();
            buildThemeModals();
        });
}

// Populate HTML Datalists
function populateReferenceDatalists() {
    populateDatalist("hullConfigDatalist", shipData.configurations);
    populateDatalist("ftlDriveDatalist", shipData.ftlDrives);
    populateDatalist("speciesMakeDatalist", shipData.species);
}

function populateDatalist(elementId, items) {
    const el = document.getElementById(elementId);
    if (!el || !items) {
        return;
    }
    el.innerHTML = "";
    items.forEach(function (item) {
        const opt = document.createElement("option");
        if (typeof item === "string") {
            opt.value = item;
        } else {
            opt.value = item.name || "";
        }
        el.appendChild(opt);
    });
}

// Helper: Safe Input Reading
function getInputValue(id, defaultVal) {
    const el = document.getElementById(id);
    if (el && el.value !== undefined && el.value !== "") {
        return el.value;
    }
    return defaultVal;
}

function getInputNumber(id, defaultVal) {
    const el = document.getElementById(id);
    if (el && el.value !== undefined && el.value !== "") {
        const parsed = parseInt(el.value, 10);
        if (!Number.isNaN(parsed)) {
            return parsed;
        }
    }
    return defaultVal;
}

function isInputChecked(id, defaultVal) {
    const el = document.getElementById(id);
    if (el && el.checked !== undefined) {
        return el.checked;
    }
    return defaultVal;
}

// Helper: Calculate Modifier from Score
function getScoreModifier(score) {
    const s = parseInt(score, 10) || 10;
    return Math.floor((s - 10) / 2);
}

function formatModifier(mod) {
    if (mod >= 0) {
        return "+" + mod;
    }
    return String(mod);
}

// Attribute Score Changes Handler
function onAttributeScoreChange(attrName, scoreVal) {
    const mod = getScoreModifier(scoreVal);
    const modDisplay = document.getElementById(attrName + "ModDisplay");
    if (modDisplay) {
        modDisplay.value = formatModifier(mod);
    }
    recalculateShipAttributes();
}

// Handle Hull Size Selection Change
function onHullSizeChange(sizeName) {
    const matched = shipData.hullSizes.find(function (s) {
        return s.name.toLowerCase() === sizeName.toLowerCase();
    });

    if (matched) {
        // Battle Damage Capacity
        const capEl = document.getElementById("battleDamageCapacity");
        if (capEl) {
            capEl.value = matched.battle_damage_capacity;
        }

        // Customization Points based on Core Level & Size
        updateCustomizationPoints();

        // Secondary specs
        const secHpEl = document.getElementById("hardPointsBaysSlotsInput");
        if (secHpEl) {
            secHpEl.value = matched.hard_points + " HP / " + matched.bays + " Bays / " + matched.customization_points + " Cust.";
        }

        const cargoEl = document.getElementById("cargoCapacityInput");
        if (cargoEl) {
            cargoEl.value = matched.cargo_capacity_units + " Units";
        }

        const dimEl = document.getElementById("dimensionsWeightInput");
        if (dimEl) {
            dimEl.value = matched.dimensions;
        }

        const passEl = document.getElementById("passengerCapacityInput");
        if (passEl) {
            passEl.value = matched.passenger_capacity + " Passengers";
        }
    }

    recalculateShipAttributes();
}

// Handle Core Level Change
function onCoreLevelChange() {
    updateCustomizationPoints();
}

function onShipClassTypeChange() {
    recalculateShipAttributes();
}

function onHullConfigChange(val) {
    const secConfig = document.getElementById("secHullConfigInput");
    if (secConfig) {
        secConfig.value = val;
    }
}

function syncSecondaryConfig(val) {
    const mainConfig = document.getElementById("hullConfigInput");
    if (mainConfig) {
        mainConfig.value = val;
    }
}

// Update Customization Points
function updateCustomizationPoints() {
    const coreSelect = document.getElementById("coreLevelSelect");
    let coreLevel = 2;
    if (coreSelect) {
        coreLevel = parseInt(coreSelect.value, 10);
    }

    const sizeInput = document.getElementById("hullSizeInput");
    let sizeName = "Medium";
    if (sizeInput) {
        sizeName = sizeInput.value;
    }

    let corePts = 15;
    if (coreLevel === 1) {
        corePts = 10;
    } else if (coreLevel === 3) {
        corePts = 20;
    } else if (coreLevel === 4) {
        corePts = 25;
    }

    const matched = shipData.hullSizes.find(function (s) {
        return s.name.toLowerCase() === sizeName.toLowerCase();
    });

    let sizeCust = 1;
    if (matched) {
        sizeCust = matched.customization_points;
    }
    const totalCust = sizeCust + (coreLevel - 1);

    const custDisplay = document.getElementById("customizationPointsDisplay");
    if (custDisplay) {
        custDisplay.value = totalCust;
    }
    const helper = document.getElementById("corePointsHelper");
    if (helper) {
        helper.textContent = "(Core Pts: " + corePts + ")";
    }
}

// Recalculate All Primary & Secondary Attributes
function recalculateShipAttributes() {
    const enginesScore = getInputNumber("enginesScoreInput", 10);
    const weaponsScore = getInputNumber("weaponsScoreInput", 10);
    const structureScore = getInputNumber("structureScoreInput", 10);
    const shieldsScore = getInputNumber("shieldsScoreInput", 10);
    const sensorsScore = getInputNumber("sensorsScoreInput", 10);
    const electronicsScore = getInputNumber("electronicsScoreInput", 10);

    const enginesMod = getScoreModifier(enginesScore);
    const weaponsMod = getScoreModifier(weaponsScore);
    const structureMod = getScoreModifier(structureScore);
    const shieldsMod = getScoreModifier(shieldsScore);
    const sensorsMod = getScoreModifier(sensorsScore);
    const electronicsMod = getScoreModifier(electronicsScore);

    // Update Mod Displays
    setElementValue("enginesModDisplay", formatModifier(enginesMod));
    setElementValue("weaponsModDisplay", formatModifier(weaponsMod));
    setElementValue("structureModDisplay", formatModifier(structureMod));
    setElementValue("shieldsModDisplay", formatModifier(shieldsMod));
    setElementValue("sensorsModDisplay", formatModifier(sensorsMod));
    setElementValue("electronicsModDisplay", formatModifier(electronicsMod));

    // Size lookup
    const sizeName = getInputValue("hullSizeInput", "Medium");
    const matchedSize = shipData.hullSizes.find(function (s) {
        return s.name.toLowerCase() === sizeName.toLowerCase();
    }) || shipData.hullSizes[4]; // Default medium

    const sizeMod = matchedSize.size_modifier;
    const baseDetectDc = matchedSize.detect_dc;

    // 1. BD-DC
    setElementValue("bdDefenseResistance", 4 + structureMod);
    setElementValue("bdDefenseReflectors", 4 + shieldsMod);

    // 2. Initiative: (Engines + Sensors) - Structure
    const initiativeVal = (enginesMod + sensorsMod) - structureMod;
    setElementValue("initiativeDisplay", formatModifier(initiativeVal));

    // 3. Tactical Mobility: Engines Modifier
    setElementValue("tacticalMobilityDisplay", formatModifier(enginesMod));

    // 4. Tracking DC: 10 + ((Tactical Mobility + Shields Mod) +/- Size Mod) - Structure Mod
    const trackingDc = 10 + (enginesMod + shieldsMod + sizeMod) - structureMod;
    setElementValue("trackingDcDisplay", trackingDc);

    // 5. Detection DC: Base size - (Shields Mod / 2 if active)
    const shieldsActive = isInputChecked("shieldsActiveSwitch", true);
    let shieldPenalty = 0;
    if (shieldsActive) {
        shieldPenalty = Math.floor(shieldsMod / 2);
    }
    const finalDetectDc = Math.max(1, baseDetectDc - shieldPenalty);
    setElementValue("detectionDcDisplay", finalDetectDc);

    // 6. Stealth DC: Detection DC + Electronics Mod
    const stealthDc = finalDetectDc + electronicsMod;
    setElementValue("stealthDcDisplay", stealthDc);

    // 7. Passive Sensors: 10 + Sensors Mod
    const passiveSensors = 10 + sensorsMod;
    setElementValue("passiveSensorsDisplay", passiveSensors);

    // 8. Repair DC Bonus: Weapons Mod + Weapons Officer Dex/Wis Mod
    const woMod = getInputNumber("repairDcOfficerModVal", 0);
    const repairDcBonus = weaponsMod + woMod;
    setElementValue("repairDcBonusDisplay", formatModifier(repairDcBonus));

    // Sub-badges in cards
    setElementText("enginesTrackingBonusDisplay", formatModifier(enginesMod));
    setElementText("weaponsRerollBonusDisplay", formatModifier(weaponsMod));
    setElementText("structureArmorBonusDisplay", 4 + structureMod);
    setElementText("shieldsReflectorDisplay", 4 + shieldsMod);
    setElementText("shieldDeflectTargetBadge", 4 + shieldsMod);
    setElementText("shieldDetectPenaltyBadge", "-" + shieldPenalty);
    setElementText("sensorsPassiveDisplay", passiveSensors);
    setElementText("electronicsStealthBonusDisplay", formatModifier(electronicsMod));

    // Recalculate Ship Functions
    recalculateFunctions(enginesMod, weaponsMod, structureMod, shieldsMod, sensorsMod, electronicsMod);
}

function setElementValue(id, val) {
    const el = document.getElementById(id);
    if (el) {
        el.value = val;
    }
}

function setElementText(id, txt) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = txt;
    }
}

// Recalculate Function Totals
function recalculateFunctions(engMod, wpnMod, strMod, shdMod, snsMod, elcMod) {
    const helmPilotMod = getInputNumber("helmOfficerPilotMod", 0);
    const wpnOffMod = getInputNumber("weaponsOfficerMod", 0);
    const engCraftMod = getInputNumber("engineerOfficerCraftMod", 0);
    const commsMod = getInputNumber("commsOfficerMod", 0);
    const sciMod = getInputNumber("scienceOfficerMod", 0);
    const capMod = getInputNumber("captainCharismaMod", 0);
    const medMod = getInputNumber("medicalOfficerMod", 0);

    // Helm Functions
    setElementValue("funcTotal_flyOffDef", formatModifier(engMod + helmPilotMod));
    setElementValue("funcTotal_closeWiden", formatModifier(engMod + helmPilotMod));
    setElementValue("funcTotal_pursueIntercept", formatModifier(engMod + helmPilotMod));
    setElementValue("funcTotal_ram", formatModifier(engMod));
    setElementValue("funcTotal_evasiveThrusters", formatModifier(engMod));
    setElementValue("funcTotal_feint", formatModifier(engMod));
    setElementValue("funcTotal_grappleEngines", formatModifier(engMod));

    // Weapons Functions
    setElementValue("funcTotal_fire", formatModifier(wpnMod + wpnOffMod));
    setElementValue("funcTotal_bombard", formatModifier(wpnMod + wpnOffMod));
    setElementValue("funcTotal_concentratedFire", formatModifier(wpnMod + wpnOffMod));
    setElementValue("funcTotal_defensiveFire", formatModifier(wpnMod + wpnOffMod));

    // Engineer Functions
    setElementValue("funcTotal_repair", formatModifier(strMod + engCraftMod));
    setElementValue("funcTotal_boostEngines", formatModifier(strMod + engCraftMod));
    setElementValue("funcTotal_counterHackEng", formatModifier(elcMod + engCraftMod));
    setElementValue("funcTotal_overclockCore", formatModifier(strMod));
    setElementValue("funcTotal_cloakEng", formatModifier(elcMod));

    // Shields Functions
    setElementValue("funcTotal_shieldModulation", formatModifier(shdMod));

    // Sensors / Comms Functions
    setElementValue("funcTotal_scan", formatModifier(snsMod + commsMod));
    setElementValue("funcTotal_hackComms", formatModifier(elcMod + commsMod));
    setElementValue("funcTotal_spoofing", formatModifier(snsMod + commsMod));
    setElementValue("funcTotal_cryptoComms", formatModifier(elcMod + commsMod));
    setElementValue("funcTotal_jamComms", formatModifier(elcMod + commsMod));

    // Science Functions
    setElementValue("funcTotal_boostSci", formatModifier(elcMod + sciMod));
    setElementValue("funcTotal_hackSci", formatModifier(elcMod + sciMod));
    setElementValue("funcTotal_cloakSci", formatModifier(elcMod + sciMod));
    setElementValue("funcTotal_cryptoSci", formatModifier(elcMod + sciMod));

    // Captain Functions
    setElementValue("funcTotal_giveCommand", formatModifier(capMod));
    setElementValue("funcTotal_encourageCrew", formatModifier(capMod));
    setElementValue("funcTotal_commandingPresence", formatModifier(capMod));
    setElementValue("funcTotal_directAssistance", formatModifier(capMod));

    // Medical Functions
    setElementValue("funcTotal_medical", formatModifier(medMod));
    setElementValue("funcTotal_resuscitation", formatModifier(medMod));
    setElementValue("funcTotal_automatedCare", formatModifier(medMod));
}

function onCaptainModChange() {
    recalculateShipAttributes();
}

function onMedicalModChange() {
    recalculateShipAttributes();
}

function onShieldsActiveToggle() {
    recalculateShipAttributes();
}

// 2d10 Space Conflict Dice Roller
function rollAttributeCheck(attrName) {
    const attrKey = attrName.toLowerCase();
    const scoreVal = getInputNumber(attrKey + "ScoreInput", 10);
    const mod = getScoreModifier(scoreVal);
    openRollModal(attrName + " Check", mod, attrKey);
}

function rollShipFunction(funcName, attrKey, explicitBonus) {
    let bonus = explicitBonus;
    if (bonus === 0) {
        // Look up corresponding function input
        const inputs = document.querySelectorAll(".function-row");
        inputs.forEach(function (row) {
            if (row.textContent.includes(funcName)) {
                const totalField = row.querySelector(".function-total-field");
                if (totalField) {
                    bonus = parseInt(totalField.value, 10) || 0;
                }
            }
        });
    }
    openRollModal(funcName, bonus, attrKey);
}

function rollInitiative() {
    const initVal = getInputNumber("initiativeDisplay", 0);
    openRollModal("Ship Initiative", initVal, "initiative");
}

function openRollModal(actionTitle, bonus, attrKey) {
    currentRollAction = actionTitle;
    currentRollBonus = bonus;
    currentAdvantage = 0;

    let subtext = "Formula: 2d10 (Explodes on 10) + (" + formatModifier(bonus) + ")";
    if (attrKey) {
        subtext += " [" + attrKey + "]";
    }
    setElementText("rollActionTitle", actionTitle);
    setElementText("rollActionSubtext", subtext);
    updateAdvantageBadge();

    const resultBox = document.getElementById("rollResultContainer");
    if (resultBox) {
        resultBox.classList.add("d-none");
    }

    const modalEl = document.getElementById("diceRollerModal");
    if (modalEl && window.bootstrap) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    }
}

function adjustRollAdvantage(delta) {
    currentAdvantage = Math.max(-3, Math.min(3, currentAdvantage + delta));
    updateAdvantageBadge();
}

function updateAdvantageBadge() {
    const badge = document.getElementById("rollAdvantageBadge");
    if (!badge) {
        return;
    }
    if (currentAdvantage > 0) {
        badge.className = "badge bg-success px-3 py-2";
        badge.textContent = "+" + currentAdvantage + " Advantage";
    } else if (currentAdvantage < 0) {
        badge.className = "badge bg-danger px-3 py-2";
        badge.textContent = currentAdvantage + " Disadvantage";
    } else {
        badge.className = "badge bg-secondary px-3 py-2";
        badge.textContent = "Normal (0)";
    }
}

// Execute 2d10 Roll with Exploding 10s and Advantage
function executeCurrentRoll() {
    const numBaseDice = 2 + Math.abs(currentAdvantage);
    const diceRolls = [];
    const explodedDice = [];

    // Roll pool
    for (let i = 0; i < numBaseDice; i += 1) {
        const roll = Math.floor(Math.random() * 10) + 1;
        diceRolls.push(roll);
        // Explode 10s once
        if (roll === 10) {
            const extra = Math.floor(Math.random() * 10) + 1;
            explodedDice.push({ extra, originalIndex: i });
        }
    }

    // Sort to keep top 2 (Advantage) or bottom 2 (Disadvantage)
    const combinedValues = diceRolls.map(function (val, idx) {
        const extraMatch = explodedDice.find(function (e) {
            return e.originalIndex === idx;
        });
        let extraVal = 0;
        if (extraMatch) {
            extraVal = extraMatch.extra;
        }
        return {
            base: val,
            extra: extraVal,
            total: val + extraVal
        };
    });

    if (currentAdvantage >= 0) {
        // Keep highest 2
        combinedValues.sort(function (a, b) {
            return b.total - a.total;
        });
    } else {
        // Keep lowest 2
        combinedValues.sort(function (a, b) {
            return a.total - b.total;
        });
    }

    const keptDice = combinedValues.slice(0, 2);
    const sumKeptDice = keptDice.reduce(function (acc, d) {
        return acc + d.total;
    }, 0);

    // Advantage static bonus (+2 per advantage, -2 per disadvantage)
    const advantageStaticBonus = currentAdvantage * 2;
    const finalTotal = sumKeptDice + currentRollBonus + advantageStaticBonus;

    // Check Crit Success / Crit Failure
    // Crit Fail: All base dice rolled land on 1
    const isCritFail = diceRolls.every(function (d) {
        return d === 1;
    });

    // Crit Success: At least one die exploded and raw dice sum > 20
    const hasExplosion = explodedDice.length > 0;
    const isCritSuccess = hasExplosion && sumKeptDice > 20;

    displayRollResult(finalTotal, keptDice, isCritSuccess, isCritFail, advantageStaticBonus);
    recordRollHistory(currentRollAction, finalTotal, keptDice, currentRollBonus, advantageStaticBonus, isCritSuccess, isCritFail);
}

function displayRollResult(total, keptDice, isCritSuccess, isCritFail, advBonus) {
    const container = document.getElementById("rollResultContainer");
    const totalEl = document.getElementById("rollTotalNumber");
    const badgeEl = document.getElementById("rollOutcomeBadge");
    const breakdownEl = document.getElementById("rollBreakdownText");

    if (!container || !totalEl || !badgeEl || !breakdownEl) {
        return;
    }

    totalEl.textContent = total;

    if (isCritSuccess) {
        badgeEl.className = "badge bg-warning text-dark px-3 py-1 mb-2 fs-6";
        badgeEl.textContent = "CRITICAL SUCCESS!";
    } else if (isCritFail) {
        badgeEl.className = "badge bg-danger px-3 py-1 mb-2 fs-6";
        badgeEl.textContent = "CRITICAL FAILURE!";
    } else {
        badgeEl.className = "badge bg-info text-dark px-3 py-1 mb-2 fs-6";
        badgeEl.textContent = "Roll Resolved";
    }

    const diceStr = keptDice.map(function (d) {
        if (d.extra > 0) {
            return d.base + "+" + d.extra;
        }
        return String(d.base);
    }).join(", ");

    let formulaStr = "Dice: [" + diceStr + "] + Mod: " + formatModifier(currentRollBonus);
    if (advBonus !== 0) {
        formulaStr += " + Adv: " + formatModifier(advBonus);
    }
    formulaStr += " = " + total;

    breakdownEl.textContent = formulaStr;
    container.classList.remove("d-none");
}

function recordRollHistory(action, total, keptDice, bonus, advBonus, isCritSuccess, isCritFail) {
    const record = {
        action,
        advBonus,
        bonus,
        isCritFail,
        isCritSuccess,
        keptDice,
        timestamp: new Date().toLocaleTimeString(),
        total
    };
    diceRollHistory.unshift(record);
    if (diceRollHistory.length > 50) {
        diceRollHistory.pop();
    }
}

function renderDiceHistory() {
    const list = document.getElementById("diceHistoryList");
    if (!list) {
        return;
    }
    if (diceRollHistory.length === 0) {
        list.innerHTML = "<p class='text-muted small text-center my-3'>No rolls recorded yet.</p>";
        return;
    }
    let html = "";
    diceRollHistory.forEach(function (r) {
        let badgeClass = "badge bg-secondary";
        let statusText = "";
        if (r.isCritSuccess) {
            badgeClass = "badge bg-warning text-dark";
            statusText = " [CRIT SUCCESS]";
        } else if (r.isCritFail) {
            badgeClass = "badge bg-danger";
            statusText = " [CRIT FAIL]";
        }
        html += "<div class='d-flex justify-content-between align-items-center py-2 border-bottom border-secondary'>";
        html += "<div><strong class='text-cyan'>" + r.action + "</strong>" + statusText + "<br>";
        html += "<small class='text-muted'>" + r.timestamp + " | Kept: [" + r.keptDice.map(function (d) {
            return d.total;
        }).join(",") + "] + " + r.bonus + "</small></div>";
        html += "<span class='" + badgeClass + " fs-6'>" + r.total + "</span>";
        html += "</div>";
    });
    list.innerHTML = html;
}

function clearDiceHistory() {
    diceRollHistory = [];
    renderDiceHistory();
}

// Hard Points Management
function addHardPointRow(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    hardPointRowsCount += 1;
    let colId = "hardPointsColRight";
    if (hardPointRowsCount % 2 === 1) {
        colId = "hardPointsColLeft";
    }
    const col = document.getElementById(colId);
    if (!col) {
        return;
    }

    const rowDiv = document.createElement("div");
    rowDiv.className = "hardpoint-entry mb-2";
    rowDiv.id = "hardPointEntry_" + hardPointRowsCount;
    rowDiv.innerHTML = "<div class='d-flex justify-content-between align-items-center mb-1'>" +
        "<label class='small fw-bold text-cyan mb-0' for='hpName_" + hardPointRowsCount + "'>Hard Point #" + hardPointRowsCount + "</label>" +
        "<button type='button' class='btn btn-link btn-sm text-danger p-0 no-print' onclick='removeEntry(\"" + rowDiv.id + "\", \"hardPoints\")'>" +
        "<i class='fa-solid fa-xmark'></i></button></div>" +
        "<input type='text' id='hpName_" + hardPointRowsCount + "' class='form-control form-control-sm mb-1' placeholder='Weapon / Mount Name'>" +
        "<label class='visually-hidden' for='hpDesc_" + hardPointRowsCount + "'>Description</label>" +
        "<textarea id='hpDesc_" + hardPointRowsCount + "' class='form-control form-control-sm' placeholder='Damage, Range, Ammo, Notes...' rows='2' oninput='autoExpandTextarea(this)'></textarea>";

    col.appendChild(rowDiv);
    updateHardPointsCount();
}

function updateHardPointsCount() {
    const total = document.querySelectorAll(".hardpoint-entry").length;
    setElementText("hardPointsCountBadge", total + " Total");
}

// Bays Management
function addBayRow(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    bayRowsCount += 1;
    let colId = "baysColRight";
    if (bayRowsCount % 2 === 1) {
        colId = "baysColLeft";
    }
    const col = document.getElementById(colId);
    if (!col) {
        return;
    }

    const rowDiv = document.createElement("div");
    rowDiv.className = "bay-entry mb-2";
    rowDiv.id = "bayEntry_" + bayRowsCount;
    rowDiv.innerHTML = "<div class='d-flex justify-content-between align-items-center mb-1'>" +
        "<label class='small fw-bold text-cyan mb-0' for='bayName_" + bayRowsCount + "'>Bay #" + bayRowsCount + "</label>" +
        "<button type='button' class='btn btn-link btn-sm text-danger p-0 no-print' onclick='removeEntry(\"" + rowDiv.id + "\", \"bays\")'>" +
        "<i class='fa-solid fa-xmark'></i></button></div>" +
        "<input type='text' id='bayName_" + bayRowsCount + "' class='form-control form-control-sm mb-1' placeholder='Bay Facility Type'>" +
        "<label class='visually-hidden' for='bayDesc_" + bayRowsCount + "'>Description</label>" +
        "<textarea id='bayDesc_" + bayRowsCount + "' class='form-control form-control-sm' placeholder='Capacity, Equipment, Personnel...' rows='2' oninput='autoExpandTextarea(this)'></textarea>";

    col.appendChild(rowDiv);
    updateBaysCount();
}

function updateBaysCount() {
    const total = document.querySelectorAll(".bay-entry").length;
    setElementText("shipBaysCountBadge", total + " Total");
}

// Quirks Management
function addQuirkRow(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    quirkRowsCount += 1;
    const list = document.getElementById("quirksListContainer");
    if (!list) {
        return;
    }

    const rowDiv = document.createElement("div");
    rowDiv.className = "quirk-entry";
    rowDiv.id = "quirkEntry_" + quirkRowsCount;
    rowDiv.innerHTML = "<div class='d-flex justify-content-between align-items-center mb-2'>" +
        "<label class='small fw-bold text-warning mb-0' for='quirkName_" + quirkRowsCount + "'>Ship Quirk #" + quirkRowsCount + "</label>" +
        "<button type='button' class='btn btn-link btn-sm text-danger p-0 no-print' onclick='removeEntry(\"" + rowDiv.id + "\", \"quirks\")'>" +
        "<i class='fa-solid fa-xmark'></i></button></div>" +
        "<div class='row g-2'>" +
        "<div class='col-12 col-md-4'>" +
        "<div class='input-group input-group-sm'>" +
        "<input type='text' id='quirkName_" + quirkRowsCount + "' class='form-control form-control-sm' placeholder='Quirk Name' list='quirksDatalist' onchange='onQuirkSelect(this.value, " + quirkRowsCount + ")'>" +
        "<button type='button' class='btn btn-cyber-outline btn-sm px-2 no-print' onclick='toggleDatalist(\"quirkName_" + quirkRowsCount + "\")'><i class='fa-solid fa-chevron-down'></i></button>" +
        "</div></div>" +
        "<div class='col-12 col-md-4'>" +
        "<label class='visually-hidden' for='quirkPos_" + quirkRowsCount + "'>Positive Effect</label>" +
        "<input type='text' id='quirkPos_" + quirkRowsCount + "' class='form-control form-control-sm' placeholder='Positive Benefit'></div>" +
        "<div class='col-12 col-md-4'>" +
        "<label class='visually-hidden' for='quirkNeg_" + quirkRowsCount + "'>Negative Effect</label>" +
        "<input type='text' id='quirkNeg_" + quirkRowsCount + "' class='form-control form-control-sm' placeholder='Negative Drawback'></div>" +
        "</div>";

    list.appendChild(rowDiv);
    updateQuirksPrintVisibility();
}

function onQuirkSelect(val, rowIndex) {
    const matched = shipData.quirks.find(function (q) {
        return q.name.toLowerCase() === val.toLowerCase();
    });
    if (matched) {
        const posEl = document.getElementById("quirkPos_" + rowIndex);
        const negEl = document.getElementById("quirkNeg_" + rowIndex);
        if (posEl) {
            posEl.value = matched.positive_effect || "";
        }
        if (negEl) {
            negEl.value = matched.negative_effect || "";
        }
    }
    updateQuirksPrintVisibility();
}

function removeEntry(id, type) {
    const el = document.getElementById(id);
    if (el) {
        el.remove();
    }
    if (type === "hardPoints") {
        updateHardPointsCount();
    } else if (type === "bays") {
        updateBaysCount();
    } else if (type === "quirks") {
        updateQuirksPrintVisibility();
    }
}

function updateQuirksPrintVisibility() {
    const quirkCard = document.getElementById("cardShipQuirks");
    if (!quirkCard) {
        return;
    }
    const entries = document.querySelectorAll(".quirk-entry");
    let hasContent = false;
    entries.forEach(function (entry) {
        const nameInput = entry.querySelector("input[id^='quirkName_']");
        if (nameInput && nameInput.value.trim() !== "") {
            hasContent = true;
        }
    });

    if (!hasContent) {
        quirkCard.classList.add("empty-quirks");
    } else {
        quirkCard.classList.remove("empty-quirks");
    }
}

function initializeDefaultRows() {
    // 4 Hard points default
    for (let i = 0; i < 4; i += 1) {
        addHardPointRow();
    }
    // 6 Bays default
    for (let j = 0; j < 6; j += 1) {
        addBayRow();
    }
    // 1 Quirk default
    addQuirkRow();
}

// Notes Card Print Visibility Toggle
function toggleNotesPrintVisibility(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const notesCard = document.getElementById("cardShipNotes");
    const textEl = document.getElementById("notesPrintVisibilityText");
    if (!notesCard || !textEl) {
        return;
    }
    const isHidden = notesCard.classList.toggle("print-hidden");
    let statusText = "Print: Visible";
    if (isHidden) {
        statusText = "Print: Hidden";
    }
    textEl.textContent = statusText;
    let hiddenVal = "false";
    if (isHidden) {
        hiddenVal = "true";
    }
    localStorage.setItem("ship_notes_print_hidden", hiddenVal);
}

function loadNotesPrintState() {
    const saved = localStorage.getItem("ship_notes_print_hidden");
    if (saved === "true") {
        const notesCard = document.getElementById("cardShipNotes");
        const textEl = document.getElementById("notesPrintVisibilityText");
        if (notesCard) {
            notesCard.classList.add("print-hidden");
        }
        if (textEl) {
            textEl.textContent = "Print: Hidden";
        }
    }
}

// Species Make & Theme System
function onSpeciesMakeChange(speciesName) {
    const locked = localStorage.getItem("ship_theme_locked") === "true";
    if (locked) {
        return;
    }
    applySpeciesTheme(speciesName);
}

function randomizeSpeciesTheme() {
    const rand = shipData.species[Math.floor(Math.random() * shipData.species.length)];
    const el = document.getElementById("speciesMakeInput");
    if (el) {
        el.value = rand;
    }
    applySpeciesTheme(rand);
}

function applySpeciesTheme(speciesName) {
    const clean = speciesName.toLowerCase().replace(/[^a-z0-9]/g, "");
    const themeName = "theme-species-" + clean;
    setDocumentTheme(themeName);
}

function setDocumentTheme(themeClass) {
    document.body.className = document.body.className
        .split(" ")
        .filter(function (c) {
            return !c.startsWith("theme-");
        })
        .join(" ") + " " + themeClass;
    localStorage.setItem("ship_selected_theme", themeClass);
}

function toggleThemeLock(locked) {
    let lockVal = "false";
    if (locked) {
        lockVal = "true";
    }
    localStorage.setItem("ship_theme_locked", lockVal);
}

function loadThemePreference() {
    const saved = localStorage.getItem("ship_selected_theme");
    if (saved) {
        setDocumentTheme(saved);
    }
    const lockSwitch = document.getElementById("themeLockSwitch");
    if (lockSwitch) {
        lockSwitch.checked = localStorage.getItem("ship_theme_locked") === "true";
    }
}

function buildThemeModals() {
    const cosmicGrid = document.getElementById("cosmicThemesGrid");
    const speciesGrid = document.getElementById("speciesThemesGrid");
    if (!cosmicGrid || !speciesGrid) {
        return;
    }

    cosmicGrid.innerHTML = "";
    speciesGrid.innerHTML = "";

    const cosmicList = [
        { label: "Cosmic Dark (Default)", theme: "theme-cosmic-dark" },
        { label: "Cosmic Light", theme: "theme-cosmic-light" },
        { label: "Bootstrap Dark", theme: "theme-bootstrap-dark" }
    ];

    cosmicList.forEach(function (c) {
        const col = document.createElement("div");
        col.className = "col-6 col-md-4";
        col.innerHTML = "<button type='button' class='btn btn-cyber-outline btn-sm w-100' onclick='setDocumentTheme(\"" + c.theme + "\")'>" + c.label + "</button>";
        cosmicGrid.appendChild(col);
    });

    shipData.species.forEach(function (s) {
        const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");
        const th = "theme-species-" + clean;
        const col = document.createElement("div");
        col.className = "col-6 col-md-3";
        col.innerHTML = "<button type='button' class='btn btn-cyber-outline btn-sm w-100' onclick='setDocumentTheme(\"" + th + "\")'>" + s + "</button>";
        speciesGrid.appendChild(col);
    });
}

// Table of Contents Generation
function updateTableOfContents() {
    const menu = document.getElementById("tocDropdownMenu");
    if (!menu) {
        return;
    }
    menu.innerHTML = "";
    const cards = document.querySelectorAll(".cards-flow-container > .sheet-card, .position-core-cards-row > div > .sheet-card");
    cards.forEach(function (card) {
        const header = card.querySelector(".card-header-custom");
        let titleSpan = null;
        if (header) {
            titleSpan = header.querySelector("span:not(.badge):not(.drag-handle)");
        }
        let title = card.id || "Card";
        if (titleSpan) {
            title = titleSpan.textContent.trim();
        }
        const li = document.createElement("li");
        li.innerHTML = "<button type='button' class='dropdown-item py-1' onclick='scrollToCard(\"" + card.id + "\")'>" + title + "</button>";
        menu.appendChild(li);
    });
}

function scrollToCard(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// Expand & Collapse All Cards
function expandAllCards() {
    const collapses = document.querySelectorAll(".sheet-card .collapse");
    collapses.forEach(function (col) {
        col.classList.add("show");
    });
}

function collapseAllCards() {
    const collapses = document.querySelectorAll(".sheet-card .collapse");
    collapses.forEach(function (col) {
        col.classList.remove("show");
    });
}

// Card Layout Locking & Reordering
function toggleCardLayoutLock() {
    const isLocked = document.body.classList.toggle("layout-locked");
    const icon = document.getElementById("cardLayoutLockIcon");
    const text = document.getElementById("cardLayoutLockText");
    if (icon) {
        if (isLocked) {
            icon.className = "fa-solid fa-lock text-warning me-2";
        } else {
            icon.className = "fa-solid fa-lock-open text-success me-2";
        }
    }
    if (text) {
        if (isLocked) {
            text.textContent = "Layout Locked";
        } else {
            text.textContent = "Layout Unlocked";
        }
    }
    let lockState = "false";
    if (isLocked) {
        lockState = "true";
    }
    localStorage.setItem("ship_layout_locked", lockState);
}

function loadLayoutLockState() {
    const saved = localStorage.getItem("ship_layout_locked");
    if (saved === "false") {
        document.body.classList.remove("layout-locked");
        const icon = document.getElementById("cardLayoutLockIcon");
        const text = document.getElementById("cardLayoutLockText");
        if (icon) {
            icon.className = "fa-solid fa-lock-open text-success me-2";
        }
        if (text) {
            text.textContent = "Layout Unlocked";
        }
    }
}

function moveCardUp(cardId, event) {
    if (event) {
        event.stopPropagation();
    }
    const card = document.getElementById(cardId);
    if (card && card.previousElementSibling) {
        card.parentNode.insertBefore(card, card.previousElementSibling);
        saveCardOrder();
        updateTableOfContents();
    }
}

function moveCardDown(cardId, event) {
    if (event) {
        event.stopPropagation();
    }
    const card = document.getElementById(cardId);
    if (card && card.nextElementSibling) {
        card.parentNode.insertBefore(card.nextElementSibling, card);
        saveCardOrder();
        updateTableOfContents();
    }
}

function saveCardOrder() {
    const container = document.getElementById("cardsFlowContainer");
    if (!container) {
        return;
    }
    const ids = [];
    const children = container.querySelectorAll(":scope > .sheet-card");
    children.forEach(function (child) {
        ids.push(child.id);
    });
    localStorage.setItem("ship_card_order", JSON.stringify(ids));
}

function loadSavedCardOrder() {
    const saved = localStorage.getItem("ship_card_order");
    if (!saved) {
        return;
    }
    try {
        const ids = JSON.parse(saved);
        const container = document.getElementById("cardsFlowContainer");
        if (!container || !Array.isArray(ids)) {
            return;
        }
        ids.forEach(function (id) {
            const el = document.getElementById(id);
            if (el && el.parentNode === container) {
                container.appendChild(el);
            }
        });
    } catch (e) {
        console.warn("Could not load card order:", e);
    }
}

function resetCardLayoutOrder() {
    localStorage.removeItem("ship_card_order");
    window.location.reload();
}

// Drag & Drop Setup
function initDragAndDrop() {
    const container = document.getElementById("cardsFlowContainer");
    if (!container) {
        return;
    }
    const cards = container.querySelectorAll(":scope > .sheet-card");
    cards.forEach(function (card) {
        const handle = card.querySelector(".drag-handle");
        if (handle) {
            handle.addEventListener("mousedown", function () {
                card.setAttribute("draggable", "true");
            });
            handle.addEventListener("mouseup", function () {
                card.removeAttribute("draggable");
            });
        }
        card.addEventListener("dragstart", function () {
            draggedCardElement = card;
            card.classList.add("opacity-50");
        });
        card.addEventListener("dragend", function () {
            draggedCardElement = null;
            card.classList.remove("opacity-50");
            card.removeAttribute("draggable");
            saveCardOrder();
            updateTableOfContents();
        });
        card.addEventListener("dragover", function (e) {
            e.preventDefault();
            if (draggedCardElement && draggedCardElement !== card) {
                const rect = card.getBoundingClientRect();
                const mid = rect.top + rect.height / 2;
                if (e.clientY < mid) {
                    card.parentNode.insertBefore(draggedCardElement, card);
                } else {
                    card.parentNode.insertBefore(draggedCardElement, card.nextSibling);
                }
            }
        });
    });
}

// Auto Expand Textareas
function autoExpandTextarea(el) {
    if (!el) {
        return;
    }
    el.style.height = "auto";
    el.style.height = (el.scrollHeight) + "px";
}

// Datalist Dropdown Toggle Helper
function toggleDatalist(inputId) {
    const input = document.getElementById(inputId);
    if (!input) {
        return;
    }
    input.focus();
    if (typeof input.showPicker === "function") {
        try {
            input.showPicker();
            return;
        } catch (ignore) {}
    }
    // Fallback: trigger click / double click
    input.dispatchEvent(new Event("focus"));
}

// Reset Ship Sheet
function resetShipSheet() {
    if (window.confirm("Are you sure you want to reset all fields on the Ship Schematics Sheet?")) {
        const form = document.getElementById("shipSheetForm");
        if (form) {
            form.reset();
        }
        recalculateShipAttributes();
    }
}

// Export Ship Schematics as JSON
function exportShipJSON() {
    const dataObj = {};
    const inputs = document.querySelectorAll("#shipSheetForm input, #shipSheetForm select, #shipSheetForm textarea");
    inputs.forEach(function (inp) {
        if (inp.name || inp.id) {
            const key = inp.name || inp.id;
            let fieldVal = inp.value;
            if (inp.type === "checkbox") {
                fieldVal = inp.checked;
            }
            dataObj[key] = fieldVal;
        }
    });

    const rawName = getInputValue("shipNameInput", "Spaceship");
    const shipName = rawName.replace(/[^a-zA-Z0-9_]/g, "_");
    const jsonStr = JSON.stringify(dataObj, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = shipName + "_schematics.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Import Ship Schematics from JSON
function importShipJSON(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const imported = JSON.parse(e.target.result);
            Object.keys(imported).forEach(function (key) {
                const el = document.querySelector("[name='" + key + "'], #" + key);
                if (el) {
                    if (el.type === "checkbox") {
                        el.checked = imported[key];
                    } else {
                        el.value = imported[key];
                    }
                }
            });
            recalculateShipAttributes();
            alert("Ship schematics imported successfully!");
        } catch (err) {
            alert("Failed to parse JSON file: " + err.message);
        }
    };
    reader.readAsText(file);
}

// Global Window Bindings for HTML Handlers
window.addBayRow = addBayRow;
window.addHardPointRow = addHardPointRow;
window.addQuirkRow = addQuirkRow;
window.adjustRollAdvantage = adjustRollAdvantage;
window.autoExpandTextarea = autoExpandTextarea;
window.clearDiceHistory = clearDiceHistory;
window.collapseAllCards = collapseAllCards;
window.executeCurrentRoll = executeCurrentRoll;
window.expandAllCards = expandAllCards;
window.exportShipJSON = exportShipJSON;
window.importShipJSON = importShipJSON;
window.moveCardDown = moveCardDown;
window.moveCardUp = moveCardUp;
window.onAttributeScoreChange = onAttributeScoreChange;
window.onCaptainModChange = onCaptainModChange;
window.onCoreLevelChange = onCoreLevelChange;
window.onHullConfigChange = onHullConfigChange;
window.onHullSizeChange = onHullSizeChange;
window.onMedicalModChange = onMedicalModChange;
window.onQuirkSelect = onQuirkSelect;
window.onShieldsActiveToggle = onShieldsActiveToggle;
window.onShipClassTypeChange = onShipClassTypeChange;
window.onSpeciesMakeChange = onSpeciesMakeChange;
window.randomizeSpeciesTheme = randomizeSpeciesTheme;
window.recalculateShipAttributes = recalculateShipAttributes;
window.removeEntry = removeEntry;
window.renderDiceHistory = renderDiceHistory;
window.resetCardLayoutOrder = resetCardLayoutOrder;
window.resetShipSheet = resetShipSheet;
window.rollAttributeCheck = rollAttributeCheck;
window.rollInitiative = rollInitiative;
window.rollShipFunction = rollShipFunction;
window.scrollToCard = scrollToCard;
window.setDocumentTheme = setDocumentTheme;
window.syncSecondaryConfig = syncSecondaryConfig;
window.toggleCardLayoutLock = toggleCardLayoutLock;
window.toggleDatalist = toggleDatalist;
window.toggleNotesPrintVisibility = toggleNotesPrintVisibility;
window.toggleThemeLock = toggleThemeLock;

