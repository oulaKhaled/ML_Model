import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

function CustomizeSelectOption(props){
    return(
        <div style={{marginLeft:"70px",marginRight:"70px",marginTop:"10px"}} >
  <InputGroup size="lg" className="mb-3"  >

          <InputGroup.Text id="inputGroup-sizing-sm" style={{ width: "110px",height:"50px" }}><h5>Algorithm </h5></InputGroup.Text>
          <Form.Group as={Col} controlId="formGridState" >
            <Form.Select style={{ height: "50px", borderColor: "red", borderWidth: "2px" }} 
            value={props.algorithm}
            onChange={props.onChange}
            >
              <option>Select Algorithm</option>
              <option value="decisiontree">Decision Tree</option>
              <option value="randomforest">Random forest</option>
              <option value="logisticregression">Logistic Regression</option>
              <option value="svm">SVM</option>
              <option value="knn">KNN</option>
              
            

            </Form.Select>
          </Form.Group>


         
        </InputGroup>
        </div>

    )



}
export default CustomizeSelectOption