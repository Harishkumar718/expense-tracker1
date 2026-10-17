import { useState } from "react";
import './login.css'
import Register from './register';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Login({setIsLoggedIn}){
    const [email,setEmail] = useState(''); 
    const [password,setPassword] = useState('');
    const [message, setMessage] = useState('');


    const [showRegister, setShowRegister] = useState(false);

    
    const handleLogin = async (e) =>{
        e.preventDefault();
        setPassword('');
        setEmail('');
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            body:JSON.stringify({
                email:email,
                password:password
            }),
            headers:{"Content-Type": "application/json"},

            });
        const data = await response.json();
        if (!response.ok) {
            setMessage(data.message);
            return;
        }   
        localStorage.setItem('token',data.token);
        setIsLoggedIn(true);
        setMessage(data.message);
        
    }

    

    return (
        
        <div className="login-page">
            {!showRegister && (
        <section className="login-card">
            <h2>Welcome </h2>
            <p className="login-subtitle">Sign in to manage your expenses</p>
                <form onSubmit={handleLogin}>
                    <div className="login-field">
                         <label htmlFor="email">Email</label>
                        <input type ='text' value={email} onChange={(e) => {setEmail(e.target.value)}}  placeholder="Enter email" /> 

                    </div>
                    <div className="login-field">
                        <label htmlFor="password">Password</label>
                        <input  type ='password' value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder="Enter password" /> 
                        
                    </div>
                    <button  className="login-btn" type = "submit" >Login</button>
                    
                    
                </form>
                <p className="login-message">{message}</p>  
                <p className="auth-switch">
                    Don't have an account?
                    <button
                        type="button"
                        onClick={() => setShowRegister(true)}
                    >
                        Register
                    </button>
                </p>
            </section> )}
            
            {showRegister &&  <Register onBackToLogin={() => setShowRegister(false)}/> 
                             }
        </div>
    );
}

export default Login;