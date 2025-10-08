export interface ExerciseTemplate {
  id: number;
  name: string;
  category: string;
  duration?: string;
}

export const EXERCISE_LIST: ExerciseTemplate[] = [
  // Upper Body
  { id: 1, name: "Push-ups", category: "Upper Body", duration: "5:30" },
  { id: 2, name: "Bench Press", category: "Upper Body", duration: "4:15" },
  { id: 3, name: "Pull-ups", category: "Upper Body", duration: "6:00" },
  { id: 4, name: "Shoulder Press", category: "Upper Body", duration: "5:00" },
  { id: 5, name: "Bicep Curls", category: "Upper Body", duration: "4:00" },
  { id: 6, name: "Tricep Dips", category: "Upper Body", duration: "4:30" },
  
  // Lower Body
  { id: 7, name: "Squats", category: "Lower Body", duration: "7:00" },
  { id: 8, name: "Deadlifts", category: "Lower Body", duration: "6:30" },
  { id: 9, name: "Lunges", category: "Lower Body", duration: "5:45" },
  { id: 10, name: "Leg Press", category: "Lower Body", duration: "4:30" },
  { id: 11, name: "Calf Raises", category: "Lower Body", duration: "3:30" },
  { id: 12, name: "Romanian Deadlifts", category: "Lower Body", duration: "5:00" },
  
  // Core
  { id: 13, name: "Planks", category: "Core", duration: "4:00" },
  { id: 14, name: "Crunches", category: "Core", duration: "3:30" },
  { id: 15, name: "Russian Twists", category: "Core", duration: "4:15" },
  { id: 16, name: "Mountain Climbers", category: "Core", duration: "5:00" },
  { id: 17, name: "Leg Raises", category: "Core", duration: "4:00" },
  { id: 18, name: "Bicycle Crunches", category: "Core", duration: "4:30" },
];

export const getExercisesByCategory = () => {
  const categories = ["Upper Body", "Lower Body", "Core"];
  return categories.map(category => ({
    category,
    exercises: EXERCISE_LIST.filter(ex => ex.category === category)
  }));
};
