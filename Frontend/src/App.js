import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import NavBar from "./Components/NavBar";
import Login from "./Pages/Login/Login.js"
import SignupPage from "./Pages/SignUp/SignUp.js";
import Profile from "./Components/profile.js";


export default function App()
{
  return (
    <>
     <NavBar/>
     <Routes>
      <Route path="/" element = {<HomePage/>}/>
      <Route path="/Login" element = {<Login/>}/>
      <Route path="/Signup" element = {<SignupPage/>}/>
      <Route path="/profile" element = {<Profile/>}/>
     </Routes>
    </>
  );
}
