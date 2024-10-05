import React, { useState, useEffect } from "react";
import axios from 'axios';
import './RoomList.css';
import { Link } from 'react-router-dom';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [userID, setUserID] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedUserId = localStorage.getItem('userID');
    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (storedUserId) {
      setUserID(storedUserId);
    }

    axios.get('https://localhost:7218/api/Rooms')
      .then(response => {
        const roomData = response.data.$values || [];
        setRooms(roomData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="room-list">
      <div className="room-cards">
        {rooms.map(room => (
          <div className="room-card" key={room.id}>
            <h2>{room.name}</h2>
            <p>Price: {room.price} $</p>
            <p>Adults: {room.adultCapacity}</p>
            <p>Children: {room.childrenCapacity}</p>
            <Link
              to={`/ReservationForm/${room.id}`}
              state={{ name: room.name, email: email, userID: userID }}>
              <button>Check availability</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;
