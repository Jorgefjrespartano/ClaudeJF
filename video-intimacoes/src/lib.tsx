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

// Paleta sóbria: preto, branco e dourado discreto
export const C = {
  black: '#0A0A0B',
  panel: '#151517',
  line: '#2A2A2E',
  white: '#F5F5F2',
  gray: '#A6A6AD',
  dim: '#5E5E66',
  gold: '#C9A44C',
  goldDim: 'rgba(201,164,76,.35)',
};
export const FONT = 'Inter, Arial, sans-serif';

// Áreas seguras de Reels/Stories (px no quadro 1080×1920)
export const SAFE = {top: 260, bottom: 1920 - 430, left: 90, right: 1080 - 130};

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const norm = (w: string) => w.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
export const ease = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {...clamp, easing: (x) => 1 - Math.pow(1 - x, 3)});
export const soft = (f: number, at: number) => (f < at ? 0 : spring({frame: f - at, fps: FPS, config: {damping: 22, stiffness: 120}}));

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

export const Sfx: React.FC<{at: number; name: string; volume?: number}> = ({at, name, volume = 0.2}) => (
  <Sequence from={Math.max(0, at)} durationInFrames={45} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);

/** Texto que entra suavemente (fade + leve subida) */
export const Reveal: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties; dy?: number}> = ({at, children, style, dy = 18}) => {
  const f = useCurrentFrame();
  const t = soft(f, at);
  return <div style={{opacity: Math.min(1, t * 1.3), transform: `translateY(${(1 - t) * dy}px)`, ...style}}>{children}</div>;
};

/** Filete dourado que se desenha */
export const Hairline: React.FC<{at: number; width?: number; style?: React.CSSProperties}> = ({at, width = 160, style}) => {
  const f = useCurrentFrame();
  return <div style={{height: 3, width: width * ease(f, at, at + 14), background: C.gold, margin: '0 auto', ...style}} />;
};

// ícones de traço fino (genéricos, sem símbolos institucionais)
const PATHS: Record<string, React.ReactNode> = {
  phone: <><rect x="6" y="2" width="12" height="20" rx="2.5" /><path d="M10.5 18.5h3" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  doc: <><path d="M6 2h9l4 4v16H6z" /><path d="M15 2v4h4" /><path d="M9 11h7M9 15h7M9 19h4" /></>,
  pin: <><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z" /><circle cx="12" cy="10" r="2.6" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  linkoff: <><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" /><path d="M3 3l18 18" /></>,
  formoff: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /><path d="M3 3l18 18" /></>,
  alert: <><path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3Z" /><path d="M12 9v4M12 17h.01" /></>,
  link: <><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" /></>,
  building: <><path d="M3 21h18" /><path d="M5 21V10l7-5 7 5v11" /><path d="M9 21v-6h6v6" /><path d="M9 11h.01M15 11h.01" /></>,
  check: <><circle cx="12" cy="12" r="10" /><path d="m8 12 3 3 5-6" /></>,
};

/** Progresso 0→1 de um traço que se desenha */
export const drawP = (f: number, at: number, dur = 18) => ease(f, at, at + dur);

/** Caminho SVG que se desenha (usar dentro de um <svg>) */
export const Draw: React.FC<{d: string; at: number; dur?: number; color?: string; width?: number; opacity?: number}> = ({d, at, dur = 18, color = C.white, width = 4, opacity = 1}) => {
  const f = useCurrentFrame();
  const p = drawP(f, at, dur);
  if (p <= 0) return null;
  return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} opacity={opacity} />;
};

/** Linha reta tracejada que avança de (x1,y1) até (x1,y1)+p·(x2-x1,y2-y1) */
export const DashLine: React.FC<{x1: number; y1: number; x2: number; y2: number; p: number; color?: string; width?: number}> = ({x1, y1, x2, y2, p, color = C.gold, width = 4}) =>
  p <= 0 ? null : <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={color} strokeWidth={width} strokeDasharray="12 12" strokeLinecap="round" />;

export const Icon: React.FC<{name: string; size?: number; color?: string; stroke?: number}> = ({name, size = 80, color = C.white, stroke = 1.4}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{PATHS[name]}</svg>
);
