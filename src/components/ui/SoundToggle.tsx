import React, { useState } from 'react';
import { VolumeX, Sparkles } from 'lucide-react';
import { sound } from '../../utils/audioEngine';
import { triggerHaptic } from '../../hooks/useMobileSensors';

export const SoundToggle: React.FC = () => {
  const [muted, setMuted] = useState(sound.isMuted);

  const handleToggle = () => {
    sound.playPop();
    triggerHaptic(20);
    const isNowMuted = sound.toggleMute();
    setMuted(isNowMuted);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="fixed top-4 right-4 z-50 flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-full bg-[#180514]/85 hover:bg-[#25091f]/90 border border-pink-400/30 text-pink-200 text-xs font-sans font-medium shadow-[0_8px_25px_rgba(0,0,0,0.6),0_0_15px_rgba(255,42,133,0.2)] backdrop-blur-2xl transition-all active:scale-95 cursor-pointer"
      title={muted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
    >
      {muted ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-zinc-400 hidden sm:inline">SFX Muted</span>
        </>
      ) : (
        <>
          <Sparkles className="w-3.5 h-3.5 text-roseGlow animate-pulse" />
          <span className="hidden sm:inline">SFX On</span>
        </>
      )}
    </button>
  );
};
