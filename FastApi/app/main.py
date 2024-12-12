from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel, Field
from fastapi import APIRouter
from routers.predection import predict_pipeline
from routers.predection import __version__ as model_version
import joblib
from pathlib import Path
from core import models
from core.database import engine
import secrets
from routers import user, oauth
import os
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated
from utils.utils import oauth2_scheme
from routers.oauth import get_currnet_user

SECRET = os.getenv("SECRET")
print("SECRET,", SECRET)
# Ensure the build_fn is correctly set
app = FastAPI()
router = APIRouter()
models.Base.metadata.create_all(bind=engine)
BASE_DIR = Path(__file__).resolve(strict=True).parent

app.include_router(user.router)
app.include_router(oauth.router)

user_dependency = Annotated[dict, Depends(get_currnet_user)]


class SymptomIn(BaseModel):
    symptoms: list
    # model: str


class PredictionDisease(BaseModel):
    disease: str


@app.get("/")
def home():
    return {"message": "Welome to home page", "model_type": model_version}


@app.post("/predict")
async def predict(
    payload: SymptomIn,
    token: Annotated[str, Depends(oauth2_scheme)],
):
    disease = predict_pipeline(payload.symptoms)
    return {f"Disease from main function ": disease}


@app.get("/user")
def user_data(user: user_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    else:
        return {"User": user}
