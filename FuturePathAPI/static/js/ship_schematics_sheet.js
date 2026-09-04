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
    "Generic", "Human", "Volar", "Grayling", "Lepidonain", "Cryous", "Ovex",
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
        Description: "Old and antiquated; more likely to gain other quirks.",
        Name: "Out Dated",
        Negative: "Costs 25% less to buy; 50% less to sell. Permanent.",
        Positive: "Choose another quirk and ignore its negative effect.",
        description: "Old and antiquated; more likely to gain other quirks.",
        name: "Out Dated",
        negative: "Costs 25% less to buy; 50% less to sell. Permanent.",
        positive: "Choose another quirk and ignore its negative effect."
    },
    {
        Description: "Internal components require physical encouragement to function.",
        Name: "Cranky",
        Negative: "If the ship receives 2 Battle Damage in one round, roll for the second damage and add its effect (Base DC 7).",
        Positive: "None.",
        description: "Internal components require physical encouragement to function.",
        name: "Cranky",
        negative: "If the ship receives 2 Battle Damage in one round, roll for the second damage and add its effect (Base DC 7).",
        positive: "None."
    },
    {
        Description: "A 'pile of junk' with constant maintenance needs.",
        Name: "Falling Apart",
        Negative: "25% reduction in resale value. 20% daily chance of something breaking (1-10% Superficial, 11-80% Minor system/bay problem, 91-100% Major problem).",
        Positive: "Crew gains Advanced Jerry Rigging feat for repairs to this ship only.",
        description: "A 'pile of junk' with constant maintenance needs.",
        name: "Falling Apart",
        negative: "25% reduction in resale value. 20% daily chance of something breaking (1-10% Superficial, 11-80% Minor system/bay problem, 91-100% Major problem).",
        positive: "Crew gains Advanced Jerry Rigging feat for repairs to this ship only."
    },
    {
        Description: "Smelly, annoying space pests living off the ship systems.",
        Name: "Infested",
        Negative: "Daily CON save (DC 12) for all on board or become Nauseated (or Sickened). Engineers take -1 to repair checks.",
        Positive: "-10 Stealth for stowaways. Advantage to Comms when dealing with pirates/smugglers (who avoid the infestation).",
        description: "Smelly, annoying space pests living off the ship systems.",
        name: "Infested",
        negative: "Daily CON save (DC 12) for all on board or become Nauseated (or Sickened). Engineers take -1 to repair checks.",
        positive: "-10 Stealth for stowaways. Advantage to Comms when dealing with pirates/smugglers (who avoid the infestation)."
    },
    {
        Description: "The ship is 'wanted' in multiple systems due to previous owners.",
        Name: "Bad Past",
        Negative: "Disadvantage to Comms in specific situations. People may attack without provocation.",
        Positive: "50/50 chance a person recognizing the ship will be a friend or foe.",
        description: "The ship is 'wanted' in multiple systems due to previous owners.",
        name: "Bad Past",
        negative: "Disadvantage to Comms in specific situations. People may attack without provocation.",
        positive: "50/50 chance a person recognizing the ship will be a friend or foe."
    },
    {
        Description: "Fully aware AI computer linked to all systems (Highly Illegal).",
        Name: "Artificial Intelligence",
        Negative: "Illegal to sell through official markets. Harsh penalties from authorities.",
        Positive: "+1 to Sensors, Engines, and Electronics. The ship can drive itself.",
        description: "Fully aware AI computer linked to all systems (Highly Illegal).",
        name: "Artificial Intelligence",
        negative: "Illegal to sell through official markets. Harsh penalties from authorities.",
        positive: "+1 to Sensors, Engines, and Electronics. The ship can drive itself."
    },
    {
        Description: "Constant humming, whizzing, and jittering throughout the bulkheads.",
        Name: "Noisy",
        Negative: "-2 for all Boost function rolls.",
        Positive: "None.",
        description: "Constant humming, whizzing, and jittering throughout the bulkheads.",
        name: "Noisy",
        negative: "-2 for all Boost function rolls.",
        positive: "None."
    },
    {
        Description: "A hull that speaks a thousand words of past adventures and narrow escapes.",
        Name: "Battle Scars",
        Negative: "-1 to Detection DC and +1 to Repair DC for Battle Damage.",
        Positive: "Advantage to Comms when using Intimidate.",
        description: "A hull that speaks a thousand words of past adventures and narrow escapes.",
        name: "Battle Scars",
        negative: "-1 to Detection DC and +1 to Repair DC for Battle Damage.",
        positive: "Advantage to Comms when using Intimidate."
    },
    {
        Description: "The ship survives scraps and close calls it shouldn't.",
        Name: "Lucky",
        Negative: "None.",
        Positive: "Once per day, a player can reroll a check that uses one of the ship's Attribute modifiers.",
        description: "The ship survives scraps and close calls it shouldn't.",
        name: "Lucky",
        negative: "None.",
        positive: "Once per day, a player can reroll a check that uses one of the ship's Attribute modifiers."
    },
    {
        Description: "Things just seem to go wrong when you're aboard this vessel.",
        Name: "Cursed",
        Negative: "Once per day, negate the first Critical Success rolled for a ship-based attribute check.",
        Positive: "None.",
        description: "Things just seem to go wrong when you're aboard this vessel.",
        name: "Cursed",
        negative: "Once per day, negate the first Critical Success rolled for a ship-based attribute check.",
        positive: "None."
    },
    {
        Description: "Brand new design with manufacturer kinks not yet worked out.",
        Name: "Experimental",
        Negative: "Once per day, roll a d6 (1: Engines, 2: Weapons, 3: Structure, 4: Shields, 5: Electronics, 6: Sensors); attribute drops to 10 until repaired (DC 12 + Tech Level + Hull Size).",
        Positive: "If the Engineer critically succeeds on repair, bonus to that attribute score equal to their Intelligence modifier.",
        description: "Brand new design with manufacturer kinks not yet worked out.",
        name: "Experimental",
        negative: "Once per day, roll a d6 (1: Engines, 2: Weapons, 3: Structure, 4: Shields, 5: Electronics, 6: Sensors); attribute drops to 10 until repaired (DC 12 + Tech Level + Hull Size).",
        positive: "If the Engineer critically succeeds on repair, bonus to that attribute score equal to their Intelligence modifier."
    }
];

// Normalize size object from API or fallback
function normalizeSize(s) {
    if (!s) {
        return null;
    }
    const name = s.name || s.Name || "";
    let sizeMod = 0;
    if (s.size_modifier !== undefined) {
        sizeMod = s.size_modifier;
    } else if (s.SizeMod !== undefined) {
        sizeMod = s.SizeMod;
    }

    let detectDc = 10;
    if (s.detect_dc !== undefined) {
        detectDc = s.detect_dc;
    } else if (s.DetectionDC !== undefined) {
        detectDc = s.DetectionDC;
    }

    let bdCap = 0;
    if (s.battle_damage_capacity !== undefined) {
        bdCap = s.battle_damage_capacity;
    } else if (s.BattleDamageCapacity !== undefined) {
        bdCap = s.BattleDamageCapacity;
    }

    let trackingDc = 10;
    if (s.tracking_dc_bonus !== undefined) {
        trackingDc = s.tracking_dc_bonus;
    } else if (s.TrackingDC !== undefined) {
        trackingDc = s.TrackingDC;
    }

    let cargo = 0;
    if (s.cargo_capacity_units !== undefined) {
        cargo = s.cargo_capacity_units;
    } else if (s.CargoCapacity !== undefined) {
        cargo = s.CargoCapacity;
    }

    let passengers = 0;
    if (s.passenger_capacity !== undefined) {
        passengers = s.passenger_capacity;
    } else if (s.PassengerCapacity !== undefined) {
        passengers = s.PassengerCapacity;
    }

    let custBonus = 0;
    if (s.customization_points !== undefined) {
        custBonus = s.customization_points;
    } else if (s.CustBonus !== undefined) {
        custBonus = s.CustBonus;
    }

    let dimensions = "";
    if (s.dimensions) {
        dimensions = s.dimensions;
    } else if (s.AvgWeight && s.SqFt) {
        dimensions = s.SqFt + " / " + s.AvgWeight;
    } else if (s.AvgWeight) {
        dimensions = s.AvgWeight;
    }

    let hardPoints = "";
    if (s.hard_points) {
        hardPoints = s.hard_points;
    } else if (s.CivilianHardPoints !== undefined) {
        hardPoints = s.CivilianHardPoints + " / " + s.MilitaryHardPoints;
    }

    let bays = "";
    if (s.bays) {
        bays = s.bays;
    } else if (s.CivilianBays !== undefined) {
        bays = s.CivilianBays + " / " + s.MilitaryBays;
    }

    let weaponMax = "";
    if (s.weapon_size_max) {
        weaponMax = s.weapon_size_max;
    } else if (s.WeaponBaySize) {
        weaponMax = s.WeaponBaySize;
    }

    return {
        bays,
        battle_damage_capacity: bdCap,
        BattleDamageCapacity: bdCap,
        cargo_capacity_units: cargo,
        CargoCapacity: cargo,
        customization_points: custBonus,
        detect_dc: detectDc,
        DetectionDC: detectDc,
        dimensions,
        hard_points: hardPoints,
        name,
        Name: name,
        passenger_capacity: passengers,
        PassengerCapacity: passengers,
        size_modifier: sizeMod,
        SizeMod: sizeMod,
        tracking_dc_bonus: trackingDc,
        TrackingDC: trackingDc,
        weapon_size_max: weaponMax
    };
}

// State Variables
let shipData = {
    configurations: FALLBACK_HULL_CONFIGS,
    ftlDrives: FALLBACK_FTL_DRIVES,
    hullSizes: FALLBACK_HULL_SIZES.map(normalizeSize),
    quirks: FALLBACK_QUIRKS,
    species: FALLBACK_SPECIES
};

let hardPointRowsCount = 0;
let bayRowsCount = 0;
let quirkRowsCount = 0;
let diceRollHistory = [];
let currentRollAction = "Check";
let currentRollBonus = 0;
let currentRollSkillDie = "";
let currentAdvantage = 0;
let currentRollMode = "conflict";
let currentDamageDiceCount = 4;
let draggedCardElement = null;

const skillDieLevels = [
    "d2", "2d2", "2d2+1", "d4+d2+1", "2d4+1", "2d4+2", "d6+d4+2", "2d6+2",
    "2d6+3", "d8+d6+3", "2d8+3", "2d8+4", "d10+d8+4", "2d10+4", "2d10+5",
    "d12+d10+5", "2d12+5", "2d12+6", "2d6+d12+7", "4d6+8"
];

function onPilotRankChange(rankVal) {
    const rankNum = parseInt(rankVal, 10);
    const dieEl = document.getElementById("helmOfficerPilotDie");
    if (dieEl) {
        if (!Number.isNaN(rankNum) && rankNum >= 1) {
            const idx = Math.min(rankNum - 1, skillDieLevels.length - 1);
            dieEl.value = skillDieLevels[idx];
        } else {
            dieEl.value = "";
        }
    }
    recalculateShipAttributes();
}

function onEngineerRankChange(type, rankVal) {
    const rankNum = parseInt(rankVal, 10);
    let dieId = "engineerSecondarySkillDie";
    if (type === "structure") {
        dieId = "engineerCraftStructureDie";
    }
    const dieEl = document.getElementById(dieId);
    if (dieEl) {
        if (!Number.isNaN(rankNum) && rankNum >= 1) {
            const idx = Math.min(rankNum - 1, skillDieLevels.length - 1);
            dieEl.value = skillDieLevels[idx];
        } else {
            dieEl.value = "";
        }
    }
    recalculateShipAttributes();
}

function onMedicalRankChange(rankVal) {
    const rankNum = parseInt(rankVal, 10);
    const dieEl = document.getElementById("medicalOfficerSkillDie");
    if (dieEl) {
        if (!Number.isNaN(rankNum) && rankNum >= 1) {
            const idx = Math.min(rankNum - 1, skillDieLevels.length - 1);
            dieEl.value = skillDieLevels[idx];
        } else {
            dieEl.value = "";
        }
    }
    recalculateShipAttributes();
}

function onShieldsSkillRankChange(type, rankVal) {
    const rankNum = parseInt(rankVal, 10);
    let dieId = "shieldsSkillKnowledgeScienceDie";
    if (type === "acrobatics") {
        dieId = "shieldsSkillAcrobaticsDie";
    }
    const dieEl = document.getElementById(dieId);
    if (dieEl) {
        if (!Number.isNaN(rankNum) && rankNum >= 1) {
            const idx = Math.min(rankNum - 1, skillDieLevels.length - 1);
            dieEl.value = skillDieLevels[idx];
        } else {
            dieEl.value = "";
        }
    }
    recalculateShipAttributes();
}

function onEngineerSecondarySkillChange(select) {
    const btn = document.getElementById("engineerSecondarySkillRollBtn");
    let skillName = "Craft Electronic";
    if (select && select.value) {
        skillName = select.value;
    }
    if (btn) {
        btn.setAttribute("title", "Roll " + skillName + " (2d10)");
    }
    recalculateShipAttributes();
}

function onCommsFunctionAbilityChange(select) {
    if (select) {
        select.classList.remove("text-ability-int", "text-ability-wis", "text-ability-cha");
        if (select.value === "INT") {
            select.classList.add("text-ability-int");
        } else if (select.value === "WIS") {
            select.classList.add("text-ability-wis");
        } else if (select.value === "CHA") {
            select.classList.add("text-ability-cha");
        }
    }
    recalculateShipAttributes();
}

function rollDiceExpression(expr) {
    if (!expr || typeof expr !== "string") {
        return { bonus: 0, rolls: [], total: 0 };
    }
    const clean = expr.replace(/\s+/g, "");
    const parts = clean.split("+");
    let total = 0;
    const rolls = [];
    let bonus = 0;
    parts.forEach(function (p) {
        if (!p) {
            return;
        }
        const match = p.match(/^(\d*)d(\d+)$/i);
        if (match) {
            let count = 1;
            if (match[1]) {
                count = parseInt(match[1], 10);
            }
            const sides = parseInt(match[2], 10);
            for (let i = 0; i < count; i += 1) {
                const r = Math.floor(Math.random() * sides) + 1;
                rolls.push({ die: "d" + sides, val: r });
                total += r;
            }
        } else {
            const num = parseInt(p, 10);
            if (!Number.isNaN(num)) {
                bonus += num;
                total += num;
            }
        }
    });
    return { bonus, rolls, total };
}

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", function () {
    loadSavedCardOrder();
    loadLayoutLockState();
    loadNotesPrintState();
    applyTheme();
    setupCollapseInteractions();
    restoreCollapseStates();
    populateReferenceDatalists();
    fetchSpaceshipReferenceData();
    initializeDefaultRows();
    recalculateShipAttributes();
    updateTableOfContents();
    initDragAndDrop();
});

// Fetch Reference Data from Backend
function fetchSpaceshipReferenceData() {
    fetch("/v1/tasks/ship_schematics_sheet/all")
        .then(function (response) {
            if (!response.ok) {
                return fetch("/v1/data/all_spaceship_reference_data").then(function (fallbackResp) {
                    if (!fallbackResp.ok) {
                        throw new Error("HTTP error " + fallbackResp.status);
                    }
                    return fallbackResp.json();
                });
            }
            return response.json();
        })
        .then(function (data) {
            if (data.hull_sizes && Array.isArray(data.hull_sizes)) {
                shipData.hullSizes = data.hull_sizes.map(normalizeSize);
            }
            if (data.hull_configurations && Array.isArray(data.hull_configurations)) {
                shipData.configurations = data.hull_configurations.map(function (c) {
                    if (typeof c === "string") {
                        return c;
                    }
                    return c.name || c.Name || "";
                }).filter(Boolean);
            }
            if (data.quirks && Array.isArray(data.quirks)) {
                shipData.quirks = data.quirks.map(function (q) {
                    if (typeof q === "string") {
                        return { description: "", Description: "", name: q, Name: q, negative: "", Negative: "", positive: "", Positive: "" };
                    }
                    const qName = q.name || q.Name || "";
                    const desc = q.description || q.Description || "";
                    const pos = q.positive || q.Positive || "";
                    const neg = q.negative || q.Negative || "";
                    return {
                        description: desc,
                        Description: desc,
                        name: qName,
                        Name: qName,
                        negative: neg,
                        Negative: neg,
                        positive: pos,
                        Positive: pos
                    };
                });
            }
            if (data.ftl_drives && Array.isArray(data.ftl_drives)) {
                shipData.ftlDrives = data.ftl_drives.map(function (f) {
                    if (typeof f === "string") {
                        return f;
                    }
                    return f.name || f.Name || "";
                }).filter(Boolean);
            }
            if (data.species && Array.isArray(data.species)) {
                const fetchedSpecies = data.species.map(function (sp) {
                    if (typeof sp === "string") {
                        return sp;
                    }
                    return sp.name || sp.Name || "";
                }).filter(Boolean);
                if (!fetchedSpecies.includes("Generic")) {
                    fetchedSpecies.unshift("Generic");
                }
                shipData.species = fetchedSpecies;
            }
            populateReferenceDatalists();
            buildThemeModals();
            recalculateShipAttributes();
        })
        .catch(function (err) {
            console.warn("Could not fetch remote reference data, using fallbacks:", err);
            populateReferenceDatalists();
            buildThemeModals();
        });
}

// Populate HTML Datalists
function populateReferenceDatalists() {
    populateDatalist("hullSizesDatalist", shipData.hullSizes);
    populateDatalist("hullConfigDatalist", shipData.configurations);
    populateDatalist("ftlDriveDatalist", shipData.ftlDrives);
    populateDatalist("speciesMakeDatalist", shipData.species);
    populateDatalist("quirksDatalist", shipData.quirks);
}

function populateDatalist(elementId, items) {
    const el = document.getElementById(elementId);
    if (!el || !items) {
        return;
    }
    el.innerHTML = "";
    items.forEach(function (item) {
        const opt = document.createElement("option");
        let val = "";
        if (typeof item === "string") {
            val = item;
        } else if (item.name) {
            val = item.name;
        } else if (item.Name) {
            val = item.Name;
        }
        if (val) {
            opt.value = val;
            el.appendChild(opt);
        }
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

// Update Hull Description in Secondary Ship Attributes
function updateHullDescription() {
    const sizeInput = document.getElementById("hullSizeInput");
    const classSelect = document.getElementById("shipClassTypeSelect");
    const configInput = document.getElementById("hullConfigInput");
    const speciesInput = document.getElementById("speciesMakeInput");
    const descInput = document.getElementById("secHullDescInput") || document.getElementById("secHullConfigInput");
    if (!descInput) {
        return;
    }

    let sizeVal = "";
    if (sizeInput && sizeInput.value) {
        sizeVal = sizeInput.value.trim();
    }

    let classVal = "";
    if (classSelect && classSelect.value) {
        classVal = classSelect.value.trim().replace(/\s*craft\s*/i, "").trim();
    }

    let configVal = "";
    if (configInput && configInput.value) {
        configVal = configInput.value.trim();
    }

    let speciesVal = "";
    if (speciesInput && speciesInput.value) {
        speciesVal = speciesInput.value.trim().replace(/\s*make\s*$/i, "").trim();
    }

    const parts = [];
    if (sizeVal) {
        parts.push(sizeVal);
    }
    if (classVal) {
        parts.push(classVal);
    }
    if (configVal) {
        parts.push(configVal);
    }

    let desc = parts.join(" ");
    if (speciesVal) {
        const speciesDesc = "(of " + speciesVal + " Make)";
        if (desc) {
            desc += " " + speciesDesc;
        } else {
            desc = speciesDesc;
        }
    }

    descInput.value = desc;
}

function onHullConfigChange(val) {
    if (val !== undefined) {
        const configInput = document.getElementById("hullConfigInput");
        if (configInput && configInput.value !== val) {
            configInput.value = val;
        }
    }
    updateHullDescription();
}

function syncSecondaryConfig(val) {
    const mainConfig = document.getElementById("hullConfigInput");
    if (mainConfig && val) {
        mainConfig.value = val;
    }
    updateHullDescription();
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

    // 3. Tactical Mobility: Engines Modifier + Helm Officer Dex Mod + Helm Officer Misc Mod
    const helmPilotDex = getInputNumber("helmOfficerPilotDexMod", 0);
    const helmPilotMisc = getInputNumber("helmOfficerPilotMiscMod", 0);
    const tacticalMobility = enginesMod + helmPilotDex + helmPilotMisc;
    setElementValue("tacticalMobilityDisplay", formatModifier(tacticalMobility));

    // 4. Tracking DC: 10 + ((Tactical Mobility + Shields Mod) +/- Size Mod) - Structure Mod
    const trackingDc = 10 + (tacticalMobility + shieldsMod + sizeMod) - structureMod;
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
    const woMod = getInputNumber("weaponsOfficerMod", 0);
    const repairDcBonus = weaponsMod + woMod;
    setElementValue("repairDcBonusDisplay", formatModifier(repairDcBonus));
    syncWeaponsOfficerAbilityTheme();

    // Sub-badges in cards
    setElementText("enginesTacMobDisplay", formatModifier(tacticalMobility));
    setElementText("enginesTrackingBonusDisplay", formatModifier(tacticalMobility));
    setElementText("weaponsRerollBonusDisplay", formatModifier(weaponsMod));
    setElementText("weaponsRepairDcDisplay", formatModifier(repairDcBonus));
    setElementText("structureArmorBonusDisplay", 4 + structureMod);
    let initPenaltyTxt = "-0";
    if (structureMod > 0) {
        initPenaltyTxt = "-" + structureMod;
    } else if (structureMod < 0) {
        initPenaltyTxt = "+" + Math.abs(structureMod);
    }
    setElementText("structureInitPenaltyDisplay", initPenaltyTxt);
    setElementText("shieldsReflectorDisplay", 4 + shieldsMod);
    setElementText("shieldsDetectPenaltyDisplay", "-" + shieldPenalty);
    setElementText("sensorsPassiveDisplay", passiveSensors);
    setElementText("sensorsInitBonusDisplay", formatModifier(sensorsMod));
    setElementText("electronicsStealthBonusDisplay", formatModifier(electronicsMod));

    // Recalculate Ship Functions
    recalculateFunctions(enginesMod, weaponsMod, structureMod, shieldsMod, sensorsMod, electronicsMod);

    // Update Hull Description
    updateHullDescription();
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
    const pilotRank = getInputNumber("helmOfficerPilotRank", 0);
    const dieEl = document.getElementById("helmOfficerPilotDie");
    if (dieEl && !dieEl.value && pilotRank >= 1) {
        const idx = Math.min(pilotRank - 1, skillDieLevels.length - 1);
        dieEl.value = skillDieLevels[idx];
    }
    const engStrRank = getInputNumber("engineerCraftStructureRank", 0);
    const engStrDieEl = document.getElementById("engineerCraftStructureDie");
    if (engStrDieEl && !engStrDieEl.value && engStrRank >= 1) {
        const idx = Math.min(engStrRank - 1, skillDieLevels.length - 1);
        engStrDieEl.value = skillDieLevels[idx];
    }
    const engSecRank = getInputNumber("engineerSecondarySkillRank", 0);
    const engSecDieEl = document.getElementById("engineerSecondarySkillDie");
    if (engSecDieEl && !engSecDieEl.value && engSecRank >= 1) {
        const idx = Math.min(engSecRank - 1, skillDieLevels.length - 1);
        engSecDieEl.value = skillDieLevels[idx];
    }
    const medRank = getInputNumber("medicalOfficerSkillRank", 0);
    const medDieEl = document.getElementById("medicalOfficerSkillDie");
    if (medDieEl && !medDieEl.value && medRank >= 1) {
        const idx = Math.min(medRank - 1, skillDieLevels.length - 1);
        medDieEl.value = skillDieLevels[idx];
    }
    const ksRank = getInputNumber("shieldsSkillKnowledgeScienceRank", 0);
    const ksDieEl = document.getElementById("shieldsSkillKnowledgeScienceDie");
    if (ksDieEl && !ksDieEl.value && ksRank >= 1) {
        const idx = Math.min(ksRank - 1, skillDieLevels.length - 1);
        ksDieEl.value = skillDieLevels[idx];
    }
    const acroRank = getInputNumber("shieldsSkillAcrobaticsRank", 0);
    const acroDieEl = document.getElementById("shieldsSkillAcrobaticsDie");
    if (acroDieEl && !acroDieEl.value && acroRank >= 1) {
        const idx = Math.min(acroRank - 1, skillDieLevels.length - 1);
        acroDieEl.value = skillDieLevels[idx];
    }
    const wpnOffMod = getInputNumber("weaponsOfficerMod", 0);
    const engCraftMod = getInputNumber("engineerOfficerCraftMod", 0);
    const commsIntMod = getInputNumber("commsOfficerIntMod", 0);
    const commsWisMod = getInputNumber("commsOfficerWisMod", 0);
    const commsChaMod = getInputNumber("commsOfficerChaMod", 0);
    const sciMod = getInputNumber("scienceOfficerMod", 0);
    const capMod = getInputNumber("captainCharismaMod", 0);

    // Helm Functions: Combination of Engines Modifier and Function Misc
    setElementValue("funcTotal_flyOffDef", formatModifier(engMod + getInputNumber("funcMisc_flyOffDef", 0)));
    setElementValue("funcTotal_closeWiden", formatModifier(engMod + getInputNumber("funcMisc_closeWiden", 0)));
    setElementValue("funcTotal_pursueIntercept", formatModifier(engMod + getInputNumber("funcMisc_pursueIntercept", 0)));
    setElementValue("funcTotal_ram", formatModifier(engMod + getInputNumber("funcMisc_ram", 0)));
    setElementValue("funcTotal_evasiveThrusters", formatModifier(engMod + getInputNumber("funcMisc_evasiveThrusters", 0)));
    setElementValue("funcTotal_feint", formatModifier(engMod + getInputNumber("funcMisc_feint", 0)));
    setElementValue("funcTotal_grappleEngines", formatModifier(engMod + getInputNumber("funcMisc_grappleEngines", 0)));

    // Weapons Functions
    setElementValue("funcTotal_fire", formatModifier(wpnMod + wpnOffMod + getInputNumber("funcMisc_fire", 0)));
    setElementValue("funcTotal_bombard", formatModifier(wpnMod + wpnOffMod + getInputNumber("funcMisc_bombard", 0)));
    setElementValue("funcTotal_concentratedFire", formatModifier(wpnMod + wpnOffMod + getInputNumber("funcMisc_concentratedFire", 0)));
    setElementValue("funcTotal_defensiveFire", formatModifier(wpnMod + wpnOffMod + getInputNumber("funcMisc_defensiveFire", 0)));

    // Engineer Functions
    setElementValue("funcTotal_repair", formatModifier(strMod + getInputNumber("funcMisc_repair", 0)));
    setElementValue("funcTotal_boostEngines", formatModifier(strMod + getInputNumber("funcMisc_boostEngines", 0)));
    setElementValue("funcTotal_counterHackEng", formatModifier(elcMod + getInputNumber("funcMisc_counterHackEng", 0)));
    setElementValue("funcTotal_overclockCore", formatModifier(strMod + getInputNumber("funcMisc_overclockCore", 0)));
    setElementValue("funcTotal_cloakEng", formatModifier(elcMod + getInputNumber("funcMisc_cloakEng", 0)));

    // Sync Chief Engineer Int Mod into Craft skills table
    setElementValue("engineerCraftStructureIntMod", engCraftMod);
    setElementValue("engineerSecondarySkillIntMod", engCraftMod);

    // All Crew Functions (under Shields card)
    setElementValue("funcTotal_changePosition", formatModifier(getInputNumber("funcMisc_changePosition", 0)));
    setElementValue("funcTotal_beam", formatModifier(getInputNumber("funcMisc_beam", 0)));
    setElementValue("funcTotal_shieldModulation", formatModifier(shdMod + getInputNumber("funcMisc_shieldModulation", 0)));

    // Sensors / Comms Functions
    function getCommsChoiceMod(selectId, defaultAbility) {
        const sel = document.getElementById(selectId);
        let ab = defaultAbility;
        if (sel && sel.value) {
            ab = sel.value;
        }
        if (ab === "INT") {
            return commsIntMod;
        }
        if (ab === "CHA") {
            return commsChaMod;
        }
        return commsWisMod;
    }

    const scanOfficerMod = getCommsChoiceMod("funcAbility_scan", "WIS");
    const spoofOfficerMod = getCommsChoiceMod("funcAbility_spoofing", "INT");
    const cryptoOfficerMod = getCommsChoiceMod("funcAbility_cryptoComms", "WIS");
    const jamOfficerMod = getCommsChoiceMod("funcAbility_jamComms", "WIS");

    // Scan: Ship's Sensors Mod + Misc + Officer's Wis/Cha
    setElementValue("funcTotal_scan", formatModifier(snsMod + scanOfficerMod + getInputNumber("funcMisc_scan", 0)));
    // Hack: Duplicate check using Ship's Electronics Mod + Misc + Officer's Int Mod
    setElementValue("funcTotal_hackComms", formatModifier(elcMod + commsIntMod + getInputNumber("funcMisc_hackComms", 0)));
    // Spoof: Utilizes BOTH Ship's Sensors AND Electronics Mods + Misc + Officer's Int/Cha
    setElementValue("funcTotal_spoofing", formatModifier(snsMod + elcMod + spoofOfficerMod + getInputNumber("funcMisc_spoofing", 0)));
    // Crypto: Ship's Sensors Mod + Misc + Officer's Wis/Cha
    setElementValue("funcTotal_cryptoComms", formatModifier(snsMod + cryptoOfficerMod + getInputNumber("funcMisc_cryptoComms", 0)));
    // Jam: Ship's Sensors Mod + Misc + Officer's Wis/Cha
    setElementValue("funcTotal_jamComms", formatModifier(snsMod + jamOfficerMod + getInputNumber("funcMisc_jamComms", 0)));

    // Science Functions
    setElementValue("funcTotal_boostSci", formatModifier(sciMod + getInputNumber("funcMisc_boostSci", 0)));
    setElementValue("funcTotal_hackSci", formatModifier(elcMod + sciMod + getInputNumber("funcMisc_hackSci", 0)));
    setElementValue("funcTotal_cloakSci", formatModifier(elcMod + sciMod + getInputNumber("funcMisc_cloakSci", 0)));
    setElementValue("funcTotal_cryptoSci", formatModifier(elcMod + sciMod + getInputNumber("funcMisc_cryptoSci", 0)));

    // Captain Functions
    setElementValue("funcTotal_giveCommand", formatModifier(capMod + getInputNumber("funcMisc_giveCommand", 0)));
    setElementValue("funcTotal_encourageCrew", formatModifier(capMod + getInputNumber("funcMisc_encourageCrew", 0)));
    setElementValue("funcTotal_commandingPresence", formatModifier(capMod + getInputNumber("funcMisc_commandingPresence", 0)));
    setElementValue("funcTotal_directAssistance", formatModifier(capMod + getInputNumber("funcMisc_directAssistance", 0)));

    // Medical Functions
    setElementValue("funcTotal_medical", formatModifier(getInputNumber("funcMisc_medical", 0)));
    setElementValue("funcTotal_resuscitation", formatModifier(getInputNumber("funcMisc_resuscitation", 0)));
    setElementValue("funcTotal_automatedCare", formatModifier(getInputNumber("funcMisc_automatedCare", 0)));
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

function syncWeaponsOfficerAbilityTheme() {
    const select = document.getElementById("weaponsOfficerAbilitySelect");
    let val = "DEX";
    if (select && select.value) {
        val = select.value.toUpperCase();
    }
    const modInput = document.getElementById("weaponsOfficerMod");
    const themeDisplay = document.getElementById("repairDcAbilityThemeDisplay");

    ["dex", "wis"].forEach(function (ab) {
        if (select) {
            select.classList.remove("text-ability-" + ab);
        }
        if (modInput) {
            modInput.classList.remove("text-ability-" + ab);
        }
        if (themeDisplay) {
            themeDisplay.classList.remove("text-ability-" + ab);
        }
    });

    const abClass = "text-ability-" + val.toLowerCase();
    if (select) {
        select.classList.add(abClass);
    }
    if (modInput) {
        modInput.classList.add(abClass);
    }
    if (themeDisplay) {
        themeDisplay.value = val;
        themeDisplay.classList.add(abClass);
    }
}

function onWeaponsOfficerAbilityChange(select) {
    if (select) {
        syncWeaponsOfficerAbilityTheme();
    }
    recalculateShipAttributes();
}

function getAvailableHardPoints() {
    const entries = document.querySelectorAll(".hardpoint-entry");
    if (entries && entries.length > 0) {
        return entries.length;
    }
    const hpInput = document.getElementById("hardPointsBaysSlotsInput");
    if (hpInput && hpInput.value) {
        const match = hpInput.value.match(/(\d+)\s*HP/i);
        if (match) {
            const parsed = parseInt(match[1], 10);
            if (!Number.isNaN(parsed) && parsed > 0) {
                return parsed;
            }
        }
    }
    return 4;
}

// 2d10 Space Conflict Dice Roller
function formatCompactDiceExpression(skillDie, flatBonus) {
    const diceParts = ["2d10"];
    let totalFlat = flatBonus || 0;

    if (skillDie && typeof skillDie === "string") {
        const clean = skillDie.replace(/\s+/g, "");
        const parts = clean.split("+");
        parts.forEach(function (p) {
            if (!p) {
                return;
            }
            if (p.includes("d")) {
                diceParts.push(p);
            } else {
                const num = parseInt(p, 10);
                if (!Number.isNaN(num)) {
                    totalFlat += num;
                }
            }
        });
    }

    let expr = diceParts.join("+");
    if (totalFlat > 0) {
        expr += "+" + totalFlat;
    } else if (totalFlat < 0) {
        expr += totalFlat;
    }
    return "Dice: " + expr;
}

function toggleRollExplanation() {
    const el = document.getElementById("rollActionExplanationContainer");
    if (el) {
        el.classList.toggle("d-none");
    }
}

// 2d10 Space Conflict Dice Roller
function rollAttributeCheck(attrName) {
    const attrKey = attrName.toLowerCase();
    if (attrKey === "weapons") {
        rollWeaponsDamage("Weapons Attack");
        return;
    }
    if (attrKey === "captain") {
        const chaMod = getInputNumber("captainCharismaMod", 0);
        const expl = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
            "<div>&bull; <strong>Captain Charisma Mod:</strong> " + formatModifier(chaMod) + "</div>" +
            "<div>&bull; <strong>Total Modifier:</strong> " + formatModifier(chaMod) + "</div>";
        openRollModal("Captain Leadership", chaMod, "captain", "", expl);
        return;
    }
    if (attrKey === "medical") {
        rollMedicalSkillCheck();
        return;
    }
    const scoreVal = getInputNumber(attrKey + "ScoreInput", 10);
    const mod = getScoreModifier(scoreVal);
    const expl = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
        "<div>&bull; <strong>" + attrName + " Score:</strong> " + scoreVal + " (Modifier: " + formatModifier(mod) + ")</div>" +
        "<div>&bull; <strong>Total Modifier:</strong> " + formatModifier(mod) + "</div>";
    openRollModal(attrName + " Check", mod, attrKey, "", expl);
}

function rollWeaponsDamage(actionTitle) {
    const title = actionTitle || "Weapons Attack";
    const wpnMod = getScoreModifier(getInputNumber("weaponsScoreInput", 10));
    const hp = getAvailableHardPoints();
    const expl = "<div>&bull; <strong>Damage Roll:</strong> Dependent on Active Weapon Hard Points (Default: " + hp + " d10)</div>" +
        "<div>&bull; <strong>Weapons Modifier:</strong> " + formatModifier(wpnMod) + "</div>";
    openDamageRollModal(title, wpnMod, expl);
}

const helmFunctionIdMap = {
    "Close / Widen Dist.": "funcTotal_closeWiden",
    "Close/Widen Dist.": "funcTotal_closeWiden",
    "Close/Widen Distance": "funcTotal_closeWiden",
    "Emerg. Thrusters": "funcTotal_evasiveThrusters",
    "Emergency Evasive Thrusters": "funcTotal_evasiveThrusters",
    "Feint": "funcTotal_feint",
    "Fly Off./Def.": "funcTotal_flyOffDef",
    "Fly Offensively/Defensively": "funcTotal_flyOffDef",
    "Grapple": "funcTotal_grappleEngines",
    "Pursue / Intercept": "funcTotal_pursueIntercept",
    "Pursue/Intercept": "funcTotal_pursueIntercept",
    "Ram": "funcTotal_ram"
};

const structureFunctionIdMap = {
    "Boost (Engines)": "funcTotal_boostEngines",
    "Cloak": "funcTotal_cloakEng",
    "Counter Hack": "funcTotal_counterHackEng",
    "Overclock Core": "funcTotal_overclockCore",
    "Repair": "funcTotal_repair"
};

const sensorsFunctionIdMap = {
    "Crypto": "funcTotal_cryptoComms",
    "Hack / Counter Hack (Sensors)": "funcTotal_hackComms",
    "Jam": "funcTotal_jamComms",
    "Scan": "funcTotal_scan",
    "Sensor Spoofing / Decoy Projection": "funcTotal_spoofing"
};

const electronicsFunctionIdMap = {
    "Boost": "funcTotal_boostSci",
    "Boost (Systems)": "funcTotal_boostSci",
    "Cloak": "funcTotal_cloakSci",
    "Crypto": "funcTotal_cryptoSci",
    "Hack": "funcTotal_hackSci",
    "Hack / Counter Hack": "funcTotal_hackSci",
    "Hack / Counter Hack (Electronics)": "funcTotal_hackSci"
};

const captainFunctionIdMap = {
    "Commanding Pres.": "funcTotal_commandingPresence",
    "Commanding Presence": "funcTotal_commandingPresence",
    "Direct Assistance": "funcTotal_directAssistance",
    "Encourage Crew": "funcTotal_encourageCrew",
    "Give Command": "funcTotal_giveCommand"
};

const medicalFunctionIdMap = {
    "Automated Care": "funcTotal_automatedCare",
    "Automated Medical Care": "funcTotal_automatedCare",
    "Medical": "funcTotal_medical",
    "Resuscitation": "funcTotal_resuscitation",
    "Resuscitation / Life Support": "funcTotal_resuscitation"
};

const shieldsFunctionIdMap = {
    "Beam": "funcTotal_beam",
    "Change Position": "funcTotal_changePosition",
    "Shield Modulation": "funcTotal_shieldModulation",
    "Shield Modulation / Rebalance": "funcTotal_shieldModulation"
};

let currentRollHelmBreakdown = null;
let currentRollEngineerBreakdown = null;
let currentRollCommsBreakdown = null;
let currentRollScienceBreakdown = null;
let currentRollCaptainBreakdown = null;
let currentRollMedicalBreakdown = null;
let currentRollShieldsBreakdown = null;

function rollShipFunction(funcName, attrKey, explicitBonus, btnEl) {
    let bonus = explicitBonus;
    let targetRow = null;

    if (btnEl && btnEl.closest) {
        targetRow = btnEl.closest(".function-row");
    }

    if (!targetRow) {
        const buttons = document.querySelectorAll(".roll-icon-btn");
        for (let i = 0; i < buttons.length; i += 1) {
            const oc = buttons[i].getAttribute("onclick") || "";
            if (oc.includes("'" + funcName + "'") || oc.includes("\"" + funcName + "\"")) {
                targetRow = buttons[i].closest(".function-row");
                break;
            }
        }
    }

    if (!targetRow) {
        const rows = document.querySelectorAll(".function-row");
        for (let j = 0; j < rows.length; j += 1) {
            if (rows[j].textContent.includes(funcName)) {
                targetRow = rows[j];
                break;
            }
        }
    }

    let funcTotal = 0;
    if (attrKey === "engines" && helmFunctionIdMap[funcName]) {
        const totalEl = document.getElementById(helmFunctionIdMap[funcName]);
        if (totalEl) {
            funcTotal = parseInt(totalEl.value, 10) || 0;
        }
    } else if (attrKey === "structure" && structureFunctionIdMap[funcName]) {
        const totalEl = document.getElementById(structureFunctionIdMap[funcName]);
        if (totalEl) {
            funcTotal = parseInt(totalEl.value, 10) || 0;
        }
    } else if (attrKey === "sensors" && sensorsFunctionIdMap[funcName]) {
        const totalEl = document.getElementById(sensorsFunctionIdMap[funcName]);
        if (totalEl) {
            funcTotal = parseInt(totalEl.value, 10) || 0;
        }
    } else if (attrKey === "electronics" && electronicsFunctionIdMap[funcName]) {
        const totalEl = document.getElementById(electronicsFunctionIdMap[funcName]);
        if (totalEl) {
            funcTotal = parseInt(totalEl.value, 10) || 0;
        }
    } else if (attrKey === "captain" && captainFunctionIdMap[funcName]) {
        const totalEl = document.getElementById(captainFunctionIdMap[funcName]);
        if (totalEl) {
            funcTotal = parseInt(totalEl.value, 10) || 0;
        }
    } else if (attrKey === "medical" && medicalFunctionIdMap[funcName]) {
        const totalEl = document.getElementById(medicalFunctionIdMap[funcName]);
        if (totalEl) {
            funcTotal = parseInt(totalEl.value, 10) || 0;
        }
    } else if (attrKey === "shields" && shieldsFunctionIdMap[funcName]) {
        const totalEl = document.getElementById(shieldsFunctionIdMap[funcName]);
        if (totalEl) {
            funcTotal = parseInt(totalEl.value, 10) || 0;
        }
    } else if (targetRow) {
        const totalField = targetRow.querySelector(".function-total-field");
        if (totalField) {
            funcTotal = parseInt(totalField.value, 10) || 0;
        }
    }

    if (bonus === 0) {
        bonus = funcTotal;
    }

    if (attrKey === "weapons") {
        const hp = getAvailableHardPoints();
        const expl = "<div>&bull; <strong>Damage Roll:</strong> Dependent on Active Weapon Hard Points (Default: " + hp + " d10)</div>" +
            "<div>&bull; <strong>Function Total:</strong> " + formatModifier(funcTotal) + "</div>";
        openDamageRollModal(funcName, funcTotal, expl);
        return;
    }

    let skillDie = "";
    let explanationHtml = "";
    let warningText = "";
    currentRollHelmBreakdown = null;
    currentRollEngineerBreakdown = null;
    currentRollCommsBreakdown = null;
    currentRollScienceBreakdown = null;
    currentRollCaptainBreakdown = null;
    currentRollMedicalBreakdown = null;
    currentRollShieldsBreakdown = null;

    if (attrKey === "engines") {
        // Pilot Skill Die from Helm Officer's Position & Officer section
        const dieEl = document.getElementById("helmOfficerPilotDie");
        if (dieEl) {
            skillDie = dieEl.value.trim();
        }

        // Key Ability (Dex) and Skill Misc from Helm Officer's Position & Officer section
        const pilotDex = getInputNumber("helmOfficerPilotDexMod", 0);
        const pilotMisc = getInputNumber("helmOfficerPilotMiscMod", 0);
        const pilotCheckMod = pilotDex + pilotMisc;

        // Total flat roll bonus = Key Ability (Dex) + Skill Misc + Function Total Value (Engines Mod + Function Misc)
        bonus = pilotCheckMod + funcTotal;

        const engMod = getScoreModifier(getInputNumber("enginesScoreInput", 10));
        const funcMisc = funcTotal - engMod;

        explanationHtml = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
            "<div>&bull; <strong>Pilot Skill Die:</strong> " + (skillDie || "None (Untrained)") + " (from Helm Officer Pilot Rank)</div>" +
            "<div>&bull; <strong>Key Ability (Dex):</strong> " + formatModifier(pilotDex) + "</div>" +
            "<div>&bull; <strong>Skill Misc:</strong> " + formatModifier(pilotMisc) + "</div>" +
            "<div>&bull; <strong>Function Total:</strong> " + formatModifier(funcTotal) + " [Engines Mod (" + formatModifier(engMod) + ") + Function Misc (" + formatModifier(funcMisc) + ")]</div>" +
            "<div>&bull; <strong>Combined Flat Modifier:</strong> " + formatModifier(bonus) + "</div>";

        currentRollHelmBreakdown = {
            funcTotal,
            pilotCheckMod,
            pilotDex,
            pilotMisc
        };
    } else if (attrKey === "structure") {
        const engInt = getInputNumber("engineerOfficerCraftMod", 0);
        const strMod = getScoreModifier(getInputNumber("structureScoreInput", 10));
        const elcMod = getScoreModifier(getInputNumber("electronicsScoreInput", 10));
        let baseAttrMod = strMod;
        let baseAttrLabel = "Structure Mod";
        if (funcName === "Counter Hack" || funcName === "Cloak") {
            baseAttrMod = elcMod;
            baseAttrLabel = "Electronics Mod";
        }
        const funcMisc = funcTotal - baseAttrMod;

        if (funcName === "Repair") {
            const dieEl = document.getElementById("engineerCraftStructureDie");
            if (dieEl) {
                skillDie = dieEl.value.trim();
            }
            const skillMisc = getInputNumber("engineerCraftStructureMiscMod", 0);
            bonus = engInt + skillMisc + funcTotal;

            explanationHtml = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
                "<div>&bull; <strong>Craft Structure Skill Die:</strong> " + (skillDie || "None (Untrained)") + " (from Chief Engineer Rank)</div>" +
                "<div>&bull; <strong>Key Ability (Int):</strong> " + formatModifier(engInt) + "</div>" +
                "<div>&bull; <strong>Skill Misc:</strong> " + formatModifier(skillMisc) + "</div>" +
                "<div>&bull; <strong>Function Total:</strong> " + formatModifier(funcTotal) + " [" + baseAttrLabel + " (" + formatModifier(baseAttrMod) + ") + Repair Misc (" + formatModifier(funcMisc) + ")]</div>" +
                "<div>&bull; <strong>Combined Flat Modifier:</strong> " + formatModifier(bonus) + "</div>";

            currentRollEngineerBreakdown = {
                funcTotal,
                intMod: engInt,
                miscMod: skillMisc,
                skillName: "Craft Structure"
            };
        } else if (funcName === "Overclock Core") {
            const selectEl = document.getElementById("engineerSecondarySkillSelect");
            let secondarySkillName = "Craft Electronic";
            if (selectEl && selectEl.value) {
                secondarySkillName = selectEl.value;
            }
            const dieEl = document.getElementById("engineerSecondarySkillDie");
            if (dieEl) {
                skillDie = dieEl.value.trim();
            }
            const skillMisc = getInputNumber("engineerSecondarySkillMiscMod", 0);
            bonus = engInt + skillMisc + funcTotal;

            explanationHtml = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
                "<div>&bull; <strong>" + secondarySkillName + " Skill Die:</strong> " + (skillDie || "None (Untrained)") + " (from Chief Engineer Rank)</div>" +
                "<div>&bull; <strong>Key Ability (Int):</strong> " + formatModifier(engInt) + "</div>" +
                "<div>&bull; <strong>Skill Misc:</strong> " + formatModifier(skillMisc) + "</div>" +
                "<div>&bull; <strong>Function Total:</strong> " + formatModifier(funcTotal) + " [" + baseAttrLabel + " (" + formatModifier(baseAttrMod) + ") + Overclock Core Misc (" + formatModifier(funcMisc) + ")]</div>" +
                "<div>&bull; <strong>Combined Flat Modifier:</strong> " + formatModifier(bonus) + "</div>";

            currentRollEngineerBreakdown = {
                funcTotal,
                intMod: engInt,
                miscMod: skillMisc,
                skillName: secondarySkillName
            };
        } else {
            // Boost (Engines), Counter Hack, Cloak utilize Chief Engineer's Int mod
            bonus = engInt + funcTotal;

            explanationHtml = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
                "<div>&bull; <strong>Key Ability (Int):</strong> " + formatModifier(engInt) + " (Chief Engineer Int Mod)</div>" +
                "<div>&bull; <strong>Function Total:</strong> " + formatModifier(funcTotal) + " [" + baseAttrLabel + " (" + formatModifier(baseAttrMod) + ") + Function Misc (" + formatModifier(funcMisc) + ")]</div>" +
                "<div>&bull; <strong>Combined Flat Modifier:</strong> " + formatModifier(bonus) + "</div>";

            currentRollEngineerBreakdown = {
                funcTotal,
                intMod: engInt,
                miscMod: 0,
                skillName: ""
            };
        }
    } else if (attrKey === "sensors") {
        const snsMod = getScoreModifier(getInputNumber("sensorsScoreInput", 10));
        const elcMod = getScoreModifier(getInputNumber("electronicsScoreInput", 10));
        const commsIntMod = getInputNumber("commsOfficerIntMod", 0);
        const commsWisMod = getInputNumber("commsOfficerWisMod", 0);
        const commsChaMod = getInputNumber("commsOfficerChaMod", 0);

        if (funcName === "Scan") {
            const sel = document.getElementById("funcAbility_scan");
            let abilityName = "WIS";
            if (sel && sel.value) {
                abilityName = sel.value;
            }
            let officerMod = commsWisMod;
            if (abilityName === "CHA") {
                officerMod = commsChaMod;
            }
            const miscMod = getInputNumber("funcMisc_scan", 0);
            bonus = snsMod + miscMod + officerMod;

            explanationHtml = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
                "<div>&bull; <strong>Ship Sensors Mod:</strong> " + formatModifier(snsMod) + "</div>" +
                "<div>&bull; <strong>Comms Officer (" + abilityName + "):</strong> " + formatModifier(officerMod) + "</div>" +
                "<div>&bull; <strong>Function Misc:</strong> " + formatModifier(miscMod) + "</div>" +
                "<div>&bull; <strong>Total Flat Modifier:</strong> " + formatModifier(bonus) + "</div>";

            currentRollCommsBreakdown = {
                abilityName,
                coreLabel: "Sensors",
                coreMod: snsMod,
                miscMod,
                officerMod,
                secondCoreLabel: "",
                secondCoreMod: 0
            };
        } else if (funcName.includes("Hack")) {
            const miscMod = getInputNumber("funcMisc_hackComms", 0);
            bonus = elcMod + miscMod + commsIntMod;

            explanationHtml = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
                "<div>&bull; <strong>Ship Electronics Mod:</strong> " + formatModifier(elcMod) + "</div>" +
                "<div>&bull; <strong>Comms Officer (INT):</strong> " + formatModifier(commsIntMod) + "</div>" +
                "<div>&bull; <strong>Function Misc:</strong> " + formatModifier(miscMod) + "</div>" +
                "<div>&bull; <strong>Total Flat Modifier:</strong> " + formatModifier(bonus) + "</div>";

            currentRollCommsBreakdown = {
                abilityName: "INT",
                coreLabel: "Electronics",
                coreMod: elcMod,
                miscMod,
                officerMod: commsIntMod,
                secondCoreLabel: "",
                secondCoreMod: 0
            };
        } else if (funcName.includes("Spoof")) {
            const sel = document.getElementById("funcAbility_spoofing");
            let abilityName = "INT";
            if (sel && sel.value) {
                abilityName = sel.value;
            }
            let officerMod = commsIntMod;
            if (abilityName === "CHA") {
                officerMod = commsChaMod;
            }
            const miscMod = getInputNumber("funcMisc_spoofing", 0);
            bonus = snsMod + elcMod + miscMod + officerMod;

            explanationHtml = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
                "<div>&bull; <strong>Ship Sensors Mod:</strong> " + formatModifier(snsMod) + "</div>" +
                "<div>&bull; <strong>Ship Electronics Mod:</strong> " + formatModifier(elcMod) + "</div>" +
                "<div>&bull; <strong>Comms Officer (" + abilityName + "):</strong> " + formatModifier(officerMod) + "</div>" +
                "<div>&bull; <strong>Function Misc:</strong> " + formatModifier(miscMod) + "</div>" +
                "<div>&bull; <strong>Total Flat Modifier:</strong> " + formatModifier(bonus) + "</div>";

            currentRollCommsBreakdown = {
                abilityName,
                coreLabel: "Sensors",
                coreMod: snsMod,
                miscMod,
                officerMod,
                secondCoreLabel: "Electronics",
                secondCoreMod: elcMod
            };
        } else if (funcName === "Crypto") {
            const sel = document.getElementById("funcAbility_cryptoComms");
            let abilityName = "WIS";
            if (sel && sel.value) {
                abilityName = sel.value;
            }
            let officerMod = commsWisMod;
            if (abilityName === "CHA") {
                officerMod = commsChaMod;
            }
            const miscMod = getInputNumber("funcMisc_cryptoComms", 0);
            bonus = snsMod + miscMod + officerMod;

            explanationHtml = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
                "<div>&bull; <strong>Ship Sensors Mod:</strong> " + formatModifier(snsMod) + "</div>" +
                "<div>&bull; <strong>Comms Officer (" + abilityName + "):</strong> " + formatModifier(officerMod) + "</div>" +
                "<div>&bull; <strong>Function Misc:</strong> " + formatModifier(miscMod) + "</div>" +
                "<div>&bull; <strong>Total Flat Modifier:</strong> " + formatModifier(bonus) + "</div>";

            currentRollCommsBreakdown = {
                abilityName,
                coreLabel: "Sensors",
                coreMod: snsMod,
                miscMod,
                officerMod,
                secondCoreLabel: "",
                secondCoreMod: 0
            };
        } else if (funcName === "Jam") {
            const sel = document.getElementById("funcAbility_jamComms");
            let abilityName = "WIS";
            if (sel && sel.value) {
                abilityName = sel.value;
            }
            let officerMod = commsWisMod;
            if (abilityName === "CHA") {
                officerMod = commsChaMod;
            }
            const miscMod = getInputNumber("funcMisc_jamComms", 0);
            bonus = snsMod + miscMod + officerMod;

            explanationHtml = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
                "<div>&bull; <strong>Ship Sensors Mod:</strong> " + formatModifier(snsMod) + "</div>" +
                "<div>&bull; <strong>Comms Officer (" + abilityName + "):</strong> " + formatModifier(officerMod) + "</div>" +
                "<div>&bull; <strong>Function Misc:</strong> " + formatModifier(miscMod) + "</div>" +
                "<div>&bull; <strong>Total Flat Modifier:</strong> " + formatModifier(bonus) + "</div>";

            currentRollCommsBreakdown = {
                abilityName,
                coreLabel: "Sensors",
                coreMod: snsMod,
                miscMod,
                officerMod,
                secondCoreLabel: "",
                secondCoreMod: 0
            };
        } else {
            explanationHtml = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
                "<div>&bull; <strong>Function Total:</strong> " + formatModifier(funcTotal) + "</div>" +
                "<div>&bull; <strong>Combined Flat Modifier:</strong> " + formatModifier(bonus) + "</div>";
        }
    } else if (attrKey === "electronics") {
        const sciIntMod = getInputNumber("scienceOfficerMod", 0);
        const elcMod = getScoreModifier(getInputNumber("electronicsScoreInput", 10));

        if (funcName.includes("Boost")) {
            const miscMod = getInputNumber("funcMisc_boostSci", 0);
            bonus = sciIntMod + miscMod;

            explanationHtml = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
                "<div>&bull; <strong>Science Officer (INT):</strong> " + formatModifier(sciIntMod) + "</div>" +
                "<div>&bull; <strong>Function Misc:</strong> " + formatModifier(miscMod) + "</div>" +
                "<div>&bull; <strong>Total Flat Modifier:</strong> " + formatModifier(bonus) + "</div>";

            currentRollScienceBreakdown = {
                elcMod: 0,
                isBoost: true,
                miscMod,
                officerMod: sciIntMod
            };
        } else {
            let miscMod = 0;
            if (funcName.includes("Hack")) {
                miscMod = getInputNumber("funcMisc_hackSci", 0);
            } else if (funcName === "Cloak") {
                miscMod = getInputNumber("funcMisc_cloakSci", 0);
            } else if (funcName === "Crypto") {
                miscMod = getInputNumber("funcMisc_cryptoSci", 0);
            } else {
                miscMod = funcTotal - elcMod - sciIntMod;
            }
            bonus = elcMod + sciIntMod + miscMod;

            explanationHtml = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
                "<div>&bull; <strong>Ship Electronics Mod:</strong> " + formatModifier(elcMod) + "</div>" +
                "<div>&bull; <strong>Science Officer (INT):</strong> " + formatModifier(sciIntMod) + "</div>" +
                "<div>&bull; <strong>Function Misc:</strong> " + formatModifier(miscMod) + "</div>" +
                "<div>&bull; <strong>Total Flat Modifier:</strong> " + formatModifier(bonus) + "</div>";

            currentRollScienceBreakdown = {
                elcMod,
                isBoost: false,
                miscMod,
                officerMod: sciIntMod
            };
        }
    } else if (attrKey === "captain") {
        const chaMod = getInputNumber("captainCharismaMod", 0);
        let miscMod = 0;
        if (funcName.includes("Give Command")) {
            miscMod = getInputNumber("funcMisc_giveCommand", 0);
        } else if (funcName.includes("Encourage Crew")) {
            miscMod = getInputNumber("funcMisc_encourageCrew", 0);
        } else if (funcName.includes("Commanding Pres") || funcName.includes("Commanding Presence")) {
            miscMod = getInputNumber("funcMisc_commandingPresence", 0);
        } else if (funcName.includes("Direct Assistance")) {
            miscMod = getInputNumber("funcMisc_directAssistance", 0);
        } else {
            miscMod = funcTotal - chaMod;
        }
        bonus = chaMod + miscMod;

        explanationHtml = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
            "<div>&bull; <strong>Captain (CHA):</strong> " + formatModifier(chaMod) + "</div>" +
            "<div>&bull; <strong>Function Misc:</strong> " + formatModifier(miscMod) + "</div>" +
            "<div>&bull; <strong>Total Flat Modifier:</strong> " + formatModifier(bonus) + "</div>";

        currentRollCaptainBreakdown = {
            chaMod,
            miscMod
        };
    } else if (attrKey === "medical") {
        const dieEl = document.getElementById("medicalOfficerSkillDie");
        if (dieEl) {
            skillDie = dieEl.value.trim();
        }

        const medWis = getInputNumber("medicalOfficerSkillWisMod", 0);
        const medSkillMisc = getInputNumber("medicalOfficerSkillMiscMod", 0);
        const medCheckMod = medWis + medSkillMisc;

        bonus = medCheckMod + funcTotal;

        explanationHtml = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
            "<div>&bull; <strong>Medical Skill Die:</strong> " + (skillDie || "None (Untrained)") + " (from Chief Medical Officer Rank)</div>" +
            "<div>&bull; <strong>Key Ability (Wis):</strong> " + formatModifier(medWis) + "</div>" +
            "<div>&bull; <strong>Skill Misc:</strong> " + formatModifier(medSkillMisc) + "</div>" +
            "<div>&bull; <strong>Function Misc:</strong> " + formatModifier(funcTotal) + "</div>" +
            "<div>&bull; <strong>Combined Flat Modifier:</strong> " + formatModifier(bonus) + "</div>";

        currentRollMedicalBreakdown = {
            funcTotal,
            medMisc: medSkillMisc,
            medWis
        };
    } else if (attrKey === "shields") {
        if (funcName === "Change Position") {
            const dieEl = document.getElementById("shieldsSkillAcrobaticsDie");
            if (dieEl) {
                skillDie = dieEl.value.trim();
            }
            const acroDex = getInputNumber("shieldsSkillAcrobaticsDexMod", 0);
            const acroMisc = getInputNumber("shieldsSkillAcrobaticsMiscMod", 0);
            const checkMod = acroDex + acroMisc;
            bonus = checkMod + funcTotal;

            let skillDieLabel = "None (Untrained)";
            if (skillDie) {
                skillDieLabel = skillDie;
            }

            explanationHtml = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
                "<div>&bull; <strong>Acrobatics Skill Die:</strong> " + skillDieLabel + "</div>" +
                "<div>&bull; <strong>Key Ability (Dex):</strong> " + formatModifier(acroDex) + "</div>" +
                "<div>&bull; <strong>Skill Misc:</strong> " + formatModifier(acroMisc) + "</div>" +
                "<div>&bull; <strong>Function Misc:</strong> " + formatModifier(funcTotal) + "</div>" +
                "<div>&bull; <strong>Combined Flat Modifier:</strong> " + formatModifier(bonus) + "</div>";

            currentRollShieldsBreakdown = {
                abilityMod: acroDex,
                abilityName: "Dex",
                funcTotal,
                skillDie,
                skillMisc: acroMisc,
                skillName: "Acrobatics"
            };
        } else if (funcName === "Beam") {
            const dieEl = document.getElementById("shieldsSkillKnowledgeScienceDie");
            if (dieEl) {
                skillDie = dieEl.value.trim();
            }
            const sciInt = getInputNumber("shieldsSkillKnowledgeScienceIntMod", 0);
            const sciMisc = getInputNumber("shieldsSkillKnowledgeScienceMiscMod", 0);
            const checkMod = sciInt + sciMisc;
            bonus = checkMod + funcTotal;

            const activeSwitch = document.getElementById("shieldsActiveSwitch");
            let isShieldsActive = true;
            if (activeSwitch) {
                isShieldsActive = activeSwitch.checked;
            }

            if (isShieldsActive) {
                warningText = "<i class=\"fa-solid fa-triangle-exclamation me-1\"></i><strong>Warning:</strong> By default, a Ship cannot use the \"Beam\" function while Shields are up/active!";
            }

            let skillDieLabel = "None (Untrained)";
            if (skillDie) {
                skillDieLabel = skillDie;
            }

            explanationHtml = "";
            if (warningText) {
                explanationHtml += "<div class=\"text-warning mb-2 fw-bold small\">" + warningText + "</div>";
            }
            explanationHtml += "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
                "<div>&bull; <strong>Knowledge Science Skill Die:</strong> " + skillDieLabel + "</div>" +
                "<div>&bull; <strong>Key Ability (Int):</strong> " + formatModifier(sciInt) + "</div>" +
                "<div>&bull; <strong>Skill Misc:</strong> " + formatModifier(sciMisc) + "</div>" +
                "<div>&bull; <strong>Function Misc:</strong> " + formatModifier(funcTotal) + "</div>" +
                "<div>&bull; <strong>Combined Flat Modifier:</strong> " + formatModifier(bonus) + "</div>";

            currentRollShieldsBreakdown = {
                abilityMod: sciInt,
                abilityName: "Int",
                funcTotal,
                skillDie,
                skillMisc: sciMisc,
                skillName: "Knowledge Science"
            };
        } else {
            const dieEl = document.getElementById("shieldsSkillKnowledgeScienceDie");
            if (dieEl) {
                skillDie = dieEl.value.trim();
            }
            const sciInt = getInputNumber("shieldsSkillKnowledgeScienceIntMod", 0);
            const sciMisc = getInputNumber("shieldsSkillKnowledgeScienceMiscMod", 0);
            const checkMod = sciInt + sciMisc;
            bonus = checkMod + funcTotal;

            let skillDieLabel = "None (Untrained)";
            if (skillDie) {
                skillDieLabel = skillDie;
            }

            explanationHtml = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
                "<div>&bull; <strong>Knowledge Science Skill Die:</strong> " + skillDieLabel + "</div>" +
                "<div>&bull; <strong>Key Ability (Int):</strong> " + formatModifier(sciInt) + "</div>" +
                "<div>&bull; <strong>Skill Misc:</strong> " + formatModifier(sciMisc) + "</div>" +
                "<div>&bull; <strong>Function Total (Shields Mod + Misc):</strong> " + formatModifier(funcTotal) + "</div>" +
                "<div>&bull; <strong>Combined Flat Modifier:</strong> " + formatModifier(bonus) + "</div>";

            currentRollShieldsBreakdown = {
                abilityMod: sciInt,
                abilityName: "Int",
                funcTotal,
                skillDie,
                skillMisc: sciMisc,
                skillName: "Knowledge Science"
            };
        }
    } else {
        explanationHtml = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
            "<div>&bull; <strong>Function Total:</strong> " + formatModifier(funcTotal) + "</div>" +
            "<div>&bull; <strong>Combined Flat Modifier:</strong> " + formatModifier(bonus) + "</div>";
    }

    openRollModal(funcName, bonus, attrKey, skillDie, explanationHtml, warningText);
}

function rollInitiative() {
    const initVal = getInputNumber("initiativeDisplay", 0);
    const snsMod = getScoreModifier(getInputNumber("sensorsScoreInput", 10));
    const strMod = getScoreModifier(getInputNumber("structureScoreInput", 10));
    let initPenalty = formatModifier(Math.abs(strMod));
    if (strMod > 0) {
        initPenalty = "-" + strMod;
    }
    const expl = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
        "<div>&bull; <strong>Sensors Bonus:</strong> " + formatModifier(snsMod) + "</div>" +
        "<div>&bull; <strong>Structure Penalty:</strong> " + initPenalty + "</div>" +
        "<div>&bull; <strong>Total Initiative Modifier:</strong> " + formatModifier(initVal) + "</div>";
    openRollModal("Ship Initiative", initVal, "initiative", "", expl);
}

function openDamageRollModal(actionTitle, bonus, explanationHtml) {
    currentRollMode = "damage";
    currentRollAction = actionTitle;
    currentRollBonus = bonus || 0;
    currentRollSkillDie = "";
    currentDamageDiceCount = getAvailableHardPoints();

    const modalTitleEl = document.getElementById("diceRollerModalTitleText");
    if (modalTitleEl) {
        modalTitleEl.textContent = "Space Ship Damage Roll";
    }
    const modalIconEl = document.getElementById("diceRollerModalIcon");
    if (modalIconEl) {
        modalIconEl.className = "fa-solid fa-burst me-2 text-warning";
    }

    setElementText("rollPoolLabel", "d10 Pool:");
    updateDamagePoolUI();

    setElementText("rollActionTitle", actionTitle);

    const explContainer = document.getElementById("rollActionExplanationContainer");
    const explText = document.getElementById("rollActionExplanationText");
    if (explContainer) {
        explContainer.classList.add("d-none");
    }
    if (explText) {
        let expl = explanationHtml;
        if (!expl) {
            expl = "<div>&bull; <strong>Damage Roll:</strong> Dependent on Active Weapon Hard Points (Default: " + currentDamageDiceCount + " d10)</div>";
            if (currentRollBonus !== 0) {
                expl += "<div>&bull; <strong>Modifier:</strong> " + formatModifier(currentRollBonus) + "</div>";
            }
        }
        explText.innerHTML = expl;
    }

    const resultBox = document.getElementById("rollResultContainer");
    if (resultBox) {
        resultBox.classList.add("d-none");
    }

    const warningBox = document.getElementById("rollActionWarningBox");
    if (warningBox) {
        warningBox.innerHTML = "";
        warningBox.classList.add("d-none");
    }

    const modalEl = document.getElementById("diceRollerModal");
    if (modalEl && window.bootstrap !== undefined) {
        modalEl.dataset.attrKey = "weapons";
        const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    }
}

function updateDamagePoolUI() {
    const badge = document.getElementById("rollAdvantageBadge");
    if (badge) {
        badge.className = "badge bg-info text-dark px-3 py-2 fw-bold";
        badge.textContent = currentDamageDiceCount + " d10";
    }
    const btnText = document.getElementById("executeRollButtonText");
    if (btnText) {
        btnText.textContent = "Roll " + currentDamageDiceCount + "d10";
    }
    const subtextEl = document.getElementById("rollActionSubtext");
    if (subtextEl) {
        let expr = currentDamageDiceCount + "d10";
        if (currentRollBonus > 0) {
            expr += "+" + currentRollBonus;
        } else if (currentRollBonus < 0) {
            expr += currentRollBonus;
        }
        subtextEl.textContent = "Dice: " + expr;
    }
}

function openRollModal(actionTitle, bonus, attrKey, skillDie, explanationHtml, warningHtml) {
    currentRollMode = "conflict";
    currentRollAction = actionTitle;
    currentRollBonus = bonus;
    currentRollSkillDie = skillDie || "";
    currentAdvantage = 0;
    if (attrKey !== "engines") {
        currentRollHelmBreakdown = null;
    }
    if (attrKey !== "structure") {
        currentRollEngineerBreakdown = null;
    }
    if (attrKey !== "sensors") {
        currentRollCommsBreakdown = null;
    }
    if (attrKey !== "electronics") {
        currentRollScienceBreakdown = null;
    }
    if (attrKey !== "captain") {
        currentRollCaptainBreakdown = null;
    }
    if (attrKey !== "medical") {
        currentRollMedicalBreakdown = null;
    }
    if (attrKey !== "shields") {
        currentRollShieldsBreakdown = null;
    }

    const modalTitleEl = document.getElementById("diceRollerModalTitleText");
    if (modalTitleEl) {
        modalTitleEl.textContent = "2d10 Conflict Roll";
    }
    const modalIconEl = document.getElementById("diceRollerModalIcon");
    if (modalIconEl) {
        modalIconEl.className = "fa-solid fa-dice-d20 me-2";
    }

    setElementText("rollPoolLabel", "Advantage Pool:");
    updateAdvantageBadge();

    const btnText = document.getElementById("executeRollButtonText");
    if (btnText) {
        btnText.textContent = "Roll 2d10";
    }

    const compactSubtext = formatCompactDiceExpression(currentRollSkillDie, currentRollBonus);
    setElementText("rollActionTitle", actionTitle);
    setElementText("rollActionSubtext", compactSubtext);

    const warningBox = document.getElementById("rollActionWarningBox");
    if (warningBox) {
        if (warningHtml) {
            warningBox.innerHTML = warningHtml;
            warningBox.classList.remove("d-none");
        } else {
            warningBox.innerHTML = "";
            warningBox.classList.add("d-none");
        }
    }

    const explContainer = document.getElementById("rollActionExplanationContainer");
    const explText = document.getElementById("rollActionExplanationText");
    if (explContainer) {
        explContainer.classList.add("d-none");
    }
    if (explText) {
        explText.innerHTML = explanationHtml || "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div><div>&bull; <strong>Modifier:</strong> " + formatModifier(bonus) + "</div>";
    }

    const resultBox = document.getElementById("rollResultContainer");
    if (resultBox) {
        resultBox.classList.add("d-none");
    }

    const modalEl = document.getElementById("diceRollerModal");
    if (modalEl && window.bootstrap !== undefined) {
        modalEl.dataset.attrKey = attrKey || "";
        const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    }
}

function rollPilotSkillCheck() {
    const dieEl = document.getElementById("helmOfficerPilotDie");
    let skillDie = "";
    if (dieEl) {
        skillDie = dieEl.value.trim();
    }
    const dexMod = getInputNumber("helmOfficerPilotDexMod", 0);
    const miscMod = getInputNumber("helmOfficerPilotMiscMod", 0);
    const totalBonus = dexMod + miscMod;
    const expl = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
        "<div>&bull; <strong>Pilot Skill Die:</strong> " + (skillDie || "None (Untrained)") + "</div>" +
        "<div>&bull; <strong>Key Ability (Dex):</strong> " + formatModifier(dexMod) + "</div>" +
        "<div>&bull; <strong>Skill Misc:</strong> " + formatModifier(miscMod) + "</div>" +
        "<div>&bull; <strong>Total Flat Modifier:</strong> " + formatModifier(totalBonus) + "</div>";
    openRollModal("Helm Officer: Pilot Skill Check", totalBonus, "pilot", skillDie, expl);
}

function rollEngineerStructureSkillCheck() {
    const dieEl = document.getElementById("engineerCraftStructureDie");
    let skillDie = "";
    if (dieEl) {
        skillDie = dieEl.value.trim();
    }
    const intMod = getInputNumber("engineerOfficerCraftMod", 0);
    const miscMod = getInputNumber("engineerCraftStructureMiscMod", 0);
    const totalBonus = intMod + miscMod;
    const expl = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
        "<div>&bull; <strong>Craft Structure Skill Die:</strong> " + (skillDie || "None (Untrained)") + "</div>" +
        "<div>&bull; <strong>Key Ability (Int):</strong> " + formatModifier(intMod) + "</div>" +
        "<div>&bull; <strong>Skill Misc:</strong> " + formatModifier(miscMod) + "</div>" +
        "<div>&bull; <strong>Total Flat Modifier:</strong> " + formatModifier(totalBonus) + "</div>";
    openRollModal("Chief Engineer: Craft Structure Check", totalBonus, "structure_craft", skillDie, expl);
}

function rollEngineerSecondarySkillCheck() {
    const selectEl = document.getElementById("engineerSecondarySkillSelect");
    let skillName = "Craft Electronic";
    if (selectEl && selectEl.value) {
        skillName = selectEl.value;
    }
    const dieEl = document.getElementById("engineerSecondarySkillDie");
    let skillDie = "";
    if (dieEl) {
        skillDie = dieEl.value.trim();
    }
    const intMod = getInputNumber("engineerOfficerCraftMod", 0);
    const miscMod = getInputNumber("engineerSecondarySkillMiscMod", 0);
    const totalBonus = intMod + miscMod;
    const expl = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
        "<div>&bull; <strong>" + skillName + " Skill Die:</strong> " + (skillDie || "None (Untrained)") + "</div>" +
        "<div>&bull; <strong>Key Ability (Int):</strong> " + formatModifier(intMod) + "</div>" +
        "<div>&bull; <strong>Skill Misc:</strong> " + formatModifier(miscMod) + "</div>" +
        "<div>&bull; <strong>Total Flat Modifier:</strong> " + formatModifier(totalBonus) + "</div>";
    openRollModal("Chief Engineer: " + skillName + " Check", totalBonus, "secondary_craft", skillDie, expl);
}

function rollMedicalSkillCheck() {
    const dieEl = document.getElementById("medicalOfficerSkillDie");
    let skillDie = "";
    if (dieEl) {
        skillDie = dieEl.value.trim();
    }
    const wisMod = getInputNumber("medicalOfficerSkillWisMod", 0);
    const miscMod = getInputNumber("medicalOfficerSkillMiscMod", 0);
    const totalBonus = wisMod + miscMod;
    const expl = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
        "<div>&bull; <strong>Medical Skill Die:</strong> " + (skillDie || "None (Untrained)") + "</div>" +
        "<div>&bull; <strong>Key Ability (Wis):</strong> " + formatModifier(wisMod) + "</div>" +
        "<div>&bull; <strong>Skill Misc:</strong> " + formatModifier(miscMod) + "</div>" +
        "<div>&bull; <strong>Total Flat Modifier:</strong> " + formatModifier(totalBonus) + "</div>";
    openRollModal("Chief Medical Officer: Medical Skill Check", totalBonus, "medical_skill", skillDie, expl);
}

function rollShieldKnowledgeScienceSkillCheck() {
    const dieEl = document.getElementById("shieldsSkillKnowledgeScienceDie");
    let skillDie = "";
    if (dieEl) {
        skillDie = dieEl.value.trim();
    }
    const intMod = getInputNumber("shieldsSkillKnowledgeScienceIntMod", 0);
    const miscMod = getInputNumber("shieldsSkillKnowledgeScienceMiscMod", 0);
    const totalBonus = intMod + miscMod;
    let skillDieLabel = "None (Untrained)";
    if (skillDie) {
        skillDieLabel = skillDie;
    }
    const expl = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
        "<div>&bull; <strong>Knowledge Science Skill Die:</strong> " + skillDieLabel + "</div>" +
        "<div>&bull; <strong>Key Ability (Int):</strong> " + formatModifier(intMod) + "</div>" +
        "<div>&bull; <strong>Skill Misc:</strong> " + formatModifier(miscMod) + "</div>" +
        "<div>&bull; <strong>Total Flat Modifier:</strong> " + formatModifier(totalBonus) + "</div>";
    openRollModal("Knowledge Science Skill Check", totalBonus, "knowledge_science_skill", skillDie, expl);
}

function rollShieldAcrobaticsSkillCheck() {
    const dieEl = document.getElementById("shieldsSkillAcrobaticsDie");
    let skillDie = "";
    if (dieEl) {
        skillDie = dieEl.value.trim();
    }
    const dexMod = getInputNumber("shieldsSkillAcrobaticsDexMod", 0);
    const miscMod = getInputNumber("shieldsSkillAcrobaticsMiscMod", 0);
    const totalBonus = dexMod + miscMod;
    let skillDieLabel = "None (Untrained)";
    if (skillDie) {
        skillDieLabel = skillDie;
    }
    const expl = "<div>&bull; <strong>Base Roll:</strong> 2d10 (Explodes on natural 10)</div>" +
        "<div>&bull; <strong>Acrobatics Skill Die:</strong> " + skillDieLabel + "</div>" +
        "<div>&bull; <strong>Key Ability (Dex):</strong> " + formatModifier(dexMod) + "</div>" +
        "<div>&bull; <strong>Skill Misc:</strong> " + formatModifier(miscMod) + "</div>" +
        "<div>&bull; <strong>Total Flat Modifier:</strong> " + formatModifier(totalBonus) + "</div>";
    openRollModal("Acrobatics Skill Check", totalBonus, "acrobatics_skill", skillDie, expl);
}

function adjustRollPool(delta) {
    if (currentRollMode === "damage") {
        currentDamageDiceCount = Math.max(1, Math.min(30, currentDamageDiceCount + delta));
        updateDamagePoolUI();
    } else {
        currentAdvantage = Math.max(-3, Math.min(3, currentAdvantage + delta));
        updateAdvantageBadge();
    }
}

function adjustRollAdvantage(delta) {
    adjustRollPool(delta);
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

function executeDamageRoll() {
    const rolls = [];
    let sum = 0;
    for (let i = 0; i < currentDamageDiceCount; i += 1) {
        const r = Math.floor(Math.random() * 10) + 1;
        rolls.push(r);
        sum += r;
    }
    const finalTotal = sum + currentRollBonus;
    displayDamageRollResult(finalTotal, rolls, currentRollBonus);
    const keptRecords = rolls.map(function (val) {
        return { base: val, extra: 0, total: val };
    });
    recordRollHistory(currentRollAction + " (Damage)", finalTotal, keptRecords, currentRollBonus, 0, false, false, currentDamageDiceCount + "d10", null);
}

// Execute Roll (Damage or 2d10 Conflict with Exploding 10s and Advantage)
function executeCurrentRoll() {
    if (currentRollMode === "damage") {
        executeDamageRoll();
        return;
    }
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
    let skillDieResult = { bonus: 0, rolls: [], total: 0 };
    if (currentRollSkillDie) {
        skillDieResult = rollDiceExpression(currentRollSkillDie);
    }
    const finalTotal = sumKeptDice + skillDieResult.total + currentRollBonus + advantageStaticBonus;

    // Check Crit Success / Crit Failure
    // Crit Fail: All base dice rolled land on 1
    const isCritFail = diceRolls.every(function (d) {
        return d === 1;
    });

    // Crit Success: At least one die exploded and raw dice sum > 20
    const hasExplosion = explodedDice.length > 0;
    const isCritSuccess = hasExplosion && sumKeptDice > 20;

    displayRollResult(finalTotal, keptDice, isCritSuccess, isCritFail, advantageStaticBonus, skillDieResult);
    recordRollHistory(currentRollAction, finalTotal, keptDice, currentRollBonus, advantageStaticBonus, isCritSuccess, isCritFail, currentRollSkillDie, skillDieResult);
}

function displayRollResult(total, keptDice, isCritSuccess, isCritFail, advBonus, skillDieResult) {
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

    let formulaStr = "Dice: [" + diceStr + "]";
    if (currentRollHelmBreakdown) {
        if (currentRollSkillDie && skillDieResult && (skillDieResult.rolls.length > 0 || skillDieResult.bonus !== 0)) {
            let skillRollsStr = "";
            if (skillDieResult.rolls.length > 0) {
                skillRollsStr = skillDieResult.rolls.map(function (r) {
                    return r.die + ":" + r.val;
                }).join(", ");
            }
            formulaStr += " + Pilot Skill Die (" + currentRollSkillDie + "): ";
            if (skillRollsStr) {
                formulaStr += "[" + skillRollsStr + "]";
                if (skillDieResult.bonus !== 0) {
                    formulaStr += " + " + skillDieResult.bonus;
                }
            } else {
                formulaStr += skillDieResult.bonus;
            }
        }
        formulaStr += " + Dex: " + formatModifier(currentRollHelmBreakdown.pilotDex);
        formulaStr += " + Skill Misc: " + formatModifier(currentRollHelmBreakdown.pilotMisc);
        formulaStr += " + Function Total: " + formatModifier(currentRollHelmBreakdown.funcTotal);
    } else if (currentRollEngineerBreakdown) {
        if (currentRollSkillDie && skillDieResult && (skillDieResult.rolls.length > 0 || skillDieResult.bonus !== 0)) {
            let skillRollsStr = "";
            if (skillDieResult.rolls.length > 0) {
                skillRollsStr = skillDieResult.rolls.map(function (r) {
                    return r.die + ":" + r.val;
                }).join(", ");
            }
            formulaStr += " + " + currentRollEngineerBreakdown.skillName + " Skill Die (" + currentRollSkillDie + "): ";
            if (skillRollsStr) {
                formulaStr += "[" + skillRollsStr + "]";
                if (skillDieResult.bonus !== 0) {
                    formulaStr += " + " + skillDieResult.bonus;
                }
            } else {
                formulaStr += skillDieResult.bonus;
            }
        }
        formulaStr += " + Int: " + formatModifier(currentRollEngineerBreakdown.intMod);
        if (currentRollEngineerBreakdown.miscMod !== 0) {
            formulaStr += " + Skill Misc: " + formatModifier(currentRollEngineerBreakdown.miscMod);
        }
        formulaStr += " + Function Total: " + formatModifier(currentRollEngineerBreakdown.funcTotal);
    } else if (currentRollCommsBreakdown) {
        formulaStr += " + " + currentRollCommsBreakdown.coreLabel + ": " + formatModifier(currentRollCommsBreakdown.coreMod);
        if (currentRollCommsBreakdown.secondCoreLabel) {
            formulaStr += " + " + currentRollCommsBreakdown.secondCoreLabel + ": " + formatModifier(currentRollCommsBreakdown.secondCoreMod);
        }
        formulaStr += " + Comms (" + currentRollCommsBreakdown.abilityName + "): " + formatModifier(currentRollCommsBreakdown.officerMod);
        if (currentRollCommsBreakdown.miscMod !== 0) {
            formulaStr += " + Misc: " + formatModifier(currentRollCommsBreakdown.miscMod);
        }
    } else if (currentRollScienceBreakdown) {
        if (!currentRollScienceBreakdown.isBoost) {
            formulaStr += " + Electronics: " + formatModifier(currentRollScienceBreakdown.elcMod);
        }
        formulaStr += " + Science (INT): " + formatModifier(currentRollScienceBreakdown.officerMod);
        if (currentRollScienceBreakdown.miscMod !== 0) {
            formulaStr += " + Misc: " + formatModifier(currentRollScienceBreakdown.miscMod);
        }
    } else if (currentRollCaptainBreakdown) {
        formulaStr += " + Captain (CHA): " + formatModifier(currentRollCaptainBreakdown.chaMod);
        if (currentRollCaptainBreakdown.miscMod !== 0) {
            formulaStr += " + Misc: " + formatModifier(currentRollCaptainBreakdown.miscMod);
        }
    } else if (currentRollMedicalBreakdown) {
        if (currentRollSkillDie && skillDieResult && (skillDieResult.rolls.length > 0 || skillDieResult.bonus !== 0)) {
            let skillRollsStr = "";
            if (skillDieResult.rolls.length > 0) {
                skillRollsStr = skillDieResult.rolls.map(function (r) {
                    return r.die + ":" + r.val;
                }).join(", ");
            }
            formulaStr += " + Medical Skill Die (" + currentRollSkillDie + "): ";
            if (skillRollsStr) {
                formulaStr += "[" + skillRollsStr + "]";
                if (skillDieResult.bonus !== 0) {
                    formulaStr += " + " + skillDieResult.bonus;
                }
            } else {
                formulaStr += skillDieResult.bonus;
            }
        }
        formulaStr += " + Wis: " + formatModifier(currentRollMedicalBreakdown.medWis);
        if (currentRollMedicalBreakdown.medMisc !== 0) {
            formulaStr += " + Skill Misc: " + formatModifier(currentRollMedicalBreakdown.medMisc);
        }
        formulaStr += " + Function Total: " + formatModifier(currentRollMedicalBreakdown.funcTotal);
    } else if (currentRollShieldsBreakdown) {
        if (currentRollSkillDie && skillDieResult && (skillDieResult.rolls.length > 0 || skillDieResult.bonus !== 0)) {
            let skillRollsStr = "";
            if (skillDieResult.rolls.length > 0) {
                skillRollsStr = skillDieResult.rolls.map(function (r) {
                    return r.die + ":" + r.val;
                }).join(", ");
            }
            formulaStr += " + " + currentRollShieldsBreakdown.skillName + " Skill Die (" + currentRollSkillDie + "): ";
            if (skillRollsStr) {
                formulaStr += "[" + skillRollsStr + "]";
                if (skillDieResult.bonus !== 0) {
                    formulaStr += " + " + skillDieResult.bonus;
                }
            } else {
                formulaStr += skillDieResult.bonus;
            }
        }
        formulaStr += " + " + currentRollShieldsBreakdown.abilityName + ": " + formatModifier(currentRollShieldsBreakdown.abilityMod);
        if (currentRollShieldsBreakdown.skillMisc !== 0) {
            formulaStr += " + Skill Misc: " + formatModifier(currentRollShieldsBreakdown.skillMisc);
        }
        formulaStr += " + Function Total: " + formatModifier(currentRollShieldsBreakdown.funcTotal);
    } else {
        if (currentRollSkillDie && skillDieResult && (skillDieResult.rolls.length > 0 || skillDieResult.bonus !== 0)) {
            let skillRollsStr = "";
            if (skillDieResult.rolls.length > 0) {
                skillRollsStr = skillDieResult.rolls.map(function (r) {
                    return r.die + ":" + r.val;
                }).join(", ");
            }
            formulaStr += " + Skill Die (" + currentRollSkillDie + "): ";
            if (skillRollsStr) {
                formulaStr += "[" + skillRollsStr + "]";
                if (skillDieResult.bonus !== 0) {
                    formulaStr += " + " + skillDieResult.bonus;
                }
            } else {
                formulaStr += skillDieResult.bonus;
            }
        }
        formulaStr += " + Mod: " + formatModifier(currentRollBonus);
    }
    if (advBonus !== 0) {
        formulaStr += " + Adv: " + formatModifier(advBonus);
    }
    formulaStr += " = " + total;

    breakdownEl.textContent = formulaStr;
    container.classList.remove("d-none");
}

function displayDamageRollResult(finalTotal, rolls, bonus) {
    const container = document.getElementById("rollResultContainer");
    const totalEl = document.getElementById("rollTotalNumber");
    const badgeEl = document.getElementById("rollOutcomeBadge");
    const breakdownEl = document.getElementById("rollBreakdownText");

    if (!container || !totalEl || !badgeEl || !breakdownEl) {
        return;
    }

    totalEl.textContent = finalTotal;
    badgeEl.className = "badge bg-danger px-3 py-1 mb-2 fs-6";
    badgeEl.textContent = "Damage Dealt";

    let formulaStr = "Dice: [" + rolls.join(", ") + "]";
    if (bonus > 0) {
        formulaStr += " + Mod: +" + bonus;
    } else if (bonus < 0) {
        formulaStr += " + Mod: " + bonus;
    }
    formulaStr += " = " + finalTotal;

    breakdownEl.textContent = formulaStr;
    container.classList.remove("d-none");
}

function recordRollHistory(action, total, keptDice, bonus, advBonus, isCritSuccess, isCritFail, skillDieStr, skillDieResult) {
    const record = {
        action,
        advBonus,
        bonus,
        isCritFail,
        isCritSuccess,
        keptDice,
        skillDieResult,
        skillDieStr,
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
        let details = r.timestamp + " | Kept: [" + r.keptDice.map(function (d) {
            return d.total;
        }).join(",") + "]";
        if (r.skillDieStr) {
            details += " + Skill Die (" + r.skillDieStr + ")";
        }
        details += " + " + r.bonus;
        html += "<small class='text-muted'>" + details + "</small></div>";
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
        "<div class='row g-2 mb-2'>" +
        "<div class='col-12 col-md-4'>" +
        "<label class='form-label small text-uppercase text-muted fw-bold mb-1' for='quirkName_" + quirkRowsCount + "'>Quirk Name</label>" +
        "<div class='input-group input-group-sm'>" +
        "<input type='text' id='quirkName_" + quirkRowsCount + "' name='quirkName_" + quirkRowsCount + "' class='form-control form-control-sm' placeholder='Select or type Quirk...' autocomplete='off' data-list='quirksDatalist' onchange='onQuirkSelect(this.value, " + quirkRowsCount + ")' oninput='onQuirkInput(this, " + quirkRowsCount + ")'>" +
        "<button type='button' class='btn btn-cyber-outline btn-sm px-2 no-print' onclick='toggleDatalist(\"quirkName_" + quirkRowsCount + "\")'><i class='fa-solid fa-chevron-down'></i></button>" +
        "</div></div>" +
        "<div class='col-12 col-md-8'>" +
        "<label class='form-label small text-uppercase text-muted fw-bold mb-1' for='quirkDesc_" + quirkRowsCount + "'>Description</label>" +
        "<textarea id='quirkDesc_" + quirkRowsCount + "' name='quirkDesc_" + quirkRowsCount + "' class='form-control form-control-sm quirk-textarea' placeholder='Quirk description...' rows='1' oninput='autoExpandTextarea(this)'></textarea>" +
        "</div></div>" +
        "<div class='row g-2'>" +
        "<div class='col-12 col-md-6'>" +
        "<label class='form-label small text-uppercase text-success fw-bold mb-1' for='quirkPos_" + quirkRowsCount + "'><i class='fa-solid fa-plus me-1'></i>Positive Benefit</label>" +
        "<textarea id='quirkPos_" + quirkRowsCount + "' name='quirkPos_" + quirkRowsCount + "' class='form-control form-control-sm quirk-textarea' placeholder='Positive Benefit...' rows='1' oninput='autoExpandTextarea(this)'></textarea>" +
        "</div>" +
        "<div class='col-12 col-md-6'>" +
        "<label class='form-label small text-uppercase text-danger fw-bold mb-1' for='quirkNeg_" + quirkRowsCount + "'><i class='fa-solid fa-minus me-1'></i>Negative Drawback</label>" +
        "<textarea id='quirkNeg_" + quirkRowsCount + "' name='quirkNeg_" + quirkRowsCount + "' class='form-control form-control-sm quirk-textarea' placeholder='Negative Drawback...' rows='1' oninput='autoExpandTextarea(this)'></textarea>" +
        "</div></div>";

    list.appendChild(rowDiv);
    updateQuirksPrintVisibility();
}

function onQuirkInput(input, rowIndex) {
    if (!input) {
        return;
    }
    const val = input.value.trim();
    let quirksList = FALLBACK_QUIRKS;
    if (shipData.quirks && shipData.quirks.length > 0) {
        quirksList = shipData.quirks;
    }
    if (val && quirksList && quirksList.length > 0) {
        const searchVal = val.toLowerCase();
        const matched = quirksList.find(function (q) {
            const qName = q.name || q.Name || "";
            return qName.toLowerCase() === searchVal;
        });
        if (matched) {
            onQuirkSelect(val, rowIndex);
            return;
        }
    }
    updateQuirksPrintVisibility();
}

function onQuirkSelect(val, rowIndex) {
    if (!val) {
        return;
    }
    let quirksList = FALLBACK_QUIRKS;
    if (shipData.quirks && shipData.quirks.length > 0) {
        quirksList = shipData.quirks;
    }
    const searchVal = val.trim().toLowerCase();
    const matched = quirksList.find(function (q) {
        const qName = q.name || q.Name || "";
        return qName.toLowerCase() === searchVal;
    });
    if (matched) {
        const descEl = document.getElementById("quirkDesc_" + rowIndex);
        const posEl = document.getElementById("quirkPos_" + rowIndex);
        const negEl = document.getElementById("quirkNeg_" + rowIndex);
        if (descEl) {
            descEl.value = matched.Description || matched.description || "";
            autoExpandTextarea(descEl);
        }
        if (posEl) {
            posEl.value = matched.Positive || matched.positive || matched.positive_effect || "";
            autoExpandTextarea(posEl);
        }
        if (negEl) {
            negEl.value = matched.Negative || matched.negative || matched.negative_effect || "";
            autoExpandTextarea(negEl);
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
function updateLockThemeUI(isLocked) {
    const switchEl = document.getElementById("lockThemeSwitch");
    const labelEl = document.getElementById("lockThemeLabel");
    if (switchEl) {
        switchEl.checked = isLocked;
    }
    if (labelEl) {
        if (isLocked) {
            labelEl.innerHTML = "<i class=\"fa-solid fa-lock text-warning me-1\" id=\"lockThemeIcon\"></i>Theme Locked";
        } else {
            labelEl.innerHTML = "<i class=\"fa-solid fa-lock-open text-muted me-1\" id=\"lockThemeIcon\"></i>Auto Switch";
        }
    }
}

function toggleLockTheme(isLocked) {
    let lockVal = "false";
    if (isLocked) {
        lockVal = "true";
    }
    localStorage.setItem("themeLocked", lockVal);
    updateLockThemeUI(isLocked);
}

function setTheme(themeName) {
    const themes = [
        "cosmic-dark", "cosmic-light", "bootstrap-dark", "bootstrap-light",
        "industrial", "aegis", "tattoo", "curvilinea", "viper",
        "volar", "human", "grayling", "lepidonain", "cryous",
        "aconian", "murid", "avisari", "khepri"
    ];
    let finalTheme = themeName;
    if (!themes.includes(finalTheme)) {
        finalTheme = "cosmic-dark";
    }

    const body = document.body;
    const header = document.querySelector(".app-header");

    themes.forEach(function (t) {
        body.classList.remove("theme-" + t);
    });
    body.classList.add("theme-" + finalTheme);
    body.setAttribute("data-theme", finalTheme);

    const isLight = finalTheme.endsWith("-light");
    let bsTheme = "dark";
    if (isLight) {
        bsTheme = "light";
    }
    body.setAttribute("data-bs-theme", bsTheme);
    if (header) {
        header.setAttribute("data-bs-theme", bsTheme);
    }

    document.querySelectorAll(".theme-card").forEach(function (c) {
        c.classList.remove("active");
    });
    const activeCard = document.getElementById("theme-" + finalTheme);
    if (activeCard) {
        activeCard.classList.add("active");
    }

    localStorage.setItem("theme", finalTheme);
}

function applyTheme() {
    let savedTheme = localStorage.getItem("theme");
    const themes = [
        "cosmic-dark", "cosmic-light", "bootstrap-dark", "bootstrap-light",
        "industrial", "aegis", "tattoo", "curvilinea", "viper",
        "volar", "human", "grayling", "lepidonain", "cryous",
        "aconian", "murid", "avisari", "khepri"
    ];
    if (!savedTheme || !themes.includes(savedTheme)) {
        savedTheme = "cosmic-dark";
    }
    setTheme(savedTheme);
    updateLockThemeUI(localStorage.getItem("themeLocked") === "true");
}

function onSpeciesMakeChange(speciesName) {
    updateHullDescription();
    const isLocked = (localStorage.getItem("themeLocked") === "true");
    if (isLocked) {
        return;
    }
    if (!speciesName) {
        return;
    }
    const clean = speciesName.toLowerCase().trim();
    if (clean === "generic") {
        setTheme("cosmic-dark");
        return;
    }
    const speciesThemes = [
        "volar", "human", "grayling", "lepidonain", "cryous",
        "aconian", "murid", "avisari", "khepri"
    ];
    speciesThemes.forEach(function (t) {
        if (clean.includes(t)) {
            setTheme(t);
        }
    });
}

function randomizeSpeciesTheme() {
    const speciesList = [
        "Generic", "Human", "Volar", "Grayling", "Lepidonain", "Cryous",
        "Aconian", "Murid", "Avisari", "Khepri"
    ];
    const rand = speciesList[Math.floor(Math.random() * speciesList.length)];
    const el = document.getElementById("speciesMakeInput");
    if (el) {
        el.value = rand;
    }
    onSpeciesMakeChange(rand);
}

function buildThemeModals() {
    applyTheme();
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
            titleSpan = header.querySelector("span:not(.badge):not(.drag-handle), strong");
        }
        let title = card.id || "Card";
        if (titleSpan) {
            title = titleSpan.textContent.trim();
        }
        const isSubCard = Boolean(card.closest(".position-core-cards-row"));
        let prefix = "";
        if (isSubCard) {
            prefix = "&nbsp;&nbsp;&nbsp;&nbsp;↳ ";
        }
        const li = document.createElement("li");
        li.innerHTML = "<button type='button' class='dropdown-item py-1' onclick='scrollToCard(\"" + card.id + "\")'>" + prefix + title + "</button>";
        menu.appendChild(li);
    });
}

function scrollToCard(id) {
    const el = document.getElementById(id);
    if (el) {
        const outerCollapse = document.getElementById("collapsePositionsCoreAttributes");
        if (outerCollapse && !outerCollapse.classList.contains("show") && outerCollapse.contains(el)) {
            outerCollapse.classList.add("show");
        }
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// Expand & Collapse All Cards
function expandAllCards() {
    const collapses = document.querySelectorAll(".sheet-card .collapse");
    collapses.forEach(function (col) {
        if (window.bootstrap !== undefined && window.bootstrap.Collapse) {
            const bsCollapse = window.bootstrap.Collapse.getOrCreateInstance(col, { toggle: false });
            bsCollapse.show();
        } else {
            col.classList.add("show");
        }
    });
    document.querySelectorAll(".card-header-custom").forEach(function (h) {
        h.classList.remove("collapsed");
        h.setAttribute("aria-expanded", "true");
    });
    saveCollapseStates();
}

function collapseAllCards() {
    const collapses = document.querySelectorAll(".sheet-card .collapse");
    collapses.forEach(function (col) {
        if (window.bootstrap !== undefined && window.bootstrap.Collapse) {
            const bsCollapse = window.bootstrap.Collapse.getOrCreateInstance(col, { toggle: false });
            bsCollapse.hide();
        } else {
            col.classList.remove("show");
        }
    });
    document.querySelectorAll(".card-header-custom").forEach(function (h) {
        h.classList.add("collapsed");
        h.setAttribute("aria-expanded", "false");
    });
    saveCollapseStates();
}

// Card Collapse Interaction & Persistence
function saveCollapseStates() {
    const collapsedIds = [];
    document.querySelectorAll(".sheet-card .collapse").forEach(function (el) {
        if (!el.classList.contains("show") && el.id) {
            collapsedIds.push(el.id);
        }
    });
    localStorage.setItem("ship_collapsed_cards", JSON.stringify(collapsedIds));
}

function restoreCollapseStates() {
    try {
        const saved = localStorage.getItem("ship_collapsed_cards");
        if (saved) {
            const collapsedIds = JSON.parse(saved);
            if (Array.isArray(collapsedIds)) {
                collapsedIds.forEach(function (id) {
                    const el = document.getElementById(id);
                    if (el && el.classList.contains("show")) {
                        if (window.bootstrap !== undefined && window.bootstrap.Collapse) {
                            const bsCollapse = window.bootstrap.Collapse.getOrCreateInstance(el, { toggle: false });
                            bsCollapse.hide();
                        } else {
                            el.classList.remove("show");
                        }
                        const header = document.querySelector("[data-bs-target='#" + id + "']");
                        if (header) {
                            header.classList.add("collapsed");
                            header.setAttribute("aria-expanded", "false");
                        }
                    }
                });
            }
        }
    } catch (err) {
        console.error("Error restoring collapse states:", err);
    }
}

function setupCollapseInteractions() {
    document.querySelectorAll(".card-header-custom").forEach(function (header) {
        const targetId = header.getAttribute("data-bs-target");
        if (!targetId) {
            return;
        }
        const targetEl = document.querySelector(targetId);
        if (!targetEl) {
            return;
        }

        header.style.cursor = "pointer";

        targetEl.addEventListener("show.bs.collapse", function () {
            header.classList.remove("collapsed");
            header.setAttribute("aria-expanded", "true");
            saveCollapseStates();
        });
        targetEl.addEventListener("hide.bs.collapse", function () {
            header.classList.add("collapsed");
            header.setAttribute("aria-expanded", "false");
            saveCollapseStates();
        });

        header.addEventListener("click", function (e) {
            if (e.target.closest("button, input, select, label, a, .no-collapse, .card-reorder-btns, .drag-handle")) {
                return;
            }
            if (window.bootstrap !== undefined && window.bootstrap.Collapse) {
                const bsCollapse = window.bootstrap.Collapse.getOrCreateInstance(targetEl, { toggle: false });
                bsCollapse.toggle();
            } else {
                const isShown = targetEl.classList.toggle("show");
                if (isShown) {
                    header.classList.remove("collapsed");
                    header.setAttribute("aria-expanded", "true");
                } else {
                    header.classList.add("collapsed");
                    header.setAttribute("aria-expanded", "false");
                }
                saveCollapseStates();
            }
        });
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
    const borderBoxOffset = el.offsetHeight - el.clientHeight;
    if (el.scrollHeight > el.clientHeight) {
        el.style.height = (el.scrollHeight + borderBoxOffset) + "px";
    }
}

let isSelectingDatalistOption = false;

// Custom Searchable Datalist Dropdown Implementation
function toggleDatalist(inputIdOrEl, forceOpen) {
    let input = inputIdOrEl;
    if (typeof inputIdOrEl === "string") {
        input = document.getElementById(inputIdOrEl);
        if (!input) {
            input = document.querySelector("[id$='" + inputIdOrEl + "']");
        }
    }
    if (!input) {
        return;
    }

    const inputGroup = input.closest(".input-group") || input.parentElement;
    if (!inputGroup) {
        return;
    }

    const existing = document.querySelector(".custom-datalist-dropdown");
    if (existing) {
        const isSameTarget = (existing.dataset.targetInputId === (input.id || input.name || ""));
        existing.remove();
        if (isSameTarget && !forceOpen) {
            return;
        }
    }

    const listId = input.getAttribute("data-list") || input.getAttribute("list") || input.dataset.list;
    const datalist = (listId ? document.getElementById(listId) : null);
    let options = [];
    if (datalist && datalist.options && datalist.options.length > 0) {
        const optArray = Array.from(datalist.options);
        optArray.forEach(function (o) {
            if (o && o.value) {
                options.push(o.value);
            }
        });
    }

    if (!options || options.length === 0) {
        const id = input.id || "";
        const name = input.name || "";
        if (id.includes("hullSize") || listId === "hullSizesDatalist") {
            options = shipData.hullSizes.map(function (s) {
                if (!s) {
                    return "";
                }
                if (typeof s === "string") {
                    return s;
                }
                return s.name || s.Name || "";
            });
        } else if (id.includes("hullConfig") || listId === "hullConfigDatalist") {
            options = shipData.configurations.map(function (c) {
                if (!c) {
                    return "";
                }
                if (typeof c === "string") {
                    return c;
                }
                return c.name || c.Name || "";
            });
        } else if (id.includes("ftlDrive") || listId === "ftlDriveDatalist") {
            options = shipData.ftlDrives.map(function (f) {
                if (!f) {
                    return "";
                }
                if (typeof f === "string") {
                    return f;
                }
                return f.name || f.Name || "";
            });
        } else if (id.includes("speciesMake") || listId === "speciesMakeDatalist") {
            options = shipData.species.map(function (sp) {
                if (!sp) {
                    return "";
                }
                if (typeof sp === "string") {
                    return sp;
                }
                return sp.name || sp.Name || "";
            });
        } else if (id.includes("quirk") || name.includes("quirk") || listId === "quirksDatalist") {
            options = shipData.quirks.map(function (q) {
                if (!q) {
                    return "";
                }
                if (typeof q === "string") {
                    return q;
                }
                return q.name || q.Name || "";
            });
        }
    }

    // Filter out any blank or undefined options
    options = options.filter(function (opt) {
        return opt !== undefined && opt !== null && String(opt).trim() !== "";
    });

    if (!options || options.length === 0) {
        return;
    }

    const dropdown = document.createElement("div");
    dropdown.className = "custom-datalist-dropdown shadow-lg rounded p-1 no-print";
    dropdown.dataset.targetInputId = (input.id || input.name || "");

    function updatePosition() {
        const rect = inputGroup.getBoundingClientRect();
        const dropdownHeight = 220;
        const spaceBelow = window.innerHeight - rect.bottom;
        const placeAbove = (spaceBelow < dropdownHeight && rect.top > dropdownHeight);

        let topPos = rect.bottom + 4;
        if (placeAbove) {
            topPos = Math.max(10, rect.top - dropdownHeight - 4);
        } else {
            topPos = Math.min(window.innerHeight - dropdownHeight - 10, rect.bottom + 4);
        }

        const leftPos = Math.max(10, Math.min(window.innerWidth - rect.width - 10, rect.left));

        dropdown.style.position = "fixed";
        dropdown.style.top = topPos + "px";
        dropdown.style.left = leftPos + "px";
        dropdown.style.width = rect.width + "px";
    }

    let activeIndex = -1;
    let currentFiltered = [];

    function updateActiveHighlight() {
        const items = dropdown.querySelectorAll(".dropdown-item-custom");
        items.forEach(function (item, idx) {
            if (idx === activeIndex) {
                item.classList.add("active");
                item.scrollIntoView({ block: "nearest" });
            } else {
                item.classList.remove("active");
            }
        });
    }

    let cleanup;
    let onInputFilter;
    let onKeyDown;
    let onScrollOrResize;
    let closeHandler;

    function selectOption(opt) {
        isSelectingDatalistOption = true;
        input.value = opt;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));

        const targetId = input.id || "";
        if (targetId === "hullSizeInput") {
            onHullSizeChange(opt);
        } else if (targetId === "hullConfigInput") {
            onHullConfigChange(opt);
        } else if (targetId === "speciesMakeInput") {
            onSpeciesMakeChange(opt);
        } else if (targetId.startsWith("quirkName_")) {
            const rowIndex = parseInt(targetId.replace("quirkName_", ""), 10);
            onQuirkSelect(opt, rowIndex);
        }

        setTimeout(function () {
            isSelectingDatalistOption = false;
        }, 50);
        cleanup();
    }

    function renderItems(filterVal) {
        dropdown.innerHTML = "";
        let rawFilter = "";
        if (filterVal) {
            rawFilter = String(filterVal);
        }
        const search = rawFilter.toLowerCase().trim();
        currentFiltered = options.filter(function (opt) {
            return opt !== undefined && opt !== null;
        }).map(function (opt) {
            if (typeof opt === "string") {
                return opt;
            }
            return opt.name || opt.Name || String(opt);
        }).filter(function (str) {
            return !search || str.toLowerCase().includes(search);
        });
        activeIndex = -1;

        if (currentFiltered.length === 0) {
            const noMatch = document.createElement("div");
            noMatch.className = "p-2 text-muted small text-center fst-italic";
            noMatch.textContent = "No matching suggestions";
            dropdown.appendChild(noMatch);
            return;
        }

        currentFiltered.forEach(function (opt, idx) {
            const item = document.createElement("div");
            item.className = "dropdown-item-custom p-2 rounded text-truncate";
            item.textContent = opt;

            item.addEventListener("mouseenter", function () {
                activeIndex = idx;
                updateActiveHighlight();
            });

            function handleSelect(e) {
                e.preventDefault();
                e.stopPropagation();
                selectOption(opt);
            }

            item.addEventListener("mousedown", handleSelect);
            item.addEventListener("touchstart", handleSelect, { passive: false });
            dropdown.appendChild(item);
        });
    }

    cleanup = function () {
        if (dropdown.parentNode) {
            dropdown.remove();
        }
        input.removeEventListener("input", onInputFilter);
        input.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("scroll", onScrollOrResize, true);
        window.removeEventListener("resize", onScrollOrResize);
        document.removeEventListener("click", closeHandler);
        document.removeEventListener("touchstart", closeHandler);
    };

    closeHandler = function (e) {
        if (!inputGroup.contains(e.target) && !dropdown.contains(e.target)) {
            cleanup();
        }
    };

    onKeyDown = function (e) {
        if (e.key === "ArrowDown") {
            if (currentFiltered.length > 0) {
                e.preventDefault();
                activeIndex = (activeIndex + 1) % currentFiltered.length;
                updateActiveHighlight();
            }
        } else if (e.key === "ArrowUp") {
            if (currentFiltered.length > 0) {
                e.preventDefault();
                activeIndex = (activeIndex - 1 + currentFiltered.length) % currentFiltered.length;
                updateActiveHighlight();
            }
        } else if (e.key === "Enter") {
            if (activeIndex >= 0 && activeIndex < currentFiltered.length) {
                e.preventDefault();
                selectOption(currentFiltered[activeIndex]);
            } else if (currentFiltered.length === 1 && input.value.trim().length > 0) {
                e.preventDefault();
                selectOption(currentFiltered[0]);
            } else {
                cleanup();
            }
        } else if (e.key === "Escape") {
            e.preventDefault();
            cleanup();
        } else if (e.key === "Tab") {
            cleanup();
        }
    };

    renderItems(input.value);
    document.body.appendChild(dropdown);
    updatePosition();

    onInputFilter = function () {
        renderItems(input.value);
        updatePosition();
    };
    input.addEventListener("input", onInputFilter);
    input.addEventListener("keydown", onKeyDown);

    onScrollOrResize = function () {
        if (document.body.contains(dropdown)) {
            updatePosition();
        }
    };
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);

    setTimeout(function () {
        document.addEventListener("click", closeHandler);
        document.addEventListener("touchstart", closeHandler);
    }, 50);
}

// Listen for typing and clicking on datalist inputs
document.addEventListener("input", function (e) {
    if (isSelectingDatalistOption) {
        return;
    }
    const target = e.target;
    if (!target || target.tagName !== "INPUT") {
        return;
    }
    const listId = target.getAttribute("data-list") || target.getAttribute("list");
    const targetId = target.id || "";
    const isDatalistTarget = Boolean(listId) ||
        targetId === "hullSizeInput" ||
        targetId === "hullConfigInput" ||
        targetId === "ftlDriveInput" ||
        targetId === "speciesMakeInput" ||
        targetId.startsWith("quirkName_");

    if (isDatalistTarget) {
        const existing = document.querySelector(".custom-datalist-dropdown");
        let sameInput = false;
        if (existing) {
            sameInput = (existing.dataset.targetInputId === (target.id || target.name || ""));
        }
        if (!sameInput) {
            toggleDatalist(target, true);
        }
    }
});

document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") {
        const target = e.target;
        if (!target || target.tagName !== "INPUT") {
            return;
        }
        const listId = target.getAttribute("data-list") || target.getAttribute("list");
        const targetId = target.id || "";
        const isDatalistTarget = Boolean(listId) ||
            targetId === "hullSizeInput" ||
            targetId === "hullConfigInput" ||
            targetId === "ftlDriveInput" ||
            targetId === "speciesMakeInput" ||
            targetId.startsWith("quirkName_");

        if (isDatalistTarget) {
            const existing = document.querySelector(".custom-datalist-dropdown");
            if (!existing) {
                e.preventDefault();
                toggleDatalist(target, true);
            }
        }
    }
});

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
                        if (el.disabled) {
                            el.checked = true;
                        } else {
                            el.checked = imported[key];
                        }
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
window.applyTheme = applyTheme;
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
window.onPilotRankChange = onPilotRankChange;
window.onQuirkInput = onQuirkInput;
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
window.rollPilotSkillCheck = rollPilotSkillCheck;
window.rollShipFunction = rollShipFunction;
window.scrollToCard = scrollToCard;
window.setDocumentTheme = setTheme;
window.setTheme = setTheme;
window.setupCollapseInteractions = setupCollapseInteractions;
window.syncSecondaryConfig = syncSecondaryConfig;
window.toggleCardLayoutLock = toggleCardLayoutLock;
window.toggleDatalist = toggleDatalist;
window.toggleLockTheme = toggleLockTheme;
window.toggleNotesPrintVisibility = toggleNotesPrintVisibility;
window.toggleThemeLock = toggleLockTheme;
window.adjustRollPool = adjustRollPool;
window.onWeaponsOfficerAbilityChange = onWeaponsOfficerAbilityChange;
window.rollWeaponsDamage = rollWeaponsDamage;
window.syncWeaponsOfficerAbilityTheme = syncWeaponsOfficerAbilityTheme;
window.onEngineerRankChange = onEngineerRankChange;
window.onEngineerSecondarySkillChange = onEngineerSecondarySkillChange;
window.rollEngineerStructureSkillCheck = rollEngineerStructureSkillCheck;
window.rollEngineerSecondarySkillCheck = rollEngineerSecondarySkillCheck;
window.onCommsFunctionAbilityChange = onCommsFunctionAbilityChange;
window.toggleRollExplanation = toggleRollExplanation;
window.formatCompactDiceExpression = formatCompactDiceExpression;
window.updateLockThemeUI = updateLockThemeUI;
window.onMedicalRankChange = onMedicalRankChange;
window.rollMedicalSkillCheck = rollMedicalSkillCheck;
window.onShieldsSkillRankChange = onShieldsSkillRankChange;
window.rollShieldKnowledgeScienceSkillCheck = rollShieldKnowledgeScienceSkillCheck;
window.rollShieldAcrobaticsSkillCheck = rollShieldAcrobaticsSkillCheck;
window.updateHullDescription = updateHullDescription;
