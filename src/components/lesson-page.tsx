import React, { useState } from 'react';
import FileUpload from './file-upload';
import AudioRecorder from './audio-recorder';

const LessonPage: React.FC = () => {
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [transcript, setTranscript] = useState<string | null>(null);

    const handleFileUpload = async (file: File) => {
        const audioUrl = URL.createObjectURL(file);
        setAudioSrc(audioUrl);
        transcribeAudio(file);
    };

    const handleRecordingComplete = async (audioBlob: Blob) => {
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioSrc(audioUrl);
        transcribeAudio(audioBlob);
    };

    const transcribeAudio = (audio: Blob | File) => {
        const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech Recognition not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'iw-IL';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            setTranscript(event.results[0][0].transcript);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
        };

        const audioURL = URL.createObjectURL(audio);
        const audioElement = new Audio(audioURL);
        audioElement.onplay = () => {
            recognition.start();
        };
        audioElement.play();
    };

    return (
        <div>
            <h1>Lesson</h1>
            <FileUpload onFileUpload={handleFileUpload} />
            <AudioRecorder onRecordingComplete={handleRecordingComplete} />
            {audioSrc && <audio controls src={audioSrc} />}
            {transcript && <p>{transcript}</p>}
        </div>
    );
};

export default LessonPage;