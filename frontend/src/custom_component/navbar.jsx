import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
function CustomNavbar(){
const navigate=useNavigate()

  const onClick=()=>{

    localStorage.removeItem("token")
  navigate("/auth")
  }
    return(



      <Navbar expand="lg" style={{backgroundColor:"#0A2647"}} >
{/*          
          <FontAwesomeIcon icon={faHouse} color='white'/> */}
      <Container >
    
        <Navbar.Brand href="#" >
       
        <h2 id="navbar_title" onClick={()=>{navigate("/")}}>
        AI-Driven Care: From Symptoms to Solutions. </h2>
        
        </Navbar.Brand>
        
      
      <Button variant='light' id='logout_btn' onClick={onClick}>
      <h5> Logout </h5>
      </Button>
      {/* <FontAwesomeIcon icon={faRightFromBracket} />
       */}
      </Container>
    </Navbar>


 
)
}

export default CustomNavbar