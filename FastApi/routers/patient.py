import ollama
from fastapi import FastAPI, Depends, APIRouter
from FastApi.routers.doctor import predict_disease, SymptomIn
from pydantic import BaseModel
from FastApi.core.models import Patient
from FastApi.core.database import get_db
from FastApi.routers.oauth import get_currnet_user
from FastApi.utils.utils import oauth2_scheme
from typing import Annotated
from sqlalchemy.orm import Session

# model = "doctor"
client = ollama.Client()


model2 = "medllama2"


router = APIRouter()


@router.post("/doctor_speciality")
async def predict_doctor_specality(
    symptoms: SymptomIn,
    token: Annotated[str, Depends(oauth2_scheme)],
    user: Annotated[dict, Depends(get_currnet_user)],
    db: Session = Depends(get_db),
):
    disease = predict_disease(symptoms=symptoms.symptoms)
    # print(" Predicted Disease , ", disease)
    prompt = f"I will give you a disease name , I want you to choose a appropriate doctor type for the disease, please just answer with doctor type, don't add any other sentences or words, The disease is {disease}"
    response = client.generate(model=model2, prompt=prompt)
    # response = client.generate(model=model, prompt=disease)
    new_obj = Patient(
        user=user["id"], symptoms=symptoms.symptoms, doctor_specialty=response.response
    )
    print(" response from Doctor LLM : ")
    print(response.response)
    db.add(new_obj)
    db.commit()
    db.refresh(new_obj)
    return {"Doctor specality from doctor LLM: ", response.response}


# @router.post("/doctor_speciality2")
# async def predict_doctor_specality(disease: str):
#     prompt = f"I will give you a disease name , I want you to choose a appropriate doctor type for the disease, please just answer with doctor type, don't add any other sentences or words, The disease is {disease}"
#     response = client.generate(model=model2, prompt=prompt)
#     print(" response from medllama2 : ")
#     print(response.response)
#     return {"Doctor specality from medllama: ", response.response}
