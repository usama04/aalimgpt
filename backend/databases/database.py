import settings
import sqlalchemy as sa
import sqlalchemy.orm as orm



db_url = settings.DATABASE_URL

engine = sa.create_engine(db_url)

SessionLocal = orm.sessionmaker(bind=engine, autocommit=False, autoflush=False)


