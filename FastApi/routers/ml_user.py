import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
import pickle
from pathlib import Path
from FastApi.utils.utils import features
import os
from pydantic import BaseModel
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.pipeline import Pipeline
from sklearn.model_selection import (
    GridSearchCV,
    KFold,
    train_test_split,
    cross_val_score,
    ShuffleSplit,
)
from FastApi.utils.utils import oauth2_scheme

from FastApi.core.database import get_db
from sqlalchemy.orm import Session
from typing import List
import pickle
from fastapi import APIRouter, UploadFile, File, Depends
from sklearn.metrics import (
    f1_score,
    precision_score,
    classification_report,
    confusion_matrix,
    accuracy_score,
)
from FastApi.core import models
from typing import Annotated

router = APIRouter()
encoder = LabelEncoder()
count1 = 0


def data_preprocessing_1(dataset, target):
    dataset = pd.read_csv(dataset)
    unique_values = []
    ## this loop is for creating new column called unique_values that contain each row's values
    for i in range(len(dataset)):
        value = dataset.iloc[i].values.tolist()  ## values of each row
        if 0 in value:
            unique_values.append(
                value[1 : value.index(0)]
            )  ## if value is 0 only append data in row that is not 0
        else:
            unique_values.append(value[1:])
    dataset["unique_values"] = unique_values
    column_values = dataset.drop([target, "unique_values"], axis=1).values.ravel()
    data_features = pd.unique(column_values).tolist()
    data_features = [
        i for i in data_features if str(i) != "nan"
    ]  ## get all unique features in dataset
    # ## Creating DataFrame with binary indicators
    new_data = pd.DataFrame(0, columns=data_features, index=dataset.index)
    new_data[f"{target}"] = dataset[f"{target}"]
    for col in data_features:
        new_data[col] = dataset["unique_values"].apply(lambda x: 1 if col in x else 0)
    x = new_data.drop([f"{target}"], axis=1)
    y = dataset[f"{target}"]
    y = encoder.fit_transform(y)
    return x, y


def data_preprocessing_2(dataset, target):
    dataset = pd.read_csv(dataset)
    unique_values = []
    ## this loop is for creating new column called unique_values that contain each row's values
    for i in range(len(dataset)):
        value = dataset.iloc[i].values.tolist()  ## values of each row
        if 0 in value:
            unique_values.append(
                value[1 : value.index(0)]
            )  ## if value is 0 only append data in row that is not 0
        else:
            unique_values.append(value[1:])
    dataset["unique_values"] = unique_values
    column_values = dataset.drop([target, "unique_values"], axis=1).values.ravel()
    data_features = pd.unique(column_values).tolist()
    data_features = [i for i in data_features if str(i) != "nan"]

    new_data2 = pd.DataFrame(columns=dataset.columns, index=dataset.index)
    x2 = new_data2.drop([f"{target}", "unique_values"], axis=1)
    columns = x2.columns.tolist()
    columns
    for i in columns:
        x2[i] = dataset[i].apply(
            lambda x2: data_features.index(x2) + 1 if x2 in data_features else 0
        )
    encoder = LabelEncoder()
    y2 = dataset[f"{target}"]
    y2 = encoder.fit_transform(y2)
    return x2, y2, data_features, encoder


def hyperParamter_tuning(model, x, y):
    if model == "logisticregression":
        pipeline = Pipeline(
            [("scaler", StandardScaler()), ("logisticregression", LogisticRegression())]
        )
        hyper_parameters = {
            "logisticregression__multi_class": ["ovr"],
            "logisticregression__solver": ["newton-cg", "lbfgs", "saga"],
            "logisticregression__C": [0.0001, 0.001, 0.01, 0.1, 1, 10, 100, 1000],
        }

    elif model == "svm":
        pipeline = Pipeline([("scaler", StandardScaler()), ("svc", SVC())])
        hyper_parameters = {
            "svc__kernel": [
                "poly",
                "rbf",
                "sigmoid",
            ],
        }

    elif model == "randomforest":
        pipeline = Pipeline(
            [("scaler", StandardScaler()), ("randomforest", RandomForestClassifier())]
        )

        hyper_parameters = {
            "randomforest__n_estimators": [
                10,
                20,
                30,
                40,
                50,
                60,
                70,
                80,
                90,
                100,
                200,
                300,
                400,
            ],
            "randomforest__max_depth": [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
            ],
            "randomforest__min_samples_leaf": [2, 3, 4, 5, 6],
        }
    elif model == "decisiontree":
        pipeline = Pipeline(
            [("scaler", StandardScaler()), ("decisiontree", DecisionTreeClassifier())]
        )
        hyper_parameters = {
            "decisiontree__max_depth": [
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
            ]
        }
    elif model == "knn":
        pipeline = Pipeline(
            [("scaler", StandardScaler()), ("knn", KNeighborsClassifier())]
        )
        hyper_parameters = {
            "knn__n_neighbors": range(19, 150, 2),
            "knn__algorithm": ["auto", "ball_tree", "kd_tree", "brute"],
        }
    else:
        return {"message": "please select valid algorithm"}

    grid_search = GridSearchCV(pipeline, hyper_parameters, cv=10, verbose=1, n_jobs=-1)

    grid_search.fit(x, y)
    print("Best parameters found: ", grid_search.best_params_)
    print("Best cross-validation score: ", grid_search.best_score_)
    print("Best estimator: ", grid_search.best_estimator_)
    final_model = grid_search.best_estimator_
    return final_model


def cross_validation(final_model, x, y):

    shuffle_split = ShuffleSplit(n_splits=10, test_size=0.3, random_state=0)
    k_folds = KFold(n_splits=10, shuffle=True)
    scores = cross_val_score(final_model, x, y, cv=10, scoring="accuracy")
    scores_shuffle_split = cross_val_score(
        final_model, x, y, cv=shuffle_split, scoring="accuracy"
    )
    scores_k_folds = cross_val_score(final_model, x, y, cv=k_folds, scoring="accuracy")
    # scores = cross_val_score(pipeline, x, y, cv=10, scoring='accuracy')

    print("scores cv=10")
    print(scores.mean())

    print("scores cv=shuffle_split")
    print(scores_shuffle_split.mean())
    print("scores cv=k_folds")
    print(scores_k_folds.mean())


def fit_model(x, y, final_model):
    X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.3)
    final_model.fit(X_train, y_train)
    # print(X_test)
    y_pred = final_model.predict(X_test)
    result = confusion_matrix(y_test, y_pred)
    print("Confusion Matrix:")
    print(result)
    result1 = classification_report(y_test, y_pred, zero_division=1)
    print(
        "Classification Report:",
    )
    print(result1)
    print("Accuracy :", accuracy_score(y_test, y_pred))
    print("F1 : ", f1_score(y_test, y_pred, average="weighted"))


@router.post("/train_model", response_model=None)
def train_model(
    token: Annotated[str, Depends(oauth2_scheme)],
    algorithm: str,
    target: str,
    dataset: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    ## dataset validation, csv
    # if not dataset.endswith(".csv"):
    #     return "only excepect .csv file"
    # dataset = dataset.file.read()
    # dataset.write(dataset.file.read())

    x, y, data_features, encoder = data_preprocessing_2(
        dataset=dataset.file, target=target
    )

    final_model = hyperParamter_tuning(model=algorithm, x=x, y=y)
    print(final_model)
    cross_validation(final_model, x, y)
    fit_model(final_model=final_model, x=x, y=y)
    len_x = len(x.columns)
    # with open("first11.pkl", "wb") as f:
    serialized_model = pickle.dumps(
        {
            "model": final_model,
            "encoder": encoder,
            "data_features": data_features,
            "len_x": len(x.columns),
        },
    )

    new_obj = models.ML_user(
        user=1, dataset=dataset.filename, algorithm=algorithm, model=serialized_model
    )
    db.add(new_obj)
    db.commit()
    db.refresh(new_obj)

    return new_obj

    # print(oauth2_scheme.model)


@router.post("/predict_researcher")
def predict_pipeline(
    trained_model_id: int, new_x: List[str], db: Session = Depends(get_db)
):

    trained_model = (
        db.query(models.ML_user).filter(models.ML_user.id == trained_model_id).first()
    )
    model_data = pickle.loads(trained_model.model)
    final_model = model_data["model"]
    encoder = model_data["encoder"]
    data_features = model_data["data_features"]
    len_x = model_data["len_x"]

    """
    to transform entered data to numerical values so model can predict disease
    #"""

    data = []
    new_x = new_x[0].split(",")
    print("new_x", new_x)
    print("data_features :", data_features)
    for n in range(len(new_x)):
        feature = [
            i for i, val in enumerate(data_features) if data_features[i] == new_x[n]
        ]
        print(feature)
        data.append(feature[0] + 1)
    count = len_x - len(data)
    data = [data + [0] * count]
    y_pred = final_model.predict(data)
    print(" y_pred before:", y_pred)
    y_pred = encoder.inverse_transform(y_pred)
    print(" y_pred after:", y_pred)


#   new_x, algorithm: str,
