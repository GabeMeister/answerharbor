""" flask scripts """

# pylint: disable=C0103,C0111,E1101,W0401,C0301

import os
import csv
import re
from datetime import datetime, timedelta
from flask_script import Manager
from answerharbor_app import app, db
from answerharbor_app.models.post import Post
from answerharbor_app.models.user import User
from answerharbor_app.models.course import Course
from answerharbor_app.models.school import School
from answerharbor_app.models.homework import Homework
import answerharbor_app.helpers.fake_answer_generator as fake_ans
import random

manager = Manager(app)


@manager.command
def sandbox():
    text = '$5'
    print fake_ans.is_fake_answer_possible(text)






@manager.command
def select():
    # posts = Post.query.all()
    # for post in posts:
    #     print post.info() + '\n'

    users = User.query.all()
    for user in users:
        print user.info() + '\n'

    # homeworks = Homework.query.all()
    # for hw in homeworks:
    #     print hw.info() + '\n'

    # courses = Course.query.all()
    # for course in courses:
    #     print course.info() + '\n'

    # schools = School.query.all()
    # for school in schools:
    #     print school.info() + '\n'


@manager.command
def insert_schools():
    # college_file_path = '/home/gabe/dev/python/college-generator/college-generator/Accreditation_04_2017.csv'

    # colleges = set()
    # with open(college_file_path, 'rb') as csvfile:
    #     reader = csv.reader(csvfile, delimiter=',', quotechar='"')
    #     for row in reader:
    #         colleges.add(row[1])

    # for college_name in colleges:
    #     new_school = School(full_name=college_name)
    #     db.session.add(new_school)

    # db.session.commit()
    schools = [
        'University of Idaho',
        'Eastern Washington University',
        'Western Washington University',
        'Gonzaga'
    ]

    for school in schools:
        new_school = School(full_name=school)
        db.session.add(new_school)

    db.session.commit()

    print 'Done!!'

@manager.command
def insert_course():
    the_school = School.query.filter_by(full_name='Washington State University').first()

    new_course = Course(subject='Physics',
                        number=201,
                        professor_name='Nicholas Cerruti',
                        course_times='{0} {1}'.format('MWF', '12:10pm-1pm'),
                        school=the_school)

    db.session.add(new_course)
    db.session.commit()
    print 'Done!'



@manager.command
def insert_courses():
    import random
    from faker import Faker
    fake = Faker()
    subjects = ['MATH', 'PHYS']
    course_days = ['MWF', 'TTH']
    course_times = ['8:10am-9am',
                    '9:10am-10am',
                    '10:10am-11am',
                    '11:10am-12pm',
                    '12:10pm-1pm',
                    '1:10pm-2pm',
                    '2:10pm-3pm',
                    '3:10pm-4pm',
                    '4:10pm-5pm',
                    '5:10pm-6pm']

    school = School.query.filter_by(full_name='Washington State University').first()

    for _ in range(1, 20):
        random_num = random.randint(90, 399)
        print random_num
        random_name = fake.name()
        print random_name
        random_subject = subjects[random.randint(0, 1)]
        print random_subject
        random_day = course_days[random.randint(0, 1)]
        print random_day
        random_time = course_times[random.randint(0, len(course_times) - 1)]

        new_course = Course(subject=random_subject,
                            number=random_num,
                            professor_name=random_name,
                            course_times='{0} {1}'.format(random_day, random_time),
                            school=school)
        db.session.add(new_course)

    db.session.commit()
    print 'Done!'


@manager.command
def insert_homeworks():
    the_course = Course.query.first()
    print the_course
    due_date = datetime.now()
    new_hw = Homework(title='mastering physics hw 1', course=the_course, due_date=due_date)
    db.session.add(new_hw)
    db.session.commit()
    print 'Done!'





if __name__ == "__main__":
    manager.run()
