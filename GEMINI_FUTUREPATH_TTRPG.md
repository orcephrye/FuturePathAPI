# Project Context: [d20 FuturePath]

d20 FuturePath is a science fiction themed pen-and-paper role-playing game sometimes noted as a 
Table Top Role Playing Game (TTRPG). It uses a modified version of the d20 system called d20+. It is inspired by 
d20 Modern, d20 Future, and Pathfinder/PFSRD. The creators of Future Path want a game that embraces the Sci-Fi genre, 
incorporates cool technology, and features an entire galaxy as a Campaign Setting.


## Tech Stack
- **Frontend:** MediaWiki
- **Database:** MariaDB

## Coding Standards
- All of this is written in WikiText ie: WikiMedia's own Markdown like format. [https://en.wikipedia.org/wiki/Help:Wikitext]
- All text files ie: "*.txt" should be written in WikiText or embedded HTML within WikiText
- There are some files that are in PDF or SVG format. These are all Character Sheets for the game.
- Note that bolding text is surrounded by triple quotes or '''text to be bold''', Do not use double asterisks ie: **text to be bold** instead use '''text to be bold'''
- Links to other pages are wrapped in brackets [[other page]] In here whitespaces are replaced with underscores and
  pages are found as other_page.txt

## d20 FuturePath game file Structure
- Current all files are located in a single directory 'wiki_raw_text'. They are all txt files written in a custom Markdown format called WikiText
- Each txt text file is considered a page for the game. Each page is hosted on a MediaWiki site that displays all the rules for game play.


## AI/System Behavior notes:
- Ask before editing pages, confirm the edits. 
- No need to be wordy simple sentences that convey meaning is better then verbose instructions.

# Need to Know Context about this game

## Whats Different

An overview of the core differences of d20+ system and the things that stand out about this game review:

@./GEMINI_WHATS_DIFFERENT.md


## Advantage System

This is an explanation of the Advantage system in d20 FuturePath: 

@./GEMINI_ADVANTAGE.md


## Skill Basics

Skills are handled a differently compared to other d20 based systems. Here is the basic rules for Skills.

@./GEMINI_SKILLSBASICS.md


## Ability Themes

The core capabilities of a character, including scores, modifiers, and die levels:

@./GEMINI_ABILITY_THEMES.md


## Conditions

The list of physical, mental, and environmental conditions, as well as condition tracks:

@./GEMINI_CONDITIONS.md


## Health and Injury

Rules for Hit Points, nonlethal damage, damage types, stabilization, cheating death, and healing:

@./GEMINI_HEALTH_AND_INJURY.md


## Proficiency Tree

Branches of training that unlock weapon use, armor grades, technology, and items:

@./GEMINI_PROFICIENCY_TREE.md


## Character Creation

This helps explain the process of creating a new Character for FuturePath

@./GEMINI_CHARACTER_CREATION.md
