#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 02/15/2022
# Description:


import sys
sys.path.insert(0, '/var/www/api/FuturePathTest/')


from FuturePathAPI import FuturePathMain
from FuturePathAPI.initApp import app


if __name__ == '__main__':
    app.run(port=8000, debug=True)
