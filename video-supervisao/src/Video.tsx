import React, {useState} from 'react';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/inter/900.css';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT, FPS, SAFE, TOTAL, clamp, ease, norm, scenes} from './lib';
import {SCENES} from './scenes';

const XF = 10; // transição: a cena sai deslizando/sumindo e a próxima entra

// ------------------------------------------------------------------ legendas (até 4 palavras, palavra-chave em âmbar)

const KEYS = new Set(['alerta', 'ativar', 'ajuda', 'delegado', 'figueiredo', 'responsavel', 'risco', 'brasil', 'temas', 'sensiveis', 'mensagens', 'aplicativo', 'email', 'sms', 'whatsapp',
  'contatos', 'eca', 'supervisao', 'perfil', 'linhas', 'familias', 'criar', 'convite', 'seguir', 'supervisionada', 'aceitar', 'versao', 'diagnostico', 'calma', 'julgar',
  'profissional', 'cvv', 'gratuito', 'horas', 'protecao', 'acompanhar', 'salve', 'artificial', 'inteligencia', 'atualizados', 'pendente', 'oito']);

type CW = {w: string; f: number; e: number};
type Cap = {words: string[]; from: number; to: number};
const CAPS: Cap[] = (() => {
  // palavras com tempo absoluto
  const all: CW[] = [];
  for (const s of scenes) for (const w of s.words) all.push({w: w.w.replace(/'/g, ''), f: Math.round((s.start + w.s) * FPS), e: Math.round((s.start + w.e) * FPS)});
  // regra do pedido: não escrever “suicídio” nem “automutilação” na tela
  for (let i = 0; i < all.length; i++) {
    if (norm(all[i].w) === 'suicidio' && all[i + 1] && norm(all[i + 1].w) === 'ou' && all[i + 2] && norm(all[i + 2].w).startsWith('automutilacao')) {
      all[i].w = 'temas';
      all[i + 1].w = 'sensíveis.';
      all[i + 1].e = all[i + 2].e;
      all.splice(i + 2, 1);
    }
  }
  const out: Cap[] = [];
  let cur: CW[] = [];
  const flush = () => { if (cur.length) out.push({words: cur.map((x) => x.w), from: cur[0].f, to: cur[cur.length - 1].e + 6}); cur = []; };
  all.forEach((w, i) => {
    cur.push(w);
    const nx = all[i + 1];
    const chars = cur.reduce((n, x) => n + x.w.length + 1, 0);
    if (cur.length >= 4 || /[.,:;?!]$/.test(w.w) || !nx || nx.f - w.e > 12 || chars > 20) flush();
  });
  for (let i = 0; i < out.length - 1; i++) out[i].to = Math.min(Math.max(out[i].to, out[i + 1].from - 2), out[i + 1].from);
  return out;
})();

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const cap = CAPS.find((c) => f >= c.from && f < c.to);
  if (!cap) return null;
  const t = ease(f, cap.from, cap.from + 4);
  return (
    <div style={{position: 'absolute', left: SAFE.left, width: SAFE.right - SAFE.left, top: 1300, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 18px',
      fontFamily: FONT, fontWeight: 900, fontSize: 70, lineHeight: 1.12, textAlign: 'center', opacity: t, transform: `scale(${0.94 + 0.06 * t})`}}>
      {cap.words.map((w, i) => (
        <span key={i} style={{color: KEYS.has(norm(w)) ? C.amber : C.white, textShadow: '0 3px 0 rgba(5,15,30,.9), 0 0 12px rgba(5,15,30,.9), 0 6px 24px rgba(0,0,0,.6)'}}>{w}</span>
      ))}
    </div>
  );
};

// ------------------------------------------------------------------ fundo, selo e transições

const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 900px 1300px at 45% 40%, ${C.navy2} 0%, ${C.navy} 70%)`}}>
      {Array.from({length: 26}).map((_, i) => {
        const x = (i * 137) % 1080, y0 = (i * 251) % 1920;
        const y = (y0 - f * (0.3 + (i % 4) * 0.15) + 1920) % 1920;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 6 + (i % 3) * 4, height: 6 + (i % 3) * 4, borderRadius: 10, background: C.sky, opacity: 0.08 + (i % 5) * 0.03}} />;
      })}
    </AbsoluteFill>
  );
};

const Seal: React.FC = () => (
  // canto superior esquerdo, logo abaixo da faixa de 250 px que o Reels cobre
  <div style={{position: 'absolute', left: 36, top: 258, fontFamily: FONT, fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,.78)', background: 'rgba(5,15,30,.45)', border: '1px solid rgba(124,196,242,.35)', borderRadius: 8, padding: '6px 12px'}}>
    Animação e narração com voz clonada por IA
  </div>
);

const Trans: React.FC<{first: boolean; len: number; children: React.ReactNode}> = ({first, len, children}) => {
  const f = useCurrentFrame();
  const tin = first ? 1 : ease(f, 0, XF);
  const tout = 1 - ease(f, len - 2, len + XF - 2);
  const zoom = interpolate(f, [0, len], [1, 1.025], clamp); // zoom leve contínuo
  return <AbsoluteFill style={{opacity: Math.min(tin, tout), transform: `translateX(${(1 - tin) * 60 - (1 - tout) * 60}px) scale(${zoom})`}}>{children}</AbsoluteFill>;
};

export const Video: React.FC = () => {
  const [h] = useState(() => delayRender('fonts'));
  React.useEffect(() => {
    Promise.all(['700 40px Inter', '800 40px Inter', '900 40px Inter'].map((x) => document.fonts.load(x))).then(() => continueRender(h));
  }, [h]);
  return (
    <AbsoluteFill style={{backgroundColor: C.navy}}>
      <Backdrop />
      {scenes.map((sc, i) => {
        const from = Math.round(sc.start * FPS);
        const next = scenes[i + 1];
        const len = (next ? Math.round(next.start * FPS) : TOTAL) - from;
        const Comp = SCENES[sc.id];
        return (
          <Sequence key={sc.id} from={from} durationInFrames={len + (next ? XF : 0)} name={sc.id}>
            <Trans first={i === 0} len={next ? len : len + 999}><Comp sc={sc} /></Trans>
          </Sequence>
        );
      })}
      <Captions />
      <Seal />
      <Audio src={staticFile('narration.wav')} />
      <Audio src={staticFile('music.wav')} volume={(f) => interpolate(f, [0, 10, TOTAL - 45, TOTAL], [0, 1, 1, 0], clamp)} />
    </AbsoluteFill>
  );
};
