import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

const ReservationFormByDate = ({ onRoomsFetched, onDatesSelected }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleFetchAvailableRooms = async () => {
    if (!startDate || !endDate) {
      console.error('Please select both start date and end date');
      return;
    }

    try {
      const checkInDateWithTime = setFixedTime(startDate, 11, 0);  
      const checkOutDateWithTime = setFixedTime(endDate, 10, 0); 

      const formattedStartDate = formatLocalDateTime(checkInDateWithTime);
      const formattedEndDate = formatLocalDateTime(checkOutDateWithTime);

      onDatesSelected(formattedStartDate, formattedEndDate);

      const response = await axios.get('https://localhost:7218/api/Rooms/available', {
        params: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        },
      });

      if (response.status === 200) {
        onRoomsFetched(response.data);
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching available rooms:', error);
    }
  };

  return (
    <div>
      <div>
        <label>Start Date:</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          minDate={new Date()}
          placeholderText="Select a start date"
        />
      </div>
      <div>
        <label>End Date:</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          minDate={startDate || new Date()}
          placeholderText="Select an end date"
        />
      </div>
      <button onClick={handleFetchAvailableRooms} disabled={!startDate || !endDate}>
        Check Available Rooms
      </button>
    </div>
  );
};

export default ReservationFormByDate;
