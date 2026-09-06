# Project Context: [FuturePathAPI]

This is a stand alone service written in Python. It is meant to provide a RESTful API for interacting with the game
rules of d20 Future Path a Sci-Fi TTRPG. Eventually it will support Character Creation, custom Weapon, Armor creation
and much more. For now it is limited to dice rolling. And is utilized by an HTML mobile dice rolling web app.


## Tech Stack
* Python with Flask
* gunicorn is used for hosting the API entrypoint.
* This project has a pyproject.toml fille and a requirements.txt files.

## Project Structure
* The API/Flask code is located in the directory 'FuturePathAPI'
* The 'FuturePathMain.py' is meant to be a landing place for all the different tasks this API will eventually support.
* The 'tasks.py' holds all the currently supported tasks that the API support which is only Rolling at the moment.
* The 'Rolling.py' file holds all the logic for rolling. 
* The 'libs' dir is were extra code that can be reused by one or more tasks is located.
* the wiki_* dirs wiki_markdown and wiki_raw_text directories is where the text for the WikiMedia site is stored for backup and reading purposes. 
* The wiki_raw_text is straight from the MediaWiki site while the wiki_markdown is parsed/converted WikiText too Markdown as that is sometimes easier to ingest

## Linting/Styling checks
Each Linter is a command that should run in shell.
* When editing Python use: > ruff check --fix
* When editing HTML use: > npx htmlhint filename.html
* When editing CSS use: > npx stylelint --fix filename.css
* When editing JavaScript use: > node jslint.mjs filename.js

## Docs
The 'docs' dir has all the docs built by Sphinx. 
Also there is the README.md file:
@./README.md

## Knowledge of the FuturePath TTRPG 
@./GEMINI_FUTUREPATH_TTRPG.md

# Active Tasks
- [x] Add a die roller builtin for rolling stats for a new Character sheet onto the Character Creation and Advantage page. (Completed with ability_score_calc_wiki_ui.js supporting Standard Spread, Dice Roller, and Point Buy)
- Review the Glossary/Key Terms page.
