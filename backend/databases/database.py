import settings
import sqlalchemy as sa
import sqlalchemy.orm as orm
import sqlalchemy.ext.declarative as dec

db_url = settings.DATABASE_URL

engine = sa.create_engine(db_url)

SessionLocal = orm.sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = dec.declarative_base()

