import React from 'react';
import '../styles/Aboutus.css';
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
    const navigate = useNavigate();
  // Sample data for recommended workouts
  const recommendedWorkouts = [
    {
      id: 1,
      title: "30-Day HIIT Challenge",
      description: "High-intensity interval training to boost metabolism and build strength.",
      level: "Intermediate",
      duration: "20-30 min/day"
    },
    {
      id: 2,
      title: "Yoga for Beginners",
      description: "Gentle flows focused on flexibility and mindfulness.",
      level: "Beginner",
      duration: "45 min/day"
    },
    {
      id: 3,
      title: "Strength Training Fundamentals",
      description: "Essential weight lifting routines for building muscle.",
      level: "All Levels",
      duration: "40-60 min/day"
    }
  ];

  // Sample data for user vlogs with stories
  const userVlogs = [
    {
      id: 1,
      name: "Sarah K.",
      title: "How I Lost 30 Pounds in 6 Months",
      thumbnail: "/api/placeholder/300/200",
      views: "15.2K",
      story: "When I started with Fit Journey, I was skeptical about another fitness platform. But the personalized tracking helped me see patterns I never noticed before. Six months later, I'm down 30 pounds and have more energy than ever."
    },
    {
      id: 2,
      name: "Mike T.",
      title: "My Marathon Training Journey",
      thumbnail: "/api/placeholder/300/200",
      views: "8.7K",
      story: "Training for my first marathon seemed impossible until I started using Fit Journey to track my runs. The website helped me gradually increase mileage while monitoring recovery. Crossed the finish line last month and already planning my next race!"
    },
    {
      id: 3,
      name: "Aisha J.",
      title: "From Couch to 5K: A Beginner's Story",
      thumbnail: "/api/placeholder/300/200",
      views: "12.3K",
      story: "As someone who had never run before, the Couch to 5K program on Fit Journey was a game-changer. The progress tracking kept me motivated even on tough days. Three months later, I completed my first 5K and I'm now training for a 10K."
    }
  ];

  // Stats for fitness tracking (Removed the rating stat)
  const stats = [
    { id: 1, number: "50K+", label: "Active Users" },
    { id: 2, number: "2.3M", label: "Workouts Completed" },
    { id: 3, number: "186K", label: "Goals Achieved" }
  ];

  return (
    <div className="about-us-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1>About Fit Journey</h1>
        <p className="tagline">Track. Progress. Achieve.</p>
      </div>

      {/* Introduction Section */}
      <section className="intro-section">
        <div className="intro-content">
          <h2>Our Mission</h2>
          <p>
            At Fit Journey, we believe fitness tracking should be motivational, not complicated. 
            Founded in 2020, we've built a powerful yet intuitive platform that helps over 50,000 members 
            monitor progress, set achievable goals, and celebrate every milestone.
          </p>
          <p>
            Our team of fitness experts, data scientists, and UX specialists have created a system that 
            adapts to your unique body metrics, exercise patterns, and wellness objectives. Fit Journey isn't 
            just about counting steps—it's about mapping your complete fitness story with insightful analytics 
            and personalized recommendations.
          </p>
        </div>
        <div className="intro-image">
          <img src="/api/placeholder/400/300" alt="Fit Journey website dashboard" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        {stats.map(stat => (
          <div key={stat.id} className="stat-card">
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="activity-indicator">
              <div className="activity-bar" style={{ width: `${75 + Math.random() * 25}%` }}></div>
            </div>
          </div>
        ))}
      </section>

      {/* Recommended Workouts Section */}
      <section className="workouts-section">
        <h2>Recommended Workouts</h2>
        <p>Discover fitness routines with detailed tracking and progress visualization.</p>
        
        <div className="workout-cards">
          {recommendedWorkouts.map(workout => (
            <div key={workout.id} className="workout-card">
              <h3>{workout.title}</h3>
              <p>{workout.description}</p>
              <div className="workout-details">
                <span className="level">Level: {workout.level}</span>
                <span className="duration">Duration: {workout.duration}</span>
              </div>
              {/* Removed View Details button as requested */}
            </div>
          ))}
        </div>
      </section>

      {/* User Vlogs Section */}
      <section className="vlogs-section">
        <h2>Success Stories</h2>
        <p>Real progress tracked and shared by our community members.</p>
        
        <div className="story-cards">
            {userVlogs.map(vlog => (
            <div key={vlog.id} className="story-card">
                <div className="story-content">
                <h3>{vlog.title}</h3>
                <p className="story-author">By {vlog.name}</p>
                <p className="story-text">{vlog.story}</p>
                </div>
            </div>
            ))}
        </div>
      </section>

      {/* Join Us Section */}
      <section className="join-section">
        <h2>Start Tracking Your Fit Journey Today</h2>
        <p>Join thousands of members who are visualizing their progress and achieving their fitness goals.</p>
        <button className="join-btn" onClick={() => navigate("/SignupPage")}>
          Start your Journey
        </button>
      </section>
    </div>
  );
};

export default AboutUs;
