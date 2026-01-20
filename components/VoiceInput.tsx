
import React, { useState, useEffect, useCallback } from 'react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isListening: boolean;
  setIsListening: (val: boolean) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, isListening, setIsListening }) => {
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'es-AR';

      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
      };

      recog.onerror = (event: any) => {
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    }
  }, [onTranscript, setIsListening]);

  const toggleListening = useCallback(() => {
    if (!recognition) {
      alert("Navegador no soportado para voz.");
      return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  }, [recognition, isListening, setIsListening]);

  return (
    <button
      onClick={toggleListening}
      className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
        isListening 
          ? 'bg-red-50 text-red-600 shadow-[inset_4px_4px_8px_#e3dbcf,inset_-4px_-4px_8px_#ffffff]' 
          : 'nm-button'
      }`}
      aria-label={isListening ? "Parar de escuchar" : "Hablar"}
    >
      <i className={`fas ${isListening ? 'fa-stop animate-pulse' : 'fa-microphone'}`}></i>
    </button>
  );
};

export default VoiceInput;
