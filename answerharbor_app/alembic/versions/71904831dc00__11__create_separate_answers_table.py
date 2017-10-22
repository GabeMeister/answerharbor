# pylint: disable=C0103,C0111,C0413,E1101

"""_11__create_separate_answers_table

Revision ID: 71904831dc00
Revises: 27d126da7812
Create Date: 2017-10-22 07:08:24.875027

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import text


# revision identifiers, used by Alembic.
revision = '71904831dc00'
down_revision = '27d126da7812'
branch_labels = None
depends_on = None


def upgrade():
    # Create answer table
    op.create_table(
        'answer',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('text', sa.BLOB, nullable=False),
        sa.Column('correct', sa.Integer, nullable=False),
        sa.Column('post_id', sa.Integer, sa.ForeignKey('post.id'), nullable=False)
    )

    # Get all final answers from post table
    conn = op.get_bind()
    results = conn.execute('SELECT id,final_answer FROM post')
    post_data = []
    for result in results:
        post_data.append({
            'id': result['id'],
            'text': str(result['final_answer'])
        })

    # Drop final_answer column, add in new type column
    with op.batch_alter_table('post') as batch_op:
        batch_op.drop_column('final_answer')
        batch_op.add_column(sa.Column('type', sa.String(20), nullable=False, server_default='auto'))

    # Insert final_answers from before into new answers table
    for post in post_data:
        sql = 'INSERT INTO answer (text, correct, post_id) VALUES (:text, 1, :id)'
        conn.execute(sql, post)


def downgrade():
    # Get all final answers from new answers table
    conn = op.get_bind()
    results = conn.execute('SELECT text,post_id FROM answer WHERE correct=1')
    post_data = []
    for result in results:
        post_data.append({
            'id': result['post_id'],
            'text': str(result['text'])
        })

    # Drop type column, add in final_answer column like before
    with op.batch_alter_table('post') as batch_op:
        batch_op.drop_column('type')
        batch_op.add_column(sa.Column('final_answer', sa.BLOB, nullable=False, server_default='Temporary Final Answer'))

    # Re-insert back final_answers into original final_answer column
    for post in post_data:
        sql = 'UPDATE post SET final_answer=:text WHERE id=:id'
        conn.execute(sql, post)

    # Drop answer table
    op.drop_table('answer')
