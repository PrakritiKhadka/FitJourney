import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, ArrowLeft, BarChart2, Plus } from 'lucide-react';
import './WorkoutManagement.css';
import WorkoutForm from '../pages/WorkoutForm';
import useUserStore from "../store/user";
import axios from 'axios';


// Workout Management Component
function WorkoutManagement() {
  const [workouts, setWorkouts] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalWorkouts: 0,
    totalCompleted: 0,
    totalDurationCompleted: 0,
    totalUsage: 0,
    userWorkouts: {
      totalWorkouts: 0,
      totalCompleted: 0,
      totalDurationCompleted: 0
    },
    adminWorkouts: {
      totalWorkouts: 0,
      totalCompleted: 0,
      totalDurationCompleted: 0
    }
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
  const { user } = useUserStore();

  useEffect(() => {
    fetchWorkouts();
    fetchSummaryStats(activeTab);
  }, []);

  useEffect(() => {
    fetchSummaryStats(activeTab);
  }, [activeTab, workouts]);

  const fetchWorkouts = async () => {
    try {
      setIsLoading(true);
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

  const fetchSummaryStats = async () => {
    try {
      const response = await axios.get(`/api/workouts/stats`);
      if (response.data && response.data.success) {
        setSummaryStats(response.data.data);
      }
    } catch {
      // fallback: set to zero
      setSummaryStats({
        totalWorkouts: 0,
        totalCompleted: 0,
        totalDurationCompleted: 0,
        totalUsage: 0,
        userWorkouts: {
          totalWorkouts: 0,
          totalCompleted: 0,
          totalDurationCompleted: 0
        },
        adminWorkouts: {
          totalWorkouts: 0,
          totalCompleted: 0,
          totalDurationCompleted: 0
        }
      });
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
        <div className="stats-section stats-cards-row">
          <div className="stat-card small">
            <div className="stat-label">Total Workouts</div>
            <div className="stat-value">
              {activeTab === 'admin' 
                ? summaryStats.adminWorkouts.totalWorkouts 
                : summaryStats.userWorkouts.totalWorkouts}
            </div>
          </div>
          <div className="stat-card small">
            <div className="stat-label">Total Workouts Completed</div>
            <div className="stat-value">
              {activeTab === 'admin' 
                ? summaryStats.adminWorkouts.totalCompleted 
                : summaryStats.userWorkouts.totalCompleted}
            </div>
          </div>
          <div className="stat-card small">
            <div className="stat-label">Total Duration Completed</div>
            <div className="stat-value">
              {activeTab === 'admin' 
                ? summaryStats.adminWorkouts.totalDurationCompleted 
                : summaryStats.userWorkouts.totalDurationCompleted} min
            </div>
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