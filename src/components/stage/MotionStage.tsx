import React, { ReactNode } from 'react';
import { AmbientDust } from './AmbientDust';
import { SilkBowHeader } from './SilkBowHeader';
import { TulipBouquet } from './TulipBouquet';

interface MotionStageProps {
  children: ReactNode;
  showBows?: boolean;
  showTulips?: boolean;
}

export const MotionStage: React.FC<MotionStageProps> = ({
  children,
}) => {
  return (
    <div className="relative w-full min-h-[100svh] flex flex-col items-center justify-center bg-[#080508] text-[#fbcfe8] select-none py-8 sm:py-12 px-4 sm:px-8">
      {/* 1. Cinematic Dark Luxury Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#080508]" />
        {/* Soft quiet central romantic ambient light */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(214,51,108,0.08),transparent_70%)]" />
        {/* Soft edge vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.85)_100%)]" />
      </div>

      {/* 2. Controlled Ambient Stardust */}
      <AmbientDust />

      {/* 3. Main Composition Stage: Naturally scrollable with generous negative space */}
      <div className="relative z-20 w-full max-w-5xl flex items-center justify-center my-auto">
        {children}
      </div>
    </div>
  );
};
