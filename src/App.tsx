import React from 'react';
import { useNarrativeFSM } from './hooks/useNarrativeFSM';
import { SoundToggle } from './components/ui/SoundToggle';
import { CinematicWorld } from './components/world/CinematicWorld';

export const App: React.FC = () => {
  const {
    stage,
    onIntroComplete,
    onReject,
    onAccept,
    onRestart,
  } = useNarrativeFSM();

  return (
    <div className="relative w-full min-h-[100svh] overflow-x-hidden bg-[#080508]">
      {/* Floating Minimalist Audio Toggle */}
      <SoundToggle />

      {/* CONTINUOUS THREE.JS CINEMATIC MOTION COMPOSITION */}
      <CinematicWorld
        stage={stage}
        onIntroComplete={onIntroComplete}
        onAccept={onAccept}
        onReject={onReject}
        onRestart={onRestart}
      />

      {/* Filmic Footer */}
      <footer className="relative z-20 py-4 text-center text-xs font-serif italic text-roseGlow/40 tracking-widest select-none">
        forever & always ♡
      </footer>
    </div>
  );
};

export default App;
