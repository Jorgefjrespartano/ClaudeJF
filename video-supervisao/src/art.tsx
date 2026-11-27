import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT} from './lib';

// Todas as ilustrações são genéricas, em estilo flat. Nenhuma reproduz telas,
// logotipos ou notificações reais, nem uniformes ou brasões oficiais.

export const ShieldHeart: React.FC<{size?: number; glow?: number; lit?: number}> = ({size = 300, glow = 0.5, lit = 1}) => {
  const f = useCurrentFrame();
  const pulse = 1 + 0.04 * Math.sin(f / 9);
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 100 115" style={{overflow: 'visible', filter: `drop-shadow(0 0 ${24 * glow}px rgba(245,185,66,${0.55 * glow}))`}}>
      <path d="M50 4 L92 18 V52 C92 80 72 100 50 111 C28 100 8 80 8 52 V18 Z" fill={C.navy3} stroke={C.sky} strokeWidth={3.5} />
      <path d="M50 12 L84 23 V52 C84 75 68 91 50 101 C32 91 16 75 16 52 V23 Z" fill={C.navy2} />
      <g transform={`translate(50 56) scale(${pulse}) translate(-50 -56)`} opacity={0.35 + 0.65 * lit}>
        <path d="M50 78 C30 64 28 52 33 45 C38 38 47 40 50 47 C53 40 62 38 67 45 C72 52 70 64 50 78 Z" fill={C.amber} />
      </g>
    </svg>
  );
};

export const Bell: React.FC<{size?: number; lit?: number}> = ({size = 120, lit = 1}) => {
  const f = useCurrentFrame();
  const rot = lit > 0.5 ? Math.sin(f / 4) * 10 * Math.max(0, Math.sin(f / 30)) : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{overflow: 'visible', transform: `rotate(${rot}deg)`, transformOrigin: '50% 10%', filter: lit > 0.5 ? `drop-shadow(0 0 14px ${C.amber})` : 'none'}}>
      <path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6Z" fill={lit > 0.5 ? C.amber : C.muted} />
      <path d="M9.5 19a2.5 2.5 0 0 0 5 0Z" fill={lit > 0.5 ? C.amber : C.muted} />
    </svg>
  );
};

/** Celular genérico estilizado; o conteúdo da tela vem como children (HTML) */
export const Phone: React.FC<{w?: number; h?: number; glow?: number; children?: React.ReactNode; screen?: string}> = ({w = 320, h = 600, glow = 0, children, screen = '#16365F'}) => (
  <div style={{position: 'relative', width: w, height: h, borderRadius: w * 0.14, background: '#0E2442', border: `8px solid ${C.skySoft}`,
    boxShadow: `0 30px 80px rgba(0,0,0,.35), 0 0 ${80 * glow}px rgba(124,196,242,${0.45 * glow})`, overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 10, borderRadius: w * 0.1, background: screen, overflow: 'hidden'}}>{children}</div>
    <div style={{position: 'absolute', top: 18, left: w / 2 - 36, width: 72, height: 16, borderRadius: 8, background: '#0E2442'}} />
  </div>
);

/** Personagem: delegado ilustrado (estilizado, não fotorrealista), traje social escuro, sem uniforme/brasão */
export const Delegado: React.FC<{scale?: number; talking?: boolean; wave?: number}> = ({scale = 1, talking = false, wave = 0}) => {
  const f = useCurrentFrame();
  const mouth = talking ? 1.5 + 3 * Math.abs(Math.sin(f / 3.2)) : 0;
  const arm = -20 - 18 * wave - (talking ? 6 * Math.sin(f / 14) : 0);
  const breathe = Math.sin(f / 30) * 2;
  return (
    <svg width={300 * scale} height={560 * scale} viewBox="0 0 300 560" style={{overflow: 'visible', WebkitMaskImage: 'linear-gradient(to bottom, black 78%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 78%, transparent 100%)'}}>
      <g transform={`translate(0 ${breathe})`}>
        {/* corpo / terno */}
        <path d="M40 560 L52 330 Q60 270 150 260 Q240 270 248 330 L260 560 Z" fill="#1C2740" />
        {/* camisa e gravata */}
        <path d="M120 262 L150 330 L180 262 Z" fill={C.white} />
        <path d="M144 278 L156 278 L162 360 L150 378 L138 360 Z" fill={C.navy3} />
        {/* lapelas */}
        <path d="M118 262 L150 340 L106 300 Z" fill="#26344F" /><path d="M182 262 L150 340 L194 300 Z" fill="#26344F" />
        {/* braço gesticulando (direito) */}
        <g transform={`rotate(${arm} 232 320)`}>
          <path d="M222 310 Q262 360 260 430 L236 436 Q232 380 206 336 Z" fill="#1C2740" />
          <circle cx={248} cy={440} r={20} fill={C.skin} />
        </g>
        {/* pescoço e cabeça */}
        <rect x={132} y={214} width={36} height={52} rx={14} fill={C.skin} />
        <ellipse cx={150} cy={170} rx={64} ry={74} fill={C.skin} />
        <ellipse cx={87} cy={176} rx={10} ry={16} fill={C.skin} /><ellipse cx={213} cy={176} rx={10} ry={16} fill={C.skin} />
        {/* cabelo curto */}
        <path d="M86 160 Q84 92 150 90 Q216 92 214 160 Q206 124 150 120 Q96 122 86 160 Z" fill="#2A2522" />
        {/* rosto simplificado */}
        <circle cx={128} cy={172} r={6} fill="#2A2522" /><circle cx={172} cy={172} r={6} fill="#2A2522" />
        <path d="M116 152 Q128 144 140 150 M160 150 Q172 144 184 152" stroke="#2A2522" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        <path d="M130 204 Q150 220 170 204" stroke="#7A3E2E" strokeWidth={4} fill="none" strokeLinecap="round" />
        {mouth > 0 && <ellipse cx={150} cy={210} rx={11} ry={mouth} fill="#7A3E2E" />}
        <ellipse cx={118} cy={192} rx={9} ry={5} fill="#D9906F" opacity={0.6} /><ellipse cx={182} cy={192} rx={9} ry={5} fill="#D9906F" opacity={0.6} />
      </g>
    </svg>
  );
};

/** Adolescente de costas, segurando celular (silhueta, sem rosto) */
export const TeenBack: React.FC<{glow?: number}> = ({glow = 1}) => (
  <svg width={300} height={420} viewBox="0 0 300 420" style={{overflow: 'visible'}}>
    <ellipse cx={150} cy={120} rx={110} ry={60} fill={C.sky} opacity={0.18 * glow} />
    <path d="M60 420 Q60 250 150 238 Q240 250 240 420 Z" fill="#1E3D66" />
    <path d="M95 250 Q150 200 205 250 Q200 214 150 206 Q100 214 95 250 Z" fill="#244A7A" />
    <circle cx={150} cy={170} r={58} fill="#16304F" />
    <path d="M92 170 Q92 104 150 102 Q208 104 208 170 Q200 128 150 124 Q100 128 92 170 Z" fill="#244A7A" />
    <rect x={190} y={200} width={44} height={74} rx={8} fill={C.skySoft} opacity={0.9} transform="rotate(-12 212 237)" />
  </svg>
);

/** Responsável e adolescente sentados num sofá, de costas, com luz quente */
export const FamilySofa: React.FC<{heart?: number}> = ({heart = 1}) => {
  const f = useCurrentFrame();
  const hp = 1 + 0.06 * Math.sin(f / 10);
  return (
    <svg width={820} height={560} viewBox="0 0 820 560" style={{overflow: 'visible'}}>
      <defs>
        <radialGradient id="warm" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#FFCF7A" stopOpacity={0.55} /><stop offset="100%" stopColor="#FFCF7A" stopOpacity={0} /></radialGradient>
      </defs>
      <ellipse cx={410} cy={220} rx={420} ry={260} fill="url(#warm)" />
      {/* luminária */}
      <rect x={700} y={110} width={10} height={330} fill="#2A4A74" /><path d="M650 110 L760 110 L730 60 L680 60 Z" fill={C.amberSoft} />
      {/* sofá */}
      <rect x={70} y={330} width={600} height={150} rx={40} fill="#2A4A74" />
      <rect x={40} y={300} width={80} height={200} rx={36} fill="#244068" /><rect x={620} y={300} width={80} height={200} rx={36} fill="#244068" />
      {/* responsável (maior) */}
      <path d="M150 400 Q150 250 250 236 Q350 250 350 400 Z" fill="#14294A" />
      <circle cx={250} cy={190} r={58} fill="#14294A" />
      {/* adolescente (menor, capuz) */}
      <path d="M410 410 Q410 290 490 280 Q570 290 570 410 Z" fill="#183457" />
      <circle cx={490} cy={238} r={50} fill="#183457" />
      <path d="M440 240 Q440 180 490 178 Q540 180 540 240 Q530 205 490 202 Q450 205 440 240 Z" fill="#20416B" />
      {/* braço do responsável sobre o ombro */}
      <path d="M330 300 Q400 262 452 300" stroke="#14294A" strokeWidth={28} fill="none" strokeLinecap="round" />
      {/* coração entre eles */}
      <g transform={`translate(370 150) scale(${1.6 * hp * heart})`} opacity={heart}>
        <path d="M0 18 C-14 8 -16 0 -12 -5 C-8 -10 -2 -8 0 -3 C2 -8 8 -10 12 -5 C16 0 14 8 0 18 Z" fill={C.amber} style={{filter: `drop-shadow(0 0 10px ${C.amber})`}} />
      </g>
    </svg>
  );
};

export const Magnifier: React.FC<{size?: number}> = ({size = 110}) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.5" fill="rgba(191,227,250,.15)" stroke={C.white} strokeWidth={2.2} /><path d="M15 15l6 6" stroke={C.white} strokeWidth={2.6} strokeLinecap="round" /></svg>
);

/** Barra de busca com texto borrado (nenhuma palavra legível) */
export const SearchBar: React.FC<{w?: number; blurW?: number}> = ({w = 560, blurW = 0.7}) => (
  <div style={{width: w, height: 84, borderRadius: 42, background: C.white, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 18, boxShadow: '0 14px 40px rgba(0,0,0,.25)'}}>
    <svg width={34} height={34} viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.5" fill="none" stroke={C.muted} strokeWidth={2.2} /><path d="M15 15l6 6" stroke={C.muted} strokeWidth={2.4} strokeLinecap="round" /></svg>
    <div style={{height: 22, width: `${blurW * 100}%`, borderRadius: 11, background: 'linear-gradient(90deg,#9DB4CF,#C4D3E4,#9DB4CF)', filter: 'blur(5px)'}} />
  </div>
);

export const AIIcon: React.FC<{size?: number}> = ({size = 120}) => {
  const f = useCurrentFrame();
  const r = f * 0.8;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible'}}>
      <circle cx={50} cy={50} r={44} fill={C.navy3} stroke={C.sky} strokeWidth={3} />
      <g transform={`rotate(${r} 50 50)`}>
        {[0, 120, 240].map((a) => <circle key={a} cx={50 + 24 * Math.cos(a * Math.PI / 180)} cy={50 + 24 * Math.sin(a * Math.PI / 180)} r={7} fill={C.skySoft} />)}
        <path d="M50 26 L71 62 L29 62 Z" fill="none" stroke={C.sky} strokeWidth={2.5} />
      </g>
      <path d="M50 38 L53 47 L62 50 L53 53 L50 62 L47 53 L38 50 L47 47 Z" fill={C.amber} />
    </svg>
  );
};

export const Bubble: React.FC<{w?: number; side?: 'l' | 'r'; tone?: string; lines?: number}> = ({w = 300, side = 'l', tone = C.white, lines = 2}) => (
  <div style={{width: w, borderRadius: 26, borderBottomLeftRadius: side === 'l' ? 6 : 26, borderBottomRightRadius: side === 'r' ? 6 : 26, background: tone, padding: '20px 24px', boxShadow: '0 10px 30px rgba(0,0,0,.2)'}}>
    {Array.from({length: lines}).map((_, i) => <div key={i} style={{height: 14, width: `${i === lines - 1 ? 60 : 100}%`, borderRadius: 7, background: tone === C.white ? '#C4D3E4' : 'rgba(11,31,58,.25)', marginTop: i ? 10 : 0, filter: 'blur(2px)'}} />)}
  </div>
);

export const Lock: React.FC<{size?: number; closed?: number}> = ({size = 150, closed = 1}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{overflow: 'visible', filter: `drop-shadow(0 0 12px rgba(245,185,66,.5))`}}>
    <path d={`M7 11V7a5 5 0 0 1 10 0v${4 - 3 * (1 - closed)}`} fill="none" stroke={C.amber} strokeWidth={2.2} strokeLinecap="round" transform={`translate(0 ${-3 * (1 - closed)})`} />
    <rect x="4" y="11" width="16" height="11" rx="2.5" fill={C.amber} />
    <circle cx="12" cy="16" r="1.6" fill={C.navy} /><path d="M12 17v2" stroke={C.navy} strokeWidth={1.6} />
  </svg>
);

export const Scale: React.FC<{size?: number}> = ({size = 360}) => {
  const f = useCurrentFrame();
  const a = 6 * Math.sin(f / 16) * Math.exp(-f / 60);
  const pan = (x: number) => <path d={`M${x - 46} 120 Q${x} 150 ${x + 46} 120 Z`} fill={C.skySoft} />;
  return (
    <svg width={size} height={size} viewBox="0 0 300 300" style={{overflow: 'visible'}}>
      <rect x={144} y={60} width={12} height={200} rx={4} fill={C.sky} />
      <rect x={90} y={256} width={120} height={16} rx={8} fill={C.sky} />
      <circle cx={150} cy={56} r={12} fill={C.amber} />
      <g transform={`rotate(${a} 150 70)`}>
        <rect x={40} y={64} width={220} height={10} rx={5} fill={C.white} />
        <line x1={60} y1={70} x2={40} y2={120} stroke={C.skySoft} strokeWidth={3} /><line x1={60} y1={70} x2={80} y2={120} stroke={C.skySoft} strokeWidth={3} />
        <line x1={240} y1={70} x2={220} y2={120} stroke={C.skySoft} strokeWidth={3} /><line x1={240} y1={70} x2={260} y2={120} stroke={C.skySoft} strokeWidth={3} />
        {pan(60)}{pan(240)}
      </g>
    </svg>
  );
};

export const LawDoc: React.FC<{w?: number}> = ({w = 260}) => (
  <div style={{width: w, height: w * 1.25, borderRadius: 14, background: C.white, padding: 24, boxShadow: '0 20px 50px rgba(0,0,0,.3)', position: 'relative', fontFamily: FONT}}>
    <div style={{fontSize: 20, fontWeight: 900, color: C.navy, letterSpacing: '.12em'}}>LEI</div>
    {[0.9, 0.75, 0.85, 0.6, 0.8].map((x, i) => <div key={i} style={{height: 12, width: `${x * 100}%`, borderRadius: 6, background: '#C4D3E4', marginTop: 16}} />)}
    <div style={{position: 'absolute', right: -30, bottom: -30}}><ShieldHeart size={110} glow={0.6} /></div>
  </div>
);

/** Ícones genéricos de traço (nenhum é logotipo real) */
const P: Record<string, React.ReactNode> = {
  app: <><rect x="6" y="2" width="12" height="20" rx="2.5" /><circle cx="12" cy="10" r="3" /><path d="M10.5 18.5h3" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  sms: <><path d="M4 5h16v11H9l-5 4Z" /><path d="M8 10h8M8 13h5" /></>,
  chat: <><path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.3A9 9 0 1 0 12 3Z" /><path d="M8.5 12h.01M12 12h.01M15.5 12h.01" /></>,
  bookmark: <path d="M6 3h12v18l-6-4-6 4Z" />,
  send: <><path d="M21 3 3 10l7 3 3 7Z" /><path d="m10 13 4-4" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5h.01" /></>,
  check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" /></>,
  home: <><path d="M4 11 12 4l8 7v9H4Z" /></>,
  search: <><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></>,
  plus: <><rect x="4" y="4" width="16" height="16" rx="4" /><path d="M12 8v8M8 12h8" /></>,
  play: <><rect x="4" y="4" width="16" height="16" rx="4" /><path d="m10 9 5 3-5 3Z" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
};
export const Ico: React.FC<{name: string; size?: number; color?: string; stroke?: number}> = ({name, size = 64, color = C.white, stroke = 1.8}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{P[name]}</svg>
);
