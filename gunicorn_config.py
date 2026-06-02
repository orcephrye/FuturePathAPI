#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 02/15/2022
# Description:
import os

# Default to /v1 path prefix if SCRIPT_NAME environment variable is not explicitly set
os.environ.setdefault("SCRIPT_NAME", "/v1")

workers = 1  # For development/testing
# workers = multiprocessing.cpu_count() * 2 + 1
bind = "127.0.0.1:8000"
reload = True

# For use with a UNIX socket instead of loopback address
# bind = 'unix:flaskrest.sock'
# umask = 0o007

# logging
accesslog = "-"
errorlog = "-"
