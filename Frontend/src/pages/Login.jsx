import axios from "axios"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const Login = ( {setIsLoggedIn, setUsername} ) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    const loginViewModel = {
        Email: email,
        Password: password,
        RememberMe: rememberMe
    };

    try {
        const response = await axios.post('https://localhost:7218/api/Account/login', loginViewModel);
        setMessage('Logged in.');

        const username = response.data.username;
        const userID = response.data.userID;
        const adminRole = response.data.role;
        setMessage(`Logged in successfully as ${username}`);
        
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        localStorage.setItem('userID', userID);
        localStorage.setItem('adminRole', adminRole);

        setIsLoggedIn(true);
        setUsername(username);

        navigate('/')
    } catch (error) {
        console.error('Error:', error);
        
        if (error.response) {
            setMessage(error.response.data || 'An error occurred.');
        } else {
            setMessage('An error occurred.'); 
        }
    }
  }

  return (
    <div>
      <form action="post" onSubmit={handleSubmit}>
      <input 
        type="email" 
        placeholder='Email adress...'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
        type="checkbox" 
        id="rememberMe"
        checked={rememberMe}
        onChange={(e) => setRememberMe(e.target.checked)}
      />
      <label htmlFor="rememberMe">Remember me</label>
      <button type='submit'>Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default Login;
