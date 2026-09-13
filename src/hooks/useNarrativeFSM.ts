import { useState, useCallback } from 'react';
import { NarrativeStage } from '../types';
import { sound } from '../utils/audioEngine';
import { triggerCinematicCelebration } from '../utils/confettiEngine';

const STAGE_PROGRESSION: Record<NarrativeStage, { next: NarrativeStage; sfx: () => void }> = {
  INTRO: { next: 'PROPOSAL', sfx: () => sound.playPop() },
  PROPOSAL: { next: 'ESCALATION_1_EVASION', sfx: () => sound.playWhoosh() },
  ESCALATION_1_EVASION: { next: 'ESCALATION_2_MELTDOWN', sfx: () => sound.playSqueak() },
  ESCALATION_2_MELTDOWN: { next: 'ESCALATION_3_RETRO', sfx: () => sound.playPop() },
  ESCALATION_3_RETRO: { next: 'ESCALATION_4_CASCADE', sfx: () => sound.playBoing() },
  ESCALATION_4_CASCADE: { next: 'ESCALATION_5_VOWS', sfx: () => sound.playSqueak() },
  ESCALATION_5_VOWS: { next: 'CLIMAX_FINAL', sfx: () => sound.playWahWah() },
  CLIMAX_FINAL: { next: 'CLIMAX_FINAL', sfx: () => sound.playWahWah() },
  CELEBRATION: { next: 'CELEBRATION', sfx: () => {} },
};

export const useNarrativeFSM = () => {
  const [stage, setStage] = useState<NarrativeStage>('INTRO');
  const [noAttempts, setNoAttempts] = useState<number>(0);

  // Deterministic advance to next NO escalation stage
  const onReject = useCallback(() => {
    setStage((current) => {
      const step = STAGE_PROGRESSION[current] || { next: 'CLIMAX_FINAL', sfx: () => sound.playWahWah() };
      step.sfx();
      return step.next;
    });
    setNoAttempts((prev) => prev + 1);
  }, []);

  // Accepted (either from initial stage, any interim stage, or final trap)
  const onAccept = useCallback(() => {
    sound.playBassDrop();
    sound.playFanfare();
    setStage('CELEBRATION');
    triggerCinematicCelebration();
  }, []);

  // Finish intro cold-open
  const onIntroComplete = useCallback(() => {
    sound.playPop();
    setStage('PROPOSAL');
  }, []);

  // Restart sequence
  const onRestart = useCallback(() => {
    sound.playPop();
    setNoAttempts(0);
    setStage('PROPOSAL');
  }, []);

  return {
    stage,
    noAttempts,
    onIntroComplete,
    onReject,
    onAccept,
    onRestart,
  };
};
