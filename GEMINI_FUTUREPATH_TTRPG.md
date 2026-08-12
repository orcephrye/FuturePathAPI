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
- No need to be wordy simple sentences that convey meaning is better then verbose instructions.

# Need to Know Context about this game

## Character Creation & Advancement

This helps explain the process of creating a new Character for FuturePath

@./GEMINI_CHARACTER_CREATION.md



