from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel, Field
from fastapi import APIRouter
from FastApi.routers.doctor import __version__ as model_version
import joblib
from pathlib import Path
from FastApi.core import models
from FastApi.core.database import engine
import secrets
from FastApi.routers import user, oauth, doctor, patient
import os
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated
from FastApi.utils.utils import oauth2_scheme
from FastApi.routers.oauth import get_currnet_user
from FastApi.routers.ml_user import hyperParamter_tuning
from FastApi.routers import ml_user
from FastApi.core import models


# Ensure the build_fn is correctly set
app = FastAPI()


models.Base.metadata.create_all(bind=engine)

user_dependency = Annotated[models.User, Depends(get_currnet_user)]

app.include_router(user.router)
app.include_router(oauth.router)
app.include_router(ml_user.router)
app.include_router(doctor.router)
app.include_router(patient.router)


@app.get("/")
def home():
    return {"message": "Welome to home page", "model_type": model_version}


@app.get("/user")
def user_data(user=Depends(get_currnet_user)):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    else:
        return {"User": user}
