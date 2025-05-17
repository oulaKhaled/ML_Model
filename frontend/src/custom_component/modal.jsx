import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
import { useState } from 'react';
import api from '../api';
import Form from 'react-bootstrap/Form';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { token } from '../components/user_role';
function CustomizedModel(prop){
const [show4, setShow4] = useState(false);
const handleClose4 = () => setShow4(false);
const handleShow4 = () => setShow4(true);
const [features,setFeatures]=useState([]);
const [data,getData]=useState([]);
 const[Id,getId]=useState("");  

// const get_data_features=async()=>{
//     try{
//         const response=await api.get("/data_features"
//             {}
//         )
//     }
// }

// const HandelClick=()=>{
// prop.handleClose3()
// handleShow4()



// }

const handleCheckboxChange = (e, value) => {
  if (e.target.checked) {
    getData(prev => [...prev, value]); // ✅ Add if checked
  } else {
    getData(prev => prev.filter(item => item !== value)); // ❌ Remove if unchecked
  }
};



const delete_model= async(id)=>{
console.log("id : ",id);

  try{
    const response= await api.delete("/delete_model",{
      headers:{"Authorization":`Bearer ${token}`},
      params: {
        model_id: id, // ✅ as query parameter
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
  try{
    const response=await api.post("/predict_using_trained_model",data,{
      headers:{"Authorization":`Bearer ${token}`},
      params: {
        trained_model_id: id, // ✅ as query parameter
      }});
      if(response.status==200){
        console.log("prediction sent successfully :" ,response.data);
        
      }

  }
  catch(error){
    console.log(error);
    
  }


}



return(
        
<>

{/* FIRST  MODAL  */}

<Modal show={prop.show3} onHide={prop.handleClose3} >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body  >

 { 
  prop.trainedModels.length >1?
      (() => {
        const output = [];
        // Example trainedModels array
        for (let i = 0; i <  prop.trainedModels.length; i += 6) {
          output.push(
                
            <div key={i} style={{ marginBottom: '20px' }} className='row'>

          
             <h2>Model</h2>
              
              { prop.trainedModels.slice(i, i + 6).map((item, idx) => (
                <div  className='col-7'>
             
                { idx==5? <h5 onClick={()=>{
                  prop.handleClose3();
                    setFeatures(item);
                handleShow4();
                console.log(item);
                getId(prop.trainedModels[i]);
                
                }} style={{color:"#134B70"}}> Click here to use this model</h5>:
                idx==1?
                <h6 key={idx} > Algorithm:&nbsp;&nbsp;&nbsp;{item}</h6>:
             idx==2? <h6>Dataset:&nbsp;&nbsp;;&nbsp;{item}</h6>:
             
             idx==3?<h6>Target: &nbsp;&nbsp;&nbsp;{item}</h6>:
              idx==4?
             <h6> Accuracy:&nbsp;&nbsp;&nbsp;{item}</h6> : null
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
        <Modal.Footer>
<Button onClick={ prop.handleClose3} style={{ backgroundColor:"#FF7B7B"}}><h5>Ok</h5></Button>

        </Modal.Footer>
      </Modal>

{/* SECONED MODAL for data features  */}

<Modal show={show4} onHide={handleClose4}  size='xl' >
 
 <Modal.Header closeButton>
<FontAwesomeIcon icon={faArrowLeft} size='lg' onClick={()=>{ 
  handleClose4()
prop.handleShow3()}}/>
        </Modal.Header>
        <Modal.Body >
        
        <h4 style={{color:"#BE5B50"}}> Choose your data inputs — the model will use them to make predictions. </h4>
      <div style={{
    display: 'grid',
     gridTemplateColumns: 'repeat(4, 1fr)',

  }} > 
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
}} > Send </Button>
       



        </Modal.Body>


</Modal>
      </>


    )
}
export default CustomizedModel