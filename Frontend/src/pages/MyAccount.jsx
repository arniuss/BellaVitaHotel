import React from 'react';
import MyReservations from '../components/MyReservations';
import AccountDetails from '../components/AccountDetails';

const MyAccount = () => {
  return (
    <div>
        <AccountDetails />
      <MyReservations />
    </div>
  );
};

export default MyAccount;