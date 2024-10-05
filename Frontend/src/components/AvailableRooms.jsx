import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AvailableRooms.css';


const AvailableRooms = () => {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [email, setEmail] = useState('');
  const [userID, setUserID] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedUserId = localStorage.getItem('userID');
    if(storedEmail) {
      setEmail(storedEmail);
    }
    if(storedUserId){
      setUserID(storedUserId);
    }
  }, [])

  const handleRoomsFetched = (rooms) => {
    setAvailableRooms(rooms);
  };

  

  return (
    <div>
      <ReservationByDateForm onRoomsFetched={handleRoomsFetched} />
      {availableRooms.length > 0 && (
        <div className="room-cards">
          <h2>Available Rooms</h2>
          {availableRooms.map(room => (
            <div className="room-card" key={room.id}>
              <h2>{room.name}</h2>
              <p>Price: {room.price} $</p>
              <p>Adults: {room.adultCapacity}</p>
              <p>Children: {room.childrenCapacity}</p>
              <Link to={`/ReservationForm/${room.id}`}
                state={{ name: room.name, email: email, userID: userID, showDatePickers: false }}>
                <button>Reserve Room</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableRooms;
