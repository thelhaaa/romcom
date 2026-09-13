import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { AnimatePresence, motion } from 'framer-motion';
import { NarrativeStage } from '../../types';
import { SatinGiftBow } from '../stage/SatinGiftBow';
import { GlowPillButton } from '../ui/GlowPillButton';
import { sound } from '../../utils/audioEngine';
import { LayeredMascot } from '../character/LayeredMascot';
import { Scene3Meltdown } from '../scenes/Scene3Meltdown';
import { Scene4RetroModal } from '../scenes/Scene4RetroModal';
import { Scene5Cascade } from '../scenes/Scene5Cascade';
import { Scene6Vows } from '../scenes/Scene6Vows';
import { Scene7Climax } from '../scenes/Scene7Climax';
import { Scene8Celebration } from '../scenes/Scene8Celebration';
import { HolographicSticker } from '../effects/HolographicSticker';
import { AppleEmoji } from '../ui/AppleEmoji';
import { WashiTape } from '../ui/WashiTape';
import { useMascotEmotion } from '../../hooks/useMascotEmotion';
import { YouTubeAudioPlayer } from '../ui/YouTubeAudioPlayer';
import { useGyroscope, triggerHaptic } from '../../hooks/useMobileSensors';

interface CinematicWorldProps {
  stage: NarrativeStage;
  onIntroComplete: () => void;
  onAccept: () => void;
  onReject: () => void;
  onRestart: () => void;
}

/**
 * Persistent Cinematic World (Three.js 2.5D + GSAP)
 * ONE world, ONE camera, ONE renderer, ONE continuous motion-design composition.
 *
 * 2.5D Layering in Z space:
 * Z = -12: Distant atmosphere / cosmic vignette
 * Z = -8:  Deep stardust particle system
 * Z = -5:  Background botanical silhouettes
 * Z = -1:  Mascot character plane (acting & animated)
 * Z =  0:  Main typography & focal plane
 * Z = +2:  Drifting rose petals with impulse physics
 * Z = +3.5: Satin ribbon drape
 * Z = +5:  Foreground atmospheric motes
 */
export const CinematicWorld: React.FC<CinematicWorldProps> = ({
  stage,
  onIntroComplete,
  onAccept,
  onReject,
  onRestart,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const reqIdRef = useRef<number>(0);

  // Mascot Living Emotion System
  const mascotEmotion = useMascotEmotion();

  // Mobile Gyroscope Parallax
  const gyro = useGyroscope();
  const gyroRef = useRef(gyro);
  gyroRef.current = gyro;

  // Magnetic Gravity & Anti-Gravity Target References
  const gravityTargetRef = useRef<{ active: boolean; x: number; y: number }>({ active: false, x: -1.2, y: -0.8 });

  // 200ms Chromatic Aberration & Lens Shockwave State
  const [isShockwaving, setIsShockwaving] = useState(false);

  // References to persistent 3D objects
  const petalsMeshRef = useRef<THREE.Points | null>(null);
  const petalsVelocitiesRef = useRef<Float32Array | null>(null);
  const stardustMeshRef = useRef<THREE.Points | null>(null);
  const constellationGroupRef = useRef<THREE.Group | null>(null);
  const atmosphereMeshRef = useRef<THREE.Mesh | null>(null);
  const characterGroupRef = useRef<THREE.Group | null>(null);
  const ribbonMeshRef = useRef<THREE.Mesh | null>(null);
  const mainLightRef = useRef<THREE.PointLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  // Mouse Parallax
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseCurrentRef = useRef({ x: 0, y: 0 });

  // Intro progress state
  const [introProgress, setIntroProgress] = useState(0);

  // NO Button Evasion State in 3D/HUD space
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noCount, setNoCount] = useState(0);
  const [isReacting, setIsReacting] = useState(false);
  const [mascotState, setMascotState] = useState<'rose' | 'shock' | 'lunge'>('rose');

  // --------------------------------------------------------------------------
  // 1. INITIALIZE PERSISTENT THREE.JS ENGINE
  // --------------------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080508, 0.035);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.8);
    cameraRef.current = camera;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Ambient & Point Lighting
    const ambientLight = new THREE.AmbientLight(0xfcc2d7, 0.4);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const mainLight = new THREE.PointLight(0xff4d88, 2.8, 25);
    mainLight.position.set(0, 2, 4);
    scene.add(mainLight);
    mainLightRef.current = mainLight;

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
    rimLight.position.set(-5, 5, 2);
    scene.add(rimLight);

    // ------------------------------------------------------------------------
    // LAYER Z = -12: Distant Atmosphere Plane with Warm Burgundy Radial Bloom
    // ------------------------------------------------------------------------
    const atmoGeo = new THREE.PlaneGeometry(32, 22);
    const atmoCanvas = document.createElement('canvas');
    atmoCanvas.width = 512;
    atmoCanvas.height = 512;
    const atmoCtx = atmoCanvas.getContext('2d');
    if (atmoCtx) {
      const grad = atmoCtx.createRadialGradient(256, 256, 10, 256, 256, 256);
      grad.addColorStop(0, 'rgba(194, 37, 92, 0.28)');
      grad.addColorStop(0.5, 'rgba(110, 15, 43, 0.12)');
      grad.addColorStop(1, 'rgba(8, 5, 8, 0)');
      atmoCtx.fillStyle = grad;
      atmoCtx.fillRect(0, 0, 512, 512);
    }
    const atmoTex = new THREE.CanvasTexture(atmoCanvas);
    const atmoMat = new THREE.MeshBasicMaterial({
      map: atmoTex,
      transparent: true,
      depthWrite: false,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    atmoMesh.position.set(0, 0, -12);
    scene.add(atmoMesh);
    atmosphereMeshRef.current = atmoMesh;

    // ------------------------------------------------------------------------
    // LAYER Z = -8: Stardust Particle System
    // ------------------------------------------------------------------------
    const stardustCount = 220;
    const stardustPos = new Float32Array(stardustCount * 3);
    for (let i = 0; i < stardustCount; i++) {
      stardustPos[i * 3] = (Math.random() - 0.5) * 26;
      stardustPos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      stardustPos[i * 3 + 2] = -8 + (Math.random() - 0.5) * 4;
    }
    const stardustGeo = new THREE.BufferGeometry();
    stardustGeo.setAttribute('position', new THREE.BufferAttribute(stardustPos, 3));
    const stardustMat = new THREE.PointsMaterial({
      color: 0xffd1dc,
      size: 0.08,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const stardustMesh = new THREE.Points(stardustGeo, stardustMat);
    scene.add(stardustMesh);
    stardustMeshRef.current = stardustMesh;

    // ------------------------------------------------------------------------
    // LAYER Z = -7: 3D Celestial Heart Constellation (Chapters 7 & 8)
    // ------------------------------------------------------------------------
    const constellationGroup = new THREE.Group();
    const heartPointsCount = 44;
    const constellationVertices: number[] = [];
    for (let i = 0; i < heartPointsCount; i++) {
      const t = (i / heartPointsCount) * Math.PI * 2;
      const x = (16 * Math.pow(Math.sin(t), 3)) * 0.18;
      const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.18 + 0.8;
      const z = -7.2 + (Math.sin(i * 3) * 0.35);
      constellationVertices.push(x, y, z);
    }
    const constellationGeo = new THREE.BufferGeometry();
    const constellationFloatArray = new Float32Array(constellationVertices);
    constellationGeo.setAttribute('position', new THREE.BufferAttribute(constellationFloatArray, 3));

    const starMat = new THREE.PointsMaterial({
      color: 0xffe6f0,
      size: 0.18,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const constellationStars = new THREE.Points(constellationGeo, starMat);
    constellationGroup.add(constellationStars);

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xff80aa,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      linewidth: 1.5,
    });
    const constellationLines = new THREE.LineLoop(constellationGeo, lineMat);
    constellationGroup.add(constellationLines);

    scene.add(constellationGroup);
    constellationGroupRef.current = constellationGroup;

    // ------------------------------------------------------------------------
    // LAYER Z = +2: Drifting 3D Rose Petals with Physics & Reaction
    // ------------------------------------------------------------------------
    const petalsCount = 45;
    const petalsPos = new Float32Array(petalsCount * 3);
    const petalsVel = new Float32Array(petalsCount * 3);
    for (let i = 0; i < petalsCount; i++) {
      petalsPos[i * 3] = (Math.random() - 0.5) * 16;
      petalsPos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      petalsPos[i * 3 + 2] = 1.5 + Math.random() * 2.5;

      petalsVel[i * 3] = (Math.random() - 0.5) * 0.005;
      petalsVel[i * 3 + 1] = -0.004 - Math.random() * 0.006;
      petalsVel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    const petalsGeo = new THREE.BufferGeometry();
    petalsGeo.setAttribute('position', new THREE.BufferAttribute(petalsPos, 3));

    // Procedural organic petal disc texture
    const petalCanvas = document.createElement('canvas');
    petalCanvas.width = 64;
    petalCanvas.height = 64;
    const pCtx = petalCanvas.getContext('2d');
    if (pCtx) {
      pCtx.fillStyle = '#d6336c';
      pCtx.beginPath();
      pCtx.ellipse(32, 32, 28, 20, Math.PI / 4, 0, Math.PI * 2);
      pCtx.fill();
      pCtx.strokeStyle = '#6e0f2b';
      pCtx.lineWidth = 2;
      pCtx.stroke();
    }
    const petalTex = new THREE.CanvasTexture(petalCanvas);
    const petalsMat = new THREE.PointsMaterial({
      map: petalTex,
      size: 0.38,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const petalsMesh = new THREE.Points(petalsGeo, petalsMat);
    scene.add(petalsMesh);
    petalsMeshRef.current = petalsMesh;
    petalsVelocitiesRef.current = petalsVel;

    // ------------------------------------------------------------------------
    // LAYER Z = +3.5: Curved Satin Ribbon 3D Spline
    // ------------------------------------------------------------------------
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(3.8, 3.2, 1),
      new THREE.Vector3(3.2, 1.8, 2.5),
      new THREE.Vector3(4.0, 0.2, 3.2),
      new THREE.Vector3(3.4, -1.5, 3.6),
    ]);
    const ribbonGeo = new THREE.TubeGeometry(curve, 32, 0.06, 8, false);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xc2255c,
      roughness: 0.35,
      metalness: 0.2,
      emissive: 0x4a0e22,
      emissiveIntensity: 0.3,
    });
    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    scene.add(ribbonMesh);
    ribbonMeshRef.current = ribbonMesh;

    // ------------------------------------------------------------------------
    // ANIMATION & PARALLAX RENDER LOOP
    // ------------------------------------------------------------------------
    let clock = new THREE.Clock();

    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Camera Parallax Smoothing with Mobile Gyroscope integration
      const currentGyro = gyroRef.current;
      const targetX = currentGyro.isAvailable ? currentGyro.tiltX : mouseTargetRef.current.x;
      const targetY = currentGyro.isAvailable ? currentGyro.tiltY : mouseTargetRef.current.y;
      mouseCurrentRef.current.x += (targetX - mouseCurrentRef.current.x) * 0.05;
      mouseCurrentRef.current.y += (targetY - mouseCurrentRef.current.y) * 0.05;

      if (cameraRef.current) {
        camera.rotation.y = THREE.MathUtils.degToRad(-mouseCurrentRef.current.x * 2.8);
        camera.rotation.x = THREE.MathUtils.degToRad(mouseCurrentRef.current.y * 2.2);

        // Ambient Camera Breathing
        camera.position.y += Math.sin(elapsedTime * 1.2) * 0.0008;
      }

      // Stardust idle drift
      if (stardustMeshRef.current) {
        stardustMeshRef.current.rotation.y = elapsedTime * 0.015;
      }

      // 3D Celestial Heart Constellation Glow & Pulse in Chapters 7 & 8
      if (constellationGroupRef.current) {
        const isConstellationActive = stage === 'CLIMAX_FINAL' || stage === 'CELEBRATION';
        const targetOpacity = isConstellationActive ? 0.85 + Math.sin(elapsedTime * 2.5) * 0.15 : 0;
        const stars = constellationGroupRef.current.children[0] as THREE.Points;
        const lines = constellationGroupRef.current.children[1] as THREE.LineLoop;
        if (stars && stars.material) {
          (stars.material as THREE.PointsMaterial).opacity +=
            (targetOpacity - (stars.material as THREE.PointsMaterial).opacity) * 0.04;
        }
        if (lines && lines.material) {
          (lines.material as THREE.LineBasicMaterial).opacity +=
            (targetOpacity * 0.6 - (lines.material as THREE.LineBasicMaterial).opacity) * 0.04;
        }
        constellationGroupRef.current.rotation.z = Math.sin(elapsedTime * 0.35) * 0.025;
      }

      // Petals Physics with wrap-around
      if (petalsMeshRef.current && petalsVelocitiesRef.current) {
        const positions = petalsMeshRef.current.geometry.attributes.position.array as Float32Array;
        const vel = petalsVelocitiesRef.current;

        // 1. Magnetic Gravity Well: YES button pulls petals into a swirling orbit
        const gravity = gravityTargetRef.current;
        if (gravity && gravity.active) {
          for (let i = 0; i < petalsCount; i++) {
            const px = positions[i * 3];
            const py = positions[i * 3 + 1];
            const dx = gravity.x - px;
            const dy = gravity.y - py;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 8) {
              const pull = 0.0038 / Math.max(dist, 0.7);
              vel[i * 3] += dx * pull - dy * 0.003; // Inward orbital swirl
              vel[i * 3 + 1] += dy * pull + dx * 0.003;
            }
          }
        }

        for (let i = 0; i < petalsCount; i++) {
          positions[i * 3] += vel[i * 3];
          positions[i * 3 + 1] += vel[i * 3 + 1];
          positions[i * 3 + 2] += vel[i * 3 + 2];

          // Wrap bottom to top
          if (positions[i * 3 + 1] < -6) {
            positions[i * 3 + 1] = 6;
            positions[i * 3] = (Math.random() - 0.5) * 16;
          }
        }
        petalsMeshRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Heartbeat World Resonance in Chapter 07 (Climax)
      if (stage === 'CLIMAX_FINAL') {
        const hbPhase = (elapsedTime % 0.88) / 0.88;
        let hbPulse = 0;
        if (hbPhase < 0.14) {
          hbPulse = Math.sin((hbPhase / 0.14) * Math.PI) * 0.12;
        } else if (hbPhase > 0.22 && hbPhase < 0.36) {
          hbPulse = Math.sin(((hbPhase - 0.22) / 0.14) * Math.PI) * 0.07;
        }
        if (atmosphereMeshRef.current) {
          atmosphereMeshRef.current.scale.set(1.2 + hbPulse, 1.2 + hbPulse, 1);
        }
        if (mainLightRef.current) {
          mainLightRef.current.intensity = 2.4 + hbPulse * 9;
        }
      }

      // Ribbon gentle fabric sway
      if (ribbonMeshRef.current) {
        ribbonMeshRef.current.rotation.z = Math.sin(elapsedTime * 0.8) * 0.03;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Mouse Move Parallax
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseTargetRef.current = { x: nx, y: ny };
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(reqIdRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // --------------------------------------------------------------------------
  // 2. CAMERA CHOREOGRAPHY FOR STATE TRANSITIONS
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!cameraRef.current) return;
    const camera = cameraRef.current;

    if (stage === 'INTRO') {
      // Intro: Slow cinematic drift forward from distance
      gsap.to(camera.position, {
        x: 0,
        y: 0.1,
        z: 7.8,
        duration: 3.8,
        ease: 'power2.out',
      });
    } else if (stage === 'PROPOSAL') {
      // Proposal: Camera glides back into wide editorial poster framing
      setMascotState('rose');
      setNoPos({ x: 0, y: 0 });
      setNoCount(0);
      setIsReacting(false);
      gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: 8.8,
        duration: 1.2,
        ease: 'power3.out',
      });
      // Bloom pulse
      if (atmosphereMeshRef.current) {
        gsap.to(atmosphereMeshRef.current.scale, {
          x: 1.15,
          y: 1.15,
          duration: 1.2,
          yoyo: true,
          repeat: 1,
          ease: 'sine.inOut',
        });
      }
    } else if (stage === 'ESCALATION_1_EVASION') {
      // Evasion Framing: Snappy fluid glide focused on character & arena (zero lag)
      setMascotState('lunge');
      gsap.to(camera.position, {
        x: 0.25,
        y: -0.1,
        z: 7.6,
        duration: 0.65,
        ease: 'power2.out',
      });
    } else if (stage === 'ESCALATION_2_MELTDOWN') {
      // Meltdown: Dim lights, camera sinks down to console the sobbing mascot
      gsap.to(camera.position, {
        x: 0,
        y: -0.25,
        z: 7.4,
        duration: 1.2,
        ease: 'power2.out',
      });
      if (mainLightRef.current) {
        gsap.to(mainLightRef.current, { intensity: 1.6, duration: 1.0 });
      }
    } else if (stage === 'ESCALATION_3_RETRO') {
      // Retro Glass Modal: Gentle centered focus
      gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: 8.0,
        duration: 1.0,
        ease: 'power2.out',
      });
      if (mainLightRef.current) {
        gsap.to(mainLightRef.current, { intensity: 2.5, duration: 1.0 });
      }
    } else if (stage === 'ESCALATION_4_CASCADE') {
      // Decoy Cascade: Wide panoramic frame so floating buttons spread across the view
      gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: 9.4,
        duration: 1.2,
        ease: 'power3.out',
      });
      if (mainLightRef.current) {
        gsap.to(mainLightRef.current, { intensity: 2.8, duration: 1.0 });
      }
    } else if (stage === 'ESCALATION_5_VOWS') {
      // Vows: Warm promises framing
      gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: 8.2,
        duration: 1.0,
        ease: 'power2.out',
      });
      if (mainLightRef.current) {
        gsap.to(mainLightRef.current, { intensity: 2.7, duration: 1.0 });
      }
    } else if (stage === 'CLIMAX_FINAL') {
      // Climax: Intimate close push-in with heartbeat pulse
      gsap.to(camera.position, {
        x: 0,
        y: -0.05,
        z: 7.2,
        duration: 1.4,
        ease: 'power2.inOut',
      });
      if (mainLightRef.current) {
        gsap.to(mainLightRef.current, { intensity: 3.2, duration: 1.0 });
      }
      if (atmosphereMeshRef.current) {
        gsap.to(atmosphereMeshRef.current.scale, {
          x: 1.25,
          y: 1.25,
          duration: 0.8,
          repeat: 4,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    } else if (stage === 'CELEBRATION') {
      // Celebration: Expansive glorious frame, swirling petals
      gsap.to(camera.position, {
        x: 0,
        y: 0.1,
        z: 8.5,
        duration: 1.6,
        ease: 'power2.out',
      });
      if (mainLightRef.current) {
        gsap.to(mainLightRef.current, { intensity: 3.6, duration: 1.2 });
      }
      if (atmosphereMeshRef.current) {
        gsap.killTweensOf(atmosphereMeshRef.current.scale);
        gsap.to(atmosphereMeshRef.current.scale, { x: 1.35, y: 1.35, duration: 1.5 });
      }
      if (petalsVelocitiesRef.current) {
        for (let i = 0; i < 45; i++) {
          petalsVelocitiesRef.current[i * 3 + 1] += 0.03 + Math.random() * 0.04;
        }
      }
    }
  }, [stage]);

  // --------------------------------------------------------------------------
  // 3. INTRO PROGRESS TIMER
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (stage !== 'INTRO') return;
    const timer = setInterval(() => {
      setIntroProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            sound.playPop();
            onIntroComplete();
          }, 350);
          return 100;
        }
        return Math.min(p + 8, 100);
      });
    }, 110);
    return () => clearInterval(timer);
  }, [stage, onIntroComplete]);

  // --------------------------------------------------------------------------
  // 4. CHAPTER 1 & 2 NO INTERACTION SYSTEM (Zero-Lag, Buttery Smooth & Safe)
  // --------------------------------------------------------------------------
  // Reset all evasion counters and positions whenever returning to PROPOSAL
  useEffect(() => {
    if (stage === 'PROPOSAL') {
      setNoPos({ x: 0, y: 0 });
      setNoCount(0);
      setIsReacting(false);
      setMascotState('rose');
    }
  }, [stage]);

  // Chapter 1 NO Click: Immediate fluid transition into Chapter 2 (ZERO LAG / ZERO HOLD)
  const handleChapter1NoClick = useCallback(() => {
    sound.playWhoosh();
    triggerHaptic(25);
    setMascotState('lunge');
    setNoPos({ x: 0, y: 0 });
    setNoCount(0);
    onReject(); // Transitions narrative state machine to ESCALATION_1_EVASION immediately!
  }, [onReject]);

  // Safe Evasion Jump Coordinates (Responsive: bounded for mobile screens to prevent jumping offscreen)
  const getDodgeTarget = (count: number) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    if (isMobile) {
      const MOBILE_TARGETS = [
        { x: 60, y: -26 },
        { x: 80, y: 22 },
        { x: 50, y: -34 },
        { x: 85, y: 12 },
        { x: 55, y: 30 },
        { x: 75, y: -18 },
      ];
      return MOBILE_TARGETS[count % MOBILE_TARGETS.length];
    }
    const DESKTOP_TARGETS = [
      { x: 125, y: -40 },
      { x: 155, y: 30 },
      { x: 110, y: -55 },
      { x: 165, y: 15 },
      { x: 135, y: 45 },
      { x: 150, y: -25 },
    ];
    return DESKTOP_TARGETS[count % DESKTOP_TARGETS.length];
  };

  // Chapter 2 NO Dodge on Hover / Touch
  const handleChapter2NoDodge = useCallback(() => {
    setNoCount((prev) => {
      const next = prev + 1;
      const target = getDodgeTarget(next);
      setNoPos(target);
      sound.playSqueak();
      triggerHaptic(18);

      // Radially flutter soft 3D rose petals in Three.js
      if (petalsVelocitiesRef.current) {
        for (let i = 0; i < 20; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.025 + Math.random() * 0.035;
          petalsVelocitiesRef.current[i * 3] = Math.cos(angle) * speed;
          petalsVelocitiesRef.current[i * 3 + 1] = Math.sin(angle) * speed;
        }
      }
      return next;
    });
  }, []);

  // Chapter 2 NO Click: If clicked directly or after dodging 3-4 times
  const handleChapter2NoClick = useCallback(() => {
    sound.playWahWah();
    triggerHaptic([25, 35]);
    onReject(); // Transitions to Meltdown (Chapter 3)
  }, [onReject]);

  // Replay handler: Resets evasion state and returns to Proposal
  const handleReplay = useCallback(() => {
    sound.playPop();
    setNoPos({ x: 0, y: 0 });
    setNoCount(0);
    setIsReacting(false);
    setMascotState('rose');
    onRestart();
  }, [onRestart]);

  return (
    <div
      className={`relative w-full min-h-[100svh] overflow-x-hidden bg-[#080508] text-[#fcf8f9] select-none transition-transform duration-75 ${
        isShockwaving
          ? 'scale-[1.018] translate-x-[3px] translate-y-[-2px] filter drop-shadow-[-5px_0_0_rgba(255,42,133,0.85)] drop-shadow-[5px_0_0_rgba(0,240,255,0.85)]'
          : ''
      }`}
    >
      {/* 1. PERSISTENT THREE.JS / WEBGL VIEWPORT */}
      <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* Floating Apple-style YouTube Romantic Audio Player */}
      <YouTubeAudioPlayer />

      {/* 2. SYNCHRONIZED INTERACTIVE HUD / EDITORIAL COMPOSITION */}
      <div className="relative z-20 w-full min-h-[100svh] flex flex-col items-center justify-center px-3 sm:px-8 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {/* ================================================================ */}
          {/* SCENE 0: INTRO / COLD OPEN                                       */}
          {/* ================================================================ */}
          {stage === 'INTRO' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center max-w-md mx-auto text-center"
            >
              {/* Editorial Metadata */}
              <span className="font-monoTag text-[11px] tracking-[0.3em] text-[#d4708f]/80 uppercase font-medium mb-6">
                [ CHAPTER 00 // PROLOGUE.INIT ]
              </span>

              {/* THE REDESIGNED AUTHENTIC SATIN GIFT BOW */}
              <div className="w-48 h-44 sm:w-56 sm:h-52 mb-6">
                <SatinGiftBow animated={true} />
              </div>

              {/* Title in Gen-Z Mix */}
              <h2 className="font-poster font-bold text-3xl sm:text-4xl text-[#fcf8f9] tracking-tight uppercase mb-1">
                A Quiet Moment For You
              </h2>
              <p className="font-doodle text-2xl text-[#d4708f] mb-6">
                take a gentle breath bb... ♡
              </p>

              {/* Hairline Progress Bar */}
              <div className="w-full h-1 bg-[#1b0814] rounded-full overflow-hidden border border-[#3b1227]">
                <div
                  className="h-full bg-gradient-to-r from-[#8f1d40] via-[#d6336c] to-[#fcc2d7] transition-all duration-150 relative"
                  style={{ width: `${introProgress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_#fff]" />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between w-full">
                <span className="font-monoTag text-[10px] tracking-[0.2em] text-[#d4708f]/70 uppercase font-medium">
                  Unfolding The Story
                </span>
                <span className="font-editorial italic text-base text-[#fcf8f9]/90">
                  {introProgress}%
                </span>
              </div>
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 1 & 2: PROPOSAL & CHOREOGRAPHED EVASION                     */}
          {/* ================================================================ */}
          {(stage === 'PROPOSAL' || stage === 'ESCALATION_1_EVASION') && (
            <motion.div
              key="proposal-evasion"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-5xl mx-auto flex flex-col"
            >
              {/* Header Metadata with Holographic Sticker */}
              <div className="w-full flex items-center justify-between border-b border-[#2b1020] pb-3 mb-8">
                <span className="font-monoTag text-[11px] tracking-[0.28em] text-[#d4708f]/90 uppercase font-medium">
                  {stage === 'PROPOSAL'
                    ? '[ CH_01 // INTENT.EXE ]'
                    : `[ CH_02 // ESCALATION_DODGE_${Math.min(noCount + 1, 4)}_OF_4 ]`}
                </span>
                <div className="flex items-center gap-3">
                  <HolographicSticker rotation={-2} variant="pink">
                    <span className="font-doodle text-sm text-[#fbcfe8]">for keeps bb ♡</span>
                  </HolographicSticker>
                  <span className="font-doodle text-lg sm:text-xl text-[#f5c2d3]/80 hidden sm:inline">
                    always & forever
                  </span>
                </div>
              </div>

              {/* Asymmetrical 2.5D Composition */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Left Column: Modern Gen-Z Editorial Typography */}
                <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left">
                  <span className="font-doodle text-2xl sm:text-3xl text-[#ff7da7] rotate-[-2deg] mb-1">
                    {stage === 'PROPOSAL' ? 'a tiny question for your heart...' : "wait, don't run away..."}
                  </span>

                  <h1 className="leading-[0.88] tracking-tight mb-4">
                    <span className="font-apple font-black text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-tight uppercase text-silkWhite drop-shadow-[0_4px_30px_rgba(255,255,255,0.25)] block">
                      {stage === 'PROPOSAL' ? 'WILL YOU' : 'WAIT BB...'}
                    </span>
                    <span className="font-curvy italic font-bold text-6xl sm:text-7xl md:text-8xl lg:text-[6.2rem] bg-gradient-to-r from-[#ff4d88] via-[#ff7da7] to-[#fcc2d7] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(255,77,136,0.6)] block mt-1">
                      {stage === 'PROPOSAL' ? 'BE MINE?' : 'STAY HERE.'}
                    </span>
                  </h1>

                  <p className="font-apple text-lg sm:text-xl text-[#f5c2d3]/90 font-normal max-w-md mb-8 leading-relaxed">
                    {stage === 'PROPOSAL'
                      ? '“In a world full of fleeting moments, I find myself holding onto every second with you.”'
                      : '“You tried to click NO... but our story is just getting started.”'}
                  </p>

                  {/* Controls Area with Magnetic Gravity & Anti-Gravity */}
                  <div className="relative w-full max-w-md min-h-[90px] flex items-center justify-center md:justify-start gap-4 sm:gap-6">
                    {/* Stable Magnetic Radiant YES Button */}
                    <div
                      onMouseEnter={() => {
                        mascotEmotion.setButtonHover('yes');
                        gravityTargetRef.current = { active: true, x: -1.2, y: -0.8 };
                      }}
                      onMouseLeave={() => {
                        mascotEmotion.setButtonHover('none');
                        gravityTargetRef.current.active = false;
                      }}
                      className="relative group"
                    >
                      <GlowPillButton variant="yes" size="lg" onClick={onAccept}>
                        Yes
                      </GlowPillButton>
                      {/* Interactive Orbiting Star Label */}
                      {mascotEmotion.buttonHover === 'yes' && (
                        <div className="absolute -top-7 -right-2 font-apple font-semibold text-xs text-roseGlow animate-bounce whitespace-nowrap pointer-events-none flex items-center gap-1">
                          <AppleEmoji emoji="✨" className="w-4 h-4 inline-block" />
                          <span>say yes bb!</span>
                        </div>
                      )}
                    </div>

                    {/* Physical Escaping NO Button with Fluid Spring Dynamics */}
                    <motion.div
                      animate={{
                        x: stage === 'PROPOSAL' ? 0 : noPos.x,
                        y: stage === 'PROPOSAL' ? 0 : noPos.y,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 420,
                        damping: 24,
                        mass: 0.65,
                      }}
                      onMouseEnter={() => {
                        mascotEmotion.setButtonHover('no');
                        if (stage === 'ESCALATION_1_EVASION') {
                          handleChapter2NoDodge();
                        }
                      }}
                      onMouseLeave={() => {
                        mascotEmotion.setButtonHover('none');
                      }}
                      onTouchStart={() => {
                        mascotEmotion.setButtonHover('no');
                        if (stage === 'ESCALATION_1_EVASION') {
                          handleChapter2NoDodge();
                        }
                      }}
                      onClick={() => {
                        if (stage === 'PROPOSAL') {
                          handleChapter1NoClick();
                        } else {
                          handleChapter2NoClick();
                        }
                      }}
                      className="relative cursor-pointer"
                    >
                      {/* Floating Evasion Flag with Apple Emoji */}
                      {stage === 'ESCALATION_1_EVASION' && (
                        <div className="absolute -top-7 -right-4 bg-[#faf6f0] text-[#7a1631] border border-[#ebd8c5] font-apple text-xs px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap animate-bounce flex items-center gap-1.5 pointer-events-none">
                          <span>
                            {noCount <= 0
                              ? 'not so fast!'
                              : noCount === 1
                              ? 'almost caught me!'
                              : noCount === 2
                              ? 'why you clicking no?'
                              : 'okay, hear me out...'}
                          </span>
                          <AppleEmoji
                            emoji={noCount <= 0 ? '🏃' : noCount === 1 ? '🥺' : noCount === 2 ? '💔' : '😭'}
                            className="w-4 h-4 inline-block"
                          />
                        </div>
                      )}
                      <GlowPillButton variant="no" size="md">
                        No
                      </GlowPillButton>
                    </motion.div>
                  </div>

                  {/* Playful Evasion Helper / Surrender Link */}
                  {stage === 'ESCALATION_1_EVASION' && (
                    <div className="mt-4 flex items-center gap-3">
                      <span className="font-monoTag text-[11px] tracking-wider text-[#d4708f]/70 uppercase font-medium">
                        [ EVASION_{Math.min(noCount + 1, 4)}_OF_4 ]
                      </span>
                      <button
                        onClick={() => onReject()}
                        className="font-apple text-sm text-[#f5c2d3]/80 hover:text-white underline underline-offset-4 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>(give up and hear me out bb)</span>
                        <AppleEmoji emoji="🥺" className="w-4 h-4 inline-block" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Column: Living Character Acting in World Space */}
                <div className="md:col-span-5 flex flex-col items-center justify-center relative py-4">
                  <div className="relative p-4 bg-white/[0.04] rounded-3xl border border-white/15 backdrop-blur-sm shadow-[0_20px_45px_rgba(0,0,0,0.6)]">
                    <div className="absolute -top-3 -right-2 pointer-events-none z-30">
                      <WashiTape variant="pink" rotation={-6} width="w-20 sm:w-24" />
                    </div>
                    <LayeredMascot
                      pose={stage === 'PROPOSAL' ? (mascotState === 'shock' ? 'lunge' : 'rose') : 'lunge'}
                      sadLevel={stage === 'PROPOSAL' ? 0 : noCount}
                      isAnticipating={isReacting}
                      lookX={mascotEmotion.lookX}
                      lookY={mascotEmotion.lookY}
                      buttonHover={mascotEmotion.buttonHover}
                      isBlinking={mascotEmotion.isBlinking}
                      isPoked={mascotEmotion.isPoked}
                      onPoke={mascotEmotion.triggerPoke}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <HolographicSticker rotation={2} variant={stage === 'ESCALATION_1_EVASION' && noCount >= 2 ? 'pink' : 'gold'}>
                      <span className="font-monoTag text-xs text-[#fef08a] flex items-center gap-1.5 font-bold uppercase tracking-wider">
                        <span>
                          {stage === 'PROPOSAL'
                            ? '100% DESTINED'
                            : noCount === 0
                            ? 'PLS STAY'
                            : noCount === 1
                            ? "DON'T GO..."
                            : noCount === 2
                            ? 'TEARING UP'
                            : 'HEART BROKEN'}
                        </span>
                        <AppleEmoji
                          emoji={
                            stage === 'PROPOSAL'
                              ? '💖'
                              : noCount === 0
                              ? '🥺'
                              : noCount === 1
                              ? '💧'
                              : noCount === 2
                              ? '💔'
                              : '😭'
                          }
                          className="w-4 h-4 inline-block"
                        />
                      </span>
                    </HolographicSticker>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 3: MELTDOWN (Sobbing chibi, floor ripples, dimmed lights)   */}
          {/* ================================================================ */}
          {stage === 'ESCALATION_2_MELTDOWN' && (
            <motion.div
              key="meltdown"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="w-full max-w-xl mx-auto"
            >
              <Scene3Meltdown onYes={onAccept} onNo={onReject} />
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 4: RETRO GLASS MODAL (Puppy eyes plea)                     */}
          {/* ================================================================ */}
          {stage === 'ESCALATION_3_RETRO' && (
            <motion.div
              key="retro"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="w-full flex justify-center"
            >
              <Scene4RetroModal onYes={onAccept} onNo={onReject} />
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 5: CASCADE (Decoy button swarm, growing YES)               */}
          {/* ================================================================ */}
          {stage === 'ESCALATION_4_CASCADE' && (
            <motion.div
              key="cascade"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="w-full max-w-5xl mx-auto"
            >
              <Scene5Cascade onYes={onAccept} onNextNo={onReject} />
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 6: VOWS (Gentle promises placard)                          */}
          {/* ================================================================ */}
          {stage === 'ESCALATION_5_VOWS' && (
            <motion.div
              key="vows"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="w-full max-w-xl mx-auto"
            >
              <Scene6Vows onYes={onAccept} onNo={onReject} />
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 7: CLIMAX FINAL (Dual YES trap, heartbeat bloom)           */}
          {/* ================================================================ */}
          {stage === 'CLIMAX_FINAL' && (
            <motion.div
              key="climax"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
              className="w-full max-w-xl mx-auto"
            >
              <Scene7Climax onYes={onAccept} />
            </motion.div>
          )}

          {/* ================================================================ */}
          {/* SCENE 8: CELEBRATION (Ecstatic mascot, letter, replay)           */}
          {/* ================================================================ */}
          {stage === 'CELEBRATION' && (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full max-w-4xl mx-auto"
            >
              <Scene8Celebration onReplay={handleReplay} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
