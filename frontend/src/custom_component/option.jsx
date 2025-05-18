import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

function CustomizeSelectOption(props){
    return(
        <div style={{marginLeft:"70px",marginRight:"70px",marginTop:"10px"}} >
  <InputGroup size="lg" className="mb-3"  >

          <InputGroup.Text id="inputGroup-sizing-sm" style={props.inputTextStyle}>{props.text}</InputGroup.Text>
          <Form.Group as={Col} controlId="formGridState" >
            <Form.Select style={{ height: "50px", borderColor: "red", borderWidth: "2px" ,borderRadius:"1px"}} 
            value={props.value  || props.options[0]?.value}
            onChange={props.onChange}
            
            >
              {/* <option>Select Algorithm</option> */}


{

props.options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))
      
     
      }
    
            

            </Form.Select>
          </Form.Group>


         
        </InputGroup>
        </div>

  )



}
export default CustomizeSelectOption