import React, { useState, useEffect } from "react";
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import RoomList from './components/RoomList';
import Reservation from './pages/Reservation';
import ReservationForm from './components/ReservationForm';
import MyAccount from "./pages/MyAccount";
import ReservationsManagement from "./components/ReservationsManagement";
import UsersManagement from './components/UsersManagement';
import RoomsManagement from './components/RoomsManagement';
import AvailableRoomsByDate from './components/AvailableRoomsByDate';
import ReservationFormByDate from "./components/ReservationFormByDate";
import FetchAvailableRooms from './components/FetchAvailableRooms';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect (() => {
    const storedUsername = localStorage.getItem('username');

    if(storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('userID');
    localStorage.removeItem('adminRole');
    setIsLoggedIn(false);
    setUsername('');
  }

  return (
    <Router>
      <div className="app-container">   
      <Navbar className="navbar" isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout}/>   
        <div className="overlay" />       
        <div className="content">        
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/RoomList" element={<RoomList />} />
            <Route path="/Reservation" element={<Reservation />} />
            <Route path="/ReservationForm/:id" element={<ReservationForm />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Admin" element={<Admin />} />
            <Route path="/ReservationsManagement" element={<ReservationsManagement />} />
            <Route path="/UsersManagement" element={<UsersManagement />} />
            <Route path="/RoomsManagement" element={<RoomsManagement />} />
            <Route path="/AvailableRoomsByDate" element={<AvailableRoomsByDate />} />
            <Route path="/ReservationFormByDate/:roomId" element={<ReservationFormByDate />} />
            <Route path="/FetchAvailableRooms" element={<FetchAvailableRooms />} />
            <Route path="/Login" element={<Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername}/>} />
            <Route path="/MyAccount" element={<MyAccount />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;