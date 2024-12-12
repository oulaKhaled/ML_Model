from fastapi import FastAPI
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

SECRET = os.getenv("SECRET")
print("SECRET,", SECRET)
# Ensure the build_fn is correctly set
app = FastAPI()
router = APIRouter()
models.Base.metadata.create_all(bind=engine)
BASE_DIR = Path(__file__).resolve(strict=True).parent

app.include_router(user.router)
app.include_router(oauth.router)


class SymptomIn(BaseModel):
    symptoms: list
    # model: str


class PredictionDisease(BaseModel):
    disease: str


@app.get("/")
def home():
    return {"message": "Welome to home page", "model_type": model_version}


@app.post("/predict")
async def predict(payload: SymptomIn):
    disease = predict_pipeline(payload.symptoms)
    return {f"Disease from main function ": disease}
