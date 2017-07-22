"""
The step model

Represents one step in an  answer solution
"""

# pylint: disable=C0103,C0111,C0413,E1101

from answerharbor_app import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship


class Step(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.Integer, nullable=False)
    text = db.Column(db.BLOB, nullable=False)
    post_id = db.Column(db.Integer, ForeignKey('post.id'))
    post = relationship('Post', back_populates='steps')


#     def __str__(self):
#         return """Number: {0}
# Text: {1}""".format(self.number, self.text)


#     def info(self):
#         return """Number: {0}
# Text: {1}
# Post: {2}""".format(self.number,
#                     self.text,
#                     self.post)
