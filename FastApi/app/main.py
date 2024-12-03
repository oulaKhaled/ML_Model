from fastapi import FastAPI
from pydantic import BaseModel, Field
from fastapi import APIRouter
from model.model import predict_pipeline
from model.model import __version__ as model_version
import joblib
from pathlib import Path


# Ensure the build_fn is correctly set
app = FastAPI()
router = APIRouter()

BASE_DIR = Path(__file__).resolve(strict=True).parent


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
