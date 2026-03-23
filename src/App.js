import React, { useEffect, useState } from "react";
import Login from "./Login";
import "./ProBank.css";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

function App(){

const API = "http://localhost:8082/bank";

if(!localStorage.getItem("bankPass")){
 localStorage.setItem("bankPass","admin");
}

const [login,setLogin] = useState(false);
const [accounts,setAccounts] = useState([]);
const [dark,setDark] = useState(false);
const [chat,setChat] = useState([]);

useEffect(()=>{ load(); },[]);

const load = ()=>{
 fetch(API+"/all")
 .then(res=>res.json())
 .then(data=>setAccounts(data));
};

const addChat = (msg)=>{
 setChat(prev => [...prev,msg]);
};

/* ⭐ CREATE */
const createAccount = (name,address,balance)=>{
 const id = Date.now();

 fetch(API+"/create",{
  method:"POST",
  headers:{ "Content-Type":"application/json"},
  body:JSON.stringify({id,name,address,balance:Number(balance)})
 }).then(()=>{
   addChat("✅ Account created for "+name);
   load();
 });
};

/* ⭐ UPDATE BALANCE */
const updateBalance = (name,amount,type)=>{
 const clean = name.trim().toLowerCase();

 const acc = accounts.find(
   a => a.name.toLowerCase().trim()===clean
 );

 if(!acc){
   addChat("❌ Account not found");
   return;
 }

 let newBal =
   type==="withdraw"
   ? acc.balance - Number(amount)
   : acc.balance + Number(amount);

 fetch(API+"/create",{
  method:"POST",
  headers:{ "Content-Type":"application/json"},
  body:JSON.stringify({...acc,balance:newBal})
 }).then(()=>{
   addChat("💰 "+type+" successful for "+acc.name);
   load();
 });
};

/* ⭐ DELETE */
const deleteAccount = (name)=>{
 const clean = name.trim().toLowerCase();

 const acc = accounts.find(
   a => a.name.toLowerCase().trim()===clean
 );

 if(!acc){
   addChat("❌ Account not found");
   return;
 }

 fetch(API+"/delete/"+acc.id,{method:"DELETE"})
 .then(()=>{
   addChat("🗑 Account deleted "+acc.name);
   load();
 });
};

/* ⭐ BALANCE */
const checkBalance = (name)=>{
 const clean = name.trim().toLowerCase();

 const acc = accounts.find(
   a => a.name.toLowerCase().trim()===clean
 );

 if(!acc){
   addChat("❌ Account not found");
   return;
 }

 addChat("💳 Balance of "+acc.name+" is ₹ "+acc.balance);
};

/* ⭐ ⭐ AI VOICE ENGINE */
const startVoice = ()=>{

 const SpeechRecognition =
   window.SpeechRecognition || window.webkitSpeechRecognition;

 if(!SpeechRecognition){
   alert("Voice not supported");
   return;
 }

 const recog = new SpeechRecognition();
 recog.lang="en-IN";

 recog.onresult = (e)=>{

   const text = e.results[0][0].transcript.toLowerCase();
   addChat("🎤 "+text);

   if(text.includes("create") || text.includes("open")){
     const name = text.split("for")[1]?.split(" ")[1];
     const amount = text.match(/\d+/)?.[0];
     const address = text.split("in")[1]?.trim();

     if(name && amount && address)
       createAccount(name,address,amount);
   }

   else if(text.includes("deposit")){
     const name = text.split("for")[1]?.split(" ")[1];
     const amount = text.match(/\d+/)?.[0];
     updateBalance(name,amount,"deposit");
   }

   else if(text.includes("withdraw")){
     const name = text.split("for")[1]?.split(" ")[1];
     const amount = text.match(/\d+/)?.[0];
     updateBalance(name,amount,"withdraw");
   }

   else if(text.includes("delete")){
     const name = text.split("account")[1]?.trim();
     deleteAccount(name);
   }

   else if(text.includes("balance")){
     const name = text.split("of")[1]?.trim();
     checkBalance(name);
   }

 };

 recog.start();
};

const pieData = {
 labels: accounts.map(a=>a.name),
 datasets:[
  {
   data: accounts.map(a=>Number(a.balance)),
   backgroundColor:[
    "#ff6384","#36a2eb","#4bc0c0",
    "#ffcd56","#9966ff","#ff9f40"
   ]
  }
 ]
};

if(!login) return <Login setLogin={setLogin} />

return(
<div className={dark ? "dark" : "light"}>

<div className="sidebar">
<h2>🏦 Union Bank</h2>

<button className="toggleBtn"
 onClick={()=>setDark(!dark)}>
{dark ? "☀ Light" : "🌙 Dark"}
</button>

<button className="toggleBtn"
 onClick={startVoice}>
🎤 Voice
</button>

</div>

<div className="main">

<h1>AI Fintech Dashboard</h1>

<div className="cardRow">
<div className="card">
<h3>Total Customers</h3>
<h2>{accounts.length}</h2>
</div>

<div className="card">
<h3>Total Balance</h3>
<h2>
₹ {accounts.reduce((s,a)=>s+Number(a.balance),0)}
</h2>
</div>
</div>

<div className="atmCard">
<h3>Union Bank</h3>
<p>XXXX XXXX XXXX 1234</p>
<p>Valid 12/30</p>
</div>

<div className="chartBox">
<h3>Balance Analytics</h3>
<Pie data={pieData}/>
</div>

<h3>AI Voice Chat</h3>
<div style={{
 background:"#000",
 color:"#0f0",
 padding:"15px",
 height:"180px",
 overflow:"auto",
 borderRadius:"10px"
}}>
{chat.map((c,i)=><div key={i}>{c}</div>)}
</div>

<div className="tableBox" style={{
 background:"white",
 padding:"20px",
 borderRadius:"15px",
 marginTop:"25px",
 boxShadow:"0 10px 25px rgba(0,0,0,0.15)"
}}>
<h3>Customer Accounts</h3>

<table border="1" cellPadding="10" style={{width:"100%"}}>
<thead>
<tr>
<th>ID</th>
<th>Name</th>
<th>Address</th>
<th>Balance</th>
</tr>
</thead>

<tbody>
{
accounts.map(a=>(
<tr key={a.id}>
<td>{a.id}</td>
<td>{a.name}</td>
<td>{a.address}</td>
<td>₹ {a.balance}</td>
</tr>
))
}
</tbody>
</table>

</div>

</div>
</div>
);
}

export default App;