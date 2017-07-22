# pylint: disable=C0103,C0111,C0413,E1101

"""_8__create_step_table

Revision ID: f4ef7254f69b
Revises: 5fc0b1303424
Create Date: 2017-07-20 18:41:05.069547

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text


# revision identifiers, used by Alembic.
revision = 'f4ef7254f69b'
down_revision = '5fc0b1303424'
branch_labels = None
depends_on = None


def upgrade():
    # Delete answer field in post table
    with op.batch_alter_table('post') as batch_op:
        batch_op.drop_column('answer')

    # Create steps table
    op.create_table(
        'step',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('number', sa.Integer, nullable=False),
        sa.Column('text', sa.BLOB, nullable=False),
        sa.Column('post_id', sa.Integer, sa.ForeignKey('post.id'))
    )

def downgrade():
    # Remove steps table
    op.drop_table('step')

    # Add in answer field into post table
    with op.batch_alter_table('post') as batch_op:
        batch_op.add_column(sa.Column('answer', sa.BLOB, nullable=False,
                                      server_default=text('temporary_answer_text')))
