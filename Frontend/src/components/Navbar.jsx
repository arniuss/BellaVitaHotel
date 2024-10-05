import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "./Navbar.css"

const Navbar = ({ isLoggedIn, username, onLogout }) => {
  const [adminRole, setAdminRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('adminRole');
    setAdminRole(storedRole);
  }, [isLoggedIn]);

  return (
    <nav>
      <ul class="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/RoomList">Rooms</Link>
        </li>
        <li>
          <Link to="/Reservation">Reservation</Link>
        </li>
        <li>
          <Link to="/Contact">Contact</Link>
        </li>
        {adminRole === 'Admin' && (
          <li>
            <Link to="/Admin">Admin</Link>
          </li>
        )}
      </ul>
      <ul class="auth-links">
        {isLoggedIn ? (
          <>
            <li>
              <Link to="/MyAccount">
                {username}
              </Link>
            </li>
            <li>
              <Link to='/'>
                <button class="button register-logout-button" onClick={onLogout}>Logout</button>
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/Login">
                <button class="button login-button">Login</button>
              </Link>
            </li>
            <li>
              <Link to="/Register">
                <button class="button register-logout-button">Register</button>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
