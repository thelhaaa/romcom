import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '../../utils/audioEngine';
import { triggerHaptic } from '../../hooks/useMobileSensors';
import { RotateCcw, Sparkles, Check } from 'lucide-react';

interface SignaturePadProps {
  onSigned?: (signatureDataUrl: string) => void;
  isSealed?: boolean;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSigned, isSealed: extIsSealed }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasStroke, setHasStroke] = useState(false);
  const [isSealed, setIsSealed] = useState(false);
  const [signedDate, setSignedDate] = useState('');
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const strokeSoundTimerRef = useRef<number>(0);

  useEffect(() => {
    const today = new Date();
    setSignedDate(today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
  }, []);

  // Setup High-DPI canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#6b0722'; // deep burgundy fountain pen ink
    ctx.lineWidth = 2.8;
  }, []);

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (isSealed || extIsSealed) return;
    const coords = getCanvasCoords(e);
    lastPointRef.current = coords;
    setIsDrawing(true);
    triggerHaptic(15);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isSealed || extIsSealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx || !lastPointRef.current) return;

    const currentPoint = getCanvasCoords(e);

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    // Smooth quadratic curve midpoint
    const midX = (lastPointRef.current.x + currentPoint.x) / 2;
    const midY = (lastPointRef.current.y + currentPoint.y) / 2;
    ctx.quadraticCurveTo(lastPointRef.current.x, lastPointRef.current.y, midX, midY);
    ctx.stroke();

    lastPointRef.current = currentPoint;
    setHasStroke(true);

    // Audio scribe tick throttle
    const now = Date.now();
    if (now - strokeSoundTimerRef.current > 70) {
      sound.playPenScribe();
      strokeSoundTimerRef.current = now;
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPointRef.current = null;
  };

  const clearCanvas = () => {
    if (isSealed || extIsSealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasStroke(false);
    sound.playPop();
    triggerHaptic(20);
  };

  // Auto-signature cursive animation
  const handleAutoSign = () => {
    if (isSealed || extIsSealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    clearCanvas();
    setHasStroke(true);

    const points = [
      { x: 40, y: 55 },
      { x: 55, y: 25 },
      { x: 65, y: 65 },
      { x: 80, y: 40 },
      { x: 95, y: 50 },
      { x: 110, y: 35 },
      { x: 130, y: 55 },
      { x: 150, y: 30 },
      { x: 175, y: 60 },
      { x: 210, y: 45 },
      { x: 230, y: 55 },
      // heart flourish loop
      { x: 250, y: 35 },
      { x: 260, y: 25 },
      { x: 270, y: 35 },
      { x: 260, y: 55 },
      { x: 245, y: 45 },
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i >= points.length - 1) {
        clearInterval(interval);
        triggerHaptic([30, 20, 50]);
        return;
      }
      ctx.beginPath();
      ctx.moveTo(points[i].x, points[i].y);
      ctx.lineTo(points[i + 1].x, points[i + 1].y);
      ctx.stroke();
      sound.playPenScribe();
      i++;
    }, 45);
  };

  const handleConfirmSeal = () => {
    if (!hasStroke && !isSealed) {
      handleAutoSign();
    }
    setIsSealed(true);
    sound.playWaxCrack();
    sound.playFanfare();
    triggerHaptic([40, 30, 90]);

    if (canvasRef.current && onSigned) {
      onSigned(canvasRef.current.toDataURL());
    }
  };

  const sealed = extIsSealed || isSealed;

  return (
    <div className="relative flex flex-col items-center w-full max-w-sm mx-auto">
      {/* Signature Canvas Box */}
      <div className="relative w-full h-28 bg-[#fdf8f0]/80 rounded-xl border border-[#d9c4b0] shadow-inner overflow-hidden">
        {/* Lined notebook guide */}
        <div className="absolute inset-x-4 bottom-6 border-b border-dashed border-[#d4af37]/40 pointer-events-none flex justify-between text-[10px] font-mono text-[#8a6845]/60">
          <span>Partner's Signature (X)</span>
          <span>Date: {signedDate}</span>
        </div>

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="relative z-10 w-full h-full cursor-crosshair touch-none"
        />

        {/* Embossed Golden Wax Seal Stamp Drop */}
        <AnimatePresence>
          {sealed && (
            <motion.div
              initial={{ scale: 3, rotate: -25, opacity: 0 }}
              animate={{ scale: 1, rotate: -8, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 450, damping: 18 }}
              className="absolute right-4 top-2 z-20 pointer-events-none select-none"
            >
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#ffd700] via-[#e6a817] to-[#996515] p-[2px] shadow-[0_8px_20px_rgba(0,0,0,0.4)] flex items-center justify-center">
                <div className="w-full h-full rounded-full border border-amber-200/60 flex flex-col items-center justify-center text-center p-1 bg-gradient-to-br from-[#c99017] to-[#805007] text-[#fff6db] shadow-inner">
                  <span className="text-[7px] tracking-widest font-mono font-bold uppercase">✦ CERTIFIED ✦</span>
                  <span className="text-[10px] font-serif font-black tracking-tight leading-tight">FOREVER</span>
                  <span className="text-[8px] text-rose-200">SEALED ♡</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Signature Controls */}
      {!sealed ? (
        <div className="flex items-center gap-2 mt-3">
          <button
            type="button"
            onClick={clearCanvas}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full bg-black/10 hover:bg-black/20 text-[#68192d] transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            Clear
          </button>
          <button
            type="button"
            onClick={handleAutoSign}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-[#733e08] font-medium transition-all"
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            Auto-Sign
          </button>
          <button
            type="button"
            onClick={handleConfirmSeal}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs rounded-full bg-gradient-to-r from-[#d91d4e] to-[#8f0d30] hover:brightness-110 text-white font-semibold shadow-md transition-all active:scale-95"
          >
            <Check className="w-3.5 h-3.5" />
            Accept & Seal ♡
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 mt-2 text-xs text-[#2e7d32] font-medium font-sans">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Legally binding contract sealed in heaven</span>
        </div>
      )}
    </div>
  );
};
