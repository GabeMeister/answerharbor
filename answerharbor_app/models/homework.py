""" The homework model """

# pylint: disable=C0103,C0111,C0413,E1101

from answerharbor_app import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship


class Homework(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    posts = relationship('Post', back_populates='homework')
    due_date = db.Column('due_date', db.DateTime)
    course_id = db.Column(db.Integer, ForeignKey('course.id'))
    course = relationship('Course', back_populates='homeworks')


    def __str__(self):
        return self.title


    def info(self):
        buf = self.title + '\n'
        buf += 'Due Date: ' + str(self.due_date) + '\n'
        if not self.course is None:
            buf += 'Course: {0} {1}'.format(self.course.subject, self.course.number)
        buf += 'Posts:\n'
        for post in self.posts:
            buf += str(post) + '\n'

        return buf

    def pretty_date(self):
        return self.due_date.strftime('%a, %b %d, %Y at %I:%M %p')
