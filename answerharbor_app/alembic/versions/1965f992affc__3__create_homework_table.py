# pylint: disable=C0103,C0111,E1101,C0301

"""_3__create_homework_table

Revision ID: 1965f992affc
Revises: d530e881f3c3
Create Date: 2017-06-17 12:40:09.763238

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1965f992affc'
down_revision = 'd530e881f3c3'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'homework',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('title', sa.String(100), nullable=False)
    )

    with op.batch_alter_table('post') as batch_op:
        batch_op.add_column(sa.Column('homework_id', sa.Integer, sa.ForeignKey('homework.id', name='fk_post_id_to_homework_id')))


def downgrade():
    with op.batch_alter_table('post') as batch_op:
        batch_op.drop_column('homework_id')

    op.drop_table('homework')
