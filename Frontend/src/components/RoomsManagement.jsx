import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoomsManagement = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
      const fetchRooms = async () => {
          try {
              const response = await axios.get('https://localhost:7218/api/Rooms');
              
              if (response.data && response.data.$values && Array.isArray(response.data.$values)) {
                  setRooms(response.data.$values);
              } else {
                  setError("Unexpected response format.");
              }
          } catch (error) {
              setError("Error fetching rooms: " + error.message);
          } finally {
              setLoading(false);
          }
      };
      fetchRooms();
  }, []);
  
  const handleDelete = async (id) => {
      try {
          await axios.delete(`https://localhost:7218/api/Rooms/${id}`);
          setRooms((prevRooms) => 
              prevRooms.filter(room => room.id !== id)
          );
          console.log("Room deleted successfully");
      } catch (error) {
          console.error("Error deleting room:", error);
      }
  };
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
  

    return (
        <div className="rooms">
        {rooms.length === 0 ? (
          <p>No rooms found.</p>
        ) : (
          <ul>
            {rooms.map((room) => (
              <li key={room.id}> 
                <p>{room.name}</p>
                <p>Adult capacity: {room.adultCapacity}</p>
                <p>Children capacity: {room.childrenCapacity}</p>     
                <p>Price: {room.price} $</p>           
                <button>Change</button>
                <button onClick={() => handleDelete(room.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
}

export default RoomsManagement;