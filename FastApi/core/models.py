from .database import Base
from sqlalchemy import Boolean, String, ForeignKey, Integer, Column, Date
import datetime
from sqlalchemy_file import FileField, File


## email , password validation
class User(Base):
    __tablename__ = "User"
    id = Column(Integer, primary_key=True, nullable=False)
    username = Column(String(60), nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)
    created_at = Column(Date, default=datetime.date.today())


class Patient(Base):
    __tablename__ = "Patient"
    # id = Column(Integer, primary_key=True, nullable=False)
    user = Column(Integer, ForeignKey("User.id", ondelete="CASCADE"), primary_key=True)
    symptoms = Column(String)
    doctor_specialty = Column(String)


class Doctor(Base):
    __tablename__ = "Doctor"
    user = Column(Integer, ForeignKey("User.id", ondelete="CASCADE"), primary_key=True)
    symptoms = Column(String)
    disease = Column(String)


class Researcher(Base):
    __tablename__ = "Researcher"
    user = Column(Integer, ForeignKey("User.id", ondelete="CASCADE"), primary_key=True)
    dataset = Column(FileField)
    algorithm = Column(String)
    predicted_label = Column(String)
    # results
    ## dataset, algorithms, results
    pass
