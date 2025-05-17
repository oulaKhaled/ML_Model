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

function Ml_user() {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const [show3, setShow3] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
   const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);
  

  const [dataset,setDataset]=useState([]);
  const[algorithm,setAlogorithm]=useState("");
  const[target,setTarget]=useState("");
  const [select,setSelect]=useState("");
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
      {  headers:{"Authorization":`Bearer ${token}`}
    }
    
  );
  if(response.status==200){
    console.log("response : ",response.data["The new model has been saved successfully"]);
    SetshowResult(true);
    setResult(response.data["The new model has been saved successfully"]);
    console.log("data features",response.data["The new model has been saved successfully"][3]);

    
  
  
  }
    else{
      console.log("something went wrong ,",response.status);
      
    }
    }
   
    catch(error){
      console.log(error);
      
    }
    
  }
  



  const getUserModels=async()=>{
    try{
      const response=await api.get("/user_model",{  
headers: {"Authorization" : `Bearer ${token}`}});
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
        <div style={{ padding:40,display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>

<br/>
{
   showResult ?
   <div>
   <h5> you model is trained Successfully </h5>
    <p>accuracy : {result[0]}</p>
    <p>F1 Score : {result[1]}</p>
    <p> Cross validation Score : {result[2]}</p>
    
    
    </div>
  
  : dataset.length!==0 && algorithm!== "" && target!=="" && select!=="" ?
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



{/* <button onClick={handleShow2}>Show  SECONED Modal</button> */}

      <div style={{ position: "fixed", top: "100px", right: "20px", zIndex: 1000 }}>
  <FontAwesomeIcon icon={faCircleInfo} size="2x" onClick={handleShow} />
</div>
<h1  > ML user </h1>

   <h5  >Would you Like upload a dataset to predict a spesific Target?</h5>

<br/>


{/* <div style={{padding:"100px"}}>


</div>   */}
<CustomizeInputGroup text="Dataset" type="file"  onChange= {(event)=>setDataset(event.target.files[0])}   style={{ borderColor: "red", borderWidth: "2px"}} />
<CustomizeSelectOption onChange={(event)=>
              setAlogorithm(event.target.value)
            } value={algorithm}/>
<CustomizeInputGroup text="Target"  type="text" onChange={(event)=>setTarget(event.target.value)} value={target}  style={{ borderColor: "red", borderWidth: "2px"}} />
<CustomizeInputGroup text="Select"  type="text" onChange={(event)=>setSelect(event.target.value)} value={select}  style={{ borderColor: "red", borderWidth: "2px"}} />
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