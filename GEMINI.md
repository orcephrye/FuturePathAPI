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
* Fix mobile view and size (breakpoints).
** Most text fields get sized wrong in relation to buttons and other items. In mobile view the text field should be given more space and it should be interactable so that if pressed a modal view opens with the text.
** For Armor and Weapons the top row fields get to squashed. We need to make two rows to handle them.
** multiple entries of Mutations do not show up in mobile view. Only the first drawback and fist enhancement show.
* Fix printing view issues.
** Printing from mobile doesn't work. This is because mobile printing doesn't re-paginate based on printer sizes.
** The printer view also suffers from certain text fields being too small relative too there neighbors. This is especially true for Weapons and Armor.
** Some multiple line text fields do not expand if the text takes up multiple lines. This causes weird sizing issues and hides text.
* The 'Alignment' text in the Character Identity should say Alignment / Factions and only be abbreviated to 'Alignment' if in mobile or printer view.
* Add support to ended d20futurepath website links for any 'added' input fields such as an weapons/armor/general equipment/feats etc... (This should only be digital view NOT printer view)
* Selected Affinities within the 'Character Professions & Talents' card automatically enables the associated Ability Theme check box. This should also work with the Character Paths.

