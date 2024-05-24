import { useState, useRef } from 'react';
import { convertBlobToBase64 } from '../utils/audio-parser';

type UploadLessonProps = {
    setCurrLesson: (audio64: string) => void;
}

const UploadLessonPage = ({ setCurrLesson }: UploadLessonProps) => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const handleStartRecording = async () => {
        setIsRecording(true);
        audioChunksRef.current = [];

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            setAudioBlob(audioBlob);
            const audioURL = URL.createObjectURL(audioBlob);
            setAudioURL(audioURL);
        };

        mediaRecorderRef.current.start();
    };

    const handleStopRecording = () => {
        setIsRecording(false);
        mediaRecorderRef.current?.stop();
    };

    const handleUploadAudio = async () => {
        if (audioBlob) {
            const base64Audio = await convertBlobToBase64(audioBlob);
            console.log('Uploading audio:', base64Audio);
            setCurrLesson(base64Audio);
            // Here you would send `base64Audio` to your server
        }
    };

    return (
        <div>
            <div>העלאת שיעורים</div>
            <div>
                <button onClick={isRecording ? handleStopRecording : handleStartRecording}>
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
            </div>
            {audioURL && (
                <div>
                    <audio controls src={audioURL}></audio>
                    <button onClick={handleUploadAudio}>Upload Audio</button>
                </div>
            )}
        </div>
    );
}

export default UploadLessonPage;
