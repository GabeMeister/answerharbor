""" Helper functions for breadcrumbs """

# pylint: disable=C0103,C0111,E1101,W0401,C0301

from flask import request, url_for
from answerharbor_app.models.school import School
from answerharbor_app.models.course import Course
from answerharbor_app.models.homework import Homework
from answerharbor_app.models.post import Post


# Full Paths

def home_breadcrumb_path():
    return [home_breadcrumb()]


def school_breadcrumb_path():
    school_id = request.view_args['school_id']
    selected_school = School.query.filter_by(id=school_id).first()

    return [
        home_breadcrumb(),
        school_breadcrumb(selected_school)
    ]


def course_breadcrumb_path():
    course_id = request.view_args['course_id']
    selected_course = Course.query.filter_by(id=course_id).first()

    return [
        home_breadcrumb(),
        school_breadcrumb(selected_course.school),
        course_breadcrumb(selected_course)
    ]


def homework_breadcrumb_path():
    homework_id = request.view_args['homework_id']
    selected_homework = Homework.query.filter_by(id=homework_id).first()

    return [
        home_breadcrumb(),
        school_breadcrumb(selected_homework.course.school),
        course_breadcrumb(selected_homework.course),
        homework_breadcrumb(selected_homework)
    ]


def new_homework_breadcrumb_path():
    course_id = request.args['course_id']
    selected_course = Course.query.filter_by(id=course_id).first()

    return [
        home_breadcrumb(),
        school_breadcrumb(selected_course.school),
        course_breadcrumb(selected_course),
        new_homework_breadcrumb()
    ]

def edit_homework_breadcrumb_path():
    homework_id = request.view_args['homework_id']
    selected_homework = Homework.query.filter_by(id=homework_id).first()

    return [
        home_breadcrumb(),
        school_breadcrumb(selected_homework.course.school),
        course_breadcrumb(selected_homework.course),
        edit_homework_breadcrumb()
    ]


def post_breadcrumb_path():
    post_id = request.view_args['post_id']
    selected_post = Post.query.filter_by(id=post_id).first()

    return [
        home_breadcrumb(),
        school_breadcrumb(selected_post.homework.course.school),
        course_breadcrumb(selected_post.homework.course),
        homework_breadcrumb(selected_post.homework),
        post_breadcrumb(selected_post)
    ]

def new_post_breadcrumb_path():
    homework_id = request.args['homework_id']
    selected_homework = Homework.query.filter_by(id=homework_id).first()

    return [
        home_breadcrumb(),
        school_breadcrumb(selected_homework.course.school),
        course_breadcrumb(selected_homework.course),
        homework_breadcrumb(selected_homework),
        new_post_breadcrumb()
    ]

def edit_post_breadcrumb_path():
    homework_id = request.args['homework_id']
    selected_homework = Homework.query.filter_by(id=homework_id).first()

    return [
        home_breadcrumb(),
        school_breadcrumb(selected_homework.course.school),
        course_breadcrumb(selected_homework.course),
        homework_breadcrumb(selected_homework),
        edit_post_breadcrumb()
    ]


# Individual breadcrumbs

def home_breadcrumb():
    return {'text': 'Home', 'url': '/'}


def school_breadcrumb(selected_school):
    return {
        'text': selected_school.full_name,
        'url': url_for('school', school_id=selected_school.id)
    }


def course_breadcrumb(selected_course):
    return {
        'text': '{0} {1}'.format(selected_course.subject, selected_course.number),
        'url': url_for('course', course_id=selected_course.id)
    }


def homework_breadcrumb(selected_homework):
    return {
        'text': selected_homework.title,
        'url': url_for('homework', homework_id=selected_homework.id)
    }


def new_homework_breadcrumb():
    return {
        'text': 'New Homework',
        'url': '#'
    }

def edit_homework_breadcrumb():
    return {
        'text': 'Edit Homework',
        'url': '#'
    }


def post_breadcrumb(selected_post):
    # TODO: Figure out a better way to represent a question that the user selected
    # max_length = 40
    # question_text = selected_post.question
    # if len(question_text) > max_length:
    #     question_text = question_text[:max_length] + '...'

    return {
        'text': 'Question',
        'url': url_for('post', post_id=selected_post.id)
    }


def new_post_breadcrumb():
    return {
        'text': 'New Question + Answer',
        'url': '#'
    }


def edit_post_breadcrumb():
    return {
        'text': 'Edit Question + Answer',
        'url': '#'
    }
