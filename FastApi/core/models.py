# from .database import Base
from sqlalchemy import Boolean, String, ForeignKey, Integer, Column, Date, LargeBinary
import datetime
from sqlalchemy_file import FileField, File
from sqlalchemy.orm import DeclarativeBase
from .database import Base


## email , password validation
class User(Base):
    __tablename__ = "User"
    id = Column(Integer, primary_key=True, nullable=False)
    username = Column(String(60), nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    created_at = Column(Date, default=datetime.date.today())


#
class Patient(Base):
    __tablename__ = "Patient"
    id = Column(Integer, primary_key=True, nullable=False)
    user = Column(Integer, ForeignKey("User.id"), primary_key=False)
    symptoms = Column(String)
    doctor_specialty = Column(String)


class Doctor(Base):
    __tablename__ = "Doctor"
    id = Column(Integer, primary_key=True, nullable=False)
    user = Column(Integer, ForeignKey("User.id"), primary_key=False)
    symptoms = Column(String)
    disease = Column(String)


class ML_user(Base):
    __tablename__ = "ML_user"
    id = Column(Integer, primary_key=True, nullable=False)
    user = Column(Integer, ForeignKey("User.id"), primary_key=False)
    dataset = Column(String)
    algorithm = Column(String)
    model = Column(LargeBinary)
