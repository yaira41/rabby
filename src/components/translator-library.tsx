import React, { useState } from 'react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const TranslatorLibrary: React.FC = () => {
    const { transcript, isMicrophoneAvailable, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
    const defaultText = 'שלום מה נשמע';


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

    return (
        <div>
            <div>
                הטקסט הרצוי הינו:
                <div>
                    {defaultText}

                </div>

            </div>
            <div>
                <button
                    onClick={() => resetTranscript()}
                >
                    'Reset'
                </button>
                <button
                    onClick={handleOnRecord}
                >
                    {isSpeaking ? 'Stop' : 'Record'}
                </button>
            </div>

            <div>
                <p>
                    Spoken Text: {transcript}
                </p>
            </div>

            <div>
                {transcript && (transcript === defaultText ? 'הצלחת' : 'נסה שוב')}
            </div>
        </div>
    );
};

export default TranslatorLibrary;
