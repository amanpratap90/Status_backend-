
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, StickyNote, Loader2 } from 'lucide-react';
import { Note } from '../types';
import { NOTE_COLORS } from '../constants';
import { getNotes, saveNote, deleteNote } from '../services/api';

const NotesSection: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      const data = await getNotes();
      setNotes(data);
      setIsLoading(false);
    };
    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) return;
    const note: Note = {
      id: Math.random().toString(36).substr(2, 9),
      content: newNoteContent,
      color: selectedColor,
      createdAt: new Date().toISOString()
    };
    const updated = await saveNote(note);
    setNotes(updated);
    setNewNoteContent('');
  };

  const handleDelete = async (id: string) => {
    const updated = await deleteNote(id);
    setNotes(updated);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-yellow-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <StickyNote className="text-yellow-400" />
          Colorful Notes
        </h2>
      </div>

      <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 shadow-xl">
        <textarea
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          placeholder="Capture your thoughts..."
          className="w-full bg-transparent border-none focus:ring-0 text-lg resize-none min-h-[100px] placeholder:text-gray-700"
        />
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <div className="flex gap-2">
            {NOTE_COLORS.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${selectedColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#141414]' : ''}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <button
            onClick={handleAddNote}
            className="flex items-center gap-2 px-6 py-2 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            <Plus size={18} />
            Post Note
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map(note => (
          <div 
            key={note.id}
            className="relative p-6 rounded-2xl min-h-[160px] flex flex-col group animate-in zoom-in duration-300 shadow-lg"
            style={{ backgroundColor: note.color, color: '#000' }}
          >
            <button 
              onClick={() => handleDelete(note.id)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-black/10 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={16} />
            </button>
            <p className="flex-1 whitespace-pre-wrap font-medium">{note.content}</p>
            <p className="mt-4 text-[10px] uppercase tracking-widest opacity-40 font-bold">
              {new Date(note.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
        {notes.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
            <p className="text-gray-600">No notes yet. Scribble something down!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesSection;
