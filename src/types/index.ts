export type NarrativeStage =
  | 'INTRO'                // Cold open with glowing bow and loading line
  | 'PROPOSAL'             // Main "Will you be mine?" question
  | 'ESCALATION_1_EVASION' // Button flies away with "Nope!" bubble & lunging chibi
  | 'ESCALATION_2_MELTDOWN'// Floor crying, puddles, shaking button
  | 'ESCALATION_3_RETRO'   // Retro pink glass OS window with peeking puppy eyes
  | 'ESCALATION_4_CASCADE' // Cascading multi-windows & floating decoy swarm
  | 'ESCALATION_5_VOWS'    // Pretty Please sign & floating glowing love vows
  | 'CLIMAX_FINAL'         // Dramatic blackout pause & Dual-YES trap
  | 'CELEBRATION';         // Grand 4-act celebration & panoramic love letter

export type ChibiExpression =
  | 'rose'         // Chibi standing holding crimson rose with shy smirk
  | 'reach'        // Lunging forward with arms outstretched
  | 'floor_cry'    // Sobbing on belly with animated teardrops and ripples
  | 'puppy_eyes'   // Peeking over edge with huge glistening puppy eyes
  | 'sign_plead'   // Holding "Pretty Please" sign with puppy eyes
  | 'hug_heart'    // Joyful closed eyes blushing hugging giant beating heart
  | 'cuddle_partner'; // Cuddling partner/cat on pink hill

export interface Coordinates {
  x: number;
  y: number;
}

export interface LoveCouponData {
  id: number;
  title: string;
  category: string;
  description: string;
  isClaimed: boolean;
}
