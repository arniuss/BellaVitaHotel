import { useEffect, useState } from "react";

const AccountDetails = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const username = localStorage.getItem('username');
        const email = localStorage.getItem('email');

        if(username) {
            setUsername(username);
        }
        if(email) {
            setEmail(email);
        }
    })

    return (
        <div>
            <h1>Account Details</h1>
            <p>{email}</p>
            <p>{username}</p>
        </div>
    );
};

export default AccountDetails;