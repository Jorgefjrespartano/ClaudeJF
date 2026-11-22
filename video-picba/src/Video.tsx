import React, {useState} from 'react';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Captions, Chrome, FPS, Grain, TOTAL, clamp, scenes} from './lib';
import {SCENES} from './scenes';

const XF = 12; // frames de transição cruzada

const Fade: React.FC<{first: boolean; children: React.ReactNode}> = ({first, children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: first ? 1 : interpolate(f, [0, XF], [0, 1], clamp)}}>{children}</AbsoluteFill>;
};

export const Video: React.FC = () => {
  const [h] = useState(() => delayRender('fonts'));
  React.useEffect(() => {
    Promise.all(['500 40px Inter', '600 40px Inter', '700 40px Inter', '800 40px Inter'].map((x) => document.fonts.load(x))).then(() => continueRender(h));
  }, [h]);
  return (
    <AbsoluteFill style={{backgroundColor: '#0A1F3D'}}>
      {scenes.map((sc, i) => {
        const from = Math.round(sc.start * FPS);
        const next = scenes[i + 1];
        const len = (next ? Math.round(next.start * FPS) : TOTAL) - from;
        const Comp = SCENES[sc.id];
        return (
          <Sequence key={sc.id} from={from} durationInFrames={len + (next ? XF : 0)} name={sc.id}>
            <Fade first={i === 0}><Comp sc={sc} /></Fade>
          </Sequence>
        );
      })}
      <Grain />
      <Chrome />
      <Captions />
      <Audio src={staticFile('narration.wav')} />
      <Audio src={staticFile('music.wav')} volume={(f) => interpolate(f, [0, 20, TOTAL - 40, TOTAL], [0, 0.55, 0.55, 0], clamp)} />
    </AbsoluteFill>
  );
};
