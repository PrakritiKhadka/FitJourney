import { create } from 'zustand';

const useWorkoutStore = create((set, get) => ({
  formData: {
    workoutType: '',
    duration: '',
    intensityLevel: 'medium',
    date: new Date().toISOString().substr(0, 10),
    time: '',
    notes: ''
  },
  
  setField: (name, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [name]: value
      }
    })),
  
  resetForm: () =>
    set({
      formData: {
        workoutType: '',
        duration: '',
        intensityLevel: 'medium',
        date: new Date().toISOString().substr(0, 10),
        time: '',
        notes: ''
      }
    }),
  
  submitWorkout: async () => {
    const { formData } = get();
    console.log("Submitting workout data:", formData);
    
    try {
      const res = await fetch('http://localhost:5000/api/workouts/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      console.log("Server response:", data);
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save workout');
      }
      
      return { success: true };
    } catch (err) {
      console.error('Error:', err.message);
      return { success: false, error: err.message };
    }
  }
}));

export default useWorkoutStore;