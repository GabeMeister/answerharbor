# pylint: disable=C0103,C0111,E1101,C0301

"""_10_create final answer column

Revision ID: 27d126da7812
Revises: df4450693cbd
Create Date: 2017-08-27 16:05:30.465423

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '27d126da7812'
down_revision = 'df4450693cbd'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('post') as batch_op:
        batch_op.add_column(sa.Column('final_answer', sa.BLOB, nullable=False, server_default='Temporary Final Answer'))


def downgrade():
    with op.batch_alter_table('post') as batch_op:
        batch_op.drop_column('final_answer')
