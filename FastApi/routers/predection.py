import pickle
import joblib
import re
from pathlib import Path
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.pipeline import Pipeline
import numpy as np
import pandas as pd
from scikeras.wrappers import KerasClassifier


from tensorflow.python.keras.models import load_model
import tf_keras as k3
from sklearn.pipeline import Pipeline
import dill
from keras import models
from utils.utils import baseline_model
import os


__version__ = "0.1.0"


BASE_DIR = Path(__file__).resolve(strict=True).parent
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


# with open(f"{MODEL_DIR}/logisticregression33_model.pkl", "rb") as f:
#     model = pickle.load(f)
# with open(f"{MODEL_DIR}/KNN_model.pkl", "rb") as f:
#     KNN_model = pickle.load(f)
# with open(f"{MODEL_DIR}/DecisionTree_model.pkl", "rb") as f:
#     DecisionTree_model = pickle.load(f)
# with open(f"{MODEL_DIR}/RandomForest_model.pkl", "rb") as f:
#     RandomForest_model = pickle.load(f)

# with open(f"{MODEL_DIR}/SVM_model.pkl", "rb") as f:
#     SVM_model = pickle.load(f)


ANNs = models.load_model(f"{MODEL_DIR}/keras_model.keras")

with open(f"{MODEL_DIR}/sklearn_pipeline2.pkl", "rb") as f:
    pipeline = dill.load(f)
# pipeline = joblib.load(f"{BASE_DIR}/sklearn_pipeline1.pkl")
pipeline.named_steps["model"].model = ANNs
pipeline.named_steps["model"].build_fn = baseline_model


# print("ANNs : ", ANNs)
# print("GOT IT : ", pipeline)
# print(pipeline.named_steps["model"].build_fn)
## text.txt
features = [
    " itching",
    " skin_rash",
    " nodal_skin_eruptions",
    " dischromic _patches",
    " continuous_sneezing",
    " shivering",
    " chills",
    " watering_from_eyes",
    " stomach_pain",
    " acidity",
    " ulcers_on_tongue",
    " vomiting",
    " cough",
    " chest_pain",
    " yellowish_skin",
    " nausea",
    " loss_of_appetite",
    " abdominal_pain",
    " yellowing_of_eyes",
    " burning_micturition",
    " spotting_ urination",
    " passage_of_gases",
    " internal_itching",
    " indigestion",
    " muscle_wasting",
    " patches_in_throat",
    " high_fever",
    " extra_marital_contacts",
    " fatigue",
    " weight_loss",
    " restlessness",
    " lethargy",
    " irregular_sugar_level",
    " blurred_and_distorted_vision",
    " obesity",
    " excessive_hunger",
    " increased_appetite",
    " polyuria",
    " sunken_eyes",
    " dehydration",
    " diarrhoea",
    " breathlessness",
    " family_history",
    " mucoid_sputum",
    " headache",
    " dizziness",
    " loss_of_balance",
    " lack_of_concentration",
    " stiff_neck",
    " depression",
    " irritability",
    " visual_disturbances",
    " back_pain",
    " weakness_in_limbs",
    " neck_pain",
    " weakness_of_one_body_side",
    " altered_sensorium",
    " dark_urine",
    " sweating",
    " muscle_pain",
    " mild_fever",
    " swelled_lymph_nodes",
    " malaise",
    " red_spots_over_body",
    " joint_pain",
    " pain_behind_the_eyes",
    " constipation",
    " toxic_look_(typhos)",
    " belly_pain",
    " yellow_urine",
    " receiving_blood_transfusion",
    " receiving_unsterile_injections",
    " coma",
    " stomach_bleeding",
    " acute_liver_failure",
    " swelling_of_stomach",
    " distention_of_abdomen",
    " history_of_alcohol_consumption",
    " fluid_overload",
    " phlegm",
    " blood_in_sputum",
    " throat_irritation",
    " redness_of_eyes",
    " sinus_pressure",
    " runny_nose",
    " congestion",
    " loss_of_smell",
    " fast_heart_rate",
    " rusty_sputum",
    " pain_during_bowel_movements",
    " pain_in_anal_region",
    " bloody_stool",
    " irritation_in_anus",
    " cramps",
    " bruising",
    " swollen_legs",
    " swollen_blood_vessels",
    " prominent_veins_on_calf",
    " weight_gain",
    " cold_hands_and_feets",
    " mood_swings",
    " puffy_face_and_eyes",
    " enlarged_thyroid",
    " brittle_nails",
    " swollen_extremeties",
    " abnormal_menstruation",
    " muscle_weakness",
    " anxiety",
    " slurred_speech",
    " palpitations",
    " drying_and_tingling_lips",
    " knee_pain",
    " hip_joint_pain",
    " swelling_joints",
    " painful_walking",
    " movement_stiffness",
    " spinning_movements",
    " unsteadiness",
    " pus_filled_pimples",
    " blackheads",
    " scurring",
    " bladder_discomfort",
    " foul_smell_of urine",
    " continuous_feel_of_urine",
    " skin_peeling",
    " silver_like_dusting",
    " small_dents_in_nails",
    " inflammatory_nails",
    " blister",
    " red_sore_around_nose",
    " yellow_crust_ooze",
]

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


# y_KNN = KNN_model.predict(test)
# y_DecisionTree = DecisionTree_model.predict(test)
# y_RandomForest = RandomForest_model.predict(test)
# y_SVM = SVM_model.predict(test)
## inverse transform for another algorithms
