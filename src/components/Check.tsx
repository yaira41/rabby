// src/components/VideoNotes.tsx
import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';

interface Note {
    id: number;
    time: number;
    text: string;
}

const VideoNotes: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [currentNote, setCurrentNote] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editNoteId, setEditNoteId] = useState<number | null>(null);
    const playerRef = useRef<ReactPlayer>(null);

    const addNote = () => {
        const currentTime = playerRef.current?.getCurrentTime() || 0;
        const newNote: Note = { id: Date.now(), time: currentTime, text: currentNote };
        setNotes([...notes, newNote]);
        setCurrentNote('');
    };

    const updateNote = () => {
        setNotes(notes.map(note =>
            note.id === editNoteId ? { ...note, text: currentNote } : note
        ));
        setCurrentNote('');
        setIsEditing(false);
        setEditNoteId(null);
    };

    const handleEditClick = (note: Note) => {
        setCurrentNote(note.text);
        setIsEditing(true);
        setEditNoteId(note.id);
    };

    const handleDeleteClick = (id: number) => {
        setNotes(notes.filter(note => note.id !== id));
    };

    const handleNoteClick = (time: number) => {
        if (playerRef.current) {
            playerRef.current.seekTo(time, 'seconds');
        }
    };

    return (
        <div>
            <ReactPlayer
                url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                ref={playerRef}
                controls
            />
            <div>
                <input
                    type="text"
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    placeholder="Add a note"
                />
                {isEditing ? (
                    <button onClick={updateNote}>Update Note</button>
                ) : (
                    <button onClick={addNote}>Add Note</button>
                )}
            </div>
            <ul>
                {notes.map((note) => (
                    <li key={note.id}>
                        <span onClick={() => handleNoteClick(note.time)}>
                            [{new Date(note.time * 1000).toISOString().substr(11, 8)}] {note.text}
                        </span>
                        <button onClick={() => handleEditClick(note)}>Edit</button>
                        <button onClick={() => handleDeleteClick(note.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VideoNotes;
