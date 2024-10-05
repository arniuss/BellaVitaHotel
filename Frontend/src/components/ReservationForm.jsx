import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ReservationForm = () => {
  const { id } = useParams();
  const [roomId, setRoomId] = useState(id);
  const [typedEmail, setTypedEmail] = useState(); 
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookedDays, setBookedDays] = useState([]);
  const [message, setMessage] = useState('');
  const location = useLocation();
  const { name, email, userID } = location.state || {};

  useEffect(() => {
    if(email){
      setTypedEmail(email);
    }

    const fetchBookedDays = async () => {
      try {
        const response = await axios.get(`https://localhost:7218/api/Rooms/availableRoomById?id=${id}`);
    
        if (response.data && response.data.$values && Array.isArray(response.data.$values)) {
          const formattedDates = response.data.$values.flatMap(reservation => {
            const datesArray = [];
            let currentDate = new Date(reservation.checkInDate);
            const checkOutDate = new Date(reservation.checkOutDate);
    
            if (currentDate > checkOutDate) {
              return [];
            }
    
            while (currentDate <= checkOutDate) {
              datesArray.push(new Date(currentDate));
              currentDate.setDate(currentDate.getDate() + 1);
            }
            return datesArray;
          });
    
          setBookedDays(formattedDates);
        } else {
          console.error('Unexpected data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching booked dates:', error);
      }
    };

    fetchBookedDays();
  }, [id, email]);

  const isBooked = (date) => {
    return bookedDays.some(bookedDate => 
      bookedDate.toDateString() === date.toDateString()
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const setFixedTime = (date, hours, minutes) => {
      const updatedDate = new Date(date);
      updatedDate.setHours(hours);
      updatedDate.setMinutes(minutes);
      updatedDate.setSeconds(0); 
      return updatedDate;
    };

    const formatLocalDateTime = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    const checkInDateWithTime = setFixedTime(startDate, 11, 0);
    const checkOutDateWithTime = setFixedTime(endDate, 10, 0);

    const newReservation = {
      Email: typedEmail,
      UserID: userID,
      RoomID: parseInt(roomId),
      CheckInDate: formatLocalDateTime(checkInDateWithTime), 
      CheckOutDate: formatLocalDateTime(checkOutDateWithTime),
    };
    console.log("New Reservation Data:", newReservation);
    try {
      await axios.post('https://localhost:7218/api/Reservations', newReservation);
      setMessage('Reservation created successfully!');
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  return (
    <div>
      <h1>Reservation for {name}</h1>
      <form onSubmit={handleSubmit}>
      <div>
          <label>Email:</label>
          <input
            type="email"
            value={typedEmail || ''}
            onChange={(e) => setTypedEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            value={userID || ''}
            readOnly
            hidden
          />
        </div>       
        <div>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
            hidden
          />
        </div>
        <div>
            <div>
              <label>Start Date:</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                minDate={new Date()}
                filterDate={date => !isBooked(date)}
                placeholderText="Select a start date"
              />
            </div>
            <div>
              <label>End Date:</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                minDate={startDate || new Date()}
                filterDate={date => !isBooked(date)}
                placeholderText="Select an end date"
              />
            </div>
        </div>
        <button type="submit">Reserve</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ReservationForm;
