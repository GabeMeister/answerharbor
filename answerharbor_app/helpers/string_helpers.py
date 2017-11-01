"""
Module for special functions operating on strings
"""

# pylint: disable=C0103,C0111,C0413,E1101


def find_between(s, first, last):
    try:
        start = s.index(first) + len(first)
        end = s.rindex(last, start)
        return s[start:end]
    except ValueError:
        return ""
