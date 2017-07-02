""" The school model """

# pylint: disable=C0103,C0111,C0413,E1101

from answerharbor_app import db
from sqlalchemy.orm import relationship


class School(db.Model):
    id = db.Column('id', db.Integer, primary_key=True)
    full_name = db.Column('full_name', db.String(200), nullable=False)
    short_name = db.Column('short_name', db.String(100))
    courses = relationship('Course', back_populates='school')


    def __str__(self):
        return self.full_name


    def info(self):
        buf = '{0} ({1})'.format(self.full_name, self.short_name) + '\n'
        for course in self.courses:
            buf += '{0} {1} on {2} -- {3}'.format(course.subject,
                                                  course.number,
                                                  course.course_times,
                                                  course.professor_name) + '\n'
        return buf
