import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
      const fetchUsers = async () => {
          try {
              const response = await axios.get('https://localhost:7218/api/Users')

              if (response.data && response.data.$values && Array.isArray(response.data.$values)) {
                  setUsers(response.data.$values);
              } else {
                  setError("Unexpected response format.");
              }
          } catch (error) {
              setError("Error fetching users: " + error.message);
          } finally {
              setLoading(false);
          }
      };
      fetchUsers();
  }, []);
  
  const handleDelete = async (id) => {
      try {
          await axios.delete(`https://localhost:7218/api/Users/${id}`);
          setUsers((prevUsers) => 
              prevUsers.filter(user => user.id !== id)
          );
          console.log("User deleted successfully");
      } catch (error) {
          console.error("Error deleting user:", error);
      }
  };
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
  

    return (
        <div className="users">
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li key={user.id}> 
                <p>{user.userName}</p>
                <p>{user.email}</p>                
                <button>Change</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
}

export default UsersManagement;