import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
function CustomNavbar(){
const navigate=useNavigate()

  const onClick=()=>{

    localStorage.removeItem("token")
  navigate("/auth")
  }
    return(



      <Navbar expand="lg" style={{backgroundColor:"#0A2647"}} >
      <Container >
        <Navbar.Brand href="#"><h2 id="navbar_title" onClick={()=>{navigate("/")}}>AI-Driven Care: From Symptoms to Solutions.</h2></Navbar.Brand>
      
      <Button variant='light' style={{alignItems:"center"}} onClick={onClick}>
      <h5 > Logout </h5>
      </Button>
      {/* <FontAwesomeIcon icon={faRightFromBracket} />
       */}
      </Container>
    </Navbar>


    //     <Container style={{paddingLeft:"0px", paddingRight:"0px", width:"100%"}}>
    //   <Navbar expand="lg" style={{"height":"70px"}}  className="bg-body-tertiary" >
    //     <Container >
       
    // {/* <Navbar.Brand href="#" >AI-Powered Health Navigation Starts Here</Navbar.Brand> */}
    // <Navbar.Brand href="#"  ><h2 >AI-Driven Care: From Symptoms to Solutions.</h2></Navbar.Brand>
    // <div style={{marginTop:"20px"}}>
    // <FontAwesomeIcon  icon={faUser} />  
    
    // <h6 > Username</h6>
    
    // </div>
    //     </Container>
    //   </Navbar>
    // </Container>

)
}

export default CustomNavbar