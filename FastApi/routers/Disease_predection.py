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

from tensorflow.python.keras.models import load_model
import tf_keras as k3
from sklearn.pipeline import Pipeline
import dill
from keras import models
from FastApi.utils.utils import baseline_model
import os


__version__ = "0.1.0"


MODEL_DIR = os.getenv("MODEL_DIR")
encode = LabelEncoder()
dataset = pd.read_csv(f"{MODEL_DIR}/Original_Dataset.csv")
y2 = dataset["Disease"]
# y2 = encode.fit_transform(y2)


df = pd.DataFrame(y2)

y_encoded = pd.get_dummies(df, dtype=int)


def get_disease_name(array):
    input_series = pd.Series(array)
    result = y_encoded.eq(input_series, axis=0)
    return result.all().idxmax()


ANNs = models.load_model(f"{MODEL_DIR}/keras_model.keras")

with open(f"{MODEL_DIR}/sklearn_pipeline2.pkl", "rb") as f:
    pipeline = dill.load(f)
# pipeline = joblib.load(f"{BASE_DIR}/sklearn_pipeline1.pkl")
pipeline.named_steps["model"].model = ANNs
pipeline.named_steps["model"].build_fn = baseline_model


encoded_features = []


def predict_pipeline(symptoms):
    """
    to transform entered symptoms to numerical values so model can predict disease
    """
    data = []
    for n in range(len(symptoms)):
        symptom = [
            i
            for i, val in enumerate(features)
            if features[i] == " " + symptoms[n][f"symptom"]
        ]
        data.append(symptom[0])
    count = 17 - len(data)
    data = [data + [0] * count]
    y_pred = pipeline.predict(data)
    result = get_disease_name(y_pred[0]).split("Disease_")
    return result[1]
