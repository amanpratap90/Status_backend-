import mongoose from 'mongoose';

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

const Habit = mongoose.model('Habit', habitSchema);

export default Habit;
