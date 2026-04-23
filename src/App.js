import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [file, setFile] = useState(null);
    const [users, setUsers] = useState([]);
    const [showDashboard, setShowDashboard] = useState(false);
    const [message, setMessage] = useState('');

    const fetchUsers = async () => {
        const res = await axios.get('http://localhost:5000/api/users');
        setUsers(res.data);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('profileImage', file);

        try {
            await axios.post('http://localhost:5000/api/register', formData);
            setMessage("Account Created Successfully!");
            fetchUsers();
            setShowDashboard(true);
        } catch (err) { setMessage("Registration Failed."); }
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        fetchUsers();
    };

    const handleUpdate = async (id) => {
        const newName = prompt("Enter new username:");
        if (newName) {
            await axios.put(`http://localhost:5000/api/users/${id}`, { username: newName });
            fetchUsers();
        }
    };

    return (
        <div className="container">
            {!showDashboard ? (
                <div className="glass-card">
                    <h1>Register Portal</h1>
                    <form onSubmit={handleRegister}>
                        <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} required />
                        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
                        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
                        <label className="file-label">Profile Image:</label>
                        <input type="file" className="file-input" onChange={e => setFile(e.target.files[0])} required />
                        <button type="submit">Create Account</button>
                    </form>
                    <button onClick={() => {fetchUsers(); setShowDashboard(true)}} className="link-btn">View Dashboard</button>
                    {message && <p className="status">{message}</p>}
                </div>
            ) : (
                <div className="glass-card dashboard">
                    <h1>Dashboard</h1>
                    <button onClick={() => setShowDashboard(false)} className="back-btn">← Back to Form</button>
                    <div className="user-list">
                        {users.map(u => (
                            <div key={u._id} className="user-row">
                                <div className="user-info">
                                    <strong>{u.username}</strong>
                                    <span>{u.email}</span>
                                </div>
                                <div className="actions">
                                    <button onClick={() => handleUpdate(u._id)} className="edit-btn">Edit</button>
                                    <button onClick={() => handleDelete(u._id)} className="del-btn">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;