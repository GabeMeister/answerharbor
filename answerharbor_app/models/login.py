""" Initialize the package """

# pylint: disable=C0103,C0111,C0413,E1101

from answerharbor_app import login_manager, app
from answerharbor_app.models.user import User

login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
