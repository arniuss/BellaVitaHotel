import React from 'react';
import { Link } from "react-router-dom"

const Admin = () => {
  return (
    <div>
        <div>
            <Link to='/ReservationsManagement'>
                <button>Reservations management</button>
            </Link>
            <Link to='/RoomsManagement'>
                <button>Rooms management</button>
            </Link>
            <Link to='/UsersManagement'>
                <button>Users management</button>
            </Link>
        </div>
    </div>
  );
};

export default Admin;