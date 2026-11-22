import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C} from './lib';

// Vista aérea estilizada de um circuito de carnaval à beira-mar (noite)

type P = [number, number];
const P0: P = [140, 1200], P1: P = [700, 660], P2: P = [1150, 380], P3: P = [2000, -40];
const bez = (t: number): P => {
  const u = 1 - t;
  return [
    u * u * u * P0[0] + 3 * u * u * t * P1[0] + 3 * u * t * t * P2[0] + t * t * t * P3[0],
    u * u * u * P0[1] + 3 * u * u * t * P1[1] + 3 * u * t * t * P2[1] + t * t * t * P3[1],
  ];
};
const normal = (t: number): P => {
  const a = bez(Math.max(0, t - 0.001)), b = bez(Math.min(1, t + 0.001));
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
  return [-dy / l, dx / l]; // aponta para o lado da terra (direita/baixo)
};
const at = (t: number, off: number): P => {
  const p = bez(t), n = normal(t);
  return [p[0] + n[0] * off, p[1] + n[1] * off];
};

let seed = 11;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const CROWD = Array.from({length: 1500}, () => ({t: rnd(), u: rnd() * 2 - 1, sp: 0.0002 + rnd() * 0.0005, ph: rnd() * 6.28, c: rnd()}));
const BUILD = Array.from({length: 46}, (_, i) => ({t: i / 46 + rnd() * 0.01, off: 230 + rnd() * 240, w: 60 + rnd() * 80, h: 50 + rnd() * 90, rot: rnd() * 10 - 5}));
const COLORS = ['#F2C14E', '#F78154', '#FFFFFF', '#4DD0E1', '#F25F5C', '#FFE8A3'];
const pathD = (off: number, n = 60) => Array.from({length: n + 1}, (_, i) => at(i / n, off)).map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');

export const Aerial: React.FC<{orderly?: boolean; dim?: number; zoom?: [number, number]; len?: number}> = ({orderly = false, dim = 0, zoom = [1, 1.08], len = 200}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, len], zoom, {extrapolateRight: 'clamp'});
  const land = `${pathD(150)} L2000 1200 L140 1200 Z`;
  const gates = [0.3, 0.52, 0.74];
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 20% 30%, #0B2A4A 0%, #05121F 70%)', overflow: 'hidden'}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{transform: `scale(${z})`, transformOrigin: '55% 50%'}}>
        {/* mar */}
        {Array.from({length: 14}).map((_, i) => (
          <path key={i} d={pathD(-210 - i * 70 - ((f * 0.6 + i * 9) % 70), 40)} stroke="#1D4E7A" strokeOpacity={0.35 - i * 0.02} strokeWidth={2} fill="none" />
        ))}
        {/* areia e calçadão */}
        <path d={pathD(-170)} stroke="#2A2C2B" strokeWidth={90} fill="none" />
        {/* terra / cidade */}
        <path d={land} fill="#0A1524" />
        {BUILD.map((b, i) => {
          const p = at(Math.min(1, b.t), b.off);
          return (
            <g key={i} transform={`translate(${p[0]} ${p[1]}) rotate(${-38 + b.rot})`}>
              <rect x={-b.w / 2} y={-b.h / 2} width={b.w} height={b.h} fill="#13233A" stroke="#1C3354" />
              {Array.from({length: 6}).map((_, k) => (
                <rect key={k} x={-b.w / 2 + 8 + (k % 3) * (b.w / 3.2)} y={-b.h / 2 + 8 + Math.floor(k / 3) * (b.h / 2.4)} width={6} height={6}
                  fill="#F2C14E" opacity={((i * 7 + k * 3 + Math.floor(f / 20)) % 5) > 1 ? 0.55 : 0.1} />
              ))}
            </g>
          );
        })}
        {/* avenida */}
        <path d={pathD(0)} stroke="#1A2230" strokeWidth={260} fill="none" />
        <path d={pathD(0)} stroke="#2C3646" strokeWidth={4} strokeDasharray="30 30" fill="none" opacity={0.6} />
        {/* acessos organizados (fechamento) */}
        {orderly && gates.map((g, i) => {
          const a = at(g, -130), b = at(g, 130);
          return (
            <g key={i}>
              <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.cyan} strokeWidth={10} opacity={0.9} />
              <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.cyan} strokeWidth={40} opacity={0.18} />
            </g>
          );
        })}
        {/* multidão */}
        {CROWD.map((d, i) => {
          const t = (d.t + f * d.sp * (orderly ? 2.2 : 1)) % 1;
          const lane = orderly ? (Math.round(((d.u + 1) / 2) * 7) / 7) * 2 - 1 : d.u;
          const jit = orderly ? 0 : Math.sin(f * 0.05 + d.ph) * 6;
          const p = at(t, lane * 112 + jit);
          const col = COLORS[Math.floor(d.c * COLORS.length)];
          return <circle key={i} cx={p[0]} cy={p[1]} r={orderly ? 3.4 : 3 + d.c * 1.6} fill={col} opacity={0.85} />;
        })}
        {/* trios elétricos */}
        {[0.18, 0.46, 0.7].map((t0, i) => {
          const t = (t0 + f * 0.00025) % 1;
          const p = at(t, 0), q = at(Math.min(1, t + 0.01), 0);
          const ang = (Math.atan2(q[1] - p[1], q[0] - p[0]) * 180) / Math.PI;
          const hue = ['#FF3D7F', '#3DDCFF', '#FFD23D'][i];
          return (
            <g key={i} transform={`translate(${p[0]} ${p[1]}) rotate(${ang})`}>
              <ellipse rx={150} ry={90} fill={hue} opacity={0.16 + 0.08 * Math.sin(f * 0.4 + i)} />
              <rect x={-70} y={-24} width={140} height={48} rx={6} fill="#0E1A2C" stroke={hue} strokeWidth={4} />
              {Array.from({length: 5}).map((_, k) => <circle key={k} cx={-50 + k * 25} cy={0} r={6} fill={hue} opacity={(k + Math.floor(f / 4)) % 2 ? 1 : 0.35} />)}
            </g>
          );
        })}
      </svg>
      <AbsoluteFill style={{background: C.deep, opacity: dim}} />
    </AbsoluteFill>
  );
};
