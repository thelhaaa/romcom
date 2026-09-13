import React from 'react';

interface WashiTapeProps {
  rotation?: number;
  variant?: 'pink' | 'gold' | 'kraft' | 'grid' | 'stripes';
  className?: string;
  width?: string;
}

export const WashiTape: React.FC<WashiTapeProps> = ({
  rotation = -5,
  variant = 'pink',
  className = '',
  width = 'w-24 sm:w-32',
}) => {
  const variantStyles = {
    pink: 'bg-[#ff9bb7]/55 border-y border-[#ff7da7]/40 shadow-[0_2px_6px_rgba(255,42,133,0.2)]',
    gold: 'bg-[#fef08a]/60 border-y border-[#eab308]/40 shadow-[0_2px_6px_rgba(234,179,8,0.2)]',
    kraft: 'bg-[#d8b896]/65 border-y border-[#b0885e]/40 shadow-[0_2px_6px_rgba(0,0,0,0.15)]',
    grid: 'bg-[#f8fafc]/60 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:6px_6px] border-y border-slate-300/60 shadow-[0_2px_6px_rgba(0,0,0,0.1)]',
    stripes: 'bg-[#fbcfe8]/60 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(244,63,94,0.3)_4px,rgba(244,63,94,0.3)_8px)] border-y border-pink-300/60 shadow-[0_2px_6px_rgba(255,42,133,0.15)]',
  }[variant];

  return (
    <div
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
      className={`relative h-6 pointer-events-none select-none backdrop-blur-[2px] z-30 ${width} ${variantStyles} ${className}`}
    >
      {/* Left torn/jagged end */}
      <div
        className="absolute -left-1 top-0 bottom-0 w-2 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, transparent 33.33%, currentColor 33.33%, currentColor 66.66%, transparent 66.66%)',
          backgroundSize: '4px 6px',
          opacity: 0.5,
        }}
      />
      {/* Right torn/jagged end */}
      <div
        className="absolute -right-1 top-0 bottom-0 w-2 pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, transparent 33.33%, currentColor 33.33%, currentColor 66.66%, transparent 66.66%)',
          backgroundSize: '4px 6px',
          opacity: 0.5,
        }}
      />
    </div>
  );
};
