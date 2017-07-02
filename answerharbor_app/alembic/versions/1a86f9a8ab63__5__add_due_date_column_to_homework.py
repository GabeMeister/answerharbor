# pylint: disable=C0103,C0111,C0413,E1101

"""_5_ add due date column to homework

Revision ID: 1a86f9a8ab63
Revises: 8cc59e7067d0
Create Date: 2017-06-17 18:09:35.285222

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1a86f9a8ab63'
down_revision = '8cc59e7067d0'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('homework') as batch_op:
        batch_op.add_column(sa.Column('due_date', sa.DateTime))


def downgrade():
    with op.batch_alter_table('homework') as batch_op:
        batch_op.drop_column('due_date')
