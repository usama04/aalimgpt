"""Chats added to database

Revision ID: 47c09356a020
Revises: 7acba40fa4f6
Create Date: 2023-03-09 01:03:09.724426

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '47c09356a020'
down_revision = '7acba40fa4f6'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('chats', sa.Column('prompt', sa.String(), nullable=True))
    op.add_column('chats', sa.Column('generated_response', sa.String(), nullable=True))
    op.drop_column('chats', 'message')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('chats', sa.Column('message', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_column('chats', 'generated_response')
    op.drop_column('chats', 'prompt')
    # ### end Alembic commands ###
