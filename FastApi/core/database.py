from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import dotenv

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


## session maintains a connection to the database so that queries, inserts, updates, and deletes can be executed.


def get_db():
    db = SessionLocal()
    try:
        ##The yield keyword makes it a generator function.
        ## FastAPI uses this function to provide the db session as a dependency to route handlers.
        yield db
    finally:
        db.close()
