'use client'

import { useEffect, useState } from 'react';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [editId, setEditId] = useState(null);

  // Fetch users
  const fetchUsers = async () => {
    const res = await fetch('http://localhost:5000/api/users');
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add or Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editId ? 'PUT' : 'POST';
    const url = editId
      ? `http://localhost:5000/api/users/${editId}`
      : 'http://localhost:5000/api/users';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setForm({ name: '', email: '' });
    setEditId(null);
    fetchUsers();
  };

  // Edit
  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email });
    setEditId(user._id);
  };

  // Delete
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  return (
    <div className='text-white' style={{ padding: 20 }}>
      <h1>Full CRUD (Single Page)</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <button type="submit">{editId ? 'Update' : 'Add'}</button>
        {editId && <button onClick={() => { setForm({ name: '', email: '' }); setEditId(null); }}>Cancel</button>}
      </form>

      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.name} - {user.email}{' '}
            <button onClick={() => handleEdit(user)}>Edit</button>{' '}
            <button onClick={() => handleDelete(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
