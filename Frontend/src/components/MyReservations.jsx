import React, { useEffect, useState } from "react"
import axios from "axios";
import "./MyReservations.css"

const MyReservations = () => {

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchReservations = async () => {
        const userID = localStorage.getItem('userID');
        if(!userID){
            setError("User not found.");
            setLoading(false);
            return;
        }
        try {
            const response = await axios.get('https://localhost:7218/api/Reservations/MyReservations', {
                params: { id: userID },
            });

            console.log("Reservations response:", response.data);

            if (response.data && response.data.$values && Array.isArray(response.data.$values)) {
                setReservations(response.data.$values);
            } else {
                setError("Unexpected response format.");
            }
        } catch (error) {
            setError("Error fetching reservations: " + error.message);
        } finally {
            setLoading(false);
        }
    };
    fetchReservations();
}, []);

const handleDelete = async (id) => {
    try {
        await axios.delete(`https://localhost:7218/api/Reservations/${id}`);
        setReservations((prevReservations) => 
            prevReservations.filter(reservation => reservation.id !== id)
        );
        console.log("Reservation deleted successfully");
    } catch (error) {
        console.error("Error deleting reservation:", error);
    }
};

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="my-reservations">
      <h1>My Reservations</h1>
      {reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation.id}> 
              <p>{reservation.roomName}</p>
              <p>Check-In: {new Date(reservation.checkInDate).toLocaleString()}</p>
              <p>Check-Out: {new Date(reservation.checkOutDate).toLocaleString()}</p>
              <button>Change</button>
              <button onClick={() => handleDelete(reservation.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyReservations
