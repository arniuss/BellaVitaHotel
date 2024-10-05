import React, { useState } from "react"
import { Link } from "react-router-dom"
import FetchAvailableRooms from "./FetchAvailableRooms"

const AvailableRoomsByDate = () => {
  const [availableRooms, setAvailableRooms] = useState([])
  const [selectedDates, setSelectedDates] = useState({
    startDate: null,
    endDate: null,
  })

  const handleRoomsFetched = (data) => {
    const rooms = data.$values
    setAvailableRooms(rooms)
  }

  const handleDatesSelected = (startDate, endDate) => {
    setSelectedDates({ startDate, endDate })
  }



  return (
    <div>
      <FetchAvailableRooms
        onRoomsFetched={handleRoomsFetched}
        onDatesSelected={handleDatesSelected}
      />

      {availableRooms.length > 0 && (
        <div className="room-cards">
          {availableRooms.map((room) => (
            <div className="room-card" key={room.id}>
              <h2>{room.name}</h2>
              <p>Price: {room.price} $</p>
              <p>Adults: {room.adultCapacity}</p>
              <p>Children: {room.childrenCapacity}</p>
              <Link
                to={`/ReservationFormByDate/${room.id}`}
                state={{
                  name: room.name,
                  startDate: selectedDates.startDate,
                  endDate: selectedDates.endDate,
                }}
              >
                <button>Reserve Room</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AvailableRoomsByDate
