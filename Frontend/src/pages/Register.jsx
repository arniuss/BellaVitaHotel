import axios from "axios"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const Register = () => {
  const [username, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState('')
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    const registrationViewModel = {
        Email: email,
        Password: password,
        ConfirmPassword: confirmPassword,
        UserName: username
    };

    try {
        await axios.post('https://localhost:7218/api/Account/register', registrationViewModel);
        setMessage('Registered successfully!');
        navigate('/');
    } catch (error) {
        console.error('Error:', error);
        
        if (error.response && error.response.data && error.response.data.errors) {
            const errorMessages = Object.values(error.response.data.errors)
                .flat()
                .join(", ");
            
            setMessage(`Failed to register: ${errorMessages}`);
        } else {
            setMessage('Failed to register.');
        }
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <form action="post" onSubmit={handleSubmit}>
      <input 
        type="email" 
        placeholder='Email adress...'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input 
        type="text" 
        placeholder='Username...'
        value={username}
        onChange={(e) => setUserName(e.target.value)}
        required
      />
      <input 
        type="password" 
        placeholder='Password...'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input 
        type="password" 
        placeholder='Confirm password...'
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button type='submit'>Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default Register;
