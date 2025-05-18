from pydantic import BaseModel, EmailStr
from fastapi import status, Depends, APIRouter, HTTPException
from FastApi.core.database import get_db
from sqlalchemy.orm import Session
from FastApi.core import models
from FastApi.utils.utils import hash_password

router = APIRouter()


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    confirm_password: str


class UserResponse(BaseModel):
    id: int
    username: str


@router.post("/register", status_code=status.HTTP_200_OK, response_model=UserResponse)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    ## converts the UserCreate Pydantic model into a dictionary.
    ## creates a new SQLAlchemy model instance using this dictionary.
    hashed_password = hash_password(user.password, user.confirm_password)
    email_is_existed = (
        db.query(models.User).filter(models.User.email == user.email).first()
    )
    if email_is_existed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="email already used before"
        )
    new_user = models.User(
        email=user.email,
        password=hashed_password,
        username=user.username,
    )
    db.add(new_user)
    db.commit()
    # Commits the transaction to save the new user in the database.
    db.refresh(new_user)
    return new_user


@router.get("/user/{id}/", response_model=UserResponse)
def get_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        return HTTPException(status_code=400, detail="User does not exist")
    return user
