""" The course model """

# pylint: disable=C0103,C0111,C0413,E1101

from answerharbor_app import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship


class Course(db.Model):
    id = db.Column('id', db.Integer, primary_key=True)
    subject = db.Column('subject', db.String(100), nullable=False)
    number = db.Column('number', db.Integer, nullable=False)
    professor_name = db.Column('professor_name', db.String(200), nullable=False)
    course_times = db.Column('course_times', db.String(100), nullable=False)
    homeworks = relationship('Homework', back_populates='course')
    school_id = db.Column(db.Integer, ForeignKey('school.id'))
    school = relationship('School', back_populates='courses')


    def __str__(self):
        return '{0} {1} at {2} -- {3}, {4}'.format(self.subject,
                                                   str(self.number),
                                                   self.course_times,
                                                   self.professor_name,
                                                   self.school.full_name)


    def info(self):
        buf = self.__str__() + '\n'
        buf += 'Homeworks:\n'
        for hw in self.homeworks:
            buf += str(hw)
        return buf
