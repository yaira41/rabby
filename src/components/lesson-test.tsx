import React, { useState, useRef, useEffect } from 'react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { getWrongWords } from '../utils/utils';
import './lesson-tesr.css'

interface TranslatorLibraryProps {
    audioBlob: Blob | undefined;
}

interface Note {
    timestamp: number;
    text: string;
}

const TranslatorLibrary: React.FC<TranslatorLibraryProps> = ({ audioBlob }) => {
    const { transcript, isMicrophoneAvailable, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
    const [notes, setNotes] = useState<Note[]>([]);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const defaultText = "מתי שחר הולכת לישון"
    // const defaultText = "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ.";
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioBlob) {
            const url = URL.createObjectURL(audioBlob);
            setAudioURL(url);

            return () => {
                URL.revokeObjectURL(url); // Cleanup the URL object when the component is unmounted
            };
        }
    }, [audioBlob]);

    if (!browserSupportsSpeechRecognition) {
        return <div>Browser doesn't support speech recognition.</div>;
    }

    if (!isMicrophoneAvailable) {
        return <div>Microphone is not connected.</div>;
    }

    const handleOnRecord = () => {
        if (listening) {
            SpeechRecognition.stopListening();
            setIsSpeaking(false);
        } else {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true, language: 'iw-IL' });
            setIsSpeaking(true);
        }
    };

    const addNote = () => {
        if (audioRef.current) {
            const timestamp = audioRef.current.currentTime;
            const newNote: Note = { timestamp, text: transcript };
            setNotes([...notes, newNote]);
            resetTranscript();
        }
    };

    const handleNoteClick = (timestamp: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = timestamp;
            audioRef.current.play();
        }
    };

    return (
        <div>
            <div>
                {audioURL && (
                    <audio ref={audioRef} controls>
                        <source src={audioURL} type="audio/wav" />
                        Your browser does not support the audio element.
                    </audio>
                )}
            </div>

            <div>
                <div>הטקסט הרצוי הינו: {defaultText}</div>
            </div>

            <div>
                <button onClick={resetTranscript}>Reset</button>
                <button onClick={handleOnRecord}>{isSpeaking ? 'Stop' : 'Record'}</button>
                <button onClick={addNote}>Add Note</button>
            </div>

            <div>
                <p>Spoken Text: {transcript}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {transcript && getWrongWords(transcript, defaultText).map(word => {

                    return <div style={{ paddingLeft: '3px' }} className={!word.isCorrect ? 'redText' : 'greenText'}> {word.text}</div>
                }
                )}
            </div>

            <div>
                {transcript && (transcript === defaultText ? 'הצלחת' : 'נסה שוב')}
            </div>

            <div>
                <h3>Notes:</h3>
                <ul>
                    {notes.map((note, index) => (
                        <li key={index}>
                            <button onClick={() => handleNoteClick(note.timestamp)}>
                                {note.text} (at {new Date(note.timestamp * 1000).toISOString().substr(11, 8)})
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TranslatorLibrary;
