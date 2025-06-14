import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
import  '../App.css'
import { useEffect, useState } from 'react';
import api from '../api';
import Form from 'react-bootstrap/Form';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function CustomizedModel(prop){
const [show4, setShow4] = useState(false);
const handleClose4 = () => setShow4(false);
const handleShow4 = () => setShow4(true);
const [show5, setShow5] = useState(false);
const handleClose5 = () => setShow5(false);
const handleShow5 = () => setShow5(true);
const [features,setFeatures]=useState([]);
const [data,getData]=useState([]);
 const[Id,getId]=useState(""); 
 const[prediction,setPrediction] =useState("");
 const[error,setError]=useState(false)


const handleCheckboxChange = (e, value) => {
  if (e.target.checked) {
    getData(prev => [...prev, value]); 
  } else {
    getData(prev => prev.filter(item => item !== value)); 
  }
};

// useEffect(()=>{
// setPrediction("");
// },[predict_model])

const delete_model= async(id)=>{
console.log("id : ",id);

  try{
    const response= await api.delete("/delete_model",{
      params: {
        model_id: id, 
      }});
    if(response.status==200){
      console.log("model deleted sucesssfully");
      prop.getuserModel()
    }
    else{
      console.log("Something went wrong");
      
    }
  }
  catch(error){
    console.log(error)
  }

}

const predict_model=async(id)=>{
  console.log("THİS İS SENDED DATA ",data);
  
  try{
    const response=await api.post("/predict_using_trained_model",data,{
      params: {
        trained_model_id: id, 
      }});
      if(response.status==200){
        console.log("prediction sent successfully :" ,response.data);
        setPrediction(response.data);
        setError(false);
    
        
      }

  }
  catch(error){
    setError(true)
    console.log(error);
 
    
  }


}



return(
        
<>

{/* FIRST  MODAL  */}

<Modal show={prop.show3} onHide={prop.handleClose3}  >
        <Modal.Header closeButton style={{backgroundColor:"white"}}>
        </Modal.Header>
        <Modal.Body style={{backgroundColor:"white"}} >
        {/* <h4>You’ve previously trained this models</h4> */}
{/* <hr/> */}

 { 
  prop.trainedModels.length >1?
      (() => {
        const output = [];
        // Example trainedModels array
        for (let i = 0; i <  prop.trainedModels.length; i += 6) {
          output.push(
                
            <div key={i} style={{ marginBottom: '20px' }} className='row'>
             
             {/* <h2>Model {i}</h2> */}
              
              
              { prop.trainedModels.slice(i, i + 6).map((item, idx) => (
                <div  className='col-7'>
          
                { idx==0? <h4 style={{color:"#261FB3"}}>Trained Model #{item}</h4>: idx==5? <h5  id="new" onClick={()=>{
                  prop.handleClose3();
                    setFeatures(item);
                handleShow4();
                console.log(item);
                getId(prop.trainedModels[i]);
                
                }} style={{color:"#344CB7"}}> use this model</h5>:
                idx==1?
                <div  style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr"}}>
        <h5  key={idx} style={{color:"#16610E"}} > Algorithm </h5>
        <h5  > :&nbsp;&nbsp;&nbsp;{item}</h5>
                </div>
                :
             idx==2? 
                <div  style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr"}}>
        <h5  key={idx} style={{color:"#16610E"}} > Dataset </h5>
        <h5 > :&nbsp;&nbsp;&nbsp;{item}</h5>
                </div>:
         
             
             idx==3?       <div  style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr"}}>
        <h5  key={idx} style={{color:"#16610E"}} > Target </h5>
        <h5 > :&nbsp;&nbsp;&nbsp;{item}</h5>
                </div>:
              idx==4?
                    <div  style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr"}}>
        <h5  key={idx} style={{color:"#16610E"}} > Accuracy </h5>
        <h5 > :&nbsp;&nbsp;&nbsp;{item}</h5>
                </div> :null
                }
                {/* <p key={idx}>{item}</p> */}
            
    
</div>
              ))}
<FontAwesomeIcon icon={faTrash} size='xl' color="#BF3131" className='col' onClick={
  ()=>{
 delete_model(prop.trainedModels[i]);
  }
  
 } />
              {/* <h5 style={{color:"red"}}>click to delete this model</h5> */}
               
             
               

         
        <hr/>
          
            </div>
          );
        }
        return output;
      })():<h5> You Haven't trained any model before yet</h5>
    }
        

        </Modal.Body>
        <Modal.Footer style={{backgroundColor:"white"}}>
<Button onClick={ prop.handleClose3} style={{ backgroundColor:"#FF7B7B"}}><h5>Ok</h5></Button>

        </Modal.Footer>
      </Modal>

{/* SECONED MODAL for data features  */}

<Modal show={show4} onHide={handleClose4} size='lg' >
 
 <Modal.Header closeButton style={{backgroundColor:"white"}}>
<FontAwesomeIcon icon={faArrowLeft} size='lg' onClick={()=>{ 
  handleClose4()
prop.handleShow3()}}/>
        </Modal.Header>
        <Modal.Body  style={{backgroundColor:"white"}}>
        
        <h4 style={{color:"#BE5B50"}}> Choose your data inputs — the model will use them to make predictions. </h4>
      <div id="datafeature" >  
  
   {features.map((f, i) => {
   return <Form.Check // prettier-ignore
            value={data}
            onChange={(e)=>{handleCheckboxChange(e,f)}}
            type="checkbox"
            id="checkbox"
            label=<h6 style={{color:"#201E43"}
            }>{f}</h6>

          />

       
})}
</div>

<br/>
<Button variant="danger" style={{width:"100px"}} onClick={()=>{

predict_model(Id);
handleShow5()
//  getData([])
}} > Send </Button>
       

{/* {prediction!=""?
  
    <p>{prediction}</p>

  :null
} */}

        </Modal.Body>


</Modal>


{/********  THIRD MODAL FOR GETTING PREDICTION **************/}

<Modal onHide={handleClose5} show={show5} >
<Modal.Header   style={{backgroundColor:"#E8F9FF"}} closeButton> <h4 style={{color:"#123458"}}>Prediction</h4></Modal.Header>

<Modal.Body  style={{backgroundColor:"#E8F9FF"}}>
{ error?<>
<h6 style={{color:"red"}}>Something went wrong. The model received too much or no data. Please check your input and try again.</h6>

</>:<>
<h5 > {prediction}
</h5>
 <p style={{color:"green"}}>  (Model prediction received successfully) </p>
 

</>}

</Modal.Body>
<Modal.Footer   style={{backgroundColor:"#E8F9FF"}}>
    <Button  style={{backgroundColor:"#FF7B7B"}}  onClick={handleClose5}>Ok</Button>

</Modal.Footer>
</Modal>

      </>


    )
}
export default CustomizedModel

