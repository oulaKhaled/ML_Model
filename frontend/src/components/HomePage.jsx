import  '../App.css'
import "../index.css"
import Button from 'react-bootstrap/Button';
import { useNavigate} from "react-router-dom";
import CustomNavbar from '../custom_component/navbar';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import CustomizeButton from '../custom_component/button';
import { useEffect } from 'react';
import Footer from '../custom_component/footer';

function HomePage(){
// const history = useHistory();
const navigate = useNavigate();
// only for deployment
// useEffect(()=>{

//  const token= localStorage.getItem("token")
// if(token==null){

//   navigate("/auth")

// }

// },[])



function handleClickDoctor() {
  navigate("/user_role",{state:{role:"doctor"}, });

  }

  function handleClickMl_user() {
      navigate("/ml_user");
  
    }

    function handleClickPatient() {
        navigate("/user_role",{state:{role:"patient"}});
    
      }
  return(
        // id="homepage" 
    <div   >
     <CustomNavbar/>
  
 {/* style={{"padding":"40px"}}
  */}
  <div id="new_homepage" >
    <h1  id="homepage_title">Welcome – Let’s Take Care of You.</h1>
    <br/>
   
    
    <h3> Get started by choosing your role.</h3>

     <div  className='row' style={{justifyContent:"center"}}>
     <CustomizeButton id="button2" name=<h3>Disease</h3> onClick={handleClickDoctor}/>
     <CustomizeButton id="button2" name=<h3>Doctor Speciality</h3> onClick={handleClickPatient}/>
     <CustomizeButton id="button2" name=<h3>ML User</h3> onClick={handleClickMl_user}/>
     </div>
   

</div>
<Footer top={216}/>
    </div>
)

}

export default HomePage