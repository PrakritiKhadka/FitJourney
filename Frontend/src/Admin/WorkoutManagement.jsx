import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, ArrowLeft, BarChart2, Plus } from 'lucide-react';
import './WorkoutManagement.css';
import WorkoutForm from '../pages/WorkoutForm';
import useUserStore from "../store/user";


// Workout Management Component
function WorkoutManagement() {
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState([]);
  const [completionStats, setCompletionStats] = useState({
    totalCompleted: 0,
    totalSkipped: 0,
    completionRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [activeTab, setActiveTab] = useState('admin');
  const modalRef = useRef();

  // Separate admin and user workouts
  const adminWorkouts = workouts.filter(w => w.isAdminWorkout);
  const userWorkouts = workouts.filter(w => !w.isAdminWorkout);

  const { isAuthenticated, logout, user, err, clearError, checkAuth } = useUserStore();

  useEffect(() => {
    fetchWorkouts();
    fetchStats();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch('/api/workouts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch workouts');
      }
      
      setWorkouts(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/workouts/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch stats');
      }
      
      setStats(data.data);

      // Calculate completion stats
      const completedCount = workouts.filter(w => w.completionStatus === 'completed').length;
      const skippedCount = workouts.filter(w => w.completionStatus === 'skipped').length;
      const totalWorkouts = workouts.length;
      const completionRate = totalWorkouts > 0 ? (completedCount / totalWorkouts) * 100 : 0;

      setCompletionStats({
        totalCompleted: completedCount,
        totalSkipped: skippedCount,
        completionRate: completionRate.toFixed(1)
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleDeleteWorkout = async (id) => {
    // Only allow deleting admin workouts
    const workout = workouts.find(w => w._id === id);
    if (!workout?.isAdminWorkout) {
      alert('Only admin workouts can be deleted');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this workout?')) {
      return;
    }

    try {
      const response = await fetch(`/api/workouts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete workout');
      }
      
      setWorkouts(workouts.filter(workout => workout._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditWorkout = (workout) => {
    // Only allow editing admin workouts
    if (!workout.isAdminWorkout) {
      alert('Only admin workouts can be edited');
      return;
    }
    setSelectedWorkout(workout);
    setShowEditModal(true);
  };

  const handleCreateWorkout = () => {
    setSelectedWorkout(null);
    setShowCreateModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return <div className="loading">Loading workouts...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="workout-management">
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="back-button-container">
            <a href="/AdminPanel">Admin Panel</a>
          </div>
        </div>
        <div className="user-info">
          <span className="greeting-text">Hello, {user?.name || "Admin"}</span>
        </div>
      </nav>
      <div className="workout-header">
        <div className="header-left">
          <Dumbbell className="header-icon" />
          <h1>Workout Management</h1>
        </div>
        <button className="create-button" onClick={handleCreateWorkout}>
          <Plus size={20} />
          Create Workout
        </button>
      </div>
      <div className="tabs">
        <button 
          className={activeTab === 'admin' ? 'active' : ''} 
          onClick={() => setActiveTab('admin')}
        >
          FitJourney Workouts
        </button>
        <button 
          className={activeTab === 'user' ? 'active' : ''} 
          onClick={() => setActiveTab('user')}
        >
          User Created Workouts
        </button>
      </div>
      <div className="workout-content">
        <div className="stats-section">
          <h2>
            <BarChart2 size={24} />
            Workout Statistics
          </h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Completion Stats</h3>
              <div className="stat-details">
                <div className="stat-item">
                  <span className="stat-label">Total Completed:</span>
                  <span className="stat-value">{completionStats.totalCompleted}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Skipped:</span>
                  <span className="stat-value">{completionStats.totalSkipped}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Completion Rate:</span>
                  <span className="stat-value">{completionStats.completionRate}%</span>
                </div>
              </div>
            </div>
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <h3>{stat._id}</h3>
                <div className="stat-details">
                  <div className="stat-item">
                    <span className="stat-label">Total Usage:</span>
                    <span className="stat-value">{stat.totalUsage ?? 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Last Used:</span>
                    <span className="stat-value">{stat.lastUsed ? formatDate(stat.lastUsed) : 'Never'}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Workouts:</span>
                    <span className="stat-value">{stat.count ?? 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="workouts-section">
          <h2>{activeTab === 'admin' ? 'Fit Journey Workouts' : 'User Created Workouts'}</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Intensity</th>
                  <th>Usage</th>
                  <th>Status</th>
                  <th>Last Used</th>
                  <th>Created By</th>
                  {activeTab === 'admin' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {(activeTab === 'admin' ? adminWorkouts : userWorkouts).map((workout) => (
                  <tr key={workout._id}>
                    <td>{workout.name}</td>
                    <td>{workout.workoutType}</td>
                    <td>{workout.duration} min</td>
                    <td>
                      <span className={`intensity-badge ${workout.intensityLevel}`}>
                        {workout.intensityLevel}
                      </span>
                    </td>
                    <td>{workout.usageCount || 0}</td>
                    <td>
                      <span className={`status-badge ${workout.completionStatus}`}>
                        {workout.completionStatus}
                      </span>
                    </td>
                    <td>{workout.lastUsed ? formatDate(workout.lastUsed) : 'Never'}</td>
                    <td>{workout.createdBy?.name || workout.createdBy?.email || 'N/A'}</td>
                    {activeTab === 'admin' && (
                      <td className="action-cell">
                        <button 
                          className="text-button edit" 
                          onClick={() => handleEditWorkout(workout)}
                        >
                          Edit
                        </button>
                        <button 
                          className="text-button delete" 
                          onClick={() => handleDeleteWorkout(workout._id)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) { setShowCreateModal(false); setShowEditModal(false); setSelectedWorkout(null); } }} style={{backdropFilter: 'blur(4px)'}}>
          <div className="modal-content" ref={modalRef} style={{maxHeight: '90vh', overflowY: 'auto'}}>
            <div className="modal-header">
              <h2>{showCreateModal ? 'Create Workout' : 'Edit Workout'}</h2>
              <button className="modal-close" onClick={() => { setShowCreateModal(false); setShowEditModal(false); setSelectedWorkout(null); }}>×</button>
            </div>
            <div className="modal-body">
              <WorkoutForm 
                initialData={selectedWorkout} 
                isAdminMode={true} 
                onSuccess={() => { 
                  setShowCreateModal(false); 
                  setShowEditModal(false); 
                  fetchWorkouts(); 
                }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkoutManagement;