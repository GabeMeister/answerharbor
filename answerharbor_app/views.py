""" Define the views """

# pylint: disable=C0103,C0111,E1101,C0301

from datetime import datetime
from flask import render_template, redirect, request, url_for, jsonify
from flask_login import login_required, login_user, logout_user, current_user
from sqlalchemy import or_
import answerharbor_app.breadcrumbs as breadcrumbs
from answerharbor_app import app, db, logger
import answerharbor_app.helpers.view_helpers as view_helpers
from answerharbor_app.models.forms import LoginForm, RegisterForm, NewPostForm,\
    EditPostForm, NewHomeworkForm
from answerharbor_app.models.user import User
from answerharbor_app.models.post import Post
from answerharbor_app.models.step import Step
from answerharbor_app.models.homework import Homework
from answerharbor_app.models.course import Course
from answerharbor_app.models.school import School
from werkzeug.security import generate_password_hash


@app.route('/')
@app.route('/index')
def index():
    schools = School.query.all()
    return render_template('index.html', schools=schools)


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        login_user(user, remember=form.remember_me.data)
        return redirect('/')
    return render_template('login.html', form=form)


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    form = RegisterForm()
    if form.validate_on_submit():
        hashed_password = generate_password_hash(form.password.data, method='sha256')
        user = User(username=form.username.data, email=form.email.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return redirect('/')
    return render_template('signup.html', form=form)


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect('/')


@app.route('/newhomework', methods=['GET', 'POST'])
@login_required
def new_homework():
    course_id = request.args['course_id']
    the_course = Course.query.filter_by(id=course_id).first()
    if the_course is None:
        return redirect('/')

    form = NewHomeworkForm()
    if form.validate_on_submit():
        new_hw = Homework()
        form.populate_obj(new_hw)
        new_hw.course = the_course

        db.session.add(new_hw)
        db.session.commit()

        return redirect(url_for('course', course_id=course_id))

    new_homework_breadcrumbs = breadcrumbs.new_homework_breadcrumb_path()

    return render_template('newhomework.html', form=form, course_id=course_id, breadcrumbs=new_homework_breadcrumbs)


@app.route('/newpost', methods=['GET', 'POST'])
@login_required
def new_post():
    homework_id = request.args['homework_id']
    if homework_id is None:
        return redirect('/')

    homework_affected = Homework.query.filter_by(id=homework_id).first()
    if homework_affected is None:
        return redirect('/')

    if request.method == 'POST':
        try:
            the_post = view_helpers.get_post_from_request(request)
            db.session.add(the_post)
            db.session.commit()
        except RuntimeError:
            # If error occurred just redirect back to home page for now
            return redirect('/')

        return redirect(url_for('post', post_id=the_post.id))

    new_post_breadcrumbs = breadcrumbs.new_post_breadcrumb_path()

    return render_template('newpost.html', homework=homework_affected, breadcrumbs=new_post_breadcrumbs)


@app.route('/editpost/<int:post_id>', methods=['GET', 'POST'])
@login_required
def edit_post(post_id):
    # Make sure user is admin
    if not current_user.is_admin:
        return redirect('/')

    homework_id = request.args['homework_id']
    if homework_id is None:
        return redirect('/')

    post_to_edit = Post.query.filter_by(id=post_id).first()
    if post_to_edit is None:
        # Redirect to home page if we didn't find the correct post
        return redirect('/')

    if request.method == 'POST':
        # Update post from form
        post_to_edit.title = view_helpers.get_question_title_from_request(request)
        post_to_edit.question = view_helpers.get_question_from_request(request)
        post_to_edit.steps = view_helpers.get_steps_from_request(request)
        db.session.commit()

        return redirect(url_for('post', post_id=post_id))

    edit_post_breadcrumbs = breadcrumbs.edit_post_breadcrumb_path()

    return render_template('editpost.html', post=post_to_edit, homework_id=homework_id, breadcrumbs=edit_post_breadcrumbs)


@app.route('/post_data/<int:post_id>')
def post_data(post_id):
    requested_post = Post.query.filter_by(id=post_id).first()
    if requested_post is None:
        return jsonify({})

    # Because sqlalchemy objects cannot be jsonified, we build up a temporary
    # data structures to jsonify and send it back to the client
    question_title = requested_post.title
    question_text = requested_post.question
    steps = []
    for step in requested_post.steps:
        steps.append({
            'number': step.number,
            'text': step.text
        })

    return jsonify({
        'title': question_title,
        'question': question_text,
        'steps': steps
    })


@app.route('/deletepost/<int:post_id>')
@login_required
def delete_post(post_id):
    # Make sure user is admin
    if not current_user.is_admin:
        return redirect('/')

    homework_id = request.args['homework_id']
    the_post = Post.query.filter_by(id=post_id).first()
    if the_post is None:
        # Redirect to home page if we didn't find the correct post
        return redirect('/')

    db.session.delete(the_post)
    db.session.commit()

    return redirect(url_for('homework', homework_id=homework_id))


@app.route('/school/<int:school_id>')
def school(school_id):
    selected_school = School.query.filter_by(id=school_id).first()
    if selected_school is None:
        # Redirect to home page if we couldn't find the correct school
        return redirect('/')

    # Build breadcrumb navigation
    school_breadcrumbs = breadcrumbs.school_breadcrumb_path()

    return render_template('school.html', school_id=selected_school.id, courses=selected_school.courses, breadcrumbs=school_breadcrumbs)


@app.route('/course/<int:course_id>')
def course(course_id):
    selected_course = Course.query.filter_by(id=course_id).first()
    if selected_course is None:
        # Redirect to home page if we couldn't find the correct course
        return redirect('/')

    # Build up course breadcrumb navigation
    course_breadcrumbs = breadcrumbs.course_breadcrumb_path()

    return render_template('course.html', homeworks=selected_course.homeworks, course_id=selected_course.id, breadcrumbs=course_breadcrumbs)


@app.route('/homework/<int:homework_id>')
def homework(homework_id):
    selected_homework = Homework.query.filter_by(id=homework_id).first()
    if selected_homework is None:
        # Redirect to home page if we couldn't find the correct homework
        return redirect('/')

    homework_breadcrumbs = breadcrumbs.homework_breadcrumb_path()

    return render_template('homework.html', posts=selected_homework.posts, homework=selected_homework, breadcrumbs=homework_breadcrumbs)


@app.route('/edithomework/<int:homework_id>', methods=['GET', 'POST'])
@login_required
def edit_homework(homework_id):
    # Make sure user is admin
    if not current_user.is_admin:
        return redirect('/')

    homework_to_edit = Homework.query.filter_by(id=homework_id).first()
    if homework_to_edit is None:
        # Redirect to home page if we didn't find the correct homework
        return redirect('/')

    # Update the form with the original homework data
    form = NewHomeworkForm(obj=homework_to_edit)
    if form.validate_on_submit():
        # Update homework from form
        form.populate_obj(homework_to_edit)
        db.session.commit()

        return redirect(url_for('homework', homework_id=homework_id))

    edit_homework_breadcrumbs = breadcrumbs.edit_homework_breadcrumb_path()

    return render_template('edithomework.html', form=form, homework=homework_to_edit, breadcrumbs=edit_homework_breadcrumbs)


@app.route('/deletehomework/<int:homework_id>')
@login_required
def delete_homework(homework_id):
    # Make sure user is admin
    if not current_user.is_admin:
        return redirect('/')

    course_id = request.args['course_id']
    if course_id is None:
        return redirect('/')

    homework_to_delete = Homework.query.filter_by(id=homework_id).first()
    if homework_to_delete is None:
        # Redirect to home page if we didn't find the correct post
        return redirect('/')

    db.session.delete(homework_to_delete)
    db.session.commit()

    return redirect(url_for('course', course_id=course_id))


@app.route('/post/<int:post_id>')
def post(post_id):
    selected_post = Post.query.filter_by(id=post_id).first()
    if selected_post is None:
        # Redirect to home page if we couldn't find the correct post
        return redirect('/')

    post_breadcrumbs = breadcrumbs.post_breadcrumb_path()

    return render_template('post.html', post=selected_post, breadcrumbs=post_breadcrumbs)

@app.route('/is_admin')
def is_admin():
    is_admin_user = current_user.is_authenticated and current_user.is_admin
    return jsonify({'is_admin': is_admin_user})
