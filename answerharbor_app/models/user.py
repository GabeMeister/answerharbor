""" The user model """

# pylint: disable=C0103,C0111,C0413,E1101

from answerharbor_app import db
from flask_login import UserMixin
from sqlalchemy.orm import relationship


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    is_admin = db.Column('is_admin', db.Integer, server_default='0')
    posts = relationship('Post', back_populates='user')


    def __str__(self):
        return "{0}\n".format(self.username)


    def info(self):
        buf = """Username: {0}
Email: {1}
Admin: {2}
""".format(self.username, self.email, self.is_admin)
        buf += 'Posts:\n'
        for post in self.posts:
            buf += post.question + ' ' + post.final_answer + '\n'
        return buf
