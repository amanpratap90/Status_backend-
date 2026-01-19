import { Request, Response } from 'express';
import Habit from '../models/Habit';

export const getHabits = async (req: Request, res: Response) => {
    try {
        const habits = await Habit.find().sort({ createdAt: -1 });
        res.json(habits);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching habits' });
    }
};

export const createHabit = async (req: Request, res: Response) => {
    try {
        const newHabit = new Habit(req.body);
        await newHabit.save();
        const allHabits = await Habit.find().sort({ createdAt: -1 });
        res.json(allHabits);
    } catch (err) {
        res.status(500).json({ message: 'Error saving habit' });
    }
};

export const deleteHabit = async (req: Request, res: Response) => {
    try {
        await Habit.findOneAndDelete({ id: req.params.id });
        const allHabits = await Habit.find().sort({ createdAt: -1 });
        res.json(allHabits);
    } catch (err) {
        res.status(500).json({ message: 'Error deleting habit' });
    }
};

export const toggleHabit = async (req: Request, res: Response): Promise<any> => {
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
};

export const toggleSubtask = async (req: Request, res: Response): Promise<any> => {
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
};
