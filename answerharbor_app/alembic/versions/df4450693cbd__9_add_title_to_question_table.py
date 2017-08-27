# pylint: disable=C0103,C0111,E1101,C0301

"""_9_add title to question table

Revision ID: df4450693cbd
Revises: f4ef7254f69b
Create Date: 2017-08-26 18:14:17.514808

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'df4450693cbd'
down_revision = 'f4ef7254f69b'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('post') as batch_op:
        batch_op.add_column(sa.Column('title', sa.String(50), nullable=False, server_default='Question'))


def downgrade():
    with op.batch_alter_table('post') as batch_op:
        batch_op.drop_column('title')
