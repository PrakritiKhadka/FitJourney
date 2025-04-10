import React, { useState } from 'react';
import useWorkoutStore from '../store/workout.js';
import '../styles/WorkoutForm.css';

const WorkoutForm = () => {
  const {
    formData,
    setField,
    resetForm,
    submitWorkout
  } = useWorkoutStore();
  
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submitWorkout();
    if (result.success) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } else {
      alert('Failed to log workout: ' + result.error);
    }
  };

  const workoutTypes = [
    'Running', 'Walking', 'Cycling', 'Swimming', 'Weight Training', 
    'HIIT', 'Yoga', 'Pilates', 'CrossFit', 'Other'
  ];

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <div className="form-card">
          <h2 className="form-title">
            <span className="icon">🔥</span> Track Workout
          </h2>

          {submitted && (
            <div className="success-message">
              <div className="success-content">
                <div className="success-icon">
                  <svg className="checkmark" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="success-text">
                  <p>Workout logged successfully!</p>
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