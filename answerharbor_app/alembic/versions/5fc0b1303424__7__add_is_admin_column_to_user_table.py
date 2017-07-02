# pylint: disable=C0103,C0111,C0413,E1101

"""_7_ add is_admin column to user table

Revision ID: 5fc0b1303424
Revises: c64907a2fcea
Create Date: 2017-06-18 09:14:30.189925

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5fc0b1303424'
down_revision = 'c64907a2fcea'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('user') as batch_op:
        batch_op.add_column(sa.Column('is_admin', sa.Integer, server_default='0'))


def downgrade():
    with op.batch_alter_table('user') as batch_op:
        batch_op.drop_column('is_admin')
