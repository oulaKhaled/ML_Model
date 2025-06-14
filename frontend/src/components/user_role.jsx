import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faHouse } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import CustomNavbar from '../custom_component/navbar';
import { faBrain  } from '@fortawesome/free-solid-svg-icons';
import Dropdown from 'react-bootstrap/Dropdown';
import CustomizeButton from '../custom_component/button';
import CustomizeInputGroup from '../custom_component/input';
import CustomizeDropMenu from '../custom_component/dropMenu';
import '../App.css'
import { useNavigate } from 'react-router-dom';
import api from '../api';



export const token=localStorage.getItem("token");



function UserRole(){
const navigate=useNavigate();
const [open,setOpen]=useState(true);
const [disease,setDisease]=useState("");
const [doctor,setDoctor]=useState("");
const [error,setError]=useState(false);
const [sendrequest,getSendRequest]=useState(false);








const  features = [
    "itching",
    "skin_rash",
    "nodal_skin_eruptions",
    "dischromic _patches",
    "continuous_sneezing",
    "shivering",
    "chills",
    "watering_from_eyes",
    "stomach_pain",
    "acidity",
    "ulcers_on_tongue",
    "vomiting",
    "cough",
    "chest_pain",
    "yellowish_skin",
    "nausea",
    "loss_of_appetite",
    "abdominal_pain",
    "yellowing_of_eyes",
    "burning_micturition",
    "spotting_ urination",
    "passage_of_gases",
    "internal_itching",
    "indigestion",
    "muscle_wasting",
    "patches_in_throat",
    "high_fever",
    "extra_marital_contacts",
    "fatigue",
    "weight_loss",
    "restlessness",
    "lethargy",
    "irregular_sugar_level",
    "blurred_and_distorted_vision",
    "obesity",
    "excessive_hunger",
    "increased_appetite",
    "polyuria",
    "sunken_eyes",
    "dehydration",
    "diarrhoea",
    "breathlessness",
    "family_history",
    "mucoid_sputum",
    "headache",
    "dizziness",
    "loss_of_balance",
    "lack_of_concentration",
    "stiff_neck",
    "depression",
    "irritability",
    "visual_disturbances",
    "back_pain",
    "weakness_in_limbs",
    "neck_pain",
    "weakness_of_one_body_side",
    "altered_sensorium",
    "dark_urine",
    "sweating",
    "muscle_pain",
    "mild_fever",
    "swelled_lymph_nodes",
    "malaise",
    "red_spots_over_body",
    "joint_pain",
    "pain_behind_the_eyes",
    "constipation",
    "toxic_look_(typhos)",
    "belly_pain",
    "yellow_urine",
    "receiving_blood_transfusion",
    "receiving_unsterile_injections",
    "coma",
    "stomach_bleeding",
    "acute_liver_failure",
    "swelling_of_stomach",
    "distention_of_abdomen",
    "history_of_alcohol_consumption",
    "fluid_overload",
    "phlegm",
    "blood_in_sputum",
    "throat_irritation",
    "redness_of_eyes",
    "sinus_pressure",
    "runny_nose",
    "congestion",
    "loss_of_smell",
    "fast_heart_rate",
    "rusty_sputum",
    "pain_during_bowel_movements",
    "pain_in_anal_region",
    "bloody_stool",
    "irritation_in_anus",
    "cramps",
    "bruising",
    "swollen_legs",
    "swollen_blood_vessels",
    "prominent_veins_on_calf",
    "weight_gain",
    "cold_hands_and_feets",
    "mood_swings",
    "puffy_face_and_eyes",
    "enlarged_thyroid",
    "brittle_nails",
    "swollen_extremeties",
    "abnormal_menstruation",
    "muscle_weakness",
    "anxiety",
    "slurred_speech",
    "palpitations",
    "drying_and_tingling_lips",
    "knee_pain",
    "hip_joint_pain",
    "swelling_joints",
    "painful_walking",
    "movement_stiffness",
    "spinning_movements",
    "unsteadiness",
    "pus_filled_pimples",
    "blackheads",
    "scurring",
    "bladder_discomfort",
    "foul_smell_of urine",
    "continuous_feel_of_urine",
    "skin_peeling",
    "silver_like_dusting",
    "small_dents_in_nails",
    "inflammatory_nails",
    "blister",
    "red_sore_around_nose",
    "yellow_crust_ooze",
]
let new_f=[]

features.map((f)=>(
      new_f.push(f.replace(/_/g," "))
  ))


  // const [show, setShow] = useState(false);

// const [hover, sethover] = useState(false);
const[value,setValue]=useState("")

const location=useLocation()


const [show, setShow] = useState(false);
const symptoms=[]

const handleClose = () => setShow(false);
const handleShow = () => setShow(true);
const onChange=(event)=>{
  setValue(event.target.value);
  setOpen(true);

}
const onSearch=(searchItem)=>{

  const terms = value.split(",");
  terms[terms.length - 1] = " " + searchItem; // Replace only the last term
  const updatedValue = terms.join(",").trimStart(); // Join back to full input
  setValue(updatedValue);
// console.log(" Search Item ",searchItem);
// console.log("Value", value);




}



const onClickPredict=()=>{
// console.log(" All symptoms : ",value.split(","))

const symptoms_array=value.split(", ");


// for( let i=0;i<symptoms_array.length;i++){
//   console.log(symptoms_array[i]);

// }



let new_symptoms_array=[]
symptoms_array.map((f)=>{
  console.log("THİS IS F : ",f);
  // dataset exceptions
if(f.trim()=='dischromic  patches'){
 
 new_symptoms_array.push("dischromic _patches")
  }
  else if(f.trim()=='foul smell of urine'){
   
    
    new_symptoms_array.push("foul_smell_of urine")
  }
  else if(f=="spotting  urination"){
    new_symptoms_array.push("spotting_ urination")
  }
  else{
      new_symptoms_array.push(f.replace(/ /g,"_"))


  }
  

});
console.log("symptoms array after", new_symptoms_array);
// predict_doctor_sepeicality(new_symptoms_array)
if(location.state.role =="patient"){
predict_doctor_sepeicality(new_symptoms_array)

}
else{
  predict_disease(new_symptoms_array)
}

}




const predict_disease=async(symptoms)=>{
    
getSendRequest(true);
try{
  
const response=await api.post("/predict_disease",{
  "symptoms":symptoms},);
if(response.status==200){
  setError(false)
  console.log("Predicted Disease ", response.data);
  setDisease(response.data["Disease from main function "]);
 
  
  
}

}
catch(error){
getSendRequest(false);
setError(true)
  
  console.error(error)
};

}
const predict_doctor_sepeicality=async(symptoms)=>{
    getSendRequest(true);
  try{
  
  const response=await api.post("/doctor_speciality",{
    "symptoms":symptoms});
  
  if(response.status==200){
    
    console.log("Predicted Doctor Specielatiy ", response.data);
    setDoctor(response.data)
    
  }}
  catch(error){
    getSendRequest(false);
    setError(true)
    console.error(error)
  };
  
  }








return(



<div id="div_1">

<CustomNavbar/>
    <br/>
    
    <div >
    <div  style={{ position: "fixed", top: "100px", right: "20px", zIndex: 1000 }}>
 <h6><strong>info</strong></h6> <FontAwesomeIcon id='my_icon' icon={faCircleInfo} size="2x" onClick={handleShow} />
</div>    {/* onMouseOver={onHover} onMouseLeave={onLeave} */}


    </div>

    <div style={{ position: "fixed", top: "120px",left:"30px", zIndex: 1000 }}>
<FontAwesomeIcon onClick={()=>{
  navigate("/")
  
}} icon={faHouse} size="2x" />
</div>
 
    <h1 style={{padding:"20px"}} > How Do you feel today?</h1>
{/*****************************************  INPUT STYLE  *************************************/}
    
    { error?
    <h6 style={{color:"red"}}>The symptoms you've entered are not valid. Please select valid symptoms</h6>:
  <h6 style={{color:"red"}}> please add a comma after each symptom</h6>
    }
    
  
  
 <br/>
<CustomizeInputGroup value={value}   onChange={onChange}  style={{height:"60px"}} />

{/* <button onClick={()=>{console.log(value)}}> BUTTON </button> */}

{open && value.split(",").pop().trim() !== "" &&( 
<CustomizeDropMenu new_f={new_f}
  value={value}
  onSearch={onSearch}
  setOpen={setOpen}
/>
) 



}
{/***************************  END OF ML USER 1ST STYLE *******************************************/}






<CustomizeButton id="button3"

 onClick={onClickPredict} name= {location.state.role =="patient"? <h5 > predict Docotor specialist</h5>: <h5 > predict  Disease</h5> } />
<br/>
<br/>
<br/>


{
  location.state.role =="patient"? <>
  { doctor!=""?  
 <>

    <h4>You may need to see <strong style={{ color:"red"}}>{doctor}</strong></h4>
  
<br/>
<br/>
<br/>

<h4 onClick={()=>{navigator}}> Would you like to check what Disease you have?</h4>
 </>:
 <>
{sendrequest?

  <svg  viewBox="25 25 50 50" className="rotating-circle">
  <circle  id="my_circle"  r="20" cy="50" cx="50"></circle>
</svg>

:null}

</>

}</>:
<>

{disease && (
 <>

    <h4>You may have <strong style={{ color:"red"}}>{disease}</strong></h4>
  
<br/>
<br/>
<br/>

<h4 onClick={()=>{navigator}}>if you would like to check which doctor to see click here</h4>
 </>
  
  
  
)}



  </>
}






<br/>



 <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title   >  <FontAwesomeIcon icon={faBrain}   /> Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {location.state.role =="patient"? <>
          <h5 style={{color:"#261FB3"}} >
  Not sure which doctor to see? Just tell us your symptoms, 
  and we’ll guide you to the right specialist.</h5><h5  >
  Our system uses machine learning to analyze your input and match you with the most suitable medical 
  specialty — so you can get the right care, faster</h5>

        </>:
       <>
       <h5>
       Wondering what your symptoms might mean?
This tool helps you predict possible diseases based on the symptoms you provide.</h5><h5>
Powered by machine learning, it analyzes your input to offer a list of likely conditions — giving you helpful insights before visiting a doctor.</h5>
<h5 style={{color:"red"}}>Note: This is not a medical diagnosis, but a smart guide to better understand your health.</h5>
        


       </>
         } 
     

        </Modal.Body>
        <Modal.Footer>
         
         
        </Modal.Footer>
      </Modal>


{/* {hover ? <div style={{position:"absolute", left:1000}}>
  <p >
  Not sure which doctor to see? Just tell us your symptoms, 
  and we’ll guide you to the right specialist.</p><p >
  . Our system uses machine learning to analyze your input and match you with the most suitable medical </p>
 <p > specialty — so you can get the right care, faster</p>
</div>:null} */}

</div>
)
}


export default UserRole

