import React, { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState('');

  // Fetch all users
  const fetchUsers = () => {
    fetch('https://nodebackend-zp7w.onrender.com/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add a new user
  const addUser = () => {
    if (!newName.trim()) return;
    fetch('https://nodebackend-zp7w.onrender.com/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName })
    })
      .then(() => {
        setNewName('');
        fetchUsers();
      });
  };

  // Update user (example: update user 1)
  const updateUser = (id) => {
    fetch(`https://nodebackend-zp7w.onrender.com/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated User' })
    })
      .then(() => fetchUsers());
  };

  // Delete a user
  const deleteUser = (id) => {
    fetch(`https://nodebackend-zp7w.onrender.com/users/${id}`, {
      method: 'DELETE'
    })
      .then(() => fetchUsers());
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>React + Node CRUD App</h1>

      <h2>Users List:</h2>
      <ul>
        {users.map(u => (
          <li key={u.id}>
            {u.name}
            <button onClick={() => deleteUser(u.id)} style={{ marginLeft: '10px' }}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Add User:</h2>
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="Enter user name"
      />
      <button onClick={addUser}>Add User</button>

      <h2>Update User 1:</h2>
      <button onClick={() => updateUser(1)}>Update User 1 to 'Updated User'</button>
    </div>
  );
}

export default App;
