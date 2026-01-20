
import React, { useState, useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import { TranslationMode, TranslationResult } from './types';
import { APP_NAME } from './constants';
import VoiceInput from './components/VoiceInput';
import { logoAnimationData } from './lottieData';

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      const anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: logoAnimationData,
      });

      anim.addEventListener('complete', () => {
        setIsFadingOut(true);
        setTimeout(onComplete, 600);
      });

      return () => anim.destroy();
    }
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[#fbf4ea] transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      <div ref={containerRef} className="w-full max-w-2xl px-4 h-auto" />
    </div>
  );
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [mode, setMode] = useState<TranslationMode>(TranslationMode.MARKETING_TO_ARGENTINO);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [history, setHistory] = useState<TranslationResult[]>([]);

 const handleTranslate = async () => {
  console.log('CLICK TRADUCIR - handleTranslate ejecutado');

  if (!inputText.trim()) return;

  setIsLoading(true);

  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: inputText,
        mode,
      }),
    });

    const data = await res.json();
    setTranslatedText(data.result || 'Sin respuesta del servidor');
  } catch (e) {
    setTranslatedText('Error técnico. Parece que el servidor se tomó el palo.');
  } finally {
    setIsLoading(false);
  }
};


  const toggleMode = () => {
    setMode(prev => 
      prev === TranslationMode.MARKETING_TO_ARGENTINO 
        ? TranslationMode.ARGENTINO_TO_MARKETING 
        : TranslationMode.MARKETING_TO_ARGENTINO
    );
    setTranslatedText('');
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 md:px-6 bg-[#fbf4ea] animate-fade-in">
      {/* Header Compacto */}
      <header className="mb-8 text-center">
        <h1 className="text-xl md:text-3xl font-black text-[#000043] tracking-tight">
          {APP_NAME}
        </h1>
      </header>

      <div className="w-full max-w-2xl space-y-8">
        {/* Switcher de Modo */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 p-2 rounded-3xl nm-inset">
            <button 
              onClick={() => setMode(TranslationMode.MARKETING_TO_ARGENTINO)}
              className={`px-6 py-2 rounded-2xl text-sm font-black transition-all duration-300 ${
                mode === TranslationMode.MARKETING_TO_ARGENTINO 
                ? 'bg-[#000043] text-[#fbf4ea] shadow-[inset_2px_2px_4px_#000010]' 
                : 'text-[#000043] opacity-40'
              }`}
            >
              MKT
            </button>
            <button 
              onClick={toggleMode}
              className="w-10 h-10 nm-button rounded-full text-[#000043] flex items-center justify-center hover:rotate-180 transition-all active:scale-90"
              title="Cambiar sentido"
            >
              <i className="fas fa-sync-alt text-sm"></i>
            </button>
            <button 
              onClick={() => setMode(TranslationMode.ARGENTINO_TO_MARKETING)}
              className={`px-6 py-2 rounded-2xl text-sm font-black transition-all duration-300 ${
                mode === TranslationMode.ARGENTINO_TO_MARKETING 
                ? 'bg-[#000043] text-[#fbf4ea] shadow-[inset_2px_2px_4px_#000010]' 
                : 'text-[#000043] opacity-40'
              }`}
            >
              ARG
            </button>
          </div>
          <p className="text-[10px] uppercase font-black tracking-[0.2em] text-[#000043] opacity-60">
            {mode === TranslationMode.MARKETING_TO_ARGENTINO ? 'Oficina ➔ Barrio' : 'Barrio ➔ Directorio'}
          </p>
        </div>

        {/* Card de Traducción Optimizada */}
        <div className="p-6 md:p-8 rounded-[40px] nm-flat space-y-6 border border-white/40">
          {/* Input Area */}
          <div className="relative">
            <div className="flex justify-between items-center mb-3 px-2">
              <span className="text-[10px] font-black text-[#000043] opacity-40 uppercase tracking-widest">Tu Mensaje</span>
              <VoiceInput onTranscript={setInputText} isListening={isListening} setIsListening={setIsListening} />
            </div>
            <textarea
              className="w-full h-32 p-6 rounded-[25px] nm-inset border-none focus:ring-0 text-[#000043] text-lg md:text-xl font-medium resize-none outline-none placeholder-[#000043]/20 bg-transparent"
              placeholder={mode === TranslationMode.MARKETING_TO_ARGENTINO ? "Idioma marketing..." : "Contame como viene la mano..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          {/* Botón Central */}
          <div className="flex justify-center">
            <button
              onClick={handleTranslate}
              disabled={isLoading || !inputText.trim()}
              className={`px-12 py-4 rounded-2xl font-black text-base tracking-wide transition-all ${
                isLoading || !inputText.trim() 
                ? 'text-[#000043]/20 cursor-not-allowed nm-inset' 
                : 'nm-button-primary hover:scale-105 active:scale-95'
              }`}
            >
              {isLoading ? <i className="fas fa-circle-notch fa-spin mr-2 text-sm"></i> : null}
              {isLoading ? "INTERPRETANDO..." : "TRADUCIR"}
            </button>
          </div>

          {/* Output Area */}
          <div className="relative">
             <span className="block text-[10px] font-black text-[#000043] opacity-40 uppercase tracking-widest mb-3 px-2">En Criollo</span>
             <div className="w-full min-h-[120px] p-6 rounded-[25px] nm-inset flex items-center justify-center text-center">
                {translatedText ? (
                  <p className="text-xl md:text-2xl text-[#000043] font-black leading-tight">
                    {translatedText}
                  </p>
                ) : (
                  <p className="text-[#000043]/20 italic text-base font-medium">Esperando que baje la data...</p>
                )}
             </div>
          </div>
        </div>

        {/* Historial Compacto */}
        {history.length > 0 && (
          <section className="space-y-4 pt-2">
            <h3 className="text-center text-[#000043] text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Dichos de Recién</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2">
              {history.map((item) => (
                <div key={item.timestamp} className="p-4 rounded-2xl nm-flat text-center group transition-all hover:translate-y-[-2px]">
                  <span className="text-[8px] font-black text-[#000043] opacity-50 mb-1 block">
                    {item.mode === TranslationMode.MARKETING_TO_ARGENTINO ? 'MKT ➔ ARG' : 'ARG ➔ MKT'}
                  </span>
                  <p className="text-xs font-bold text-[#000043] leading-tight line-clamp-2">{item.translated}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <footer className="mt-auto py-8 text-center">
        <p className="text-[9px] font-bold text-[#000043] opacity-30 uppercase tracking-[0.2em]">
          Coronel Florencio &copy; {new Date().getFullYear()} • Edición Premium
        </p>
      </footer>
    </div>
  );
};

export default App;
