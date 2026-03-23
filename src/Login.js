import React, { useState, useRef } from "react";
import Webcam from "react-webcam";

function Login({ setLogin }) {

const [user,setUser] = useState("");
const [pass,setPass] = useState("");
const [face,setFace] = useState(false);

const webcamRef = useRef(null);

const check = ()=>{
 if(user==="admin" && pass===localStorage.getItem("bankPass")){
   setLogin(true);
 }else{
   alert("Invalid Login");
 }
};

const faceLogin = ()=>{
 setFace(true);

 setTimeout(()=>{
   alert("✅ Face Verified");
   setLogin(true);
 },3000);
};

return (
<div style={{textAlign:"center",marginTop:"100px"}}>

<h2>🏦 Union Bank Login</h2>

<input placeholder="Username"
onChange={e=>setUser(e.target.value)}/>

<br/><br/>

<input type="password"
placeholder="Password"
onChange={e=>setPass(e.target.value)}/>

<br/><br/>

<button onClick={check}>Login</button>

<br/><br/>

<button onClick={faceLogin}>
📸 Face Login
</button>

{
face &&
<div style={{marginTop:"20px"}}>
<Webcam
 audio={false}
 height={200}
 ref={webcamRef}
 screenshotFormat="image/jpeg"
 width={250}
/>
<p>Scanning Face...</p>
</div>
}

</div>
);
}

export default Login;