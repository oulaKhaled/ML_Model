import InputGroup from 'react-bootstrap/InputGroup';

import Form from 'react-bootstrap/Form';

function CustomizeInputGroup(props){

    
    return( 
        
        
        // style={{ paddingBottom:"30px",paddingTop:"30px",paddingLeft:"20px",paddingRight:"20px"}}
<div style={{marginLeft:"70px",marginRight:"70px",marginTop:"10px"}}>
        <InputGroup size="lg" className="mb-3"  >
        
                  <InputGroup.Text id="inputGroup-sizing-sm" >{props.text}</InputGroup.Text>
                  <Form.Control
                  accept={props.accept}
                    type={props.type}
                    style={props.style}
                   value={props.value}  
                      onChange={props.onChange}
        
                  //   style={{borderColor:"red", borderWidth:"2px"}}
                  />
                </InputGroup>
                </div>
                )



}



export default CustomizeInputGroup








