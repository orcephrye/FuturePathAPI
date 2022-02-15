#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 02/15/2022
# Description:


import multiprocessing

workers = multiprocessing.cpu_count() * 2 + 1
bind = '127.0.0.1:8000'
#bind = 'unix:flaskrest.sock'
#umask = 0o007
reload = True

#logging
accesslog = '-'
errorlog = '-'
