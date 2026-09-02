/*global bootstrap*/

let professionsList = [
  "Combat Medic", "Dimension Knight", "Dreadnought", "Engineer", "Envoy",
  "Electro-Mancer", "Field Officer", "Helix Warrior", "Shield Splicer",
  "Space Marine", "Starfighter", "Swindler", "Technosavant", "Tracer", "Xenophile"
];
let quirksData = [];
let detractorsData = [];
let speciesList;
const pushedDownCards = new Set();
let skillDieLevels = [
  "d2", "2d2", "2d2+1", "d4+d2+1", "2d4+1", "2d4+2", "d6+d4+2", "2d6+2",
  "2d6+3", "d8+d6+3", "2d8+3", "2d8+4", "d10+d8+4", "2d10+4", "2d10+5",
  "d12+d10+5", "2d12+5", "2d12+6", "2d6+d12+7", "4d6+8"
];
let isPopulatingForm = false;

const FALLBACK_CHARACTER_PATHS = [
  { Name: "Path of Strength (Strong Hero)", Affinity: "Strength" },
  { Name: "Path of Dexterity (Fast Hero)", Affinity: "Dexterity" },
  { Name: "Path of Constitution (Tough Hero)", Affinity: "Constitution" },
  { Name: "Path of Intelligence (Smart Hero)", Affinity: "Intelligence" },
  { Name: "Path of Wisdom (Dedicated Hero)", Affinity: "Wisdom" },
  { Name: "Path of Charisma (Charismatic Hero)", Affinity: "Charisma" },
  { Name: "Path of No Path (The Freelancer)" },
  { Name: "Ovex Path (Fighter Module)" },
  { Name: "Ovex Path (Leadership Module)" },
  { Name: "Ovex Path (Specialist Module)", Affinity: "Intelligence" },
  { Name: "Ovex Path (Assistance Module)", Affinity: "Wisdom" }
];

const FALLBACK_PROFESSIONS = [
  { Name: "Combat Medic", Affinity: ["Wisdom", "Dexterity"] },
  { Name: "Dimension Knight", Affinity: ["Strength", "Wisdom"] },
  { Name: "Dreadnought", Affinity: ["Dexterity", "Constitution"] },
  { Name: "Engineer", Affinity: ["Intelligence", "Constitution"] },
  { Name: "Envoy", Affinity: ["Charisma", "Wisdom"] },
  { Name: "Electro-Mancer", Affinity: ["Intelligence", "Dexterity"] },
  { Name: "Field Officer", Affinity: ["Charisma", "Wisdom"] },
  { Name: "Helix Warrior", Affinity: ["Strength", "Wisdom"] },
  { Name: "Shield Splicer", Affinity: ["Constitution", "Wisdom"] },
  { Name: "Space Marine", Affinity: ["Dexterity", "Strength"] },
  { Name: "Starfighter", Affinity: ["Dexterity", "Charisma"] },
  { Name: "Swindler", Affinity: ["Charisma", "Dexterity"] },
  { Name: "Technosavant", Affinity: ["Intelligence", "Wisdom"] },
  { Name: "Tracer", Affinity: ["Wisdom", "Intelligence"] },
  { Name: "Xenophile", Affinity: ["Wisdom", "Charisma"] }
];

let characterPathsData = FALLBACK_CHARACTER_PATHS;
let characterProfessionsData = FALLBACK_PROFESSIONS;

const ABILITY_CODE_MAP = {
  strength: "STR",
  str: "STR",
  dexterity: "DEX",
  dex: "DEX",
  constitution: "CON",
  con: "CON",
  intelligence: "INT",
  int: "INT",
  wisdom: "WIS",
  wis: "WIS",
  charisma: "CHA",
  cha: "CHA"
};

function getAbilityCode(abilityName) {
  if (!abilityName || typeof abilityName !== "string") {
    return null;
  }
  const clean = abilityName.trim().toLowerCase();
  if (ABILITY_CODE_MAP[clean]) {
    return ABILITY_CODE_MAP[clean];
  }
  if (clean.length >= 3 && ABILITY_CODE_MAP[clean.substring(0, 3)]) {
    return ABILITY_CODE_MAP[clean.substring(0, 3)];
  }
  return null;
}

function enableAbilityThemeCheckbox(abilityCode) {
  if (!abilityCode) {
    return;
  }
  const chk = document.getElementById(`abilityScoresCard_primaryAbility_${abilityCode}`) ||
              document.querySelector(`input[name="primaryAbility_${abilityCode}"]`);
  if (chk && !chk.checked) {
    chk.checked = true;
    chk.dispatchEvent(new Event("change", { bubbles: true }));
    triggerAutoSave();
  }
}

function getPathReferenceObject(query) {
  if (!query || typeof query !== "string") {
    return null;
  }
  const q = query.trim().toLowerCase();
  if (!q) {
    return null;
  }
  const list = (Array.isArray(characterPathsData) && characterPathsData.length > 0)
    ? characterPathsData
    : FALLBACK_CHARACTER_PATHS;

  // 1. Exact match on full Name (e.g. "Path of Strength (Strong Hero)")
  let found = list.find((p) => (p.Name || p.name || "").toLowerCase() === q);
  if (found) {
    return found;
  }

  // 2. Match on base Name before parenthesis (e.g. "Path of Strength")
  found = list.find((p) => {
    const name = (p.Name || p.name || "").toLowerCase();
    const baseName = name.split(" (")[0].trim();
    return q === baseName;
  });
  if (found) {
    return found;
  }

  // 3. Match on subtitle inside parenthesis (e.g. "Strong Hero")
  found = list.find((p) => {
    const name = (p.Name || p.name || "").toLowerCase();
    const match = name.match(/\(([^)]+)\)/);
    if (match && match[1]) {
      return q === match[1].trim().toLowerCase();
    }
    return false;
  });
  return found || null;
}

function getProfessionReferenceObject(query) {
  if (!query || typeof query !== "string") {
    return null;
  }
  const q = query.trim().toLowerCase();
  if (!q) {
    return null;
  }
  const list = (Array.isArray(characterProfessionsData) && characterProfessionsData.length > 0)
    ? characterProfessionsData
    : FALLBACK_PROFESSIONS;

  // Exact match on Name only (e.g. "Combat Medic")
  return list.find((p) => (p.Name || p.name || (typeof p === "string" ? p : "")).toLowerCase() === q) || null;
}

function handlePathChange(pathVal) {
  syncPathName();
  if (!pathVal || typeof pathVal !== "string") {
    return;
  }
  const clean = pathVal.trim();
  if (!clean) {
    return;
  }

  const pathObj = getPathReferenceObject(clean);
  if (pathObj && pathObj.Affinity) {
    const abCode = getAbilityCode(pathObj.Affinity);
    if (abCode) {
      enableAbilityThemeCheckbox(abCode);
    }
  }
}

function handleProfessionChange(inputEl) {
  if (!inputEl) {
    return;
  }
  const val = inputEl.value.trim();
  if (!val) {
    return;
  }
  const block = inputEl.closest(".profession-block");
  if (!block) {
    return;
  }

  const profObj = getProfessionReferenceObject(val);
  if (profObj && Array.isArray(profObj.Affinity) && profObj.Affinity.length > 0) {
    const codes = profObj.Affinity.map((aff) => getAbilityCode(aff)).filter(Boolean);

    block.querySelectorAll(".affinity-tag").forEach((btn) => {
      const tagText = btn.textContent.trim().toUpperCase();
      if (codes.includes(tagText)) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    const hiddenInput = block.querySelector(".prof-affinities-input");
    if (hiddenInput) {
      hiddenInput.value = codes.join(",");
    }

    codes.forEach((code) => {
      enableAbilityThemeCheckbox(code);
    });

    triggerAutoSave();
  }
}

function updateLockThemeUI(isLocked) {
    const switchEl = document.getElementById("lockThemeSwitch");
    const labelEl = document.getElementById("lockThemeLabel");
    if (switchEl) {
        switchEl.checked = isLocked;
    }
    if (labelEl) {
        labelEl.innerHTML = (
            isLocked
            ? "<i class=\"fa-solid fa-lock text-warning me-1\" id=\"lockThemeIcon\"></i>Theme Locked"
            : "<i class=\"fa-solid fa-lock-open text-muted me-1\" id=\"lockThemeIcon\"></i>Auto Switch"
        );
    }
}

function toggleLockTheme(isLocked) {
  localStorage.setItem('themeLocked', isLocked ? 'true' : 'false');
  updateLockThemeUI(isLocked);
}

function setTheme(themeName) {
  const themes = ['cosmic-dark', 'cosmic-light', 'bootstrap-dark', 'bootstrap-light', 'industrial', 'aegis', 'tattoo', 'curvilinea', 'viper', 'volar', 'human', 'grayling', 'lepidonain', 'cryous', 'aconian', 'murid', 'avisari', 'khepri'];
  //console.log("setTheme called wth themeName:", themeName);
  if (!themes.includes(themeName)) {
    themeName = 'cosmic-dark';
  }

  const body = document.body;
  const header = document.querySelector('.app-header');

  themes.forEach((t) => body.classList.remove(`theme-${t}`));
  body.classList.add(`theme-${themeName}`);
  body.setAttribute('data-theme', themeName);

  const isLight = themeName.endsWith('-light');
  body.setAttribute('data-bs-theme', isLight ? 'light' : 'dark');
  if (header) {
    header.setAttribute('data-bs-theme', isLight ? 'light' : 'dark');
  }

  document.querySelectorAll('.theme-card').forEach((c) => c.classList.remove('active'));
  const activeCard = document.getElementById(`theme-${themeName}`);
  if (activeCard) {
    activeCard.classList.add('active');
  }

  localStorage.setItem('theme', themeName);
}

function applyTheme() {
  //console.log("applyTheme called!");
  let savedTheme = localStorage.getItem('theme');
  const themes = ['cosmic-dark', 'cosmic-light', 'bootstrap-dark', 'bootstrap-light', 'industrial', 'aegis', 'tattoo', 'curvilinea', 'viper', 'volar', 'human', 'grayling', 'lepidonain', 'cryous', 'aconian', 'murid', 'avisari', 'khepri'];
  if (!savedTheme || !themes.includes(savedTheme)) {
    savedTheme = 'cosmic-dark';
  }
  setTheme(savedTheme);
  updateLockThemeUI(localStorage.getItem('themeLocked') === 'true');
}

// Calculate Ability Modifier: Math.floor(score/2) - 5
function getAbilityMod(score) {
  const val = parseInt(score, 10);
  if (Number.isNaN(val)) {
    return 0;
  }
  return Math.floor(val / 2) - 5;
}

function formatModStr(mod) {
  const val = parseInt(mod, 10);
  if (Number.isNaN(val)) {
    return '+0';
  }
  return (val >= 0 ? `+${val}` : `${val}`);
}


function syncDexModToAc() {
  const scoreDEXInput = document.getElementById('abilityScoresCard_scoreDEX') || document.getElementById('global_scoreDEX');
  const acDexInput = document.getElementById('global_acDexMod');
  if (acDexInput) {
    if (!scoreDEXInput || scoreDEXInput.value.trim() === '') {
      acDexInput.value = '';
    } else {
      const dexMod = getAbilityMod(scoreDEXInput.value);
      acDexInput.value = dexMod;
    }
  }
}

function getSizeModifier(sizeText) {
  let parsedDefault;
  if (!sizeText) {
    return 0;
  }
  const s = sizeText.trim().toLowerCase();
  switch (s) {
  case 'fine':
    return 4;
  case 'diminutive':
    return 3;
  case 'tiny':
    return 2;
  case 'small':
    return 1;
  case 'medium':
    return 0;
  case 'large':
    return -1;
  case 'huge':
    return -2;
  case 'gargantuan':
    return -3;
  case 'colossal':
    return -4;
  default:
    parsedDefault = parseInt(sizeText, 10);
    return (Number.isNaN(parsedDefault) ? 0 : parsedDefault);
  }
}

function syncSizeToAc() {
  const charSizeInput = document.getElementById('identityCard_charSize');
  const acSizeInput = document.getElementById('global_acSizeMod');
  if (!charSizeInput || !acSizeInput) {
    return;
  }

  const charSizeVal = charSizeInput.value.trim();
  if (charSizeVal === '') {
    acSizeInput.value = '';
    return;
  }
  const mod = getSizeModifier(charSizeVal);
  acSizeInput.value = formatModStr(mod);
}

function syncKnowledgeTechRank() {
  const pathLevelInput = document.getElementById('identityCard_pathLevel') || document.getElementsByName('pathLevel')[0];
  const ktRankInput = document.getElementById('languageCustomSkillsCard_skillRank_knowledge_tech_custom') || document.querySelector('tr[data-skill="knowledge_tech_custom"] .skill-rank');
  if (pathLevelInput && ktRankInput) {
    const lvlVal = pathLevelInput.value.trim();
    ktRankInput.value = lvlVal;
  }
}

let isStatsCalcScheduled = false;

function calculateStats() {
  if (isStatsCalcScheduled) {
    return;
  }
  isStatsCalcScheduled = true;
  queueMicrotask(() => {
    isStatsCalcScheduled = false;
    performCalculateStats();
  });
}

// Live calculation of Modifiers & Skills
function performCalculateStats() {
  //console.log("calculateStats called!");
  const stats = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
  const mods = {};

  stats.forEach((st) => {
    const inputEl = document.getElementById(`abilityScoresCard_score${st}`) || document.getElementById(`global_score${st}`);
    const modEl = document.getElementById(`abilityScoresCard_mod${st}`) || document.getElementById(`global_mod${st}`);

    if (!inputEl || inputEl.value.trim() === '') {
      mods[st] = 0;
      if (modEl) {
        modEl.value = '';
      }
    } else {
      const mod = getAbilityMod(inputEl.value);
      mods[st] = mod;
      if (modEl) {
        modEl.value = formatModStr(mod);
      }
    }
  });

  // Sync DEX Mod to AC if not manually overridden
  syncDexModToAc();
  // Sync Size Modifier to AC
  syncSizeToAc();
  // Sync Character Level to Knowledge (Technology) Skill Rank
  syncKnowledgeTechRank();

  // Calculate Armor Class (AC = 10 + Armor + DEX + Size + Natural + Misc)
  const acArmorEl = document.getElementById('global_acArmorBonus');
  const acDexEl = document.getElementById('global_acDexMod');
  const acSizeEl = document.getElementById('global_acSizeMod');
  const acNaturalEl = document.getElementById('global_acNaturalArmor');
  const acMiscEl = document.getElementById('global_acMiscMod');

  let acArmorVal = '';
  if (acArmorEl) {
    acArmorVal = acArmorEl.value;
  }
  let acDexVal = '';
  if (acDexEl) {
    acDexVal = acDexEl.value;
  }
  let acSizeVal = '';
  if (acSizeEl) {
    acSizeVal = acSizeEl.value;
  }
  let acNaturalVal = '';
  if (acNaturalEl) {
    acNaturalVal = acNaturalEl.value;
  }
  let acMiscVal = '';
  if (acMiscEl) {
    acMiscVal = acMiscEl.value;
  }

  const hasAnyAcVal = [acArmorVal, acDexVal, acSizeVal, acNaturalVal, acMiscVal].some((v) => Boolean(v && v.trim() !== ''));

  const acTotalDisplay = document.getElementById('global_acTotalDisplay');
  const acTouchDisplay = document.getElementById('global_acTouchDisplay');
  const acFlatDisplay = document.getElementById('global_acFlatDisplay');
  const armorClassInput = document.getElementsByName('armorClass')[0];

  const scoreDEXEl = document.getElementById('abilityScoresCard_scoreDEX') || document.getElementById('global_scoreDEX');
  let scoreDEXVal = '';
  if (scoreDEXEl) {
    scoreDEXVal = scoreDEXEl.value;
  }

  if (!hasAnyAcVal && !scoreDEXVal) {
    if (acTotalDisplay) {
      acTotalDisplay.value = '';
    }
    if (acTouchDisplay) {
      acTouchDisplay.value = '';
    }
    if (acFlatDisplay) {
      acFlatDisplay.value = '';
    }
    if (armorClassInput) {
      armorClassInput.value = '';
    }
  } else {
    const acArmor = parseInt(acArmorVal || 0, 10);
    const acDex = parseInt(acDexVal || 0, 10);
    const acSize = parseInt(acSizeVal || 0, 10);
    const acNatural = parseInt(acNaturalVal || 0, 10);
    const acMisc = parseInt(acMiscVal || 0, 10);

    const totalAC = 10 + acArmor + acDex + acSize + acNatural + acMisc;
    const touchAC = 10 + acDex + acSize + acMisc;
    const flatAC = 10 + acArmor + acSize + acNatural + acMisc;

    if (acTotalDisplay) {
      acTotalDisplay.value = totalAC;
    }
    if (acTouchDisplay) {
      acTouchDisplay.value = touchAC;
    }
    if (acFlatDisplay) {
      acFlatDisplay.value = flatAC;
    }
    if (armorClassInput) {
      armorClassInput.value = totalAC;
    }
  }

  // Update Skills
  const skillRows = document.querySelectorAll('#skillsTable tbody tr, #featSkillsTable tbody tr, #langSkillsTable tbody tr');
  skillRows.forEach((row) => {
    const abilityKey = row.getAttribute('data-ability');

    const rankInput = row.querySelector('.skill-rank');
    const abModInput = row.querySelector('.skill-ab-mod');
    const miscInput = row.querySelector('.skill-misc-mod');
    const totalSpan = row.querySelector('.skill-total');
    let abSpan = null;
    if (abModInput && abModInput.parentElement) {
      abSpan = abModInput.parentElement.querySelector('span, select');
    }

    if (abilityKey && abilityKey !== '-') {
      const abClass = `text-ability-${abilityKey.toLowerCase()}`;
      ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach((ab) => {
        if (abSpan && ab !== abilityKey.toLowerCase()) {
          abSpan.classList.remove(`text-ability-${ab}`);
        }
        if (abModInput && ab !== abilityKey.toLowerCase()) {
          abModInput.classList.remove(`text-ability-${ab}`);
        }
      });
      if (abSpan && !abSpan.classList.contains(abClass)) {
        abSpan.classList.add(abClass);
      }
      if (abModInput && !abModInput.classList.contains(abClass)) {
        abModInput.classList.add(abClass);
      }
    }

    const rankStr = (rankInput ? rankInput.value : '');
    const dieInput = row.querySelector('.skill-die');
    const rankNum = parseInt(rankStr, 10);

    if (dieInput) {
      if (!Number.isNaN(rankNum) && rankNum >= 1 && Array.isArray(skillDieLevels) && skillDieLevels.length > 0) {
        const dieIndex = Math.min(rankNum - 1, skillDieLevels.length - 1);
        dieInput.value = skillDieLevels[dieIndex];
      } else if (!rankStr || Number.isNaN(rankNum) || rankNum <= 0) {
        dieInput.value = '';
      }
    }

    const miscStr = (miscInput ? miscInput.value : '');
    const scoreEl = document.getElementById(`abilityScoresCard_score${abilityKey}`) || document.getElementById(`global_score${abilityKey}`);
    const scoreStr = (scoreEl ? scoreEl.value : '');

    if (!scoreStr && !rankStr && !miscStr) {
      if (abModInput) {
        abModInput.value = '';
      }
      if (totalSpan) {
        totalSpan.innerText = '';
      }
    } else {
      const misc = parseInt(miscStr || 0, 10);

      const abMod = (scoreStr ? (mods[abilityKey] || 0) : 0);
      if (abModInput) {
        abModInput.value = (scoreStr ? formatModStr(abMod) : '');
      }

      const totalBonus = abMod + misc;
      if (totalSpan) {
        totalSpan.innerText = formatModStr(totalBonus);
      }
    }
  });

  // Calculate Initiative (WIS MOD + DEX MOD)
  const initEl = document.getElementById('global_initiative') || document.getElementsByName('initiative')[0];
  const scoreWISEl = document.getElementById('abilityScoresCard_scoreWIS') || document.getElementById('global_scoreWIS');
  const scoreDEXInput = document.getElementById('abilityScoresCard_scoreDEX') || document.getElementById('global_scoreDEX');
  const hasWisScore = Boolean(scoreWISEl && scoreWISEl.value.trim() !== '');
  const hasDexScore = Boolean(scoreDEXInput && scoreDEXInput.value.trim() !== '');

  if (initEl) {
    if (!hasWisScore && !hasDexScore) {
      initEl.value = '';
    } else {
      const wisMod = mods.WIS || 0;
      const dexMod = mods.DEX || 0;
      initEl.value = formatModStr(wisMod + dexMod);
    }
  }

  // Calculate Passive Perception (8 + WIS MOD + Math.floor(Perception Skill Misc Mod / 2))
  const passivePercEl = document.getElementById('global_passivePerception') || document.getElementsByName('passivePerception')[0];
  const percMiscEl = document.getElementById('coreSkills_skillMisc_perception') || document.getElementsByName('skillMisc_perception')[0];
  const percMiscVal = parseInt((percMiscEl ? percMiscEl.value : 0), 10) || 0;

  if (passivePercEl) {
    if (!hasWisScore && (!percMiscEl || percMiscEl.value.trim() === '')) {
      passivePercEl.value = '';
    } else {
      const wisMod = mods.WIS || 0;
      const halfPercMisc = Math.floor(percMiscVal / 2);
      passivePercEl.value = 8 + wisMod + halfPercMisc;
    }
  }

  calculateTotalWeight();
  syncPathName();
  triggerAutoSave();
}

function syncPathName() {
  const pathSelect = document.getElementById('identityCard_charPath') || document.getElementById('charPath');
  const displayEl = document.getElementById('headerPathDisplay');
  if (pathSelect && displayEl) {
    const val = pathSelect.value.trim();
    displayEl.textContent = (val ? `[ ${val} ]` : '');
  }

  calculateMutationsMPTotals();
}

function syncSpeciesName() {
  const speciesInput = document.getElementById('identityCard_speciesInput');
  const speciesVal = (speciesInput ? speciesInput.value.trim() : '');
  const displayEl = document.getElementById('headerSpeciesDisplay');
  if (displayEl) {
    displayEl.textContent = (speciesVal ? `[ ${speciesVal} ]` : '');
  }

  const isLocked = (localStorage.getItem('themeLocked') === 'true');
  if (speciesVal && !isLocked && !isPopulatingForm) {
    const lower = speciesVal.toLowerCase();
    setTheme(lower);
  }
}

let isSelectingDatalistOption = false;

function toggleDatalist(inputIdOrEl, forceOpen = false) {
  let input = (typeof inputIdOrEl === 'string' ? document.getElementById(inputIdOrEl) : inputIdOrEl);
  if (!input && typeof inputIdOrEl === 'string') {
    input = document.querySelector(`[id$="${inputIdOrEl}"]`);
  }
  if (!input) {
    return;
  }

  const inputGroup = input.closest('.input-group') || input.parentElement;
  if (!inputGroup) {
    return;
  }

  const existing = document.querySelector('.custom-datalist-dropdown');
  if (existing) {
    const isSameTarget = (existing.dataset.targetInputId === (input.id || input.name || ''));
    existing.remove();
    if (isSameTarget && !forceOpen) {
      return;
    }
  }

  const listId = input.getAttribute('data-list') || input.getAttribute('list') || input.dataset.list;
  const datalist = (listId ? document.getElementById(listId) : null);
  let options = [];
  if (datalist && datalist.options && datalist.options.length > 0) {
    options = Array.from(datalist.options).map((o) => o.value).filter(Boolean);
  }

  if (!options || options.length === 0) {
    const id = input.id || '';
    const name = input.name || '';
    if ((id.includes('speciesInput') || id === 'speciesInput' || listId === 'speciesDatalist') && speciesList !== undefined) {
      options = speciesList;
    } else if (id.includes('charPath') || id === 'charPath' || listId === 'charPathDatalist') {
      options = (characterPathsData && characterPathsData.length > 0)
        ? characterPathsData.map((p) => p.Name || p.name || p).filter(Boolean)
        : FALLBACK_CHARACTER_PATHS.map((p) => p.Name);
    } else if (id.includes('charSize') || id === 'charSize' || listId === 'sizesDatalist') {
      options = ['Fine', 'Diminutive', 'Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan', 'Colossal'];
    } else if (id.includes('occupationInput') || id === 'occupationInput' || listId === 'occupationDatalist') {
      options = ['Academic', 'Adventurer', 'Athlete', 'Blue Collar', 'Creative', 'Criminal', 'Cyber-Specialist', 'Dilettante', 'Diplomat', 'Doctor', 'Emergency Services', 'Entrepreneur', 'Jobless', 'Investigative', 'Law Enforcement', 'Mercenary', 'Military', 'Pioneer', 'Religious', 'Rural', 'Student', 'Spacer', 'Technician', 'White Collar'];
    } else if ((id.includes('quirkName') || name === 'quirkName[]' || listId === 'quirksDatalist' || (input.placeholder && input.placeholder.toLowerCase().includes('quirk'))) && quirksData !== undefined && quirksData.length > 0) {
      options = quirksData.map((q) => q.Name || q.name || q).filter(Boolean);
    } else if ((id.includes('detractorName') || name === 'detractorName[]' || listId === 'detractorsDatalist' || (input.placeholder && input.placeholder.toLowerCase().includes('detractor'))) && detractorsData !== undefined && detractorsData.length > 0) {
      options = detractorsData.map((d) => d.Name || d.name || d).filter(Boolean);
    } else if (id.includes('profTitle') || name === 'profTitle[]' || id.includes('techProfession') || name === 'techProfession[]' || listId === 'professionDatalist' || (professionsList !== undefined && professionsList.length > 0)) {
      options = (professionsList && professionsList.length > 0)
        ? professionsList
        : FALLBACK_PROFESSIONS.map((p) => p.Name);
    } else if (id.includes('drawbackName') || name.includes('DrawbackName') || listId === 'mutationDrawbacksDatalist') {
      if (Array.isArray(window.mutationDrawbacksReferenceData) && window.mutationDrawbacksReferenceData.length > 0) {
        options = window.mutationDrawbacksReferenceData.map((d) => d.Name || d.name || d).filter(Boolean);
      }
    } else if (id.includes('enhancementName') || name.includes('EnhancementName') || listId === 'mutationEnhancementsDatalist') {
      if (window.mutationEnhancementsReferenceData && typeof window.mutationEnhancementsReferenceData === 'object') {
        const optionList = [];
        ['cosmetic', 'offensive', 'defensive', 'enhancements'].forEach((cat) => {
          if (Array.isArray(window.mutationEnhancementsReferenceData[cat])) {
            window.mutationEnhancementsReferenceData[cat].forEach((item) => {
              const optName = (item.Name || item.name || item);
              if (optName) {
                optionList.push(optName);
              }
            });
          }
        });
        options = optionList;
      }
    }
  }

  if (!options || options.length === 0) {
    return;
  }

  const dropdown = document.createElement('div');
  dropdown.className = 'custom-datalist-dropdown shadow-lg rounded p-1 no-print';
  dropdown.dataset.targetInputId = (input.id || input.name || '');

  const updatePosition = () => {
    const rect = inputGroup.getBoundingClientRect();
    const dropdownHeight = 220;
    const spaceBelow = window.innerHeight - rect.bottom;
    const placeAbove = (spaceBelow < dropdownHeight && rect.top > dropdownHeight);

    dropdown.style.cssText = `
      position: fixed;
      top: ${(placeAbove ? Math.max(10, rect.top - dropdownHeight - 4) : Math.min(window.innerHeight - dropdownHeight - 10, rect.bottom + 4))}px;
      left: ${Math.max(10, Math.min(window.innerWidth - rect.width - 10, rect.left))}px;
      width: ${rect.width}px;
      z-index: 99999;
      max-height: 220px;
      overflow-y: auto;
      background: var(--modal-bg, #1e293b);
      border: 1px solid var(--modal-border, rgba(125, 211, 252, 0.3));
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.6);
      backdrop-filter: blur(12px);
      -webkit-overflow-scrolling: touch;
    `;
  };

  let cleanup;
  let onInputFilter;
  let onKeyDown;
  let onScrollOrResize;
  let closeHandler;
  let activeIndex = -1;
  let currentFiltered = [];

  const updateActiveHighlight = () => {
    const items = dropdown.querySelectorAll('.dropdown-item-custom');
    items.forEach((item, idx) => {
      if (idx === activeIndex) {
        item.style.background = 'var(--theme-card-bg, rgba(255,255,255,0.15))';
        item.style.color = 'var(--accent-cyan, #00f0ff)';
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.style.background = 'transparent';
        item.style.color = 'var(--text-color, #ffffff)';
      }
    });
  };

  const selectOption = (opt) => {
    isSelectingDatalistOption = true;
    input.value = opt;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    if (typeof input.oninput === 'function') {
      input.oninput(input);
    }
    if (typeof input.onchange === 'function') {
      input.onchange(input);
    }
    setTimeout(() => {
      isSelectingDatalistOption = false;
    }, 50);
    cleanup();
  };

  const renderItems = (filterVal = '') => {
    dropdown.innerHTML = '';
    const search = filterVal.toLowerCase().trim();
    currentFiltered = options.filter((opt) => !search || opt.toLowerCase().includes(search));
    activeIndex = -1;

    if (currentFiltered.length === 0) {
      const noMatch = document.createElement('div');
      noMatch.className = 'p-2 text-muted small text-center italic';
      noMatch.textContent = 'No matching suggestions';
      dropdown.appendChild(noMatch);
      return;
    }

    currentFiltered.forEach((opt, idx) => {
      const item = document.createElement('div');
      item.className = 'dropdown-item-custom p-2 rounded text-truncate user-select-none';
      item.style.cssText = 'cursor: pointer; color: var(--text-color, #ffffff); font-size: 0.825rem; font-weight: 500; transition: background 0.12s ease;';
      item.textContent = opt;

      item.addEventListener('mouseenter', () => {
        activeIndex = idx;
        updateActiveHighlight();
      });

      const handleSelect = (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectOption(opt);
      };

      item.addEventListener('mousedown', handleSelect);
      item.addEventListener('touchstart', handleSelect, { passive: false });
      dropdown.appendChild(item);
    });
  };

  cleanup = () => {
    if (dropdown.parentNode) {
      dropdown.remove();
    }
    input.removeEventListener('input', onInputFilter);
    input.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('scroll', onScrollOrResize, true);
    window.removeEventListener('resize', onScrollOrResize);
    document.removeEventListener('click', closeHandler);
    document.removeEventListener('touchstart', closeHandler);
  };

  closeHandler = (e) => {
    if (!inputGroup.contains(e.target) && !dropdown.contains(e.target)) {
      cleanup();
    }
  };

  onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      if (currentFiltered.length > 0) {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % currentFiltered.length;
        updateActiveHighlight();
      }
    } else if (e.key === 'ArrowUp') {
      if (currentFiltered.length > 0) {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + currentFiltered.length) % currentFiltered.length;
        updateActiveHighlight();
      }
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < currentFiltered.length) {
        e.preventDefault();
        selectOption(currentFiltered[activeIndex]);
      } else if (currentFiltered.length === 1 && input.value.trim().length > 0) {
        e.preventDefault();
        selectOption(currentFiltered[0]);
      } else {
        cleanup();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cleanup();
    } else if (e.key === 'Tab') {
      cleanup();
    }
  };

  renderItems(input.value);
  document.body.appendChild(dropdown);
  updatePosition();

  onInputFilter = () => {
    renderItems(input.value);
    updatePosition();
  };
  input.addEventListener('input', onInputFilter);
  input.addEventListener('keydown', onKeyDown);

  onScrollOrResize = () => {
    if (document.body.contains(dropdown)) {
      updatePosition();
    }
  };
  window.addEventListener('scroll', onScrollOrResize, true);
  window.addEventListener('resize', onScrollOrResize);

  setTimeout(() => {
    document.addEventListener('click', closeHandler);
    document.addEventListener('touchstart', closeHandler);
  }, 50);
}

document.addEventListener('input', (e) => {
  if (isSelectingDatalistOption) {
    return;
  }
  const target = e.target;
  if (!target || target.tagName !== 'INPUT') {
    return;
  }
  const listId = target.getAttribute('data-list') || target.getAttribute('list');
  const targetId = target.id || '';
  const targetName = target.name || '';
  const isDatalistTarget = Boolean(listId) ||
    targetId.includes('speciesInput') ||
    targetId.includes('charPath') ||
    targetId.includes('charSize') ||
    targetId.includes('occupationInput') ||
    targetId.includes('profTitle') || targetName === 'profTitle[]' ||
    targetId.includes('techProfession') || targetName === 'techProfession[]' ||
    targetId.includes('quirkName') || targetName === 'quirkName[]' ||
    targetId.includes('detractorName') || targetName === 'detractorName[]' ||
    targetId.includes('drawbackName') || targetName.includes('DrawbackName') ||
    targetId.includes('enhancementName') || targetName.includes('EnhancementName');

  if (isDatalistTarget) {
    const existing = document.querySelector('.custom-datalist-dropdown');
    const sameInput = existing && (existing.dataset.targetInputId === (target.id || target.name || ''));
    if (!sameInput) {
      toggleDatalist(target, true);
    }
  }
});

async function loadAllReferanceData() {
  const pathDatalist = document.getElementById('charPathDatalist');
  const sizeDatalist = document.getElementById('sizesDatalist');
  const speciesDatalist = document.getElementById('speciesDatalist');
  const occupationDatalist = document.getElementById('occupationDatalist');
  const wealthDatalist = document.getElementById('wealthXpCard_occupationInput');
  const professionDatalist = document.getElementById('professionDatalist');
  const quirkDatalist = document.getElementById('quirksDatalist');
  const detractorDatalist = document.getElementById('detractorsDatalist');
  const advdieDataList = document.getElementById('global_advantageDie');
  try {
    const response = await fetch('/v1/data/all');
    if (!response.ok) {
      return;
    }
    const allData = await response.json();
    if (Array.isArray(allData.skill_die_levels) && allData.skill_die_levels.length > 0) {
      skillDieLevels = allData.skill_die_levels;
      calculateStats();
    }
    if (pathDatalist && Array.isArray(allData.paths)) {
      pathDatalist.innerHTML = allData.paths.map((path) => `<option value="${path}">`).join('');
    }
    if (Array.isArray(allData.character_paths) && allData.character_paths.length > 0) {
      characterPathsData = allData.character_paths;
    }
    if (Array.isArray(allData.character_professions) && allData.character_professions.length > 0) {
      characterProfessionsData = allData.character_professions;
    } else if (Array.isArray(allData.professions) && allData.professions.length > 0 && typeof allData.professions[0] === 'object') {
      characterProfessionsData = allData.professions;
    }
    if (sizeDatalist && Array.isArray(allData.sizes) && allData.sizes.length > 0) {
      sizeDatalist.innerHTML = allData.sizes.map((size) => `<option value="${size}">`).join('');
    }
    if (Array.isArray(allData.species) && allData.species.length > 0) {
      speciesList = allData.species;
      if (speciesDatalist) {
        speciesDatalist.innerHTML = allData.species.map((sp) => `<option value="${sp}">`).join('');
      }
      randomizeSpecies(false);
    }
    if (occupationDatalist && Array.isArray(allData.occupations)) {
      occupationDatalist.innerHTML = allData.occupations.map((occ) => `<option value="${occ}">`).join('');
    }
    if (wealthDatalist && Array.isArray(allData.occupations) && allData.occupations.length > 0) {
      const randomOcc = allData.occupations[Math.floor(Math.random() * allData.occupations.length)];
      wealthDatalist.placeholder = `e.g. ${randomOcc}`;
    }
    const rawProf = allData.professions || allData.character_professions;
    if (rawProf && Array.isArray(rawProf) && rawProf.length > 0) {
      professionsList = rawProf.map((p) => (typeof p === "object" ? (p.Name || p.name) : p)).filter(Boolean);
      if (professionDatalist) {
        professionDatalist.innerHTML = professionsList.map((prof) => `<option value="${prof}">`).join("");
      }
      document.querySelectorAll('input[name="profTitle[]"], input[name="techProfession[]"]').forEach((input) => {
        const randomProf = professionsList[Math.floor(Math.random() * professionsList.length)];
        input.placeholder = `e.g. ${randomProf}`;
      });
    }
    if (quirkDatalist && Array.isArray(allData.quirks) && allData.quirks.length > 0) {
      quirksData = allData.quirks;
      quirkDatalist.innerHTML = allData.quirks.map((q) => {
        const name = (q.Name || q.name || q);
        return `<option value="${name}">`;
      }).join('');
    }
    if (detractorDatalist && Array.isArray(allData.detractors) && allData.detractors.length > 0) {
      detractorsData = allData.detractors;
      detractorDatalist.innerHTML = allData.detractors.map((d) => {
        const name = (d.Name || d.name || d);
        return `<option value="${name}">`;
      }).join('');
    }
    const mutationDrawbackDatalist = document.getElementById('mutationDrawbacksDatalist');
    const mutationEnhancementDatalist = document.getElementById('mutationEnhancementsDatalist');
    if (mutationDrawbackDatalist && Array.isArray(allData.mutation_drawbacks) && allData.mutation_drawbacks.length > 0) {
      window.mutationDrawbacksReferenceData = allData.mutation_drawbacks;
      mutationDrawbackDatalist.innerHTML = allData.mutation_drawbacks.map((d) => {
        const name = (d.Name || d.name || d);
        return `<option value="${name}">`;
      }).join('');
    }
    if (mutationEnhancementDatalist && allData.mutation_enhancements && typeof allData.mutation_enhancements === 'object') {
      window.mutationEnhancementsReferenceData = allData.mutation_enhancements;
      const optionList = [];
      const dataObj = allData.mutation_enhancements;
      ['cosmetic', 'offensive', 'defensive', 'enhancements'].forEach((cat) => {
        if (Array.isArray(dataObj[cat])) {
          dataObj[cat].forEach((item) => {
            const name = (item.Name || item.name || item);
            optionList.push(`<option value="${name}">`);
          });
        }
      });
      mutationEnhancementDatalist.innerHTML = optionList.join('');
    }
    if (advdieDataList && Array.isArray(allData.advantage_die_levels) && allData.advantage_die_levels.length > 0) {
      const optionList = ['<option value=""></option>'];
      allData.advantage_die_levels.forEach((item) => {
        const die = (typeof item === 'object' && item !== null) ? (item.die || item.name || item.value || '') : String(item);
        if (die && !optionList.some((opt) => opt.includes(`value="${die}"`))) {
          const label = (die.startsWith('d') ? `1${die}` : die);
          optionList.push(`<option value="${die}">${label}</option>`);
        }
      });
      advdieDataList.innerHTML = optionList.join('');
      setAdvantageDieValue(advdieDataList, pendingAdvantageDieValue || advdieDataList.value);
    }
  } catch (err) {
    console.warn("Failed to load reference data:", err);
  }
}

let pendingAdvantageDieValue = null;

function setAdvantageDieValue(selectEl, val) {
  if (!selectEl) {
    return;
  }
  if (val !== undefined && val !== null && String(val).trim() !== '') {
    pendingAdvantageDieValue = String(val).trim();
  }
  const targetVal = pendingAdvantageDieValue || (selectEl.value ? selectEl.value.trim() : '');
  if (!targetVal) {
    return;
  }

  // 1. Direct match
  for (const opt of selectEl.options) {
    if (opt.value === targetVal) {
      selectEl.value = opt.value;
      return;
    }
  }

  // 2. Normalized match (e.g. 'd4' <-> '1d4')
  const with1 = targetVal.startsWith('d') ? `1${targetVal}` : targetVal;
  const without1 = targetVal.replace(/^1(d\d+.*)/, '$1');

  for (const opt of selectEl.options) {
    if (opt.value === with1 || opt.value === without1) {
      selectEl.value = opt.value;
      return;
    }
  }

  // 3. Partial prefix match (e.g. 'd4' or '1d4' matching '1d4+1')
  const baseDie = targetVal.replace(/^1?/, '');
  for (const opt of selectEl.options) {
    if (opt.value && opt.value.replace(/^1?/, '').startsWith(baseDie)) {
      selectEl.value = opt.value;
      return;
    }
  }
}

function getSelectedAdvantageMod() {
  const el = document.getElementById('global_advantageMod');
  if (!el) {
    return 0;
  }
  const val = el.value.trim();
  if (val === '+1AD' || val === '+1') {
    return 1;
  }
  if (val === '+2AD' || val === '+2') {
    return 2;
  }
  if (val === '+3AD' || val === '+3') {
    return 3;
  }
  if (val === '-1AD' || val === '-1') {
    return -1;
  }
  if (val === '-2AD' || val === '-2') {
    return -2;
  }
  if (val === '-3AD' || val === '-3') {
    return -3;
  }
  return 0;
}

function resetAdvantageMod() {
  const advModSelect = document.getElementById('global_advantageMod');
  if (advModSelect) {
    advModSelect.value = '-';
  }
}

async function rollAbilityCheck(abilityKey, event) {
  const modInput = document.getElementById(`abilityScoresCard_mod${abilityKey}`);
  const modVal = (modInput ? parseInt(modInput.value || '0', 10) : 0);
  const primaryEl = document.getElementById(`abilityScoresCard_primaryAbility_${abilityKey}`);
  const isPrimaryChecked = (primaryEl ? primaryEl.checked : false);
  const advDieSelect = document.getElementById('global_advantageDie');
  const advDieVal = (advDieSelect ? advDieSelect.value.trim() : '');
  const adModCount = getSelectedAdvantageMod();

  resetAdvantageMod();

  let dString = 'd20';
  if (!Number.isNaN(modVal) && modVal !== 0) {
    if (modVal > 0) {
      dString += `+${modVal}`;
    } else {
      dString += `${modVal}`;
    }
  }

  const baseAdCount = (isPrimaryChecked && advDieVal ? 1 : 0);
  const totalAdCount = baseAdCount + adModCount;
  const advDieType = (advDieVal ? (advDieVal.startsWith('d') ? advDieVal : advDieVal.replace(/^\d+/, '')) : 'd4');

  if (totalAdCount > 0 && advDieVal) {
    dString += `+${totalAdCount}${advDieType}`;
  } else if (totalAdCount < 0 && advDieVal) {
    dString += `-${Math.abs(totalAdCount)}${advDieType}`;
  }

  const iconEl = (window.event ? window.event.currentTarget : null);
  if (iconEl) {
    iconEl.classList.add('fa-spin');
  }

  try {
    const response = await fetch(`/v1/tasks/roll/${encodeURIComponent(dString)}`);
    if (!response.ok) {
      alert(`Failed to roll dice for ${abilityKey}: HTTP ${response.status}`);
      return;
    }
    const data = await response.json();

    let total = 0;
    let breakdown = '';
    let isCritical = false;
    let d20Val = null;
    let allDice = [];
    if (data.Rolls && data.Rolls.length > 0) {
      total = data.Rolls[0].Total;
      const dice = data.Rolls[0].Dice;
      if (dice && Array.isArray(dice)) {
        allDice = dice;
        if (dice.length > 0) {
          d20Val = dice[0];
          if (dice[0] === 20) {
            isCritical = true;
          }
        }
        breakdown = formatDiceBreakdown(dice, true, isCritical);
      }
    } else if (typeof data.Total === 'number') {
      total = data.Total;
    }

    const title = `<i class="fa-solid fa-dumbbell me-1"></i>${abilityKey} Check (${dString})`;
    const luckConfig = (typeof d20Val === 'number' ? {
      title,
      currentTotal: total,
      currentD20: d20Val,
      allDice,
      dString,
      luckCount: 0,
      luckHistory: [d20Val]
    } : null);

    showRollNotification(title, total, breakdown, isCritical, null, luckConfig);
  } catch (err) {
    console.error('Error rolling dice:', err);
    alert(`Failed to roll dice for ${abilityKey}: ${err.message}`);
  } finally {
    if (iconEl) {
      iconEl.classList.remove('fa-spin');
    }
  }
}

async function rollSkillCheck(btnOrIcon) {
  const row = btnOrIcon.closest('tr');
  if (!row) {
    return;
  }

  let skillName = 'Skill';
  for (let i = 0; i < row.cells.length; i += 1) {
    const cell = row.cells[i];
    if (!cell.classList.contains('no-print') && !cell.querySelector('.roll-skill-btn') && !cell.querySelector('.form-check-input')) {
      const inputName = cell.querySelector('input[type="text"]:not(.skill-rank):not(.skill-die):not(.skill-misc-mod):not(.skill-ab-mod)');
      if (inputName && inputName.value.trim()) {
        skillName = inputName.value.trim();
        break;
      }
      const clone = cell.cloneNode(true);
      clone.querySelectorAll('.badge, .no-print, input, select').forEach((el) => {
        el.remove();
      });
      const text = clone.textContent.trim();
      if (text) {
        skillName = text;
        break;
      }
    }
  }

  const dieInput = row.querySelector('.skill-die');
  const skillDieVal = (dieInput ? dieInput.value.trim() : '');

  const totalSpan = row.querySelector('.skill-total');
  let totalBonus = 0;
  if (totalSpan && totalSpan.innerText) {
    totalBonus = parseInt(totalSpan.innerText.replace('+', ''), 10) || 0;
  }

  const advDieSelect = document.getElementById('global_advantageDie');
  const advDieVal = (advDieSelect ? advDieSelect.value.trim() : '');
  const adModCount = getSelectedAdvantageMod();

  resetAdvantageMod();

  let dString = 'd20';
  if (skillDieVal) {
    const formattedDie = (skillDieVal.startsWith('d') ? `1${skillDieVal}` : skillDieVal);
    dString += `+${formattedDie}`;
  }

  if (!Number.isNaN(totalBonus) && totalBonus !== 0) {
    if (totalBonus > 0) {
      dString += `+${totalBonus}`;
    } else {
      dString += `${totalBonus}`;
    }
  }

  const advDieType = (advDieVal ? (advDieVal.startsWith('d') ? advDieVal : advDieVal.replace(/^\d+/, '')) : 'd4');
  if (adModCount > 0 && advDieVal) {
    dString += `+${adModCount}${advDieType}`;
  } else if (adModCount < 0 && advDieVal) {
    dString += `-${Math.abs(adModCount)}${advDieType}`;
  }

  const iconEl = (btnOrIcon.classList.contains('fa-dice') ? btnOrIcon : btnOrIcon.querySelector('.fa-dice'));
  if (iconEl) {
    iconEl.classList.add('fa-spin');
  }

  try {
    const response = await fetch(`/v1/tasks/roll/${encodeURIComponent(dString)}`);
    if (!response.ok) {
      alert(`Failed to roll dice for ${skillName}: HTTP ${response.status}`);
      return;
    }
    const data = await response.json();

    let total = 0;
    let breakdown = '';
    let isCritical = false;
    let d20Val = null;
    let allDice = [];
    if (data.Rolls && data.Rolls.length > 0) {
      total = data.Rolls[0].Total;
      const dice = data.Rolls[0].Dice;
      if (dice && Array.isArray(dice)) {
        allDice = dice;
        if (dice.length > 0) {
          d20Val = dice[0];
          if (dice[0] === 20) {
            isCritical = true;
          }
        }
        breakdown = formatDiceBreakdown(dice, true, isCritical);
      }
    } else if (typeof data.Total === 'number') {
      total = data.Total;
    }

    const title = `<i class="fa-solid fa-list-check me-1"></i>${skillName} Check (${dString})`;
    const luckConfig = (typeof d20Val === 'number' ? {
      title,
      currentTotal: total,
      currentD20: d20Val,
      allDice,
      dString,
      luckCount: 0,
      luckHistory: [d20Val]
    } : null);

    showRollNotification(title, total, breakdown, isCritical, null, luckConfig);
  } catch (err) {
    console.error('Error rolling skill check:', err);
    alert(`Failed to roll dice for ${skillName}: ${err.message}`);
  } finally {
    if (iconEl) {
      iconEl.classList.remove('fa-spin');
    }
  }
}

function formatDiceBreakdown(diceArray, hasD20 = false, isCritical = false) {
  if (!diceArray || !Array.isArray(diceArray)) {
    return '';
  }
  const formatted = diceArray.map((d, index) => {
    if (index === 0 && hasD20 && (d === 20 || isCritical)) {
      return `<span class="badge bg-warning text-dark fw-bold px-1 py-0" style="font-size: 0.85rem; box-shadow: 0 0 8px rgba(255,215,0,0.85);">20</span>`;
    }
    return d;
  });
  return `[Dice: ${formatted.join(', ')}]`;
}

function recordDiceRoll(title, total, details = '', isCritical = false) {
  try {
    const raw = localStorage.getItem('d20FuturePathRollHistory');
    let history = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(history)) {
      history = [];
    }

    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const entry = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title,
      total: total,
      details: details,
      isCritical: Boolean(isCritical),
      timestamp: timestamp
    };

    history.unshift(entry);
    if (history.length > 20) {
      history = history.slice(0, 20);
    }

    localStorage.setItem('d20FuturePathRollHistory', JSON.stringify(history));

    const listEl = document.getElementById('diceHistoryList');
    const modalEl = document.getElementById('diceHistoryModal');
    if (listEl && modalEl && modalEl.classList.contains('show')) {
      renderDiceHistory();
    }
  } catch (err) {
    console.error('Error recording dice roll history:', err);
  }
}

function renderDiceHistory() {
  const listEl = document.getElementById('diceHistoryList');
  if (!listEl) {
    return;
  }

  let history = [];
  try {
    const raw = localStorage.getItem('d20FuturePathRollHistory');
    if (raw) {
      history = JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading dice roll history:', err);
  }

  if (!Array.isArray(history) || history.length === 0) {
    listEl.innerHTML = `
      <div class="text-center text-muted py-4">
        <i class="fa-solid fa-dice-d20 fa-3x mb-3 text-cyan opacity-50"></i>
        <p class="mb-0 fw-semibold">No dice rolls recorded yet.</p>
        <small class="text-muted opacity-75">Your last 20 rolls will appear here.</small>
      </div>
    `;
    return;
  }

  let html = '';
  history.forEach((entry, idx) => {
    if (entry.isCritical) {
      html += `
        <div class="p-2 rounded border border-warning shadow-sm" style="background: linear-gradient(135deg, rgba(35, 28, 5, 0.95) 0%, rgba(13, 17, 23, 0.95) 100%);">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <div class="d-flex align-items-center gap-1">
              <span class="badge bg-warning text-dark fw-bold px-1 py-0" style="font-size: 0.65rem;">
                <i class="fa-solid fa-crown me-1"></i>NAT 20
              </span>
              <span class="small text-warning fw-bold text-uppercase" style="font-size: 0.78rem;">${idx + 1}. ${entry.title}</span>
            </div>
            <span class="text-muted small" style="font-size: 0.72rem;"><i class="fa-regular fa-clock me-1"></i>${entry.timestamp}</span>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <div class="fs-4 fw-bold text-warning" style="text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);">${entry.total}</div>
            <small class="text-white-50 ms-2 text-end" style="font-size: 0.78rem;">${entry.details || ''}</small>
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="p-2 rounded border border-secondary shadow-sm" style="background: rgba(13, 17, 23, 0.9); border-color: rgba(0, 240, 255, 0.25) !important;">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="small text-cyan fw-bold text-uppercase" style="font-size: 0.78rem;">${idx + 1}. ${entry.title}</span>
            <span class="text-muted small" style="font-size: 0.72rem;"><i class="fa-regular fa-clock me-1"></i>${entry.timestamp}</span>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <div class="fs-4 fw-bold text-white">${entry.total}</div>
            <small class="text-muted ms-2 text-end" style="font-size: 0.78rem;">${entry.details || ''}</small>
          </div>
        </div>
      `;
    }
  });

  listEl.innerHTML = html;
}

function clearDiceHistory() {
  localStorage.removeItem('d20FuturePathRollHistory');
  renderDiceHistory();
}

async function handleExtraDamageRoll(config, currentToast) {
  if (currentToast && currentToast.parentNode) {
    currentToast.remove();
  }

  const { weaponName, formattedDmg, currentTotal, remainingPresses } = config;
  const extraDamageSelect = document.getElementById('global_extraDamage');
  const extraDamageVal = (extraDamageSelect ? parseInt(extraDamageSelect.value || '0', 10) : 0);

  try {
    let rollUrl = formattedDmg;
    if (/^d\d+/i.test(rollUrl)) {
      rollUrl = `1${rollUrl}`;
    }
    const resp = await fetch(`/v1/tasks/roll/${encodeURIComponent(rollUrl)}`);
    if (!resp.ok) {
      alert(`Failed to roll extra damage for ${weaponName}: HTTP ${resp.status}`);
      return;
    }
    const data = await resp.json();
    let rollTotal = 0;
    let rollDiceStr = '';
    if (data.Rolls && data.Rolls.length > 0) {
      rollTotal = data.Rolls[0].Total;
      if (data.Rolls[0].Dice) {
        rollDiceStr = `[Dice: ${data.Rolls[0].Dice.join(', ')}]`;
      }
    } else if (typeof data.Total === 'number') {
      rollTotal = data.Total;
    }

    if (extraDamageVal === 0) {
      // Major Hit Reroll Mechanic: compare new roll vs previous roll
      let finalTotal = currentTotal;
      let note = '';
      if (rollTotal > currentTotal) {
        finalTotal = rollTotal;
        note = `(Major Hit: Kept higher ${rollTotal} vs ${currentTotal} ${rollDiceStr})`;
      } else {
        finalTotal = currentTotal;
        note = `(Major Hit: Kept previous ${currentTotal} vs ${rollTotal} ${rollDiceStr})`;
      }
      showRollNotification(`<i class="fa-solid fa-burst me-1"></i>${weaponName} - Damage (Major Hit Reroll)`, finalTotal, note, false, null);
    } else {
      // Additive Mechanic: add to current total
      const newTotal = currentTotal + rollTotal;
      const currentRemaining = (typeof remainingPresses === 'number' ? remainingPresses : extraDamageVal);
      const nextRemaining = currentRemaining - 1;
      const detailStr = `(Added +${rollTotal} ${rollDiceStr}, Base: ${currentTotal})`;

      let nextConfig = null;
      if (nextRemaining > 0) {
        nextConfig = {
          weaponName,
          formattedDmg,
          currentTotal: newTotal,
          remainingPresses: nextRemaining
        };
      }

      showRollNotification(`<i class="fa-solid fa-burst me-1"></i>${weaponName} - Damage (+ Ex. Dmg)`, newTotal, detailStr, false, nextConfig);
    }
  } catch (err) {
    console.error('Error rolling extra damage:', err);
    alert(`Failed to roll extra damage: ${err.message}`);
  }
}

async function handleLuckRoll(isLucky, luckConfig, currentToast) {
  if (currentToast && currentToast.parentNode) {
    currentToast.remove();
  }

  const {
    title,
    currentTotal,
    currentD20,
    allDice,
    dString,
    luckCount,
    luckHistory
  } = luckConfig;

  try {
    const resp = await fetch('/v1/tasks/roll/d20');
    if (!resp.ok) {
      alert(`Failed to roll d20 for Luck: HTTP ${resp.status}`);
      return;
    }
    const data = await resp.json();
    let newD20 = 0;
    if (data.Rolls && data.Rolls.length > 0 &&
        data.Rolls[0].Dice && data.Rolls[0].Dice.length > 0) {
      newD20 = data.Rolls[0].Dice[0];
    } else if (typeof data.Total === 'number') {
      newD20 = data.Total;
    } else {
      newD20 = Math.floor(Math.random() * 20) + 1;
    }

    let keptD20 = currentD20;
    const label = (isLucky ? 'Lucky' : 'Unlucky');
    let note = '';

    if (isLucky) {
      keptD20 = Math.max(currentD20, newD20);
      note = `(Lucky: rolled d20 [${newD20}] vs [${currentD20}], kept ${keptD20})`;
    } else {
      keptD20 = Math.min(currentD20, newD20);
      note = `(Unlucky: rolled d20 [${newD20}] vs [${currentD20}], kept ${keptD20})`;
    }

    const diff = keptD20 - currentD20;
    const newTotal = currentTotal + diff;
    const isCritical = (keptD20 === 20);

    const updatedDice = (Array.isArray(allDice) && allDice.length > 0)
      ? [keptD20, ...allDice.slice(1)]
      : [keptD20];

    const diceBreakdown = formatDiceBreakdown(updatedDice, true, isCritical);
    const noteClass = (isLucky ? 'text-success' : 'text-danger');
    const detailStr = `${diceBreakdown} <span class="${noteClass}" style="font-size: 0.72rem;">${note}</span>`;

    const cleanTitle = title.replace(/\s*\((Lucky|Unlucky)\)/gi, '');
    const updatedTitle = `${cleanTitle} (${label})`;

    const nextCount = (typeof luckCount === 'number' ? luckCount : 0) + 1;
    let nextLuckConfig = null;
    if (nextCount < 2) {
      nextLuckConfig = {
        title: cleanTitle,
        currentTotal: newTotal,
        currentD20: keptD20,
        allDice: updatedDice,
        dString,
        luckCount: nextCount,
        luckHistory: [...(luckHistory || [currentD20]), newD20]
      };
    }

    showRollNotification(
      updatedTitle,
      newTotal,
      detailStr,
      isCritical,
      null,
      nextLuckConfig
    );
  } catch (err) {
    console.error('Error rolling luck:', err);
    alert(`Failed to roll luck: ${err.message}`);
  }
}

function showRollNotification(title, total, details = '', isCritical = false, extraDamageConfig = null, luckConfig = null) {
  recordDiceRoll(title, total, details, isCritical);

  let toastContainer = document.getElementById('rollToastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'rollToastContainer';
    toastContainer.style.position = 'fixed';
    toastContainer.style.bottom = '20px';
    toastContainer.style.right = '20px';
    toastContainer.style.zIndex = '1090';
    toastContainer.style.minWidth = '280px';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  let extraBtnHtml = '';
  if (extraDamageConfig) {
    const btnClass = (isCritical ? 'btn-outline-warning' : 'btn-cyber-outline');
    const extraStyles = (isCritical ? 'font-size: 0.72rem; line-height: 1.4;' : 'font-size: 0.72rem; border-color: #00f0ff; color: #00f0ff; line-height: 1.4;');
    extraBtnHtml = '<button type="button" class="btn ' + btnClass + ' btn-sm py-0 px-2 fw-bold extra-dmg-btn" style="' + extraStyles + '" title="Extra Damage / Major Hit Reroll">+ Ex. Dmg</button>';
  }

  let luckBtnsHtml = '';
  if (luckConfig && typeof luckConfig.currentD20 === 'number') {
    const luckyStyles = 'font-size: 0.72rem; border-color: #00ff88; color: #00ff88; line-height: 1.4;';
    const unluckyStyles = 'font-size: 0.72rem; border-color: #ff4466; color: #ff6688; line-height: 1.4;';
    luckBtnsHtml = '<button type="button" class="btn btn-outline-success btn-sm py-0 px-2 fw-bold lucky-btn" style="' + luckyStyles + '" title="Lucky Reroll (roll d20, take higher)">+ Lucky</button>' +
      '<button type="button" class="btn btn-outline-danger btn-sm py-0 px-2 fw-bold unlucky-btn" style="' + unluckyStyles + '" title="Unlucky Reroll (roll d20, take lower)">- UnLucky</button>';
  }

  if (isCritical) {
    toast.className = 'toast show align-items-center text-bg-dark border-warning shadow-lg mb-2 no-print';
    toast.style.background = 'linear-gradient(135deg, #1c1905 0%, #0d1117 100%)';
    toast.style.border = '2px solid #ffd700';
    toast.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.6), 0 0 35px rgba(255, 215, 0, 0.25)';
    toast.innerHTML = `
      <div class="d-flex p-2 align-items-center justify-content-between">
        <div>
          <div class="d-flex align-items-center gap-1">
            <span class="small text-uppercase text-warning fw-bold">${title}</span>
            <span class="badge bg-warning text-dark fw-bold px-1 py-0 ms-1" style="font-size: 0.68rem; letter-spacing: 0.5px;">
              <i class="fa-solid fa-star me-1"></i>NAT 20
            </span>
          </div>
          <div class="small fw-bold text-warning mt-1" style="font-size: 0.75rem; text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);">
            <i class="fa-solid fa-crown me-1"></i>CRITICAL SUCCESS!
          </div>
          <div class="fs-3 fw-bold text-warning mb-0 d-flex align-items-center flex-wrap gap-2" style="text-shadow: 0 0 10px rgba(255, 215, 0, 0.7);">
            <span>${total}</span>
            <small class="text-white-50 fs-6" style="font-size: 0.75rem;">${details}</small>
            ${extraBtnHtml}
            ${luckBtnsHtml}
          </div>
        </div>
        <button type="button" class="btn-close btn-close-white ms-3 align-self-start mt-1" onclick="this.closest('.toast').remove()"></button>
      </div>
    `;
  } else {
    toast.className = 'toast show align-items-center text-bg-dark border-cyan shadow-lg mb-2 no-print';
    toast.style.background = '#0d1117';
    toast.style.border = '1px solid #00f0ff';
    toast.style.boxShadow = '0 0 10px rgba(0,240,255,0.4)';
    toast.innerHTML = `
      <div class="d-flex p-2 align-items-center justify-content-between">
        <div>
          <div class="small text-uppercase text-cyan fw-bold">${title}</div>
          <div class="fs-4 fw-bold text-white mb-0 d-flex align-items-center flex-wrap gap-2">
            <span>${total}</span>
            <small class="text-muted fs-6" style="font-size: 0.75rem;">${details}</small>
            ${extraBtnHtml}
            ${luckBtnsHtml}
          </div>
        </div>
        <button type="button" class="btn-close btn-close-white ms-3 align-self-start mt-1" onclick="this.closest('.toast').remove()"></button>
      </div>
    `;
  }

  if (extraDamageConfig) {
    const extraBtn = toast.querySelector('.extra-dmg-btn');
    if (extraBtn) {
      extraBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleExtraDamageRoll(extraDamageConfig, toast);
      });
    }
  }

  if (luckConfig) {
    const luckyBtn = toast.querySelector('.lucky-btn');
    if (luckyBtn) {
      luckyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleLuckRoll(true, luckConfig, toast);
      });
    }
    const unluckyBtn = toast.querySelector('.unlucky-btn');
    if (unluckyBtn) {
      unluckyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleLuckRoll(false, luckConfig, toast);
      });
    }
  }

  toastContainer.appendChild(toast);

  setTimeout(() => {
    if (toast && toast.parentNode) {
      toast.remove();
    }
  }, isCritical ? 21000 : 15000);
}

function autoExpandTextarea(el) {
  if (!el) {
    return;
  }
  const oldHeight = el.offsetHeight || el.clientHeight || parseFloat(el.style.height) || 0;
  el.style.height = 'auto';
  const newHeight = el.scrollHeight;
  el.style.height = `${newHeight}px`;

  if (Math.abs(newHeight - oldHeight) > 2) {
    scheduleAutoPagination(500);
  }
}

function calculateTotalWeight() {
  const gearTable = document.getElementById('gearTable');
  if (!gearTable) {
    return;
  }

  const rows = gearTable.querySelectorAll('tbody tr');
  let totalWeight = 0;
  let hasValidWeight = false;

  rows.forEach((row) => {
    const weightInput = row.querySelector('input[name="gearWeight[]"]');
    const qtyInput = row.querySelector('input[name="gearQty[]"]');

    if (weightInput && weightInput.value.trim() !== '') {
      const rawWeightStr = weightInput.value.trim();
      const cleanStr = rawWeightStr.replace(/lbs?/gi, '').trim();
      const parsedWeight = parseFloat(cleanStr);

      if (!Number.isNaN(parsedWeight)) {
        let qty = 1;
        if (qtyInput && qtyInput.value.trim() !== '') {
          const parsedQty = parseFloat(qtyInput.value.trim());
          if (!Number.isNaN(parsedQty) && parsedQty > 0) {
            qty = parsedQty;
          }
        }
        totalWeight += (parsedWeight * qty);
        hasValidWeight = true;
      }
    }
  });

  const armorRows = document.querySelectorAll('#armorTable tbody tr.armor-main-row');
  armorRows.forEach((row) => {
    const weightInput = row.querySelector('input[name="armorWeight[]"]');
    if (weightInput && weightInput.value.trim() !== '') {
      const rawWeightStr = weightInput.value.trim();
      const cleanStr = rawWeightStr.replace(/lbs?/gi, '').trim();
      const parsedWeight = parseFloat(cleanStr);
      if (!Number.isNaN(parsedWeight)) {
        totalWeight += parsedWeight;
        hasValidWeight = true;
      }
    }
  });

  const totalInput = document.getElementById('equipmentCard_totalGearWeight') || document.getElementById('gearCard_totalGearWeight');
  if (totalInput) {
    if (hasValidWeight) {
      totalInput.value = (Number.isInteger(totalWeight) ? totalWeight : parseFloat(totalWeight.toFixed(2)));
    } else {
      totalInput.value = '';
    }
  }
}

function getWeaponProficiencyCount(isMelee) {
  const prefix = (isMelee ? 'meleeProf' : 'rangedProf');
  let count = 0;
  for (let i = 1; i <= 9; i += 1) {
    const chk = document.querySelector(`input[name="${prefix}${i}"]`);
    if (chk && chk.checked) {
      count += 1;
    }
  }
  return count;
}

async function rollWeaponCheck(btn) {
  const tr = btn.closest('tr');
  if (!tr) {
    return;
  }

  const nameIn = tr.querySelector('input[name="wepName[]"]');
  const weaponName = ((nameIn && nameIn.value.trim()) ? nameIn.value.trim() : 'Weapon');

  const lvlSel = tr.querySelector('select[name="wepLvl[]"]');
  const wepLvl = (lvlSel ? parseInt(lvlSel.value || '1', 10) : 1);

  const isMeleeChk = tr.querySelector('input[name="wepIsMelee[]"]');
  const isMelee = (isMeleeChk ? isMeleeChk.checked : false);

  const accIn = tr.querySelector('input[name="wepAtk[]"]');
  const accVal = (accIn ? parseInt(accIn.value.trim().replace('+', '') || '0', 10) : 0);

  const abilityKey = (isMelee ? 'STR' : 'DEX');
  const modEl = document.getElementById(`abilityScoresCard_mod${abilityKey}`);
  const abilityMod = (modEl ? parseInt(modEl.value || '0', 10) : 0);

  const profCount = getWeaponProficiencyCount(isMelee);
  const advDieSelect = document.getElementById('global_advantageDie');
  const advDieVal = (advDieSelect ? advDieSelect.value.trim() : '');
  const adModCount = getSelectedAdvantageMod();

  resetAdvantageMod();

  let accuracyFormula = 'd20';

  const staticAcc = (Number.isNaN(accVal) ? 0 : accVal);
  const staticAb = (Number.isNaN(abilityMod) ? 0 : abilityMod);
  const totalStaticBonus = staticAcc + staticAb;

  if (totalStaticBonus > 0) {
    accuracyFormula += `+${totalStaticBonus}`;
  } else if (totalStaticBonus < 0) {
    accuracyFormula += `${totalStaticBonus}`;
  }

  const baseAdCount = (wepLvl <= profCount && advDieVal ? 1 : 0);
  const totalAdCount = baseAdCount + adModCount;
  const advDieType = (advDieVal ? (advDieVal.startsWith('d') ? advDieVal : advDieVal.replace(/^\d+/, '')) : 'd4');

  if (totalAdCount > 0 && advDieVal) {
    accuracyFormula += `+${totalAdCount}${advDieType}`;
  } else if (totalAdCount < 0 && advDieVal) {
    accuracyFormula += `-${Math.abs(totalAdCount)}${advDieType}`;
  }

  const dmgIn = tr.querySelector('input[name="wepDmg[]"]');
  const dmgExpr = (dmgIn ? dmgIn.value.trim() : '');

  const iconEl = btn.querySelector('.fa-dice');
  if (iconEl) {
    iconEl.classList.add('fa-spin');
  }

  try {
    const accResp = await fetch(`/v1/tasks/roll/${encodeURIComponent(accuracyFormula)}`);
    if (!accResp.ok) {
      alert(`Failed to roll accuracy for ${weaponName}: HTTP ${accResp.status}`);
      return;
    }
    const accData = await accResp.json();
    let accTotal = 0;
    let accDetails = '';
    let accCritical = false;
    let accD20Val = null;
    let accAllDice = [];
    if (accData.Rolls && accData.Rolls.length > 0) {
      accTotal = accData.Rolls[0].Total;
      const dice = accData.Rolls[0].Dice;
      if (dice && Array.isArray(dice)) {
        accAllDice = dice;
        if (dice.length > 0) {
          accD20Val = dice[0];
          if (dice[0] === 20) {
            accCritical = true;
          }
        }
        accDetails = formatDiceBreakdown(dice, true, accCritical);
      }
    } else if (typeof accData.Total === 'number') {
      accTotal = accData.Total;
    }

    const accTitle = `<i class="fa-solid fa-crosshairs me-1"></i>${weaponName} - Accuracy (${accuracyFormula})`;
    const accLuckConfig = (typeof accD20Val === 'number' ? {
      title: accTitle,
      currentTotal: accTotal,
      currentD20: accD20Val,
      allDice: accAllDice,
      dString: accuracyFormula,
      luckCount: 0,
      luckHistory: [accD20Val]
    } : null);

    showRollNotification(accTitle, accTotal, accDetails, accCritical, null, accLuckConfig);

    if (dmgExpr) {
      let formattedDmg = dmgExpr;
      if (/^d\d+/i.test(formattedDmg)) {
        formattedDmg = `1${formattedDmg}`;
      }
      const strModEl = document.getElementById('abilityScoresCard_modSTR');
      const strMod = (strModEl ? parseInt(strModEl.value || '0', 10) : (isMelee ? abilityMod : 0));
      if (isMelee && !Number.isNaN(strMod) && strMod !== 0) {
        if (strMod > 0) {
          formattedDmg += `+${strMod}`;
        } else {
          formattedDmg += `${strMod}`;
        }
      }
      const dmgResp = await fetch(`/v1/tasks/roll/${encodeURIComponent(formattedDmg)}`);
      if (dmgResp.ok) {
        const dmgData = await dmgResp.json();
        let dmgTotal = 0;
        let dmgDetails = '';
        if (dmgData.Rolls && dmgData.Rolls.length > 0) {
          dmgTotal = dmgData.Rolls[0].Total;
          if (dmgData.Rolls[0].Dice) {
            dmgDetails = `[Dice: ${dmgData.Rolls[0].Dice.join(', ')}]`;
          }
        } else if (typeof dmgData.Total === 'number') {
          dmgTotal = dmgData.Total;
        }

        const extraDamageSelect = document.getElementById('global_extraDamage');
        const extraDmgSetting = (extraDamageSelect ? parseInt(extraDamageSelect.value || '0', 10) : 0);
        const extraDamageConfig = {
          weaponName: weaponName,
          formattedDmg: formattedDmg,
          currentTotal: dmgTotal,
          remainingPresses: extraDmgSetting
        };
        showRollNotification(`<i class="fa-solid fa-burst me-1"></i>${weaponName} - Damage (${formattedDmg})`, dmgTotal, dmgDetails, false, extraDamageConfig);
      }
    }
  } catch (err) {
    console.error('Error rolling weapon check:', err);
    alert(`Failed to roll weapon check: ${err.message}`);
  } finally {
    if (iconEl) {
      iconEl.classList.remove('fa-spin');
    }
  }
}

async function rollGrenadeDeviation(e) {
  if (e && typeof e.stopPropagation === 'function') {
    e.stopPropagation();
  }
  const btn = (e && e.currentTarget ? e.currentTarget : document.querySelector('.roll-grenade-btn'));
  const iconEl = (btn ? btn.querySelector('i') : null);
  if (iconEl) {
    iconEl.classList.add('fa-spin');
  }

  try {
    let d1 = Math.floor(Math.random() * 10) + 1;
    let d2 = Math.floor(Math.random() * 10) + 1;

    try {
      const resp = await fetch('/v1/tasks/roll/1d10+1d10');
      if (resp.ok) {
        const data = await resp.json();
        if (data.Rolls && data.Rolls.length > 0 && Array.isArray(data.Rolls[0].Dice) && data.Rolls[0].Dice.length >= 2) {
          d1 = data.Rolls[0].Dice[0];
          d2 = data.Rolls[0].Dice[1];
        }
      }
    } catch (fetchErr) {
      console.warn('Backend roll failed, falling back to client-side roll:', fetchErr);
    }

    const title = '<i class="fa-solid fa-burst me-1"></i>Blast / Grenade Deviation (1d10+1d10)';
    const totalStr = `Left/Right: ${d1} - Short/Long: ${d2}`;
    const details = `[Dice: ${d1}, ${d2}]`;

    showRollNotification(title, totalStr, details, false);
  } catch (err) {
    console.error('Error rolling grenade deviation:', err);
    alert(`Failed to roll grenade deviation: ${err.message}`);
  } finally {
    if (iconEl) {
      iconEl.classList.remove('fa-spin');
    }
  }
}

// Dynamic Row Adders
function addWeaponRow() {
  const tbody = document.querySelector('#weaponsTable tbody');
  const idx = tbody.querySelectorAll('tr.weapon-main-row').length;
  
  const tr1 = document.createElement('tr');
  tr1.classList.add('weapon-main-row');
  tr1.innerHTML = `
    <td><label class="visually-hidden" for="weaponsCard_wepName_${idx}">Wepname</label><input type="text" class="form-control form-control-sm" id="weaponsCard_wepName_${idx}" name="wepName[]"></td>
    <td class="text-center">
      <label class="visually-hidden" for="weaponsCard_wepLvl_${idx}">Weapon Level</label>
      <select class="form-select form-select-sm text-start ps-2 pe-1 fw-bold mx-auto" id="weaponsCard_wepLvl_${idx}" name="wepLvl[]" style="max-width: 58px;">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
      </select>
    </td>
    <td>
      <div class="input-group input-group-sm">
        <label class="visually-hidden" for="weaponsCard_wepDmg_${idx}">Wepdmg</label>
        <input type="text" class="form-control form-control-sm text-center px-1" id="weaponsCard_wepDmg_${idx}" name="wepDmg[]">
        <button type="button" class="btn btn-cyber-outline btn-sm px-2 no-print" onclick="rollWeaponCheck(this)" title="Roll Accuracy & Damage">
          <i class="fa-solid fa-dice text-cyan"></i>
        </button>
      </div>
    </td>
    <td><label class="visually-hidden" for="weaponsCard_wepAtk_${idx}">Wepatk</label><input type="text" class="form-control form-control-sm text-center" id="weaponsCard_wepAtk_${idx}" name="wepAtk[]"></td>
    <td><label class="visually-hidden" for="weaponsCard_wepAP_${idx}">Wepap</label><input type="text" class="form-control form-control-sm text-center" id="weaponsCard_wepAP_${idx}" name="wepAP[]"></td>
    <td><label class="visually-hidden" for="weaponsCard_wepCrit_${idx}">Wepcrit</label><input type="text" class="form-control form-control-sm text-center" id="weaponsCard_wepCrit_${idx}" name="wepCrit[]"></td>
    <td><label class="visually-hidden" for="weaponsCard_wepType_${idx}">Weptype</label><input type="text" class="form-control form-control-sm text-center" id="weaponsCard_wepType_${idx}" name="wepType[]"></td>
    <td>
      <div class="input-group input-group-sm">
        <div class="input-group-text px-1 no-print" title="Melee Weapon (checked = Melee, unchecked = Ranged)">
          <label class="visually-hidden" for="weaponsCard_wepIsMelee_${idx}">Melee Weapon</label><input class="form-check-input my-0" id="weaponsCard_wepIsMelee_${idx}" name="wepIsMelee[]" type="checkbox"/>
          <span class="ms-1 small fw-bold text-muted" style="font-size: 0.65rem;">M</span>
        </div>
        <label class="visually-hidden" for="weaponsCard_wepRange_${idx}">Weprange</label>
        <input type="text" class="form-control form-control-sm text-center px-1" id="weaponsCard_wepRange_${idx}" name="wepRange[]">
        <span class="input-group-text px-1">ft</span>
      </div>
    </td>
    <td><label class="visually-hidden" for="weaponsCard_wepAmmo_${idx}">Wepammo</label><input type="text" class="form-control form-control-sm text-center" id="weaponsCard_wepAmmo_${idx}" name="wepAmmo[]"></td>
    <td class="no-print text-center"><button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeRow(this)"><i class="fa-solid fa-trash"></i></button></td>
  `;
  
  const tr2 = document.createElement('tr');
  tr2.classList.add('weapon-notes-row');
  tr2.innerHTML = `
    <td colspan="10" class="pt-0 pb-2 border-bottom">
      <div class="input-group input-group-sm">
        <span class="input-group-text bg-transparent text-muted small fw-bold" style="font-size: 0.75rem;"><span class="d-none d-md-inline d-print-none">Notes &amp; Attributes:</span><span class="d-inline d-md-none d-print-inline">Attrs:</span></span>
        <label class="visually-hidden" for="weaponsCard_wepNotes_${idx}">Wepnotes</label><input type="text" class="form-control form-control-sm" id="weaponsCard_wepNotes_${idx}" name="wepNotes[]">
      </div>
    </td>
  `;

  tbody.appendChild(tr1);
  tbody.appendChild(tr2);
  triggerAutoSave();
  scheduleAutoPagination(100);
}

function updateCustomSkillAbility(select) {
  const row = select.closest('tr');
  const val = select.value;
  row.setAttribute('data-ability', val);
  const modInput = row.querySelector('.skill-ab-mod');
  ['str','dex','con','int','wis','cha'].forEach((ab) => {
    select.classList.remove(`text-ability-${ab}`);
    if (modInput) {
      modInput.classList.remove(`text-ability-${ab}`);
    }
  });
  if (val !== '-') {
    const abClass = `text-ability-${val.toLowerCase()}`;
    select.classList.add(abClass);
    if (modInput) {
      modInput.classList.add(abClass);
    }
  } else {
    if (modInput) {
      modInput.classList.add('text-muted');
    }
  }
}

function addArmorRow() {
  const tbody = document.querySelector('#armorTable tbody');
  
  const tr1 = document.createElement('tr');
  tr1.classList.add('armor-main-row');
  tr1.innerHTML = `
    <td><input type="text" class="form-control form-control-sm" name="armorName[]"></td>
    <td><input type="text" class="form-control form-control-sm text-center" name="armorACBonus[]"></td>
    <td><input type="text" class="form-control form-control-sm text-center" name="armorDR[]"></td>
    <td><input type="text" class="form-control form-control-sm text-center" name="armorMaxDex[]"></td>
    <td><input type="text" class="form-control form-control-sm text-center" name="armorWeight[]"></td>
    <td><input type="text" class="form-control form-control-sm text-center" name="armorSpeedPenalty[]"></td>
    <td class="no-print text-center"><button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeRow(this)"><i class="fa-solid fa-trash"></i></button></td>
  `;
  
  const tr2 = document.createElement('tr');
  tr2.classList.add('armor-notes-row');
  tr2.innerHTML = `
    <td colspan="7" class="pt-0 pb-2 border-bottom">
      <div class="input-group input-group-sm">
        <span class="input-group-text bg-transparent text-muted small fw-bold" style="font-size: 0.75rem;"><span class="d-none d-md-inline d-print-none">Bonus Attributes:</span><span class="d-inline d-md-none d-print-inline">Attrs:</span></span>
        <input type="text" class="form-control form-control-sm" name="armorBonusAttributes[]">
      </div>
    </td>
  `;

  tbody.appendChild(tr1);
  tbody.appendChild(tr2);
  triggerAutoSave();
  scheduleAutoPagination(100);
}

function addCustomSkillRow() {
  const tbody = document.querySelector('#customSkillsTable tbody');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" class="form-control form-control-sm" name="customSkillName[]" placeholder="Language / Skill Name"></td>
    <td><input type="text" inputmode="numeric" class="form-control form-control-sm" name="customSkillRank[]" placeholder="5"></td>
    <td><input type="text" class="form-control form-control-sm" name="customSkillNotes[]" placeholder="Fluency notes"></td>
    <td class="no-print text-center"><button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeRow(this)"><i class="fa-solid fa-trash"></i></button></td>
  `;
  tbody.appendChild(tr);
  triggerAutoSave();
  scheduleAutoPagination(100);
}

function addFeatSkillRow(name = '', rank = '', keyAbility = '-', miscMod = '') {
  const tbody = document.querySelector('#featSkillsTable tbody');
  if (!tbody) {
    return null;
  }
  const tr = document.createElement('tr');
  tr.setAttribute('data-ability', keyAbility || '-');

  tr.innerHTML = `
    <td><input class="form-control form-control-sm" name="customFeatSkillName[]" placeholder="Skill Name" type="text"/></td>
    <td class="text-center no-print">
      <i class="fa-solid fa-dice text-cyan roll-skill-btn" onclick="rollSkillCheck(this)" style="cursor: pointer;" title="Roll Skill Check"></i>
      <button type="button" class="btn btn-sm btn-link text-danger p-0 border-0 ms-1" onclick="removeRow(this)" title="Remove Skill"><i class="fa-solid fa-trash"></i></button>
    </td>
    <td>
      <div class="d-inline-flex align-items-center gap-1 justify-content-center">
        <input class="form-control form-control-sm skill-rank text-center" inputmode="numeric" name="skillRank_feat_custom[]" placeholder="0" maxlength="3" type="text"/>
        <span class="fw-bold text-cyan">=</span>
        <input class="form-control form-control-sm skill-die text-center" name="skillDie_feat_custom[]" type="text"/>
      </div>
    </td>
    <td class="text-center text-cyan fw-bold align-middle px-0">+</td>
    <td>
      <div class="d-inline-flex align-items-center gap-1">
        <select class="form-select form-select-sm skill-ab-select py-0 px-1" name="customFeatSkillAbility[]" onchange="updateCustomSkillAbility(this)" style="width: 54px; font-size: 0.75rem; font-weight: 700;">
          <option value="-">-</option>
          <option value="INT">INT</option>
          <option value="WIS">WIS</option>
          <option value="STR">STR</option>
          <option value="DEX">DEX</option>
          <option value="CON">CON</option>
          <option value="CHA">CHA</option>
        </select>
        <input class="form-control form-control-sm skill-ab-mod text-center py-0 px-1 text-muted" readonly="" maxlength="3" type="text" value="0"/>
      </div>
    </td>
    <td class="text-center text-cyan fw-bold align-middle px-0">+</td>
    <td><input class="form-control form-control-sm skill-misc-mod text-center" inputmode="numeric" name="skillMisc_feat_custom[]" placeholder="0" maxlength="3" type="text"/></td>
    <td class="text-center text-cyan fw-bold align-middle px-0">=</td>
    <td class="text-center"><span class="fw-bold text-cyan skill-total"></span></td>
  `;
  tbody.appendChild(tr);

  const nameInput = tr.querySelector('input[name="customFeatSkillName[]"]');
  if (nameInput && name) {
    nameInput.value = name;
  }
  const rankInput = tr.querySelector('.skill-rank');
  if (rankInput && rank !== '' && rank !== undefined && rank !== null) {
    rankInput.value = rank;
  }
  const miscInput = tr.querySelector('.skill-misc-mod');
  if (miscInput && miscMod !== '' && miscMod !== undefined && miscMod !== null) {
    miscInput.value = miscMod;
  }
  const abSelect = tr.querySelector('.skill-ab-select');
  if (abSelect && keyAbility) {
    abSelect.value = keyAbility;
    if (typeof updateCustomSkillAbility === 'function') {
      updateCustomSkillAbility(abSelect);
    }
  }

  if (typeof calculateStats === 'function') {
    calculateStats();
  }
  triggerAutoSave();
  scheduleAutoPagination(100);
  return tr;
}

function addLangSkillRow(name = '', rank = '', miscMod = '') {
  const tbody = document.querySelector('#langSkillsTable tbody');
  if (!tbody) {
    return null;
  }
  const tr = document.createElement('tr');
  tr.setAttribute('data-ability', '-');

  tr.innerHTML = `
    <td><input class="form-control form-control-sm" name="customLangName[]" placeholder="Language / Dialect" type="text"/></td>
    <td class="text-center no-print">
      <i class="fa-solid fa-dice text-cyan roll-skill-btn" onclick="rollSkillCheck(this)" style="cursor: pointer;" title="Roll Skill Check"></i>
      <button type="button" class="btn btn-sm btn-link text-danger p-0 border-0 ms-1" onclick="removeRow(this)" title="Remove Skill"><i class="fa-solid fa-trash"></i></button>
    </td>
    <td>
      <div class="d-inline-flex align-items-center gap-1 justify-content-center">
        <input class="form-control form-control-sm skill-rank text-center" inputmode="numeric" name="skillRank_lang_custom[]" placeholder="0" maxlength="3" type="text"/>
        <span class="fw-bold text-cyan">=</span>
        <input class="form-control form-control-sm skill-die text-center" name="skillDie_lang_custom[]" type="text"/>
      </div>
    </td>
    <td class="text-center text-cyan fw-bold align-middle px-0">+</td>
    <td><input class="form-control form-control-sm skill-misc-mod text-center" inputmode="numeric" name="skillMisc_lang_custom[]" placeholder="0" maxlength="3" type="text"/></td>
    <td class="text-center text-cyan fw-bold align-middle px-0">=</td>
    <td class="text-center"><span class="fw-bold text-cyan skill-total"></span></td>
  `;
  tbody.appendChild(tr);

  const nameInput = tr.querySelector('input[name="customLangName[]"]');
  if (nameInput && name) {
    nameInput.value = name;
  }
  const rankInput = tr.querySelector('.skill-rank');
  if (rankInput && rank !== '' && rank !== undefined && rank !== null) {
    rankInput.value = rank;
  }
  const miscInput = tr.querySelector('.skill-misc-mod');
  if (miscInput && miscMod !== '' && miscMod !== undefined && miscMod !== null) {
    miscInput.value = miscMod;
  }

  if (typeof calculateStats === 'function') {
    calculateStats();
  }
  triggerAutoSave();
  scheduleAutoPagination(100);
  return tr;
}

function addLanguageCustomSkillRow() {
  addFeatSkillRow();
  addLangSkillRow();
}

function addTechniqueLevelBlock(levelVal) {
  const container = document.getElementById('techniqueLevelsContainer');
  if (!container) {
    return;
  }

  if (levelVal === undefined || levelVal === null) {
    const existingBlocks = container.querySelectorAll('.technique-level-block');
    levelVal = existingBlocks.length;
    if (levelVal > 5) {
      levelVal = 5;
    }
  }

  const div = document.createElement('div');
  div.className = 'technique-level-block border rounded p-3 bg-opacity-10 bg-secondary';
  div.innerHTML = `
    <div class="row g-2 align-items-center mb-3">
      <div class="col-6 col-sm-3 col-md-2">
        <div class="input-group input-group-sm">
          <span class="input-group-text fw-bold text-muted" style="font-size: 0.75rem;">Level:</span>
          <input type="text" class="form-control form-control-sm text-center fw-bold" name="techLevel[]" value="${levelVal}">
        </div>
      </div>
      <div class="col-12 col-sm-9 col-md-3">
        <div class="input-group input-group-sm">
          <span class="input-group-text fw-bold text-muted" style="font-size: 0.75rem;">Profession:</span>
          <input type="text" class="form-control form-control-sm fw-bold" name="techProfession[]" data-list="professionDatalist" autocomplete="off" placeholder="e.g. Cyberneticist">
          <button class="btn btn-cyber-outline btn-sm px-2 no-print" type="button" onclick="toggleDatalist(this.previousElementSibling)" title="Show Profession Suggestions">
            <i class="fa-solid fa-chevron-down"></i>
          </button>
        </div>
      </div>
      <div class="col-4 col-sm-3 col-md-2">
        <div class="input-group input-group-sm">
          <span class="input-group-text fw-bold text-muted" style="font-size: 0.75rem;">DC:</span>
          <input type="text" class="form-control form-control-sm text-center fw-bold text-cyan" name="techDC[]" placeholder="10">
        </div>
      </div>
      <div class="col-4 col-sm-3 col-md-2">
        <div class="input-group input-group-sm">
          <span class="input-group-text fw-bold text-muted" style="font-size: 0.75rem;">Learned:</span>
          <input type="text" class="form-control form-control-sm text-center fw-bold" name="techLearned[]" placeholder="0">
        </div>
      </div>
      <div class="col-4 col-sm-3 col-md-1">
        <div class="input-group input-group-sm">
          <span class="input-group-text fw-bold text-muted" style="font-size: 0.75rem;">Uses:</span>
          <input type="text" class="form-control form-control-sm text-center fw-bold" name="techUses[]" placeholder="0">
        </div>
      </div>
      <div class="col-4 col-sm-3 col-md-1">
        <div class="input-group input-group-sm">
          <span class="input-group-text fw-bold text-muted" style="font-size: 0.75rem;">Used:</span>
          <input type="text" class="form-control form-control-sm text-center fw-bold" name="techUsed[]" placeholder="0">
        </div>
      </div>
      <div class="col-12 col-md-1 text-end no-print ms-auto">
        <button type="button" class="btn btn-sm btn-outline-danger py-1 px-2" onclick="removeTechniqueLevelBlock(this)" title="Remove Technique Level">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>

    <div class="border rounded overflow-hidden">
      <div class="table-responsive">
        <table class="table table-custom mb-0 align-middle techniques-sub-table">
          <thead>
            <tr>
              <th style="width: 200px;">Technique Name</th>
              <th style="width: 100px;">Range</th>
              <th>Description</th>
              <th style="width: 110px;" class="no-print text-center">
                <button type="button" class="btn btn-sm btn-cyber btn-add-row py-0 px-2" onclick="addTechniqueRow(this)" style="font-size: 0.72rem;">
                  <i class="fa-solid fa-plus me-1"></i> Technique
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="text" class="form-control form-control-sm" name="techName[]" placeholder="Technique Name"></td>
              <td><input type="text" class="form-control form-control-sm" name="techRange[]" placeholder="Range"></td>
              <td><textarea class="form-control form-control-sm trait-desc-textarea" name="techEffect[]" rows="1" oninput="autoExpandTextarea(this)" placeholder="Description"></textarea></td>
              <td class="no-print text-center"><button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeRow(this)"><i class="fa-solid fa-trash"></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
  container.appendChild(div);
  const newTechProfInput = div.querySelector('input[name="techProfession[]"]');
  if (newTechProfInput && professionsList !== undefined && Array.isArray(professionsList) && professionsList.length > 0) {
    const randomProf = professionsList[Math.floor(Math.random() * professionsList.length)];
    newTechProfInput.placeholder = `e.g. ${randomProf}`;
  }
  triggerAutoSave();
  scheduleAutoPagination(100);
}

function removeTechniqueLevelBlock(btn) {
  const block = btn.closest('.technique-level-block');
  if (block) {
    block.remove();
    triggerAutoSave();
    scheduleAutoPagination(100);
  }
}

function addTechniqueRow(btn) {
  let tbody = null;
  if (btn) {
    const block = btn.closest('.technique-level-block') || btn.closest('.sheet-card');
    if (block) {
      tbody = block.querySelector('.techniques-sub-table tbody') || block.querySelector('table tbody');
    }
  }
  if (!tbody) {
    tbody = document.querySelector('.techniques-sub-table tbody') || document.querySelector('#techniquesTable tbody');
  }
  if (!tbody) {
    return;
  }

  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" class="form-control form-control-sm" name="techName[]" placeholder="Technique Name"></td>
    <td><input type="text" class="form-control form-control-sm" name="techRange[]" placeholder="Range"></td>
    <td><textarea class="form-control form-control-sm trait-desc-textarea" name="techEffect[]" rows="1" oninput="autoExpandTextarea(this)" placeholder="Description"></textarea></td>
    <td class="no-print text-center"><button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeRow(this)"><i class="fa-solid fa-trash"></i></button></td>
  `;
  tbody.appendChild(tr);
  triggerAutoSave();
  scheduleAutoPagination(100);
}

function addGearRow() {
  const tbody = document.querySelector('#gearTable tbody');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" class="form-control form-control-sm" name="gearItem[]"></td>
    <td><input type="text" class="form-control form-control-sm" name="gearQty[]"></td>
    <td><input type="text" class="form-control form-control-sm" name="gearWeight[]"></td>
    <td><input type="text" class="form-control form-control-sm" name="gearTL[]"></td>
    <td><input type="text" class="form-control form-control-sm" name="gearNotes[]"></td>
    <td class="no-print text-center"><button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeRow(this)"><i class="fa-solid fa-trash"></i></button></td>
  `;
  tbody.appendChild(tr);
  triggerAutoSave();
  scheduleAutoPagination(100);
}

function addSpeciesTraitRow() {
  const tbody = document.querySelector('#speciesTraitsTable tbody');
  if (!tbody) {
    return;
  }
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" class="form-control form-control-sm" name="speciesTraitName[]"></td>
    <td><textarea class="form-control form-control-sm trait-desc-textarea" name="speciesTraitDesc[]" rows="1" oninput="autoExpandTextarea(this)"></textarea></td>
    <td class="no-print text-center"><button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeRow(this)"><i class="fa-solid fa-trash"></i></button></td>
  `;
  tbody.appendChild(tr);
  triggerAutoSave();
  scheduleAutoPagination(100);
}

function addPathTalentRow() {
  const tbody = document.querySelector('#pathTalentsTable tbody');
  if (!tbody) {
    return;
  }
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" class="form-control form-control-sm" name="pathTalentName[]"></td>
    <td><textarea class="form-control form-control-sm trait-desc-textarea" name="pathTalentDesc[]" rows="1" oninput="autoExpandTextarea(this)"></textarea></td>
    <td class="no-print text-center"><button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeRow(this)"><i class="fa-solid fa-trash"></i></button></td>
  `;
  tbody.appendChild(tr);
  triggerAutoSave();
  scheduleAutoPagination(100);
}

function addFeatRow() {
  const tbody = document.querySelector('#featsTable tbody');
  if (!tbody) {
    return;
  }
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" class="form-control form-control-sm" name="featName[]"></td>
    <td><textarea class="form-control form-control-sm trait-desc-textarea" name="featDesc[]" rows="1" oninput="autoExpandTextarea(this)"></textarea></td>
    <td class="no-print text-center"><button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeRow(this)"><i class="fa-solid fa-trash"></i></button></td>
  `;
  tbody.appendChild(tr);
  triggerAutoSave();
  scheduleAutoPagination(100);
}

function onQuirkNameInput(input) {
  if (!input) {
    return;
  }
  const nameVal = input.value.trim().toLowerCase();
  if (!nameVal) {
    return;
  }

  const row = input.closest('tr');
  if (!row) {
    return;
  }
  const descTextarea = row.querySelector('textarea[name="quirkDesc[]"]');
  if (!descTextarea) {
    return;
  }

  if (quirksData && quirksData.length > 0) {
    const match = quirksData.find((q) => {
      const qName = q.Name || q.name || '';
      return qName.trim().toLowerCase() === nameVal;
    });
    if (match) {
      const qDesc = match.Description || match.description || match.Penalty || '';
      if (qDesc) {
        descTextarea.value = qDesc;
        autoExpandTextarea(descTextarea);
        triggerAutoSave();
      }
    }
  }
}

function addQuirkRow(name = '', desc = '') {
  const tbody = document.querySelector('#quirksTable tbody');
  if (!tbody) {
    return;
  }
  const idx = tbody.children.length;
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>
      <div class="input-group input-group-sm">
        <label class="visually-hidden" for="quirksCard_quirkName_${idx}">Quirk Name</label>
        <input class="form-control form-control-sm" id="quirksCard_quirkName_${idx}" data-list="quirksDatalist" autocomplete="off" name="quirkName[]" placeholder="Quirk or Flaw Name" type="text" onchange="onQuirkNameInput(this)"/>
        <button class="btn btn-cyber-outline btn-sm px-2 no-print" onclick="toggleDatalist(this.previousElementSibling)" title="Show Quirk Suggestions" type="button">
          <i class="fa-solid fa-chevron-down"></i>
        </button>
      </div>
    </td>
    <td>
      <label class="visually-hidden" for="quirksCard_quirkDesc_${idx}">Quirk Description</label>
      <textarea class="form-control form-control-sm trait-desc-textarea" id="quirksCard_quirkDesc_${idx}" name="quirkDesc[]" oninput="autoExpandTextarea(this)" placeholder="Description" rows="1"></textarea>
    </td>
    <td class="no-print text-center">
      <button class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeRow(this)" type="button"><i class="fa-solid fa-trash"></i></button>
    </td>
  `;
  tbody.appendChild(tr);

  const nameInput = tr.querySelector('input[name="quirkName[]"]');
  const descTextarea = tr.querySelector('textarea[name="quirkDesc[]"]');
  if (nameInput && name) {
    nameInput.value = name;
  }
  if (descTextarea && desc) {
    descTextarea.value = desc;
    autoExpandTextarea(descTextarea);
  } else if (nameInput && name && !desc) {
    onQuirkNameInput(nameInput);
  }

  triggerAutoSave();
  scheduleAutoPagination(100);
}

function onDetractorNameInput(input) {
  if (!input) {
    return;
  }
  const nameVal = input.value.trim().toLowerCase();
  if (!nameVal) {
    return;
  }

  const row = input.closest('tr');
  if (!row) {
    return;
  }
  const descTextarea = row.querySelector('textarea[name="detractorDesc[]"]');
  if (!descTextarea) {
    return;
  }

  if (detractorsData && detractorsData.length > 0) {
    const match = detractorsData.find((d) => {
      const dName = d.Name || d.name || '';
      return dName.trim().toLowerCase() === nameVal;
    });
    if (match) {
      const dDesc = match.Description || match.description || match.Penalty || '';
      if (dDesc) {
        descTextarea.value = dDesc;
        autoExpandTextarea(descTextarea);
        triggerAutoSave();
      }
    }
  }
}

function addDetractorRow(name = '', desc = '') {
  const tbody = document.querySelector('#detractorsTable tbody');
  if (!tbody) {
    return;
  }
  const idx = tbody.children.length;
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>
      <div class="input-group input-group-sm">
        <label class="visually-hidden" for="detractorsCard_detractorName_${idx}">Detractor Name</label>
        <input class="form-control form-control-sm" id="detractorsCard_detractorName_${idx}" data-list="detractorsDatalist" autocomplete="off" name="detractorName[]" placeholder="Detractor Name" type="text" onchange="onDetractorNameInput(this)"/>
        <button class="btn btn-cyber-outline btn-sm px-2 no-print" onclick="toggleDatalist(this.previousElementSibling)" title="Show Detractor Suggestions" type="button">
          <i class="fa-solid fa-chevron-down"></i>
        </button>
      </div>
    </td>
    <td>
      <label class="visually-hidden" for="detractorsCard_detractorDesc_${idx}">Detractor Description</label>
      <textarea class="form-control form-control-sm trait-desc-textarea" id="detractorsCard_detractorDesc_${idx}" name="detractorDesc[]" oninput="autoExpandTextarea(this)" placeholder="Description" rows="1"></textarea>
    </td>
    <td class="no-print text-center">
      <button class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeRow(this)" type="button"><i class="fa-solid fa-trash"></i></button>
    </td>
  `;
  tbody.appendChild(tr);

  const nameInput = tr.querySelector('input[name="detractorName[]"]');
  const descTextarea = tr.querySelector('textarea[name="detractorDesc[]"]');
  if (nameInput && name) {
    nameInput.value = name;
  }
  if (descTextarea && desc) {
    descTextarea.value = desc;
    autoExpandTextarea(descTextarea);
  } else if (nameInput && name && !desc) {
    onDetractorNameInput(nameInput);
  }

  triggerAutoSave();
  scheduleAutoPagination(100);
}

function addCyberImplantRow(name = '', desc = '') {
  const tbody = document.querySelector('#cyberImplantsTable tbody');
  if (!tbody) {
    return;
  }
  const idx = tbody.children.length;
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>
      <label class="visually-hidden" for="cyberneticsCard_implantName_${idx}">Implant Name</label>
      <input class="form-control form-control-sm" id="cyberneticsCard_implantName_${idx}" name="implantName[]" placeholder="Implant Name" type="text"/>
    </td>
    <td>
      <label class="visually-hidden" for="cyberneticsCard_implantDesc_${idx}">Implant Description</label>
      <textarea class="form-control form-control-sm trait-desc-textarea" id="cyberneticsCard_implantDesc_${idx}" name="implantDesc[]" oninput="autoExpandTextarea(this)" placeholder="Description" rows="1"></textarea>
    </td>
    <td class="no-print text-center">
      <button class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeRow(this)" type="button"><i class="fa-solid fa-trash"></i></button>
    </td>
  `;
  tbody.appendChild(tr);

  const nameInput = tr.querySelector('input[name="implantName[]"]');
  const descTextarea = tr.querySelector('textarea[name="implantDesc[]"]');
  if (nameInput && name) {
    nameInput.value = name;
  }
  if (descTextarea && desc) {
    descTextarea.value = desc;
    autoExpandTextarea(descTextarea);
  }

  triggerAutoSave();
  scheduleAutoPagination(100);
}

function addCyberDrawbackRow(name = '', desc = '') {
  const tbody = document.querySelector('#cyberDrawbacksTable tbody');
  if (!tbody) {
    return;
  }
  const idx = tbody.children.length;
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>
      <label class="visually-hidden" for="cyberneticsCard_drawbackName_${idx}">Drawback Name</label>
      <input class="form-control form-control-sm" id="cyberneticsCard_drawbackName_${idx}" name="cyberDrawbackName[]" placeholder="Drawback Name" type="text"/>
    </td>
    <td>
      <label class="visually-hidden" for="cyberneticsCard_drawbackDesc_${idx}">Drawback Description</label>
      <textarea class="form-control form-control-sm trait-desc-textarea" id="cyberneticsCard_drawbackDesc_${idx}" name="cyberDrawbackDesc[]" oninput="autoExpandTextarea(this)" placeholder="Description" rows="1"></textarea>
    </td>
    <td class="no-print text-center">
      <button class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeRow(this)" type="button"><i class="fa-solid fa-trash"></i></button>
    </td>
  `;
  tbody.appendChild(tr);

  const nameInput = tr.querySelector('input[name="cyberDrawbackName[]"]');
  const descTextarea = tr.querySelector('textarea[name="cyberDrawbackDesc[]"]');
  if (nameInput && name) {
    nameInput.value = name;
  }
  if (descTextarea && desc) {
    descTextarea.value = desc;
    autoExpandTextarea(descTextarea);
  }

  triggerAutoSave();
  scheduleAutoPagination(100);
}

function addMutationDrawbackRow(name = '', desc = '', mp = '') {
  const tbody = document.querySelector('#mutationsDrawbacksTable tbody');
  if (!tbody) {
    return;
  }
  const idx = tbody.children.length;
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>
      <div class="input-group input-group-sm">
        <label class="visually-hidden" for="mutationsCard_drawbackName_${idx}">Mutation Drawback Name</label>
        <input class="form-control form-control-sm" id="mutationsCard_drawbackName_${idx}" data-list="mutationDrawbacksDatalist" autocomplete="off" name="mutationDrawbackName[]" onchange="onMutationDrawbackNameInput(this)" oninput="onMutationDrawbackNameInput(this)" placeholder="Drawback Name" type="text"/>
        <button class="btn btn-cyber-outline btn-sm px-2 no-print" onclick="toggleDatalist(this.previousElementSibling)" title="Show Drawback Suggestions" type="button">
          <i class="fa-solid fa-chevron-down"></i>
        </button>
      </div>
    </td>
    <td>
      <label class="visually-hidden" for="mutationsCard_drawbackMP_${idx}">MP</label>
      <input class="form-control form-control-sm text-center fw-bold" id="mutationsCard_drawbackMP_${idx}" name="mutationDrawbackMP[]" oninput="calculateMutationsMPTotals()" placeholder="0" type="text"/>
    </td>
    <td>
      <label class="visually-hidden" for="mutationsCard_drawbackDesc_${idx}">Mutation Drawback Description</label>
      <textarea class="form-control form-control-sm trait-desc-textarea" id="mutationsCard_drawbackDesc_${idx}" name="mutationDrawbackDesc[]" oninput="autoExpandTextarea(this)" placeholder="Description" rows="1"></textarea>
    </td>
    <td class="no-print text-center">
      <button class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeRow(this)" type="button"><i class="fa-solid fa-trash"></i></button>
    </td>
  `;
  tbody.appendChild(tr);

  const nameInput = tr.querySelector('input[name="mutationDrawbackName[]"]');
  const descTextarea = tr.querySelector('textarea[name="mutationDrawbackDesc[]"]');
  const mpInput = tr.querySelector('input[name="mutationDrawbackMP[]"]');

  if (nameInput && name) {
    nameInput.value = name;
  }
  if (descTextarea && desc) {
    descTextarea.value = desc;
    autoExpandTextarea(descTextarea);
  }
  if (mpInput && mp !== undefined) {
    mpInput.value = mp;
  }

  calculateMutationsMPTotals();
  triggerAutoSave();
  scheduleAutoPagination(100);
}

function addMutationEnhancementRow(name = '', desc = '', mp = '') {
  const tbody = document.querySelector('#mutationsEnhancementsTable tbody');
  if (!tbody) {
    return;
  }
  const idx = tbody.children.length;
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>
      <div class="input-group input-group-sm">
        <label class="visually-hidden" for="mutationsCard_enhancementName_${idx}">Mutation Enhancement Name</label>
        <input class="form-control form-control-sm" id="mutationsCard_enhancementName_${idx}" data-list="mutationEnhancementsDatalist" autocomplete="off" name="mutationEnhancementName[]" onchange="onMutationEnhancementNameInput(this)" oninput="onMutationEnhancementNameInput(this)" placeholder="Enhancement Name" type="text"/>
        <button class="btn btn-cyber-outline btn-sm px-2 no-print" onclick="toggleDatalist(this.previousElementSibling)" title="Show Enhancement Suggestions" type="button">
          <i class="fa-solid fa-chevron-down"></i>
        </button>
      </div>
    </td>
    <td>
      <label class="visually-hidden" for="mutationsCard_enhancementMP_${idx}">MP</label>
      <input class="form-control form-control-sm text-center fw-bold" id="mutationsCard_enhancementMP_${idx}" name="mutationEnhancementMP[]" oninput="calculateMutationsMPTotals()" placeholder="0" type="text"/>
    </td>
    <td>
      <label class="visually-hidden" for="mutationsCard_enhancementDesc_${idx}">Mutation Enhancement Description</label>
      <textarea class="form-control form-control-sm trait-desc-textarea" id="mutationsCard_enhancementDesc_${idx}" name="mutationEnhancementDesc[]" oninput="autoExpandTextarea(this)" placeholder="Description" rows="1"></textarea>
    </td>
    <td class="no-print text-center">
      <button class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeRow(this)" type="button"><i class="fa-solid fa-trash"></i></button>
    </td>
  `;
  tbody.appendChild(tr);

  const nameInput = tr.querySelector('input[name="mutationEnhancementName[]"]');
  const descTextarea = tr.querySelector('textarea[name="mutationEnhancementDesc[]"]');
  const mpInput = tr.querySelector('input[name="mutationEnhancementMP[]"]');

  if (nameInput && name) {
    nameInput.value = name;
  }
  if (descTextarea && desc) {
    descTextarea.value = desc;
    autoExpandTextarea(descTextarea);
  }
  if (mpInput && mp !== undefined) {
    mpInput.value = mp;
  }

  calculateMutationsMPTotals();
  triggerAutoSave();
  scheduleAutoPagination(100);
}

function addPsionicDrawbackRow(name = '', desc = '', mp = '') {
  const tbody = document.querySelector('#psionicsDrawbacksTable tbody');
  if (!tbody) {
    return;
  }
  const idx = tbody.children.length;
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>
      <div class="input-group input-group-sm">
        <label class="visually-hidden" for="psionicsCard_drawbackName_${idx}">Psionic Drawback Name</label>
        <input class="form-control form-control-sm" id="psionicsCard_drawbackName_${idx}" data-list="mutationDrawbacksDatalist" autocomplete="off" name="psionicDrawbackName[]" onchange="onMutationDrawbackNameInput(this)" oninput="onMutationDrawbackNameInput(this)" placeholder="Drawback Name" type="text"/>
        <button class="btn btn-cyber-outline btn-sm px-2 no-print" onclick="toggleDatalist(this.previousElementSibling)" title="Show Drawback Suggestions" type="button">
          <i class="fa-solid fa-chevron-down"></i>
        </button>
      </div>
    </td>
    <td>
      <label class="visually-hidden" for="psionicsCard_drawbackMP_${idx}">MP</label>
      <input class="form-control form-control-sm text-center fw-bold" id="psionicsCard_drawbackMP_${idx}" name="psionicDrawbackMP[]" placeholder="0" type="text"/>
    </td>
    <td>
      <label class="visually-hidden" for="psionicsCard_drawbackDesc_${idx}">Psionic Drawback Description</label>
      <textarea class="form-control form-control-sm trait-desc-textarea" id="psionicsCard_drawbackDesc_${idx}" name="psionicDrawbackDesc[]" oninput="autoExpandTextarea(this)" placeholder="Description" rows="1"></textarea>
    </td>
    <td class="no-print text-center">
      <button class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeRow(this)" type="button"><i class="fa-solid fa-trash"></i></button>
    </td>
  `;
  tbody.appendChild(tr);

  const nameInput = tr.querySelector('input[name="psionicDrawbackName[]"]');
  const descTextarea = tr.querySelector('textarea[name="psionicDrawbackDesc[]"]');
  const mpInput = tr.querySelector('input[name="psionicDrawbackMP[]"]');

  if (nameInput && name) {
    nameInput.value = name;
  }
  if (descTextarea && desc) {
    descTextarea.value = desc;
    autoExpandTextarea(descTextarea);
  }
  if (mpInput && mp !== undefined) {
    mpInput.value = mp;
  }

  triggerAutoSave();
  scheduleAutoPagination(100);
}

function addPsionicLevelBlock(levelData = {}) {
  const container = document.getElementById('psionicLevelsContainer');
  if (!container) {
    return;
  }

  const idx = container.children.length;
  const div = document.createElement('div');
  div.className = 'psionic-level-block border rounded p-3 bg-opacity-10 bg-secondary';
  div.innerHTML = `
    <div class="row g-2 align-items-center mb-3 psionic-meta-row">
      <div class="col-6 col-sm-3 col-md-2">
        <div class="input-group input-group-sm">
          <span class="input-group-text fw-bold text-muted" style="font-size: 0.75rem;"><span class="d-none d-sm-inline d-print-none">Level</span><span class="d-inline d-sm-none d-print-inline">Lvl</span>:</span>
          <label class="visually-hidden" for="psionicsCard_psionicLevel_${idx}">Level</label>
          <input class="form-control form-control-sm text-center fw-bold" id="psionicsCard_psionicLevel_${idx}" name="psionicLevel[]" type="text" value="${(levelData.level !== undefined ? levelData.level : idx)}"/>
        </div>
      </div>
      <div class="col-12 col-sm-9 col-md-3">
        <div class="input-group input-group-sm">
          <span class="input-group-text fw-bold text-muted" style="font-size: 0.75rem;"><span class="d-none d-sm-inline d-print-none">Psionic Type</span><span class="d-inline d-sm-none d-print-inline">Type</span>:</span>
          <label class="visually-hidden" for="psionicsCard_psionicType_${idx}">Psionic Type</label>
          <input class="form-control form-control-sm fw-bold" id="psionicsCard_psionicType_${idx}" name="psionicType[]" placeholder="e.g. Telepathy" type="text"/>
        </div>
      </div>
      <div class="col-4 col-sm-3 col-md-2">
        <div class="input-group input-group-sm">
          <span class="input-group-text fw-bold text-muted" style="font-size: 0.75rem;">DC:</span>
          <label class="visually-hidden" for="psionicsCard_psionicDC_${idx}">DC</label>
          <input class="form-control form-control-sm text-center fw-bold text-cyan" id="psionicsCard_psionicDC_${idx}" name="psionicDC[]" placeholder="10" type="text"/>
        </div>
      </div>
      <div class="col-4 col-sm-3 col-md-2">
        <div class="input-group input-group-sm">
          <span class="input-group-text fw-bold text-muted" style="font-size: 0.75rem;"><span class="d-none d-sm-inline d-print-none">Learned</span><span class="d-inline d-sm-none d-print-inline">Lrnd</span>:</span>
          <label class="visually-hidden" for="psionicsCard_psionicLearned_${idx}">Learned</label>
          <input class="form-control form-control-sm text-center fw-bold" id="psionicsCard_psionicLearned_${idx}" name="psionicLearned[]" placeholder="0" type="text"/>
        </div>
      </div>
      <div class="col-4 col-sm-3 col-md-1">
        <div class="input-group input-group-sm">
          <span class="input-group-text fw-bold text-muted" style="font-size: 0.75rem;">Uses:</span>
          <label class="visually-hidden" for="psionicsCard_psionicUses_${idx}">Uses</label>
          <input class="form-control form-control-sm text-center fw-bold" id="psionicsCard_psionicUses_${idx}" name="psionicUses[]" placeholder="0" type="text"/>
        </div>
      </div>
      <div class="col-4 col-sm-3 col-md-1">
        <div class="input-group input-group-sm">
          <span class="input-group-text fw-bold text-muted" style="font-size: 0.75rem;">Used:</span>
          <label class="visually-hidden" for="psionicsCard_psionicUsed_${idx}">Used</label>
          <input class="form-control form-control-sm text-center fw-bold" id="psionicsCard_psionicUsed_${idx}" name="psionicUsed[]" placeholder="0" type="text"/>
        </div>
      </div>
      <div class="col-12 col-md-1 text-end no-print ms-auto">
        <button class="btn btn-sm btn-outline-danger py-1 px-2" onclick="removePsionicLevelBlock(this)" title="Remove Psionic Level" type="button">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
    <div class="border rounded overflow-hidden">
      <div class="table-responsive">
        <table class="table table-custom mb-0 align-middle psionic-sub-table">
          <thead>
            <tr>
              <th style="width: 200px;">Technique Name</th>
              <th style="width: 100px;">Range</th>
              <th>Description</th>
              <th class="no-print text-center" style="width: 110px;">
                <button class="btn btn-sm btn-cyber btn-add-row py-0 px-2" onclick="addPsionicTechniqueRow(this)" style="font-size: 0.72rem;" type="button">
                  <i class="fa-solid fa-plus me-1"></i> Technique
                </button>
              </th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  `;
  container.appendChild(div);

  const typeInput = div.querySelector('input[name="psionicType[]"]');
  const dcInput = div.querySelector('input[name="psionicDC[]"]');
  const learnedInput = div.querySelector('input[name="psionicLearned[]"]');
  const usesInput = div.querySelector('input[name="psionicUses[]"]');
  const usedInput = div.querySelector('input[name="psionicUsed[]"]');

  if (typeInput && levelData.type !== undefined) {
    typeInput.value = levelData.type;
  }
  if (dcInput && levelData.dc !== undefined) {
    dcInput.value = levelData.dc;
  }
  if (learnedInput && levelData.learned !== undefined) {
    learnedInput.value = levelData.learned;
  }
  if (usesInput && levelData.uses !== undefined) {
    usesInput.value = levelData.uses;
  }
  if (usedInput && levelData.used !== undefined) {
    usedInput.value = levelData.used;
  }

  const tbody = div.querySelector('.psionic-sub-table tbody');
  if (tbody && Array.isArray(levelData.techniquesList) && levelData.techniquesList.length > 0) {
    levelData.techniquesList.forEach((tech) => {
      const tName = (typeof tech === 'object' ? (tech.Name || tech.name || '') : tech);
      const tRange = (typeof tech === 'object' ? (tech.Range || tech.range || '') : '');
      const tDesc = (typeof tech === 'object' ? (tech.Description || tech.description || '') : '');
      addPsionicTechniqueRow(tbody, tName, tRange, tDesc);
    });
  } else if (tbody) {
    addPsionicTechniqueRow(tbody);
  }

  triggerAutoSave();
}

function addPsionicTechniqueRow(btnOrTable, name = '', range = '', desc = '') {
  let tbody = null;
  if (btnOrTable && btnOrTable.tagName === 'TBODY') {
    tbody = btnOrTable;
  } else if (btnOrTable && btnOrTable.closest) {
    const table = btnOrTable.closest('table');
    if (table) {
      tbody = table.querySelector('tbody');
    }
  }
  if (!tbody) {
    return;
  }

  const idx = tbody.children.length;
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><label class="visually-hidden" for="psionicsCard_psionicTechName_${idx}">Technique Name</label><input class="form-control form-control-sm" id="psionicsCard_psionicTechName_${idx}" name="psionicTechName[]" placeholder="Technique Name" type="text"/></td>
    <td><label class="visually-hidden" for="psionicsCard_psionicTechRange_${idx}">Range</label><input class="form-control form-control-sm" id="psionicsCard_psionicTechRange_${idx}" name="psionicTechRange[]" placeholder="Range" type="text"/></td>
    <td><label class="visually-hidden" for="psionicsCard_psionicTechDesc_${idx}">Description</label><textarea class="form-control form-control-sm trait-desc-textarea" id="psionicsCard_psionicTechDesc_${idx}" name="psionicTechDesc[]" oninput="autoExpandTextarea(this)" placeholder="Description" rows="1"></textarea></td>
    <td class="no-print text-center"><button class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeRow(this)" type="button"><i class="fa-solid fa-trash"></i></button></td>
  `;
  tbody.appendChild(tr);

  const nameInput = tr.querySelector('input[name="psionicTechName[]"]');
  const rangeInput = tr.querySelector('input[name="psionicTechRange[]"]');
  const descTextarea = tr.querySelector('textarea[name="psionicTechDesc[]"]');

  if (nameInput && name) {
    nameInput.value = name;
  }
  if (rangeInput && range) {
    rangeInput.value = range;
  }
  if (descTextarea && desc) {
    descTextarea.value = desc;
    autoExpandTextarea(descTextarea);
  }

  triggerAutoSave();
  scheduleAutoPagination(100);
}

function removePsionicLevelBlock(btn) {
  const block = btn.closest('.psionic-level-block');
  if (block) {
    block.remove();
    triggerAutoSave();
    scheduleAutoPagination(100);
  }
}

function onMutationDrawbackNameInput(inputEl) {
  if (!inputEl) {
    return;
  }
  const val = inputEl.value.trim().toLowerCase();
  if (!val || !window.mutationDrawbacksReferenceData) {
    return;
  }
  const match = window.mutationDrawbacksReferenceData.find((item) => String(item.Name || '').toLowerCase() === val);
  if (match) {
    const tr = inputEl.closest('tr');
    if (tr) {
      const descEl = tr.querySelector('textarea[name="mutationDrawbackDesc[]"], textarea[name="psionicDrawbackDesc[]"]');
      const mpEl = tr.querySelector('input[name="mutationDrawbackMP[]"], input[name="psionicDrawbackMP[]"]');
      if (descEl && !descEl.value) {
        descEl.value = match.Drawback || match.Description || '';
        autoExpandTextarea(descEl);
      }
      if (mpEl && !mpEl.value && match.MPValue !== undefined) {
        mpEl.value = match.MPValue;
        calculateMutationsMPTotals();
      }
    }
  }
}

function onMutationEnhancementNameInput(inputEl) {
  if (!inputEl) {
    return;
  }
  const val = inputEl.value.trim().toLowerCase();
  if (!val || !window.mutationEnhancementsReferenceData) {
    return;
  }
  let match = null;
  const dataObj = window.mutationEnhancementsReferenceData;
  const categories = ['cosmetic', 'offensive', 'defensive', 'enhancements'];
  categories.forEach((cat) => {
    if (match || !Array.isArray(dataObj[cat])) {
      return;
    }
    const found = dataObj[cat].find((item) => String(item.Name || '').toLowerCase() === val);
    if (found) {
      match = found;
    }
  });
  if (match) {
    const tr = inputEl.closest('tr');
    if (tr) {
      const descEl = tr.querySelector('textarea[name="mutationEnhancementDesc[]"]');
      const mpEl = tr.querySelector('input[name="mutationEnhancementMP[]"]');
      if (descEl && !descEl.value) {
        descEl.value = match.Benefit || match.Description || '';
        autoExpandTextarea(descEl);
      }
      if (mpEl && !mpEl.value && match['MP Cost'] !== undefined) {
        mpEl.value = match['MP Cost'];
        calculateMutationsMPTotals();
      }
    }
  }
}

function calculateMutationsMPTotals() {
  const drawbacksTable = document.getElementById('mutationsDrawbacksTable');
  const enhancementsTable = document.getElementById('mutationsEnhancementsTable');
  const earnedInput = document.getElementById('mutationsCard_mpEarned');
  const spentInput = document.getElementById('mutationsCard_mpSpent');

  let earnedTotal = 0;
  if (drawbacksTable) {
    drawbacksTable.querySelectorAll('tbody tr').forEach((row) => {
      const mpEl = row.querySelector('input[name="mutationDrawbackMP[]"]');
      if (mpEl) {
        const val = parseFloat(mpEl.value) || 0;
        earnedTotal += val;
      }
    });
  }

  let spentTotal = 0;
  if (enhancementsTable) {
    enhancementsTable.querySelectorAll('tbody tr').forEach((row) => {
      const mpEl = row.querySelector('input[name="mutationEnhancementMP[]"]');
      if (mpEl) {
        const val = parseFloat(mpEl.value) || 0;
        spentTotal += val;
      }
    });
  }

  if (earnedInput) {
    earnedInput.value = (earnedTotal > 0 ? earnedTotal : '0');
  }
  if (spentInput) {
    spentInput.value = (spentTotal > 0 ? spentTotal : '0');
  }
}

function addProfessionBlock() {
  const container = document.getElementById('professionsContainer');
  if (!container) {
    return;
  }

  const div = document.createElement('div');
  div.className = 'profession-block border rounded p-3 bg-opacity-10 bg-secondary';
  div.innerHTML = `
    <div class="row g-2 align-items-center mb-3">
      <div class="col-12 col-md-5">
        <div class="input-group input-group-sm">
          <span class="input-group-text fw-bold text-muted" style="font-size: 0.75rem;">Title:</span>
          <input type="text" class="form-control form-control-sm fw-bold" name="profTitle[]" data-list="professionDatalist" autocomplete="off" onchange="handleProfessionChange(this)" placeholder="e.g. Combat Medic">
          <button class="btn btn-cyber-outline btn-sm px-2 no-print" type="button" onclick="toggleDatalist(this.previousElementSibling)" title="Show Profession Suggestions">
            <i class="fa-solid fa-chevron-down"></i>
          </button>
        </div>
      </div>
      <div class="col-6 col-md-2">
        <div class="input-group input-group-sm">
          <span class="input-group-text fw-bold text-muted" style="font-size: 0.75rem;">Level:</span>
          <input type="text" class="form-control form-control-sm text-center fw-bold" name="profLevel[]" placeholder="1">
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="d-flex align-items-center gap-1 flex-wrap">
          <span class="small fw-bold text-muted me-1 prof-affinity-label" style="font-size: 0.65rem;">Affinities:</span>
          <button type="button" class="btn btn-sm affinity-tag tag-str py-0 px-2 fw-bold" onclick="toggleAffinityTag(this, 'STR')">STR</button>
          <button type="button" class="btn btn-sm affinity-tag tag-dex py-0 px-2 fw-bold" onclick="toggleAffinityTag(this, 'DEX')">DEX</button>
          <button type="button" class="btn btn-sm affinity-tag tag-con py-0 px-2 fw-bold" onclick="toggleAffinityTag(this, 'CON')">CON</button>
          <button type="button" class="btn btn-sm affinity-tag tag-int py-0 px-2 fw-bold" onclick="toggleAffinityTag(this, 'INT')">INT</button>
          <button type="button" class="btn btn-sm affinity-tag tag-wis py-0 px-2 fw-bold" onclick="toggleAffinityTag(this, 'WIS')">WIS</button>
          <button type="button" class="btn btn-sm affinity-tag tag-cha py-0 px-2 fw-bold" onclick="toggleAffinityTag(this, 'CHA')">CHA</button>
          <input type="hidden" name="profAffinities[]" class="prof-affinities-input" value="">
        </div>
      </div>
      <div class="col-12 col-md-1 text-end no-print">
        <button type="button" class="btn btn-sm btn-outline-danger py-1 px-2" onclick="removeProfessionBlock(this)" title="Remove Profession">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>

    <div class="border rounded overflow-hidden">
      <div class="table-responsive">
        <table class="table table-custom mb-0 align-middle prof-talents-table">
          <thead>
            <tr>
              <th style="width: 200px;">Name</th>
              <th>Description</th>
              <th style="width: 100px;" class="no-print text-center">
                <button type="button" class="btn btn-sm btn-cyber btn-add-row py-0 px-2" onclick="addProfTalentRow(this)" style="font-size: 0.72rem;">
                  <i class="fa-solid fa-plus me-1"></i> Talent
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="text" class="form-control form-control-sm" name="profTalentName[]"></td>
              <td><textarea class="form-control form-control-sm trait-desc-textarea" name="profTalentDesc[]" rows="1" oninput="autoExpandTextarea(this)"></textarea></td>
              <td class="no-print text-center"><button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeRow(this)"><i class="fa-solid fa-trash"></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
  container.appendChild(div);
  const newInput = div.querySelector('input[name="profTitle[]"]');
  if (newInput && professionsList !== undefined && Array.isArray(professionsList) && professionsList.length > 0) {
    const randomProf = professionsList[Math.floor(Math.random() * professionsList.length)];
    newInput.placeholder = `e.g. ${randomProf}`;
  }
  triggerAutoSave();
  scheduleAutoPagination(100);
}

function toggleAffinityTag(btn, ability) {
  btn.classList.toggle('active');
  const block = btn.closest('.profession-block');
  if (!block) {
    return;
  }

  const activeTags = Array.from(block.querySelectorAll('.affinity-tag.active')).map((b) => b.innerText.trim());
  const hiddenInput = block.querySelector('.prof-affinities-input');
  if (hiddenInput) {
    hiddenInput.value = activeTags.join(',');
  }

  if (btn.classList.contains('active')) {
    const abCode = getAbilityCode(ability);
    if (abCode) {
      enableAbilityThemeCheckbox(abCode);
    }
  }

  triggerAutoSave();
}

function removeProfessionBlock(btn) {
  const block = btn.closest('.profession-block');
  if (block) {
    block.remove();
    triggerAutoSave();
    scheduleAutoPagination(500);
  }
}

function addProfTalentRow(btn) {
  const block = btn.closest('.profession-block');
  if (!block) {
    return;
  }
  const tbody = block.querySelector('.prof-talents-table tbody');
  if (!tbody) {
    return;
  }

  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" class="form-control form-control-sm" name="profTalentName[]"></td>
    <td><textarea class="form-control form-control-sm trait-desc-textarea" name="profTalentDesc[]" rows="1" oninput="autoExpandTextarea(this)"></textarea></td>
    <td class="no-print text-center"><button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeRow(this)"><i class="fa-solid fa-trash"></i></button></td>
  `;
  tbody.appendChild(tr);
  triggerAutoSave();
  scheduleAutoPagination(500);
}

function getProfInput(prefix, i) {
  return document.querySelector(`[name="${prefix}${i}"]`) || 
         document.querySelector(`[id$="${prefix}${i}"]`) || 
         document.getElementById(prefix + i);
}

function updateProficiencyCounts() {
  const groups = [
    { prefix: 'techProf', countId: 'techProfCount', max: 4 },
    { prefix: 'armorProf', countId: 'armorProfCount', max: 10 },
    { prefix: 'meleeProf', countId: 'meleeProfCount', max: 9 },
    { prefix: 'rangedProf', countId: 'rangedProfCount', max: 9 },
    { prefix: 'itemCraftProf', countId: 'itemCraftProfCount', max: 2 },
    { prefix: 'powerArmorProf', countId: 'powerArmorProfCount', max: 5 }
  ];

  groups.forEach((grp) => {
    const prefix = grp.prefix;
    const countId = grp.countId;
    const max = grp.max;
    let count = 0;
    for (let i = 1; i <= max; i += 1) {
      const chk = getProfInput(prefix, i);
      if (chk && chk.checked) {
        count += 1;
      }
    }
    const el = document.getElementById(countId) || document.querySelector(`#${countId}`);
    if (el) {
      el.innerText = count;
    }
  });
}

function handleWeaponProficiencyChange(prefix, num, max, isChecked) {
  if (isChecked) {
    for (let i = 1; i <= max; i += 1) {
      const chk = getProfInput(prefix, i);
      if (chk) {
        chk.checked = (i <= num);
      }
    }
  } else {
    for (let i = 1; i <= max; i += 1) {
      const chk = getProfInput(prefix, i);
      if (chk) {
        chk.checked = (i < num);
      }
    }
  }
  updateProficiencyCounts();
  triggerAutoSave();
}

function handleArmorProficiencyChange(num, isChecked) {
  handleWeaponProficiencyChange('armorProf', num, 10, isChecked);
}

function handleItemCraftProficiencyChange(num, isChecked) {
  handleWeaponProficiencyChange('itemCraftProf', num, 2, isChecked);
}

function removeRow(btn) {
  const tr = btn.closest('tr');
  if (tr) {
    if (tr.nextElementSibling && (tr.nextElementSibling.classList.contains('weapon-notes-row') || tr.nextElementSibling.classList.contains('armor-notes-row'))) {
      tr.nextElementSibling.remove();
    }
    tr.remove();
  }
  calculateStats();
  triggerAutoSave();
  scheduleAutoPagination(500);
}

// Auto-Save & JSON Export/Import
let autoSaveTimeout = null;
function triggerAutoSave() {
  if (isPopulatingForm) {
    return;
  }
  clearTimeout(autoSaveTimeout);
  autoSaveTimeout = setTimeout(() => {
    saveToLocalStorage();
  }, 500);
}

function getFormDataObj() {
  const form = document.getElementById('characterForm');
  if (!form) {
    return {};
  }

  const structured = {};
  const cardEls = form.querySelectorAll('.sheet-card');

  cardEls.forEach((card) => {
    const cardId = card.id || 'Speeds';

    if (cardId === 'armorDefensesCard') {
      const armorsList = [];
      const mainRows = card.querySelectorAll('#armorTable tbody tr.armor-main-row');

      mainRows.forEach((mainRow) => {
        const nameInput = mainRow.querySelector('input[name="armorName[]"]');
        const name = (nameInput ? nameInput.value.trim() : '');

        // Skip any table row that does not have a 'Name' entry
        if (!name) {
          return;
        }

        const acBonusEl = mainRow.querySelector('input[name="armorACBonus[]"]');
        const drEl = mainRow.querySelector('input[name="armorDR[]"]');
        const maxDexEl = mainRow.querySelector('input[name="armorMaxDex[]"]');
        const weightEl = mainRow.querySelector('input[name="armorWeight[]"]');
        const speedPenEl = mainRow.querySelector('input[name="armorSpeedPenalty[]"]');

        const acBonus = (acBonusEl ? acBonusEl.value.trim() : '');
        const drVal = (drEl ? drEl.value.trim() : '');
        const maxDex = (maxDexEl ? maxDexEl.value.trim() : '');
        const weightVal = (weightEl ? weightEl.value.trim() : '');
        const speedPen = (speedPenEl ? speedPenEl.value.trim() : '');

        const notesRow = mainRow.nextElementSibling;
        let bonusAttrs = '';
        if (notesRow && notesRow.classList.contains('armor-notes-row')) {
          const bonusAttrsEl = notesRow.querySelector('input[name="armorBonusAttributes[]"]');
          bonusAttrs = (bonusAttrsEl ? bonusAttrsEl.value.trim() : '');
        }

        armorsList.push({
          "Name": name,
          "AC Bonus": acBonus,
          "DR": drVal,
          "Max Dex": maxDex,
          "Weight": weightVal,
          "Speed Penalty": speedPen,
          "Bonus Attributes": bonusAttrs
        });
      });

      let armorProfCount = 0;
      for (let i = 1; i <= 10; i += 1) {
        const chk = card.querySelector(`[name="armorProf${i}"]`) || document.getElementById(`armorProf${i}`);
        if (chk && chk.checked) {
          armorProfCount += 1;
        }
      }

      structured.armorDefensesCard = {
        "armorProfCount": armorProfCount,
        "armorsList": armorsList
      };
      return;
    }

    if (cardId === 'weaponsCard') {
      const weaponsList = [];
      const mainRows = card.querySelectorAll('#weaponsTable tbody tr.weapon-main-row');

      mainRows.forEach((mainRow) => {
        const nameInput = mainRow.querySelector('input[name="wepName[]"]');
        const name = (nameInput ? nameInput.value.trim() : '');
        if (!name) {
          return;
        }
        const lvlEl = mainRow.querySelector('select[name="wepLvl[]"]');
        const lvl = (lvlEl ? lvlEl.value : '1');
        const dmgEl = mainRow.querySelector('input[name="wepDmg[]"]');
        const atkEl = mainRow.querySelector('input[name="wepAtk[]"]');
        const apEl = mainRow.querySelector('input[name="wepAP[]"]');
        const critEl = mainRow.querySelector('input[name="wepCrit[]"]');
        const typeEl = mainRow.querySelector('input[name="wepType[]"]');
        const rangeEl = mainRow.querySelector('input[name="wepRange[]"]');
        const isMeleeEl = mainRow.querySelector('input[name="wepIsMelee[]"]');
        const ammoEl = mainRow.querySelector('input[name="wepAmmo[]"]');

        const dmg = (dmgEl ? dmgEl.value.trim() : '');
        const atk = (atkEl ? atkEl.value.trim() : '');
        const ap = (apEl ? apEl.value.trim() : '');
        const crit = (critEl ? critEl.value.trim() : '');
        const type = (typeEl ? typeEl.value.trim() : '');
        const range = (rangeEl ? rangeEl.value.trim() : '');
        const isMelee = (isMeleeEl ? isMeleeEl.checked : false);
        const ammo = (ammoEl ? ammoEl.value.trim() : '');

        const notesRow = mainRow.nextElementSibling;
        let notes = '';
        if (notesRow && notesRow.classList.contains('weapon-notes-row')) {
          const notesEl = notesRow.querySelector('input[name="wepNotes[]"]');
          notes = (notesEl ? notesEl.value.trim() : '');
        }

        weaponsList.push({
          "Name": name,
          "Lvl": lvl,
          "Damage": dmg,
          "Accuracy": atk,
          "AP": ap,
          "Critical": crit,
          "Type": type,
          "Range": range,
          "isMelee": isMelee,
          "Ammo": ammo,
          "Notes": notes
        });
      });

      let meleeProfCount = 0;
      for (let i = 1; i <= 9; i += 1) {
        const chk = card.querySelector(`[name="meleeProf${i}"]`);
        if (chk && chk.checked) {
          meleeProfCount += 1;
        }
      }
      let rangedProfCount = 0;
      for (let i = 1; i <= 9; i += 1) {
        const chk = card.querySelector(`[name="rangedProf${i}"]`);
        if (chk && chk.checked) {
          rangedProfCount += 1;
        }
      }

      structured.weaponsCard = {
        "meleeProfCount": meleeProfCount,
        "rangedProfCount": rangedProfCount,
        "weaponsList": weaponsList
      };
      return;
    }

    if (cardId === 'coreSkills' || cardId === 'coreSkillsCard') {
      const skillsPerLevelEl = card.querySelector('[name="skillsPerLevel"]');
      const unusedSkillPointsEl = card.querySelector('[name="unusedSkillPoints"]');
      const skillsPerLevel = (skillsPerLevelEl ? skillsPerLevelEl.value : '0');
      const unusedSkillPoints = (unusedSkillPointsEl ? unusedSkillPointsEl.value : '0');

      const skillsList = [];
      const rows = card.querySelectorAll('#skillsTable tbody tr');

      rows.forEach((row) => {
        let name = '';
        const td = row.querySelectorAll('td')[1];
        if (td) {
          const clone = td.cloneNode(true);
          clone.querySelectorAll('.badge, .no-print').forEach((b) => b.remove());
          name = clone.textContent.trim();
        }

        if (!name) {
          return;
        }

        const rankEl = row.querySelector('.skill-rank');
        const rankVal = (rankEl ? rankEl.value.trim() : undefined);
        const rank = ((rankVal !== undefined && rankVal !== '') ? (parseInt(rankVal, 10) || 0) : 0);

        let keyAbility = row.getAttribute('data-ability') || '-';
        const abEl = row.querySelector('select.skill-ab-select, span[class*="text-ability-"], td:nth-child(6) span');
        if (abEl) {
          keyAbility = (abEl.value || abEl.textContent || '').trim();
        }

        const miscEl = row.querySelector('.skill-misc-mod');
        const miscVal = (miscEl ? miscEl.value.trim() : undefined);
        const miscMod = ((miscVal !== undefined && miscVal !== '') ? (parseInt(miscVal, 10) || 0) : 0);

        const checkEl = row.querySelector('.form-check-input');
        const favored = Boolean(checkEl && checkEl.checked);

        skillsList.push({
          "Name": name,
          "Favored": favored,
          "Rank": rank,
          "Key Ability": keyAbility,
          "MiscMod": miscMod
        });
      });

      structured.coreSkills = {
        "skillsPerLevel": skillsPerLevel,
        "unusedSkillPoints": unusedSkillPoints,
        "skillsList": skillsList
      };
      return;
    }

    if (cardId === 'speciesTraitsCard') {
      const speciesTraitsList = [];
      const rows = card.querySelectorAll('#speciesTraitsTable tbody tr');

      rows.forEach((row) => {
        const nameInput = row.querySelector('input[name="speciesTraitName[]"]');
        const name = (nameInput ? nameInput.value.trim() : '');

        // Skip any table row that does not have a 'Name' entry
        if (!name) {
          return;
        }

        const descEl = row.querySelector('textarea[name="speciesTraitDesc[]"]');
        const desc = (descEl ? descEl.value.trim() : '');

        speciesTraitsList.push({
          "Name": name,
          "Description": desc
        });
      });

      structured.speciesTraitsCard = {
        "speciesTraitsList": speciesTraitsList
      };
      return;
    }

    if (cardId === 'quirksCard') {
      const quirksList = [];
      const rows = card.querySelectorAll('#quirksTable tbody tr');

      rows.forEach((row) => {
        const nameInput = row.querySelector('input[name="quirkName[]"]');
        const name = (nameInput ? nameInput.value.trim() : '');

        if (!name) {
          return;
        }

        const descEl = row.querySelector('textarea[name="quirkDesc[]"]');
        const desc = (descEl ? descEl.value.trim() : '');

        quirksList.push({
          "Name": name,
          "Description": desc
        });
      });

      structured.quirksCard = {
        "quirksList": quirksList
      };
      return;
    }

    if (cardId === 'detractorsCard') {
      const detractorsList = [];
      const rows = card.querySelectorAll('#detractorsTable tbody tr');

      rows.forEach((row) => {
        const nameInput = row.querySelector('input[name="detractorName[]"]');
        const name = (nameInput ? nameInput.value.trim() : '');

        if (!name) {
          return;
        }

        const descEl = row.querySelector('textarea[name="detractorDesc[]"]');
        const desc = (descEl ? descEl.value.trim() : '');

        detractorsList.push({
          "Name": name,
          "Description": desc
        });
      });

      structured.detractorsCard = {
        "detractorsList": detractorsList
      };
      return;
    }

    if (cardId === 'cyberneticsCard') {
      const cyborgLevel = card.querySelector('input[name="cyborgLevel"]')?.value.trim() || '';
      const frameworkTechLevel = card.querySelector('input[name="frameworkTechLevel"]')?.value.trim() || '';
      const frameworkMasterworked = card.querySelector('input[name="frameworkMasterworked"]')?.value.trim() || '';
      const power = card.querySelector('input[name="cyberPower"]')?.value.trim() || '';
      const slots = card.querySelector('input[name="cyberSlots"]')?.value.trim() || '';

      const implantsList = [];
      card.querySelectorAll('#cyberImplantsTable tbody tr').forEach((row) => {
        const nameInput = row.querySelector('input[name="implantName[]"]');
        const name = (nameInput ? nameInput.value.trim() : '');
        if (!name) {
          return;
        }
        const descEl = row.querySelector('textarea[name="implantDesc[]"]');
        const desc = (descEl ? descEl.value.trim() : '');
        implantsList.push({ "Name": name, "Description": desc });
      });

      const drawbacksList = [];
      card.querySelectorAll('#cyberDrawbacksTable tbody tr').forEach((row) => {
        const nameInput = row.querySelector('input[name="cyberDrawbackName[]"]');
        const name = (nameInput ? nameInput.value.trim() : '');
        if (!name) {
          return;
        }
        const descEl = row.querySelector('textarea[name="cyberDrawbackDesc[]"]');
        const desc = (descEl ? descEl.value.trim() : '');
        drawbacksList.push({ "Name": name, "Description": desc });
      });

      structured.cyberneticsCard = {
        "cyborgLevel": cyborgLevel,
        "frameworkTechLevel": frameworkTechLevel,
        "frameworkMasterworked": frameworkMasterworked,
        "power": power,
        "slots": slots,
        "implantsList": implantsList,
        "drawbacksList": drawbacksList
      };
      return;
    }

    if (cardId === 'mutationsCard') {
      const drawbacksList = [];
      card.querySelectorAll('#mutationsDrawbacksTable tbody tr').forEach((row) => {
        const nameInput = row.querySelector('input[name="mutationDrawbackName[]"]');
        const name = (nameInput ? nameInput.value.trim() : '');
        if (!name) {
          return;
        }
        const descEl = row.querySelector('textarea[name="mutationDrawbackDesc[]"]');
        const desc = (descEl ? descEl.value.trim() : '');
        const mpEl = row.querySelector('input[name="mutationDrawbackMP[]"]');
        const mp = (mpEl ? mpEl.value.trim() : '');
        drawbacksList.push({ "Name": name, "Description": desc, "MP": mp });
      });

      const enhancementsList = [];
      card.querySelectorAll('#mutationsEnhancementsTable tbody tr').forEach((row) => {
        const nameInput = row.querySelector('input[name="mutationEnhancementName[]"]');
        const name = (nameInput ? nameInput.value.trim() : '');
        if (!name) {
          return;
        }
        const descEl = row.querySelector('textarea[name="mutationEnhancementDesc[]"]');
        const desc = (descEl ? descEl.value.trim() : '');
        const mpEl = row.querySelector('input[name="mutationEnhancementMP[]"]');
        const mp = (mpEl ? mpEl.value.trim() : '');
        enhancementsList.push({ "Name": name, "Description": desc, "MP": mp });
      });

      const earnedInput = document.getElementById('mutationsCard_mpEarned');
      const spentInput = document.getElementById('mutationsCard_mpSpent');

      structured.mutationsCard = {
        "mpEarned": (earnedInput ? earnedInput.value : '0'),
        "mpSpent": (spentInput ? spentInput.value : '0'),
        "drawbacksList": drawbacksList,
        "enhancementsList": enhancementsList
      };
      return;
    }

    if (cardId === 'psionicsCard') {
      const drawbacksList = [];
      card.querySelectorAll('#psionicsDrawbacksTable tbody tr').forEach((row) => {
        const nameInput = row.querySelector('input[name="psionicDrawbackName[]"]');
        const name = (nameInput ? nameInput.value.trim() : '');
        if (!name) {
          return;
        }
        const descEl = row.querySelector('textarea[name="psionicDrawbackDesc[]"]');
        const desc = (descEl ? descEl.value.trim() : '');
        const mpEl = row.querySelector('input[name="psionicDrawbackMP[]"]');
        const mp = (mpEl ? mpEl.value.trim() : '');
        drawbacksList.push({ "Name": name, "Description": desc, "MP": mp });
      });

      const levelsList = [];
      card.querySelectorAll('#psionicLevelsContainer .psionic-level-block').forEach((block) => {
        const lvlInput = block.querySelector('input[name="psionicLevel[]"]');
        const typeInput = block.querySelector('input[name="psionicType[]"]');
        const dcInput = block.querySelector('input[name="psionicDC[]"]');
        const learnedInput = block.querySelector('input[name="psionicLearned[]"]');
        const usesInput = block.querySelector('input[name="psionicUses[]"]');
        const usedInput = block.querySelector('input[name="psionicUsed[]"]');

        const techniquesList = [];
        block.querySelectorAll('.psionic-sub-table tbody tr').forEach((row) => {
          const tNameInput = row.querySelector('input[name="psionicTechName[]"]');
          const tName = (tNameInput ? tNameInput.value.trim() : '');
          if (!tName) {
            return;
          }
          const tRangeInput = row.querySelector('input[name="psionicTechRange[]"]');
          const tRange = (tRangeInput ? tRangeInput.value.trim() : '');
          const tDescInput = row.querySelector('textarea[name="psionicTechDesc[]"]');
          const tDesc = (tDescInput ? tDescInput.value.trim() : '');
          techniquesList.push({ "Name": tName, "Range": tRange, "Description": tDesc });
        });

        levelsList.push({
          "level": (lvlInput ? lvlInput.value.trim() : ''),
          "type": (typeInput ? typeInput.value.trim() : ''),
          "dc": (dcInput ? dcInput.value.trim() : ''),
          "learned": (learnedInput ? learnedInput.value.trim() : ''),
          "uses": (usesInput ? usesInput.value.trim() : ''),
          "used": (usedInput ? usedInput.value.trim() : ''),
          "techniquesList": techniquesList
        });
      });

      structured.psionicsCard = {
        "drawbacksList": drawbacksList,
        "levelsList": levelsList
      };
      return;
    }

    if (cardId === 'pathTalentsCard') {
      const pathTalentsList = [];
      const rows = card.querySelectorAll('#pathTalentsTable tbody tr');

      rows.forEach((row) => {
        const nameInput = row.querySelector('input[name="pathTalentName[]"]');
        const name = (nameInput ? nameInput.value.trim() : '');

        // Skip any table row that does not have a 'Name' entry
        if (!name) {
          return;
        }

        const descEl = row.querySelector('textarea[name="pathTalentDesc[]"]');
        const desc = (descEl ? descEl.value.trim() : '');

        pathTalentsList.push({
          "Name": name,
          "Description": desc
        });
      });

      structured.pathTalentsCard = {
        "pathTalentsList": pathTalentsList
      };
      return;
    }

    if (cardId === 'featsCard') {
      const featsList = [];
      const rows = card.querySelectorAll('#featsTable tbody tr');

      rows.forEach((row) => {
        const nameInput = row.querySelector('input[name="featName[]"]');
        const name = (nameInput ? nameInput.value.trim() : '');

        // Skip any table row that does not have a 'Name' entry
        if (!name) {
          return;
        }

        const descEl = row.querySelector('textarea[name="featDesc[]"]');
        const desc = (descEl ? descEl.value.trim() : '');

        featsList.push({
          "Name": name,
          "Description": desc
        });
      });

      structured.featsCard = {
        "featsList": featsList
      };
      return;
    }

    if (cardId === 'equipmentCard' || cardId === 'gearCard') {
      const equipmentList = [];
      const rows = card.querySelectorAll('#gearTable tbody tr');

      rows.forEach((row) => {
        const nameInput = row.querySelector('input[name="gearItem[]"]');
        const name = (nameInput ? nameInput.value.trim() : '');

        // Skip any table row that does not have a 'Name' entry
        if (!name) {
          return;
        }

        const qtyEl = row.querySelector('input[name="gearQty[]"]');
        const weightEl = row.querySelector('input[name="gearWeight[]"]');
        const tlEl = row.querySelector('input[name="gearTL[]"]');
        const notesEl = row.querySelector('input[name="gearNotes[]"]');

        const qty = (qtyEl ? qtyEl.value.trim() : '');
        const weight = (weightEl ? weightEl.value.trim() : '');
        const tl = (tlEl ? tlEl.value.trim() : '');
        const notes = (notesEl ? notesEl.value.trim() : '');

        equipmentList.push({
          "Name": name,
          "Qty": qty,
          "Weight": weight,
          "TL": tl,
          "Notes": notes
        });
      });

      let itemCraftProfCount = 0;
      for (let i = 1; i <= 2; i += 1) {
        const chk = card.querySelector(`[name="itemCraftProf${i}"]`) || document.getElementById(`itemCraftProf${i}`);
        if (chk && chk.checked) {
          itemCraftProfCount += 1;
        }
      }

      const totalWeightEl = card.querySelector('input[name="totalGearWeight"]');
      const totalWeight = (totalWeightEl ? totalWeightEl.value.trim() : '0');

      structured.equipmentCard = {
        "itemCraftProfCount": itemCraftProfCount,
        "totalGearWeight": totalWeight,
        "equipmentList": equipmentList
      };
      return;
    }

    if (cardId === 'professionsCard') {
      const profList = [];
      const blocks = card.querySelectorAll('#professionsContainer .profession-block');

      blocks.forEach((block) => {
        const titleEl = block.querySelector('input[name="profTitle[]"]');
        const title = (titleEl ? titleEl.value.trim() : '');

        // Ignore any Profession if it doesn't have its 'Title' field filled
        if (!title) {
          return;
        }

        const levelEl = block.querySelector('input[name="profLevel[]"]');
        const level = (levelEl ? levelEl.value.trim() : '');

        const affinities = [];
        block.querySelectorAll('.affinity-tag.active').forEach((btn) => {
          const affText = btn.textContent.trim();
          if (affText) {
            affinities.push(affText);
          }
        });

        const talents = [];
        const talentRows = block.querySelectorAll('.prof-talents-table tbody tr');

        talentRows.forEach((tRow) => {
          const tNameEl = tRow.querySelector('input[name="profTalentName[]"]');
          const tName = (tNameEl ? tNameEl.value.trim() : '');

          // Ignore any Talent that doesn't have its 'Name' field filled
          if (!tName) {
            return;
          }

          const tDescEl = tRow.querySelector('textarea[name="profTalentDesc[]"]');
          const tDesc = (tDescEl ? tDescEl.value.trim() : '');

          talents.push({
            "Name": tName,
            "Description": tDesc
          });
        });

        profList.push({
          "Title": title,
          "Level": level,
          "Affinities": affinities,
          "Talents": talents
        });
      });

      structured.professionsCard = profList;
      return;
    }

    if (cardId === 'techniquesCard') {
      const techList = [];
      const blocks = card.querySelectorAll('#techniqueLevelsContainer .technique-level-block');

      blocks.forEach((block) => {
        const profEl = block.querySelector('input[name="techProfession[]"]');
        const levelEl = block.querySelector('input[name="techLevel[]"]');
        const profession = (profEl ? profEl.value.trim() : '');
        const level = (levelEl ? levelEl.value.trim() : '');

        // Skip block if neither Profession nor Level is provided
        if (!profession && !level) {
          return;
        }

        const dcEl = block.querySelector('input[name="techDC[]"]');
        const learnedEl = block.querySelector('input[name="techLearned[]"]');
        const usesEl = block.querySelector('input[name="techUses[]"]');
        const usedEl = block.querySelector('input[name="techUsed[]"]');

        const dc = (dcEl ? dcEl.value.trim() : '');
        const learned = (learnedEl ? learnedEl.value.trim() : '');
        const uses = (usesEl ? usesEl.value.trim() : '');
        const used = (usedEl ? usedEl.value.trim() : '');

        const techniques = [];
        const rows = block.querySelectorAll('.techniques-sub-table tbody tr');

        rows.forEach((row) => {
          const nameEl = row.querySelector('input[name="techName[]"]');
          const name = (nameEl ? nameEl.value.trim() : '');

          // Skip any technique without a Name
          if (!name) {
            return;
          }

          const rangeEl = row.querySelector('input[name="techRange[]"]');
          const effectEl = row.querySelector('textarea[name="techEffect[]"]');
          const range = (rangeEl ? rangeEl.value.trim() : '');
          const effect = (effectEl ? effectEl.value.trim() : '');

          techniques.push({
            "Name": name,
            "Range": range,
            "Effect": effect
          });
        });

        techList.push({
          "Level": level,
          "Profession": profession,
          "DC": dc,
          "Learned": learned,
          "Uses": uses,
          "Used": used,
          "Techniques": techniques
        });
      });

      structured.techniquesCard = techList;
      return;
    }

    if (cardId === 'powerArmorCard') {
      const paList = [];
      const blocks = card.querySelectorAll('#powerArmorContainer .power-armor-block');

      blocks.forEach((block) => {
        const typeEl = block.querySelector('input[name="paType[]"]');
        const type = (typeEl ? typeEl.value.trim() : '');

        // Skip any power armor block without a Type
        if (!type) {
          return;
        }

        const paClassEl = block.querySelector('input[name="paClass[]"]');
        const paClass = (paClassEl ? paClassEl.value.trim() : '');

        const mods = [];
        const rows = block.querySelectorAll('.pa-mods-table tbody tr');

        rows.forEach((row) => {
          const nameEl = row.querySelector('input[name="paModName[]"]');
          const name = (nameEl ? nameEl.value.trim() : '');

          // Skip any mod without a Name
          if (!name) {
            return;
          }

          const descEl = row.querySelector('textarea[name="paModDesc[]"]');
          const desc = (descEl ? descEl.value.trim() : '');

          mods.push({
            "Name": name,
            "Description": desc
          });
        });

        paList.push({
          "Type": type,
          "Class": paClass,
          "Mods": mods
        });
      });

      let powerArmorProfCount = 0;
      for (let i = 1; i <= 5; i += 1) {
        const chk = card.querySelector(`[name="powerArmorProf${i}"]`) || document.getElementById(`powerArmorCard_powerArmorProf${i}`);
        if (chk && chk.checked) {
          powerArmorProfCount += 1;
        }
      }

      structured.powerArmorCard = {
        "powerArmorProfCount": powerArmorProfCount,
        "powerArmorList": paList
      };
      return;
    }

    if (cardId === 'languageCustomSkillsCard') {
      const featSkillsList = [];
      const featRows = card.querySelectorAll('#featSkillsTable tbody tr');

      featRows.forEach((row) => {
        let name = '';
        const staticTd = row.querySelector('td.fw-semibold');
        if (staticTd) {
          name = staticTd.textContent.trim();
        } else {
          const nameInput = row.querySelector('input[name^="customFeatSkillName"]');
          if (nameInput) {
            name = nameInput.value.trim();
          }
        }

        // Do not make objs for skills that do not have a name filled in
        if (!name) {
          return;
        }

        const rankEl = row.querySelector('.skill-rank');
        const rankVal = (rankEl ? rankEl.value.trim() : undefined);
        const rank = ((rankVal !== undefined && rankVal !== '') ? (parseInt(rankVal, 10) || 0) : 0);

        let keyAbility = row.getAttribute('data-ability') || '-';
        const abSelect = row.querySelector('.skill-ab-select');
        if (abSelect) {
          keyAbility = abSelect.value || '-';
        } else {
          const abSpan = row.querySelector('span[class*="text-ability-"]');
          if (abSpan) {
            keyAbility = abSpan.textContent.trim();
          }
        }

        const miscEl = row.querySelector('.skill-misc-mod');
        const miscVal = (miscEl ? miscEl.value.trim() : undefined);
        const miscMod = ((miscVal !== undefined && miscVal !== '') ? (parseInt(miscVal, 10) || 0) : 0);

        featSkillsList.push({
          "Name": name,
          "Rank": rank,
          "Key Ability": keyAbility,
          "MiscMod": miscMod
        });
      });

      const langSkillsList = [];
      const langRows = card.querySelectorAll('#langSkillsTable tbody tr');

      langRows.forEach((row) => {
        let name = '';
        const staticTd = row.querySelector('td.fw-semibold');
        if (staticTd) {
          name = staticTd.textContent.trim();
        } else {
          const nameInput = row.querySelector('input[name^="customLangName"]');
          if (nameInput) {
            name = nameInput.value.trim();
          }
        }

        // Do not make objs for skills that do not have a name filled in
        if (!name) {
          return;
        }

        const rankEl = row.querySelector('.skill-rank');
        const rankVal = (rankEl ? rankEl.value.trim() : undefined);
        const rank = ((rankVal !== undefined && rankVal !== '') ? (parseInt(rankVal, 10) || 0) : 0);

        const keyAbility = row.getAttribute('data-ability') || '-';

        const miscEl = row.querySelector('.skill-misc-mod');
        const miscVal = (miscEl ? miscEl.value.trim() : undefined);
        const miscMod = ((miscVal !== undefined && miscVal !== '') ? (parseInt(miscVal, 10) || 0) : 0);

        langSkillsList.push({
          "Name": name,
          "Rank": rank,
          "Key Ability": keyAbility,
          "MiscMod": miscMod
        });
      });

      structured.languageCustomSkillsCard = {
        "featSkillsList": featSkillsList,
        "langSkillsList": langSkillsList
      };
      return;
    }

    const cardData = {};
    const inputs = card.querySelectorAll('input, textarea, select');
    const profPrefixes = ['armorProf', 'meleeProf', 'rangedProf', 'techProf', 'itemCraftProf', 'powerArmorProf'];

    inputs.forEach((el) => {
      if (!el.name || el.disabled || el.type === 'button' || el.type === 'submit' || el.type === 'reset') {
        return;
      }

      const key = el.name;
      if (profPrefixes.some((p) => key.startsWith(p) && (/^\d+$/).test(key.replace(p, '')))) {
        return;
      }

      let val = el.value;

      if (el.type === 'checkbox') {
        val = el.checked;
      } else if (el.type === 'radio') {
        if (!el.checked) {
          return;
        }
        val = el.value;
      }

      if (key.endsWith('[]')) {
        if (!cardData[key]) {
          cardData[key] = [];
        }
        cardData[key].push(val);
      } else {
        cardData[key] = val;
      }
    });

    const profGroups = [
      { prefix: 'armorProf', countKey: 'armorProfCount', max: 10 },
      { prefix: 'meleeProf', countKey: 'meleeProfCount', max: 9 },
      { prefix: 'rangedProf', countKey: 'rangedProfCount', max: 9 },
      { prefix: 'techProf', countKey: 'techProfCount', max: 4 },
      { prefix: 'itemCraftProf', countKey: 'itemCraftProfCount', max: 2 },
      { prefix: 'powerArmorProf', countKey: 'powerArmorProfCount', max: 5 }
    ];

    profGroups.forEach((grp) => {
      const prefix = grp.prefix;
      const countKey = grp.countKey;
      const max = grp.max;
      const hasInputs = card.querySelector(`[name^="${prefix}"]`);
      if (hasInputs) {
        let count = 0;
        for (let i = 1; i <= max; i += 1) {
          const chk = card.querySelector(`[name="${prefix}${i}"]`) || document.getElementById(prefix + i);
          if (chk && chk.checked) {
            count += 1;
          }
        }
        cardData[countKey] = count;
      }
    });

    if (Object.keys(cardData).length > 0) {
      structured[cardId] = cardData;
    }
  });

  // UI_Layout Metadata Export
  let currentTheme = localStorage.getItem('theme') || 'cosmic-dark';
  const themeMatch = document.body.className.match(/theme-([a-z0-9\-]+)/);
  if (themeMatch) {
    currentTheme = themeMatch[1];
  }

  const autoSwitchTheme = !(localStorage.getItem('themeLocked') === 'true');
  const layoutLocked = document.body.classList.contains('layout-locked');

  const paChk = document.getElementById('global_togglePowerArmorVisibility');
  const techChk = document.getElementById('global_toggleTechniquesVisibility');
  const quirksChk = document.getElementById('global_toggleQuirksVisibility');
  const detractorsChk = document.getElementById('global_toggleDetractorsVisibility');
  const cyberneticsChk = document.getElementById('global_toggleCyberneticsVisibility');
  const mutationsChk = document.getElementById('global_toggleMutationsVisibility');
  const psionicsChk = document.getElementById('global_togglePsionicsVisibility');
  const notesChk = document.getElementById('global_toggleBackstoryVisibility');
  const extraNotesChk = document.getElementById('global_toggleExtraNotesVisibility');
  const condChk = document.getElementById('global_toggleConditionsVisibility');

  structured.UI_Layout = {
    "theme": currentTheme,
    "autoSwitchTheme": autoSwitchTheme,
    "layoutLocked": layoutLocked,
    "powerArmorVisible": (paChk ? paChk.checked : true),
    "techniquesVisible": (techChk ? techChk.checked : true),
    "quirksVisible": (quirksChk ? quirksChk.checked : true),
    "detractorsVisible": (detractorsChk ? detractorsChk.checked : true),
    "cyberneticsVisible": (cyberneticsChk ? cyberneticsChk.checked : true),
    "mutationsVisible": (mutationsChk ? mutationsChk.checked : true),
    "psionicsVisible": (psionicsChk ? psionicsChk.checked : true),
    "notesVisible": (notesChk ? notesChk.checked : true),
    "extraNotesVisible": (extraNotesChk ? extraNotesChk.checked : true),
    "conditionsVisible": (condChk ? condChk.checked : true)
  };

  return structured;
}

function saveToLocalStorage() {
  const data = getFormDataObj();
  localStorage.setItem('d20FuturePathCharData', JSON.stringify(data));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem('d20FuturePathCharData');
  if (!saved) {
    applyTheme();
    return;
  }
  try {
    const data = JSON.parse(saved);
    populateForm(data);
  } catch (err) {
    console.error('Error loading saved character data', err);
  }
}

function populateForm(data) {
  if (!data) {
    return;
  }
  const form = document.getElementById('characterForm');
  if (!form) {
    return;
  }

  isPopulatingForm = true;
  try {
    // Check if data is structured by sheet cards or flat legacy format
    let flatData = {};
  const isStructured = Object.values(data).some((v) => Boolean(v && typeof v === 'object' && !Array.isArray(v)));

  if (isStructured) {
    Object.keys(data).forEach((cardKey) => {
      if (cardKey === 'languageCustomSkillsCard' || cardKey === 'coreSkills' || cardKey === 'coreSkillsCard' || cardKey === 'armorDefensesCard' || cardKey === 'weaponsCard' || cardKey === 'speciesTraitsCard' || cardKey === 'quirksCard' || cardKey === 'detractorsCard' || cardKey === 'cyberneticsCard' || cardKey === 'mutationsCard' || cardKey === 'psionicsCard' || cardKey === 'pathTalentsCard' || cardKey === 'featsCard' || cardKey === 'equipmentCard' || cardKey === 'gearCard' || cardKey === 'professionsCard' || cardKey === 'techniquesCard' || cardKey === 'powerArmorCard' || cardKey === 'UI_Layout') {
        return;
      }
      const cardObj = data[cardKey];
      if (cardObj && typeof cardObj === 'object' && !Array.isArray(cardObj)) {
        Object.keys(cardObj).forEach((fieldName) => {
          flatData[fieldName] = cardObj[fieldName];
        });
      } else {
        flatData[cardKey] = cardObj;
      }
    });
  } else {
    flatData = data;
  }

  // Populate field values
  Object.keys(flatData).forEach((key) => {
    const val = flatData[key];
    if (key.endsWith('[]')) {
      const inputs = form.querySelectorAll(`[name="${key}"]`);
      if (Array.isArray(val)) {
        val.forEach((itemVal, i) => {
          if (inputs[i]) {
            if (inputs[i].type === 'checkbox') {
              inputs[i].checked = Boolean(itemVal);
            } else {
              inputs[i].value = itemVal;
            }
          }
        });
      }
    } else {
      const inputs = form.querySelectorAll(`[name="${key}"]`);
      if (inputs.length > 0) {
        inputs.forEach((input) => {
          if (input.type === 'checkbox') {
            input.checked = Boolean(val);
          } else if (input.type === 'radio') {
            input.checked = (input.value === val);
          } else if (input.name === 'advantageDie' || input.id === 'global_advantageDie') {
            setAdvantageDieValue(input, val);
          } else {
            input.value = val;
          }
        });
      }
    }
  });

  const advDieVal = flatData.advantageDie || data.advantageDie || (data.attributesCard ? data.attributesCard.advantageDie : (data.abilityScoresCard ? data.abilityScoresCard.advantageDie : undefined));
  const advDieSelect = document.getElementById('global_advantageDie');
  if (advDieSelect && advDieVal !== undefined) {
    setAdvantageDieValue(advDieSelect, advDieVal);
  }

  // Populate armorDefensesCard armorsList
  const armorsData = (data.armorDefensesCard ? data.armorDefensesCard.armorsList : undefined) || flatData.armorsList || flatData['armorName[]'];
  const tbodyArmor = document.querySelector('#armorTable tbody');
  if (tbodyArmor) {
    tbodyArmor.innerHTML = '';
    const listToPopulate = (Array.isArray(armorsData) ? armorsData : []);
    listToPopulate.forEach((armorObj) => {
      addArmorRow();
      const mainRows = tbodyArmor.querySelectorAll('tr.armor-main-row');
      const lastMain = mainRows[mainRows.length - 1];
      const lastNotes = (lastMain ? lastMain.nextElementSibling : null);

      if (typeof armorObj === 'object') {
        if (lastMain) {
          const nameIn = lastMain.querySelector('input[name="armorName[]"]');
          if (nameIn) {
            nameIn.value = armorObj.Name || armorObj.name || '';
          }
          const acIn = lastMain.querySelector('input[name="armorACBonus[]"]');
          if (acIn) {
            acIn.value = armorObj["AC Bonus"] || armorObj.acBonus || '';
          }
          const drIn = lastMain.querySelector('input[name="armorDR[]"]');
          if (drIn) {
            drIn.value = armorObj.DR || armorObj.dr || '';
          }
          const maxDexIn = lastMain.querySelector('input[name="armorMaxDex[]"]');
          if (maxDexIn) {
            maxDexIn.value = armorObj["Max Dex"] || armorObj.maxDex || '';
          }
          const weightIn = lastMain.querySelector('input[name="armorWeight[]"]');
          if (weightIn) {
            weightIn.value = armorObj.Weight || armorObj.weight || '';
          }
          const spdIn = lastMain.querySelector('input[name="armorSpeedPenalty[]"]');
          if (spdIn) {
            spdIn.value = armorObj["Speed Penalty"] || armorObj.speedPenalty || '';
          }
        }
        if (lastNotes) {
          const bonusIn = lastNotes.querySelector('input[name="armorBonusAttributes[]"]');
          if (bonusIn) {
            bonusIn.value = armorObj["Bonus Attributes"] || armorObj.bonusAttributes || '';
          }
        }
      }
    });

    // Armor should always start with at least 2 rows
    const currentArmorRows = tbodyArmor.querySelectorAll('tr.armor-main-row').length;
    for (let i = currentArmorRows; i < 2; i += 1) {
      addArmorRow();
    }
  }

  // Populate weaponsCard weaponsList
  const weaponsData = (data.weaponsCard ? data.weaponsCard.weaponsList : undefined) || flatData.weaponsList || flatData['wepName[]'];
  const tbodyWep = document.querySelector('#weaponsTable tbody');
  if (tbodyWep) {
    tbodyWep.innerHTML = '';
    const listToPopulate = (Array.isArray(weaponsData) ? weaponsData : []);
    listToPopulate.forEach((wepObj) => {
      addWeaponRow();
      const mainRows = tbodyWep.querySelectorAll('tr.weapon-main-row');
      const lastMain = mainRows[mainRows.length - 1];
      const lastNotes = (lastMain ? lastMain.nextElementSibling : null);

      if (typeof wepObj === 'object') {
        if (lastMain) {
          const nameIn = lastMain.querySelector('input[name="wepName[]"]');
          if (nameIn) {
            nameIn.value = wepObj.Name || wepObj.name || '';
          }
          const lvlIn = lastMain.querySelector('select[name="wepLvl[]"]');
          if (lvlIn && (wepObj.Lvl !== undefined || wepObj.lvl !== undefined)) {
            lvlIn.value = String(wepObj.Lvl !== undefined ? wepObj.Lvl : wepObj.lvl);
          }
          const dmgIn = lastMain.querySelector('input[name="wepDmg[]"]');
          if (dmgIn) {
            dmgIn.value = wepObj.Damage || wepObj.damage || '';
          }
          const atkIn = lastMain.querySelector('input[name="wepAtk[]"]');
          if (atkIn) {
            atkIn.value = wepObj.Accuracy || wepObj.accuracy || '';
          }
          const apIn = lastMain.querySelector('input[name="wepAP[]"]');
          if (apIn) {
            apIn.value = wepObj.AP || wepObj.ap || '';
          }
          const critIn = lastMain.querySelector('input[name="wepCrit[]"]');
          if (critIn) {
            critIn.value = wepObj.Critical || wepObj.critical || '';
          }
          const typeIn = lastMain.querySelector('input[name="wepType[]"]');
          if (typeIn) {
            typeIn.value = wepObj.Type || wepObj.type || '';
          }
          const rangeIn = lastMain.querySelector('input[name="wepRange[]"]');
          if (rangeIn) {
            rangeIn.value = wepObj.Range || wepObj.range || '';
          }
          const isMeleeIn = lastMain.querySelector('input[name="wepIsMelee[]"]');
          if (isMeleeIn && (wepObj.isMelee !== undefined || wepObj.IsMelee !== undefined)) {
            isMeleeIn.checked = Boolean(wepObj.isMelee !== undefined ? wepObj.isMelee : wepObj.IsMelee);
          }
          const ammoIn = lastMain.querySelector('input[name="wepAmmo[]"]');
          if (ammoIn) {
            ammoIn.value = wepObj.Ammo || wepObj.ammo || '';
          }
        }
        if (lastNotes) {
          const notesIn = lastNotes.querySelector('input[name="wepNotes[]"]');
          if (notesIn) {
            notesIn.value = wepObj.Notes || wepObj.notes || '';
          }
        }
      }
    });

    // Weapons should always start with at least 3 rows
    const currentWepRows = tbodyWep.querySelectorAll('tr.weapon-main-row').length;
    for (let i = currentWepRows; i < 3; i += 1) {
      addWeaponRow();
    }
  }

  // Populate coreSkills if present
  const coreSkillsData = data.coreSkills || data.coreSkillsCard;
  if (coreSkillsData && typeof coreSkillsData === 'object') {
    const splInput = form.querySelector('[name="skillsPerLevel"]');
    if (splInput && coreSkillsData.skillsPerLevel !== undefined) {
      splInput.value = coreSkillsData.skillsPerLevel;
    }

    const uspInput = form.querySelector('[name="unusedSkillPoints"]');
    if (uspInput && coreSkillsData.unusedSkillPoints !== undefined) {
      uspInput.value = coreSkillsData.unusedSkillPoints;
    }

    const skillsList = (Array.isArray(coreSkillsData.skillsList) ? coreSkillsData.skillsList : (Array.isArray(coreSkillsData) ? coreSkillsData : []));
    const rows = form.querySelectorAll('#coreSkills #skillsTable tbody tr, #skillsTable tbody tr');

    skillsList.forEach((skillObj) => {
      if (!skillObj || typeof skillObj !== 'object') {
        return;
      }
      const name = skillObj.Name || skillObj.name || '';
      if (!name) {
        return;
      }
      const rank = (skillObj.Rank !== undefined ? skillObj.Rank : (skillObj.rank || 0));
      const misc = (skillObj.MiscMod !== undefined ? skillObj.MiscMod : (skillObj.miscMod || 0));
      const favored = (skillObj.Favored !== undefined ? skillObj.Favored : skillObj.favored);

      let matchedRow = null;
      rows.forEach((r) => {
        const td = r.querySelectorAll('td')[1];
        if (td) {
          const clone = td.cloneNode(true);
          clone.querySelectorAll('.badge, .no-print').forEach((b) => b.remove());
          if (clone.textContent.trim() === name) {
            matchedRow = r;
          }
        }
      });

      if (matchedRow) {
        const rankInput = matchedRow.querySelector('.skill-rank');
        if (rankInput) {
          rankInput.value = rank;
        }

        const miscInput = matchedRow.querySelector('.skill-misc-mod');
        if (miscInput) {
          miscInput.value = misc;
        }

        const favChk = matchedRow.querySelector('.form-check-input');
        if (favChk && favored !== undefined) {
          favChk.checked = Boolean(favored);
        }

        const keyAb = skillObj["Key Ability"] || skillObj.keyAbility;
        const abSelect = matchedRow.querySelector('.skill-ab-select');
        if (abSelect && keyAb) {
          abSelect.value = keyAb;
          if (typeof updateCustomSkillAbility === 'function') {
            updateCustomSkillAbility(abSelect);
          }
        }
      }
    });
  }

  // Populate languageCustomSkillsCard
  const langCustomCardData = data.languageCustomSkillsCard;
  if (langCustomCardData && typeof langCustomCardData === 'object' && !Array.isArray(langCustomCardData)) {
    const featTbody = form.querySelector('#languageCustomSkillsCard #featSkillsTable tbody');
    const langTbody = form.querySelector('#languageCustomSkillsCard #langSkillsTable tbody');

    // Remove any dynamic custom rows, leaving only base static rows
    if (featTbody) {
      featTbody.querySelectorAll('tr:not([data-skill="knowledge_tech_custom"]):not([data-skill="profession_custom"])').forEach((r) => r.remove());
      const staticRows = featTbody.querySelectorAll('tr');
      staticRows.forEach((r) => {
        const rankInput = r.querySelector('.skill-rank');
        if (rankInput) {
          rankInput.value = '';
        }
        const miscInput = r.querySelector('.skill-misc-mod');
        if (miscInput) {
          miscInput.value = '';
        }
      });
    }

    if (langTbody) {
      langTbody.querySelectorAll('tr:not([data-skill="lang_main"])').forEach((r) => r.remove());
      const staticRows = langTbody.querySelectorAll('tr');
      staticRows.forEach((r) => {
        const rankInput = r.querySelector('.skill-rank');
        if (rankInput) {
          rankInput.value = '';
        }
        const miscInput = r.querySelector('.skill-misc-mod');
        if (miscInput) {
          miscInput.value = '';
        }
      });
    }

    const featSkillsList = langCustomCardData.featSkillsList || langCustomCardData.featsSkillsList || langCustomCardData.featSkillsTable || langCustomCardData.featsSkillsTable || [];
    const langSkillsList = langCustomCardData.langSkillsList || langCustomCardData.languagesList || langCustomCardData.langSkillsTable || [];

    if (Array.isArray(featSkillsList)) {
      featSkillsList.forEach((skillObj) => {
        if (!skillObj || typeof skillObj !== 'object') {
          return;
        }
        const name = skillObj.Name || skillObj.name || '';
        if (!name) {
          return;
        }
        const rank = (skillObj.Rank !== undefined ? skillObj.Rank : (skillObj.rank || 0));
        const keyAb = skillObj["Key Ability"] || skillObj.keyAbility || skillObj.KeyAbility || '-';
        const misc = (skillObj.MiscMod !== undefined ? skillObj.MiscMod : (skillObj.miscMod || 0));

        let matchedRow = null;
        if (featTbody) {
          const staticRows = featTbody.querySelectorAll('tr');
          staticRows.forEach((r) => {
            const staticTd = r.querySelector('td.fw-semibold');
            if (staticTd && staticTd.textContent.trim().toLowerCase() === name.toLowerCase()) {
              matchedRow = r;
            }
          });
        }

        if (matchedRow) {
          const rankInput = matchedRow.querySelector('.skill-rank');
          if (rankInput) {
            rankInput.value = rank;
          }
          const miscInput = matchedRow.querySelector('.skill-misc-mod');
          if (miscInput) {
            miscInput.value = misc;
          }
        } else {
          addFeatSkillRow(name, rank, keyAb, misc);
        }
      });
    }

    if (Array.isArray(langSkillsList)) {
      langSkillsList.forEach((skillObj) => {
        if (!skillObj || typeof skillObj !== 'object') {
          return;
        }
        const name = skillObj.Name || skillObj.name || '';
        if (!name) {
          return;
        }
        const rank = (skillObj.Rank !== undefined ? skillObj.Rank : (skillObj.rank || 0));
        const misc = (skillObj.MiscMod !== undefined ? skillObj.MiscMod : (skillObj.miscMod || 0));

        let matchedRow = null;
        if (langTbody) {
          const staticRows = langTbody.querySelectorAll('tr');
          staticRows.forEach((r) => {
            const staticTd = r.querySelector('td.fw-semibold');
            if (staticTd && staticTd.textContent.trim().toLowerCase() === name.toLowerCase()) {
              matchedRow = r;
            }
          });
        }

        if (matchedRow) {
          const rankInput = matchedRow.querySelector('.skill-rank');
          if (rankInput) {
            rankInput.value = rank;
          }
          const miscInput = matchedRow.querySelector('.skill-misc-mod');
          if (miscInput) {
            miscInput.value = misc;
          }
        } else {
          addLangSkillRow(name, rank, misc);
        }
      });
    }
  } else if (Array.isArray(langCustomCardData)) {
    // Backwards compatibility for legacy flat array of objects
    const featTbody = form.querySelector('#languageCustomSkillsCard #featSkillsTable tbody');
    const langTbody = form.querySelector('#languageCustomSkillsCard #langSkillsTable tbody');

    if (featTbody) {
      featTbody.querySelectorAll('tr:not([data-skill="knowledge_tech_custom"]):not([data-skill="profession_custom"])').forEach((r) => r.remove());
      const staticRows = featTbody.querySelectorAll('tr');
      staticRows.forEach((r) => {
        const rankInput = r.querySelector('.skill-rank');
        if (rankInput) {
          rankInput.value = '';
        }
        const miscInput = r.querySelector('.skill-misc-mod');
        if (miscInput) {
          miscInput.value = '';
        }
      });
    }

    if (langTbody) {
      langTbody.querySelectorAll('tr:not([data-skill="lang_main"])').forEach((r) => r.remove());
      const staticRows = langTbody.querySelectorAll('tr');
      staticRows.forEach((r) => {
        const rankInput = r.querySelector('.skill-rank');
        if (rankInput) {
          rankInput.value = '';
        }
        const miscInput = r.querySelector('.skill-misc-mod');
        if (miscInput) {
          miscInput.value = '';
        }
      });
    }

    langCustomCardData.forEach((skillObj) => {
      if (!skillObj || typeof skillObj !== 'object') {
        return;
      }
      const name = skillObj.Name || skillObj.name || '';
      if (!name) {
        return;
      }
      const rank = (skillObj.Rank !== undefined ? skillObj.Rank : (skillObj.rank || 0));
      const keyAb = skillObj["Key Ability"] || skillObj.keyAbility || '-';
      const misc = (skillObj.MiscMod !== undefined ? skillObj.MiscMod : (skillObj.miscMod || 0));

      let matchedRow = null;
      if (featTbody) {
        featTbody.querySelectorAll('tr').forEach((r) => {
          const staticTd = r.querySelector('td.fw-semibold');
          if (staticTd && staticTd.textContent.trim().toLowerCase() === name.toLowerCase()) {
            matchedRow = r;
          }
        });
      }
      if (!matchedRow && langTbody) {
        langTbody.querySelectorAll('tr').forEach((r) => {
          const staticTd = r.querySelector('td.fw-semibold');
          if (staticTd && staticTd.textContent.trim().toLowerCase() === name.toLowerCase()) {
            matchedRow = r;
          }
        });
      }

      if (matchedRow) {
        const rankInput = matchedRow.querySelector('.skill-rank');
        if (rankInput) {
          rankInput.value = rank;
        }
        const miscInput = matchedRow.querySelector('.skill-misc-mod');
        if (miscInput) {
          miscInput.value = misc;
        }
      } else {
        const isLang = (name.toLowerCase().includes('lang') || keyAb === '-');
        if (isLang) {
          addLangSkillRow(name, rank, misc);
        } else {
          addFeatSkillRow(name, rank, keyAb, misc);
        }
      }
    });
  }

  // Rebuild dynamic table rows if saved
  if (flatData['armorName[]'] && Array.isArray(flatData['armorName[]'])) {
    const tbody = document.querySelector('#armorTable tbody');
    if (tbody) {
      tbody.innerHTML = '';
      flatData['armorName[]'].forEach(() => addArmorRow());
    }
  }

  if (flatData['wepName[]'] && Array.isArray(flatData['wepName[]'])) {
    const tbody = document.querySelector('#weaponsTable tbody');
    if (tbody) {
      tbody.innerHTML = '';
      flatData['wepName[]'].forEach(() => addWeaponRow());
    }
  }

  if (flatData['customSkillName[]'] && Array.isArray(flatData['customSkillName[]'])) {
    const tbody = document.querySelector('#customSkillsTable tbody');
    if (tbody) {
      tbody.innerHTML = '';
      flatData['customSkillName[]'].forEach(() => addCustomSkillRow());
    }
  }

  if (flatData['customFeatSkillName[]'] && Array.isArray(flatData['customFeatSkillName[]'])) {
    const tbody = document.querySelector('#featSkillsTable tbody');
    if (tbody) {
      tbody.querySelectorAll('tr:not([data-skill="knowledge_tech_custom"]):not([data-skill="profession_custom"])').forEach((r) => r.remove());
      flatData['customFeatSkillName[]'].forEach(() => addFeatSkillRow());
    }
  }

  if (flatData['customLangName[]'] && Array.isArray(flatData['customLangName[]'])) {
    const tbody = document.querySelector('#langSkillsTable tbody');
    if (tbody) {
      tbody.querySelectorAll('tr:not([data-skill="lang_main"])').forEach((r) => r.remove());
      flatData['customLangName[]'].forEach(() => addLangSkillRow());
    }
  }

  // Populate speciesTraitsCard
  const traitsData = (data.speciesTraitsCard ? data.speciesTraitsCard.speciesTraitsList : undefined) || flatData.speciesTraitsList || flatData['speciesTraitName[]'];
  if (Array.isArray(traitsData)) {
    const speciesInput = document.getElementById('identityCard_speciesInput');
    const speciesVal = (speciesInput ? speciesInput.value.trim() : '');
    const displayEl = document.getElementById('headerSpeciesDisplay');
    const tbody = document.querySelector('#speciesTraitsTable tbody');
    if (displayEl) {
      displayEl.textContent = (speciesVal ? `[ ${speciesVal} ]` : '');
    }
    if (tbody) {
      tbody.innerHTML = '';
      traitsData.forEach((traitObj) => {
        addSpeciesTraitRow();
        const rows = tbody.querySelectorAll('tr');
        const lastRow = rows[rows.length - 1];
        if (lastRow && typeof traitObj === 'object') {
          const nameIn = lastRow.querySelector('input[name="speciesTraitName[]"]');
          if (nameIn) {
            nameIn.value = traitObj.Name || traitObj.name || '';
          }
          const descIn = lastRow.querySelector('textarea[name="speciesTraitDesc[]"]');
          if (descIn) {
            descIn.value = traitObj.Description || traitObj.description || '';
          }
        }
      });
    }
  }

  // Populate quirksCard
  const quirksDataList = (data.quirksCard ? data.quirksCard.quirksList : undefined) || flatData.quirksList || flatData['quirkName[]'];
  if (Array.isArray(quirksDataList)) {
    const tbody = document.querySelector('#quirksTable tbody');
    if (tbody) {
      tbody.innerHTML = '';
      quirksDataList.forEach((quirkObj) => {
        const qName = (typeof quirkObj === 'object' ? (quirkObj.Name || quirkObj.name || '') : quirkObj);
        const qDesc = (typeof quirkObj === 'object' ? (quirkObj.Description || quirkObj.description || '') : '');
        addQuirkRow(qName, qDesc);
      });
    }
  }

  // Populate detractorsCard
  const detractorsDataList = (data.detractorsCard ? data.detractorsCard.detractorsList : undefined) || flatData.detractorsList || flatData['detractorName[]'];
  if (Array.isArray(detractorsDataList)) {
    const tbody = document.querySelector('#detractorsTable tbody');
    if (tbody) {
      tbody.innerHTML = '';
      detractorsDataList.forEach((detractorObj) => {
        const dName = (typeof detractorObj === 'object' ? (detractorObj.Name || detractorObj.name || '') : detractorObj);
        const dDesc = (typeof detractorObj === 'object' ? (detractorObj.Description || detractorObj.description || '') : '');
        addDetractorRow(dName, dDesc);
      });
    }
  }

  // Populate cyberneticsCard
  const cyberData = data.cyberneticsCard;
  if (cyberData && typeof cyberData === 'object') {
    const cyborgLvlIn = form.querySelector('input[name="cyborgLevel"]');
    if (cyborgLvlIn && cyberData.cyborgLevel !== undefined) {
      cyborgLvlIn.value = cyberData.cyborgLevel;
    }

    const fwTLIn = form.querySelector('input[name="frameworkTechLevel"]');
    if (fwTLIn && cyberData.frameworkTechLevel !== undefined) {
      fwTLIn.value = cyberData.frameworkTechLevel;
    }

    const fwMstwkIn = form.querySelector('input[name="frameworkMasterworked"]');
    if (fwMstwkIn) {
      if (cyberData.frameworkMasterworked !== undefined) {
        fwMstwkIn.value = cyberData.frameworkMasterworked;
      } else if (cyberData.frameworkDetails !== undefined) {
        fwMstwkIn.value = cyberData.frameworkDetails;
      }
    }

    const powerIn = form.querySelector('input[name="cyberPower"]');
    if (powerIn && cyberData.power !== undefined) {
      powerIn.value = cyberData.power;
    }

    const slotsIn = form.querySelector('input[name="cyberSlots"]');
    if (slotsIn && cyberData.slots !== undefined) {
      slotsIn.value = cyberData.slots;
    }

    if (Array.isArray(cyberData.implantsList)) {
      const tbody = document.querySelector('#cyberImplantsTable tbody');
      if (tbody) {
        tbody.innerHTML = '';
        cyberData.implantsList.forEach((impObj) => {
          const name = (typeof impObj === 'object' ? (impObj.Name || impObj.name || '') : impObj);
          const desc = (typeof impObj === 'object' ? (impObj.Description || impObj.description || '') : '');
          addCyberImplantRow(name, desc);
        });
      }
    }

    if (Array.isArray(cyberData.drawbacksList)) {
      const tbody = document.querySelector('#cyberDrawbacksTable tbody');
      if (tbody) {
        tbody.innerHTML = '';
        cyberData.drawbacksList.forEach((dbObj) => {
          const name = (typeof dbObj === 'object' ? (dbObj.Name || dbObj.name || '') : dbObj);
          const desc = (typeof dbObj === 'object' ? (dbObj.Description || dbObj.description || '') : '');
          addCyberDrawbackRow(name, desc);
        });
      }
    }
  }

  // Populate mutationsCard
  const mutData = data.mutationsCard;
  if (mutData && typeof mutData === 'object') {
    if (Array.isArray(mutData.drawbacksList)) {
      const tbody = document.querySelector('#mutationsDrawbacksTable tbody');
      if (tbody) {
        tbody.innerHTML = '';
        mutData.drawbacksList.forEach((dbObj) => {
          const name = (typeof dbObj === 'object' ? (dbObj.Name || dbObj.name || '') : dbObj);
          const desc = (typeof dbObj === 'object' ? (dbObj.Description || dbObj.description || '') : '');
          const mp = (typeof dbObj === 'object' ? (dbObj.MP !== undefined ? dbObj.MP : (dbObj.mp !== undefined ? dbObj.mp : '')) : '');
          addMutationDrawbackRow(name, desc, mp);
        });
      }
    }

    if (Array.isArray(mutData.enhancementsList)) {
      const tbody = document.querySelector('#mutationsEnhancementsTable tbody');
      if (tbody) {
        tbody.innerHTML = '';
        mutData.enhancementsList.forEach((enhObj) => {
          const name = (typeof enhObj === 'object' ? (enhObj.Name || enhObj.name || '') : enhObj);
          const desc = (typeof enhObj === 'object' ? (enhObj.Description || enhObj.description || '') : '');
          const mp = (typeof enhObj === 'object' ? (enhObj.MP !== undefined ? enhObj.MP : (enhObj.mp !== undefined ? enhObj.mp : '')) : '');
          addMutationEnhancementRow(name, desc, mp);
        });
      }
    }

    calculateMutationsMPTotals();
  }

  // Populate psionicsCard
  const psiData = data.psionicsCard;
  if (psiData && typeof psiData === 'object') {
    if (Array.isArray(psiData.drawbacksList)) {
      const tbody = document.querySelector('#psionicsDrawbacksTable tbody');
      if (tbody) {
        tbody.innerHTML = '';
        psiData.drawbacksList.forEach((dbObj) => {
          const name = (typeof dbObj === 'object' ? (dbObj.Name || dbObj.name || '') : dbObj);
          const desc = (typeof dbObj === 'object' ? (dbObj.Description || dbObj.description || '') : '');
          const mp = (typeof dbObj === 'object' ? (dbObj.MP !== undefined ? dbObj.MP : (dbObj.mp !== undefined ? dbObj.mp : '')) : '');
          addPsionicDrawbackRow(name, desc, mp);
        });
      }
    }

    if (Array.isArray(psiData.levelsList)) {
      const container = document.getElementById('psionicLevelsContainer');
      if (container) {
        container.innerHTML = '';
        psiData.levelsList.forEach((lvlObj) => {
          addPsionicLevelBlock(lvlObj);
        });
      }
    }
  }

  // Populate pathTalentsCard
  const talentsData = (data.pathTalentsCard ? data.pathTalentsCard.pathTalentsList : undefined) || flatData.pathTalentsList || flatData['pathTalentName[]'];
  if (Array.isArray(talentsData)) {
    const tbody = document.querySelector('#pathTalentsTable tbody');
    if (tbody) {
      tbody.innerHTML = '';
      talentsData.forEach((talentObj) => {
        addPathTalentRow();
        const rows = tbody.querySelectorAll('tr');
        const lastRow = rows[rows.length - 1];
        if (lastRow && typeof talentObj === 'object') {
          const nameIn = lastRow.querySelector('input[name="pathTalentName[]"]');
          if (nameIn) {
            nameIn.value = talentObj.Name || talentObj.name || '';
          }
          const descIn = lastRow.querySelector('textarea[name="pathTalentDesc[]"]');
          if (descIn) {
            descIn.value = talentObj.Description || talentObj.description || '';
          }
        }
      });
    }
  }

  // Populate featsCard
  const featsData = (data.featsCard ? data.featsCard.featsList : undefined) || flatData.featsList || flatData['featName[]'];
  if (Array.isArray(featsData)) {
    const tbody = document.querySelector('#featsTable tbody');
    if (tbody) {
      tbody.innerHTML = '';
      featsData.forEach((featObj) => {
        addFeatRow();
        const rows = tbody.querySelectorAll('tr');
        const lastRow = rows[rows.length - 1];
        if (lastRow && typeof featObj === 'object') {
          const nameIn = lastRow.querySelector('input[name="featName[]"]');
          if (nameIn) {
            nameIn.value = featObj.Name || featObj.name || '';
          }
          const descIn = lastRow.querySelector('textarea[name="featDesc[]"]');
          if (descIn) {
            descIn.value = featObj.Description || featObj.description || '';
          }
        }
      });
    }
  }

  // Populate equipmentCard (or gearCard)
  const eqCard = data.equipmentCard || data.gearCard;
  const eqData = (eqCard ? eqCard.equipmentList : undefined) || flatData.equipmentList || flatData['gearItem[]'];
  if (Array.isArray(eqData)) {
    const tbody = document.querySelector('#gearTable tbody');
    if (tbody) {
      tbody.innerHTML = '';
      eqData.forEach((eqObj) => {
        addGearRow();
        const rows = tbody.querySelectorAll('tr');
        const lastRow = rows[rows.length - 1];
        if (lastRow && typeof eqObj === 'object') {
          const nameIn = lastRow.querySelector('input[name="gearItem[]"]');
          if (nameIn) {
            nameIn.value = eqObj.Name || eqObj.name || '';
          }
          const qtyIn = lastRow.querySelector('input[name="gearQty[]"]');
          if (qtyIn) {
            qtyIn.value = eqObj.Qty || eqObj.qty || '';
          }
          const weightIn = lastRow.querySelector('input[name="gearWeight[]"]');
          if (weightIn) {
            weightIn.value = eqObj.Weight || eqObj.weight || '';
          }
          const tlIn = lastRow.querySelector('input[name="gearTL[]"]');
          if (tlIn) {
            tlIn.value = eqObj.TL || eqObj.tl || '';
          }
          const notesIn = lastRow.querySelector('input[name="gearNotes[]"]');
          if (notesIn) {
            notesIn.value = eqObj.Notes || eqObj.notes || '';
          }
        }
      });
    }
  }

  if (eqCard && eqCard.totalGearWeight !== undefined) {
    const twIn = form.querySelector('[name="totalGearWeight"]');
    if (twIn) {
      twIn.value = eqCard.totalGearWeight;
    }
  }

  // Populate professionsCard
  const profData = data.professionsCard || flatData.professionsCard || flatData['profTitle[]'];
  if (Array.isArray(profData)) {
    const container = document.getElementById('professionsContainer');
    if (container) {
      container.innerHTML = '';
      profData.forEach((profObj) => {
        if (!profObj) {
          return;
        }
        if (typeof profObj === 'object' && !Array.isArray(profObj)) {
          addProfessionBlock();
          const blocks = container.querySelectorAll('.profession-block');
          const lastBlock = blocks[blocks.length - 1];

          if (lastBlock) {
            const titleIn = lastBlock.querySelector('input[name="profTitle[]"]');
            if (titleIn) {
              titleIn.value = profObj.Title || profObj.title || '';
            }

            const levelIn = lastBlock.querySelector('input[name="profLevel[]"]');
            if (levelIn) {
              levelIn.value = profObj.Level || profObj.level || '';
            }

            const affList = (Array.isArray(profObj.Affinities || profObj.affinities) ? (profObj.Affinities || profObj.affinities) : []);
            lastBlock.querySelectorAll('.affinity-tag').forEach((btn) => {
              const tagVal = btn.textContent.trim();
              if (affList.includes(tagVal)) {
                btn.classList.add('active');
              } else {
                btn.classList.remove('active');
              }
            });

            const talentsList = (Array.isArray(profObj.Talents || profObj.talents) ? (profObj.Talents || profObj.talents) : []);
            const tbody = lastBlock.querySelector('.prof-talents-table tbody');
            if (tbody) {
              tbody.innerHTML = '';
              talentsList.forEach((tObj) => {
                const addBtn = lastBlock.querySelector('.prof-talents-table button.btn-add-row') || tbody;
                addProfTalentRow(addBtn);
                const rows = tbody.querySelectorAll('tr');
                const lastRow = rows[rows.length - 1];
                if (lastRow && typeof tObj === 'object') {
                  const nameIn = lastRow.querySelector('input[name="profTalentName[]"]');
                  if (nameIn) {
                    nameIn.value = tObj.Name || tObj.name || '';
                  }

                  const descIn = lastRow.querySelector('textarea[name="profTalentDesc[]"]');
                  if (descIn) {
                    descIn.value = tObj.Description || tObj.description || '';
                  }
                }
              });
              if (tbody.querySelectorAll('tr').length === 0) {
                const addBtn = lastBlock.querySelector('.prof-talents-table button.btn-add-row') || tbody;
                addProfTalentRow(addBtn);
              }
            }
          }
        }
      });

      if (container.querySelectorAll('.profession-block').length === 0) {
        addProfessionBlock();
      }
    }
  }

  if (flatData['profTalentName[]'] && Array.isArray(flatData['profTalentName[]'])) {
    const tbody = document.querySelector('#professionsTable tbody');
    if (tbody) {
      tbody.innerHTML = '';
      flatData['profTalentName[]'].forEach(() => addProfTalentRow());
    }
  }

  // Populate techniquesCard
  const techData = data.techniquesCard || flatData.techniquesCard || flatData['techLevel[]'];
  if (Array.isArray(techData)) {
    const container = document.getElementById('techniqueLevelsContainer');
    if (container) {
      container.innerHTML = '';
      techData.forEach((techObj) => {
        if (!techObj) {
          return;
        }
        if (typeof techObj === 'object' && !Array.isArray(techObj)) {
          addTechniqueLevelBlock(techObj.Level || techObj.level || '0');
          const blocks = container.querySelectorAll('.technique-level-block');
          const lastBlock = blocks[blocks.length - 1];

          if (lastBlock) {
            const levelIn = lastBlock.querySelector('input[name="techLevel[]"]');
            if (levelIn) {
              levelIn.value = techObj.Level || techObj.level || '0';
            }

            const profIn = lastBlock.querySelector('input[name="techProfession[]"]');
            if (profIn) {
              profIn.value = techObj.Profession || techObj.profession || '';
            }

            const dcIn = lastBlock.querySelector('input[name="techDC[]"]');
            if (dcIn) {
              dcIn.value = techObj.DC || techObj.dc || '';
            }

            const learnedIn = lastBlock.querySelector('input[name="techLearned[]"]');
            if (learnedIn) {
              learnedIn.value = techObj.Learned || techObj.learned || '';
            }

            const usesIn = lastBlock.querySelector('input[name="techUses[]"]');
            if (usesIn) {
              usesIn.value = techObj.Uses || techObj.uses || '';
            }

            const usedIn = lastBlock.querySelector('input[name="techUsed[]"]');
            if (usedIn) {
              usedIn.value = techObj.Used || techObj.used || '';
            }

            const techniquesList = (Array.isArray(techObj.Techniques || techObj.techniques) ? (techObj.Techniques || techObj.techniques) : []);
            const tbody = lastBlock.querySelector('.techniques-sub-table tbody');
            if (tbody) {
              tbody.innerHTML = '';
              techniquesList.forEach((tObj) => {
                const addBtn = lastBlock.querySelector('.techniques-sub-table button.btn-add-row') || tbody;
                addTechniqueRow(addBtn);
                const rows = tbody.querySelectorAll('tr');
                const lastRow = rows[rows.length - 1];
                if (lastRow && typeof tObj === 'object') {
                  const nameIn = lastRow.querySelector('input[name="techName[]"]');
                  if (nameIn) {
                    nameIn.value = tObj.Name || tObj.name || '';
                  }

                  const rangeIn = lastRow.querySelector('input[name="techRange[]"]');
                  if (rangeIn) {
                    rangeIn.value = tObj.Range || tObj.range || '';
                  }

                  const effectIn = lastRow.querySelector('textarea[name="techEffect[]"]');
                  if (effectIn) {
                    effectIn.value = tObj.Effect || tObj.effect || tObj.Description || tObj.description || '';
                  }
                }
              });
              if (tbody.querySelectorAll('tr').length === 0) {
                const addBtn = lastBlock.querySelector('.techniques-sub-table button.btn-add-row') || tbody;
                addTechniqueRow(addBtn);
              }
            }
          }
        }
      });

      if (container.querySelectorAll('.technique-level-block').length === 0) {
        addTechniqueLevelBlock('0');
      }
    }
  }

  // Populate powerArmorCard
  const paCardData = data.powerArmorCard;
  const paListData = (paCardData ? paCardData.powerArmorList : undefined) || flatData.powerArmorList || flatData['paType[]'];
  if (Array.isArray(paListData)) {
    const container = document.getElementById('powerArmorContainer');
    if (container) {
      container.innerHTML = '';
      paListData.forEach((paObj) => {
        if (!paObj) {
          return;
        }
        if (typeof paObj === 'object' && !Array.isArray(paObj)) {
          addPowerArmorBlock();
          const blocks = container.querySelectorAll('.power-armor-block');
          const lastBlock = blocks[blocks.length - 1];

          if (lastBlock) {
            const typeIn = lastBlock.querySelector('input[name="paType[]"]');
            if (typeIn) {
              typeIn.value = paObj.Type || paObj.type || '';
            }

            const classIn = lastBlock.querySelector('input[name="paClass[]"]');
            if (classIn) {
              classIn.value = paObj.Class || paObj.class || '';
            }

            const modsList = (Array.isArray(paObj.Mods || paObj.mods) ? (paObj.Mods || paObj.mods) : []);
            const tbody = lastBlock.querySelector('.pa-mods-table tbody');
            if (tbody) {
              tbody.innerHTML = '';
              modsList.forEach((mObj) => {
                const addBtn = lastBlock.querySelector('.pa-mods-table button.btn-add-row') || tbody;
                addPowerArmorModRow(addBtn);
                const rows = tbody.querySelectorAll('tr');
                const lastRow = rows[rows.length - 1];
                if (lastRow && typeof mObj === 'object') {
                  const nameIn = lastRow.querySelector('input[name="paModName[]"]');
                  if (nameIn) {
                    nameIn.value = mObj.Name || mObj.name || '';
                  }

                  const descIn = lastRow.querySelector('textarea[name="paModDesc[]"]');
                  if (descIn) {
                    descIn.value = mObj.Description || mObj.description || '';
                  }
                }
              });
              if (tbody.querySelectorAll('tr').length === 0) {
                const addBtn = lastBlock.querySelector('.pa-mods-table button.btn-add-row') || tbody;
                addPowerArmorModRow(addBtn);
              }
            }
          }
        }
      });

      if (container.querySelectorAll('.power-armor-block').length === 0) {
        addPowerArmorBlock();
      }
    }
  }

  if (paCardData && paCardData.powerArmorProfCount !== undefined) {
    handlePowerArmorProficiencyChange(paCardData.powerArmorProfCount);
  }

  if (flatData['gearItem[]'] && Array.isArray(flatData['gearItem[]'])) {
    const tbody = document.querySelector('#gearTable tbody');
    if (tbody) {
      tbody.innerHTML = '';
      flatData['gearItem[]'].forEach(() => addGearRow());
    }
  }

  // Populate proficiency counts & check off corresponding boxes
  const profGroups = [
    { prefix: 'armorProf', countKey: 'armorProfCount', max: 10 },
    { prefix: 'meleeProf', countKey: 'meleeProfCount', max: 9 },
    { prefix: 'rangedProf', countKey: 'rangedProfCount', max: 9 },
    { prefix: 'techProf', countKey: 'techProfCount', max: 4 },
    { prefix: 'itemCraftProf', countKey: 'itemCraftProfCount', max: 2 },
    { prefix: 'powerArmorProf', countKey: 'powerArmorProfCount', max: 5 }
  ];

  profGroups.forEach((grp) => {
    const prefix = grp.prefix;
    const countKey = grp.countKey;
    const max = grp.max;
    let countVal = flatData[countKey];
    if (countVal === undefined) {
      Object.values(data).forEach((cObj) => {
        if (cObj && typeof cObj === 'object' && cObj[countKey] !== undefined) {
          countVal = cObj[countKey];
        }
      });
    }

    if (countVal !== undefined && countVal !== null) {
      const count = parseInt(countVal, 10) || 0;
      for (let i = 1; i <= max; i += 1) {
        const chk = document.getElementById(prefix + i) || form.querySelector(`[name="${prefix}${i}"]`);
        if (chk) {
          chk.checked = (i <= count);
        }
      }
    }
  });

  // Populate UI_Layout settings if present
  if (data.UI_Layout && typeof data.UI_Layout === 'object') {
    const layout = data.UI_Layout;

    if (layout.theme && typeof setTheme === 'function') {
      setTheme(layout.theme);
    } else {
      applyTheme();
    }

    if (layout.autoSwitchTheme !== undefined && typeof toggleLockTheme === 'function') {
      toggleLockTheme(!layout.autoSwitchTheme);
      const lockSwitch = document.getElementById('lockThemeSwitch');
      if (lockSwitch) {
        lockSwitch.checked = !layout.autoSwitchTheme;
      }
    }

    if (layout.layoutLocked !== undefined && typeof setCardLayoutLocked === 'function') {
      setCardLayoutLocked(layout.layoutLocked);
    }

    if (layout.powerArmorVisible !== undefined && typeof togglePowerArmorCardVisibility === 'function') {
      const chk = document.getElementById('global_togglePowerArmorVisibility');
      if (chk) {
        chk.checked = layout.powerArmorVisible;
      }
      togglePowerArmorCardVisibility(layout.powerArmorVisible);
    }

    if (layout.techniquesVisible !== undefined && typeof toggleTechniquesCardVisibility === 'function') {
      const chk = document.getElementById('global_toggleTechniquesVisibility');
      if (chk) {
        chk.checked = layout.techniquesVisible;
      }
      toggleTechniquesCardVisibility(layout.techniquesVisible);
    }

    if (layout.quirksVisible !== undefined && typeof toggleQuirksCardVisibility === 'function') {
      const chk = document.getElementById('global_toggleQuirksVisibility');
      if (chk) {
        chk.checked = layout.quirksVisible;
      }
      toggleQuirksCardVisibility(layout.quirksVisible);
    }

    if (layout.detractorsVisible !== undefined && typeof toggleDetractorsCardVisibility === 'function') {
      const chk = document.getElementById('global_toggleDetractorsVisibility');
      if (chk) {
        chk.checked = layout.detractorsVisible;
      }
      toggleDetractorsCardVisibility(layout.detractorsVisible);
    }

    if (layout.cyberneticsVisible !== undefined && typeof toggleCyberneticsCardVisibility === 'function') {
      const chk = document.getElementById('global_toggleCyberneticsVisibility');
      if (chk) {
        chk.checked = layout.cyberneticsVisible;
      }
      toggleCyberneticsCardVisibility(layout.cyberneticsVisible);
    }

    if (layout.mutationsVisible !== undefined && typeof toggleMutationsCardVisibility === 'function') {
      const chk = document.getElementById('global_toggleMutationsVisibility');
      if (chk) {
        chk.checked = layout.mutationsVisible;
      }
      toggleMutationsCardVisibility(layout.mutationsVisible);
    }

    if (layout.psionicsVisible !== undefined && typeof togglePsionicsCardVisibility === 'function') {
      const chk = document.getElementById('global_togglePsionicsVisibility');
      if (chk) {
        chk.checked = layout.psionicsVisible;
      }
      togglePsionicsCardVisibility(layout.psionicsVisible);
    }

    if (layout.notesVisible !== undefined && typeof toggleBackstoryCardVisibility === 'function') {
      const chk = document.getElementById('global_toggleBackstoryVisibility');
      if (chk) {
        chk.checked = layout.notesVisible;
      }
      toggleBackstoryCardVisibility(layout.notesVisible);
    }

    if (layout.extraNotesVisible !== undefined && typeof toggleExtraNotesCardVisibility === 'function') {
      const chk = document.getElementById('global_toggleExtraNotesVisibility');
      if (chk) {
        chk.checked = layout.extraNotesVisible;
      }
      toggleExtraNotesCardVisibility(layout.extraNotesVisible);
    }

    if (layout.conditionsVisible !== undefined && typeof toggleConditionsCardVisibility === 'function') {
      const chk = document.getElementById('global_toggleConditionsVisibility');
      if (chk) {
        chk.checked = layout.conditionsVisible;
      }
      toggleConditionsCardVisibility(layout.conditionsVisible);
    }
  } else {
    applyTheme();
  }

  calculateStats();
  updateProficiencyCounts();
} catch (err) {
  console.error('Error populating character form:', err);
} finally {
  isPopulatingForm = false;
}

  reexpandAllTextareas();
}

let pendingExportData = null;

async function exportCharacterJSON() {
  const data = getFormDataObj();
  const identityData = data.identityCard || {};
  const charName = identityData.charName || identityData.characterName || 'Character';
  const safeName = String(charName).trim().replace(/[^a-zA-Z0-9_\-]/g, '_') || 'Character';
  const defaultFileName = `d20FuturePath_${safeName}.json`;
  const jsonStr = JSON.stringify(data, null, 2);

  // 1. Native File System Access API (Chrome, Edge, Opera, Brave)
  // Opens the OS Save dialog to choose the folder and edit the filename.
  if ('showSaveFilePicker' in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: defaultFileName,
        types: [{
          description: 'JSON Character Sheet',
          accept: { 'application/json': ['.json'] }
        }]
      });
      const writable = await handle.createWritable();
      await writable.write(jsonStr);
      await writable.close();
      return;
    } catch (err) {
      if (err.name === 'AbortError') {
        // User cancelled the file dialog
        return;
      }
      console.warn('showSaveFilePicker failed, falling back to modal export:', err);
    }
  }

  // 2. Modal dialog fallback (Firefox, Safari, Mobile, etc.)
  openExportModal(defaultFileName, jsonStr);
}

function openExportModal(defaultFileName, jsonStr) {
  pendingExportData = jsonStr;
  const modalEl = document.getElementById('exportModal');
  const inputEl = document.getElementById('exportFileNameInput');
  if (inputEl) {
    let cleanName = defaultFileName;
    if (cleanName.endsWith('.json')) {
      cleanName = cleanName.slice(0, -5);
    }
    inputEl.value = cleanName;
  }
  if (modalEl && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
    modalInstance.show();
    setTimeout(() => {
      if (inputEl) {
        inputEl.focus();
        inputEl.select();
      }
    }, 250);
  } else {
    const chosenName = prompt('Enter file name to export:', defaultFileName);
    if (chosenName) {
      triggerBlobDownload(chosenName.endsWith('.json') ? chosenName : `${chosenName}.json`, jsonStr);
    }
  }
}

function confirmExportDownload() {
  if (!pendingExportData) {
    return;
  }
  const inputEl = document.getElementById('exportFileNameInput');
  let fileName = (inputEl ? inputEl.value.trim() : 'd20FuturePath_Character');
  if (!fileName) {
    fileName = 'd20FuturePath_Character';
  }
  if (!fileName.endsWith('.json')) {
    fileName += '.json';
  }

  triggerBlobDownload(fileName, pendingExportData);

  const modalEl = document.getElementById('exportModal');
  if (modalEl && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
}

function triggerBlobDownload(fileName, jsonStr) {
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importCharacterJSON(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      populateForm(data);
      alert('Character sheet imported successfully!');
    } catch (err) {
      alert('Error parsing JSON file. Please ensure it is a valid d20 FuturePath character file.');
    }
  };
  reader.readAsText(file);
}

async function loadCharacterFromAPI(charId) {
  if (!charId) {
    return;
  }
  try {
    const response = await fetch(`/v1/tasks/character_sheet/starter_characters/${encodeURIComponent(charId)}`);
    if (!response.ok) {
      console.warn(`Could not load character sheet for ID '${charId}' (HTTP ${response.status}).`);
      return;
    }
    const data = await response.json();
    if (data && !data.error) {
      populateForm(data);
      const identityCard = data.identityCard;
      const charName = (identityCard ? (identityCard.charName || identityCard.characterName) : undefined);
      if (charName) {
        document.title = `d20 FuturePath - Character Sheet (${charName})`;
      }
    }
  } catch (err) {
    console.error('Error preloading character sheet from API:', err);
  }
}

// Species Random Suggestion & Datalist Logic

speciesList = [
  "Humans",
  "Volar",
  "Graylings",
  "Lepidonains",
  "Cryous",
  "Ovex",
  "Aconians",
  "Murids",
  "Avisari",
  "Khepri",
  "Sayor",
  "Kurgian",
  "Tygerion",
  "Xrototaxian",
  "Chronodes",
  "Jove"
];

async function loadSpeciesDatalist() {
  if (Array.isArray(speciesList) && speciesList.length > 0) {
    const datalist = document.getElementById('speciesDatalist');
    if (datalist) {
      datalist.innerHTML = speciesList.map((sp) => `<option value="${sp}">`).join('');
    }
    return;
  }
  return await loadAllReferanceData();
}

function randomizeSpecies(fillInput = false) {
  if (!speciesList || speciesList.length === 0) {
    return;
  }
  const randomSpec = speciesList[Math.floor(Math.random() * speciesList.length)];
  const speciesInput = document.getElementById('identityCard_speciesInput');
  if (speciesInput) {
    if (fillInput) {
      speciesInput.value = randomSpec;
      syncSpeciesName();
      triggerAutoSave();
    } else {
      speciesInput.placeholder = `e.g. ${randomSpec}`;
    }
  }
}

function initOriginalParentContainers() {
  document.querySelectorAll('.sheet-card').forEach((card) => {
    if (!card.originalParentContainer) {
      card.originalParentContainer = card.parentElement;
      card.originalNextSibling = card.nextElementSibling;
    }
  });
}

function resetFormText(event) {
  if (event) {
    event.preventDefault();
  }
  if (confirm('Are you sure you want to clear all text and input fields on this sheet? All unsaved inputs will be lost.')) {
    document.getElementById('characterForm').reset();
    localStorage.removeItem('d20FuturePathCharData');
    resetAdvantageMod();
    calculateStats();
    updateProficiencyCounts();
    randomizeSpecies(false);
  }
}

function resetCardLayout(event) {
  if (event) {
    event.preventDefault();
  }
  if (!confirm('Are you sure you want to reset all cards back to their original page positions?')) {
    return;
  }

  localStorage.removeItem('d20FuturePathCardOrder');
  localStorage.removeItem('d20FuturePathPushedDownCards');
  pushedDownCards.clear();

  document.querySelectorAll('.sheet-card').forEach((card) => {
    if (card.originalParentContainer) {
      const container = card.originalParentContainer;
      const nextSib = card.originalNextSibling;
      if (nextSib && container.contains(nextSib)) {
        container.insertBefore(card, nextSib);
      } else {
        const footer = container.querySelector(':scope > .print-footer');
        if (footer) {
          container.insertBefore(card, footer);
        } else {
          container.appendChild(card);
        }
      }
    }
  });

  // Remove dynamic overflow pages beyond page 4
  document.querySelectorAll('[id^="page-"]').forEach((page) => {
    const num = parseInt(page.id.replace('page-', ''), 10);
    if (num > 4) {
      page.remove();
    }
  });

  updateHeaderToggleSwitches();
  updateMoveButtonVisibilities();
  saveCardOrder();
  scheduleAutoPagination(50);
}

function hardResetPage(event) {
  if (event) {
    event.preventDefault();
  }
  if (!confirm('Are you sure you want to perform a Hard Reset? This will clear all stored character data, layout preferences, and force a fresh page reload.')) {
    return;
  }

  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (err) {
    console.error('Error clearing storage during Hard Reset:', err);
  }

  window.location.href = window.location.pathname + '?nocache=' + Date.now();
}

// Card Collapse Management Logic
function expandAllCards() {
  document.querySelectorAll('.sheet-card .collapse').forEach((el) => {
    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(el, { toggle: false });
    bsCollapse.show();
  });
}

function collapseAllCards() {
  document.querySelectorAll('.sheet-card .collapse').forEach((el) => {
    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(el, { toggle: false });
    bsCollapse.hide();
  });
}

function expandPageCards(pageNum) {
  const pageEl = document.querySelector(`.print-page-${pageNum}`) || document.getElementById(`page-${pageNum}`);
  if (pageEl) {
    pageEl.querySelectorAll('.sheet-card .collapse').forEach((el) => {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(el, { toggle: false });
      bsCollapse.show();
    });
  }
}

function collapsePageCards(pageNum) {
  const pageEl = document.querySelector(`.print-page-${pageNum}`) || document.getElementById(`page-${pageNum}`);
  if (pageEl) {
    pageEl.querySelectorAll('.sheet-card .collapse').forEach((el) => {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(el, { toggle: false });
      bsCollapse.hide();
    });
  }
}

function togglePageCards(pageNum) {
  const pageEl = document.querySelector(`.print-page-${pageNum}`) || document.getElementById(`page-${pageNum}`);
  if (pageEl) {
    const collapses = pageEl.querySelectorAll('.sheet-card .collapse');
    const anyShown = Array.from(collapses).some((el) => el.classList.contains('show'));
    collapses.forEach((el) => {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(el, { toggle: false });
      if (anyShown) {
        bsCollapse.hide();
      } else {
        bsCollapse.show();
      }
    });
  }
}

function saveCollapseStates() {
  const collapsedIds = [];
  document.querySelectorAll('.sheet-card .collapse').forEach((el) => {
    if (!el.classList.contains('show') && el.id) {
      collapsedIds.push(el.id);
    }
  });
  localStorage.setItem('d20FuturePathCollapsedCards', JSON.stringify(collapsedIds));
}

function getMaxPageHeight(pageNum = 1) {
  if (!document.body.classList.contains('is-print-mode')) {
    return 1880;
  }
  return (pageNum === 1 ? 1130 : 1100);
}

let autoPaginateTimeout = null;

function scheduleAutoPagination(delay = 500) {
  if (isPopulatingForm) {
    return;
  }
  if (autoPaginateTimeout) {
    clearTimeout(autoPaginateTimeout);
  }
  autoPaginateTimeout = setTimeout(() => {
    autoPaginateTimeout = null;
    autoPaginateCards();
  }, delay);
}

function reexpandAllTextareas() {
  const textareas = document.querySelectorAll('.notebook-textarea, .trait-desc-textarea, textarea');
  if (textareas.length === 0) {
    return;
  }
  textareas.forEach((el) => {
    el.style.height = 'auto';
  });
  void textareas[0].offsetHeight;
  textareas.forEach((el) => {
    if (el.scrollHeight > 0) {
      el.style.height = `${el.scrollHeight + 2}px`;
    }
  });
}

function getElementContentHeight(el) {
  if (!el) {
    return 0;
  }
  const isAlreadyPrintMode = document.body.classList.contains('is-print-mode');
  if (isAlreadyPrintMode) {
    return Math.max(el.offsetHeight, el.scrollHeight, Math.ceil(el.getBoundingClientRect().height));
  }

  const savedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
  const savedScrollX = window.scrollX || window.pageXOffset || document.documentElement.scrollLeft;

  document.body.classList.add('is-print-mode');
  reexpandAllTextareas();
  const rect = el.getBoundingClientRect();
  const height = Math.max(el.offsetHeight, el.scrollHeight, Math.ceil(rect.height));
  document.body.classList.remove('is-print-mode');
  reexpandAllTextareas();

  const currentY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
  const currentX = window.scrollX || window.pageXOffset || document.documentElement.scrollLeft;
  if (currentY !== savedScrollY || currentX !== savedScrollX) {
    window.scrollTo({ top: savedScrollY, left: savedScrollX, behavior: 'instant' });
  }
  return height;
}

function getDefaultPage(cardEl) {
  if (!cardEl) {
    return 1;
  }
  const attr = cardEl.getAttribute('data-default-page');
  if (attr) {
    return parseInt(attr, 10);
  }

  const map = {
    'identityCard': 1, 'armorDefensesCard': 1, 'weaponsCard': 1, 'languageCustomSkillsCard': 1, 'wealthXpCard': 1, 'backstoryCard': 1,
    'speciesTraitsCard': 2, 'pathTalentsCard': 2, 'featsCard': 2, 'professionsCard': 2, 'equipmentCard': 2,
    'techniquesCard': 3, 'quirksCard': 3, 'detractorsCard': 3, 'cyberneticsCard': 3, 'mutationsCard': 3, 'psionicsCard': 3,
    'powerArmorCard': 4, 'extraNotesCard': 4, 'conditionsCard': 4
  };
  return map[cardEl.id] || 1;
}

function getMovableCardsInPage(pageEl) {
  if (!pageEl) {
    return [];
  }
  return Array.from(pageEl.querySelectorAll('.sheet-card')).filter((el) => 
    el.closest('[id^="page-"]') === pageEl &&
    el.id !== 'identityCard' &&
    !el.classList.contains('card-hidden-all') &&
    !el.classList.contains('d-none') &&
    window.getComputedStyle(el).display !== 'none'
  );
}

function getOrCreatePageContainer(pageNum) {
  let page = document.getElementById(`page-${pageNum}`);
  if (page) {
    return page;
  }

  page = document.createElement('div');
  page.className = `print-page-${pageNum} mt-4 dynamic-page`;
  page.id = `page-${pageNum}`;
  page.innerHTML = `
    <div id="page-${pageNum}-header" class="page-header-bar no-print flex-wrap gap-2">
      <div class="d-flex align-items-center gap-2">
        <span class="page-header-badge"><span class="d-none d-sm-inline"><i class="fa-solid fa-file-lines me-1"></i>Page </span>${pageNum}</span>
        <span class="page-header-title">Page ${pageNum}</span>
      </div>
      <div class="d-flex align-items-center gap-2 flex-wrap ms-auto">
        <div id="page-${pageNum}-toggles" class="d-flex align-items-center gap-2 flex-wrap"></div>
        <div class="btn-group btn-group-sm">
          <button type="button" class="btn btn-cyber-outline py-0 px-2 small" onclick="expandPageCards(${pageNum})" title="Expand all cards on Page ${pageNum}">
            <i class="fa-solid fa-angles-down me-sm-1"></i><span class="d-none d-sm-inline">Expand</span>
          </button>
          <button type="button" class="btn btn-cyber-outline py-0 px-2 small" onclick="collapsePageCards(${pageNum})" title="Collapse all cards on Page ${pageNum}">
            <i class="fa-solid fa-angles-up me-sm-1"></i><span class="d-none d-sm-inline">Collapse</span>
          </button>
        </div>
      </div>
    </div>
    <div class="print-footer">
       Page ${pageNum} - d20 FuturePath Character Sheet
    </div>
  `;

  const form = document.getElementById('characterForm');
  if (form) {
    let nextPageEl = null;
    let nextIdx = pageNum + 1;
    while (nextIdx <= 20) {
      const candidate = document.getElementById(`page-${nextIdx}`);
      if (candidate && candidate.parentNode === form) {
        nextPageEl = candidate;
        break;
      }
      nextIdx += 1;
    }
    if (nextPageEl) {
      form.insertBefore(page, nextPageEl);
    } else {
      form.appendChild(page);
    }
  } else {
    const fallbackContainer = document.querySelector('.sheet-container') || document.body;
    fallbackContainer.appendChild(page);
  }
  return page;
}

const PULL_UP_SAFETY_BUFFER = 25; // 25px buffer to account for margins/padding when a card is inserted

function autoPaginateCards() {
  console.log("autoPaginateCards called");
  pushedDownCards.clear();
  const wasPrintMode = document.body.classList.contains('is-print-mode');
  const savedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
  const savedScrollX = window.scrollX || window.pageXOffset || document.documentElement.scrollLeft;

  if (!wasPrintMode) {
    document.body.classList.add('is-print-mode');
  }
  reexpandAllTextareas();

  try {
    let pageNum = 1;
    let iterations = 0;

    while (iterations < 40) {
      iterations += 1;
      const currentPage = document.getElementById(`page-${pageNum}`);
      if (!currentPage) {
        break;
      }

      const maxH = getMaxPageHeight(pageNum);
      const cards = getMovableCardsInPage(currentPage);
      const currentHeight = getElementContentHeight(currentPage);

      //console.log("Current page: ", pageNum)
      //console.log("Max Page Height", maxH);
      //console.log("Current Height", currentHeight);

      // 1. PUSH DOWN OVERFLOW: If page height > maxH and has >= 1 visible card
      if (currentHeight > maxH && cards.length > 0) {
        const lastCard = cards[cards.length - 1];
        const nextPage = getOrCreatePageContainer(pageNum + 1);
        const nextFooter = nextPage.querySelector('.print-footer');
        const firstNextCard = getMovableCardsInPage(nextPage)[0];

        pushedDownCards.add(lastCard);

        if (firstNextCard) {
          nextPage.insertBefore(lastCard, firstNextCard);
        } else if (nextFooter) {
          nextPage.insertBefore(lastCard, nextFooter);
        } else {
          nextPage.appendChild(lastCard);
        }

        // Keep Armor and Weapons together
        if (lastCard.id === 'weaponsCard') {
          const armorCard = document.getElementById('armorDefensesCard');
          if (armorCard && armorCard.closest('[id^="page-"]') === currentPage) {
            pushedDownCards.add(armorCard);
            nextPage.insertBefore(armorCard, lastCard);
          }
        }
      } else {
        // 2. PULL UP UNDERFLOW: Check if first card of nextPage can move UP to currentPage
        const nextPage = document.getElementById(`page-${pageNum + 1}`);
        if (nextPage) {
          const nextCards = getMovableCardsInPage(nextPage);
          if (nextCards.length > 0) {
            const firstNextCard = nextCards[0];
            const cardDefaultPage = getDefaultPage(firstNextCard);

            if (pageNum === 1 && cardDefaultPage === 1 && !pushedDownCards.has(firstNextCard)) {
              let cardHeight = getElementContentHeight(firstNextCard) || 150;
              let isArmorPair = false;
              let secondCard = null;

              if (firstNextCard.id === 'armorDefensesCard') {
                const nextCandidate = nextCards[1];
                if (nextCandidate && nextCandidate.id === 'weaponsCard') {
                  isArmorPair = true;
                  secondCard = nextCandidate;
                  cardHeight += (getElementContentHeight(secondCard) || 150);
                }
              }

              if (currentHeight + cardHeight + PULL_UP_SAFETY_BUFFER <= maxH) {
                if (firstNextCard.originalParentContainer && currentPage.contains(firstNextCard.originalParentContainer)) {
                  firstNextCard.originalParentContainer.appendChild(firstNextCard);
                } else {
                  const currentFooter = currentPage.querySelector('.print-footer');
                  if (currentFooter) {
                    currentPage.insertBefore(firstNextCard, currentFooter);
                  } else {
                    currentPage.appendChild(firstNextCard);
                  }
                }

                if (isArmorPair && secondCard) {
                  if (secondCard.originalParentContainer && currentPage.contains(secondCard.originalParentContainer)) {
                    secondCard.originalParentContainer.appendChild(secondCard);
                  } else {
                    const currentFooter = currentPage.querySelector('.print-footer');
                    if (currentFooter) {
                      currentPage.insertBefore(secondCard, currentFooter);
                    } else {
                      currentPage.appendChild(secondCard);
                    }
                  }
                }

                // Cleanup empty auto-generated page (Page 5+)
                if (pageNum + 1 > 4 && getMovableCardsInPage(nextPage).length === 0) {
                  nextPage.remove();
                }
              }
            }
          } else if (pageNum + 1 > 4) {
            // Remove empty page > 4
            nextPage.remove();
          }
        }
        pageNum += 1;
      }
    }
  } finally {
    reexpandAllTextareas();
    if (!wasPrintMode) {
      document.body.classList.remove('is-print-mode');
      reexpandAllTextareas();
      window.requestAnimationFrame(() => {
        const currentY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        const currentX = window.scrollX || window.pageXOffset || document.documentElement.scrollLeft;
        if (currentY !== savedScrollY || currentX !== savedScrollX) {
          window.scrollTo({ top: savedScrollY, left: savedScrollX, behavior: 'instant' });
        }
      });
    }
  }

  ensureFootersAreLastChild();
  updateHeaderToggleSwitches();
  saveCardOrder();
  updateMoveButtonVisibilities();
  updateEmptyPages();
}

function ensureFootersAreLastChild() {
  document.querySelectorAll('[id^="page-"]').forEach((page) => {
    const footer = page.querySelector(':scope > .print-footer');
    if (footer && page.lastElementChild !== footer) {
      page.appendChild(footer);
    }
  });
}

function updateEmptyPages() {
  const pageEls = Array.from(document.querySelectorAll('[id^="page-"]'))
    .filter((page) => /^page-\d+$/.test(page.id));

  const visiblePages = [];

  pageEls.forEach((page) => {
    const cards = page.querySelectorAll('.sheet-card');
    let hasVisibleCard = false;
    cards.forEach((card) => {
      if (card.closest('[id^="page-"]') === page) {
        if (!card.classList.contains('card-hidden-all') &&
            !card.classList.contains('d-none') &&
            card.style.display !== 'none' &&
            !card.hidden &&
            window.getComputedStyle(card).display !== 'none') {
          hasVisibleCard = true;
        }
      }
    });

    if (!hasVisibleCard) {
      page.classList.add('print-page-empty');
      page.classList.remove('print-page-last');
    } else {
      page.classList.remove('print-page-empty');
      visiblePages.push(page);
    }
  });

  visiblePages.forEach((page, index) => {
    if (index === visiblePages.length - 1) {
      page.classList.add('print-page-last');
    } else {
      page.classList.remove('print-page-last');
    }
    const footer = page.querySelector(':scope > .print-footer');
    if (footer) {
      footer.textContent = `Page ${index + 1} - d20 FuturePath Character Sheet`;
    }
  });
}

function getReorderableCards() {
  const pageEls = Array.from(document.querySelectorAll('[id^="page-"]'))
    .filter((el) => !el.id.includes('-header') && !el.id.includes('-toggles'));
  
  const allCards = [];
  pageEls.forEach((page) => {
    const cards = getMovableCardsInPage(page);
    allCards.push(...cards);
  });
  return { pages: pageEls, cards: allCards };
}

function canMoveCardUp(card, allCards = null) {
  if (!card) {
    return false;
  }
  const cards = (allCards || getReorderableCards().cards);
  const idx = cards.indexOf(card);
  if (idx <= 0) {
    return false;
  }

  const prevCard = cards[idx - 1];
  const cardDefaultPage = getDefaultPage(card);
  const cardPage = card.closest('[id^="page-"]');
  const prevCardPage = prevCard.closest('[id^="page-"]');
  if (!cardPage || !prevCardPage) {
    return false;
  }

  const prevPageNum = parseInt(prevCardPage.id.replace('page-', ''), 10) || 1;

  if (cardPage === prevCardPage) {
    return true;
  }
  // Condition 1: A card cannot Move Up to Page 1 unless it started on Page 1.
  if (prevPageNum === 1 && cardDefaultPage > 1) {
    return false;
  }

  // Condition 2: A card cannot Move Up to a Page that cannot fit it.
  const targetHeight = getElementContentHeight(prevCardPage);
  const cardHeight = getElementContentHeight(card) || 150;
  const maxH = getMaxPageHeight(prevPageNum);

  if (targetHeight + cardHeight > maxH) {
    return false;
  }

  return true;
}

function canMoveCardDown(card, allCards = null) {
  if (!card) {
    return false;
  }
  const cards = (allCards || getReorderableCards().cards);
  const idx = cards.indexOf(card);
  if (idx === -1) {
    return false;
  }

  const cardPage = card.closest('[id^="page-"]');
  if (!cardPage) {
    return false;
  }
  const cardPageNum = parseInt(cardPage.id.replace('page-', ''), 10) || 1;

  if (idx < cards.length - 1) {
    const nextCard = cards[idx + 1];
    const nextCardPage = nextCard.closest('[id^="page-"]');
    if (!nextCardPage) {
      return false;
    }
    const nextPageNum = parseInt(nextCardPage.id.replace('page-', ''), 10) || 1;

    if (cardPage === nextCardPage) {
      return true;
    }
    // Condition 3: A card cannot Move Down to a Page that cannot fit it.
    const targetHeight = getElementContentHeight(nextCardPage);
    const cardHeight = getElementContentHeight(card) || 150;
    const maxH = getMaxPageHeight(nextPageNum);

    if (targetHeight + cardHeight > maxH) {
      return false;
    }

    return true;
  }
  // Last card overall: moving down targets nextPageNum = cardPageNum + 1
  const nextPageNum = cardPageNum + 1;
  const nextPage = document.getElementById(`page-${nextPageNum}`);
  const targetHeight = (nextPage ? getElementContentHeight(nextPage) : 80);
  const cardHeight = getElementContentHeight(card) || 150;
  const maxH = getMaxPageHeight(nextPageNum);

  if (targetHeight + cardHeight > maxH) {
    return false;
  }

  return true;
}

function updateMoveButtonVisibilities() {
  const reorderable = getReorderableCards();
  const cards = reorderable.cards;
  if (cards.length === 0) {
    return;
  }

  const wasPrintMode = document.body.classList.contains('is-print-mode');
  if (!wasPrintMode) {
    document.body.classList.add('is-print-mode');
  }

  try {
    cards.forEach((card) => {
      const btnUp = card.querySelector('[onclick="moveCardUp(this)"]');
      const btnDown = card.querySelector('[onclick="moveCardDown(this)"]');
      const reorderWrapper = card.querySelector('.card-reorder-controls');

      const canUp = canMoveCardUp(card, cards);
      const canDown = canMoveCardDown(card, cards);

      if (btnUp) {
        btnUp.style.display = (canUp ? '' : 'none');
      }
      if (btnDown) {
        btnDown.style.display = (canDown ? '' : 'none');
      }

      if (reorderWrapper) {
        if (!canUp && !canDown) {
          reorderWrapper.style.visibility = 'hidden';
        } else {
          reorderWrapper.style.visibility = '';
        }
      }
    });
  } finally {
    if (!wasPrintMode) {
      document.body.classList.remove('is-print-mode');
    }
  }

  updateTableOfContents();
}

function updateTableOfContents() {
  const menu = document.getElementById('tocDropdownMenu');
  if (!menu) {
    return;
  }

  const pageEls = Array.from(document.querySelectorAll('[id^="page-"]'))
    .filter((el) => !el.id.includes('-header') && !el.id.includes('-toggles'));

  if (pageEls.length === 0) {
    menu.innerHTML = '<li><span class="dropdown-item text-muted small">No pages found</span></li>';
    return;
  }

  let html = '';

  pageEls.forEach((page, index) => {
    const pageNum = parseInt(page.id.replace('page-', ''), 10) || (index + 1);
    const headerTitleEl = page.querySelector('.page-header-title');
    const pageTitle = (headerTitleEl ? headerTitleEl.innerText.trim() : `Page ${pageNum}`);

    if (index > 0) {
      html += '<li><hr class="dropdown-divider border-secondary opacity-25 my-1"></li>';
    }

    // Page Header Link
    html += `
      <li>
        <a class="dropdown-item fw-bold text-cyan py-1" href="#${page.id}" onclick="navigateToTocElement(event, '${page.id}')">
          <i class="fa-solid fa-file-lines me-2"></i>Page ${pageNum}: ${pageTitle}
        </a>
      </li>
    `;

    // All .sheet-card elements on this page (including grid sub-cards)
    const cards = Array.from(page.querySelectorAll('.sheet-card')).filter((el) => 
      !el.classList.contains('card-hidden-all') &&
      !el.classList.contains('d-none') &&
      window.getComputedStyle(el).display !== 'none'
    );

    cards.forEach((card, cIdx) => {
      const cardTitleEl = card.querySelector('.card-header-custom span') || 
                          card.querySelector('.card-header-custom') ||
                          card.querySelector('h5, h6, .card-title, label');

      let cardTitle = (cardTitleEl ? cardTitleEl.innerText.trim() : (card.id || `Section ${cIdx + 1}`));
      cardTitle = cardTitle.split('\n')[0].trim();

      if (!card.id) {
        card.id = `toc-card-${page.id}-${cIdx}`;
      }

      html += `
        <li>
          <a class="dropdown-item ps-4 py-1 small text-light toc-card-link" href="#${card.id}" onclick="navigateToTocElement(event, '${card.id}')">
            <i class="fa-solid fa-angle-right me-2 text-muted" style="font-size: 0.72rem;"></i>${cardTitle}
          </a>
        </li>
      `;
    });
  });

  menu.innerHTML = html;
}

function navigateToTocElement(event, targetId) {
  event.preventDefault();
  const targetEl = document.getElementById(targetId);
  if (!targetEl) {
    return;
  }

  // Uncollapse card if collapsed
  if (targetEl.classList.contains('sheet-card')) {
    const collapseEl = targetEl.querySelector('.collapse');
    if (collapseEl && !collapseEl.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false });
      bsCollapse.show();
    }
  }

  targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Highlight element briefly
  targetEl.classList.add('toc-highlight');
  setTimeout(() => targetEl.classList.remove('toc-highlight'), 1800);
}

function moveCardUp(btn) {
  const card = btn.closest('.sheet-card');
  if (!card || !canMoveCardUp(card)) {
    return;
  }

  const reorderable = getReorderableCards();
  const cards = reorderable.cards;
  const idx = cards.indexOf(card);
  if (idx <= 0) {
    return;
  }

  const prevCard = cards[idx - 1];
  const cardPage = card.closest('[id^="page-"]');
  const prevCardPage = prevCard.closest('[id^="page-"]');

  if (cardPage === prevCardPage) {
    prevCard.parentNode.insertBefore(card, prevCard);
  } else {
    const prevFooter = prevCardPage.querySelector('.print-footer');
    if (prevFooter) {
      prevCardPage.insertBefore(card, prevFooter);
    } else {
      prevCardPage.appendChild(card);
    }
  }

  updateHeaderToggleSwitches();
  saveCardOrder();
  updateMoveButtonVisibilities();
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  triggerAutoSave();
}

function moveCardDown(btn) {
  const card = btn.closest('.sheet-card');
  if (!card || !canMoveCardDown(card)) {
    return;
  }

  const reorderable = getReorderableCards();
  const cards = reorderable.cards;
  const idx = cards.indexOf(card);
  if (idx === -1) {
    return;
  }

  const cardPage = card.closest('[id^="page-"]');
  const cardPageNum = (cardPage ? (parseInt(cardPage.id.replace('page-', ''), 10) || 1) : 1);

  if (idx < cards.length - 1) {
    const nextCard = cards[idx + 1];
    const nextCardPage = nextCard.closest('[id^="page-"]');

    if (cardPage === nextCardPage) {
      nextCard.parentNode.insertBefore(card, nextCard.nextSibling);
    } else {
      nextCardPage.insertBefore(card, nextCard);
    }
  } else {
    const nextPageNum = cardPageNum + 1;
    const nextPage = getOrCreatePageContainer(nextPageNum);
    const nextFooter = nextPage.querySelector('.print-footer');
    if (nextFooter) {
      nextPage.insertBefore(card, nextFooter);
    } else {
      nextPage.appendChild(card);
    }
  }

  updateHeaderToggleSwitches();
  saveCardOrder();
  updateMoveButtonVisibilities();
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  triggerAutoSave();
}

function updateHeaderToggleSwitches() {
  const items = [
    { cardId: 'powerArmorCard', containerId: 'togglePowerArmorContainer' },
    { cardId: 'techniquesCard', containerId: 'toggleTechniquesContainer' },
    { cardId: 'quirksCard', containerId: 'toggleQuirksContainer' },
    { cardId: 'detractorsCard', containerId: 'toggleDetractorsContainer' },
    { cardId: 'cyberneticsCard', containerId: 'toggleCyberneticsContainer' },
    { cardId: 'mutationsCard', containerId: 'toggleMutationsContainer' },
    { cardId: 'psionicsCard', containerId: 'togglePsionicsContainer' },
    { cardId: 'backstoryCard', containerId: 'toggleBackstoryContainer' },
    { cardId: 'extraNotesCard', containerId: 'toggleExtraNotesContainer' },
    { cardId: 'conditionsCard', containerId: 'toggleConditionsContainer' }
  ];

  items.forEach((item) => {
    const card = document.getElementById(item.cardId);
    const toggleContainer = document.getElementById(item.containerId);
    if (!card || !toggleContainer) {
      return;
    }

    const parentPage = card.closest('[id^="page-"]');
    if (parentPage) {
      const togglesWrapper = parentPage.querySelector('[id$="-toggles"]');
      if (togglesWrapper) {
        togglesWrapper.appendChild(toggleContainer);
      }
    }
  });
}

function saveCardOrder() {
  const pageEls = document.querySelectorAll('[id^="page-"]');
  const orderData = {};

  pageEls.forEach((page) => {
    if (page.id === 'page-1' || page.id.includes('-header') || page.id.includes('-toggles')) {
      return;
    }
    const cardIds = Array.from(page.children)
      .filter((el) => el.classList && el.classList.contains('sheet-card'))
      .map((c) => c.id)
      .filter(Boolean);
    orderData[page.id] = cardIds;
  });

  localStorage.setItem('d20FuturePathCardOrder', JSON.stringify(orderData));
}

function restoreCardOrder() {
  try {
    const saved = localStorage.getItem('d20FuturePathCardOrder');
    if (!saved) {
      return;
    }
    const orderData = JSON.parse(saved);

    Object.keys(orderData).forEach((pageId) => {
      const m = pageId.match(/^page-(\d+)$/);
      if (!m) {
        return;
      }
      const pageNum = parseInt(m[1], 10);
      if (pageNum < 1) {
        return;
      }

      const cardIds = orderData[pageId];
      if (!Array.isArray(cardIds) || cardIds.length === 0) {
        return;
      }

      const page = (pageNum === 1 ? document.getElementById('page-1') : getOrCreatePageContainer(pageNum));
      const footer = page.querySelector('.print-footer');

      cardIds.forEach((id) => {
        const card = document.getElementById(id);
        if (card) {
          if (footer) {
            page.insertBefore(card, footer);
          } else {
            page.appendChild(card);
          }
        }
      });
    });

    document.querySelectorAll('[id^="page-"]').forEach((page) => {
      const footer = page.querySelector('.print-footer');
      if (footer) {
        page.appendChild(footer);
      }
    });

    updateHeaderToggleSwitches();
    updateMoveButtonVisibilities();
  } catch (err) {
    console.error('Error restoring card order:', err);
  }
}

function toggleCardLayoutLock() {
  const isLocked = document.body.classList.contains('layout-locked');
  setCardLayoutLocked(!isLocked);
}

function setCardLayoutLocked(locked) {
  const btn = document.getElementById('cardLayoutLockButton');
  const icon = document.getElementById('cardLayoutLockIcon');
  const text = document.getElementById('cardLayoutLockText');

  if (locked) {
    document.body.classList.add('layout-locked');
    if (icon) {
      icon.className = 'fa-solid fa-lock text-warning me-2';
    }
    if (text) {
      text.innerHTML = 'Layout Locked';
    }
    if (btn) {
      btn.classList.remove('active');
    }
    localStorage.setItem('d20FuturePathCardLayoutLocked', 'true');
  } else {
    document.body.classList.remove('layout-locked');
    if (icon) {
      icon.className = 'fa-solid fa-lock-open text-cyan me-2';
    }
    if (text) {
      text.innerHTML = 'Layout Unlocked';
    }
    if (btn) {
      btn.classList.add('active');
    }
    localStorage.setItem('d20FuturePathCardLayoutLocked', 'false');
  }
}

function restoreCardLayoutLockState() {
  const saved = localStorage.getItem('d20FuturePathCardLayoutLocked');
  const isLocked = (saved === null || saved === 'true');
  setCardLayoutLocked(isLocked);
}

function toggleTechniquesCardVisibility(show) {
  const card = document.getElementById('techniquesCard');
  if (card) {
    if (show) {
      card.classList.remove('card-hidden-all', 'd-none');
    } else {
      card.classList.add('card-hidden-all', 'd-none');
    }
  }
  localStorage.setItem('d20FuturePathShowTechniquesCard', show ? 'true' : 'false');
  updateEmptyPages();
  scheduleAutoPagination(50);
}

function restoreTechniquesVisibilityState() {
  const toggleInput = document.getElementById('global_toggleTechniquesVisibility');
  const savedState = localStorage.getItem('d20FuturePathShowTechniquesCard');
  if (savedState !== null) {
    const isVisible = (savedState === 'true');
    if (toggleInput) {
      toggleInput.checked = isVisible;
    }
    toggleTechniquesCardVisibility(isVisible);
  }
}

function toggleQuirksCardVisibility(show) {
  const card = document.getElementById('quirksCard');
  if (card) {
    if (show) {
      card.classList.remove('card-hidden-all', 'd-none');
    } else {
      card.classList.add('card-hidden-all', 'd-none');
    }
  }
  localStorage.setItem('d20FuturePathShowQuirksCard', show ? 'true' : 'false');
  updateEmptyPages();
  scheduleAutoPagination(50);
}

function restoreQuirksVisibilityState() {
  const toggleInput = document.getElementById('global_toggleQuirksVisibility');
  const savedState = localStorage.getItem('d20FuturePathShowQuirksCard');
  if (savedState !== null) {
    const isVisible = (savedState === 'true');
    if (toggleInput) {
      toggleInput.checked = isVisible;
    }
    toggleQuirksCardVisibility(isVisible);
  }
}

function toggleDetractorsCardVisibility(show) {
  const card = document.getElementById('detractorsCard');
  if (card) {
    if (show) {
      card.classList.remove('card-hidden-all', 'd-none');
    } else {
      card.classList.add('card-hidden-all', 'd-none');
    }
  }
  localStorage.setItem('d20FuturePathShowDetractorsCard', show ? 'true' : 'false');
  updateEmptyPages();
  scheduleAutoPagination(50);
}

function restoreDetractorsVisibilityState() {
  const toggleInput = document.getElementById('global_toggleDetractorsVisibility');
  const savedState = localStorage.getItem('d20FuturePathShowDetractorsCard');
  if (savedState !== null) {
    const isVisible = (savedState === 'true');
    if (toggleInput) {
      toggleInput.checked = isVisible;
    }
    toggleDetractorsCardVisibility(isVisible);
  }
}

function toggleCyberneticsCardVisibility(show) {
  const card = document.getElementById('cyberneticsCard');
  if (card) {
    if (show) {
      card.classList.remove('card-hidden-all', 'd-none');
    } else {
      card.classList.add('card-hidden-all', 'd-none');
    }
  }
  localStorage.setItem('d20FuturePathShowCyberneticsCard', show ? 'true' : 'false');
  updateEmptyPages();
  scheduleAutoPagination(50);
}

function restoreCyberneticsVisibilityState() {
  const toggleInput = document.getElementById('global_toggleCyberneticsVisibility');
  const savedState = localStorage.getItem('d20FuturePathShowCyberneticsCard');
  if (savedState !== null) {
    const isVisible = (savedState === 'true');
    if (toggleInput) {
      toggleInput.checked = isVisible;
    }
    toggleCyberneticsCardVisibility(isVisible);
  }
}

function toggleMutationsCardVisibility(show) {
  const card = document.getElementById('mutationsCard');
  if (card) {
    if (show) {
      card.classList.remove('card-hidden-all', 'd-none');
    } else {
      card.classList.add('card-hidden-all', 'd-none');
    }
  }
  localStorage.setItem('d20FuturePathShowMutationsCard', show ? 'true' : 'false');
  updateEmptyPages();
  scheduleAutoPagination(50);
}

function restoreMutationsVisibilityState() {
  const toggleInput = document.getElementById('global_toggleMutationsVisibility');
  const savedState = localStorage.getItem('d20FuturePathShowMutationsCard');
  if (savedState !== null) {
    const isVisible = (savedState === 'true');
    if (toggleInput) {
      toggleInput.checked = isVisible;
    }
    toggleMutationsCardVisibility(isVisible);
  }
}

function togglePsionicsCardVisibility(show) {
  const card = document.getElementById('psionicsCard');
  if (card) {
    if (show) {
      card.classList.remove('card-hidden-all', 'd-none');
    } else {
      card.classList.add('card-hidden-all', 'd-none');
    }
  }
  localStorage.setItem('d20FuturePathShowPsionicsCard', show ? 'true' : 'false');
  updateEmptyPages();
  scheduleAutoPagination(50);
}

function restorePsionicsVisibilityState() {
  const toggleInput = document.getElementById('global_togglePsionicsVisibility');
  const savedState = localStorage.getItem('d20FuturePathShowPsionicsCard');
  if (savedState !== null) {
    const isVisible = (savedState === 'true');
    if (toggleInput) {
      toggleInput.checked = isVisible;
    }
    togglePsionicsCardVisibility(isVisible);
  }
}

function handlePowerArmorProficiencyChange(num, isChecked) {
  handleWeaponProficiencyChange('powerArmorProf', num, 5, isChecked);
}

function addPowerArmorBlock() {
  const container = document.getElementById('powerArmorContainer');
  if (!container) {
    return;
  }

  const div = document.createElement('div');
  div.className = 'power-armor-block border rounded p-3 bg-opacity-10 bg-secondary';
  div.innerHTML = `
    <div class="row g-2 align-items-center mb-3">
      <div class="col-12 col-sm-6 col-md-6">
        <div class="input-group input-group-sm">
          <span class="input-group-text fw-bold text-muted" style="font-size: 0.75rem;">Power Armor Type:</span>
          <input type="text" class="form-control form-control-sm fw-bold" name="paType[]" placeholder="e.g. EXO-Mark V Assault">
        </div>
      </div>
      <div class="col-10 col-sm-5 col-md-5">
        <div class="input-group input-group-sm">
          <span class="input-group-text fw-bold text-muted" style="font-size: 0.75rem;">Power Armor Class:</span>
          <input type="text" class="form-control form-control-sm fw-bold" name="paClass[]" placeholder="e.g. Heavy">
        </div>
      </div>
      <div class="col-2 col-sm-1 col-md-1 text-end no-print">
        <button type="button" class="btn btn-sm btn-outline-danger py-1 px-2" onclick="removePowerArmorBlock(this)" title="Remove Power Armor">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>

    <div class="border rounded overflow-hidden">
      <div class="table-responsive">
        <table class="table table-custom mb-0 align-middle pa-mods-table">
          <thead>
            <tr>
              <th style="width: 200px;">Mod Name</th>
              <th>Description</th>
              <th style="width: 100px;" class="no-print text-center">
                <button type="button" class="btn btn-sm btn-cyber btn-add-row py-0 px-2" onclick="addPowerArmorModRow(this)" style="font-size: 0.72rem;">
                  <i class="fa-solid fa-plus me-1"></i> Mod
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="text" class="form-control form-control-sm" name="paModName[]" placeholder="e.g. Servo Thrusters"></td>
              <td><textarea class="form-control form-control-sm trait-desc-textarea" name="paModDesc[]" rows="1" oninput="autoExpandTextarea(this)" placeholder="Description"></textarea></td>
              <td class="no-print text-center"><button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeRow(this)"><i class="fa-solid fa-trash"></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
  container.appendChild(div);
  triggerAutoSave();
  scheduleAutoPagination(100);
}

function removePowerArmorBlock(btn) {
  const block = btn.closest('.power-armor-block');
  if (block) {
    block.remove();
    triggerAutoSave();
    scheduleAutoPagination(100);
  }
}

function addPowerArmorModRow(btn) {
  if (!btn) {
    return;
  }
  const block = btn.closest('.power-armor-block') || btn.closest('.sheet-card');
  if (!block) {
    return;
  }
  const tbody = block.querySelector('.pa-mods-table tbody');
  if (!tbody) {
    return;
  }

  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" class="form-control form-control-sm" name="paModName[]" placeholder="e.g. Servo Thrusters"></td>
    <td><textarea class="form-control form-control-sm trait-desc-textarea" name="paModDesc[]" rows="1" oninput="autoExpandTextarea(this)" placeholder="Description"></textarea></td>
    <td class="no-print text-center"><button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removeRow(this)"><i class="fa-solid fa-trash"></i></button></td>
  `;
  tbody.appendChild(tr);
  triggerAutoSave();
  scheduleAutoPagination(100);
}

function togglePowerArmorCardVisibility(show) {
  const card = document.getElementById('powerArmorCard');
  if (card) {
    if (show) {
      card.classList.remove('card-hidden-all', 'd-none');
    } else {
      card.classList.add('card-hidden-all', 'd-none');
    }
  }
  localStorage.setItem('d20FuturePathShowPowerArmorCard', show ? 'true' : 'false');
  updateEmptyPages();
  scheduleAutoPagination(50);
}

function restorePowerArmorVisibilityState() {
  const toggleInput = document.getElementById('global_togglePowerArmorVisibility');
  const savedState = localStorage.getItem('d20FuturePathShowPowerArmorCard');
  if (savedState !== null) {
    const isVisible = (savedState === 'true');
    if (toggleInput) {
      toggleInput.checked = isVisible;
    }
    togglePowerArmorCardVisibility(isVisible);
  }
}

function toggleBackstoryCardVisibility(show) {
  const card = document.getElementById('backstoryCard');
  if (card) {
    if (show) {
      card.classList.remove('card-hidden-all', 'd-none');
    } else {
      card.classList.add('card-hidden-all', 'd-none');
    }
  }
  localStorage.setItem('d20FuturePathShowBackstoryCard', show ? 'true' : 'false');
  updateEmptyPages();
  scheduleAutoPagination(50);
}

function restoreBackstoryVisibilityState() {
  const toggleInput = document.getElementById('global_toggleBackstoryVisibility');
  const savedState = localStorage.getItem('d20FuturePathShowBackstoryCard');
  if (savedState !== null) {
    const isVisible = (savedState === 'true');
    if (toggleInput) {
      toggleInput.checked = isVisible;
    }
    toggleBackstoryCardVisibility(isVisible);
  }
}

function toggleExtraNotesCardVisibility(show) {
  const card = document.getElementById('extraNotesCard');
  if (card) {
    if (show) {
      card.classList.remove('card-hidden-all', 'd-none');
    } else {
      card.classList.add('card-hidden-all', 'd-none');
    }
  }
  localStorage.setItem('d20FuturePathShowExtraNotesCard', show ? 'true' : 'false');
  updateEmptyPages();
  scheduleAutoPagination(50);
}

function restoreExtraNotesVisibilityState() {
  const toggleInput = document.getElementById('global_toggleExtraNotesVisibility');
  const savedState = localStorage.getItem('d20FuturePathShowExtraNotesCard');
  if (savedState !== null) {
    const isVisible = (savedState === 'true');
    if (toggleInput) {
      toggleInput.checked = isVisible;
    }
    toggleExtraNotesCardVisibility(isVisible);
  }
}

function toggleConditionsCardVisibility(show) {
  const card = document.getElementById('conditionsCard');
  if (card) {
    if (show) {
      card.classList.remove('card-hidden-all', 'd-none');
    } else {
      card.classList.add('card-hidden-all', 'd-none');
    }
  }
  localStorage.setItem('d20FuturePathShowConditionsCard', show ? 'true' : 'false');
  updateEmptyPages();
  scheduleAutoPagination(50);
}

function restoreConditionsVisibilityState() {
  const toggleInput = document.getElementById('global_toggleConditionsVisibility');
  const savedState = localStorage.getItem('d20FuturePathShowConditionsCard');
  if (savedState !== null) {
    const isVisible = (savedState === 'true');
    if (toggleInput) {
      toggleInput.checked = isVisible;
    }
    toggleConditionsCardVisibility(isVisible);
  }
}

function restoreCollapseStates() {
  try {
    const saved = localStorage.getItem('d20FuturePathCollapsedCards');
    if (saved) {
      const collapsedIds = JSON.parse(saved);
      if (Array.isArray(collapsedIds)) {
        collapsedIds.forEach((id) => {
          const el = document.getElementById(id);
          if (el && el.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getOrCreateInstance(el, { toggle: false });
            bsCollapse.hide();
          }
        });
      }
    }
  } catch (err) {
    console.error('Error restoring collapse states:', err);
  }
}

function setupCollapseInteractions() {
  document.querySelectorAll('.card-header-custom').forEach((header) => {
    header.style.cursor = 'pointer';
    header.addEventListener('click', (e) => {
      if (e.target.closest('button, input, select, label, a, .no-collapse, .prof-check-item')) {
        return;
      }
      const targetId = header.getAttribute('data-bs-target');
      if (targetId) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          const bsCollapse = bootstrap.Collapse.getOrCreateInstance(targetEl, { toggle: false });
          bsCollapse.toggle();
        }
      }
    });
  });
}

// Attach event listeners for change/input & theme setup
document.addEventListener('DOMContentLoaded', () => {
  initOriginalParentContainers();
  //applyTheme();
  loadAllReferanceData();

  const urlParams = new URLSearchParams(window.location.search);
  const isPrintParam = (urlParams.get('print') === 'true' || urlParams.get('print') === '1' || window.location.pathname.endsWith('/print'));
  const apiCharId = urlParams.get('id') || urlParams.get('character_id') || urlParams.get('starter_id');
  if (apiCharId) {
    loadCharacterFromAPI(apiCharId);
  } else {
    loadFromLocalStorage();
  }

  setupCollapseInteractions();
  if (isPrintParam) {
    document.body.classList.add('is-print-mode');
    expandAllCards();
  } else {
    restoreCollapseStates();
  }
  restoreCardOrder();
  updateHeaderToggleSwitches();
  restoreCardLayoutLockState();
  restoreTechniquesVisibilityState();
  restoreQuirksVisibilityState();
  restoreDetractorsVisibilityState();
  restoreCyberneticsVisibilityState();
  restoreMutationsVisibilityState();
  restorePsionicsVisibilityState();
  restorePowerArmorVisibilityState();
  restoreBackstoryVisibilityState();
  restoreExtraNotesVisibilityState();
  restoreConditionsVisibilityState();

  const hasLoadedLocalData = Boolean(localStorage.getItem('d20FuturePathCharData'));
  if (!hasLoadedLocalData && !apiCharId) {
    calculateStats();
    updateProficiencyCounts();
  }

  document.addEventListener('hidden.bs.collapse', () => {
    saveCollapseStates();
    scheduleAutoPagination(150);
  });
  document.addEventListener('shown.bs.collapse', () => {
    saveCollapseStates();
    scheduleAutoPagination(150);
  });
  window.addEventListener('resize', () => scheduleAutoPagination(250));

  const diceHistoryModalEl = document.getElementById('diceHistoryModal');
  if (diceHistoryModalEl) {
    diceHistoryModalEl.addEventListener('show.bs.modal', renderDiceHistory);
  }

  reexpandAllTextareas();
  updateEmptyPages();
  scheduleAutoPagination(100);

  if (isPrintParam) {
    setTimeout(() => {
      window.print();
    }, 300);
  }

  window.addEventListener('beforeprint', () => {
    document.body.classList.add('is-print-mode');
    expandAllCards();
    autoPaginateCards();
    updateEmptyPages();
    reexpandAllTextareas();
  });

  window.addEventListener('afterprint', () => {
    const params = new URLSearchParams(window.location.search);
    const printParam = (params.get('print') === 'true' || params.get('print') === '1' || window.location.pathname.endsWith('/print'));
    if (!printParam) {
      document.body.classList.remove('is-print-mode');
      restoreCollapseStates();
      reexpandAllTextareas();
      scheduleAutoPagination(50);
    }
  });

  const form = document.getElementById('characterForm');
  if (form) {
    form.addEventListener('input', (e) => {
      if (isStatOrCalcInput(e.target)) {
        debouncedCalculateStats();
      } else {
        triggerAutoSave();
      }
    });
    form.addEventListener('change', (e) => {
      if (e.target && (e.target.id === 'identityCard_charPath' || e.target.name === 'charPath')) {
        handlePathChange(e.target.value);
      } else if (e.target && e.target.name === 'profTitle[]') {
        handleProfessionChange(e.target);
      }
      if (isStatOrCalcInput(e.target)) {
        debouncedCalculateStats();
      } else {
        triggerAutoSave();
      }
    });
  }

  const modalTextarea = document.getElementById('descEditModalTextarea');
  if (modalTextarea) {
    modalTextarea.addEventListener('input', () => {
      if (activeDescTargetElement) {
        activeDescTargetElement.value = modalTextarea.value;
        autoExpandTextarea(activeDescTargetElement);
        triggerAutoSave();
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (window.innerWidth > 767.98) {
      return;
    }
    if (document.body.classList.contains('is-print-mode')) {
      return;
    }

    const target = e.target;
    if (!target) {
      return;
    }

    if (target.matches('.trait-desc-textarea, textarea[name*="Desc"], textarea[name*="desc"], textarea[name*="Effect"], textarea[name*="Notes"], input[name="armorBonusAttributes[]"], textarea[name="backstoryNotes"]')) {
      e.preventDefault();
      target.blur();
      openDescriptionModal(target);
    }
  });
});

let activeDescTargetElement = null;

function openDescriptionModal(target) {
  if (!target) {
    return;
  }
  activeDescTargetElement = target;

  const modalEl = document.getElementById('descEditModal');
  const titleEl = document.getElementById('descEditModalTitle');
  const subtitleEl = document.getElementById('descEditModalSubtitle');
  const textareaEl = document.getElementById('descEditModalTextarea');

  if (!modalEl || !titleEl || !textareaEl) {
    return;
  }

  // Derive contextual title and subtitle
  let itemName = '';
  const row = target.closest('tr');
  if (row) {
    const nameInput = row.querySelector('input[type="text"]:not([readonly])');
    if (nameInput && nameInput.value.trim()) {
      itemName = nameInput.value.trim();
    }
  }

  const card = target.closest('.sheet-card');
  let cardTitle = '';
  if (card) {
    const headerTitle = card.querySelector('.card-header-custom span');
    if (headerTitle) {
      cardTitle = headerTitle.textContent.trim();
    }
  }

  if (itemName && cardTitle) {
    titleEl.textContent = itemName;
    if (subtitleEl) {
      subtitleEl.textContent = `${cardTitle} - Description Details`;
    }
  } else if (itemName) {
    titleEl.textContent = itemName;
    if (subtitleEl) {
      subtitleEl.textContent = 'Description Details';
    }
  } else if (cardTitle) {
    titleEl.textContent = cardTitle;
    if (subtitleEl) {
      subtitleEl.textContent = 'Description Details';
    }
  } else {
    titleEl.textContent = 'Edit Description';
    if (subtitleEl) {
      subtitleEl.textContent = 'Description Details';
    }
  }

  textareaEl.value = target.value || '';

  if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
    modalInstance.show();
    setTimeout(() => {
      textareaEl.focus();
    }, 300);
  }
}

function saveDescriptionModal() {
  const modalEl = document.getElementById('descEditModal');
  const textareaEl = document.getElementById('descEditModalTextarea');
  if (activeDescTargetElement && textareaEl) {
    activeDescTargetElement.value = textareaEl.value;
    autoExpandTextarea(activeDescTargetElement);
    activeDescTargetElement.dispatchEvent(new Event('input', { bubbles: true }));
    activeDescTargetElement.dispatchEvent(new Event('change', { bubbles: true }));
  }

  if (typeof bootstrap !== 'undefined' && bootstrap.Modal && modalEl) {
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
}

function isStatOrCalcInput(target) {
  if (!target) {
    return false;
  }
  const id = target.id || '';
  const name = target.name || '';
  const classList = target.classList;

  if (id.includes('score') || id.includes('charPath') || id.includes('pathLevel') || id.includes('charSize')) {
    return true;
  }
  if (id.includes('ac') || id.includes('AC')) {
    return true;
  }
  if (classList && (classList.contains('skill-rank') || classList.contains('skill-misc-mod') || classList.contains('skill-ab-select') || classList.contains('ability-stat-input'))) {
    return true;
  }
  if (name.startsWith('skillRank_') || name.startsWith('skillMisc_')) {
    return true;
  }
  if (name.includes('gearWeight') || name.includes('gearQty') || name.includes('armorAC') || name.includes('armorMaxDex') || name.includes('armorWeight')) {
    return true;
  }
  return false;
}

let calcStatsTimeout = null;
function debouncedCalculateStats() {
  if (calcStatsTimeout) {
    clearTimeout(calcStatsTimeout);
  }
  calcStatsTimeout = setTimeout(() => {
    calculateStats();
  }, 40);
}
