"""
Module for special functions operating on strings
"""

# pylint: disable=C0103,C0111,C0413,E1101

def find_between_str(str_to_search, str_delimiter):
    try:
        start = str_to_search.index(str_delimiter) + len(str_delimiter)
        end = str_to_search.index(str_delimiter, start)

        return str_to_search[start:end]
    except ValueError:
        return ""
