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
import datetime
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidKeyTypeError


router = APIRouter()

ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class UserCredentials(BaseModel):
    email: EmailStr
    password: str


SECRET = os.getenv("SECRET")

ALGORITHM = os.getenv("ALGORITHM")


## JWT TOKEN AUTHENTICATION
def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.now() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET, algorithm=ALGORITHM)
    return encoded_jwt


def authenticate_user(email: str, password: str, db):
    user = db.query(models.User).filter(email == models.User.email).first()
    if user:
        verify_password = pwd_context.verify(password, user.password)
        print("verify_password : ", verify_password)
        if not verify_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="password is not valid"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="account not found, please register first",
        )


@router.post("/login")
async def Login(
    user: UserCredentials,
    db: Session = Depends(database.get_db),
):
    user_is_authenticated = authenticate_user(
        email=user.email, password=user.password, db=db
    )
    access_token_expires = timedelta(minutes=60)
    print("user is authenticated ", user_is_authenticated)
    token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return token


@router.post("/get_current_user")
async def get_currnet_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Session = Depends(database.get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not find validate cresentials",
    )
    try:
        payload = jwt.decode(token, SECRET, [ALGORITHM])
        print("payload :", payload)
        email = payload["sub"]
        print("email : ", email)
        if email is None:
            print("here we got an error")
            raise credentials_exception
        # token_data = TokenData(username=username)
    except:
        print("here we got an error 222")
        raise credentials_exception
    user = db.query(models.User).filter(email == models.User.email).first()
    if user:
        return user
