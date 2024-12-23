from fastapi import (
    FastAPI,
    APIRouter,
    Depends,
    status,
    HTTPException,
    Request,
    Security,
)
from pydantic import EmailStr, BaseModel
import datetime
from datetime import timedelta
from sqlalchemy.orm import Session

from jose import JWTError, jwt
import secrets
from FastApi.core import models, database
import os
import dotenv
import datetime
from typing import Annotated
from jwt.exceptions import InvalidKeyTypeError
from FastApi.utils.utils import oauth2_scheme, pwd_context
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()

ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")


class UserCredentials(BaseModel):
    email: EmailStr
    password: str


SECRET = os.getenv("SECRET")

ALGORITHM = os.getenv("ALGORITHM")


class Token(BaseModel):
    token: str


## JWT TOKEN AUTHENTICATION
def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.now() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET, algorithm=ALGORITHM)
    return encoded_jwt


def authenticate_user(username: str, password: str, db):
    user = db.query(models.User).filter(username == models.User.username).first()
    if user:
        verify_password = pwd_context.verify(password, user.password)
        print("verify_password : ", verify_password)
        if not verify_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="password is not valid"
            )
        return user
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="account not found, please register first",
        )


@router.post("/token")
async def Login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(database.get_db),
):
    auth_user = authenticate_user(
        username=form_data.username, password=form_data.password, db=db
    )
    # print("ACCESS_TOKEN_EXPIRE_MINUTES type : ", type())
    access_token_expires = timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES))

    token = create_access_token(
        data={"sub": form_data.username, "id": auth_user.id},
        expires_delta=access_token_expires,
    )
    print("roken : ", token)

    return {"access_token": token, "token_type": "bearer"}


## Check JWT decoding
async def get_currnet_user(
    token: Annotated[str, Depends(oauth2_scheme)],
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not find validate cresentials",
    )
    segments = token.split(".")
    if len(segments) != 3:
        print("Not enough or too many segments'")
    payload = jwt.decode(
        token,
        key=SECRET,
        algorithms=[ALGORITHM],
        options={"verify_signature": False},
    )
    print("payload :", payload)
    username = payload["sub"]
    id = payload["id"]

    if username is None:
        print("here we got an error")
        raise credentials_exception
    else:
        return payload

        # # token_data = TokenData(username=username)
        # print("here we got an error 222")
        # raise credentials_exception
