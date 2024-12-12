from keras import models
from keras import layers
from passlib.context import CryptContext
from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def baseline_model(neurons, hidden_layers):
    # create model
    model = models.Sequential()
    model.add(layers.Dense(neurons, input_shape=(17,), activation="relu"))
    for i in range(hidden_layers):
        model.add(layers.Dense(neurons, activation="relu"))
    model.add(layers.Dense(41, activation="softmax"))
    # Compile model
    model.compile(
        loss="categorical_crossentropy", optimizer="adam", metrics=["accuracy"]
    )
    return model


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str, confirm_password: str):
    if len(password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="password is less than 8 characters, too weak",
        )
    if password != confirm_password:
        raise HTTPException(
            status_code=400, detail="password and confirm password does not match"
        )
    return pwd_context.hash(password)
