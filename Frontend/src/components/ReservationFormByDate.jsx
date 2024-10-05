import React, { useState, useEffect } from 'react'; 
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import './ReservationFormByDate.css'; 

const ReservationFormByDate = () => {
  const location = useLocation();
  const { roomId } = useParams();
  const { name, userID, startDate, endDate } = location.state;

  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    } else if (location.state.email) {
      setEmail(location.state.email);
    }
  }, [location.state.email]);

  const formatDateTime = (dateString) => {
    const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString(undefined, optionsDate);
    const formattedTime = date.toLocaleTimeString(undefined, optionsTime);
    return `${formattedDate} ${formattedTime}`; 
  };

  const handleReservationSubmit = async () => {
    const reservationData = {
      email: email,
      userID: userID,
      roomID: roomId,
      checkInDate: startDate,
      checkOutDate: endDate
    };

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post('https://localhost:7218/api/Reservations', reservationData);
      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      setError('Failed to create reservation. Please try again.'); 
    } finally {
      setIsLoading(false); 
    }
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
  };

  return (
    <div className="reservation-form">
      <h2>Reservation for {name}</h2>
      <div>
        <label htmlFor="email">Email:</label>
        <input 
          type="email" 
          id="email" 
          value={email} 
          onChange={handleEmailChange} 
          required 
        />
      </div>
      <p>Check-in: {formatDateTime(startDate)}</p>
      <p>Check-out: {formatDateTime(endDate)}</p>

      {isLoading && <p>Loading...</p>} 
      {error && <p className="error">{error}</p>} 
      {success && <p className="success">Reservation created successfully!</p>} 

      <button 
        onClick={handleReservationSubmit} 
        disabled={isLoading || success}
      >
        {isLoading ? 'Submitting...' : success ? 'Reservation Confirmed' : 'Confirm Reservation'}
      </button>
    </div>
  );
};

export default ReservationFormByDate;
