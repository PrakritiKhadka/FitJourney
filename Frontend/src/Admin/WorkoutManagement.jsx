import React, { useState } from 'react';
import { Dumbbell,ArrowLeft } from 'lucide-react';
import './WorkoutManagement.css';

// Workout Management Component
function WorkoutManagement() {
  const [workouts, setWorkouts] = useState([
    { id: 1, name: "Beginner Full Body", category: "Strength", difficulty: "Beginner", duration: "30 min" },
    { id: 2, name: "HIIT Cardio Blast", category: "Cardio", difficulty: "Advanced", duration: "20 min" },
    { id: 3, name: "Core Focus", category: "Core", difficulty: "Intermediate", duration: "15 min" },
    { id: 4, name: "Upper Body Power", category: "Strength", difficulty: "Intermediate", duration: "45 min" },
    { id: 5, name: "Yoga Flow", category: "Flexibility", difficulty: "Beginner", duration: "60 min" },
  ]);

  // Function to handle deleting a workout
  const handleDeleteWorkout = (id) => {
    setWorkouts(workouts.filter(workout => workout.id !== id));
  };

  // Function to handle editing a workout (placeholder)
  const handleEditWorkout = (id) => {
    // In a real application, this would open a modal or redirect to an edit page
    console.log(`Editing workout with id: ${id}`);
  };

  // Function to handle creating a new workout (placeholder)
  const handleCreateWorkout = () => {
    // In a real application, this would open a modal or redirect to a creation page
    console.log('Creating new workout');
  };

  return (
    <div className="workout-container">
      <div className="back-button-container">
              <a href="/AdminPanel" className="back-button">
                <ArrowLeft className="back-icon" />
                <span>Go Back</span>
              </a>
            </div>
      {/* Header */}
      <div className="page-header">
        <div className="header-icon">
          <Dumbbell className="icon" />
        </div>
        <h2 className="page-title">Workout Management</h2>
      </div>

      {/* Main Content */}
      <div className="panel-section">
        <div className="content-card">
          <div className="card-header">
            <h3 className="section-title">Workout Plans</h3>
            <button 
              className="action-button primary"
              onClick={handleCreateWorkout}
            >
              Create Workout
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {workouts.map((workout) => (
                  <tr key={workout.id}>
                    <td>{workout.name}</td>
                    <td>{workout.category}</td>
                    <td>{workout.difficulty}</td>
                    <td>{workout.duration}</td>
                    <td className="action-cell">
                      <button 
                        className="text-button edit"
                        onClick={() => handleEditWorkout(workout.id)}
                      >
                        Edit
                      </button>
                      <button 
                        className="text-button delete"
                        onClick={() => handleDeleteWorkout(workout.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkoutManagement;