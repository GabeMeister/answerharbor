# pylint: disable=C0103,C0111,C0413,E1101

"""_6_ create school table

Revision ID: c64907a2fcea
Revises: 1a86f9a8ab63
Create Date: 2017-06-17 18:28:22.958346

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c64907a2fcea'
down_revision = '1a86f9a8ab63'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'school',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('full_name', sa.String(200), nullable=False),
        sa.Column('short_name', sa.String(100))
    )

    with op.batch_alter_table('course') as batch_op:
        batch_op.add_column(sa.Column('school_id', sa.Integer, \
            sa.ForeignKey('school.id', name='fk_course_id_to_school_id')))


def downgrade():
    with op.batch_alter_table('course') as batch_op:
        batch_op.drop_column('school_id')

    op.drop_table('school')
