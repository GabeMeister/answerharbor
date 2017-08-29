"""
Module for generating fake answers by changing numbers in answer text
"""

# pylint: disable=C0103,C0111,C0413,E1101

import re
import random

# Corner case: '$\frac{2*2.2}{2}$'
def generate_fake_answer(orig_answer):
    fake_answer = orig_answer
    nums = find_nums_in_text(orig_answer)

    for index, num in nums.iteritems():
        fake_num = generate_fake_number_str(num)
        fake_answer = fake_answer[:index] + fake_answer[index:].replace(num, fake_num, 1)

    return fake_answer



def find_nums_in_text(text):
    # Finds all integers and floats within a string, and
    # returns a dictionary of their starting index as key
    # and int/float as value
    nums = {}
    p = re.compile(r'[\d\.]+')
    for m in p.finditer(text):
        nums[m.start()] = m.group()

    return nums


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
    modifier_amt = round(random.uniform(0, modifier_range), decimal_count)

    # Randomly decide to add or subtract the modifier amount
    if random.randint(0, 1) == 1:
        fake_float = fake_float + modifier_amt
    else:
        fake_float = fake_float - modifier_amt

    return fake_float
