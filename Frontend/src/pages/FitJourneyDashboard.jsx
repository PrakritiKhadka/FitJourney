import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/FitJourneyDashboard.css';

const FitJourneyDashboard = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [popularWorkouts, setPopularWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentError, setRecentError] = useState(null);
  const [popularError, setPopularError] = useState(null);
  const [recommendedWorkouts, setRecommendedWorkouts] = useState([]);
  const [showAllRecommended, setShowAllRecommended] = useState(false);
  
  // Fetch workouts and popular workouts on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch user's workouts
        const workoutsResponse = await fetch('/api/workouts', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const workoutsData = await workoutsResponse.json();
        
        if (!workoutsResponse.ok) {
          setRecentError(workoutsData.error || 'Failed to fetch workouts');
        } else {
          setWorkouts(workoutsData.data);
          setRecentError(null);
        }

        // Fetch popular workouts (admin workouts sorted by usage)
        const popularResponse = await fetch('/api/workouts/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const popularData = await popularResponse.json();
        
        if (!popularResponse.ok) {
          setPopularError(popularData.error || 'Failed to fetch popular workouts');
        } else {
          setPopularWorkouts(popularData.data);
          setPopularError(null);
          // Recommended: admin-created and popular
          setRecommendedWorkouts(popularData.data.filter(w => w.totalUsage > 0));
        }
      } catch (err) {
        setRecentError('Failed to fetch workouts');
        setPopularError('Failed to fetch popular workouts');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
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

  const handleUseWorkout = async (workoutId) => {
    try {
      const response = await fetch(`/api/workouts/admin/${workoutId}/use`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to use workout');
      }

      // Refresh workouts after using a popular workout
      const workoutsResponse = await fetch('/api/workouts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const workoutsData = await workoutsResponse.json();
      
      if (!workoutsResponse.ok) {
        throw new Error(workoutsData.error || 'Failed to fetch workouts');
      }
      
      setWorkouts(workoutsData.data);
    } catch (err) {
      console.error('Error using workout:', err);
      alert('Failed to use workout: ' + err.message);
    }
  };

  const handleCompleteWorkout = async (workoutId) => {
    try {
      const response = await fetch(`/api/workouts/${workoutId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete workout');
      }

      // Refresh workouts after completing
      const workoutsResponse = await fetch('/api/workouts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const workoutsData = await workoutsResponse.json();
      
      if (!workoutsResponse.ok) {
        throw new Error(workoutsData.error || 'Failed to fetch workouts');
      }
      
      setWorkouts(workoutsData.data);
    } catch (err) {
      console.error('Error completing workout:', err);
      alert('Failed to complete workout: ' + err.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: { bg: '#fef3c7', color: '#92400e' },
      completed: { bg: '#dcfce7', color: '#166534' },
      skipped: { bg: '#fee2e2', color: '#991b1b' }
    };
    
    const style = statusStyles[status] || statusStyles.pending;
    
    return (
      <span style={{
        backgroundColor: style.bg,
        color: style.color,
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '0.875rem',
        fontWeight: '500'
      }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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
          ) : recentError ? (
            <div className="workout-error">Error loading workouts: {recentError}</div>
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
                    <div className="workout-actions">
                      {getStatusBadge(workout.completionStatus)}
                      {workout.completionStatus === 'pending' && (
                        <button 
                          className="complete-btn"
                          onClick={() => handleCompleteWorkout(workout._id)}
                        >
                          Mark Complete
                        </button>
                      )}
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
        
        <div className="dashboard-card popular-workouts-card">
          <h3>
            <span className="card-icon icon-blue">⭐</span>
            Popular Workouts
          </h3>
          
          {isLoading ? (
            <div className="workout-loading">Loading popular workouts...</div>
          ) : popularError ? (
            <div className="workout-error">Error loading popular workouts: {popularError}</div>
          ) : (
            <div className="popular-workouts-grid">
              {popularWorkouts.slice(0, 3).map((workout) => (
                <div key={workout._id} className="popular-workout-item">
                  <div className="workout-type">{workout._id}</div>
                  <div className="workout-stats">
                    <span>Total Usage: {workout.totalUsage}</span>
                    <span>Last Used: {workout.lastUsed ? formatDate(workout.lastUsed) : 'Never'}</span>
                  </div>
                  <button 
                    className="use-workout-btn"
                    onClick={() => handleUseWorkout(workout._id)}
                  >
                    Use This Workout
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="dashboard-card recommended-workouts-card">
          <h3>
            <span className="card-icon icon-blue">💡</span>
            Recommended Workouts
          </h3>
          <div className="popular-workouts-grid">
            {recommendedWorkouts.length > 0 ? (
              <>
                {recommendedWorkouts.slice(0, showAllRecommended ? undefined : 3).map((workout) => (
                  <div key={workout._id} className="popular-workout-item">
                    <div className="workout-type">{workout._id}</div>
                    <div className="workout-stats">
                      <span>Total Usage: {workout.totalUsage}</span>
                      <span>Last Used: {workout.lastUsed ? formatDate(workout.lastUsed) : 'Never'}</span>
                    </div>
                    <button 
                      className="use-workout-btn"
                      onClick={() => handleUseWorkout(workout._id)}
                    >
                      Use This Workout
                    </button>
                  </div>
                ))}
                {!showAllRecommended && recommendedWorkouts.length > 3 && (
                  <button 
                    className="see-more-btn"
                    onClick={() => navigate('/recommended-workouts')}
                  >
                    See More Workouts
                  </button>
                )}
              </>
            ) : (
              <div className="workout-error">No recommended workouts available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitJourneyDashboard;