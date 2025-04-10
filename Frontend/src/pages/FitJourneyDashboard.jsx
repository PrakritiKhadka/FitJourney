import React from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/FitJourneyDashboard.css';

const FitJourneyDashboard = () => {
  const navigate = useNavigate();
  
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
        <button className="btn btn-secondary">📊 View Progress</button>
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
          <div className="workout-grid">
            <div className="workout-item">
              <div className="workout-type">Running</div>
              <div className="workout-date">Today, 7:30 AM</div>
              <div className="workout-stats">
                <span>5.2 km</span>
                <span>28 min</span>
                <span>320 cal</span>
              </div>
            </div>
            
            <div className="workout-item">
              <div className="workout-type">Strength Training</div>
              <div className="workout-date">Yesterday, 6:15 PM</div>
              <div className="workout-stats">
                <span>Upper Body</span>
                <span>45 min</span>
                <span>410 cal</span>
              </div>
            </div>
            
            <div className="workout-item">
              <div className="workout-type">Yoga</div>
              <div className="workout-date">Mar 21, 8:00 AM</div>
              <div className="workout-stats">
                <span>Flexibility</span>
                <span>30 min</span>
                <span>180 cal</span>
              </div>
            </div>
            
            <div className="workout-item">
              <div className="workout-type">Cycling</div>
              <div className="workout-date">Mar 19, 5:30 PM</div>
              <div className="workout-stats">
                <span>12.5 km</span>
                <span>42 min</span>
                <span>380 cal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitJourneyDashboard;