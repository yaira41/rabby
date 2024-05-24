import { useState, useRef } from 'react';

const Translator = () => {
  const recognitionRef = useRef<SpeechRecognition>();

  const [isActive, setIsActive] = useState<boolean>(false);
  const [finalText, setFinalText] = useState<string>('');
  const [interimText, setInterimText] = useState<string>('');

  function handleOnRecord() {
    if (isActive) {
      recognitionRef.current?.stop();
      setIsActive(false);
      return;
    }

    speak(' ');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();


    if (recognitionRef?.current) {
      recognitionRef.current.lang = 'iw-IL';
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onstart = function () {
        setIsActive(true);
      }


      recognitionRef.current.onend = function () {
        setIsActive(false);
      }
      recognitionRef.current.onresult = function (event) {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
            speak(event.results[i][0].transcript);
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setFinalText((prevText) => prevText + finalTranscript);
        setInterimText(interimTranscript);
      };

      recognitionRef.current.start();
    }

  }

  function speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);

    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="mt-12 px-4">

      <div className="max-w-lg rounded-xl overflow-hidden mx-auto">

        <div className="bg-zinc-800 p-4">
          <div className="grid sm:grid-cols-2 gap-4 max-w-lg bg-zinc-200 rounded-lg p-5 mx-auto">

            <p>
              <button
                className={`w-full h-full uppercase font-semibold text-sm  ${isActive ? 'text-white bg-red-500' : 'text-zinc-400 bg-zinc-900'} color-white py-3 rounded-sm`}
                onClick={handleOnRecord}
              >
                {isActive ? 'Stop' : 'Record'}
              </button>
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 max-w-lg bg-zinc-200 rounded-lg p-5 mx-auto">

            <p>
              <button
              // onClick={() => setText('')}
              >
                Reset
              </button>
            </p>
          </div>
        </div>
      </div>


      <div className="max-w-lg mx-auto mt-12">
        <p className="mb-4">
          Spoken Text: {finalText}  {interimText}
        </p>
      </div>

    </div>
  )
}

export default Translator;