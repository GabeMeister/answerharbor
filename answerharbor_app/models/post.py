"""
The post model

A question and a series of steps make a post.
"""

# pylint: disable=C0103,C0111,C0413,E1101

from answerharbor_app import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    question = db.Column(db.BLOB, nullable=False)
    type = db.Column(db.String(20), nullable=False, server_default='auto')
    steps = relationship('Step', back_populates='post', cascade='all, delete-orphan')
    answers = relationship('Answer', back_populates='post', cascade='all, delete-orphan')
    creation_date = db.Column(db.DateTime, nullable=False)
    last_edit_date = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, ForeignKey('user.id'))
    user = relationship('User', back_populates='posts')
    homework_id = db.Column(db.Integer, ForeignKey('homework.id'))
    homework = relationship('Homework', back_populates='posts')


    def __str__(self):
        return """Question Title: {0}
Step Count: {1}""".format(self.title, len(self.steps))


    def info(self):
        return """Title: {6}
Question: {0}
Steps: {1}
Created: {2}
Last Edited: {3}
User: {4}
Homework: {5}""".format(self.question,
                    self.steps,
                    self.creation_date,
                    self.last_edit_date,
                    self.user,
                    self.homework,
                    self.title)
