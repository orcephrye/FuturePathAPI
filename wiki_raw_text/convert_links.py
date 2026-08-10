#!/usr/bin/env python3
import argparse
import difflib
import os
import re
import sys

# Regex patterns
# Matches parenthesized group of one or more markdown links separated by "/"
parenthesized_links_pattern = re.compile(
    r'\(\s*('
    r'\[[^\]]+\]\(file:///[^#)]+(?:#[^)]*)?\)'
    r'(?:\s*/\s*\[[^\]]+\]\(file:///[^#)]+(?:#[^)]*)?\))*'
    r')\s*\)'
)

# Matches individual markdown links
single_link_pattern = re.compile(
    r'\[([^\]]+)\]\((file:///[^#)]+)(?:#[^)]*)?\)'
)

def build_basename_map(wiki_dir):
    """
    Builds a case-insensitive map of base names to their actual correctly-cased names.
    Prefers .txt files over .md files.
    """
    if not os.path.isdir(wiki_dir):
        return {}

    files = os.listdir(wiki_dir)
    # Sort so that .md files come first, and .txt files come last,
    # allowing .txt files to overwrite .md entries in the map.
    files.sort(key=lambda f: 1 if f.endswith('.txt') else 0)

    basename_map = {}
    for f in files:
        if f.endswith('.txt') or f.endswith('.md'):
            base, ext = os.path.splitext(f)
            basename_map[base.lower()] = base

    return basename_map

def get_fallback_name(base_name):
    """
    Fallback formatting if the file is not found in the directory.
    If the base name is all-caps, title case it.
    """
    if base_name.isupper():
        return base_name.title()
    return base_name

def convert_single_link(link_text, basename_map):
    """
    Converts a single markdown link into a WikiText link.
    """
    match = single_link_pattern.match(link_text)
    if not match:
        return link_text

    url_path = match.group(2)

    # Extract the filename and base name
    filename = os.path.basename(url_path)
    base_name, _ = os.path.splitext(filename)

    # Look up correct casing
    lookup = base_name.lower()
    if lookup in basename_map:
        correct_name = basename_map[lookup]
    else:
        correct_name = get_fallback_name(base_name)

    # Format the WikiText link
    if '_' in correct_name:
        display_name = correct_name.replace('_', ' ')
        return f"[[{correct_name}|{display_name}]]"
    else:
        return f"[[{correct_name}]]"

def convert_line(line, basename_map):
    """
    Converts all markdown links on a line.
    """
    # Helper to convert links inside a parenthesized group
    def convert_parenthesized_group(match):
        inner_content = match.group(1)
        # Convert each single link inside
        return single_link_pattern.sub(
            lambda m: convert_single_link(m.group(0), basename_map),
            inner_content
        )

    # 1. Replace parenthesized groups of links first (stripping parenthesized wrapper)
    line = parenthesized_links_pattern.sub(convert_parenthesized_group, line)

    # 2. Replace any remaining non-parenthesized links
    line = single_link_pattern.sub(
        lambda m: convert_single_link(m.group(0), basename_map),
        line
    )

    return line

def process_file(file_path, basename_map, dry_run=False):
    """
    Reads a file, converts links, and writes back (or prints diff if dry_run is True).
    """
    if not os.path.isfile(file_path):
        print(f"Error: File not found: {file_path}", file=sys.stderr)
        return False

    with open(file_path, 'r', encoding='utf-8') as f:
        original_lines = f.readlines()

    converted_lines = [convert_line(line, basename_map) for line in original_lines]

    if original_lines == converted_lines:
        print(f"No changes needed for: {file_path}")
        return True

    if dry_run:
        print(f"=== Dry Run Diff for {file_path} ===")
        diff = difflib.unified_diff(
            original_lines, converted_lines,
            fromfile=f"a/{os.path.basename(file_path)}",
            tofile=f"b/{os.path.basename(file_path)}"
        )
        sys.stdout.writelines(diff)
        print("=====================================\n")
    else:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(converted_lines)
        print(f"Successfully converted: {file_path}")

    return True

def main():
    parser = argparse.ArgumentParser(description="Convert standard MD links in files to WikiText Wiki links.")
    parser.add_argument("files", nargs="+", help="File paths to process")
    parser.add_argument("-d", "--dry-run", action="store_true", help="Print diff of changes without modifying files")
    args = parser.parse_args()

    # Locate directory of the script as default wiki_dir
    script_dir = os.path.dirname(os.path.abspath(__file__))
    basename_map = build_basename_map(script_dir)

    success = True
    for file_path in args.files:
        # Resolve path relative to current working directory or absolute
        abs_path = os.path.abspath(file_path)
        if not process_file(abs_path, basename_map, dry_run=args.dry_run):
            success = False

    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
