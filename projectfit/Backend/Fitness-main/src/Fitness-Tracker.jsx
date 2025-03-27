import React, { useState, useEffect } from 'react';
// Import the CSS file
import './fitness-tracker.css';
import { useNavigate } from "react-router-dom";

function FitnessTracker() {
  // State for workout data
  const [workouts, setWorkouts] = useState(() => {
    const savedWorkouts = localStorage.getItem('workouts');
    return savedWorkouts ? JSON.parse(savedWorkouts) : [];
  });
  const navigate = useNavigate();
  
  // State for tracking form
  const [newWorkout, setNewWorkout] = useState({
    type: 'cardio',
    duration: '',
    distance: '',
    weight: '',
    reps: '',
    sets: '',
    date: new Date().toISOString().substr(0, 10),
    notes: ''
  });
  
  // State for active view
  const [activeView, setActiveView] = useState('dashboard');
  
  // State for goals
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem('goals');
    return savedGoals ? JSON.parse(savedGoals) : {
      weeklyWorkouts: 3,
      weeklyCardioMinutes: 90,
      weeklyStrengthSessions: 2
    };
  });
  
  // State for new goal
  const [newGoal, setNewGoal] = useState({
    type: 'weeklyWorkouts',
    value: ''
  });
  
  // Save workouts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);
  
  // Save goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);
  
  // Handle input changes for new workout form
  const handleWorkoutChange = (e) => {
    const { name, value } = e.target;
    setNewWorkout(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission for adding a new workout
  const handleAddWorkout = (e) => {
    e.preventDefault();
    const workoutToAdd = {
      ...newWorkout,
      id: Date.now()
    };
    
    setWorkouts(prev => [...prev, workoutToAdd]);
    setNewWorkout({
      type: 'cardio',
      duration: '',
      distance: '',
      weight: '',
      reps: '',
      sets: '',
      date: new Date().toISOString().substr(0, 10),
      notes: ''
    });
  };
  
  // Handle deleting a workout
  const handleDeleteWorkout = (id) => {
    setWorkouts(prev => prev.filter(workout => workout.id !== id));
  };
  
  // Handle input changes for new goal form
  const handleGoalChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission for updating a goal
  const handleUpdateGoal = (e) => {
    e.preventDefault();
    setGoals(prev => ({
      ...prev,
      [newGoal.type]: parseInt(newGoal.value)
    }));
    setNewGoal({
      type: 'weeklyWorkouts',
      value: ''
    });
  };
  
  // Calculate weekly stats for current week
  const getWeeklyStats = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const thisWeeksWorkouts = workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= startOfWeek;
    });
    
    return {
      totalWorkouts: thisWeeksWorkouts.length,
      cardioMinutes: thisWeeksWorkouts
        .filter(w => w.type === 'cardio')
        .reduce((total, w) => total + (parseInt(w.duration) || 0), 0),
      strengthSessions: thisWeeksWorkouts
        .filter(w => w.type === 'strength')
        .length
    };
  };
  
  // Get weekly stats
  const weeklyStats = getWeeklyStats();
  
  // Render different views based on activeView state
  const renderView = () => {
    switch(activeView) {
      case 'addWorkout':
        return (
          <div className="card">
            <h2>Add New Workout</h2>
            <form onSubmit={handleAddWorkout}>
              <div>
                <label>Workout Type</label>
                <select 
                  name="type" 
                  value={newWorkout.type} 
                  onChange={handleWorkoutChange}
                >
                  <option value="cardio">Cardio</option>
                  <option value="strength">Strength</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label>Date</label>
                <input 
                  type="date" 
                  name="date" 
                  value={newWorkout.date} 
                  onChange={handleWorkoutChange}
                  required
                />
              </div>
              
              {newWorkout.type === 'cardio' && (
                <>
                  <div>
                    <label>Duration (minutes)</label>
                    <input 
                      type="number" 
                      name="duration" 
                      value={newWorkout.duration} 
                      onChange={handleWorkoutChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Distance (optional)</label>
                    <input 
                      type="number" 
                      name="distance" 
                      value={newWorkout.distance} 
                      onChange={handleWorkoutChange}
                      step="0.01"
                    />
                  </div>
                </>
              )}
              
              {newWorkout.type === 'strength' && (
                <>
                  <div>
                    <label>Sets</label>
                    <input 
                      type="number" 
                      name="sets" 
                      value={newWorkout.sets} 
                      onChange={handleWorkoutChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Reps</label>
                    <input 
                      type="number" 
                      name="reps" 
                      value={newWorkout.reps} 
                      onChange={handleWorkoutChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Weight (optional)</label>
                    <input 
                      type="number" 
                      name="weight" 
                      value={newWorkout.weight} 
                      onChange={handleWorkoutChange}
                      step="0.5"
                    />
                  </div>
                </>
              )}
              
              <div>
                <label>Notes</label>
                <textarea 
                  name="notes" 
                  value={newWorkout.notes} 
                  onChange={handleWorkoutChange}
                  rows="3"
                />
              </div>
              
              <button type="submit">Add Workout</button>
            </form>
          </div>
        );
        
      case 'history':
        return (
          <div className="card">
            <h2>Workout History</h2>
            {workouts.length === 0 ? (
              <p>No workouts recorded yet. Start by adding your first workout!</p>
            ) : (
              <div className="workout-list">
                {[...workouts]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map(workout => (
                    <div key={workout.id} className="workout-item">
                      <div className="workout-header">
                        <h3 className="workout-title">{workout.type}</h3>
                        <span className="workout-date">{workout.date}</span>
                      </div>
                      
                      {workout.type === 'cardio' && (
                        <div className="workout-details">
                          <p>Duration: {workout.duration} minutes</p>
                          {workout.distance && <p>Distance: {workout.distance} km</p>}
                        </div>
                      )}
                      
                      {workout.type === 'strength' && (
                        <div className="workout-details">
                          <p>Sets: {workout.sets} × Reps: {workout.reps}</p>
                          {workout.weight && <p>Weight: {workout.weight} kg</p>}
                        </div>
                      )}
                      
                      {workout.notes && (
                        <div className="workout-notes">
                          <p>{workout.notes}</p>
                        </div>
                      )}
                      
                      <button 
                        onClick={() => handleDeleteWorkout(workout.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        );
        
      case 'goals':
        return (
          <div className="card">
            <h2>Fitness Goals</h2>
            
            <div className="mb-6">
              <h3>Current Goals</h3>
              <div className="space-y-4">
                <div className="goal-card">
                  <p>Weekly Workouts: {goals.weeklyWorkouts}</p>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill blue" 
                      style={{ width: `${Math.min((weeklyStats.totalWorkouts / goals.weeklyWorkouts) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="goal-progress">
                    Progress: {weeklyStats.totalWorkouts} / {goals.weeklyWorkouts}
                  </p>
                </div>
                
                <div className="goal-card">
                  <p>Weekly Cardio Minutes: {goals.weeklyCardioMinutes}</p>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill green" 
                      style={{ width: `${Math.min((weeklyStats.cardioMinutes / goals.weeklyCardioMinutes) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="goal-progress">
                    Progress: {weeklyStats.cardioMinutes} / {goals.weeklyCardioMinutes}
                  </p>
                </div>
                
                <div className="goal-card">
                  <p>Weekly Strength Sessions: {goals.weeklyStrengthSessions}</p>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill purple" 
                      style={{ width: `${Math.min((weeklyStats.strengthSessions / goals.weeklyStrengthSessions) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="goal-progress">
                    Progress: {weeklyStats.strengthSessions} / {goals.weeklyStrengthSessions}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3>Update Goal</h3>
              <form onSubmit={handleUpdateGoal}>
                <div>
                  <label>Goal Type</label>
                  <select 
                    name="type" 
                    value={newGoal.type} 
                    onChange={handleGoalChange}
                  >
                    <option value="weeklyWorkouts">Weekly Workouts</option>
                    <option value="weeklyCardioMinutes">Weekly Cardio Minutes</option>
                    <option value="weeklyStrengthSessions">Weekly Strength Sessions</option>
                  </select>
                </div>
                
                <div>
                  <label>Target Value</label>
                  <input 
                    type="number" 
                    name="value" 
                    value={newGoal.value} 
                    onChange={handleGoalChange}
                    required
                  />
                </div>
                
                <button type="submit">Update Goal</button>
              </form>
            </div>
          </div>
        );
        
      default: // dashboard
        return (
          <div className="space-y-6">
            <div className="card">
              <h2>Weekly Progress</h2>
              <div className="stats-grid">
                <div className="stat-card blue">
                  <h3>Workouts Completed</h3>
                  <p className="stat-value">{weeklyStats.totalWorkouts} / {goals.weeklyWorkouts}</p>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill blue" 
                      style={{ width: `${Math.min((weeklyStats.totalWorkouts / goals.weeklyWorkouts) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="stat-card green">
                  <h3>Cardio Minutes</h3>
                  <p className="stat-value">{weeklyStats.cardioMinutes} / {goals.weeklyCardioMinutes}</p>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill green" 
                      style={{ width: `${Math.min((weeklyStats.cardioMinutes / goals.weeklyCardioMinutes) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="stat-card purple">
                  <h3>Strength Sessions</h3>
                  <p className="stat-value">{weeklyStats.strengthSessions} / {goals.weeklyStrengthSessions}</p>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill purple" 
                      style={{ width: `${Math.min((weeklyStats.strengthSessions / goals.weeklyStrengthSessions) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h2>Recent Workouts</h2>
              {workouts.length === 0 ? (
                <p>No workouts recorded yet. Start by adding your first workout!</p>
              ) : (
                <div className="space-y-3">
                  {[...workouts]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 3)
                    .map(workout => (
                      <div key={workout.id} className="workout-item">
                        <div className="workout-header">
                          <h3 className="workout-title">{workout.type}</h3>
                          <span className="workout-date">{workout.date}</span>
                        </div>
                        
                        {workout.type === 'cardio' && (
                          <p className="text-sm">{workout.duration} minutes</p>
                        )}
                        
                        {workout.type === 'strength' && (
                          <p className="text-sm">{workout.sets} sets × {workout.reps} reps</p>
                        )}
                      </div>
                    ))}
                  <button
                    onClick={() => setActiveView('history')}
                    className="view-all"
                  >
                    View all workouts →
                  </button>
                </div>
              )}
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen">
      <header>
        <div className="container">
          <h1>Fitness Tracker</h1>
        </div>
      </header>
      
      <nav>
        <div className="container">
          <div className="flex">
            <button
              onClick={() => setActiveView('dashboard')}
              className={activeView === 'dashboard' ? 'active' : ''}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveView('addWorkout')}
              className={activeView === 'addWorkout' ? 'active' : ''}
            >
              Add Workout
            </button>
            <button
              onClick={() => setActiveView('history')}
              className={activeView === 'history' ? 'active' : ''}
            >
              History
            </button>
            <button
              onClick={() => setActiveView('goals')}
              className={activeView === 'goals' ? 'active' : ''}
            >
            
              Goals
            </button>
          
            <button onClick={() => navigate('/login')}>Login</button>
            <button
              onClick={() => navigate('/signup')}
              
            >
            
              SignUp
            </button>
          </div>
        </div>
      </nav>
      
      <main className="container">
        {renderView()}
      </main>
      
      <footer>
        <p>© 2025 Fitness Tracker - Track your progress, achieve your goals</p>
      </footer>
    </div>
  );
}

export default FitnessTracker;