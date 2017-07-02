# pylint: disable=C0103,C0111,E1101,C0301

"""_4__create course table

Revision ID: 8cc59e7067d0
Revises: 1965f992affc
Create Date: 2017-06-17 17:41:59.689358

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8cc59e7067d0'
down_revision = '1965f992affc'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'course',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('subject', sa.String(100), nullable=False),
        sa.Column('number', sa.Integer, nullable=False),
        sa.Column('professor_name', sa.String(200), nullable=False),
        sa.Column('course_times', sa.String(100), nullable=False)
    )

    with op.batch_alter_table('homework') as batch_op:
        batch_op.add_column(sa.Column('course_id', sa.Integer, sa.ForeignKey('course.id', name='fk_homework_id_to_course_id')))


def downgrade():
    with op.batch_alter_table('homework') as batch_op:
        batch_op.drop_column('course_id')

    op.drop_table('course')
