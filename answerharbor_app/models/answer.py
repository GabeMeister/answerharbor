"""
The answer model

A correct or incorrect answer to a post
"""

# pylint: disable=C0103,C0111,C0413,E1101

from answerharbor_app import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship


class Answer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.BLOB, nullable=False, server_default='This is a fake answer')
    correct = db.Column(db.Integer, nullable=False, server_default='1')
    post_id = db.Column(db.Integer, ForeignKey('post.id'), nullable=False)
    post = relationship('Post', back_populates='answers')


    def __str__(self):
        return """Text: {0}""".format(self.text)
