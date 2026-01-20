import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    content: String,
    color: String,
    createdAt: { type: Date, default: Date.now },
    userId: String
});

const Note = mongoose.model('Note', noteSchema);

export default Note;
