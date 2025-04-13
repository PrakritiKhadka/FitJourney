import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/FitJourneyDashboard.css';
import useWorkoutStore from '../store/workout'; // Import your workout store

const FitJourneyDashboard = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch workouts on component mount
  useEffect(() => {
    const fetchWorkouts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/workouts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch workouts');
        }
        
        setWorkouts(data.data);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWorkouts();
  }, []);
  
  // Format date to display nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  };
  
  return (
    <div className="container">
      <div className="app-title">Fit Journey</div>
      
      <div className="user-profile">
        <button 
          className="btn btn-profile" 
          onClick={() => navigate("/Profile")}
        >
          View Profile
        </button>
      </div>
      
      <div className="action-buttons">
        <button className="btn btn-primary" onClick={() => navigate("/SetGoals")}>🎯 Set New Goal</button>
        <button className="btn btn-secondary" onClick={() => navigate("/progress")}>📊 View Progress</button>
        <button className="btn btn-accent" onClick={() => navigate("/WorkoutForm")}>➕ Log Workout</button>
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-card progress-card">
          <h3>
            <span className="card-icon icon-blue">📈</span>
            Your Progress
          </h3>
          <div className="progress-chart">Weekly Progress Chart (Last 8 Weeks)</div>
        </div>
        
        <div className="dashboard-card stats-card">
          <h3>
            <span className="card-icon icon-green">📊</span>
            Stats Overview
          </h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">12</div>
              <div className="stat-label">Workouts This Month</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">87%</div>
              <div className="stat-label">Goal Completion</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">3.2k</div>
              <div className="stat-label">Calories Burned</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">4</div>
              <div className="stat-label">Active Days</div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card workout-card">
          <h3>
            <span className="card-icon icon-orange">🏋️</span>
            Recent Workouts
          </h3>
          
          {isLoading ? (
            <div className="workout-loading">Loading recent workouts...</div>
          ) : error ? (
            <div className="workout-error">Error loading workouts: {error}</div>
          ) : (
            <div className="workout-grid">
              {workouts.length > 0 ? (
                workouts.slice(0, 4).map((workout, index) => (
                  <div className="workout-item" key={workout._id || index}>
                    <div className="workout-type">{workout.workoutType}</div>
                    <div className="workout-date">{formatDate(workout.date)}</div>
                    <div className="workout-stats">
                      <span>{workout.intensityLevel} intensity</span>
                      <span>{workout.duration} min</span>
                      {workout.notes && <span>{workout.notes.substring(0, 15)}{workout.notes.length > 15 ? '...' : ''}</span>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-workouts-message">
                  No workouts logged yet. Click "Log Workout" to add your first workout!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FitJourneyDashboard;