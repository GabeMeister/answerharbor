# pylint: disable=C0103,C0111,E1101

"""Initial revision, add user table

Revision ID: 680cff8a6719
Revises:
Create Date: 2017-05-30 20:33:09.447531

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '680cff8a6719'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'user',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('username', sa.String(20), unique=True, nullable=False),
        sa.Column('email', sa.String(150), unique=True, nullable=False),
        sa.Column('password', sa.String(50), nullable=False)
    )


def downgrade():
    op.drop_table('user')
