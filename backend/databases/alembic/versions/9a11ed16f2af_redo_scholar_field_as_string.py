"""Redo scholar field as string

Revision ID: 9a11ed16f2af
Revises: 1f2c8388e9cd
Create Date: 2023-04-02 14:07:21.806301

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9a11ed16f2af'
down_revision = '1f2c8388e9cd'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('scholar', sa.String(length=5), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'scholar')
    # ### end Alembic commands ###
