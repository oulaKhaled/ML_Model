from keras import models
from keras import layers


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
