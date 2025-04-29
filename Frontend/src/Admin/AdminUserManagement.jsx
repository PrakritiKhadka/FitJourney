import { useState } from 'react';
import { Trash, Edit, Plus, Check, X, Search, ArrowLeft } from 'lucide-react';
import './AdminUserManagement.css';

export default function AdminUserManagement() {
  // Sample initial user data
  const initialUsers = [
    { id: 1, name: 'John Doe', age: 28, gender: 'Male', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', age: 34, gender: 'Female', email: 'jane@example.com' },
    { id: 3, name: 'Alex Johnson', age: 42, gender: 'Male', email: 'alex@example.com' },
  ];

  // State management
  const [users, setUsers] = useState(initialUsers);
  const [editingUser, setEditingUser] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', age: '', gender: '', email: '' });
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle editing user
  const handleEdit = (user) => {
    setEditingUser({ ...user });
  };

  // Handle saving edited user
  const handleSaveEdit = () => {
    setUsers(users.map(user => user.id === editingUser.id ? editingUser : user));
    setEditingUser(null);
  };

  // Handle deleting user
  const handleDelete = (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  // Handle adding new user
  const handleAddUser = () => {
    // Validate fields
    if (!newUser.name || !newUser.age || !newUser.gender || !newUser.email) {
      alert('Please fill in all fields');
      return;
    }
    // Create new user with unique ID
    const newUserWithId = {
      ...newUser,
      id: Math.max(...users.map(u => u.id), 0) + 1,
      age: parseInt(newUser.age)
    };
    
    setUsers([...users, newUserWithId]);
    setNewUser({ name: '', age: '', gender: '', email: '' });
    setIsAddingUser(false);
  };

  // Handle edit form input changes
  const handleEditChange = (field, value) => {
    setEditingUser({ ...editingUser, [field]: field === 'age' ? (value === '' ? '' : parseInt(value) || 0) : value });
  };

  // Handle new user form input changes
  const handleNewUserChange = (field, value) => {
    setNewUser({ ...newUser, [field]: value });
  };

  return (
    <div className="admin-container">
      {/* Back Button */}
      <div className="back-button-container">
        <a href="/AdminPanel" className="back-button">
          <ArrowLeft className="back-icon" />
          <span>Go Back</span>
        </a>
      </div>
      <h1 className="admin-title">Admin User Management</h1>
      
      {/* Search and Add User Row */}
      <div className="search-add-row">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {!isAddingUser && (
          <button 
            onClick={() => setIsAddingUser(true)} 
            className="add-user-btn"
          >
            <Plus size={16} /> Add User
          </button>
        )}
      </div>
      
      {/* Add New User Form */}
      {isAddingUser && (
        <div className="add-user-form">
          <h2 className="form-title">Add New User</h2>
          <div className="form-grid">
            <div>
              <label className="form-label">Name</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => handleNewUserChange('name', e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Age</label>
              <input
                type="number"
                value={newUser.age}
                onChange={(e) => handleNewUserChange('age', e.target.value)}
                className="form-input"
                min="0"
                max="120"
              />
            </div>
            <div>
              <label className="form-label">Gender</label>
              <select
                value={newUser.gender}
                onChange={(e) => handleNewUserChange('gender', e.target.value)}
                className="form-select"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => handleNewUserChange('email', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
          <div className="form-actions">
            <button 
              onClick={() => setIsAddingUser(false)} 
              className="cancel-btn"
            >
              <X size={16} /> Cancel
            </button>
            <button 
              onClick={handleAddUser} 
              className="save-btn"
            >
              <Check size={16} /> Save
            </button>
          </div>
        </div>
      )}
      
      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Email</th>
              <th className="actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-users">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  {editingUser && editingUser.id === user.id ? (
                    // Edit mode row
                    <>
                      <td>
                        <input
                          type="text"
                          value={editingUser.name}
                          onChange={(e) => handleEditChange('name', e.target.value)}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editingUser.age}
                          onChange={(e) => handleEditChange('age', e.target.value)}
                          className="edit-input"
                          min="0"
                          max="120"
                        />
                      </td>
                      <td>
                        <select
                          value={editingUser.gender}
                          onChange={(e) => handleEditChange('gender', e.target.value)}
                          className="edit-select"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="email"
                          value={editingUser.email}
                          onChange={(e) => handleEditChange('email', e.target.value)}
                          className="edit-input"
                        />
                      </td>
                      <td className="actions-cell">
                        <button 
                          onClick={handleSaveEdit} 
                          className="confirm-btn"
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          onClick={() => setEditingUser(null)} 
                          className="cancel-icon-btn"
                        >
                          <X size={18} />
                        </button>
                      </td>
                    </>
                  ) : (
                    // View mode row
                    <>
                      <td>{user.name}</td>
                      <td>{user.age}</td>
                      <td>{user.gender}</td>
                      <td>{user.email}</td>
                      <td className="actions-cell">
                        <button 
                          onClick={() => handleEdit(user)} 
                          className="edit-btn"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)} 
                          className="delete-btn"
                        >
                          <Trash size={18} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="table-footer">
          <p className="user-count">Total users: {users.length}</p>
        </div>
      </div>
    </div>
  );
}