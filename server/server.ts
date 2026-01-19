
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/habitflow';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schemas
const userSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  email: { type: String, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const subTaskSchema = new mongoose.Schema({
  id: String,
  text: String,
  completed: { type: Boolean, default: false }
});

const habitSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  description: String,
  category: String,
  createdAt: { type: Date, default: Date.now },
  completedDays: [String],
  streak: { type: Number, default: 0 },
  color: String,
  subtasks: [subTaskSchema],
  userId: String
});

const noteSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  content: String,
  color: String,
  createdAt: { type: Date, default: Date.now },
  userId: String
});

const User = mongoose.model('User', userSchema);
const Habit = mongoose.model('Habit', habitSchema);
const Note = mongoose.model('Note', noteSchema);

// AUTH ROUTES
app.post('/api/auth/register', async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ id: uuidv4(), name, email, password });
    await newUser.save();
    res.json({ id: newUser.id, name: newUser.name, email: newUser.email });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// HABIT ROUTES
app.get('/api/habits', async (req: Request, res: Response) => {
  try {
    const habits = await Habit.find().sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching habits' });
  }
});

app.post('/api/habits', async (req: Request, res: Response) => {
  try {
    const newHabit = new Habit(req.body);
    await newHabit.save();
    const allHabits = await Habit.find().sort({ createdAt: -1 });
    res.json(allHabits);
  } catch (err) {
    res.status(500).json({ message: 'Error saving habit' });
  }
});

app.delete('/api/habits/:id', async (req: Request, res: Response) => {
  try {
    await Habit.findOneAndDelete({ id: req.params.id });
    const allHabits = await Habit.find().sort({ createdAt: -1 });
    res.json(allHabits);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting habit' });
  }
});

app.patch('/api/habits/:id/toggle', async (req: Request, res: Response): Promise<any> => {
  const { date } = req.body;
  try {
    const habit = await Habit.findOne({ id: req.params.id });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    const isCompleted = habit.completedDays.includes(date);
    if (isCompleted) {
      habit.completedDays = habit.completedDays.filter(d => d !== date);
    } else {
      habit.completedDays.push(date);
    }
    habit.streak = habit.completedDays.length;
    await habit.save();
    const allHabits = await Habit.find().sort({ createdAt: -1 });
    res.json(allHabits);
  } catch (err) {
    res.status(500).json({ message: 'Error toggling habit' });
  }
});

app.patch('/api/habits/:id/subtask/:subId', async (req: Request, res: Response): Promise<any> => {
  try {
    const habit = await Habit.findOne({ id: req.params.id });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    const subtask = (habit.subtasks as any[]).find(s => s.id === req.params.subId);
    if (subtask) subtask.completed = !subtask.completed;
    await habit.save();
    const allHabits = await Habit.find().sort({ createdAt: -1 });
    res.json(allHabits);
  } catch (err) {
    res.status(500).json({ message: 'Error toggling subtask' });
  }
});

// NOTES ROUTES
app.get('/api/notes', async (req: Request, res: Response) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

app.post('/api/notes', async (req: Request, res: Response) => {
  try {
    const newNote = new Note(req.body);
    await newNote.save();
    const allNotes = await Note.find().sort({ createdAt: -1 });
    res.json(allNotes);
  } catch (err) {
    res.status(500).json({ message: 'Error saving note' });
  }
});

app.delete('/api/notes/:id', async (req: Request, res: Response) => {
  try {
    await Note.findOneAndDelete({ id: req.params.id });
    const allNotes = await Note.find().sort({ createdAt: -1 });
    res.json(allNotes);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting note' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
