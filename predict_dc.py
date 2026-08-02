#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
predict_dc.py

CLI tool for d20 Future Path TTRPG to predict the likelihood of meeting or beating
target Difficulty Classes (DCs) using the dice rolling system from FuturePathAPI.Rolling.

Usage examples:
    python predict_dc.py d20
    python predict_dc.py d20 d4 --mod +2
    python predict_dc.py 2d6 --dc 18
    python predict_dc.py d20 d4 --mod -1 --dc 22
"""

import argparse
import sys
from pathlib import Path

# Ensure project root is in sys.path for importing FuturePathAPI modules
PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

try:
    from FuturePathAPI.Rolling import DieAnalyzer, RollProbabilityGenerator
except ImportError:
    try:
        from Rolling import DieAnalyzer, RollProbabilityGenerator
    except ImportError as err:
        sys.stderr.write(f"Error importing Rolling module: {err}\n")
        sys.exit(1)


def parse_modifier(mod_str: str) -> int:
    """Parse modifier string like '+1', '-2', '3', '-5' into an integer."""
    if not mod_str:
        return 0
    mod_str = mod_str.strip()
    try:
        return int(mod_str)
    except ValueError:
        sys.stderr.write(f"Error: Invalid modifier value '{mod_str}'. Must be a number like +1 or -2.\n")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="Predict probability of meeting or beating DCs using FuturePathAPI dice rolling logic."
    )
    parser.add_argument(
        "dice",
        nargs="+",
        help="One or more valid dice arguments (e.g. d20, d4, 2d6, d100)."
    )
    parser.add_argument(
        "--mod",
        type=str,
        default="0",
        help="Optional modifier value (+/-X, e.g. +1 or -2)."
    )
    parser.add_argument(
        "--dc",
        type=int,
        default=None,
        help="Optional custom DC value to test against."
    )

    args = parser.parse_args()

    cli_mod = parse_modifier(args.mod)

    all_dice_tuples = []
    extra_mod = 0

    for d_arg in args.dice:
        try:
            parsed_dies, connectors, _ = DieAnalyzer.die_str_analyzer(d_arg)
            for die_info in parsed_dies:
                (die_tuple, multiplier), mod_str, _ = die_info
                if die_tuple is None:
                    sys.stderr.write(f"Error: Unrecognized die in argument '{d_arg}'.\n")
                    sys.exit(1)
                all_dice_tuples.extend([die_tuple] * multiplier)
                if mod_str:
                    extra_mod += int(mod_str)
        except Exception as e:
            sys.stderr.write(f"Error parsing die argument '{d_arg}': {e}\n")
            sys.exit(1)

    if not all_dice_tuples:
        sys.stderr.write("Error: No valid dice were provided.\n")
        sys.exit(1)

    total_modifier = cli_mod + extra_mod

    # Generate exact outcome probabilities using Rolling.py's RollProbabilityGenerator
    rpg = RollProbabilityGenerator(*all_dice_tuples)

    # Default DCs as required
    default_dcs = [5, 10, 15, 20, 25, 30, 35, 40, 45]

    if args.dc is not None:
        tested_dcs = sorted(list(set(default_dcs + [args.dc])))
    else:
        tested_dcs = default_dcs

    probabilities = []
    for dc in tested_dcs:
        # Sum outcomes where raw_dice_sum + total_modifier >= dc
        favorable_count = sum(
            count for raw_sum, count in rpg.numberDict.items()
            if raw_sum + total_modifier >= dc
        )
        prob = (favorable_count / rpg.productCount) * 100.0
        probabilities.append(prob)

    # Format header and single-line output delimited by ' || '
    header_line = " || ".join(f"DC {dc}" for dc in tested_dcs)
    output_line = " || ".join(f"{p:.1f}%" for p in probabilities)

    print(header_line)
    print(output_line)


if __name__ == "__main__":
    main()
