import React from 'react';
import { Link } from 'react-router-dom';
import './AdminPanel.css';
import {
  LogOut,
  Gauge,
  Users,
  Dumbbell,
  Utensils 
} from 'lucide-react';

function AdminPanel() {
  const handleLogout = () => {
    // Add actual logout logic here
    // After logout, you can redirect using the Link component or navigate
  };

  return (
    <div className="app">
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">Admin Panel</div>
        <div className="user-info">
          <div className="user-avatar"></div>
          <span>Admin User</span>
        </div>
        <Link to="/" className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </Link>
      </nav>
      
      {/* Center Squares */}
      <div className="squares-container">
        <Link to="/AdminDashboard" className="square">
          <Gauge className="square-icon" size={32} />
          <h3>Dashboard</h3>
        </Link>
        <Link to="/AdminUserManagement" className="square">
          <Users className="square-icon" size={32} />
          <h3>User Management</h3>
        </Link>
        <Link to="/WorkoutManagement" className="square">
          <Dumbbell className="square-icon" size={32} />
          <h3>Workouts</h3>
        </Link>
        <Link to="/DietPlanManagement" className="square">
          <Utensils className="square-icon" size={32} />
          <h3>Diet Plans</h3>
        </Link>
      </div>
    </div>
  );
}

export default AdminPanel;