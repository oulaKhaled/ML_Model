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
function Ml_user() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [hover, sethover] = useState(false);
  const [dataset,setDataset]=useState(null)
  const[algorithm,setAlogorithm]=useState("")
  const[target,setTarget]=useState("")
  const [select,setSelect]=useState("")
  const onHover = () => {
    sethover(true)
  }

  const onLeave = () => {
    sethover(false)
  }

  const train_model=async()=>{
    const formData= new FormData();
    formData.append("dataset",dataset)
    formData.append("select",select)
    formData.append("algorithm",algorithm)
    formData.append("target",target)
   
  //  const formDetails3=new URLSearchParams();
  //   formDetails3.append("select",select)
  //   formDetails3.append("algorithm",algorithm)
  //   formDetails3.append("target",target)
  //   formDetails3.append("dataset",dataset)
    
    
    
    try{
      const response=await api.post("/train_model",formData,
      {  headers:{"Authorization":`Bearer ${token}`}
    }
    
  );
  if(response.status==200){
    console.log("response : ",response.data);}
    else{
      console.log("something went wrong ,",response.status);
      
    }
    }
   
    catch(error){
      console.log(error);
      
    }
    
  }
  



  return (
    <div id="div_1">
      <CustomNavbar />
      <br />

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





      <div style={{ position: "fixed", top: "100px", right: "20px", zIndex: 1000 }}>
  <FontAwesomeIcon icon={faCircleInfo} size="2x" onClick={handleShow} />
</div>
<h1  > ML user </h1>

   <h5  >Would you Like upload a dataset to predict a spesific Target?</h5>

<br/>


{/* <div style={{padding:"100px"}}>


</div>   */}
<CustomizeInputGroup text="Dataset" type="file" onChange= {(event)=>[setDataset(event.target.files[0])]} value={dataset} style={{ borderColor: "red", borderWidth: "2px"}} />
<CustomizeInputGroup text="Algorithm" onChange= {(event)=>[setAlogorithm(event.target.files[0])]} value={algorithm}   style={{ borderColor: "red", borderWidth: "2px"}} 

/>

<CustomizeInputGroup text="Target"  type="text" onChange= {(event)=>[setTarget(event.target.files[0])]} value={target}  style={{ borderColor: "red", borderWidth: "2px"}} />
<CustomizeInputGroup text="Select"  type="text" onChange= {(event)=>[setSelect(event.target.files[0])]} value={select}  style={{ borderColor: "red", borderWidth: "2px"}} />
  
   

      {/* <div style={{ paddingTop: "90px", display: "grid", gridTemplateColumns: '1fr 1fr', paddingLeft:"240px"}} >
        <InputGroup size="lg" className="mb-3" style={{ width: "480px" ,paddingBottom:"30px"}}
         value={dataset}
            onChange={(event)=>[
              setDataset(event.target.files[0])
            
            ]}
 >

          <InputGroup.Text id="inputGroup-sizing-sm" ><h5>dataset</h5> </InputGroup.Text>
          <Form.Control
            type='file'
            style={{ borderColor: "red", borderWidth: "2px" }}
           

          //   style={{borderColor:"red", borderWidth:"2px"}}
          />
        </InputGroup>
        <InputGroup size="lg" className="mb-3" style={{ width: "480px" }} >

          <InputGroup.Text id="inputGroup-sizing-sm" style={{ width: "110px",height:"50px" }}><h5>Algorithm </h5></InputGroup.Text>
          <Form.Group as={Col} controlId="formGridState" >
            <Form.Select style={{ height: "50px", borderColor: "red", borderWidth: "2px" }} 
            value={algorithm}
            onChange={(event)=>{
              setAlogorithm(event.target.value);
            }}
            >
              <option><h3>KNN </h3></option>
              <option>Decision Tree</option>
              <option>Random forest</option>
              <option>Logistic regression</option>
              <option>SVM</option>
            

            </Form.Select>
          </Form.Group>


         <Form.Control
    type='form-select'
    aria-label="Small"
    aria-describedby="inputGroup-sizing-sm"
    style={{borderColor:"red", borderWidth:"2px"}}
  /> 
        </InputGroup>
        <InputGroup size="lg" className="mb-3" style={{ width: "480px" }} >

          <InputGroup.Text id="inputGroup-sizing-sm" style={{ width: "100px", }}><h5>Target </h5></InputGroup.Text>

          <Form.Control

            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
            style={{ borderColor: "red", borderWidth: "2px" }}
            value={target}
            onChange={(event)=>{
              setTarget(event.target.value);
            }}
          />
        </InputGroup>
        <InputGroup size="lg" className="mb-3" style={{ width: "480px" }} >

<InputGroup.Text id="inputGroup-sizing-sm" style={{ width: "100px", }}><h5>Select </h5></InputGroup.Text>

<Form.Control

  aria-label="Small"
  aria-describedby="inputGroup-sizing-sm"
  style={{ borderColor: "red", borderWidth: "2px" }}
  value={select}
  onChange={(event)=>{
    setSelect(event.target.value);
  }}
/>
</InputGroup>
      </div> */}

      {/* <Button id="button3" style={{ position: "absolute", left: 50, bottom: 50, }} ><h4 >  I've already trained Model before</h4></Button>
      <Button id="button3" style={{ position: "absolute", right: 50, bottom: 50 }} 
      onClick={()=>{
    
        train_model()
      }}
      
      ><h4 >Predict</h4></Button> */}
    
      <CustomizeButton className="col-sm-4" id="button3" name="predict"  style={{marginRight:"40px" }}/>
      <CustomizeButton  className="col-sm-4" id="button3" name="select model that trained before" style={{marginLeft:"40px" }}/>

   </div>

  )
}
export default Ml_user