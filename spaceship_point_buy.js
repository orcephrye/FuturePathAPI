#!/usr/bin/env node
/*jslint node:true, devel:true, long:true, unordered:true, white:true, for:true, fart:true, single:true, convert:true, nomen:true*/

/**
 * spaceship_point_buy.js
 *
 * Command-line tool and module for Spaceship Core System Attribute (CSA) point-buy allocation.
 *
 * Implements the official FuturePath point-buy rules:
 * - Scores: 7 to 20 with official costs.
 * - Prioritizes modifier bumps (even scores: 12, 14, 16, 18, 20).
 * - Distributes evenly when no priorities are specified.
 * - Respects priority order when 1 to 6 attributes are given.
 * - Negative attribute reductions only occur if they directly enable an improved modifier
 *   on a priority attribute.
 */

"use strict";

const CORE_ATTRIBUTES = [
    "Weapons",
    "Shields",
    "Engines",
    "Structure",
    "Sensors",
    "Electronics"
];

const SCORE_COSTS = {
    "7": -4,
    "8": -2,
    "9": -1,
    "10": 0,
    "11": 1,
    "12": 2,
    "13": 3,
    "14": 5,
    "15": 7,
    "16": 10,
    "17": 13,
    "18": 17,
    "19": 21,
    "20": 25
};

const MIN_SCORE = 7;
const MAX_SCORE = 20;

function getModifier(score) {
    return Math.floor((score - 10) / 2);
}

function getCost(score) {
    if (SCORE_COSTS[score] === undefined) {
        throw new Error(`Score ${score} is outside the valid range (${MIN_SCORE}-${MAX_SCORE}).`);
    }
    return SCORE_COSTS[score];
}

function normalizeAttribute(name) {
    if (!name || typeof name !== "string") {
        return null;
    }
    const lower = name.trim().toLowerCase();
    for (const attr of CORE_ATTRIBUTES) {
        if (attr.toLowerCase() === lower) {
            return attr;
        }
    }
    return null;
}

/**
 * Generate all even-spread multisets of scores across 6 attributes for a given budget and starting scores.
 */
function findEvenSpreadAllocations(startScores, budget, order) {
    const attrs = [...CORE_ATTRIBUTES];
    let bestSpread = null;
    let minVariance = Infinity;
    let maxModSum = -Infinity;
    let minUnspent = Infinity;

    function search(index, currentScores, remainingPoints) {
        if (index === attrs.length) {
            const scores = Object.values(currentScores);
            const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
            const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0);
            const modSum = scores.reduce((sum, s) => sum + getModifier(s), 0);

            if (
                bestSpread === null ||
                modSum > maxModSum ||
                (modSum === maxModSum && variance < minVariance) ||
                (modSum === maxModSum && variance === minVariance && remainingPoints < minUnspent)
            ) {
                bestSpread = { ...currentScores };
                minVariance = variance;
                maxModSum = modSum;
                minUnspent = remainingPoints;
            }
            return;
        }

        const attr = attrs[index];
        const start = startScores[attr];

        let score = start;
        while (score <= MAX_SCORE) {
            const cost = getCost(score) - getCost(start);
            if (cost <= remainingPoints) {
                currentScores[attr] = score;
                search(index + 1, currentScores, remainingPoints - cost);
            }
            score += 1;
        }
    }

    search(0, {}, budget);

    if (!bestSpread) {
        return { ...startScores };
    }

    const sortOrder = order || CORE_ATTRIBUTES;
    const sortedScores = Object.values(bestSpread).sort((a, b) => b - a);
    const result = {};
    let i = 0;
    while (i < sortOrder.length) {
        result[sortOrder[i]] = sortedScores[i];
        i += 1;
    }
    return result;
}

/**
 * Solve optimal point buy for a specific priority list and budget.
 */
function solvePriorityAllocation(priorityList, startScores, budget) {
    if (priorityList.length === 0) {
        return { allocation: {}, remaining: budget, mods: [] };
    }

    let bestSolution = null;

    function search(index, currentScores, remBudget) {
        if (index === priorityList.length) {
            const mods = priorityList.map((a) => getModifier(currentScores[a]));
            const scores = priorityList.map((a) => currentScores[a]);

            if (bestSolution === null) {
                bestSolution = {
                    scores: { ...currentScores },
                    mods,
                    scoreList: scores,
                    remaining: remBudget
                };
                return;
            }

            let i = 0;
            while (i < mods.length) {
                if (mods[i] > bestSolution.mods[i]) {
                    bestSolution = { scores: { ...currentScores }, mods, scoreList: scores, remaining: remBudget };
                    return;
                }
                if (mods[i] < bestSolution.mods[i]) {
                    return;
                }
                i += 1;
            }

            let j = 0;
            while (j < scores.length) {
                if (scores[j] > bestSolution.scoreList[j]) {
                    bestSolution = { scores: { ...currentScores }, mods, scoreList: scores, remaining: remBudget };
                    return;
                }
                if (scores[j] < bestSolution.scoreList[j]) {
                    return;
                }
                j += 1;
            }

            if (remBudget < bestSolution.remaining) {
                bestSolution = { scores: { ...currentScores }, mods, scoreList: scores, remaining: remBudget };
            }
            return;
        }

        const attr = priorityList[index];
        const start = startScores[attr];

        let score = MAX_SCORE;
        while (score >= start) {
            const cost = getCost(score) - getCost(start);
            if (cost <= remBudget) {
                currentScores[attr] = score;
                search(index + 1, currentScores, remBudget - cost);
            }
            score -= 1;
        }
    }

    search(0, {}, budget);

    if (!bestSolution) {
        return { allocation: {}, remaining: budget, mods: [] };
    }
    return {
        allocation: bestSolution.scores,
        mods: bestSolution.mods,
        remaining: bestSolution.remaining
    };
}

function isSpreadCandidateBetter(candA, candB) {
    if (!candB) {
        return true;
    }
    if (candA.minMod !== candB.minMod) {
        return candA.minMod > candB.minMod;
    }
    if (candA.modSum !== candB.modSum) {
        return candA.modSum > candB.modSum;
    }
    const aEven = candA.spread <= 2;
    const bEven = candB.spread <= 2;
    if (aEven && !bEven) {
        return true;
    }
    if (!aEven && bEven) {
        return false;
    }
    if (!aEven && !bEven && candA.spread !== candB.spread) {
        return candA.spread < candB.spread;
    }
    if (candA.scoreSum !== candB.scoreSum) {
        return candA.scoreSum > candB.scoreSum;
    }
    if (candA.spread !== candB.spread) {
        return candA.spread < candB.spread;
    }
    let i = 0;
    while (i < candA.scores.length) {
        if (candA.scores[i] !== candB.scores[i]) {
            return candA.scores[i] > candB.scores[i];
        }
        i += 1;
    }
    return candA.remaining < candB.remaining;
}

function solveSpreadPriorityAllocation(priorityList, startScores, budget) {
    if (priorityList.length === 0) {
        return { allocation: {}, mods: [], remaining: budget };
    }
    if (priorityList.length === 1) {
        return solvePriorityAllocation(priorityList, startScores, budget);
    }

    let bestSolution = null;

    function search(index, currentScores, remBudget, minPreviousScore) {
        if (index === priorityList.length) {
            const scores = priorityList.map(function (a) {
                return currentScores[a];
            });
            const mods = scores.map(getModifier);
            const minMod = Math.min.apply(null, mods);
            const modSum = mods.reduce(function (sum, m) {
                return sum + m;
            }, 0);
            const minScore = Math.min.apply(null, scores);
            const maxScore = Math.max.apply(null, scores);
            const spread = maxScore - minScore;
            const scoreSum = scores.reduce(function (sum, s) {
                return sum + s;
            }, 0);

            const candidate = {
                allocation: Object.assign({}, currentScores),
                minMod,
                minScore,
                modSum,
                mods,
                remaining: remBudget,
                scoreSum,
                scores,
                spread
            };

            if (isSpreadCandidateBetter(candidate, bestSolution)) {
                bestSolution = candidate;
            }
            return;
        }

        const attr = priorityList[index];
        const start = startScores[attr];
        let maxAllowed = Math.min(MAX_SCORE, minPreviousScore);
        if (maxAllowed < start) {
            maxAllowed = start;
        }

        let score = maxAllowed;
        while (score >= start) {
            const cost = getCost(score) - getCost(start);
            if (cost <= remBudget) {
                currentScores[attr] = score;
                search(index + 1, currentScores, remBudget - cost, score);
            }
            score -= 1;
        }
    }

    search(0, {}, budget, MAX_SCORE);

    if (!bestSolution) {
        return { allocation: {}, mods: [], remaining: budget };
    }
    return {
        allocation: bestSolution.allocation,
        minMod: bestSolution.minMod,
        modSum: bestSolution.modSum,
        mods: bestSolution.mods,
        remaining: bestSolution.remaining,
        scoreSum: bestSolution.scoreSum,
        scores: bestSolution.scores,
        spread: bestSolution.spread
    };
}

/**
 * Distribute remaining points randomly to unspecified attributes, prioritizing even scores (modifier bumps).
 */
function distributeRemainingRandomly(scores, eligibleAttrs, remPoints, randomFn) {
    let budget = remPoints;
    let pool = [...eligibleAttrs];
    let rand = Math.random;
    if (typeof randomFn === "function") {
        rand = randomFn;
    }

    while (budget >= 2 && pool.length > 0) {
        const candidates = [];
        for (const attr of pool) {
            const current = scores[attr];
            let target = current + 1;
            if (current % 2 === 0) {
                target = current + 2;
            }
            if (target <= MAX_SCORE) {
                const cost = getCost(target) - getCost(current);
                if (cost <= budget) {
                    candidates.push({ attr, target, cost });
                }
            }
        }

        if (candidates.length === 0) {
            break;
        }

        const pickedIdx = Math.floor(rand() * candidates.length);
        const choice = candidates[pickedIdx];
        scores[choice.attr] = choice.target;
        budget -= choice.cost;
    }

    while (budget >= 1 && pool.length > 0) {
        const candidates = [];
        for (const attr of pool) {
            const current = scores[attr];
            const target = current + 1;
            if (target <= MAX_SCORE) {
                const cost = getCost(target) - getCost(current);
                if (cost <= budget) {
                    candidates.push({ attr, target, cost });
                }
            }
        }

        if (candidates.length === 0) {
            break;
        }

        const pickedIdx = Math.floor(rand() * candidates.length);
        const choice = candidates[pickedIdx];
        scores[choice.attr] = choice.target;
        budget -= choice.cost;
    }

    return budget;
}

/**
 * Enumerate combinations of negative reductions along negativePriority order.
 */
function generateNegativeCandidates(index, currentReductions, negativePriority, startScores, negativeLimit) {
    const results = [];
    if (index === negativePriority.length) {
        if (Object.keys(currentReductions).length > 0) {
            results.push({ ...currentReductions });
        }
        return results;
    }

    const attr = negativePriority[index];
    const start = startScores[attr];

    results.push(...generateNegativeCandidates(index + 1, currentReductions, negativePriority, startScores, negativeLimit));

    let targetScore = start - 1;
    while (targetScore >= negativeLimit) {
        currentReductions[attr] = targetScore;
        results.push(...generateNegativeCandidates(index + 1, currentReductions, negativePriority, startScores, negativeLimit));
        delete currentReductions[attr];
        targetScore -= 1;
    }

    return results;
}

/**
 * Main Point Buy function.
 *
 * @param {Object} options
 * @param {number} [options.points=15] - Points budget to spend.
 * @param {Object} [options.startScores] - Starting scores (default all 10).
 * @param {string[]} [options.priority=[]] - Attributes to prioritize in order.
 * @param {boolean} [options.allowNegatives=false] - Whether to allow negative attributes.
 * @param {number} [options.negativeLimit=8] - Minimum allowed score when negatives are allowed.
 * @param {string[]} [options.negativePriority=[]] - Order of attributes eligible for negative reduction.
 * @param {function} [options.randomFn=Math.random] - Optional RNG for reproducibility.
 * @returns {Object} Six Core System Attribute scores.
 */
function pointBuy(options = {}) {
    let points = 15;
    if (options.points !== undefined) {
        points = Number(options.points);
    }
    if (Number.isNaN(points)) {
        throw new Error("Points must be a valid number.");
    }

    const startScores = {};
    for (const attr of CORE_ATTRIBUTES) {
        startScores[attr] = 10;
    }
    if (options.startScores) {
        for (const [key, val] of Object.entries(options.startScores)) {
            const norm = normalizeAttribute(key);
            if (norm) {
                const num = Number(val);
                if (Number.isNaN(num) || num < MIN_SCORE || num > MAX_SCORE) {
                    throw new Error(`Invalid starting score for ${norm}: ${val}. Must be between ${MIN_SCORE} and ${MAX_SCORE}.`);
                }
                startScores[norm] = num;
            }
        }
    }

    const rawPriority = options.priority || [];
    const priority = [];
    for (const item of rawPriority) {
        const norm = normalizeAttribute(item);
        if (!norm) {
            throw new Error(`Unknown attribute in priority list: '${item}'.`);
        }
        if (!priority.includes(norm)) {
            priority.push(norm);
        }
    }

    const allowNegatives = Boolean(options.allowNegatives);
    let negativeLimit = 8;
    if (options.negativeLimit !== undefined) {
        negativeLimit = Number(options.negativeLimit);
    }
    if (Number.isNaN(negativeLimit) || negativeLimit < MIN_SCORE || negativeLimit > 10) {
        throw new Error(`Invalid negative score limit: ${options.negativeLimit}. Must be between ${MIN_SCORE} and 10.`);
    }

    const rawNegPriority = options.negativePriority || [];
    const negativePriority = [];
    for (const item of rawNegPriority) {
        const norm = normalizeAttribute(item);
        if (!norm) {
            throw new Error(`Unknown attribute in negative priority list: '${item}'.`);
        }
        if (!negativePriority.includes(norm)) {
            negativePriority.push(norm);
        }
    }

    for (const negAttr of negativePriority) {
        if (priority.includes(negAttr)) {
            throw new Error(`Attribute '${negAttr}' cannot appear in both priority and negative-priority lists.`);
        }
    }

    let randomFn = Math.random;
    if (typeof options.randomFn === "function") {
        randomFn = options.randomFn;
    }

    let distribution = "concentrate";
    if (options.distribution) {
        const dNorm = options.distribution.trim().toLowerCase();
        if (dNorm === "spread" || dNorm === "even" || dNorm === "even-distribution") {
            distribution = "spread";
        } else if (dNorm === "concentrate" || dNorm === "concentrated") {
            distribution = "concentrate";
        }
    } else if (options.evenDistribution || options.spread) {
        distribution = "spread";
    }

    if (priority.length === 0) {
        return findEvenSpreadAllocations(startScores, points, CORE_ATTRIBUTES);
    }

    if (priority.length === CORE_ATTRIBUTES.length && distribution === "spread") {
        return findEvenSpreadAllocations(startScores, points, priority);
    }

    let solverFn = solvePriorityAllocation;
    if (distribution === "spread") {
        solverFn = solveSpreadPriorityAllocation;
    }

    const baseline = solverFn(priority, startScores, points);

    let chosenNegReductions = {};
    let chosenPriorityScores = baseline.allocation;
    let remainingAfterPriority = baseline.remaining;

    if (allowNegatives && negativePriority.length > 0) {
        const candidateReductions = generateNegativeCandidates(0, {}, negativePriority, startScores, negativeLimit);

        candidateReductions.sort(function (a, b) {
            const ptsA = Object.entries(a).reduce(function (sum, entry) {
                return sum + (getCost(startScores[entry[0]]) - getCost(entry[1]));
            }, 0);
            const ptsB = Object.entries(b).reduce(function (sum, entry) {
                return sum + (getCost(startScores[entry[0]]) - getCost(entry[1]));
            }, 0);
            if (ptsA !== ptsB) {
                return ptsA - ptsB;
            }
            return Object.keys(a).length - Object.keys(b).length;
        });

        for (const reduction of candidateReductions) {
            let reclaimedPoints = 0;
            for (const [attr, redScore] of Object.entries(reduction)) {
                reclaimedPoints += (getCost(startScores[attr]) - getCost(redScore));
            }

            const trialBudget = points + reclaimedPoints;
            const trialSolution = solverFn(priority, startScores, trialBudget);

            let improved = false;
            if (distribution === "spread") {
                improved = isSpreadCandidateBetter(trialSolution, baseline);
            } else {
                let i = 0;
                while (i < priority.length) {
                    if (trialSolution.mods[i] > baseline.mods[i]) {
                        improved = true;
                        break;
                    }
                    if (trialSolution.mods[i] < baseline.mods[i]) {
                        improved = false;
                        break;
                    }
                    i += 1;
                }
            }

            if (improved) {
                chosenNegReductions = reduction;
                chosenPriorityScores = trialSolution.allocation;
                remainingAfterPriority = trialSolution.remaining;
                break;
            }
        }
    }

    const finalScores = { ...startScores };

    Object.keys(chosenNegReductions).forEach((attr) => {
        finalScores[attr] = chosenNegReductions[attr];
    });

    Object.keys(chosenPriorityScores).forEach((attr) => {
        finalScores[attr] = chosenPriorityScores[attr];
    });

    const unspecifiedAttrs = CORE_ATTRIBUTES.filter(
        (attr) => !priority.includes(attr) && !chosenNegReductions[attr]
    );

    if (remainingAfterPriority > 0 && unspecifiedAttrs.length > 0) {
        distributeRemainingRandomly(
            finalScores,
            unspecifiedAttrs,
            remainingAfterPriority,
            randomFn
        );
    }

    return finalScores;
}

// =============================================================================
// CLI Entry Point
// =============================================================================
function parseArgs(args) {
    const options = {
        allowNegatives: false,
        distribution: "concentrate",
        negativeLimit: 8,
        negativePriority: [],
        points: 15,
        priority: [],
        startScores: {},
        verbose: false
    };

    let i = 0;
    while (i < args.length) {
        const arg = args[i];

        if (arg === "--help" || arg === "-h") {
            options.help = true;
            return options;
        }
        if (arg === "--points" || arg === "-p") {
            i += 1;
            options.points = Number(args[i]);
        } else if (arg === "--priority" || arg === "-pri") {
            i += 1;
            const parts = args[i].split(",").map(function (s) {
                return s.trim();
            }).filter(Boolean);
            options.priority.push(...parts);
        } else if (arg === "--distribution" || arg === "-d") {
            i += 1;
            options.distribution = args[i];
        } else if (arg === "--even-distribution" || arg === "--even" || arg === "--spread") {
            options.distribution = "spread";
        } else if (arg === "--concentrate" || arg === "--concentrated") {
            options.distribution = "concentrate";
        } else if (arg === "--allow-negatives" || arg === "--allow-negative" || arg === "-n") {
            options.allowNegatives = true;
            if (i + 1 < args.length && (/^[0-9]+$/).test(args[i + 1])) {
                i += 1;
                options.negativeLimit = Number(args[i]);
            }
        } else if (arg === "--negative-floor" || arg === "--negative-limit") {
            i += 1;
            options.negativeLimit = Number(args[i]);
        } else if (arg === "--negative-priority" || arg === "--dump-priority" || arg === "-np") {
            i += 1;
            const parts = args[i].split(",").map(function (s) {
                return s.trim();
            }).filter(Boolean);
            options.negativePriority.push(...parts);
        } else if (arg === "--starting" || arg === "-s" || arg === "--base" || arg === "-b") {
            i += 1;
            const raw = args[i];
            if (raw.startsWith("{")) {
                Object.assign(options.startScores, JSON.parse(raw));
            } else if (raw.includes(":") || raw.includes("=")) {
                for (const pair of raw.split(",")) {
                    const [k, v] = pair.split(/[:=]/).map(function (s) {
                        return s.trim();
                    });
                    if (k && v) {
                        options.startScores[k] = Number(v);
                    }
                }
            } else if (raw.includes(",")) {
                const nums = raw.split(",").map(function (s) {
                    return Number(s.trim());
                });
                if (nums.length === CORE_ATTRIBUTES.length) {
                    CORE_ATTRIBUTES.forEach(function (attr, idx) {
                        options.startScores[attr] = nums[idx];
                    });
                }
            }
        } else if (arg === "--verbose" || arg === "-v") {
            options.verbose = true;
        } else if (arg === "--json") {
            options.verbose = false;
        } else if (arg.startsWith("--") && CORE_ATTRIBUTES.map(function (a) {
            return a.toLowerCase();
        }).includes(arg.slice(2).toLowerCase())) {
            const attrName = normalizeAttribute(arg.slice(2));
            i += 1;
            options.startScores[attrName] = Number(args[i]);
        }
        i += 1;
    }

    return options;
}

function showHelp() {
    console.log(`
Spaceship Core System Attribute (CSA) Point-Buy Tool
Usage: node spaceship_point_buy.js [options]

Options:
  -p, --points <number>             Point budget to spend (default: 15).
  -pri, --priority <attr1,attr2>    Core System Attributes to prioritize in order.
  -d, --distribution <mode>         Point distribution: 'concentrate' (default) or 'spread'.
      --even-distribution           Alias for '--distribution spread'. Divides points evenly across
                                    priority attributes with preference to top priority.
  -s, --starting <json_or_pairs>    Starting scores (default: all 10).
                                    Examples: --starting '{"Weapons":12}' or --starting Weapons:12,Engines:10
  -n, --allow-negatives [limit]     Allow negative scores down to limit (default limit: 8, min: 7).
  -np, --negative-priority <list>   Attributes eligible for negative modification, in priority order.
                                    Cannot include any attribute from the priority list.
  -v, --verbose                     Display point breakdown and modifier details.
  -h, --help                        Show this help message.

Examples:
  node spaceship_point_buy.js
  node spaceship_point_buy.js --priority Weapons
  node spaceship_point_buy.js --points 15 --priority Weapons,Engines
  node spaceship_point_buy.js --points 15 --priority Sensors,Shields,Structure --even-distribution
  node spaceship_point_buy.js --priority Weapons --allow-negatives 8 --negative-priority Sensors
  node spaceship_point_buy.js --priority Engines,Weapons,Structure,Shields,Electronics,Sensors
`);
}

function runCli() {
    try {
        const options = parseArgs(process.argv.slice(2));
        if (options.help) {
            showHelp();
            process.exit(0);
        }

        const scores = pointBuy(options);

        if (options.verbose) {
            console.log("Final Core System Attributes:");
            console.log(JSON.stringify(scores, null, 2));

            let totalSpent = 0;
            console.log("\nBreakdown:");
            for (const attr of CORE_ATTRIBUTES) {
                const s = scores[attr];
                let start = 10;
                if (options.startScores[attr] !== undefined) {
                    start = options.startScores[attr];
                }
                const cost = getCost(s) - getCost(start);
                totalSpent += cost;
                const mod = getModifier(s);
                let modStr = `${mod}`;
                if (mod >= 0) {
                    modStr = `+${mod}`;
                }
                let costStr = `${cost}`;
                if (cost >= 0) {
                    costStr = `+${cost}`;
                }
                console.log(`  ${attr.padEnd(12)}: ${s.toString().padStart(2)} (Mod: ${modStr}) [Cost: ${costStr}]`);
            }
            console.log(`\nTotal Points Spent: ${totalSpent} / ${options.points}`);
        } else {
            console.log(JSON.stringify(scores, null, 2));
        }
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
}

if (require.main === module) {
    runCli();
}

module.exports = {
    CORE_ATTRIBUTES,
    SCORE_COSTS,
    getCost,
    getModifier,
    pointBuy,
    solvePriorityAllocation,
    solveSpreadPriorityAllocation
};
