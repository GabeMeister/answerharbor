"""
Module for generating fake answers by changing numbers in answer text
"""

# pylint: disable=C0103,C0111,C0413,E1101

import re
import random


def is_fake_answer_possible(orig_answer_text):
    # Fake answers must have two dollar signs and numbers inbetween them.
    # Search for a number between the '$$' delimiter first
    # If not found, try searching for '$' delimiter
    return any(c.isdigit() for c in orig_answer_text)\
        and any(c == '$' for c in orig_answer_text)


# Corner case: '$\frac{2*2.2}{2}$'
def generate_fake_answer(orig_answer):
    # find the mathjax part of the string we can actually replace
    orig_mathjax = find_mathjax(orig_answer)
    fake_mathjax = orig_mathjax
    nums = find_nums_in_text(fake_mathjax)

    for index, num in nums.iteritems():
        fake_num = generate_fake_number_str(num)
        fake_mathjax = fake_mathjax[:index] + fake_mathjax[index:].replace(num, fake_num, 1)

    return orig_answer.replace(orig_mathjax, fake_mathjax, 1)


def find_nums_in_text(text):
    # Finds all integers and floats within a string, and
    # returns a dictionary of their starting index as key
    # and int/float as value
    nums = {}
    p = re.compile(r'[\d\.]+')
    for m in p.finditer(text):
        nums[m.start()] = m.group()

    return nums


def find_mathjax(text):
    text = find_between(text, '$', '$')
    if text[0] == '$' and text[-1] == '$':
        text = text[1:-1]

    return text


def find_between(s, first, last):
    try:
        start = s.index(first) + len(first)
        end = s.rindex(last, start)
        return s[start:end]
    except ValueError:
        return ""


def generate_fake_number_str(num_str):
    fake_num_str = ''

    if num_str.isdigit():
        # We just randomly minus 1 or add 1 to an integer
        n = int(num_str)
        fake_num_str = str(generate_fake_int(n))

    else:
        # We just randomly subtract 1 or add 1 to a float
        f = float(num_str)
        fake_num_str = str(generate_fake_float(f))

    return fake_num_str


def generate_fake_int(orig_int):
    fake_int = orig_int
    modifier_num = random.randint(1, 3)

    # Randomly decide to add or subtract the modifier amount
    if random.randint(0, 1) == 1:
        fake_int = fake_int + modifier_num
    else:
        fake_int = fake_int - modifier_num

    return fake_int


def generate_fake_float(orig_float):
    fake_float = orig_float
    orig_float_str = str(orig_float)

    # Get amount of digits after decimal place, to not create an obviously
    # generated number (i.e. 32.5 -> 32.64355323)
    decimal_count = len(orig_float_str) - str(orig_float_str).index('.') - 1
    # Calculate a random distance away from original float
    modifier_range = fake_float / 30
    modifier_amt = random.uniform(0, modifier_range)

    # Randomly decide to add or subtract the modifier amount
    if random.randint(0, 1) == 1:
        fake_float = fake_float + modifier_amt
    else:
        fake_float = fake_float - modifier_amt

    final_float = round(fake_float, decimal_count)

    # Sometimes the fake float after rounding becomes the original float.
    # If this situation happens, then just round to another decimal point out
    additional_precision = 1
    while final_float == orig_float:
        additional_precision = additional_precision + 1
        final_float = round(fake_float, decimal_count + additional_precision)

    return final_float
