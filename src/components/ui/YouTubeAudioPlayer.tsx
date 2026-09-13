import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, SkipForward, Disc3, ListMusic, ChevronLeft, Sparkles } from 'lucide-react';
import { sound } from '../../utils/audioEngine';
import { triggerHaptic } from '../../hooks/useMobileSensors';

interface Song {
  id: string; // YouTube Video ID
  title: string;
  artist: string;
  tag: string;
}

const PLAYLIST: Song[] = [
  { id: '6RdS6wLu7RY', title: 'Kesariya', artist: 'Arijit Singh • Brahmāstra', tag: 'Romantic' },
  { id: '-YlmnPh-6rE', title: 'For A Reason', artist: 'Karan Aujla & Ikky', tag: 'Trending' },
  { id: '5GCfYLguTIs', title: 'Boyfriend', artist: 'Karan Aujla & Sunanda', tag: 'Hot' },
  { id: '7Edz3hPXdcE', title: 'Sweety', artist: 'Lucky The Racer • Thaman', tag: 'Vibes' },
  { id: 'KUpwupYj_tY', title: 'Tere Hawaale', artist: 'Arijit Singh & Shilpa Rao', tag: 'Soulful' },
  { id: 'gvyUuxdRdR4', title: 'Raataan Lambiyan', artist: 'Jubin Nautiyal & Asees', tag: 'Favorite' },
];

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

/**
 * Ultra-Smooth Boutique Turntable & Morphing Capsule Player
 * - Mechanical Tonearm: Miniature stylus swings onto spinning vinyl when playing, lifts off when paused.
 * - Acoustic Sonic Waves: Pulsing sonar ripple rings radiate from the disc.
 * - Dynamic Island Spring: Buttery liquid stretch between 54px circular disc and 348px pill capsule.
 * - 5-Bar Hi-Fi Equalizer: Realistic independently dancing gradient visualizer bars.
 * - Smart Inactivity Management: Never auto-collapses while hovered; auto-sleeps 6s after leaving.
 * - Bulletproof Unmuted Audio: PostMessage + IFrame API with volume 100% active stream.
 */
export const YouTubeAudioPlayer: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const playerRef = useRef<any>(null);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentSong = PLAYLIST[currentIdx];

  // Helper to send postMessage commands to the YouTube iframe
  const sendIframeCommand = useCallback((func: string, args: any[] = []) => {
    try {
      const iframe = document.querySelector<HTMLIFrameElement>('#youtube-audio-player-iframe');
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Auto-collapse timer management: Only auto-collapse when not hovered and playlist closed
  const resetInactivityTimer = useCallback(() => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
    }
    if (!showPlaylist && !isHovered) {
      collapseTimerRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 6000);
    }
  }, [showPlaylist, isHovered]);

  const handleUserInteraction = useCallback(() => {
    if (isExpanded) {
      resetInactivityTimer();
    }
  }, [isExpanded, resetInactivityTimer]);

  useEffect(() => {
    if (isExpanded && !showPlaylist && !isHovered) {
      resetInactivityTimer();
    } else if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
    }
    return () => {
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current);
      }
    };
  }, [isExpanded, showPlaylist, isHovered, resetInactivityTimer]);

  // Listen to YouTube postMessage events (onStateChange, onReady, etc.)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        if (typeof event.data !== 'string') return;
        const data = JSON.parse(event.data);

        // YouTube postMessage event format: { event: "onStateChange", info: 1 }
        // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
        if (data.event === 'onStateChange') {
          if (data.info === 1) {
            setIsPlaying(true);
            sound.stopMusicBox();
          } else if (data.info === 2) {
            setIsPlaying(false);
          } else if (data.info === 0) {
            handleNext();
          }
        }
      } catch (e) {
        // Not JSON or other message, ignore
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentIdx]);

  // Initialize YouTube Iframe API
  useEffect(() => {
    let isSubscribed = true;

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        if (isSubscribed) initYT();
      };
    } else if (window.YT.Player) {
      initYT();
    }

    function initYT() {
      if (playerRef.current) return;
      const iframe = document.querySelector<HTMLIFrameElement>('#youtube-audio-player-iframe');
      if (!iframe) return;

      try {
        playerRef.current = new window.YT.Player(iframe, {
          events: {
            onReady: (e: any) => {
              if (!isSubscribed) return;
              e.target.setVolume(100);
              e.target.unMute();
            },
            onStateChange: (e: any) => {
              if (!isSubscribed) return;
              if (e.data === 1) {
                setIsPlaying(true);
                sound.stopMusicBox();
              } else if (e.data === 2) {
                setIsPlaying(false);
              } else if (e.data === 0) {
                handleNext();
              }
            },
            onError: () => {
              sound.startMusicBox();
            },
          },
        });
      } catch (err) {
        // Fallback to postMessage
      }
    }

    return () => {
      isSubscribed = false;
    };
  }, []);

  // Play / Pause Toggle
  const togglePlay = useCallback(() => {
    sound.playPop();
    triggerHaptic(20);

    const willPlay = !isPlaying;
    setIsPlaying(willPlay);

    // Send unMute & 100% volume unconditionally
    sendIframeCommand('unMute');
    sendIframeCommand('setVolume', [100]);
    sendIframeCommand(willPlay ? 'playVideo' : 'pauseVideo');

    if (playerRef.current?.playVideo) {
      try {
        if (willPlay) {
          playerRef.current.unMute();
          playerRef.current.setVolume(100);
          playerRef.current.playVideo();
          sound.stopMusicBox();
        } else {
          playerRef.current.pauseVideo();
        }
      } catch (e) {}
    }
  }, [isPlaying, sendIframeCommand]);

  // Skip to Next Song
  const handleNext = useCallback(() => {
    sound.playPop();
    triggerHaptic([20, 30]);

    const nextIdx = (currentIdx + 1) % PLAYLIST.length;
    setCurrentIdx(nextIdx);
    setIsPlaying(true);

    const nextSong = PLAYLIST[nextIdx];
    sendIframeCommand('unMute');
    sendIframeCommand('setVolume', [100]);
    sendIframeCommand('loadVideoById', [nextSong.id]);

    if (playerRef.current?.loadVideoById) {
      try {
        playerRef.current.unMute();
        playerRef.current.setVolume(100);
        playerRef.current.loadVideoById(nextSong.id);
        sound.stopMusicBox();
      } catch (e) {}
    }
  }, [currentIdx, sendIframeCommand]);

  // Select Song from Queue
  const selectSong = useCallback((idx: number) => {
    sound.playPop();
    triggerHaptic(25);
    setCurrentIdx(idx);
    setIsPlaying(true);
    setShowPlaylist(false);
    resetInactivityTimer();

    const selectedSong = PLAYLIST[idx];
    sendIframeCommand('unMute');
    sendIframeCommand('setVolume', [100]);
    sendIframeCommand('loadVideoById', [selectedSong.id]);

    if (playerRef.current?.loadVideoById) {
      try {
        playerRef.current.unMute();
        playerRef.current.setVolume(100);
        playerRef.current.loadVideoById(selectedSong.id);
        sound.stopMusicBox();
      } catch (e) {}
    }
  }, [resetInactivityTimer, sendIframeCommand]);

  // Mute / Unmute
  const toggleMute = useCallback(() => {
    sound.playPop();
    triggerHaptic(15);
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    sendIframeCommand(nextMuted ? 'mute' : 'unMute');
    if (!nextMuted) {
      sendIframeCommand('setVolume', [100]);
    }

    if (playerRef.current) {
      try {
        if (nextMuted) {
          playerRef.current.mute();
        } else {
          playerRef.current.unMute();
          playerRef.current.setVolume(100);
        }
      } catch (e) {}
    }
  }, [isMuted, sendIframeCommand]);

  // Click on Compact Disc
  const handleDiscClick = () => {
    if (!isExpanded) {
      sound.playPop();
      triggerHaptic(25);
      setIsExpanded(true);
      if (!isPlaying) {
        togglePlay();
      }
    } else {
      togglePlay();
    }
  };

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const iframeSrc = `https://www.youtube.com/embed/${currentSong.id}?enablejsapi=1&autoplay=1&playsinline=1&controls=0&origin=${origin}&rel=0`;

  return (
    <>
      {/* Active Viewport IFrame: Keeps Chrome media pipeline active and unmuted */}
      <div className="fixed bottom-2 right-2 w-[240px] h-[140px] opacity-[0.003] pointer-events-none -z-50 overflow-hidden rounded-xl border-0 shadow-none">
        <iframe
          id="youtube-audio-player-iframe"
          title="YouTube Romantic Music Stream"
          width="240"
          height="140"
          src={iframeSrc}
          allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
          className="w-full h-full border-0 pointer-events-none"
        />
      </div>

      {/* Floating Boutique Vinyl Turntable Player on Top-Left */}
      <div
        onMouseMove={handleUserInteraction}
        onClick={handleUserInteraction}
        onMouseEnter={() => {
          setIsHovered(true);
          if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          if (isExpanded && !showPlaylist) {
            resetInactivityTimer();
          }
        }}
        className="fixed top-4 left-4 z-50 select-none"
      >
        {/* Sonar Acoustic Wave Ripples when playing (radiates outward from the disc) */}
        {isPlaying && (
          <div className="absolute left-[27px] top-[27px] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <motion.div
              className="absolute w-[50px] h-[50px] -left-[25px] -top-[25px] rounded-full border border-pink-500/50"
              animate={{ scale: [1, 1.5, 2.05], opacity: [0.7, 0.3, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute w-[50px] h-[50px] -left-[25px] -top-[25px] rounded-full border border-rose-400/40"
              animate={{ scale: [1, 1.5, 2.05], opacity: [0.7, 0.3, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: 1.2 }}
            />
          </div>
        )}

        {/* Dynamic Island Capsule Container with Spring Physics */}
        <motion.div
          animate={{
            width: isExpanded
              ? typeof window !== 'undefined'
                ? Math.min(348, Math.max(260, window.innerWidth - 72))
                : 348
              : 54,
          }}
          transition={{
            type: 'spring',
            stiffness: 340,
            damping: 28,
            mass: 0.82,
          }}
          className="relative h-[54px] flex items-center bg-gradient-to-r from-[#180516]/95 via-[#11030e]/95 to-[#090107]/98 backdrop-blur-3xl border border-pink-400/35 rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.8),0_0_24px_rgba(255,42,133,0.32)] overflow-hidden cursor-pointer"
        >
          {/* Ambient Warm Underglow */}
          <div
            className={`absolute inset-0 bg-gradient-to-r from-rose-500/15 via-pink-500/10 to-purple-500/10 transition-opacity duration-1000 pointer-events-none ${
              isPlaying ? 'opacity-100' : 'opacity-20'
            }`}
          />

          {/* ================================================================ */}
          {/* 1. THE MECHANICAL TURNTABLE VINYL DISC + SWINGING TONEARM         */}
          {/* ================================================================ */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleDiscClick();
            }}
            className="absolute left-[4px] top-[4px] w-[46px] h-[46px] rounded-full shrink-0 flex items-center justify-center cursor-pointer group z-20"
            title={isExpanded ? (isPlaying ? 'Pause music' : 'Play music') : 'Open turntable player'}
          >
            {/* Spinning Grooved Vinyl Disc */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              className="relative w-full h-full rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.95)] border border-[#333333] flex items-center justify-center overflow-hidden"
              style={{
                background: 'radial-gradient(circle, #242424 0%, #131313 55%, #060606 100%)',
              }}
            >
              {/* Continuously Rotating Vinyl Plate */}
              <div
                className="absolute inset-0 rounded-full flex items-center justify-center pointer-events-none"
                style={{
                  animation: 'spin 3.2s linear infinite',
                  animationPlayState: isPlaying ? 'running' : 'paused',
                }}
              >
                {/* Micro-Grooves (Concentric Circles) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 46 46">
                  <circle cx="23" cy="23" r="21" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5" fill="none" />
                  <circle cx="23" cy="23" r="18" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" fill="none" />
                  <circle cx="23" cy="23" r="15" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" fill="none" />
                  <circle cx="23" cy="23" r="12" stroke="rgba(255,255,255,0.10)" strokeWidth="0.5" fill="none" />
                </svg>

                {/* Vinyl Dual-Wedge Specular Light Glare */}
                <div
                  className="absolute inset-0 rounded-full opacity-60 pointer-events-none"
                  style={{
                    background:
                      'conic-gradient(from 45deg, transparent 0deg, rgba(255,255,255,0.15) 35deg, transparent 70deg, transparent 180deg, rgba(255,255,255,0.15) 215deg, transparent 250deg)',
                  }}
                />

                {/* Center Vinyl Label Sticker */}
                <div className="relative w-[18px] h-[18px] rounded-full bg-gradient-to-tr from-[#d91d4e] via-[#ff2a85] to-[#ff7da7] border border-amber-200/50 flex items-center justify-center shadow-inner">
                  <span className="text-[5px] font-mono text-white font-black tracking-tighter drop-shadow">ODD</span>
                  {/* Spindle Center Hole */}
                  <div className="absolute w-[4px] h-[4px] rounded-full bg-black border border-zinc-600" />
                </div>
              </div>

              {/* Play / Pause Quick Indicator on Disc Hover */}
              <div className="absolute inset-0 rounded-full bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white z-10 pointer-events-none">
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 text-rose-200 drop-shadow" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-rose-200 ml-0.5 drop-shadow" />
                )}
              </div>
            </motion.div>

            {/* MECHANICAL TONEARM (Turntable Stylus Needle) - Optimized to rest flush inside perimeter */}
            <motion.div
              className="absolute top-[3px] right-[4px] pointer-events-none z-30 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
              style={{ transformOrigin: 'top right' }}
              animate={{
                rotate: isPlaying ? 22 : 2,
                x: isPlaying ? -1 : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 180,
                damping: 20,
                mass: 0.7,
              }}
            >
              {/* Metallic Pivot Base */}
              <div className="w-[7px] h-[7px] rounded-full bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-700 border border-zinc-300 shadow-sm flex items-center justify-center ml-auto">
                <div className="w-[2.5px] h-[2.5px] rounded-full bg-zinc-900" />
              </div>

              {/* Slender Chrome Stylus Arm Rod (Sized to fit perfectly within disc radius) */}
              <div className="w-[1.5px] h-[13px] bg-gradient-to-b from-zinc-300 via-zinc-100 to-zinc-400 mx-auto -mt-0.5 rounded-full" />

              {/* Angled Headshell / Cartridge */}
              <div className="relative -ml-0.5 w-[4.5px] h-[6px] bg-zinc-900 rounded-[1px] border border-zinc-600 shadow flex items-center justify-center">
                {/* Glowing Ruby Stylus Tip LED */}
                <div
                  className={`w-[1.8px] h-[1.8px] rounded-full transition-colors duration-300 ${
                    isPlaying ? 'bg-rose-400 shadow-[0_0_5px_#f43f5e]' : 'bg-zinc-600'
                  }`}
                />
              </div>
            </motion.div>
          </div>

          {/* ================================================================ */}
          {/* 2. EXPANDED CONTENT: TRACK INFO & HI-FI CONTROLS                  */}
          {/* ================================================================ */}
          <div className="absolute left-[56px] right-[8px] flex items-center justify-between pointer-events-auto">
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -14, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -8, filter: 'blur(4px)', transition: { duration: 0.16 } }}
                  transition={{ type: 'spring', stiffness: 320, damping: 26, delay: 0.05 }}
                  className="flex items-center justify-between w-full"
                >
                  {/* Track Info (Title, Tag, Artist, Equalizer) */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPlaylist((prev) => !prev);
                      sound.playPop();
                    }}
                    className="flex flex-col text-left cursor-pointer min-w-0 pr-1 max-w-[146px] group"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans font-semibold text-xs text-white truncate drop-shadow-sm group-hover:text-pink-200 transition-colors">
                        {currentSong.title}
                      </span>
                      <span className="text-[8px] font-mono px-1 py-0.2 rounded-full bg-pink-500/20 text-pink-300 uppercase shrink-0 border border-pink-500/30">
                        {currentSong.tag}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-sans text-[10px] text-pink-200/70 truncate">
                        {currentSong.artist}
                      </span>

                      {/* 5-Bar Dynamic Hi-Fi Audio Equalizer */}
                      <div className="flex items-end gap-[2px] h-2.5 shrink-0 ml-1 px-1 py-0.5 rounded bg-rose-950/30 border border-rose-500/20">
                        {[0.5, 0.9, 0.4, 0.85, 0.65].map((scale, i) => (
                          <motion.span
                            key={i}
                            className="w-[1.8px] rounded-full bg-gradient-to-t from-rose-500 via-pink-400 to-rose-200"
                            animate={
                              isPlaying
                                ? {
                                    height: [
                                      '20%',
                                      `${scale * 100}%`,
                                      '30%',
                                      `${Math.min(100, scale * 120)}%`,
                                      '20%',
                                    ],
                                  }
                                : { height: '20%' }
                            }
                            transition={{
                              duration: 0.65 + i * 0.1,
                              repeat: Infinity,
                              ease: 'easeInOut',
                              repeatType: 'reverse',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Micro-Interaction Controls (Skip, Mute, Playlist, Minimize) */}
                  <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {/* Skip Next Track */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.15, backgroundColor: 'rgba(255,255,255,0.12)' }}
                      whileTap={{ scale: 0.84 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                      onClick={handleNext}
                      className="p-1.5 rounded-full text-pink-200/80 hover:text-white transition-colors cursor-pointer"
                      title="Next track"
                    >
                      <SkipForward className="w-3.5 h-3.5" />
                    </motion.button>

                    {/* Mute / Unmute */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.15, backgroundColor: 'rgba(255,255,255,0.12)' }}
                      whileTap={{ scale: 0.84 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                      onClick={toggleMute}
                      className="p-1.5 rounded-full text-pink-200/80 hover:text-white transition-colors cursor-pointer"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? (
                        <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 text-pink-200" />
                      )}
                    </motion.button>

                    {/* Playlist Queue Toggle */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.15, backgroundColor: 'rgba(255,255,255,0.12)' }}
                      whileTap={{ scale: 0.84 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                      onClick={() => {
                        sound.playPop();
                        setShowPlaylist((prev) => !prev);
                      }}
                      className={`relative p-1.5 rounded-full transition-colors cursor-pointer ${
                        showPlaylist
                          ? 'bg-rose-500/30 text-rose-200'
                          : 'text-pink-200/80 hover:text-white'
                      }`}
                      title="Song queue"
                    >
                      <ListMusic className="w-3.5 h-3.5" />
                      {/* Track count badge */}
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-500 text-[7px] font-mono text-white flex items-center justify-center font-bold">
                        {PLAYLIST.length}
                      </span>
                    </motion.button>

                    {/* Minimize Back to Disc */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.15, backgroundColor: 'rgba(255,255,255,0.12)' }}
                      whileTap={{ scale: 0.84 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                      onClick={() => {
                        sound.playPop();
                        setIsExpanded(false);
                        setShowPlaylist(false);
                      }}
                      className="p-1 rounded-full text-pink-300/60 hover:text-pink-200 transition-colors cursor-pointer ml-0.5"
                      title="Minimize to vinyl"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Micro Sonic Progress Glow at the bottom edge */}
          {isPlaying && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-rose-400 to-transparent pointer-events-none"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </motion.div>

        {/* Compact Glow Tooltip when collapsed on Hover */}
        {!isExpanded && isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.92 }}
            animate={{ opacity: 1, y: 8, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute left-0 top-[54px] px-2.5 py-1 rounded-full bg-[#180514]/95 backdrop-blur-md border border-pink-400/35 text-[10.5px] font-sans font-medium text-rose-200 shadow-xl pointer-events-none whitespace-nowrap flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            {isPlaying ? `${currentSong.title} • Tap to expand` : 'Play romantic music ♡'}
          </motion.div>
        )}

        {/* ================================================================ */}
        {/* EXPANDABLE PLAYLIST QUEUE DRAWER (Frosted Glass Unfurl)           */}
        {/* ================================================================ */}
        <AnimatePresence>
          {isExpanded && showPlaylist && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 6, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 26 }}
              className="mt-1.5 p-2 bg-[#12030e]/95 backdrop-blur-3xl border border-pink-400/30 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(255,42,133,0.22)] w-[348px] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-[10px] font-mono tracking-widest text-pink-300/80 uppercase px-2 py-1 border-b border-white/10 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-rose-400" />
                  <span>SELECT TRACK ({PLAYLIST.length})</span>
                </span>
                <Disc3 className="w-3 h-3 text-rose-400 animate-spin" />
              </div>

              <div className="py-1 space-y-0.5 max-h-56 overflow-y-auto">
                {PLAYLIST.map((song, idx) => {
                  const isActive = idx === currentIdx;
                  return (
                    <motion.button
                      key={song.id}
                      type="button"
                      whileHover={{ x: 3, backgroundColor: 'rgba(255,255,255,0.06)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectSong(idx)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-rose-500/25 text-silkWhite font-semibold border border-rose-400/35 shadow-[0_0_12px_rgba(255,42,133,0.2)]'
                          : 'text-zinc-300'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <p className="truncate flex items-center gap-1.5">
                          <span>{song.title}</span>
                          <span className="text-[7.5px] font-mono px-1 py-0.2 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                            {song.tag}
                          </span>
                        </p>
                        <p className="text-[9.5px] text-zinc-400 font-normal truncate">{song.artist}</p>
                      </div>

                      {isActive ? (
                        <div className="flex items-end gap-[1.5px] h-2.5 shrink-0">
                          <span className="w-[2px] bg-rose-400 rounded-full animate-[pulse_0.6s_infinite] h-full" />
                          <span className="w-[2px] bg-rose-400 rounded-full animate-[pulse_0.4s_infinite] h-2/3" />
                          <span className="w-[2px] bg-rose-400 rounded-full animate-[pulse_0.8s_infinite] h-4/5" />
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-500">{`0${idx + 1}`}</span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
