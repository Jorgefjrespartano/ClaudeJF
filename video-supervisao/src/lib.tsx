import React from 'react';
import {Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import timeline from './timeline.json';

export const FPS = 30;
export const W = 1080;
export const H = 1920;

export type Word = {w: string; s: number; e: number};
export type Scene = {id: string; text: string; start: number; duration: number; words: Word[]};
export const scenes = timeline.scenes as Scene[];
export const TOTAL = Math.round(timeline.total * FPS);

// Paleta: azul-marinho (fundo), azul-claro, branco, âmbar suave. Sem vermelho.
export const C = {
  navy: '#0B1F3A',
  navy2: '#12305A',
  navy3: '#1A4275',
  sky: '#7CC4F2',
  skySoft: '#BFE3FA',
  white: '#FFFFFF',
  amber: '#F5B942',
  amberSoft: '#FFE3A3',
  ink: '#0B1F3A',
  muted: '#8FA8C8',
  skin: '#C98E6B',
};
export const FONT = 'Inter, Arial, sans-serif';

// Zonas seguras do Reels: 250 px no topo, 400 px na base, 150 px à direita
export const SAFE = {top: 250, bottom: 1920 - 400, left: 60, right: 1080 - 150};
export const CX = (SAFE.left + SAFE.right) / 2; // centro horizontal da área segura (495)

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const norm = (w: string) => w.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
export const ease = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {...clamp, easing: (x) => 1 - Math.pow(1 - x, 3)});
export const soft = (f: number, at: number, damping = 20, stiffness = 120) =>
  f < at ? 0 : spring({frame: f - at, fps: FPS, config: {damping, stiffness}});

/** frame (relativo à cena) em que é falada a n-ésima palavra que começa com `key` */
export const wf = (sc: Scene, key: string, nth = 0) => {
  let c = 0;
  for (const w of sc.words) {
    if (norm(w.w).startsWith(norm(key))) {
      if (c === nth) return Math.round(w.s * FPS);
      c++;
    }
  }
  return 0;
};
export const sceneLen = (sc: Scene) => Math.round(sc.duration * FPS);
/** flutuação contínua e suave */
export const floatY = (f: number, amp = 8, speed = 40, ph = 0) => Math.sin(f / speed * Math.PI * 2 / 2 + ph) * amp;

export const Sfx: React.FC<{at: number; name: string; volume?: number}> = ({at, name, volume = 0.12}) => (
  <Sequence from={Math.max(0, at)} durationInFrames={45} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);

/** Entra com fade + leve deslize */
export const Reveal: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties; dy?: number; dx?: number}> = ({at, children, style, dy = 24, dx = 0}) => {
  const f = useCurrentFrame();
  const t = soft(f, at);
  return <div style={{opacity: Math.min(1, t * 1.4), transform: `translate(${(1 - t) * dx}px, ${(1 - t) * dy}px)`, ...style}}>{children}</div>;
};

/** Texto de destaque (topo da área segura) */
export const Headline: React.FC<{at?: number; children: React.ReactNode; size?: number; top?: number; color?: string}> = ({at = 0, children, size = 66, top = 320, color = C.white}) => (
  <div style={{position: 'absolute', left: SAFE.left, width: SAFE.right - SAFE.left, top, textAlign: 'center', fontFamily: FONT}}>
    <Reveal at={at}><div style={{fontSize: size, fontWeight: 900, lineHeight: 1.08, color, letterSpacing: '-.01em', textShadow: '0 6px 30px rgba(0,0,0,.35)'}}>{children}</div></Reveal>
  </div>
);
