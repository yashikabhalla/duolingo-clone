from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

DATABASE_URL = "sqlite:///./duolingo.db"

# check_same_thread=False: FastAPI handles requests in different threads,
# and SQLite by default only allows the thread that created the connection.
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


# Dependency: gives each request its own DB session, then closes it
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()