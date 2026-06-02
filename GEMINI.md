# Project Context: [FuturePathAPI]

This is a stand alone service written in Python. It is meant to provide a RESTful API for interacting with the game
rules of d20 Future Path a Sci-Fi TTRPG. Eventually it will support Character Creation, custom Weapon, Armor creation
and much more. For now it is limited to dice rolling. And is utilized by an HTML mobile dice rolling web app.



## Tech Stack
* Python with Flask
* gunicorn is used for hosting the API entrypoint.
Python requirements located:
@./requirements.txt

## Project Structure
* The API/Flask code is located in the directory 'FuturePathAPI'
* The 'FuturePathMain.py' is meant to be a landing place for all the different tasks this API will eventually support.
* The 'tasks.py' holds all the currently supported tasks that the API support which is only Rolling at the moment.
* The 'Rolling.py' file holds all the logic for rolling. 
* The 'libs' dir is were extra code that can be reused by one or more tasks is located.

## Docs
The 'docs' dir has all the docs built by Sphinx. 
Also there is the README.md file:
@./README.md

# Active Tasks
This app is OLD and was last updated on Python 3.8. I would like to update it to run on Python 3.11 to 3.13 at least. 
It also needs a proper project manager like PDM or Hatch and we need to add styling and linting. Currently it doesn't even 
work likely because of old libs.

