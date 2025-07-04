import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CustomNavbar from '../custom_component/navbar';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { data, useNavigate} from "react-router-dom";
import { useState } from 'react';
import api from '../api';
import CustomizeInputGroup from '../custom_component/input';
import Footer from '../custom_component/footer';
function Auth(){

const [account,setAccount]=useState(true)
const[username,setUsername]=useState("");
const [password,setPassword]=useState("");
const [email,setEmail]=useState("");
const [confirmPassword,setConfirmPassword]=useState("")
const [error,setError]=useState("");
const navigate=useNavigate()
const Login=async ()=>{

  const formDetails= new URLSearchParams();
  formDetails.append("username",username);
  formDetails.append("password",password);
  try{
    const response = await api.post("/token",formDetails);
    console.log(" Response from Login method ",response.data.access_token);
    console.log(" access_token_epires :  ",response.data.access_token_expires);
    localStorage.setItem("token",response.data.access_token)
    if(response.status==200){
      console.log("Loggin successfully ");
      
      navigate("/")
    }
    
  }
  catch(error){
        setError(error["response"]["data"]["detail"])

    console.error("error while login ", error)

  }
}
const Register=async ()=>{
 
  try{
    const response = await api.post("/register",{
      "username":username,
      "password":password,
      "email":email,
      "confirm_password":confirmPassword

    });
    console.log("This is response from register function : ",response);
    
    if(response.status==200){
      
    console.log(" Response from Register method ",response.data);
     setAccount(false);
     console.log("Account : ",account);
       
    await Login()
    navigate("/")
    
    }
  
  }
  catch(error){
   
    setError(error["response"]["data"]["detail"])
    console.error("error while Register", error["response"]["data"]["detail"])

  }
}





const onChangeUsername=(event)=>{
  setUsername(event.target.value)

}
const onChangePassword=(event)=>{
  setPassword(event.target.value)

}
const onChangeEmail=(event)=>{
  setEmail(event.target.value)

}
const onChangeConfirmPassword=(event)=>{
  setConfirmPassword(event.target.value)

}


    return(
      <div style={{width:"100%",height:"100%"}}>
            <CustomNavbar/>

            <br/>
            <div style={{"padding":"40px"}}>              
            <h2 style={{color:"black"}}> WELCOME TO MY WEBSITE</h2>
 
            <br/>
            <br/>

{
  error!="" &&(
    <h4  style={{color:"red"}}>{error}</h4>
  )
}
<br/>




          
            {
              account?   <>
{/********* * Username, Password Inputs for Login  ************/}
<div style={{paddingLeft:"20px",paddingRight:"20px"

}}
  > <CustomizeInputGroup value={username}  onChange={onChangeUsername} type="text" text=<h5>Username</h5>  />
   <CustomizeInputGroup value={password}  onChange={onChangePassword} text=<h5>Password</h5>
 type='password'/>
</div>
  
 
      </>:



   
      <>



         <CustomizeInputGroup value={username}  onChange={onChangeUsername} type="text" text=<h5>Username</h5>  />
   <CustomizeInputGroup  value={email} type="email"
        onChange={onChangeEmail} text=<h5>Email</h5>/>
   <CustomizeInputGroup value={password}  onChange={onChangePassword} type="password" text=<h5>Password</h5>/>
   
   <CustomizeInputGroup value={confirmPassword}  onChange={onChangeConfirmPassword} type="password" text=<h5> Confirm password</h5>/>
   
  
  

      </>
            }
    
    
            
               <br/>
               <br/>
               <Button id="button1" onClick={()=>{ 
                if(account){
                  Login()
              console.log(username,password)
              
                }
                else{
                  Register()
                  console.log(username,email,password,confirmPassword)
                }
              
                // navigate("/")
                
                
                
                }}   >
                {account?<h5>Sign In</h5>:
                  <h5> Register </h5>}
               </Button>
               <br/>
               <br/>
               { account?   <h3  onClick={()=>{ setAccount(false)}}> Not registered yet? Sign up here. </h3>:

               <h3  onClick={()=>{ setAccount(true)}}>Login to your account</h3>
               }
        
            </div>
            <Footer top={130}/>
                </div>         
            
             
               
              )

   
}
export default Auth