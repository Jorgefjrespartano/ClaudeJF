import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import timeline from './timeline.json';

export const FPS = 30;
export const W = 1920;
export const H = 1080;

export type Word = {w: string; s: number; e: number};
export type Scene = {id: string; block: string; text: string; start: number; duration: number; words: Word[]};
export const scenes = timeline.scenes as Scene[];
export const TOTAL = Math.round(timeline.total * FPS);

// Paleta do infográfico
export const C = {
  navy: '#0A1F3D', navy2: '#11315C', navy3: '#183E70', deep: '#061428',
  ink: '#1C222C', graphite: '#2E3440', muted: '#5D6776', faint: '#8A93A1',
  line: '#DCE2EA', bg: '#EEF1F5', card: '#FFFFFF',
  gold: '#C9A24B', goldSoft: '#F7F0DC', goldInk: '#8A6A1F',
  cyan: '#18A8C8', cyanSoft: '#E2F4F8', cyanInk: '#0D6F86',
  green: '#2BB673', red: '#E0524A',
};
export const FONT = 'Inter, "Segoe UI", Arial, sans-serif';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const norm = (w: string) => w.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
export const ease = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {...clamp, easing: (x) => 1 - Math.pow(1 - x, 3)});
export const pop = (f: number, at: number, damping = 15, stiffness = 170) =>
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

export const Sfx: React.FC<{at: number; name: string; volume?: number}> = ({at, name, volume = 0.35}) => (
  <Sequence from={Math.max(0, at)} durationInFrames={45} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);

// ------------------------------------------------------------------ ícones (mesmo traço do infográfico)

const PATHS: Record<string, React.ReactNode> = {
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  face: <><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><path d="M9 9h.01" /><path d="M15 9h.01" /></>,
  portal: <><path d="M3 21h18" /><path d="M5 21V4h14v17" /><path d="M9 21V8h6v13" /><path d="M7 6.5h.01M17 6.5h.01" /></>,
  retrieve: <><path d="M12 15V3" /><path d="m7 8 5-5 5 5" /><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" /></>,
  check: <><circle cx="12" cy="12" r="10" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>,
  cpu: <><rect x="5" y="5" width="14" height="14" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M19 9h3M19 15h3M2 9h3M2 15h3" /></>,
  net: <><rect x="16" y="16" width="6" height="6" rx="1" /><rect x="2" y="16" width="6" height="6" rx="1" /><rect x="9" y="2" width="6" height="6" rx="1" /><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" /><path d="M12 12V8" /></>,
  cloud: <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />,
  monitor: <><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /><path d="m11 7-2 3h4l-2 3" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" /></>,
  alert: <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4M12 17h.01" /></>,
  chart: <><path d="M3 3v18h18" /><path d="M7 16v-4M12 16V8M17 16v-7" /></>,
  loop: <><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></>,
  lock: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
  flag: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><path d="M4 22v-7" /></>,
  link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>,
  target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
  bag: <><path d="M6 8h12l-1 13H7L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
  camera: <><path d="M3 8a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /><circle cx="12" cy="13" r="4" /></>,
  phone: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>,
  key: <><circle cx="7.5" cy="15.5" r="4.5" /><path d="m10.7 12.3 9.3-9.3M17 6l3 3M14 9l2 2" /></>,
  wallet: <><rect x="2" y="6" width="20" height="14" rx="2" /><path d="M2 10h20" /><circle cx="17" cy="15" r="1.2" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  arrowR: <><path d="M4 12h16" /><path d="m14 6 6 6-6 6" /></>,
  map: <><path d="M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3Z" /><path d="M9 3v15M15 6v15" /></>,
};

export const Icon: React.FC<{name: string; size?: number; color?: string; stroke?: number; style?: React.CSSProperties}> = ({
  name, size = 24, color = 'currentColor', stroke = 1.9, style,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke}
    strokeLinecap="round" strokeLinejoin="round" style={{flex: 'none', ...style}}>
    {PATHS[name]}
  </svg>
);

/** Ícone em círculo, como nos blocos do infográfico */
export const IconDot: React.FC<{name: string; size?: number; bg?: string; color?: string}> = ({name, size = 64, bg = C.cyanSoft, color = C.cyanInk}) => (
  <div style={{width: size, height: size, borderRadius: size / 2, background: bg, color, display: 'grid', placeItems: 'center', flex: 'none'}}>
    <Icon name={name} size={size * 0.52} />
  </div>
);

// ------------------------------------------------------------------ moldura persistente

const BLOCKS: Record<string, string> = {'O PROBLEMA': '01', 'A SOLUÇÃO': '02', 'COMO FUNCIONA': '03', IMPACTO: '04'};

export const Chrome: React.FC = () => {
  const f = useCurrentFrame();
  let cur = scenes[0];
  for (const s of scenes) if (f >= Math.round(s.start * FPS)) cur = s;
  const st = Math.round(cur.start * FPS);
  const t = ease(f, st, st + 12);
  const dark = ['c01', 'c02', 'c03', 'c09', 'c12'].includes(cur.id);
  const label = cur.block;
  return (
    <AbsoluteFill style={{fontFamily: FONT, pointerEvents: 'none'}}>
      {label && (
        <div style={{position: 'absolute', top: 54, left: 72, display: 'flex', alignItems: 'center', gap: 14, opacity: t, transform: `translateX(${(1 - t) * -16}px)`}}>
          <span style={{fontSize: 18, fontWeight: 800, color: '#fff', background: C.navy, border: dark ? `1px solid ${C.gold}` : 'none', borderRadius: 5, padding: '6px 9px', letterSpacing: '.04em'}}>{BLOCKS[label]}</span>
          <span style={{fontSize: 19, fontWeight: 800, letterSpacing: '.16em', color: dark ? '#E6CC8C' : C.navy}}>{label}</span>
        </div>
      )}
      <div style={{position: 'absolute', top: 58, right: 72, fontSize: 16, fontWeight: 700, letterSpacing: '.16em', color: dark ? '#A9B7CC' : C.muted, opacity: label ? 1 : 0}}>
        PIC BA · ANTEPROJETO
      </div>
      {/* linha dourada + ciano do cabeçalho do infográfico, como barra de progresso */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 6, background: dark ? 'rgba(255,255,255,.08)' : C.line}}>
        <div style={{width: `${(f / TOTAL) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.gold} 0 34%, ${C.cyan} 34% 100%)`, backgroundSize: '1920px 100%'}} />
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ legendas (frase a frase)

type Cap = {text: string; from: number; to: number};
const CAPS: Cap[] = (() => {
  const out: Cap[] = [];
  for (const s of scenes) {
    let cur: Word[] = [];
    const flush = () => {
      if (!cur.length) return;
      out.push({text: cur.map((w) => w.w).join(' '), from: Math.round((s.start + cur[0].s) * FPS), to: Math.round((s.start + cur[cur.length - 1].e) * FPS) + 10});
      cur = [];
    };
    s.words.forEach((w, i) => {
      cur.push(w);
      const len = cur.reduce((n, x) => n + x.w.length + 1, 0);
      const next = s.words[i + 1];
      if (/[.:;?!]$/.test(w.w) || (/,$/.test(w.w) && len > 30) || len > 52 || !next) flush();
    });
  }
  for (let i = 0; i < out.length - 1; i++) out[i].to = Math.min(out[i].to, out[i + 1].from);
  return out;
})();

export const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const cap = CAPS.find((c) => f >= c.from && f < c.to);
  if (!cap) return null;
  const t = ease(f, cap.from, cap.from + 5);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 52, display: 'flex', justifyContent: 'center', opacity: t}}>
      <div style={{fontFamily: FONT, fontSize: 34, fontWeight: 600, color: '#fff', background: 'rgba(6,20,40,.78)', padding: '10px 26px', borderRadius: 8, maxWidth: 1400, textAlign: 'center', lineHeight: 1.3}}>
        {cap.text}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ peças comuns

export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.05}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity, mixBlendMode: 'overlay', backgroundImage: `url(${staticFile('noise.png')})`, backgroundPosition: `${(f * 137) % 512}px ${(f * 251) % 512}px`, pointerEvents: 'none'}} />;
};

/** Lettering de apoio grande */
export const Lettering: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties; color?: string; size?: number}> = ({at, children, style, color = '#fff', size = 64}) => {
  const f = useCurrentFrame();
  const t = pop(f, at, 18, 160);
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', fontFamily: FONT, fontWeight: 800, fontSize: size, color, letterSpacing: '-.02em', lineHeight: 1.08, opacity: Math.min(1, t * 1.4), transform: `translateY(${(1 - t) * 24}px)`, ...style}}>
      {children}
    </div>
  );
};

/** Selo/etiqueta no estilo dos chips do infográfico */
export const Chip: React.FC<{at: number; children: React.ReactNode; tone?: 'navy' | 'gold' | 'cyan' | 'light'; style?: React.CSSProperties; size?: number}> = ({at, children, tone = 'navy', style, size = 24}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const t = pop(f, at, 14, 220);
  const tones = {
    navy: {background: C.navy, color: '#fff'},
    gold: {background: C.gold, color: C.navy},
    cyan: {background: C.cyan, color: '#fff'},
    light: {background: '#fff', color: C.navy, boxShadow: `inset 0 0 0 2px ${C.line}`},
  }[tone];
  return (
    <div style={{position: 'absolute', fontFamily: FONT, fontWeight: 800, fontSize: size, letterSpacing: '.06em', padding: `${size * 0.4}px ${size * 0.75}px`, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap', transform: `scale(${t})`, boxShadow: '0 10px 30px rgba(10,31,61,.18)', ...tones, ...style}}>
      {children}
    </div>
  );
};

/** Pessoa estilizada (vista lateral simplificada), rosto anônimo */
export const Person: React.FC<{x: number; y: number; scale?: number; shirt?: string; walk?: number; opacity?: number}> = ({x, y, scale = 1, shirt = C.gold, walk = 0, opacity = 1}) => {
  const bob = Math.abs(Math.sin(walk * 0.5)) * 6;
  const leg = Math.sin(walk * 0.5) * 14;
  return (
    <svg width={120 * scale} height={260 * scale} viewBox="0 0 120 260" style={{position: 'absolute', left: x - 60 * scale, top: y - 260 * scale - bob * scale, opacity, overflow: 'visible'}}>
      <g stroke={C.navy} strokeWidth={14} strokeLinecap="round">
        <line x1={50} y1={170} x2={50 + leg} y2={250} />
        <line x1={70} y1={170} x2={70 - leg} y2={250} />
      </g>
      <rect x={28} y={78} width={64} height={100} rx={26} fill={shirt} />
      <circle cx={60} cy={44} r={30} fill="#C79B7B" />
      <path d="M32 40c0-18 12-28 28-28s28 10 28 28c-8-6-18-9-28-9s-20 3-28 9Z" fill={C.graphite} />
    </svg>
  );
};
