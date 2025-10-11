-- Create workout_sessions table for logging workout activity
CREATE TABLE public.workout_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  workout_id UUID,
  workout_name TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration INTEGER NOT NULL, -- in minutes
  calories_burned INTEGER DEFAULT 0,
  sets_completed INTEGER DEFAULT 0,
  reps_completed INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own workout sessions"
ON public.workout_sessions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workout sessions"
ON public.workout_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout sessions"
ON public.workout_sessions
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout sessions"
ON public.workout_sessions
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_workout_sessions_updated_at
BEFORE UPDATE ON public.workout_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create preset_meals table for saved meal presets
CREATE TABLE public.preset_meals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  meal_name TEXT NOT NULL,
  meal_type TEXT NOT NULL,
  total_calories INTEGER NOT NULL DEFAULT 0,
  total_protein INTEGER NOT NULL DEFAULT 0,
  total_carbs INTEGER NOT NULL DEFAULT 0,
  total_fats INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.preset_meals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own preset meals"
ON public.preset_meals
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preset meals"
ON public.preset_meals
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preset meals"
ON public.preset_meals
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preset meals"
ON public.preset_meals
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_preset_meals_updated_at
BEFORE UPDATE ON public.preset_meals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();