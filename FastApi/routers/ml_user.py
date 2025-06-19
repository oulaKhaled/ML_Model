import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
import pickle
from pathlib import Path
from FastApi.utils.utils import features
import os
from pydantic import BaseModel, Field
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
from fastapi import APIRouter, UploadFile, File, Depends, Request, HTTPException
from sklearn.metrics import (
    f1_score,
    precision_score,
    classification_report,
    confusion_matrix,
    accuracy_score,
)
from FastApi.core import models
from typing import Annotated
from FastApi.routers.oauth import get_currnet_user
from fastapi import Form
import csv
from tempfile import NamedTemporaryFile

router = APIRouter()


# class TrainModelData(BaseModel):
#     select: str
#     algorithm: str
#     target: str

# dataIn: TrainModelData,


def data_preprocessing(dataset, target, select):
    dataset = pd.read_csv(dataset)
    unique_values = []
    print("This is Select Method : ", select)
    if select != "first" and select != "second":
        raise HTTPException(status_code=400, detail="Please Select Encoding Mothod")
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
    data_features = pd.unique(column_values.astype(str)).tolist()
    data_features = [i for i in data_features if str(i) != "nan"]
    encoder = LabelEncoder()
    if select == "first":
        new_data = pd.DataFrame(0, columns=data_features, index=dataset.index)
        new_data[f"{target}"] = dataset[f"{target}"]
        for col in data_features:
            string_val = str(col)
            new_data[string_val] = dataset["unique_values"].apply(
                lambda x: 1 if col in x else 0
            )
        x = new_data.drop([f"{target}"], axis=1)
        y = dataset[f"{target}"]
        y = encoder.fit_transform(y)
        return x, y, data_features, encoder
    else:
        new_data2 = pd.DataFrame(columns=dataset.columns, index=dataset.index)
        x2 = new_data2.drop([f"{target}", "unique_values"], axis=1)
        columns = x2.columns.tolist()
        columns
        for i in columns:
            x2[i] = dataset[i].apply(
                lambda x2: data_features.index(x2) + 1 if x2 in data_features else 0
            )
        y2 = dataset[f"{target}"]
        y2 = encoder.fit_transform(y2)
        return x2, y2, data_features, encoder


def hyperParamter_tuning(model, x, y):
    if model == "logisticregression":
        pipeline = Pipeline(
            [
                ("scaler", StandardScaler()),
                ("logisticregression", LogisticRegression()),
            ]
        )
        hyper_parameters = {
            "logisticregression__multi_class": ["ovr"],
            "logisticregression__solver": ["newton-cg", "lbfgs", "saga"],
            "logisticregression__C": [0.0001, 0.001, 0.01, 0.1, 1, 10, 100, 1000],
        }

    elif model == "svm":
        pipeline = Pipeline([("scaler", StandardScaler()), ("svm", SVC())])
        hyper_parameters = {
            "svm__kernel": [
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
    score_cros_val = scores.mean()
    print("scores cv=10")
    print(score_cros_val)

    print("scores cv=shuffle_split")
    print(scores_shuffle_split.mean())
    print("scores cv=k_folds")
    print(scores_k_folds.mean())
    return score_cros_val


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
    accuracy = accuracy_score(y_test, y_pred)
    f1Score = f1_score(y_test, y_pred, average="weighted")
    print("Accuracy :", accuracy)
    print("F1 : ", f1Score)

    return accuracy, f1Score


@router.post("/train_model", response_model=None)
async def train_model(
    # select: str,
    # algorithm: str,
    # target: str,
    user: Annotated[dict, Depends(get_currnet_user)],
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Session = Depends(get_db),
    select: str = Form(...),
    algorithm: str = Form(...),
    target: str = Form(...),
    dataset: UploadFile = File(...),
):
    ## dataset validation, csv

    if not dataset.content_type == "text/csv":
        raise HTTPException(status_code=400, detail="Only Accepts .csv Files")

    x, y, data_features, encoder = data_preprocessing(
        dataset=dataset.file, target=target, select=select
    )

    final_model = hyperParamter_tuning(model=algorithm, x=x, y=y)
    print(final_model)
    score_cros_val = cross_validation(final_model, x, y)
    accuracy, f1Score = fit_model(final_model=final_model, x=x, y=y)

    serialized_model = pickle.dumps(
        {
            "model": final_model,
            "encoder": encoder,
            "data_features": data_features,
            "len_x": len(x.columns),
            "select": select,
        },
    )
    print("THis is select method : ", select)

    new_obj = models.ML_user(
        user=user["id"],
        dataset=dataset.filename,
        algorithm=algorithm,
        model=serialized_model,
        accuracy=accuracy,
        target=target,
    )
    print("DATASET , ", dataset)

    db.add(new_obj)
    db.commit()
    db.refresh(new_obj)
    print("DATA FEATURES", data_features)

    return {
        "The new model has been saved successfully": [
            accuracy,
            f1Score,
            score_cros_val,
            data_features,
        ]
    }


@router.post("/predict_using_trained_model")
def predict_model(
    user: Annotated[dict, Depends(get_currnet_user)],
    token: Annotated[str, Depends(oauth2_scheme)],
    trained_model_id: int,
    new_x: List[str],
    db: Session = Depends(get_db),
):

    trained_model = (
        db.query(models.ML_user)
        .filter(models.ML_user.id == trained_model_id and models.User.id == user["id"])
        .first()
    )
    print("trained_model :", trained_model.algorithm)
    model_data = pickle.loads(trained_model.model)
    final_model = model_data["model"]
    encoder = model_data["encoder"]
    data_features = model_data["data_features"]
    len_x = model_data["len_x"]
    select = model_data["select"]

    """
    to transform entered data to numerical values so model can predict disease
    """

    data1 = [0] * len_x
    data2 = []
    new_x = new_x[0].split(",")
    for n in range(len(new_x)):
        feature = [
            i for i, val in enumerate(data_features) if data_features[i] == new_x[n]
        ]
        print(feature)
        if select == "second":
            data2.append(feature[0] + 1)
        else:
            data1[feature[0]] = 1
    if select == "second":
        count = len_x - len(data2)
        data2 = [data2 + [0] * count]
        y_pred = final_model.predict(data2)
    else:
        y_pred = final_model.predict([data1])
    y_pred = encoder.inverse_transform(y_pred)
    return y_pred[0]


@router.get("/user_model")
def user_model(
    user: Annotated[dict, Depends(get_currnet_user)],
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Session = Depends(get_db),
):

    result = []
    trained_model = (
        db.query(models.ML_user).filter(models.ML_user.user == user["id"]).all()
    )
    data_features = []
    for i in trained_model:
        model_data = pickle.loads(i.model)
        data_features.append(model_data["data_features"])

    result = [
        attr
        for model, data in zip(trained_model, data_features)
        for attr in (
            model.id,
            model.algorithm,
            model.dataset,
            model.target,
            model.accuracy,
            data,
        )
    ]

    return result


## delete modal by id
@router.delete("/delete_model")
def delete_model(
    user: Annotated[dict, Depends(get_currnet_user)],
    token: Annotated[str, Depends(oauth2_scheme)],
    model_id: int,
    db: Session = Depends(get_db),
):
    model = (
        db.query(models.ML_user)
        .filter(models.ML_user.id == model_id and models.User.id == user["id"])
        .first()
    )
    if not model:
        raise HTTPException(status_code=400, detail="model not found")
    db.delete(model)
    db.commit()
    return {"model removed successfull "}
