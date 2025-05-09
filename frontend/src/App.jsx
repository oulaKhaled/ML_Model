// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import React from 'react'
import { Route,Routes } from "react-router-dom";
import HomePage from './components/HomePage'
import Auth from './components/auth.jsx';
import Ml_user from './components/ml_user.jsx';
import UserRole from './components/user_role.jsx';
import Test from './components/test.jsx';
function App() {

  return(
   <>
   {/* <h1> Hi there </h1> */}
<Routes>
<Route path="/" element={<HomePage/>}/> 

<Route path="/auth" element={<Auth/>}/> 
<Route path="/ml_user" element={<Ml_user/>}/> 
<Route path="/user_role" element={<UserRole/>}/> 
<Route path="/test" element={<Test/>}/> 



</Routes>
</>






  )

}

export default App
