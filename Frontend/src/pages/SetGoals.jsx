import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGoalStore from '../store/goal';
import useUserStore from '../store/user';
import '../styles/SetGoals.css';

const SetGoals = () => {
  const navigate = useNavigate();
  const { goals, loading, error, fetchGoals, createGoal, updateGoal, deleteGoal } = useGoalStore();
  const { user, isAuthenticated, checkAuth } = useUserStore();
  const [newGoal, setNewGoal] = useState({
    title: '',
    type: 'loss',
    targetDate: '',
    currentValue: '',
    targetValue: ''
  });
  const [updateValues, setUpdateValues] = useState({});
  const [authChecked, setAuthChecked] = useState(false);

  // Check authentication on load
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const isAuthed = await checkAuth();
        setAuthChecked(true);
        if (!isAuthed) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login');
      }
    };

    verifyAuth();
  }, [checkAuth, navigate]);

  // Fetch goals when authenticated
  useEffect(() => {
    if (isAuthenticated && authChecked) {
      fetchGoals().catch(error => {
        console.error('Error fetching goals:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      });
    }
  }, [isAuthenticated, authChecked, fetchGoals, navigate]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewGoal(prev => ({
      ...prev,
      [id.replace('goal-', '')]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createGoal({
        ...newGoal,
        currentValue: parseFloat(newGoal.currentValue) || 0,
        targetValue: parseFloat(newGoal.targetValue) || 0
      });
      
      // Clear form after successful submission
      setNewGoal({
        title: '',
        type: 'loss',
        targetDate: '',
        currentValue: '',
        targetValue: ''
      });
      
      // Refresh goals
      fetchGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleUpdateChange = (goalId, value) => {
    setUpdateValues(prev => ({
      ...prev,
      [goalId]: value
    }));
  };

  const handleUpdateGoal = async (goalId) => {
    if (!updateValues[goalId] && updateValues[goalId] !== 0) return;
    
    try {
      await updateGoal(goalId, parseFloat(updateValues[goalId]));
      
      // Clear the update value after successful update
      setUpdateValues(prev => {
        const newValues = {...prev};
        delete newValues[goalId];
        return newValues;
      });
      
      // Refresh goals to show updated progress
      fetchGoals();
    } catch (error) {
      console.error('Error updating goal:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await deleteGoal(goalId);
    } catch (error) {
      console.error('Error deleting goal:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    if (dateString === 'Ongoing') return 'Ongoing';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProgressColor = (progress, type) => {
    if (progress >= 80) return 'progress-high';
    if (progress >= 40) return 'progress-medium';
    return 'progress-low';
  };

  // Show loading while checking auth
  if (!authChecked) {
    return <div className="loading">Checking authentication...</div>;
  }

  // Redirect if not authenticated (this is a fallback, the useEffect should handle this)
  if (!isAuthenticated) {
    return <div className="loading">Redirecting to login...</div>;
  }

  if (loading) return <div className="loading">Loading goals...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="container">
      <header>
        <h1>Fitness Goals Tracker</h1>
        {user && <p>Welcome, {user.name}!</p>}
      </header>
      
      <div className="goal-section">
        <h2>Set New Goal</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="goal-title">Goal Title</label>
            <input 
              type="text" 
              id="goal-title" 
              value={newGoal.title}
              onChange={handleInputChange}
              required
              placeholder="Enter goal title"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="goal-type">Goal Type</label>
            <select 
              id="goal-type" 
              value={newGoal.type}
              onChange={handleInputChange}
              required
            >
              <option value="loss">Weight Loss</option>
              <option value="gain">Muscle Gain</option>
              <option value="maintain">Maintain</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="goal-targetDate">Target Date</label>
            <input 
              type="date" 
              id="goal-targetDate"
              value={newGoal.targetDate}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="goal-currentValue">Current Value</label>
            <input 
              type="number" 
              id="goal-currentValue" 
              value={newGoal.currentValue}
              onChange={handleInputChange}
              required
              placeholder="Current value (e.g., 180 lbs)"
              min="0"
              step="0.1"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="goal-targetValue">Target Value</label>
            <input 
              type="number" 
              id="goal-targetValue" 
              value={newGoal.targetValue}
              onChange={handleInputChange}
              required
              placeholder="Target value (e.g., 160 lbs)"
              min="0"
              step="0.1"
            />
          </div>
          
          <button type="submit" className="btn">Save Goal</button>
        </form>
      </div>
      
      <div className="goal-section">
        <h2>Your Goals</h2>
        {goals.length === 0 ? (
          <div className="no-goals">You haven't set any goals yet. Create one above to get started!</div>
        ) : (
          <div className="goals-list">
            {goals.map(goal => (
              <div className="goal-card" key={goal._id}>
                <div className="goal-header">
                  <h3>{goal.title}</h3>
                  <button 
                    className="delete-btn"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this goal?')) {
                        handleDeleteGoal(goal._id);
                      }
                    }}
                    aria-label="Delete goal"
                  >
                    ×
                  </button>
                </div>
                <div className="goal-meta">
                  <span className={`goal-type ${goal.type}`}>
                    {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)}
                  </span>
                  <span className="goal-date">
                    Target: {formatDate(goal.targetDate)}
                  </span>
                </div>
                <div className="goal-values">
                  Current: {goal.currentValue} 
                  {goal.type !== 'maintain' && ` → Target: ${goal.targetValue}`}
                </div>
                <div className="goal-progress">
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${getProgressColor(goal.progress, goal.type)}`}
                      style={{ width: `${goal.progress}%` }}
                    >
                      <span className="progress-text">{goal.progress}%</span>
                    </div>
                  </div>
                </div>
                <div className="update-section">
                  <input
                    type="number"
                    className="update-input"
                    placeholder="Update current value"
                    value={updateValues[goal._id] || ''}
                    onChange={(e) => handleUpdateChange(goal._id, e.target.value)}
                    min="0"
                    step="0.1"
                  />
                  <button 
                    className="update-btn"
                    onClick={() => handleUpdateGoal(goal._id)}
                    disabled={!updateValues[goal._id] && updateValues[goal._id] !== 0}
                  >
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SetGoals;