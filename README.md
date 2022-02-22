d20 Future Path API
===================

-----
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://choosealicense.com/licenses/gpl-3.0/)
[![d20FuturePath: Discord](https://img.shields.io/discord/581738731934056449.svg?label=discord&logo=discord)](https://discord.gg/UC74Gudw3m)
[![Docs](https://readthedocs.org/projects/ansicolortags/badge/?version=latest)](http://api.d20futurepath.com/docs/build/html/d20FuturePathAPI.html)


### Currently Under Development!!!

At the moment this tool really only used to emulate rolling dice. It is being used with the [Mobile Dice Roller App](https://github.com/orcephrye/mobileDiceRoller).
However, sense it is a RESTful API it technically could be used for any purpose that requires random dice rolls between
d2 and d100. It is arguably the most well-rounded and feature rich free dice rolling app available. It features adding
modifiers, multiple dice simultaneously, and options like "dropLowest" or 'reRollTotal' and so on. 

The future goal is that this API will serve as a tool for the [d20FuturePath Roll Playing Game](https://d20futurepath.com).
The tool will be used to make customized weapons/ships and characters easier.

## Install

This is not meant to be installed as a program but deployed as a web app. Use the provided requirements.txt to install
dependencies. 

```sh
# Install requirements (pip should point to a Python 3.6+ environment.
pip install -r requirements.txt
```


## Run

This tool uses gunicorn and by default binds to port 8000. Edit the guincorn_config.py file to make changes.

```sh
# Make sure to add the SCRIPT_NAME variable. Make sure your working directory is in the root git repo directory.
SCRIPT_NAME=/v1 gunicorn-3.8  --config gunicorn_config.py run:app
```

## Setup as a systemd service.

Example systemd configuration file below. Insert that file into: '/etc/systemd/system/d20FuturePathAPI.service'

```yaml
[Unit]
Description=Gunicorn instance to serve d20FuturePathAPIs
After=network.target

[Service]
User=apache
Group=apache
WorkingDirectory=/var/www/api/FuturePathAPI
Environment="SCRIPT_NAME=/v1"
ExecStart=gunicorn --config gunicorn_config.py run:app

[Install]
WantedBy=multi-user.target
```

* NOTE: You may need to adjust the User/Group based on what Linux distro in use. May also need to run chown on git repo.

```sh
systemctl enable d20FuturePathAPI
systemctl start d20FuturePathAPI
systemctl status d20FuturePathAPI
```

## Documentation:

Documentation [d20 Future Path API Docs](http://api.d20futurepath.com/docs/build/html/index.html)
