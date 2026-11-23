import React, {useState} from 'react';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT, FPS, SAFE, TOTAL, clamp, ease, scenes} from './lib';
import {SCENES} from './scenes';
import captions from '../captions.json';

const XF = 8; // transição cruzada discreta

// ------------------------------------------------------------------ legendas (máx. 2 linhas)

// Legendas revisadas manualmente (captions.json): cada item tem no máximo 2 linhas.
// O tempo de cada legenda vem das palavras faladas, na mesma ordem.
type Cap = {lines: string[]; from: number; to: number};
const CAPS: Cap[] = (() => {
  const all: {f: number; e: number}[] = [];
  for (const s of scenes) for (const w of s.words) all.push({f: Math.round((s.start + w.s) * FPS), e: Math.round((s.start + w.e) * FPS)});
  const out: Cap[] = [];
  let k = 0;
  for (const c of captions as string[]) {
    const n = c.split(/\s+/).filter(Boolean).length;
    const first = all[k], last = all[Math.min(all.length - 1, k + n - 1)];
    out.push({lines: c.split('\n'), from: first.f, to: last.e + 10});
    k += n;
  }
  for (let i = 0; i < out.length - 1; i++) out[i].to = Math.min(out[i].to, out[i + 1].from);
  return out;
})();

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const cap = CAPS.find((c) => f >= c.from && f < c.to);
  if (!cap) return null;
  return (
    <div style={{position: 'absolute', left: SAFE.left, right: 1080 - SAFE.right, top: 1250, display: 'flex', justifyContent: 'center', opacity: ease(f, cap.from, cap.from + 4)}}>
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 40, lineHeight: 1.3, color: '#fff', background: 'rgba(0,0,0,.86)', padding: '12px 24px', borderRadius: 10, textAlign: 'center'}}>
        {cap.lines.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ fundo

const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 900px 1200px at 50% 40%, #1A1A1D 0%, ${C.black} 70%)`}}>
      <AbsoluteFill style={{opacity: 0.05, mixBlendMode: 'screen', backgroundImage: `url(${staticFile('noise.png')})`, backgroundPosition: `${(f * 137) % 512}px ${(f * 251) % 512}px`}} />
    </AbsoluteFill>
  );
};

const Fade: React.FC<{first: boolean; len: number; children: React.ReactNode}> = ({first, len, children}) => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, len], [1, 1.03], clamp); // aproximação suave contínua
  return <AbsoluteFill style={{opacity: first ? 1 : interpolate(f, [0, XF], [0, 1], clamp), transform: `scale(${zoom})`}}>{children}</AbsoluteFill>;
};

export const Video: React.FC = () => {
  const [h] = useState(() => delayRender('fonts'));
  React.useEffect(() => {
    Promise.all(['400 40px Inter', '500 40px Inter', '700 40px Inter', '800 40px Inter'].map((x) => document.fonts.load(x))).then(() => continueRender(h));
  }, [h]);
  return (
    <AbsoluteFill style={{backgroundColor: C.black}}>
      <Backdrop />
      {scenes.map((sc, i) => {
        const from = Math.round(sc.start * FPS);
        const next = scenes[i + 1];
        const len = (next ? Math.round(next.start * FPS) : TOTAL) - from;
        const Comp = SCENES[sc.id];
        return (
          <Sequence key={sc.id} from={from} durationInFrames={len + (next ? XF : 0)} name={sc.id}>
            <Fade first={i === 0} len={len}><Comp sc={sc} /></Fade>
          </Sequence>
        );
      })}
      <Captions />
      <Audio src={staticFile('narration.wav')} />
      <Audio src={staticFile('music.wav')} volume={(f) => interpolate(f, [0, 6, TOTAL - 30, TOTAL], [0, 1, 1, 0], clamp)} />
    </AbsoluteFill>
  );
};
