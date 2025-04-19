import pickle
import joblib
import re
from pathlib import Path
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.pipeline import Pipeline
import numpy as np
import pandas as pd
from scikeras.wrappers import KerasClassifier
from FastApi.utils.utils import features
from fastapi import FastAPI, Depends, APIRouter
from tensorflow.python.keras.models import load_model
import tf_keras as k3
from sklearn.pipeline import Pipeline
import dill
from keras import models
from FastApi.utils.utils import baseline_model
import os
from pydantic import BaseModel
from typing import Annotated
from FastApi.utils.utils import oauth2_scheme
from FastApi.core.models import Doctor
from FastApi.routers.oauth import get_currnet_user
from sqlalchemy.orm import Session
from FastApi.core.database import get_db

router = APIRouter()
__version__ = "0.1.0"
MODEL_DIR = os.getenv("MODEL_DIR")

dataset = pd.read_csv(f"{MODEL_DIR}/Original_Dataset.csv")
y2 = dataset["Disease"]


df = pd.DataFrame(y2)

y_encoded = pd.get_dummies(df, dtype=int)


ANNs = models.load_model(f"{MODEL_DIR}/keras_model.keras")

with open(f"{MODEL_DIR}/sklearn_pipeline2.pkl", "rb") as f:
    pipeline = dill.load(f)
# pipeline = joblib.load(f"{BASE_DIR}/sklearn_pipeline1.pkl")
pipeline.named_steps["model"].model = ANNs
pipeline.named_steps["model"].build_fn = baseline_model


encoded_features = []


class SymptomIn(BaseModel):
    symptoms: list
    # model: str


def predict_disease(symptoms):
    """
    to transform entered symptoms to numerical values so model can predict disease
    """

    data = []
    for n in range(len(symptoms)):
        symptom = [
            i for i, val in enumerate(features) if features[i] == " " + symptoms[n]
        ]
        data.append(symptom[0])
    count = 17 - len(data)
    data = [data + [0] * count]
    y_pred = pipeline.predict(data)
    predicted_class = np.argmax(y_pred, axis=1)
    predicted_disease = y_encoded.columns[predicted_class][0].split("Disease_")[1]
    # print(
    #     "predicted disease form predict disease method in Doctor file : ",
    #     predicted_disease,
    # )
    return predicted_disease


@router.post("/predict_disease")
async def predict(
    payload: SymptomIn,
    token: Annotated[str, Depends(oauth2_scheme)],
    user: Annotated[dict, Depends(get_currnet_user)],
    db: Session = Depends(get_db),
):
    disease = predict_disease(payload.symptoms)
    new_obj = Doctor(user=user["id"], symptoms=payload.symptoms, disease=disease)
    db.add(new_obj)
    db.commit()
    db.refresh(new_obj)

    return {f"Disease from main function ": disease}
