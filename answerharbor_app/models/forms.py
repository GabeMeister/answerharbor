""" Define the views """

# pylint: disable=C0103,C0111

from answerharbor_app.models.user import User
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField, TextAreaField
from wtforms.ext.dateutil.fields import DateTimeField
from wtforms.validators import InputRequired, Length, Email, EqualTo
from werkzeug.security import check_password_hash


class LoginForm(FlaskForm):
    username = StringField('Username:', validators=[
        InputRequired(message='Please enter a unique username'),
        Length(min=4, max=20, message='Username must be between 4 and 20 characters long')
    ])
    password = PasswordField('Password:', validators=[
        InputRequired(message='Please enter a password'),
        Length(min=8, max=50, message='Password must be between 8 and 50 characters long')
    ])
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('Submit')


    def validate(self):
        valid = FlaskForm.validate(self)
        if not valid:
            return False

        # make sure username exists in database
        user = User.query.filter_by(username=self.username.data).first()
        if user is None:
            self.username.errors.append('Unrecognized username. Please try again')
            return False

        # make sure password matches
        if not check_password_hash(user.password, self.password.data):
            self.password.errors.append('Password incorrect. Please try again')
            return False

        return True


class RegisterForm(FlaskForm):
    email = StringField('Email:', validators=[
        InputRequired(message='Please enter a valid email'),
        Length(min=4, max=150, message='Email must be between 4 and 150 characters long'),
        Email(message='Enter a valid email')
    ])
    username = StringField('Username:', validators=[
        InputRequired(message='Please enter a unique username'),
        Length(min=4, max=20, message='Username must be between 4 and 20 characters long')
    ])
    password = PasswordField('Password:', validators=[
        InputRequired(message='Please enter a password'),
        Length(min=8, max=50, message='Password must be between 8 and 50 characters long')
    ])
    confirm_password = PasswordField('Confirm Password:', validators=[
        InputRequired('Please confirm password'),
        Length(min=8, max=50, message='Confirmed password must be between 8 and 50 '+\
            'characters long'),
        EqualTo(fieldname='password', message='Passwords must match')
    ])
    submit = SubmitField('Submit')


    def validate(self):
        valid = FlaskForm.validate(self)
        if not valid:
            return False

        # make sure user entered a unique username
        user = User.query.filter_by(username=self.username.data).first()
        if user is not None:
            self.username.errors.append('Username already taken. Please try again')
            return False

        # make sure user entered a unique email
        user = User.query.filter_by(email=self.email.data).first()
        if user is not None:
            self.email.errors.append('Email already taken. Please try again')
            return False

        return True


class NewPostForm(FlaskForm):
    question = TextAreaField('Question:', validators=[
        InputRequired(message='Please enter a question')
    ])
    answer = TextAreaField('Answer:', validators=[
        InputRequired(message='Please enter an answer')
    ])


class EditPostForm(FlaskForm):
    question = TextAreaField('Edit Question:', validators=[
        InputRequired(message='Please enter a question')
    ])
    answer = TextAreaField('Edit Answer:', validators=[
        InputRequired(message='Please enter an answer')
    ])


class NewHomeworkForm(FlaskForm):
    title = StringField('Homework Title:', validators=[
        InputRequired(message='Please enter a title')
    ])
    due_date = DateTimeField('Due Date:', display_format='%Y-%m-%d %H:%M', validators=[
        InputRequired(message='Please enter a due date')
    ])
