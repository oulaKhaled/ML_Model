import { useState,useEffect } from "react";
import Dropdown from 'react-bootstrap/Dropdown';

function CustomizeDropMenu(props){

   return(
<div style={{marginLeft:"70px",marginRight:"70px"}}>

<Dropdown.Menu show style={{width:"100%",position:"relative",bottom:"0px"}} >

{ 
  props.new_f.filter(item => {
    
const terms = props.value.split(","); 
const lastTerm = terms[terms.length - 1].trim().toLowerCase(); 
const symptom = item.toLowerCase();

return lastTerm && (symptom.startsWith(lastTerm) || symptom.startsWith(lastTerm));
})
.map((f)=>(
<div>
<Dropdown.Item  style={{cursor:"pointer",textAlign:"start",margin:"2px 0"}} 
onClick={()=>{
  props.onSearch(f);
   props.setOpen(false)}}><h5>{f}</h5></Dropdown.Item>

</div>
))


}


</Dropdown.Menu>

   </div>
   
   
   
   )
   
}

export default CustomizeDropMenu