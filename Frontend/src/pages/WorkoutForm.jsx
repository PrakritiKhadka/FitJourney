import React, { useState, useEffect } from 'react';
import useWorkoutStore from '../store/workout.js';
import '../styles/WorkoutForm.css';

const WorkoutForm = () => {
  const {
    formData,
    setField,
    resetForm,
    submitWorkout,
  } = useWorkoutStore();
  
  const [submitted, setSubmitted] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.workoutType || !formData.duration || !formData.intensityLevel || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Submit the workout
    const result = await submitWorkout();
    
    if (result.success) {
      setSubmitted(true);
      // Store data to display in the success popup
      setSuccessData({
        workoutType: formData.workoutType,
        duration: formData.duration,
        intensityLevel: formData.intensityLevel,
        date: new Date(formData.date).toLocaleDateString(),
      });
      setShowPopup(true);
      resetForm(); // Reset the form on success
      
      // Auto hide the popup after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setShowPopup(false);
      }, 5000);
    } else {
      alert('Failed to log workout: ' + (result.error || 'Unknown error'));
    }
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPopup && !event.target.closest('.success-popup-content')) {
        setShowPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopup]);

  const workoutTypes = [
    'Running', 'Walking', 'Cycling', 'Swimming', 'Weight Training', 
    'HIIT', 'Yoga', 'Pilates', 'CrossFit', 'Other'
  ];

  const getIntensityIcon = (level) => {
    switch(level) {
      case 'low': return '🚶';
      case 'medium': return '🏃';
      case 'high': return '🔥';
      default: return '🏋️';
    }
  };

  const getIntensityColor = (level) => {
    switch(level) {
      case 'low': return 'green';
      case 'medium': return 'blue';
      case 'high': return 'orange';
      default: return 'blue';
    }
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <div className="form-card">
          <h2 className="form-title">
            <span className="icon">🔥</span> Track Workout
          </h2>

          {/* Enhanced Success Popup */}
          {showPopup && successData && (
            <div className="success-popup-overlay">
              <div className="success-popup-content">
                <div className="success-popup-header">
                  <div className="success-icon-container">
                    <svg className="checkmark-circle" viewBox="0 0 52 52">
                      <circle className="checkmark-circle-bg" cx="26" cy="26" r="25" fill="none"/>
                      <circle className="checkmark-circle-fill" cx="26" cy="26" r="25" fill="none"/>
                      <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                  </div>
                  <h3>Workout Logged Successfully!</h3>
                  <button className="close-popup" onClick={() => setShowPopup(false)}>×</button>
                </div>
                
                <div className="success-popup-body">
                  <div className="workout-summary">
                    <div className="summary-item">
                      <span className="summary-label">Activity:</span>
                      <span className="summary-value">{successData.workoutType}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Duration:</span>
                      <span className="summary-value">{successData.duration} minutes</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Intensity:</span>
                      <span className={`summary-value intensity-${getIntensityColor(successData.intensityLevel)}`}>
                        {getIntensityIcon(successData.intensityLevel)} {successData.intensityLevel.charAt(0).toUpperCase() + successData.intensityLevel.slice(1)}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Date:</span>
                      <span className="summary-value">{successData.date}</span>
                    </div>
                  </div>
                  
                  <div className="motivation-message">
                    <p>Great job! Keep up the momentum. 💪</p>
                    <div className="streak-info">
                      {/* You could add workout streak information here */}
                      <span>You're on a roll!</span>
                    </div>
                  </div>
                </div>
                
                <div className="success-popup-footer">
                  <button 
                    className="view-history-btn"
                    onClick={() => {
                      setShowPopup(false);
                      // You could add navigation to history page here
                    }}
                  >
                    View History
                  </button>
                  <button 
                    className="add-another-btn"
                    onClick={() => setShowPopup(false)}
                  >
                    Add Another Workout
                  </button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-fields">
              <div className="form-field">
                <label>Workout Type</label>
                <select
                  name="workoutType"
                  value={formData.workoutType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select workout type</option>
                  {workoutTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </div>

              <div className="form-field">
                <label>Intensity Level</label>
                <div className="intensity-selector">
                  {[
                    { level: 'low', label: 'Low', color: 'green', icon: '🚶' },
                    { level: 'medium', label: 'Medium', color: 'blue', icon: '🏃' },
                    { level: 'high', label: 'High', color: 'orange', icon: '🔥' }
                  ].map((option) => (
                    <div
                      key={option.level}
                      onClick={() => setField('intensityLevel', option.level)}
                      className={`intensity-option ${option.color} ${formData.intensityLevel === option.level ? 'selected' : ''}`}
                    >
                      <span className="intensity-icon">{option.icon}</span>
                      <span className="intensity-label">{option.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="date-time-container">
                <div className="form-field">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="How did you feel during this workout?"
                ></textarea>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="reset-button" onClick={resetForm}>
                Reset
              </button>
              <button type="submit" className="submit-button">
                Save Workout
              </button>
            </div>
          </form>
        </div>

        <div className="form-footer">
          <div className="brand-name">FIT JOURNEY</div>
          <div className="color-dots">
            <div className="dot green"></div>
            <div className="dot blue"></div>
            <div className="dot orange"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutForm;