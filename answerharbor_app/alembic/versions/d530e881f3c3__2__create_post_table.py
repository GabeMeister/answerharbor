# pylint: disable=C0103,C0111,E1101

"""Create post table

Revision ID: d530e881f3c3
Revises: 680cff8a6719
Create Date: 2017-05-30 20:54:40.287782

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd530e881f3c3'
down_revision = '680cff8a6719'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'post',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('question', sa.BLOB, nullable=False),
        sa.Column('answer', sa.BLOB, nullable=False),
        sa.Column('creation_date', sa.DateTime, nullable=False),
        sa.Column('last_edit_date', sa.DateTime),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('user.id')),
    )


def downgrade():
    op.drop_table('post')
