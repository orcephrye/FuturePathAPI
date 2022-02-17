.. _d20FuturePathAPI-label

d20 Future Path API Documentation
=================================

.. toctree::
   :maxdepth: 2
   :caption: Contents:

:Author: Ryan Henrichson
:Version: 1.0 of 2/17/2022
:BASE URL: http://api.d20futurepath.com
:VERSION: /v1
:INDEX END POINT: http://api.d20futurepath.com/v1/


FuturePath API Index
--------------------

.. automodule:: FuturePathAPI.FuturePathMain
   :members: index


Authentication
--------------

.. automodule:: FuturePathAPI.authentication
   :members: authentication, testAuth


Tasks
-----

.. automodule:: FuturePathAPI.tasks
   :members: get_tasks, get_tasks_id, get_tasks_name


Tasks:Rolling
-------------

.. automodule:: FuturePathAPI.Rolling
   :members: roll_from_get, roll_from_json, rollCharacter


Users
-----

.. automodule:: FuturePathAPI.user
   :members: user_tasks, user_info
