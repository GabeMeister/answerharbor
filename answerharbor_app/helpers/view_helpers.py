"""
Random helpers for views.py
"""

# pylint: disable=C0103,C0111,C0413,E1101

from datetime import datetime
from answerharbor_app.models.homework import Homework
from answerharbor_app.models.step import Step
from answerharbor_app.models.post import Post
from flask_login import current_user

def get_post_from_request(request):
    """
    form must include a 'question_title', 'question_input', as well as one or more 'step_input_#' keys
    """

    hw = get_homework_from_request(request)
    question_title = get_question_title_from_request(request)
    question_text = get_question_from_request(request)
    final_answer = get_final_answer_from_request(request)
    steps = get_steps_from_request(request)

    now = datetime.now()
    return Post(question=question_text,\
                title=question_title,\
                final_answer=final_answer,\
                creation_date=now,\
                last_edit_date=now,\
                user=current_user,\
                homework=hw,
                steps=steps)


def get_homework_from_request(request):
    homework_id = request.args['homework_id']
    if homework_id is None:
        raise 'homework_id missing in request args'

    hw = Homework.query.filter_by(id=homework_id).first()
    if hw is None:
        raise 'unrecognized homework id passed in request args'

    return hw


def get_steps_from_request(request):
    # Steps may have missing name ids (if the user deleted a step)
    # Get only keys that are for step inputs
    steps = []
    for key, value in request.form.iteritems():
        if 'step_' in key:
            number = key.replace('step_', '').replace('_input', '')
            steps.append(Step(number=int(number), text=value))

    # Steps may be out of order from dictionary.
    # Sort by the step number
    steps.sort(key=lambda x: x.number)

    # Re-index the step numbers so that they are contiguous
    for idx, step in enumerate(steps):
        step.number = idx + 1

    return steps


def get_question_from_request(request):
    question_text = request.form['question_input']
    if question_text is None:
        raise 'question_input form index not found'

    return question_text

def get_question_title_from_request(request):
    question_title = request.form['question_title']
    if question_title is None:
        raise 'question_title form index not found'

    return question_title

def get_final_answer_from_request(request):
    final_answer = request.form['final_answer_input']
    if final_answer is None:
        raise 'final_answer form index not found'

    return final_answer
