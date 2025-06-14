import '../App.css'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react';
import Col from 'react-bootstrap/Col';
import CustomNavbar from '../custom_component/navbar';
import Modal from 'react-bootstrap/Modal';
import { faBrain } from '@fortawesome/free-solid-svg-icons';
import { data } from 'react-router-dom';
import api from '../api';
import CustomizeInputGroup from '../custom_component/input';
import { token } from './user_role';
import CustomizeButton from '../custom_component/button';
import CustomizeSelectOption from '../custom_component/option';
import CustomizedModel from '../custom_component/modal';
import { faCircleDot } from '@fortawesome/free-solid-svg-icons';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
const options1=[
   { value: "decisiontree", label: "Decision Tree" },
    { value: "randomforest", label: "Random forest" },
    { value: "logisticregression", label: "Logistic Regression" },
    { value: "svm", label: "SVM" },
    { value: "knn", label: "KNN" },
    ]
const options2=[
   { value: "first", label: "One Hot Encoding" },
    { value: "second", label: "Label Encoding" },
    ]
function Ml_user() {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);

const navigate=useNavigate();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
   const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);
     const handleClose4 = () => setShow4(false);
  const handleShow4 = () => setShow4(true);

  const [dataset,setDataset]=useState([]);
  const[algorithm,setAlogorithm]=useState(options1[0].value);
  const[target,setTarget]=useState("");
  const [select,setSelect]=useState(options2[0].value);
  const [showResult,SetshowResult]=useState(false);
  const [result,setResult]=useState([])
  const [trainedModels,getTrainedModels]=useState([])
  

  
  
  
  const train_model=async()=>{
    const formData= new FormData();
    formData.append("dataset",dataset)
    formData.append("select",select)
    formData.append("algorithm",algorithm)
    formData.append("target",target)
    try{
      const response=await api.post("/train_model",formData,
    
  );
  if(response.status==200){
    console.log("response : ",response.data["The new model has been saved successfully"]);
    SetshowResult(true);
    setResult(response.data["The new model has been saved successfully"]);
    console.log("data features",response.data["The new model has been saved successfully"][3]);

    
  
  
  }

    else{
      console.log("something went wrong ,",response.status);
      SetshowResult(false);
    }
    }
   
    catch(error){
      console.log(error);
      
    }
    
  }
  



  const getUserModels=async()=>{
    try{
      const response=await api.get("/user_model",);
if(response.status==200){
  console.log("Here is models that you trained before",response.data);
  getTrainedModels(response.data)
}
else{
  console.log("Something went wrong");
  
}
    }
    catch(error){
      console.error(error)
    }
   

  }

// let x=4
// for (let i=0;i<(trainedModels.length()/4);i++){
//   for(let j=x;j<x+4;j++){
//     <p>{trainedModels[j]}</p>
//   }
//   x=x+4
// }


  return (
    <div id="div_1">
      <CustomNavbar />
      <br />
      <div style={{ position: "fixed", top: "120px",left:"30px", zIndex: 1000 }}>
      <FontAwesomeIcon onClick={()=>{
        navigate("/")
        
      }} icon={faHouse} size="2x" />
      </div>
      
{/******************* * FIRST MODAL (info) ************************/}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title   >  <FontAwesomeIcon icon={faBrain} /> Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 style={{ color: "#261FB3" }} >
            This section is designed for machine learning users who want to experiment with their own datasets.</h5>
          <h5 >
            Upload your custom dataset, select your target column, and choose a machine learning algorithm from the available options.</h5>
          <h5>Our system will train a model on your data and provide predictions, metrics, and visual feedback — all within a few clicks.</h5>
          <h5  >Whether you're testing a classification task or exploring regression models, this tool helps you streamline the ML workflow without writing a single line of code</h5>

        </Modal.Body>
        <Modal.Footer>


        </Modal.Footer>
      </Modal>

{/************************* SECONED MODAL (get trained model results) ****************************/}

   <Modal show={show2} onHide={handleClose2} >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body  >
        <div style={{ padding:10,display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>

<br/>
{
   showResult ?
   <div>
   <h4 style={{color: "#1F7D53"}}> Model training completed successfully! </h4>
   <br/>
   <h6> <strong style={{color: "#7D0A0A"}}>Accuracy</strong> : {result[0]}</h6>
    <br/>

    <h6 ><strong style={{color: "#7D0A0A"}}>F1 Score</strong> :  {result[1]}</h6>
    <br/>
    
    <h6 ><strong style={{color: "#7D0A0A"}}> Cross validation Score</strong> :  {result[2]}</h6>
    
    
    </div>
  
  : dataset.length!==0 && algorithm!== "" && target!=="" && select!==""?
  <div>
<h5> Please Wait , Your model is training now </h5>

  <svg  viewBox="25 25 50 50" className="rotating-circle">
  <circle  id="my_circle"  r="20" cy="50" cx="50"></circle>
</svg>
  </div> :<div><h5 style={{color:"red"}}>Please Enter all fileds</h5></div>  

}

</div>
        </Modal.Body>
        <Modal.Footer>
<Button onClick={handleClose2} style={{ backgroundColor:"#FF7B7B"}}><h5>Ok</h5></Button>

        </Modal.Footer>
      </Modal>

{/* ***********************THIRD MODAL (show user History)************************ */}
<CustomizedModel 
show3={show3} 
handleClose3={handleClose3} 
trainedModels={trainedModels}
handleShow3={handleShow3}
getuserModel={getUserModels}
/>
{/******************* * FOURTH MODAL ( Dataset info) ************************/}

      <Modal show={show4} onHide={handleClose4}>
        <Modal.Header closeButton>
          <Modal.Title   >  ⚠️ Important Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>


        <h6 style={{color:"#A31D1D"}}>This tool is designed for 
        experimentation using clean, symptom-based datasets that follow a specific structure 
        (like the one provided). While you are allowed to upload any dataset, </h6>


<h6><strong style={{color:"#A31D1D"}}>Please note:</strong></h6>
<h6  style={{color:"#003092"}}><strong >If your dataset does not meet the required format and structure, the results may be inaccurate, misleading, or entirely invalid.</strong> </h6>
<h6 style={{color:"#003092"}}>This tool is not intended for real-world use or critical decision-making. Any predictions made using datasets that do not follow the recommended format should not be taken seriously, and this project holds no responsibility for such results.. </h6>   
<br/>
<h4>Required Format</h4>
<h6 style={{color:"green"}}><strong>Your dataset should be a CSV file.</strong></h6>
<h6>It must include:</h6>

<h6> <FontAwesomeIcon size='xs' icon={faCircleDot} style={{color:"red"}}/> One column named (or acting as) Disease – the target variable.</h6>
<h6> <FontAwesomeIcon  size='xs' icon={faCircleDot} style={{color:"red"}}/> Several columns named like Symptom_1, Symptom_2, ..., Symptom_17, each representing a symptom.</h6>
<h6> <FontAwesomeIcon size='xs' icon={faCircleDot} style={{color:"red"}} /> All values must be in text format (categorical), even if they are null/missing in some rows.</h6>
<h6> <FontAwesomeIcon  size='xs' icon={faCircleDot} style={{color:"red"}} /> A maximum of 17 symptom columns is expected. Missing symptom columns should be filled with empty values (NaN).</h6>
<br/>  
{/* <h6   style={{color:"#A31D1D"}}>To ensure meaningful outcomes, please use properly structured, labeled, and preprocessed data as outlined in the dataset guidelines.
</h6>       */}
{/* <h5  style={{color:"red"}}>Important </h5> */}

  
        
        </Modal.Body>
        <Modal.Footer>


        </Modal.Footer>
      </Modal>




{/* <button onClick={handleShow2}>Show  SECONED Modal</button> */}

      <div style={{ position: "fixed", top: "90px", right: "20px", zIndex: 1000 }}>
 <h6><strong>info</strong> </h6><FontAwesomeIcon icon={faCircleInfo} size="2x" onClick={handleShow} />
</div>
<h1  > ML user </h1>

   <h5  >Would you Like upload a dataset to predict a spesific Target?</h5>

<br/>


{/* <div style={{padding:"100px"}}>


</div>   */}
{/* A31D1D */}

 <p style={{color:"red",fontWeight:"bolder"}} onClick={handleShow4}><FontAwesomeIcon  icon={faCircleInfo}  style={{color:"red"}} />  Before uploading Dataset, click here to check requirements    </p>  
<CustomizeInputGroup  text=<h5 style={{marginRight:"15px"}}>Dataset</h5>  className="col" type="file"  onChange= {(event)=>setDataset(event.target.files[0])}   style={{ borderColor: "red", borderWidth: "2px",borderRadius:"7px"}} />
<CustomizeSelectOption 
text=<h5>Algorithm</h5>
inputTextStyle={{ width: "120px",height:"50px" }}


onChange={(event)=>
              setAlogorithm(event.target.value)
            } value={algorithm}
options={options1} />
<CustomizeInputGroup text=<h5 style={{marginRight:"10px",marginLeft:"13px"}}>Target</h5>  type="text" onChange={(event)=>setTarget(event.target.value)} value={target}  style={{ borderColor: "red", borderWidth: "2px",borderRadius:"7px"}} />


<CustomizeSelectOption 
text=<h5 >Encoding<h5> Method</h5></h5>
onChange={(event)=>
              setSelect(event.target.value)
            } value={select}

options={options2}
inputTextStyle={{ width: "120px",height:"50px" ,paddingTop:"20px"}}

/>





<CustomizeButton onClick={()=>{
        console.log(dataset,algorithm,select,target); 
        handleShow2()
        train_model()
      
        }} className="col-sm-4" id="button3" name=<h4>Train</h4>  style={{marginRight:"40px"}}/>
<CustomizeButton onClick={()=>{
  handleShow3()
  getUserModels()}} className="col-sm-4" id="button3" name=<h5>select model that trained before</h5> style={{marginLeft:"40px" }}/>

   </div>

  )
}
export default Ml_user