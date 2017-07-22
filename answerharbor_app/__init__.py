""" Initialize the package """

# pylint: disable=C0103,C0111,C0413,C0412

# The application
from answerharbor_app.application import create_app
app = create_app()
app.config.from_pyfile('config.py')


# The database
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy(app)
from answerharbor_app.models.school import School
from answerharbor_app.models.course import Course
from answerharbor_app.models.homework import Homework
from answerharbor_app.models.user import User
from answerharbor_app.models.post import Post
from answerharbor_app.models.step import Step


# The login manager
from flask_login import LoginManager
login_manager = LoginManager()
import answerharbor_app.models.login


# The views
from answerharbor_app import views

# The helpers
from answerharbor_app.helpers import view_helpers
