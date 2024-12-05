from fastapi import FastAPI, APIRouter, Depends, status, HTTPException
from pydantic import EmailStr, BaseModel
import datetime
from datetime import timedelta
from sqlalchemy.orm import Session
from utils.utils import pwd_context
from jose import JWTError, jwt
import secrets
from core import models, database
import os
import dotenv

router = APIRouter()


class UserCredentials(BaseModel):
    email: EmailStr
    password: str


SECRET = os.getenv("SECRET")

algorithm = os.getenv("algorithm")


@router.post("/login")
def Login(user: UserCredentials, db: Session = Depends(database.get_db)):
    user2 = db.query(models.User).filter(user.email == models.User.email).first()
    if user2:
        print(user2)
        verify_password = pwd_context.verify(user.password, user2.password)
        print(verify_password)
        if verify_password:
            return " you logged in successfully"
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="password is not valid"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="account not found, please register first",
        )


## JWT TOKEN AUTHENTICATION


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=40)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET, algorithm=algorithm)
    return encoded_jwt
