import { useState } from "react";
import './register.css';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";


function Register({ onBackToLogin }) {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [message, setMessage] = useState("");

const handleRegister = async (e) => {
    e.preventDefault();

    try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
        body: JSON.stringify({
        name,
        email,
        password,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        setMessage(data.message || "Registration failed");
        setName("");
        setEmail("");
        setPassword("");
        return;
    }

    setMessage(data.message || "Registration successful!");

    } catch (error) {
        setMessage("Unable to connect to the server");
    }
};

return (
    <div className="register-card" >
    <h2 className="register-title">Create an Account</h2>
    <p className="register-subtitle" >Register to start tracking your expenses.</p>

    <form onSubmit={handleRegister} >
        <div className="register-field" >
        <label htmlFor="name">Name</label>
        <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
        />
        </div>

        <div className="register-field" >
        <label htmlFor="email">Email</label>
        <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
        />
        </div>

        <div className="register-field" >
        <label htmlFor="password">Password</label>
        <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
        />
        </div>

        <button className="register-btn" type="submit">Register</button>
    </form>

    <p className="register-message">{message}</p>
    <p  className="auth-switch" >
        Already have an account?
        <button type="button" onClick={onBackToLogin}>
            Login
        </button>
    </p>
    </div>

);
}

export default Register;