#!/usr/bin/env python
# -*- coding=utf-8 -*-

# Author: Ryan Henrichson
# Version: 0.1
# Date: 01/24/18
# Description:


import threading
import uuid


def generateLockPair():
    RWL = ReadWriteLock()
    return ReadLock(RWL), WriteLock(RWL)


class ReadWriteLock(object):
    """
        A lock object that allows many simultaneous "read locks", but
        only one "write lock."
    """

    def __init__(self):
        self._read_ready = threading.Condition(threading.Lock())
        self._write_ready = threading.Condition(threading.Lock())
        self._readers = 0
        self.uuid = str(uuid.uuid4())
        self.readClass = None
        self.writeClass = None

    def __eq__(self, other):
        return self.uuid == other.uuid

    def __ne__(self, other):
        return self.uuid != other.uuid

    def acquire_read(self):
        """
            Acquire a read lock. Blocks only if a thread has
            acquired the write lock.
        """
        self._write_ready.acquire()
        self._read_ready.acquire()
        self._write_ready.release()
        try:
            self._readers += 1
        finally:
            self._read_ready.release()

    def release_read(self):
        """ Release a read lock. """
        self._read_ready.acquire()
        try:
            self._readers -= 1
            if not self._readers:
                self._read_ready.notifyAll()
        finally:
            self._read_ready.release()

    def acquire_write(self):
        """
            Acquire a write lock. Blocks until there are no
            acquired read or write locks.
        """
        self._write_ready.acquire()
        self._read_ready.acquire()
        while self._readers > 0:
            self._read_ready.wait()

    def release_write(self):
        """ Release a write lock. """
        self._read_ready.release()
        self._write_ready.release()


class ReadLock(object):

    def __init__(self, RWLock):
        self.RWLock = RWLock
        self.RWLock.readClass = self

    def __enter__(self):
        self.RWLock.acquire_read()
        return self.RWLock

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.RWLock.release_read()

    def __eq__(self, other):
        return self.RWLock == other

    def __ne__(self, other):
        return self.RWLock != other

    def acquire(self):
        return self.RWLock.acquire_read()

    def release(self):
        return self.RWLock.release_read()

    @property
    def uuid(self):
        return self.RWLock.uuid


class WriteLock(object):

    def __init__(self, RWLock):
        self.RWLock = RWLock
        self.RWLock.writeClass = self

    def __enter__(self):
        self.RWLock.acquire_write()
        return self.RWLock

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.RWLock.release_write()

    def __eq__(self, other):
        return self.RWLock == other

    def __ne__(self, other):
        return self.RWLock != other

    def acquire(self):
        return self.RWLock.acquire_write()

    def release(self):
        return self.RWLock.release_write()

    @property
    def uuid(self):
        return self.RWLock.uuid
