import { Request, Response } from 'express';
import Note from '../models/Note.js';

export const getNotes = async (req: Request, res: Response) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching notes' });
    }
};

export const createNote = async (req: Request, res: Response) => {
    try {
        const newNote = new Note(req.body);
        await newNote.save();
        const allNotes = await Note.find().sort({ createdAt: -1 });
        res.json(allNotes);
    } catch (err) {
        res.status(500).json({ message: 'Error saving note' });
    }
};

export const deleteNote = async (req: Request, res: Response) => {
    try {
        await Note.findOneAndDelete({ id: req.params.id });
        const allNotes = await Note.find().sort({ createdAt: -1 });
        res.json(allNotes);
    } catch (err) {
        res.status(500).json({ message: 'Error deleting note' });
    }
};
