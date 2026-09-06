/**
 * ability_score_calc_wiki_ui.js
 * 
 * MediaWiki Interactive Ability Theme & Score Calculator Widget
 * 
 * Supports 3 distribution methods:
 * 1. Standard Spread (Default 15, 14, 13, 12, 10, 8 with Low/High fantasy options)
 * 2. Dice Roller (Low / Standard / High / Epic Fantasy via FuturePathAPI /tasks/roll/character/<level>)
 * 3. Point Buy (Low / Standard / High / Epic fantasy budgets, scores 7-18 with official costs)
 * 
 * Embed this script into MediaWiki:Common.js or a MediaWiki Gadget.
 * To display the widget on any wiki page, add:
 *   <div id="ability-score-calc-widget"></div>
 */

(function () {
    'use strict';

    // =========================================================================
    // 1. Constants & Core Data
    // =========================================================================
    const CORE_ATTRIBUTES = [
        { key: 'STR', name: 'Strength', desc: 'Physical power and melee prowess' },
        { key: 'DEX', name: 'Dexterity', desc: 'Agility, reflexes, and ranged accuracy' },
        { key: 'CON', name: 'Constitution', desc: 'Health, stamina, and hit point bonus' },
        { key: 'INT', name: 'Intelligence', desc: 'Knowledge, reasoning, and skill points' },
        { key: 'WIS', name: 'Wisdom', desc: 'Perception, insight, and willpower' },
        { key: 'CHA', name: 'Charisma', desc: 'Leadership, persuasiveness, and force of personality' }
    ];

    const SPREADS = {
        'standard': {
            name: 'Standard Fantasy (15, 14, 13, 12, 10, 8)',
            scores: [15, 14, 13, 12, 10, 8]
        },
        'low': {
            name: 'Low Fantasy (14, 12, 10, 10, 8, 8)',
            scores: [14, 12, 10, 10, 8, 8]
        },
        'high': {
            name: 'High Fantasy (19, 18, 16, 13, 12, 10)',
            scores: [19, 18, 16, 13, 12, 10]
        }
    };

    const POINT_BUY_BUDGETS = {
        'low': { name: 'Low Fantasy', points: 10 },
        'standard': { name: 'Standard Fantasy', points: 15 },
        'high': { name: 'High Fantasy', points: 20 },
        'epic': { name: 'Epic Fantasy', points: 25 }
    };

    const POINT_BUY_COSTS = {
        7: -4,
        8: -2,
        9: -1,
        10: 0,
        11: 1,
        12: 2,
        13: 3,
        14: 5,
        15: 7,
        16: 10,
        17: 13,
        18: 17
    };

    const ROLLER_CONFIGS = {
        'low': {
            name: 'Low Fantasy',
            apiLevel: 'low',
            desc: '3d6 (reroll total <= 7), 6 rolls',
            diceCount: 3,
            sides: 6,
            dropLowest: 0,
            rerollTotal: 7,
            totalRolls: 6,
            dropLowestTotal: 0
        },
        'standard': {
            name: 'Standard Fantasy',
            apiLevel: 'normal',
            desc: '4d6 drop lowest 1 (reroll total <= 8), 6 rolls',
            diceCount: 4,
            sides: 6,
            dropLowest: 1,
            rerollTotal: 8,
            totalRolls: 6,
            dropLowestTotal: 0
        },
        'high': {
            name: 'High Fantasy',
            apiLevel: 'high',
            desc: '4d6 drop lowest 1 (reroll total <= 9), 7 rolls drop lowest',
            diceCount: 4,
            sides: 6,
            dropLowest: 1,
            rerollTotal: 9,
            totalRolls: 7,
            dropLowestTotal: 1
        },
        'epic': {
            name: 'Epic Fantasy',
            apiLevel: 'epic',
            desc: '5d6 drop lowest 2 (reroll total <= 10), 7 rolls drop lowest',
            diceCount: 5,
            sides: 6,
            dropLowest: 2,
            rerollTotal: 10,
            totalRolls: 7,
            dropLowestTotal: 1
        }
    };

    // =========================================================================
    // 2. Calculation Helpers
    // =========================================================================
    function calculateModifier(score) {
        if (score === null || score === undefined || isNaN(score)) return 0;
        return Math.floor((score - 10) / 2);
    }

    function formatModifier(mod) {
        if (mod > 0) return `+${mod}`;
        return `${mod}`;
    }

    // Client-side dice rolling fallback replicating FuturePathAPI/Rolling.py
    function rollSingleDie(sides) {
        return Math.floor(Math.random() * sides) + 1;
    }

    function rollScore(diceCount, sides, dropLowest, rerollTotal) {
        for (let attempt = 0; attempt < 100; attempt++) {
            const dice = [];
            for (let i = 0; i < diceCount; i++) {
                dice.push(rollSingleDie(sides));
            }
            const sorted = [...dice].sort((a, b) => a - b);
            const kept = sorted.slice(dropLowest);
            const total = kept.reduce((a, b) => a + b, 0);
            if (total > rerollTotal) {
                return { total, dice, kept };
            }
        }
        return { total: rerollTotal + 1, dice: [], kept: [] };
    }

    function rollCharacterLocally(config) {
        const rolls = [];
        for (let i = 0; i < config.totalRolls; i++) {
            rolls.push(rollScore(config.diceCount, config.sides, config.dropLowest, config.rerollTotal));
        }
        if (config.dropLowestTotal > 0) {
            let minIndex = 0;
            for (let i = 1; i < rolls.length; i++) {
                if (rolls[i].total < rolls[minIndex].total) {
                    minIndex = i;
                }
            }
            rolls.splice(minIndex, 1);
        }
        return rolls.map(r => r.total);
    }

    // =========================================================================
    // 3. Theme-Aware CSS Styles
    // =========================================================================
    const CSS_STYLES = `
        .asc-container {
            --asc-card-bg: #f8f9fa;
            --asc-card-border: #c8ccd1;
            --asc-text: #202122;
            --asc-subtext: #54595d;
            --asc-input-bg: #ffffff;
            --asc-input-border: #a2a9b1;
            --asc-input-text: #202122;
            --asc-table-hdr-bg: #eaecf0;
            --asc-table-hdr-text: #202122;
            --asc-table-border: #a2a9b1;
            --asc-table-bg: #ffffff;
            --asc-btn-primary: #3366cc;
            --asc-btn-primary-hover: #2a4b8d;
            --asc-btn-copy: #2ea44f;
            --asc-btn-copy-hover: #22863a;
            --asc-btn-secondary: #eaecf0;
            --asc-btn-secondary-hover: #dadde3;
            --asc-btn-secondary-text: #202122;
            --asc-tab-active-border: #3366cc;
            --asc-tab-active-bg: #ffffff;
            --asc-badge-bg: #eaecf0;
            --asc-badge-text: #202122;
            --asc-badge-active-bg: #3366cc;
            --asc-badge-active-text: #ffffff;
            --asc-link: #3366cc;
            --asc-error: #d33;
            --asc-success: #2ea44f;
            --asc-warning: #b35900;
            --asc-highlight-bg: #eaf3ff;
            background: var(--asc-card-bg);
            border: 1px solid var(--asc-card-border);
            color: var(--asc-text);
            border-radius: 6px;
            padding: 16px;
            margin: 15px 0;
            max-width: 1100px;
            width: 100%;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }

        /* MediaWiki Vector 2022 Night mode & Dark Mode Gadget/Skin Classes */
        html.skin-theme-clientpref-night .asc-container,
        html.dark-mode .asc-container,
        body.skin-night .asc-container,
        body.theme-dark .asc-container,
        html.client-dark-mode .asc-container {
            --asc-card-bg: #202122;
            --asc-card-border: #54595d;
            --asc-text: #f8f9fa;
            --asc-subtext: #a2a9b1;
            --asc-input-bg: #27292d;
            --asc-input-border: #72777d;
            --asc-input-text: #f8f9fa;
            --asc-table-hdr-bg: #2e3034;
            --asc-table-hdr-text: #ffffff;
            --asc-table-border: #54595d;
            --asc-table-bg: #202122;
            --asc-btn-primary: #447ff5;
            --asc-btn-primary-hover: #3366cc;
            --asc-btn-copy: #34b359;
            --asc-btn-copy-hover: #2ea44f;
            --asc-btn-secondary: #2e3034;
            --asc-btn-secondary-hover: #3a3d42;
            --asc-btn-secondary-text: #f8f9fa;
            --asc-tab-active-border: #447ff5;
            --asc-tab-active-bg: #27292d;
            --asc-badge-bg: #2e3034;
            --asc-badge-text: #f8f9fa;
            --asc-badge-active-bg: #447ff5;
            --asc-badge-active-text: #ffffff;
            --asc-link: #6699ff;
            --asc-error: #ff6b6b;
            --asc-success: #34b359;
            --asc-warning: #ffaa33;
            --asc-highlight-bg: #1c2b42;
        }

        /* OS automatic Dark mode */
        @media (prefers-color-scheme: dark) {
            html.skin-theme-clientpref-os .asc-container,
            html:not(.skin-theme-clientpref-day):not(.skin-theme-clientpref-night) .asc-container {
                --asc-card-bg: #202122;
                --asc-card-border: #54595d;
                --asc-text: #f8f9fa;
                --asc-subtext: #a2a9b1;
                --asc-input-bg: #27292d;
                --asc-input-border: #72777d;
                --asc-input-text: #f8f9fa;
                --asc-table-hdr-bg: #2e3034;
                --asc-table-hdr-text: #ffffff;
                --asc-table-border: #54595d;
                --asc-table-bg: #202122;
                --asc-btn-primary: #447ff5;
                --asc-btn-primary-hover: #3366cc;
                --asc-btn-copy: #34b359;
                --asc-btn-copy-hover: #2ea44f;
                --asc-btn-secondary: #2e3034;
                --asc-btn-secondary-hover: #3a3d42;
                --asc-btn-secondary-text: #f8f9fa;
                --asc-tab-active-border: #447ff5;
                --asc-tab-active-bg: #27292d;
                --asc-badge-bg: #2e3034;
                --asc-badge-text: #f8f9fa;
                --asc-badge-active-bg: #447ff5;
                --asc-badge-active-text: #ffffff;
                --asc-link: #6699ff;
                --asc-error: #ff6b6b;
                --asc-success: #34b359;
                --asc-warning: #ffaa33;
                --asc-highlight-bg: #1c2b42;
            }
        }

        .asc-tabs {
            display: flex;
            border-bottom: 2px solid var(--asc-card-border);
            gap: 6px;
            margin-bottom: 16px;
            overflow-x: auto;
        }
        .asc-tab-btn {
            background: transparent;
            border: none;
            border-bottom: 3px solid transparent;
            color: var(--asc-subtext);
            padding: 10px 18px;
            font-size: 0.95em;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
        }
        .asc-tab-btn:hover {
            color: var(--asc-text);
            background: var(--asc-btn-secondary);
        }
        .asc-tab-btn.active {
            color: var(--asc-btn-primary);
            border-bottom: 3px solid var(--asc-tab-active-border);
            background: var(--asc-tab-active-bg);
        }

        .asc-tab-content {
            display: none;
        }
        .asc-tab-content.active {
            display: block;
        }

        .asc-control-row {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            align-items: center;
            margin-bottom: 15px;
        }

        .asc-input {
            background: var(--asc-input-bg) !important;
            border: 1px solid var(--asc-input-border) !important;
            color: var(--asc-input-text) !important;
            border-radius: 4px;
            padding: 6px 10px;
            font-size: 0.9em;
            box-sizing: border-box;
        }

        .asc-btn {
            border: none;
            padding: 7px 14px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.9em;
            transition: background 0.15s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .asc-btn-primary {
            background: var(--asc-btn-primary);
            color: #ffffff !important;
        }
        .asc-btn-primary:hover {
            background: var(--asc-btn-primary-hover);
        }
        .asc-btn-copy {
            background: var(--asc-btn-copy);
            color: #ffffff !important;
        }
        .asc-btn-copy:hover {
            background: var(--asc-btn-copy-hover);
        }
        .asc-btn-secondary {
            background: var(--asc-btn-secondary);
            color: var(--asc-btn-secondary-text) !important;
            border: 1px solid var(--asc-card-border);
        }
        .asc-btn-secondary:hover {
            background: var(--asc-btn-secondary-hover);
        }

        .asc-stepper-btn {
            width: 30px;
            height: 30px;
            border-radius: 4px;
            border: 1px solid var(--asc-input-border);
            background: var(--asc-btn-secondary);
            color: var(--asc-text);
            font-weight: bold;
            font-size: 1.1em;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: background 0.15s ease;
        }
        .asc-stepper-btn:hover:not(:disabled) {
            background: var(--asc-btn-primary);
            color: #ffffff;
            border-color: var(--asc-btn-primary);
        }
        .asc-stepper-btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }

        .asc-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 0.85em;
            font-weight: 600;
            background: var(--asc-badge-bg);
            color: var(--asc-badge-text);
        }
        .asc-badge-pool {
            font-size: 1em;
            padding: 4px 10px;
            cursor: default;
            border: 1px solid var(--asc-card-border);
        }
        .asc-badge-pool.assigned {
            opacity: 0.45;
            text-decoration: line-through;
        }

        .asc-attr-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
            gap: 12px;
            margin-bottom: 16px;
        }
        .asc-attr-card {
            background: var(--asc-card-bg);
            border: 1px solid var(--asc-card-border);
            border-radius: 6px;
            padding: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: border-color 0.2s ease;
        }
        .asc-attr-card:hover {
            border-color: var(--asc-btn-primary);
        }
        .asc-attr-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .asc-attr-title {
            font-weight: bold;
            font-size: 0.95em;
        }
        .asc-attr-desc {
            font-size: 0.78em;
            color: var(--asc-subtext);
        }

        .asc-table {
            width: 100%;
            border-collapse: collapse;
            text-align: center;
            font-size: 0.9em;
            margin-top: 10px;
        }
        .asc-table th {
            background: var(--asc-table-hdr-bg);
            color: var(--asc-table-hdr-text);
            border: 1px solid var(--asc-table-border);
            padding: 6px 10px;
        }
        .asc-table td {
            background: var(--asc-table-bg);
            color: var(--asc-text);
            border: 1px solid var(--asc-table-border);
            padding: 6px 10px;
        }

        .asc-budget-bar {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            align-items: center;
            background: var(--asc-highlight-bg);
            border: 1px solid var(--asc-card-border);
            border-radius: 6px;
            padding: 10px 16px;
            margin-bottom: 14px;
        }
        .asc-budget-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 0.9em;
        }

        .asc-status-text {
            font-weight: bold;
            font-size: 0.85em;
            margin-left: 8px;
        }
    `;

    function injectStyles() {
        if (!document.getElementById('asc-calc-injected-styles')) {
            const style = document.createElement('style');
            style.id = 'asc-calc-injected-styles';
            style.textContent = CSS_STYLES;
            document.head.appendChild(style);
        }
    }

    // =========================================================================
    // 4. Widget Initialization & Logic
    // =========================================================================
    function initAbilityScoreWidget() {
        const container = document.getElementById('ability-score-calc-widget') ||
                          document.getElementById('ability-theme-calc-widget') ||
                          document.querySelector('.ability-score-calc-widget');
        if (!container || container.dataset.loaded) return;
        container.dataset.loaded = 'true';

        injectStyles();

        // ---------------------------------------------------------------------
        // State Management
        // ---------------------------------------------------------------------
        const state = {
            activeTab: 'spread',
            spread: {
                presetKey: 'standard',
                assignments: { STR: 15, DEX: 14, CON: 13, INT: 12, WIS: 10, CHA: 8 }
            },
            roller: {
                fantasyLevel: 'standard',
                rolledScores: [],
                assignmentMode: 'order',
                assignments: { STR: null, DEX: null, CON: null, INT: null, WIS: null, CHA: null },
                source: ''
            },
            pointbuy: {
                budgetKey: 'standard',
                customBudget: 15,
                scores: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 }
            }
        };

        // ---------------------------------------------------------------------
        // Render Shell
        // ---------------------------------------------------------------------
        container.innerHTML = `
            <div class="asc-container">
                <div class="asc-tabs">
                    <button class="asc-tab-btn active" data-tab="spread">📋 Standard Spread</button>
                    <button class="asc-tab-btn" data-tab="roller">🎲 Dice Roller</button>
                    <button class="asc-tab-btn" data-tab="pointbuy">⚖️ Point Buy</button>
                </div>

                <!-- TAB 1: STANDARD SPREAD -->
                <div id="asc-tab-spread" class="asc-tab-content active">
                    <div class="asc-control-row">
                        <div>
                            <label style="font-weight: bold; margin-right: 6px;">Campaign Spread:</label>
                            <select id="asc-spread-preset" class="asc-input">
                                <option value="standard" selected>Standard Fantasy (15, 14, 13, 12, 10, 8)</option>
                                <option value="low">Low Fantasy (14, 12, 10, 10, 8, 8)</option>
                                <option value="high">High Fantasy (19, 18, 16, 13, 12, 10)</option>
                            </select>
                        </div>
                        <button id="asc-spread-btn-auto" class="asc-btn asc-btn-secondary" title="Assign in standard order">Auto-Assign</button>
                        <button id="asc-spread-btn-clear" class="asc-btn asc-btn-secondary" title="Clear all assignments">Clear</button>
                    </div>

                    <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <span style="font-weight: 600; font-size: 0.9em; color: var(--asc-subtext);">Available Scores:</span>
                        <div id="asc-spread-pool" style="display: flex; gap: 6px; flex-wrap: wrap;"></div>
                    </div>

                    <div id="asc-spread-grid" class="asc-attr-grid"></div>

                    <div style="display: flex; gap: 8px; align-items: center; margin-top: 10px; margin-bottom: 10px;">
                        <button id="asc-spread-btn-copy-wiki" class="asc-btn asc-btn-copy">Copy WikiText</button>
                        <button id="asc-spread-btn-copy-text" class="asc-btn asc-btn-secondary">Copy Summary</button>
                        <span id="asc-spread-copy-status" class="asc-status-text" style="color: var(--asc-success); display: none;">Copied!</span>
                    </div>

                    <div id="asc-spread-preview"></div>

                    <details style="margin-top: 10px;">
                        <summary style="cursor: pointer; color: var(--asc-link); font-size: 0.88em; font-weight: 500;">View Generated WikiText</summary>
                        <textarea id="asc-spread-wikitext" class="asc-input" readonly style="width: 100%; height: 85px; margin-top: 5px; font-family: monospace; font-size: 0.85em;"></textarea>
                    </details>
                </div>

                <!-- TAB 2: DICE ROLLER -->
                <div id="asc-tab-roller" class="asc-tab-content">
                    <div class="asc-control-row">
                        <div>
                            <label style="font-weight: bold; margin-right: 6px;">Fantasy Level:</label>
                            <select id="asc-roller-level" class="asc-input">
                                <option value="standard" selected>Standard Fantasy (4d6 drop 1, reroll &le; 8)</option>
                                <option value="low">Low Fantasy (3d6, reroll &le; 7)</option>
                                <option value="high">High Fantasy (4d6 drop 1, 7 rolls drop lowest)</option>
                                <option value="epic">Epic Fantasy (5d6 drop 2, 7 rolls drop lowest)</option>
                            </select>
                        </div>
                        <button id="asc-roller-btn-roll" class="asc-btn asc-btn-primary">🎲 Roll Scores</button>
                        <span id="asc-roller-source-badge" class="asc-badge" style="display: none;"></span>
                    </div>

                    <div id="asc-roller-results-bar" style="margin-bottom: 14px; display: none;">
                        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 8px;">
                            <span style="font-weight: 600; font-size: 0.9em; color: var(--asc-subtext);">Rolled Scores:</span>
                            <div id="asc-roller-scores-pool" style="display: flex; gap: 6px; flex-wrap: wrap;"></div>
                        </div>
                        <div style="display: flex; gap: 12px; align-items: center; font-size: 0.88em;">
                            <label style="font-weight: 600; cursor: pointer;">
                                <input type="radio" name="asc-roller-mode" value="order" checked> Assign in Order (STR &rarr; CHA)
                            </label>
                            <label style="font-weight: 600; cursor: pointer;">
                                <input type="radio" name="asc-roller-mode" value="custom"> Custom Assign
                            </label>
                        </div>
                    </div>

                    <div id="asc-roller-grid" class="asc-attr-grid"></div>

                    <div style="display: flex; gap: 8px; align-items: center; margin-top: 10px; margin-bottom: 10px;">
                        <button id="asc-roller-btn-copy-wiki" class="asc-btn asc-btn-copy" style="display: none;">Copy WikiText</button>
                        <button id="asc-roller-btn-copy-text" class="asc-btn asc-btn-secondary" style="display: none;">Copy Summary</button>
                        <span id="asc-roller-copy-status" class="asc-status-text" style="color: var(--asc-success); display: none;">Copied!</span>
                    </div>

                    <div id="asc-roller-preview"></div>

                    <details id="asc-roller-details" style="margin-top: 10px; display: none;">
                        <summary style="cursor: pointer; color: var(--asc-link); font-size: 0.88em; font-weight: 500;">View Generated WikiText</summary>
                        <textarea id="asc-roller-wikitext" class="asc-input" readonly style="width: 100%; height: 85px; margin-top: 5px; font-family: monospace; font-size: 0.85em;"></textarea>
                    </details>
                </div>

                <!-- TAB 3: POINT BUY -->
                <div id="asc-tab-pointbuy" class="asc-tab-content">
                    <div class="asc-control-row">
                        <div>
                            <label style="font-weight: bold; margin-right: 6px;">Campaign Type:</label>
                            <select id="asc-pb-budget-select" class="asc-input">
                                <option value="low">Low Fantasy (10 Points)</option>
                                <option value="standard" selected>Standard Fantasy (15 Points)</option>
                                <option value="high">High Fantasy (20 Points)</option>
                                <option value="epic">Epic Fantasy (25 Points)</option>
                                <option value="custom">Custom Points</option>
                            </select>
                        </div>
                        <div id="asc-pb-custom-wrap" style="display: none; align-items: center; gap: 6px;">
                            <label style="font-weight: bold;">Points:</label>
                            <input id="asc-pb-custom-points" class="asc-input" type="number" value="15" min="0" max="100" style="width: 65px;">
                        </div>
                        <button id="asc-pb-btn-reset" class="asc-btn asc-btn-secondary" title="Reset all abilities to 10">Reset to 10s</button>
                    </div>

                    <div class="asc-budget-bar">
                        <div class="asc-budget-item">
                            <span style="color: var(--asc-subtext);">Total Budget:</span>
                            <span id="asc-pb-budget-total" style="font-weight: bold;">15</span>
                        </div>
                        <div class="asc-budget-item">
                            <span style="color: var(--asc-subtext);">Points Spent:</span>
                            <span id="asc-pb-budget-spent" style="font-weight: bold;">0</span>
                        </div>
                        <div class="asc-budget-item">
                            <span style="color: var(--asc-subtext);">Remaining:</span>
                            <span id="asc-pb-budget-remaining" class="asc-badge" style="font-size: 0.95em; font-weight: bold;">15</span>
                        </div>
                        <div id="asc-pb-budget-message" style="font-size: 0.85em; font-weight: 600;"></div>
                    </div>

                    <div id="asc-pb-grid" class="asc-attr-grid"></div>

                    <div style="display: flex; gap: 8px; align-items: center; margin-top: 10px; margin-bottom: 10px;">
                        <button id="asc-pb-btn-copy-wiki" class="asc-btn asc-btn-copy">Copy WikiText</button>
                        <button id="asc-pb-btn-copy-text" class="asc-btn asc-btn-secondary">Copy Summary</button>
                        <span id="asc-pb-copy-status" class="asc-status-text" style="color: var(--asc-success); display: none;">Copied!</span>
                    </div>

                    <div id="asc-pb-preview"></div>

                    <details style="margin-top: 10px;">
                        <summary style="cursor: pointer; color: var(--asc-link); font-size: 0.88em; font-weight: 500;">View Ability Score Cost Table</summary>
                        <div style="margin-top: 8px; overflow-x: auto;">
                            <table class="asc-table" style="max-width: 450px;">
                                <tr><th>Score</th><th>Point Cost</th><th>Modifier</th></tr>
                                <tr><td>7</td><td>-4 (gains 4)</td><td>-2</td></tr>
                                <tr><td>8</td><td>-2 (gains 2)</td><td>-1</td></tr>
                                <tr><td>9</td><td>-1 (gains 1)</td><td>-1</td></tr>
                                <tr><td>10</td><td>0 (base)</td><td>0</td></tr>
                                <tr><td>11</td><td>1</td><td>0</td></tr>
                                <tr><td>12</td><td>2</td><td>+1</td></tr>
                                <tr><td>13</td><td>3</td><td>+1</td></tr>
                                <tr><td>14</td><td>5</td><td>+2</td></tr>
                                <tr><td>15</td><td>7</td><td>+2</td></tr>
                                <tr><td>16</td><td>10</td><td>+3</td></tr>
                                <tr><td>17</td><td>13</td><td>+3</td></tr>
                                <tr><td>18</td><td>17</td><td>+4</td></tr>
                            </table>
                        </div>
                    </details>

                    <details style="margin-top: 10px;">
                        <summary style="cursor: pointer; color: var(--asc-link); font-size: 0.88em; font-weight: 500;">View Generated WikiText</summary>
                        <textarea id="asc-pb-wikitext" class="asc-input" readonly style="width: 100%; height: 85px; margin-top: 5px; font-family: monospace; font-size: 0.85em;"></textarea>
                    </details>
                </div>
            </div>
        `;

        // ---------------------------------------------------------------------
        // Tab Navigation
        // ---------------------------------------------------------------------
        const tabButtons = container.querySelectorAll('.asc-tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                const targetTab = this.dataset.tab;
                state.activeTab = targetTab;
                tabButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                container.querySelectorAll('.asc-tab-content').forEach(pane => {
                    pane.classList.remove('active');
                });
                const targetPane = document.getElementById(`asc-tab-${targetTab}`);
                if (targetPane) targetPane.classList.add('active');
            });
        });

        // ---------------------------------------------------------------------
        // Table & Output Builders
        // ---------------------------------------------------------------------
        function buildWikiText(scoresMap, titleNote = '') {
            const lines = ['{| class="wikitable"'];
            if (titleNote) lines.push(`|+ ${titleNote}`);
            lines.push('! Ability Theme !! Score !! Modifier');
            for (const attr of CORE_ATTRIBUTES) {
                const score = scoresMap[attr.key];
                const scoreStr = (score !== null && score !== undefined) ? String(score) : '—';
                const mod = (score !== null && score !== undefined) ? formatModifier(calculateModifier(score)) : '—';
                lines.push(`|-\n| ${attr.name} (${attr.key}) || ${scoreStr} || ${mod}`);
            }
            lines.push('|}');
            return lines.join('\n');
        }

        function buildSummaryText(scoresMap) {
            return CORE_ATTRIBUTES.map(attr => {
                const score = scoresMap[attr.key];
                if (score === null || score === undefined) return `${attr.key}: —`;
                const mod = formatModifier(calculateModifier(score));
                return `${attr.key}: ${score} (${mod})`;
            }).join(' | ');
        }

        function buildPreviewTable(scoresMap) {
            let html = '<table class="asc-table">';
            html += '<tr><th>Ability Theme</th><th>Score</th><th>Modifier</th></tr>';
            for (const attr of CORE_ATTRIBUTES) {
                const score = scoresMap[attr.key];
                const scoreStr = (score !== null && score !== undefined) ? `<strong>${score}</strong>` : '<em>Unassigned</em>';
                const modStr = (score !== null && score !== undefined) ? formatModifier(calculateModifier(score)) : '—';
                html += `<tr><td style="text-align: left; font-weight: 600;">${attr.name} (${attr.key})</td><td>${scoreStr}</td><td>${modStr}</td></tr>`;
            }
            html += '</table>';
            return html;
        }

        function setupClipboardCopy(buttonId, textGetter, statusId) {
            const btn = document.getElementById(buttonId);
            const status = document.getElementById(statusId);
            if (!btn) return;
            btn.addEventListener('click', function () {
                const text = textGetter();
                navigator.clipboard.writeText(text).then(() => {
                    if (status) {
                        status.style.display = 'inline';
                        setTimeout(() => { status.style.display = 'none'; }, 2000);
                    }
                }).catch(() => {
                    alert('Could not copy to clipboard. Please select and copy from the text box below.');
                });
            });
        }

        // =====================================================================
        // TAB 1: Standard Spread Logic
        // =====================================================================
        function renderSpreadTab() {
            const preset = SPREADS[state.spread.presetKey];
            const spreadScores = [...preset.scores];

            // Render Available Pool
            const poolEl = document.getElementById('asc-spread-pool');
            poolEl.innerHTML = '';
            const assignedVals = Object.values(state.spread.assignments).filter(v => v !== null);
            const tempAssigned = [...assignedVals];

            spreadScores.forEach((score) => {
                const badge = document.createElement('span');
                badge.className = 'asc-badge asc-badge-pool';
                badge.textContent = score;
                const foundIdx = tempAssigned.indexOf(score);
                if (foundIdx !== -1) {
                    badge.classList.add('assigned');
                    tempAssigned.splice(foundIdx, 1);
                }
                poolEl.appendChild(badge);
            });

            // Render Attribute Grid
            const gridEl = document.getElementById('asc-spread-grid');
            gridEl.innerHTML = '';

            CORE_ATTRIBUTES.forEach(attr => {
                const currentScore = state.spread.assignments[attr.key];
                const card = document.createElement('div');
                card.className = 'asc-attr-card';

                const info = document.createElement('div');
                info.className = 'asc-attr-info';
                info.innerHTML = `
                    <div class="asc-attr-title">${attr.name} (${attr.key})</div>
                    <div class="asc-attr-desc">${attr.desc}</div>
                `;

                const controls = document.createElement('div');
                controls.style.display = 'flex';
                controls.style.alignItems = 'center';
                controls.style.gap = '8px';

                const select = document.createElement('select');
                select.className = 'asc-input';
                select.style.minWidth = '75px';
                select.innerHTML = '<option value="">--</option>';

                spreadScores.forEach((s) => {
                    const opt = document.createElement('option');
                    opt.value = String(s);
                    opt.textContent = String(s);
                    select.appendChild(opt);
                });

                if (currentScore !== null && currentScore !== undefined) {
                    select.value = String(currentScore);
                } else {
                    select.value = '';
                }

                select.addEventListener('change', function () {
                    const newScore = this.value ? parseInt(this.value, 10) : null;
                    if (newScore !== null) {
                        const currentUsage = Object.values(state.spread.assignments).filter(v => v === newScore).length;
                        const maxAllowed = spreadScores.filter(v => v === newScore).length;
                        if (currentUsage >= maxAllowed) {
                            for (const k of Object.keys(state.spread.assignments)) {
                                if (k !== attr.key && state.spread.assignments[k] === newScore) {
                                    state.spread.assignments[k] = currentScore;
                                    break;
                                }
                            }
                        }
                    }
                    state.spread.assignments[attr.key] = newScore;
                    renderSpreadTab();
                });

                const modBadge = document.createElement('span');
                modBadge.className = 'asc-badge';
                modBadge.style.minWidth = '30px';
                modBadge.style.textAlign = 'center';
                modBadge.textContent = currentScore !== null ? formatModifier(calculateModifier(currentScore)) : '—';
                if (currentScore !== null && calculateModifier(currentScore) > 0) {
                    modBadge.style.background = 'var(--asc-highlight-bg)';
                    modBadge.style.color = 'var(--asc-btn-primary)';
                }

                controls.appendChild(select);
                controls.appendChild(modBadge);
                card.appendChild(info);
                card.appendChild(controls);
                gridEl.appendChild(card);
            });

            const wikiText = buildWikiText(state.spread.assignments, `Table: ${preset.name} Ability Scores`);
            document.getElementById('asc-spread-wikitext').value = wikiText;
            document.getElementById('asc-spread-preview').innerHTML = buildPreviewTable(state.spread.assignments);
        }

        document.getElementById('asc-spread-preset').addEventListener('change', function () {
            state.spread.presetKey = this.value;
            const scores = SPREADS[this.value].scores;
            CORE_ATTRIBUTES.forEach((attr, idx) => {
                state.spread.assignments[attr.key] = scores[idx] !== undefined ? scores[idx] : null;
            });
            renderSpreadTab();
        });

        document.getElementById('asc-spread-btn-auto').addEventListener('click', function () {
            const scores = SPREADS[state.spread.presetKey].scores;
            CORE_ATTRIBUTES.forEach((attr, idx) => {
                state.spread.assignments[attr.key] = scores[idx] !== undefined ? scores[idx] : null;
            });
            renderSpreadTab();
        });

        document.getElementById('asc-spread-btn-clear').addEventListener('click', function () {
            CORE_ATTRIBUTES.forEach(attr => {
                state.spread.assignments[attr.key] = null;
            });
            renderSpreadTab();
        });

        setupClipboardCopy('asc-spread-btn-copy-wiki', () => document.getElementById('asc-spread-wikitext').value, 'asc-spread-copy-status');
        setupClipboardCopy('asc-spread-btn-copy-text', () => buildSummaryText(state.spread.assignments), 'asc-spread-copy-status');

        // =====================================================================
        // TAB 2: Dice Roller Logic
        // =====================================================================
        async function rollAbilityStats() {
            const levelKey = document.getElementById('asc-roller-level').value;
            state.roller.fantasyLevel = levelKey;
            const config = ROLLER_CONFIGS[levelKey];

            const rollBtn = document.getElementById('asc-roller-btn-roll');
            rollBtn.disabled = true;
            rollBtn.textContent = '⏳ Rolling...';

            let finalScores = [];
            let sourceLabel = '';

            try {
                const apiBase = (window.FUTUREPATH_API_BASE !== undefined) ? window.FUTUREPATH_API_BASE : '';
                const url = `${apiBase}/tasks/roll/character/${config.apiLevel}`;
                const response = await fetch(url, {
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data && data.Rolls && Array.isArray(data.Rolls) && data.Rolls.length >= 6) {
                        finalScores = data.Rolls.map(r => r.Total);
                        sourceLabel = `API Endpoint (/tasks/roll/character/${config.apiLevel})`;
                    }
                }
            } catch (err) {
                // Fallback on network/CORS error
            }

            if (finalScores.length < 6) {
                finalScores = rollCharacterLocally(config);
                sourceLabel = 'Local FuturePath Engine (Client)';
            }

            state.roller.rolledScores = finalScores;
            state.roller.source = sourceLabel;

            if (state.roller.assignmentMode === 'order') {
                CORE_ATTRIBUTES.forEach((attr, idx) => {
                    state.roller.assignments[attr.key] = finalScores[idx] !== undefined ? finalScores[idx] : null;
                });
            }

            rollBtn.disabled = false;
            rollBtn.textContent = '🎲 Roll Scores';

            renderRollerTab();
        }

        function renderRollerTab() {
            const hasRolls = state.roller.rolledScores && state.roller.rolledScores.length > 0;
            const resultsBar = document.getElementById('asc-roller-results-bar');
            const sourceBadge = document.getElementById('asc-roller-source-badge');
            const copyWikiBtn = document.getElementById('asc-roller-btn-copy-wiki');
            const copyTextBtn = document.getElementById('asc-roller-btn-copy-text');
            const detailsEl = document.getElementById('asc-roller-details');

            if (!hasRolls) {
                resultsBar.style.display = 'none';
                sourceBadge.style.display = 'none';
                copyWikiBtn.style.display = 'none';
                copyTextBtn.style.display = 'none';
                detailsEl.style.display = 'none';
                document.getElementById('asc-roller-grid').innerHTML = `
                    <div style="grid-column: 1 / -1; padding: 25px; text-align: center; color: var(--asc-subtext); border: 1px dashed var(--asc-card-border); border-radius: 6px;">
                        Select a Fantasy level above and click <strong>Roll Scores</strong> to generate character stats using the FuturePath rules.
                    </div>
                `;
                document.getElementById('asc-roller-preview').innerHTML = '';
                return;
            }

            resultsBar.style.display = 'block';
            sourceBadge.style.display = 'inline-block';
            sourceBadge.textContent = state.roller.source;
            copyWikiBtn.style.display = 'inline-flex';
            copyTextBtn.style.display = 'inline-flex';
            detailsEl.style.display = 'block';

            const poolEl = document.getElementById('asc-roller-scores-pool');
            poolEl.innerHTML = '';
            const tempAssigned = Object.values(state.roller.assignments).filter(v => v !== null);

            state.roller.rolledScores.forEach(score => {
                const badge = document.createElement('span');
                badge.className = 'asc-badge asc-badge-pool';
                badge.textContent = score;
                const foundIdx = tempAssigned.indexOf(score);
                if (foundIdx !== -1) {
                    badge.classList.add('assigned');
                    tempAssigned.splice(foundIdx, 1);
                }
                poolEl.appendChild(badge);
            });

            const gridEl = document.getElementById('asc-roller-grid');
            gridEl.innerHTML = '';

            CORE_ATTRIBUTES.forEach((attr) => {
                const currentScore = state.roller.assignments[attr.key];
                const card = document.createElement('div');
                card.className = 'asc-attr-card';

                const info = document.createElement('div');
                info.className = 'asc-attr-info';
                info.innerHTML = `
                    <div class="asc-attr-title">${attr.name} (${attr.key})</div>
                    <div class="asc-attr-desc">${attr.desc}</div>
                `;

                const controls = document.createElement('div');
                controls.style.display = 'flex';
                controls.style.alignItems = 'center';
                controls.style.gap = '8px';

                if (state.roller.assignmentMode === 'order') {
                    const scoreDisplay = document.createElement('span');
                    scoreDisplay.style.fontWeight = 'bold';
                    scoreDisplay.style.fontSize = '1.05em';
                    scoreDisplay.textContent = currentScore !== null ? String(currentScore) : '—';
                    controls.appendChild(scoreDisplay);
                } else {
                    const select = document.createElement('select');
                    select.className = 'asc-input';
                    select.style.minWidth = '75px';
                    select.innerHTML = '<option value="">--</option>';

                    state.roller.rolledScores.forEach(s => {
                        const opt = document.createElement('option');
                        opt.value = String(s);
                        opt.textContent = String(s);
                        select.appendChild(opt);
                    });

                    select.value = currentScore !== null ? String(currentScore) : '';
                    select.addEventListener('change', function () {
                        const newScore = this.value ? parseInt(this.value, 10) : null;
                        if (newScore !== null) {
                            const currentUsage = Object.values(state.roller.assignments).filter(v => v === newScore).length;
                            const maxAllowed = state.roller.rolledScores.filter(v => v === newScore).length;
                            if (currentUsage >= maxAllowed) {
                                for (const k of Object.keys(state.roller.assignments)) {
                                    if (k !== attr.key && state.roller.assignments[k] === newScore) {
                                        state.roller.assignments[k] = currentScore;
                                        break;
                                    }
                                }
                            }
                        }
                        state.roller.assignments[attr.key] = newScore;
                        renderRollerTab();
                    });
                    controls.appendChild(select);
                }

                const modBadge = document.createElement('span');
                modBadge.className = 'asc-badge';
                modBadge.style.minWidth = '30px';
                modBadge.style.textAlign = 'center';
                modBadge.textContent = currentScore !== null ? formatModifier(calculateModifier(currentScore)) : '—';
                if (currentScore !== null && calculateModifier(currentScore) > 0) {
                    modBadge.style.background = 'var(--asc-highlight-bg)';
                    modBadge.style.color = 'var(--asc-btn-primary)';
                }

                controls.appendChild(modBadge);
                card.appendChild(info);
                card.appendChild(controls);
                gridEl.appendChild(card);
            });

            const config = ROLLER_CONFIGS[state.roller.fantasyLevel];
            const wikiText = buildWikiText(state.roller.assignments, `Table: ${config.name} Rolled Ability Scores`);
            document.getElementById('asc-roller-wikitext').value = wikiText;
            document.getElementById('asc-roller-preview').innerHTML = buildPreviewTable(state.roller.assignments);
        }

        document.getElementById('asc-roller-btn-roll').addEventListener('click', rollAbilityStats);

        const modeRadios = container.querySelectorAll('input[name="asc-roller-mode"]');
        modeRadios.forEach(radio => {
            radio.addEventListener('change', function () {
                state.roller.assignmentMode = this.value;
                if (this.value === 'order' && state.roller.rolledScores.length > 0) {
                    CORE_ATTRIBUTES.forEach((attr, idx) => {
                        state.roller.assignments[attr.key] = state.roller.rolledScores[idx] || null;
                    });
                }
                renderRollerTab();
            });
        });

        setupClipboardCopy('asc-roller-btn-copy-wiki', () => document.getElementById('asc-roller-wikitext').value, 'asc-roller-copy-status');
        setupClipboardCopy('asc-roller-btn-copy-text', () => buildSummaryText(state.roller.assignments), 'asc-roller-copy-status');

        // =====================================================================
        // TAB 3: Point Buy Logic
        // =====================================================================
        function getPointBuyBudget() {
            if (state.pointbuy.budgetKey === 'custom') {
                return parseInt(document.getElementById('asc-pb-custom-points').value, 10) || 0;
            }
            return POINT_BUY_BUDGETS[state.pointbuy.budgetKey].points;
        }

        function calculatePointsSpent() {
            let total = 0;
            for (const attr of CORE_ATTRIBUTES) {
                const score = state.pointbuy.scores[attr.key] || 10;
                total += (POINT_BUY_COSTS[score] !== undefined ? POINT_BUY_COSTS[score] : 0);
            }
            return total;
        }

        function renderPointBuyTab() {
            const budgetTotal = getPointBuyBudget();
            const spent = calculatePointsSpent();
            const remaining = budgetTotal - spent;

            document.getElementById('asc-pb-budget-total').textContent = String(budgetTotal);
            document.getElementById('asc-pb-budget-spent').textContent = String(spent);

            const remBadge = document.getElementById('asc-pb-budget-remaining');
            remBadge.textContent = String(remaining);

            const msgEl = document.getElementById('asc-pb-budget-message');
            if (remaining === 0) {
                remBadge.style.background = 'var(--asc-success)';
                remBadge.style.color = '#ffffff';
                msgEl.style.color = 'var(--asc-success)';
                msgEl.textContent = '✓ Points perfectly allocated!';
            } else if (remaining > 0) {
                remBadge.style.background = 'var(--asc-btn-primary)';
                remBadge.style.color = '#ffffff';
                msgEl.style.color = 'var(--asc-subtext)';
                msgEl.textContent = `${remaining} point${remaining === 1 ? '' : 's'} available to spend`;
            } else {
                remBadge.style.background = 'var(--asc-error)';
                remBadge.style.color = '#ffffff';
                msgEl.style.color = 'var(--asc-error)';
                msgEl.textContent = `⚠ Over budget by ${Math.abs(remaining)} point${Math.abs(remaining) === 1 ? '' : 's'}!`;
            }

            const gridEl = document.getElementById('asc-pb-grid');
            gridEl.innerHTML = '';

            CORE_ATTRIBUTES.forEach(attr => {
                const currentScore = state.pointbuy.scores[attr.key];
                const currentCost = POINT_BUY_COSTS[currentScore] || 0;
                const mod = calculateModifier(currentScore);

                const card = document.createElement('div');
                card.className = 'asc-attr-card';

                const info = document.createElement('div');
                info.className = 'asc-attr-info';
                info.innerHTML = `
                    <div class="asc-attr-title">${attr.name} (${attr.key})</div>
                    <div class="asc-attr-desc">${attr.desc}</div>
                `;

                const controls = document.createElement('div');
                controls.style.display = 'flex';
                controls.style.alignItems = 'center';
                controls.style.gap = '6px';

                const btnMinus = document.createElement('button');
                btnMinus.className = 'asc-stepper-btn';
                btnMinus.textContent = '−';
                btnMinus.title = 'Decrease score';
                btnMinus.disabled = (currentScore <= 7);
                btnMinus.addEventListener('click', function () {
                    if (state.pointbuy.scores[attr.key] > 7) {
                        state.pointbuy.scores[attr.key] -= 1;
                        renderPointBuyTab();
                    }
                });

                const scoreBox = document.createElement('span');
                scoreBox.style.display = 'inline-block';
                scoreBox.style.minWidth = '28px';
                scoreBox.style.textAlign = 'center';
                scoreBox.style.fontWeight = 'bold';
                scoreBox.style.fontSize = '1.1em';
                scoreBox.textContent = String(currentScore);

                const btnPlus = document.createElement('button');
                btnPlus.className = 'asc-stepper-btn';
                btnPlus.textContent = '+';
                btnPlus.title = 'Increase score';
                btnPlus.disabled = (currentScore >= 18);
                btnPlus.addEventListener('click', function () {
                    if (state.pointbuy.scores[attr.key] < 18) {
                        state.pointbuy.scores[attr.key] += 1;
                        renderPointBuyTab();
                    }
                });

                const costBadge = document.createElement('span');
                costBadge.className = 'asc-badge';
                costBadge.style.fontSize = '0.8em';
                costBadge.style.minWidth = '52px';
                costBadge.style.textAlign = 'center';
                costBadge.textContent = `${currentCost >= 0 ? '+' : ''}${currentCost} pts`;

                const modBadge = document.createElement('span');
                modBadge.className = 'asc-badge';
                modBadge.style.minWidth = '28px';
                modBadge.style.textAlign = 'center';
                modBadge.textContent = formatModifier(mod);
                if (mod > 0) {
                    modBadge.style.background = 'var(--asc-highlight-bg)';
                    modBadge.style.color = 'var(--asc-btn-primary)';
                }

                controls.appendChild(btnMinus);
                controls.appendChild(scoreBox);
                controls.appendChild(btnPlus);
                controls.appendChild(costBadge);
                controls.appendChild(modBadge);

                card.appendChild(info);
                card.appendChild(controls);
                gridEl.appendChild(card);
            });

            const campaignName = state.pointbuy.budgetKey === 'custom'
                ? `Custom (${budgetTotal} pts)`
                : POINT_BUY_BUDGETS[state.pointbuy.budgetKey].name;
            const wikiText = buildWikiText(state.pointbuy.scores, `Table: Point Buy (${campaignName}) Ability Scores`);
            document.getElementById('asc-pb-wikitext').value = wikiText;
            document.getElementById('asc-pb-preview').innerHTML = buildPreviewTable(state.pointbuy.scores);
        }

        document.getElementById('asc-pb-budget-select').addEventListener('change', function () {
            state.pointbuy.budgetKey = this.value;
            const customWrap = document.getElementById('asc-pb-custom-wrap');
            customWrap.style.display = (this.value === 'custom') ? 'inline-flex' : 'none';
            renderPointBuyTab();
        });

        document.getElementById('asc-pb-custom-points').addEventListener('input', renderPointBuyTab);

        document.getElementById('asc-pb-btn-reset').addEventListener('click', function () {
            CORE_ATTRIBUTES.forEach(attr => {
                state.pointbuy.scores[attr.key] = 10;
            });
            renderPointBuyTab();
        });

        setupClipboardCopy('asc-pb-btn-copy-wiki', () => document.getElementById('asc-pb-wikitext').value, 'asc-pb-copy-status');
        setupClipboardCopy('asc-pb-btn-copy-text', () => buildSummaryText(state.pointbuy.scores), 'asc-pb-copy-status');

        // Initial Renders
        renderSpreadTab();
        renderRollerTab();
        renderPointBuyTab();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAbilityScoreWidget);
    } else {
        initAbilityScoreWidget();
    }
})();
