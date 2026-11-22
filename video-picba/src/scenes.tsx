import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Aerial} from './aerial';
import {
  C, Chip, FONT, Icon, IconDot, Lettering, Person, Scene, Sfx, clamp, ease, pop, sceneLen, wf,
} from './lib';

type P = {sc: Scene};

// ================================================================== BLOCO 1 · O PROBLEMA

export const C01: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const len = sceneLen(sc);
  const mil = wf(sc, 'milhao');
  const pas = wf(sc, 'passagens');
  const unico = wf(sc, 'unico');
  const n = interpolate(f, [4, Math.max(mil + 6, 20)], [0, 1.7], {...clamp, easing: (x) => 1 - Math.pow(1 - x, 4)});
  return (
    <AbsoluteFill>
      <Aerial len={len + 220} zoom={[1, 1.1]} />
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(5,18,31,.85) 0%, rgba(5,18,31,.35) 45%, transparent 70%)'}} />
      <div style={{position: 'absolute', left: 120, top: 330, fontFamily: FONT, color: '#fff'}}>
        <div style={{fontSize: 150, fontWeight: 800, letterSpacing: '-.03em', color: C.gold, lineHeight: 1, textShadow: '0 10px 50px rgba(201,162,75,.35)'}}>
          {n.toFixed(1).replace('.', ',')} <span style={{fontSize: 96}}>milhão</span>
        </div>
        <div style={{fontSize: 44, fontWeight: 700, marginTop: 18, opacity: ease(f, pas, pas + 8)}}>de passagens</div>
        <div style={{fontSize: 44, fontWeight: 700, color: '#D5DEEA', opacity: ease(f, unico, unico + 8)}}>em um único dia, num só circuito</div>
      </div>
      <div style={{position: 'absolute', left: 120, top: 760, fontFamily: FONT, fontSize: 20, color: '#8798B0', opacity: ease(f, unico, unico + 12)}}>
        Circuito Dodô (Barra–Ondina) · 15/02/2026 · Fonte: balanço da Prefeitura e da PMBA, 16/02/2026
      </div>
      <Sfx at={mil} name="pop" volume={0.25} />
    </AbsoluteFill>
  );
};

const RISKS = [
  {k: 'superlotacao', icon: 'users', label: 'Superlotação', crit: true},
  {k: 'furtos', icon: 'bag', label: 'Furto'},
  {k: 'agressoes', icon: 'alert', label: 'Agressão'},
];

export const C02: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const len = sceneLen(sc);
  const info = wf(sc, 'informacao');
  const agir = wf(sc, 'agir');
  const blink = Math.floor(f / 8) % 2 === 0;
  return (
    <AbsoluteFill>
      <Aerial len={len} zoom={[1.1, 1.1]} dim={ease(f, 0, 14, 0, 0.78)} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 230, display: 'flex', justifyContent: 'center', gap: 60}}>
        {RISKS.map((r) => {
          const a = wf(sc, r.k);
          const t = pop(f, a, 14, 200);
          const fade = info ? ease(f, info, info + 10, 1, 0.35) : 1;
          return (
            <div key={r.k} style={{width: 330, height: 260, borderRadius: 14, background: 'rgba(17,49,92,.55)', border: '1px solid rgba(255,255,255,.12)', borderTop: `4px solid ${r.crit ? C.gold : C.cyan}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, transform: `scale(${t})`, opacity: fade, fontFamily: FONT, position: 'relative'}}>
              <IconDot name={r.icon} size={110} bg={r.crit ? 'rgba(201,162,75,.2)' : 'rgba(24,168,200,.18)'} color={r.crit ? C.gold : '#7FD6EA'} />
              <div style={{fontSize: 40, fontWeight: 800, color: '#fff'}}>{r.label}</div>
              {r.crit && <div style={{position: 'absolute', top: 16, right: 16, fontSize: 16, fontWeight: 800, letterSpacing: '.12em', background: C.gold, color: C.navy, padding: '4px 8px', borderRadius: 4}}>CRÍTICO</div>}
            </div>
          );
        })}
      </div>
      {/* central sem dados */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', gap: 18, opacity: ease(f, info, info + 10)}}>
        {Array.from({length: 5}).map((_, i) => (
          <div key={i} style={{width: 230, height: 140, borderRadius: 8, background: '#0B1626', border: '2px solid #1E3352', display: 'grid', placeItems: 'center', fontFamily: FONT, color: '#3D5577', fontSize: 18, fontWeight: 700, letterSpacing: '.14em'}}>
            {i === 2 ? <span style={{color: '#7FD6EA', fontSize: 40, opacity: blink ? 1 : 0}}>_</span> : 'SEM DADOS'}
          </div>
        ))}
      </div>
      <Lettering at={agir} style={{left: 0, right: 0, top: 760, textAlign: 'center'}} color={C.gold} size={72}>Onde agir? Agora?</Lettering>
      {RISKS.map((r) => <Sfx key={r.k} at={wf(sc, r.k)} name="pop" volume={0.3} />)}
    </AbsoluteFill>
  );
};

// ================================================================== BLOCO 2 · A SOLUÇÃO

export const C03: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const pic = wf(sc, 'pic');
  const sweep = ease(f, 0, 18);
  const tt = pop(f, pic + 4, 16, 120);
  const sub = wf(sc, 'ponto');
  return (
    <AbsoluteFill style={{background: `linear-gradient(115deg, ${C.navy} 0%, ${C.navy2} 62%, ${C.navy3} 100%)`}}>
      <div style={{position: 'absolute', top: 640, left: 0, height: 6, width: `${sweep * 100}%`, background: `linear-gradient(90deg, ${C.gold} 0 34%, ${C.cyan} 34% 100%)`, backgroundSize: '1920px 100%'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: FONT, color: '#fff', opacity: tt, transform: `scale(${0.92 + 0.08 * tt})`}}>
        <div style={{display: 'inline-flex', alignItems: 'baseline', gap: 26}}>
          <span style={{fontSize: 190, fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1}}>PIC BA</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center'}}>
        <div style={{fontFamily: FONT, fontSize: 26, fontWeight: 800, letterSpacing: '.14em', color: C.navy, background: C.gold, padding: '8px 16px', borderRadius: 5, opacity: ease(f, sub, sub + 8), transform: `translateY(${ease(f, sub, sub + 8, 12, 0)}px)`}}>
          PONTO INTEGRADO DE CONTROLE
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 690, textAlign: 'center', fontFamily: FONT, fontSize: 38, fontWeight: 500, color: '#D5DEEA', opacity: ease(f, wf(sc, 'carnaval'), wf(sc, 'carnaval') + 10)}}>
        do Carnaval da Bahia
      </div>
      <Sfx at={0} name="whoosh" volume={0.4} />
      <Sfx at={pic + 4} name="success" volume={0.3} />
    </AbsoluteFill>
  );
};

/** Ponto de acesso visto de cima: multidão → faixas individuais → festa; cada passagem vira dado */
const LANES = 6;
export const AccessTop: React.FC<{f: number; dataFrom: number; lanes?: number}> = ({f, dataFrom, lanes = LANES}) => {
  const top = 380, gap = 72, x0 = 560, x1 = 1360, gateX = 960;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      {/* multidão à esquerda */}
      {Array.from({length: 140}).map((_, i) => {
        const a = (i * 137.5) % 360, r = 30 + ((i * 53) % 190);
        return <circle key={i} cx={330 + Math.cos(a) * r * 0.9 + Math.sin(f * 0.05 + i) * 4} cy={top + (lanes - 1) * gap / 2 + Math.sin(a) * r * 0.9} r={7} fill={['#F2C14E', '#F78154', C.cyan, '#9AA7B8'][i % 4]} opacity={0.75} />;
      })}
      {Array.from({length: lanes}).map((_, l) => {
        const y = top + l * gap;
        return (
          <g key={l}>
            <line x1={x0} y1={y - gap / 2} x2={x1} y2={y - gap / 2} stroke={C.faint} strokeWidth={4} />
            {l === lanes - 1 && <line x1={x0} y1={y + gap / 2} x2={x1} y2={y + gap / 2} stroke={C.faint} strokeWidth={4} />}
            <rect x={gateX - 10} y={y - gap / 2 + 6} width={20} height={gap - 12} rx={4} fill={C.navy} />
            {/* uma pessoa por vez em cada faixa */}
            {[0, 1].map((k) => {
              const per = 70, off = l * 11 + k * 35;
              const ph = ((f + off) % per) / per;
              const x = x0 + ph * (x1 - x0);
              return <circle key={k} cx={x} cy={y} r={11} fill={x > gateX ? C.cyan : '#F2C14E'} stroke="#fff" strokeWidth={3} />;
            })}
            {/* dado subindo da catraca */}
            {f > dataFrom && [0, 1].map((k) => {
              const per = 70, off = l * 11 + k * 35;
              const cross = ((f + off) % per) / per;
              const p = (cross - (gateX - x0) / (x1 - x0));
              if (p < 0 || p > 0.45) return null;
              const t = p / 0.45;
              return <circle key={'d' + k} cx={gateX} cy={y - t * (y - 250)} r={7} fill={C.cyan} opacity={1 - t * 0.4} />;
            })}
          </g>
        );
      })}
      {/* linha de dados */}
      {f > dataFrom && (
        <g opacity={ease(f, dataFrom, dataFrom + 10)}>
          <line x1={gateX} y1={250} x2={1620} y2={250} stroke={C.cyan} strokeWidth={4} strokeDasharray="14 10" strokeDashoffset={-f * 3} />
        </g>
      )}
      {/* festa à direita */}
      {Array.from({length: 60}).map((_, i) => (
        <circle key={'r' + i} cx={1420 + ((i * 71) % 330)} cy={top - 20 + ((i * 47) % ((lanes - 1) * gap + 40))} r={6} fill={C.cyan} opacity={0.35} />
      ))}
    </svg>
  );
};

export const C04: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const ind = wf(sc, 'individualmente');
  const insp = wf(sc, 'inspecionado');
  const info = wf(sc, 'informacao');
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <AccessTop f={f} dataFrom={info - 6} />
      <div style={{position: 'absolute', left: 1600, top: 205, opacity: ease(f, info, info + 10)}}>
        <div style={{width: 96, height: 96, borderRadius: 14, background: C.navy, display: 'grid', placeItems: 'center', color: '#7FD6EA'}}><Icon name="monitor" size={54} /></div>
      </div>
      <div style={{position: 'absolute', left: 260, top: 860, fontFamily: FONT, fontSize: 22, fontWeight: 700, letterSpacing: '.14em', color: C.muted}}>MULTIDÃO</div>
      <div style={{position: 'absolute', left: 870, top: 860, fontFamily: FONT, fontSize: 22, fontWeight: 700, letterSpacing: '.14em', color: C.muted}}>FAIXAS INDIVIDUAIS</div>
      <div style={{position: 'absolute', left: 1460, top: 860, fontFamily: FONT, fontSize: 22, fontWeight: 700, letterSpacing: '.14em', color: C.muted}}>CIRCUITO</div>
      <Chip at={ind} tone="navy" style={{left: 140, top: 150}}><Icon name="users" size={26} color={C.cyan} />PASSAGEM INDIVIDUAL</Chip>
      <Chip at={insp} tone="navy" style={{left: 560, top: 150}}><Icon name="portal" size={26} color={C.cyan} />INSPEÇÃO NO PÓRTICO</Chip>
      <Chip at={info} tone="gold" style={{left: 980, top: 150}}><Icon name="monitor" size={26} />MONITORAMENTO INTEGRADO</Chip>
      <Sfx at={ind} name="pop" /><Sfx at={insp} name="pop" /><Sfx at={info} name="pop" />
    </AbsoluteFill>
  );
};

// ================================================================== BLOCO 3 · COMO FUNCIONA (faixa vista de lado)

const STEPS = [
  {icon: 'users', t: 'Fila e admissão'},
  {icon: 'face', t: 'Identificação e depósito'},
  {icon: 'portal', t: 'Travessia no pórtico'},
  {icon: 'retrieve', t: 'Retirada dos pertences'},
  {icon: 'check', t: 'Liberação e contagem'},
];

const StepBar: React.FC<{active: number}> = ({active}) => (
  <div style={{position: 'absolute', top: 120, left: 72, right: 72, display: 'flex', alignItems: 'center', gap: 10, fontFamily: FONT}}>
    {STEPS.map((s, i) => {
      const on = i === active, done = i < active;
      return (
        <React.Fragment key={i}>
          <div style={{flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, background: on ? '#fff' : '#F7F9FB', border: `1px solid ${C.line}`, borderTop: `4px solid ${on ? C.cyan : done ? C.navy : C.line}`, boxShadow: on ? '0 10px 30px rgba(24,168,200,.25)' : 'none', opacity: on || done ? 1 : 0.55, transform: `scale(${on ? 1.03 : 1})`}}>
            <IconDot name={done ? 'check' : s.icon} size={44} bg={on ? C.cyan : done ? C.navy : C.cyanSoft} color={on || done ? '#fff' : C.cyanInk} />
            <div>
              <div style={{fontSize: 13, fontWeight: 800, letterSpacing: '.1em', color: C.faint}}>ETAPA {i + 1}</div>
              <div style={{fontSize: 18, fontWeight: 700, color: C.ink, lineHeight: 1.15}}>{s.t}</div>
            </div>
          </div>
          {i < 4 && <Icon name="arrowR" size={24} color={C.cyan} />}
        </React.Fragment>
      );
    })}
  </div>
);

const FLOOR = 900;
const LaneSet: React.FC<{gateOpen: number; light: 'red' | 'green'; portalTone?: string; scan?: number; children?: React.ReactNode}> = ({gateOpen, light, portalTone = C.navy, scan = -1, children}) => (
  <>
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      <rect x={0} y={FLOOR} width={1920} height={180} fill="#E2E7EE" />
      <line x1={0} y1={FLOOR} x2={1920} y2={FLOOR} stroke={C.faint} strokeWidth={3} />
      {/* gradis da fila */}
      {[120, 220, 320, 420].map((x) => <g key={x}><line x1={x} y1={FLOOR} x2={x} y2={FLOOR - 120} stroke={C.faint} strokeWidth={6} /></g>)}
      <line x1={120} y1={FLOOR - 120} x2={420} y2={FLOOR - 120} stroke={C.faint} strokeWidth={6} />
      <line x1={120} y1={FLOOR - 70} x2={420} y2={FLOOR - 70} stroke={C.faint} strokeWidth={4} />
      {/* limitador (1 por vez) */}
      <rect x={470} y={FLOOR - 150} width={26} height={150} rx={6} fill={C.navy} />
      <circle cx={483} cy={FLOOR - 166} r={13} fill={gateOpen > 0.5 ? C.green : C.red} />
      <rect x={496} y={FLOOR - 100} width={120} height={14} rx={7} fill={C.gold} transform={`rotate(${-gateOpen * 80} 496 ${FLOOR - 93})`} />
      {/* poste da câmera */}
      <rect x={660} y={FLOOR - 430} width={14} height={430} fill={C.graphite} />
      <g transform={`translate(612 ${FLOOR - 470})`}><rect width={74} height={44} rx={8} fill={C.navy} /><circle cx={16} cy={22} r={11} fill={C.cyan} /></g>
      {/* mesa de depósito */}
      <rect x={760} y={FLOOR - 150} width={190} height={16} rx={4} fill={C.navy2} />
      <rect x={800} y={FLOOR - 134} width={12} height={134} fill={C.navy2} />
      {/* esteira até a retirada */}
      <line x1={950} y1={FLOOR - 142} x2={1380} y2={FLOOR - 142} stroke={C.faint} strokeWidth={10} strokeDasharray="18 12" />
      {/* pórtico */}
      <rect x={1080} y={FLOOR - 400} width={34} height={400} rx={6} fill={portalTone} />
      <rect x={1226} y={FLOOR - 400} width={34} height={400} rx={6} fill={portalTone} />
      <rect x={1070} y={FLOOR - 430} width={200} height={44} rx={8} fill={portalTone} />
      <text x={1170} y={FLOOR - 401} fill="#fff" fontFamily="Inter" fontWeight={800} fontSize={18} textAnchor="middle" letterSpacing={2}>PÓRTICO</text>
      {scan >= 0 && <rect x={1114} y={FLOOR - 386 + scan * 370} width={112} height={8} fill={C.cyan} opacity={0.85} />}
      {/* mesa de retirada */}
      <rect x={1380} y={FLOOR - 150} width={190} height={16} rx={4} fill={C.navy2} />
      <rect x={1520} y={FLOOR - 134} width={12} height={134} fill={C.navy2} />
      {/* luz de liberação */}
      <rect x={1700} y={FLOOR - 300} width={20} height={300} fill={C.graphite} />
      <circle cx={1710} cy={FLOOR - 320} r={26} fill={light === 'green' ? C.green : C.red} />
      <circle cx={1710} cy={FLOOR - 320} r={44} fill={light === 'green' ? C.green : C.red} opacity={0.18} />
    </svg>
    {children}
  </>
);

const Tray: React.FC<{x: number; items: number; rec?: boolean; f: number}> = ({x, items, rec, f}) => (
  <div style={{position: 'absolute', left: x - 70, top: FLOOR - 212, width: 140, height: 62, borderRadius: 8, background: '#fff', border: `3px solid ${rec ? C.cyan : C.navy2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: C.navy}}>
    {['phone', 'key', 'wallet'].slice(0, items).map((n) => <Icon key={n} name={n} size={30} />)}
    {rec && <div style={{position: 'absolute', top: -34, left: 0, fontFamily: FONT, fontSize: 16, fontWeight: 800, color: C.cyanInk, letterSpacing: '.08em', display: 'flex', alignItems: 'center', gap: 6}}><span style={{width: 10, height: 10, borderRadius: 5, background: C.red, opacity: Math.floor(f / 8) % 2 ? 1 : 0.2}} />REC · PERTENCES</div>}
  </div>
);

/** keyframes de posição [frame, x] → x atual e se está andando */
const track = (f: number, keys: [number, number][]) => {
  const fr = keys.map((k) => k[0]), xs = keys.map((k) => k[1]);
  const x = interpolate(f, fr, xs, clamp);
  const moving = keys.some((k, i) => i > 0 && f > keys[i - 1][0] && f < k[0] && keys[i - 1][1] !== k[1]);
  return {x, walk: moving ? f : 0};
};

export const C05: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const entra = wf(sc, 'entra');
  const cam = wf(sc, 'camera');
  const rosto = wf(sc, 'rosto');
  const pert = wf(sc, 'pertences');
  const film = wf(sc, 'filmados');
  const gate = interpolate(f, [entra, entra + 8, entra + 34, entra + 42], [0, 1, 1, 0], clamp);
  const {x, walk} = track(f, [[0, 330], [entra, 330], [entra + 34, 640], [rosto + 6, 640], [pert, 760]]);
  const faceOn = f >= rosto && f < pert + 6;
  const items = f < pert + 4 ? 0 : Math.min(3, Math.floor((f - pert - 4) / 5) + 1);
  return (
    <AbsoluteFill style={{background: '#F4F6F9'}}>
      <StepBar active={f < cam ? 0 : 1} />
      <LaneSet gateOpen={gate} light="red">
        <Person x={200} y={FLOOR} scale={0.95} shirt="#9AA7B8" opacity={0.5} />
        <Tray x={860} items={items} rec={f >= film} f={f} />
        <Person x={x} y={FLOOR} shirt="#F78154" walk={walk} />
        {/* feixe da câmera até o rosto */}
        {f >= cam && <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}><polygon points={`628,${FLOOR - 448} ${x - 50},${FLOOR - 250} ${x + 50},${FLOOR - 250}`} fill={C.cyan} opacity={0.14} /></svg>}
        {faceOn && (
          <div style={{position: 'absolute', left: x - 52, top: FLOOR - 270, width: 104, height: 104, opacity: ease(f, rosto, rosto + 6)}}>
            {[[0, 0, 'tl'], [1, 0, 'tr'], [0, 1, 'bl'], [1, 1, 'br']].map(([a, b, k]) => (
              <div key={k as string} style={{position: 'absolute', left: (a as number) ? 'auto' : 0, right: (a as number) ? 0 : 'auto', top: (b as number) ? 'auto' : 0, bottom: (b as number) ? 0 : 'auto', width: 28, height: 28,
                borderLeft: (a as number) ? 'none' : `5px solid ${C.cyan}`, borderRight: (a as number) ? `5px solid ${C.cyan}` : 'none', borderTop: (b as number) ? 'none' : `5px solid ${C.cyan}`, borderBottom: (b as number) ? `5px solid ${C.cyan}` : 'none'}} />
            ))}
          </div>
        )}
      </LaneSet>
      <Chip at={entra} tone="light" style={{left: 250, top: 330}} size={22}><Icon name="users" size={24} color={C.cyanInk} />1 POR VEZ</Chip>
      <Chip at={rosto} tone="cyan" style={{left: 720, top: 300}} size={22}><Icon name="face" size={24} />FACE REGISTRADA</Chip>
      <Chip at={film} tone="navy" style={{left: 520, top: 560}} size={22}><Icon name="camera" size={24} color={C.cyan} />PERTENCES FILMADOS</Chip>
      <Sfx at={entra} name="click" volume={0.5} /><Sfx at={rosto} name="tick" volume={0.5} /><Sfx at={film} name="tick" volume={0.5} />
    </AbsoluteFill>
  );
};

export const C06: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const port = wf(sc, 'portico');
  const metal = wf(sc, 'metal');
  const sent = wf(sc, 'sentido');
  const hor = wf(sc, 'horario');
  const acusar = wf(sc, 'acusar');
  const rep = wf(sc, 'repete');
  const {x, walk} = track(f, [[0, 760], [6, 760], [port + 10, 1170], [acusar + 4, 1170], [acusar + 18, 1010], [rep - 4, 1010], [rep + 16, 1170]]);
  const alarm = f >= acusar && f < rep + 4;
  const ok = f >= rep + 16;
  const scan = f >= metal && f < metal + 30 ? (f - metal) / 30 : f >= rep + 2 && f < rep + 30 ? (f - rep - 2) / 28 : -1;
  const trayX = interpolate(f, [0, sc.duration * 30], [860, 1470], clamp);
  return (
    <AbsoluteFill style={{background: '#F4F6F9'}}>
      <StepBar active={2} />
      <LaneSet gateOpen={0} light="red" portalTone={alarm && Math.floor(f / 5) % 2 === 0 ? C.gold : ok ? C.green : C.navy} scan={scan}>
        <Tray x={trayX} items={3} f={f} />
        <Person x={x} y={FLOOR} shirt="#F78154" walk={walk} />
      </LaneSet>
      <Chip at={metal} tone="light" style={{left: 1300, top: 300}} size={22}><Icon name="shield" size={24} color={C.cyanInk} />DETECTOR DE METAL</Chip>
      <Chip at={sent} tone="light" style={{left: 1300, top: 372}} size={22}><Icon name="arrowR" size={24} color={C.cyanInk} />SENTIDO: ENTRADA</Chip>
      <Chip at={hor} tone="light" style={{left: 1300, top: 444}} size={22}><Icon name="clock" size={24} color={C.cyanInk} />HORÁRIO REGISTRADO</Chip>
      {alarm && <Chip at={acusar} tone="gold" style={{left: 640, top: 330}} size={24}><Icon name="loop" size={26} />METAL? REPETE A LEITURA</Chip>}
      {ok && <Chip at={rep + 16} tone="cyan" style={{left: 760, top: 330, background: C.green}} size={24}><Icon name="check" size={26} />LEITURA OK</Chip>}
      <Sfx at={metal} name="tick" volume={0.4} /><Sfx at={acusar} name="alarm" volume={0.18} /><Sfx at={rep + 16} name="success" volume={0.35} />
    </AbsoluteFill>
  );
};

export const C07: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const ret = wf(sc, 'retira');
  const vinc = wf(sc, 'vinculados');
  const cont = wf(sc, 'contada');
  const lib = wf(sc, 'libera');
  const {x, walk} = track(f, [[0, 1170], [4, 1170], [ret + 6, 1470], [lib, 1470], [lib + 40, 1900]]);
  const taken = f >= wf(sc, 'pertences') + 4;
  const count = 1247 + (f >= cont ? 1 : 0);
  const nxt = track(f, [[lib, 330], [lib + 34, 640]]);
  return (
    <AbsoluteFill style={{background: '#F4F6F9'}}>
      <StepBar active={f < cont ? 3 : 4} />
      <LaneSet gateOpen={interpolate(f, [lib, lib + 8, lib + 30, lib + 38], [0, 1, 1, 0], clamp)} light={f >= lib ? 'green' : 'red'}>
        <Person x={nxt.x} y={FLOOR} shirt="#4DB6AC" walk={nxt.walk} opacity={f >= lib ? 1 : 0.5} />
        <Tray x={1470} items={taken ? 0 : 3} f={f} />
        <Person x={x} y={FLOOR} shirt="#F78154" walk={walk} />
      </LaneSet>
      {/* vínculo face ↔ pertences */}
      {f >= vinc && (
        <div style={{position: 'absolute', left: 1080, top: 330, display: 'flex', alignItems: 'center', gap: 0, opacity: ease(f, vinc, vinc + 8), fontFamily: FONT}}>
          <div style={{background: '#fff', border: `2px solid ${C.line}`, borderRadius: 10, padding: 12, display: 'grid', placeItems: 'center', color: C.navy}}><Icon name="face" size={44} /></div>
          <div style={{width: 140 * ease(f, vinc + 4, vinc + 14), height: 5, background: C.cyan}} />
          <div style={{background: '#fff', border: `2px solid ${C.line}`, borderRadius: 10, padding: 12, display: 'flex', gap: 6, color: C.navy}}><Icon name="phone" size={36} /><Icon name="key" size={36} /><Icon name="wallet" size={36} /></div>
          <div style={{marginLeft: 16, fontSize: 22, fontWeight: 800, color: C.cyanInk, letterSpacing: '.08em'}}>MESMO ID</div>
        </div>
      )}
      {/* contador */}
      <div style={{position: 'absolute', left: 1600, top: 330, background: C.navy, borderRadius: 10, padding: '12px 18px', fontFamily: FONT, color: '#fff', textAlign: 'center', transform: `scale(${1 + 0.12 * (pop(f, cont, 8, 300) - (f >= cont + 12 ? pop(f, cont + 12, 20, 120) : 0))})`}}>
        <div style={{fontSize: 14, fontWeight: 800, letterSpacing: '.14em', color: '#9FD9E8'}}>PASSAGENS</div>
        <div style={{fontSize: 44, fontWeight: 800, fontVariantNumeric: 'tabular-nums'}}>{count.toLocaleString('pt-BR')}</div>
      </div>
      {f >= cont && f < cont + 30 && <div style={{position: 'absolute', left: 1760, top: 300 - (f - cont) * 2, fontFamily: FONT, fontSize: 40, fontWeight: 800, color: C.green, opacity: 1 - (f - cont) / 30}}>+1</div>}
      <Sfx at={vinc} name="tick" volume={0.4} /><Sfx at={cont} name="ding" volume={0.35} /><Sfx at={lib} name="click" volume={0.5} />
    </AbsoluteFill>
  );
};

// ================================================================== o caminho da informação

const NODES = [
  {icon: 'cpu', b: 'Controlador local', s: 'Une eventos sob um ID único'},
  {icon: 'net', b: 'Rede própria', s: 'Fibra dupla, backbone privado'},
  {icon: 'cloud', b: 'Servidores e nuvem', s: 'Conciliam imagens e eventos'},
  {icon: 'monitor', b: 'Central de monitoramento', s: 'Alerta com imagem e faixa'},
  {icon: 'shield', b: 'Decisão policial', s: 'Avalia e aciona a equipe', auth: true},
];
const NX = (i: number) => 90 + i * 360;
const NY = 520;

const Node: React.FC<{i: number; at: number; glow?: boolean}> = ({i, at, glow}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const n = NODES[i];
  const t = pop(f, at, 15, 200);
  return (
    <div style={{position: 'absolute', left: NX(i), top: NY, width: 300, height: 130, borderRadius: 12, background: n.auth ? `linear-gradient(135deg, ${C.navy}, #2A2A1E)` : C.navy,
      boxShadow: n.auth ? `inset 0 0 0 3px ${C.gold}, 0 0 ${glow ? 50 : 0}px ${C.gold}88` : '0 14px 40px rgba(10,31,61,.25)', display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px', fontFamily: FONT, color: '#fff', transform: `scale(${t})`}}>
      <IconDot name={n.icon} size={56} bg={n.auth ? 'rgba(201,162,75,.2)' : 'rgba(24,168,200,.18)'} color={n.auth ? C.gold : '#7FD6EA'} />
      <div><div style={{fontSize: 22, fontWeight: 700, lineHeight: 1.15}}>{n.b}</div><div style={{fontSize: 16, color: '#BFCBDB', marginTop: 4}}>{n.s}</div></div>
    </div>
  );
};

const Fiber: React.FC<{i: number; at: number; cut?: number}> = ({i, at, cut = -1}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const x1 = NX(i) + 300, x2 = NX(i + 1), w = (x2 - x1) * ease(f, at, at + 10);
  const isCut = cut >= 0 && f >= cut;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      {[NY + 50, NY + 80].map((y, k) => {
        const broken = isCut && k === 0;
        return (
          <g key={k}>
            <line x1={x1} y1={y} x2={x1 + w} y2={y} stroke={broken ? C.red : C.cyan} strokeWidth={5} strokeDasharray={broken ? '6 10' : undefined} opacity={broken ? 0.7 : 1} />
            {!broken && <line x1={x1} y1={y} x2={x1 + w} y2={y} stroke="#fff" strokeWidth={5} strokeDasharray="10 50" strokeDashoffset={-f * 6 - k * 30} />}
            {broken && <text x={(x1 + x2) / 2} y={y - 12} fill={C.red} fontSize={30} fontWeight={800} textAnchor="middle" fontFamily="Inter">✕</text>}
          </g>
        );
      })}
    </svg>
  );
};

export const C08: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const id = wf(sc, 'identificador');
  const rede = wf(sc, 'rede');
  const dupla = wf(sc, 'dupla');
  const central = wf(sc, 'central');
  const chips = ['face', 'phone', 'portal', 'arrowR', 'clock'];
  const labels = ['face', 'pertences', 'faixa', 'sentido', 'horário'];
  return (
    <AbsoluteFill style={{background: C.bg}}>
      {/* 5 dados convergindo para um ID único */}
      {chips.map((c, k) => {
        const t = ease(f, 4 + k * 3, id + 4);
        const sx = 120 + k * 150, sy = 230;
        const ex = NX(0) + 150 - 30, ey = NY - 60;
        return (
          <div key={c} style={{position: 'absolute', left: sx + (ex - sx) * t, top: sy + (ey - sy) * t, opacity: 1 - ease(f, id + 2, id + 8), fontFamily: FONT, textAlign: 'center'}}>
            <IconDot name={c} size={60} />
            <div style={{fontSize: 16, fontWeight: 700, color: C.muted, marginTop: 4}}>{labels[k]}</div>
          </div>
        );
      })}
      <Chip at={id} tone="cyan" style={{left: NX(0) + 70, top: NY - 70}} size={20}>ID ÚNICO</Chip>
      <Node i={0} at={Math.max(0, id - 2)} />
      <Fiber i={0} at={rede - 4} cut={dupla + 8} />
      <Node i={1} at={rede} />
      <Fiber i={1} at={dupla - 2} />
      <Node i={2} at={dupla + 4} />
      <Fiber i={2} at={central - 8} />
      <Node i={3} at={central} />
      {/* espaço reservado para a decisão (cena seguinte) */}
      <div style={{position: 'absolute', left: NX(4), top: NY, width: 300, height: 130, borderRadius: 12, border: `2px dashed ${C.line}`, opacity: ease(f, central, central + 10)}} />
      <Chip at={dupla + 10} tone="gold" style={{left: NX(0) + 150, top: NY + 190}} size={22}><Icon name="loop" size={24} />REDUNDÂNCIA: UMA ROTA CAI, A OUTRA SEGUE</Chip>
      <Sfx at={id} name="pop" /><Sfx at={rede} name="pop" /><Sfx at={dupla + 8} name="tick" volume={0.4} /><Sfx at={central} name="pop" />
    </AbsoluteFill>
  );
};

// ================================================================== alerta e decisão

const Screen: React.FC<{i: number; hl: boolean; f: number}> = ({i, hl, f}) => (
  <div style={{width: 380, height: 210, borderRadius: 8, background: '#0B1A30', border: `3px solid ${hl && Math.floor(f / 6) % 2 === 0 ? C.gold : '#1E3352'}`, position: 'relative', overflow: 'hidden', fontFamily: FONT}}>
    <svg width={380} height={210}>
      {[50, 95, 140].map((y) => <line key={y} x1={20} y1={y} x2={360} y2={y} stroke="#1E3352" strokeWidth={2} />)}
      {Array.from({length: 4}).map((_, k) => <circle key={k} cx={20 + ((f * 3 + k * 90 + i * 40) % 340)} cy={72 + (k % 2) * 45} r={7} fill={hl && k === 1 ? C.gold : C.cyan} opacity={0.8} />)}
    </svg>
    <div style={{position: 'absolute', left: 12, bottom: 8, fontSize: 15, fontWeight: 800, letterSpacing: '.12em', color: hl ? C.gold : '#5C7A9E'}}>FAIXA 0{i + 1}</div>
  </div>
);

export const C09: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const alerta = wf(sc, 'alerta');
  const dec = wf(sc, 'decisao');
  const prot = wf(sc, 'protocolo');
  const a = pop(f, alerta, 14, 180);
  const move = ease(f, dec - 4, dec + 14);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 30%, #11315C 0%, #061428 75%)'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 22, width: 1230, margin: '0 auto', opacity: 1 - move * 0.6}}>
        {Array.from({length: 6}).map((_, i) => <Screen key={i} i={i} hl={i === 3 && f >= alerta} f={f} />)}
      </div>
      {/* cartão de alerta */}
      {f >= alerta && (
        <div style={{position: 'absolute', left: interpolate(move, [0, 1], [660, 250]), top: interpolate(move, [0, 1], [380, 560]), width: 600, transform: `scale(${a * (1 - 0.18 * move)})`, transformOrigin: 'left top',
          background: '#fff', borderRadius: 14, borderLeft: `8px solid ${C.gold}`, boxShadow: '0 30px 80px rgba(0,0,0,.5)', padding: 22, display: 'flex', gap: 20, fontFamily: FONT}}>
          <div style={{width: 170, height: 130, borderRadius: 8, background: 'linear-gradient(135deg,#8AA0B8,#3D5577)', filter: 'blur(5px)'}} />
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, color: C.goldInk, fontSize: 18, fontWeight: 800, letterSpacing: '.12em'}}><Icon name="alert" size={24} />ALERTA</div>
            <div style={{fontSize: 30, fontWeight: 800, color: C.navy, marginTop: 6}}>Faixa 04 · Acesso Ondina</div>
            <div style={{fontSize: 20, color: C.muted, marginTop: 6}}>Imagem + faixa + horário</div>
          </div>
        </div>
      )}
      {/* seta dourada até a decisão policial */}
      {f >= dec && (
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <line x1={760} y1={630} x2={760 + 360 * ease(f, dec + 6, dec + 18)} y2={630} stroke={C.gold} strokeWidth={6} />
          {f > dec + 16 && <path d="M1110 615 L1130 630 L1110 645" stroke={C.gold} strokeWidth={6} fill="none" />}
        </svg>
      )}
      {f >= dec + 14 && (
        <div style={{position: 'absolute', left: 1150, top: 560, width: 470, height: 150, borderRadius: 14, background: `linear-gradient(135deg, ${C.navy}, #2A2A1E)`, boxShadow: `inset 0 0 0 3px ${C.gold}, 0 0 60px ${C.gold}55`, display: 'flex', alignItems: 'center', gap: 18, padding: '0 24px', fontFamily: FONT, color: '#fff', transform: `scale(${pop(f, dec + 14, 15, 200)})`}}>
          <IconDot name="shield" size={74} bg="rgba(201,162,75,.2)" color={C.gold} />
          <div><div style={{fontSize: 32, fontWeight: 800}}>Decisão policial</div><div style={{fontSize: 20, color: '#BFCBDB', marginTop: 4}}>Avalia e aciona a equipe</div></div>
        </div>
      )}
      <Lettering at={prot} style={{left: 0, right: 0, top: 800, textAlign: 'center'}} size={50}>
        A tecnologia informa. <span style={{color: C.gold}}>A autoridade decide.</span>
      </Lettering>
      <Sfx at={alerta} name="ding" volume={0.4} /><Sfx at={dec + 14} name="stamp" volume={0.35} />
    </AbsoluteFill>
  );
};

// ================================================================== BLOCO 4 · IMPACTO

const Kpi: React.FC<{at: number; v: string; u: string; t: string; gold?: boolean; x: number}> = ({at, v, u, t, gold, x}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = pop(f, at, 14, 180);
  return (
    <div style={{position: 'absolute', left: x, top: 230, width: 500, height: 230, borderRadius: 14, background: gold ? C.goldSoft : C.navy, boxShadow: gold ? `inset 0 0 0 2px #E7D5A4` : '0 20px 50px rgba(10,31,61,.25)',
      padding: '34px 36px', fontFamily: FONT, transform: `translateY(${(1 - k) * 40}px)`, opacity: Math.min(1, k * 1.5)}}>
      <div style={{fontSize: 110, fontWeight: 800, lineHeight: 1, letterSpacing: '-.02em', color: gold ? C.goldInk : '#fff'}}>{v}<span style={{fontSize: 48, color: gold ? C.goldInk : '#9FD9E8'}}>{u}</span></div>
      <div style={{fontSize: 28, color: gold ? C.graphite : '#BFCBDB', marginTop: 16}}>{t}</div>
    </div>
  );
};

export const C10: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const q = wf(sc, 'quinze');
  const d = wf(sc, 'duzentas');
  const qu = wf(sc, 'quatro');
  const vinte = wf(sc, 'vinte');
  const lanes = f < d ? 0 : f < qu ? 1 : Math.round(interpolate(f, [qu, vinte + 10], [1, 20], clamp));
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Kpi at={q} v="15" u=" s" t="meta por folião" gold x={150} />
      <Kpi at={d} v="240" u="/h" t="passagens por faixa" x={710} />
      <Kpi at={qu} v="4.800" u="/h" t="com 20 faixas" x={1270} />
      {/* faixas se multiplicando */}
      <div style={{position: 'absolute', left: 150, right: 150, top: 560, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center'}}>
        {Array.from({length: lanes}).map((_, i) => (
          <div key={i} style={{width: 68, height: 150, borderRadius: 10, background: '#fff', border: `2px solid ${C.line}`, borderTop: `4px solid ${C.cyan}`, display: 'grid', placeItems: 'center', color: C.navy, transform: `scale(${pop(f, i === 0 ? d : qu + i * 1.5, 14, 240)})`, position: 'relative', overflow: 'hidden'}}>
            <Icon name="portal" size={40} />
            <div style={{position: 'absolute', left: 28, top: 150 - ((f * 4 + i * 23) % 170), width: 12, height: 12, borderRadius: 6, background: C.cyan}} />
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 150, top: 760, fontFamily: FONT, fontSize: 30, fontWeight: 800, color: C.navy, opacity: lanes ? 1 : 0}}>
        {lanes} {lanes === 1 ? 'faixa' : 'faixas'} · {(lanes * 240).toLocaleString('pt-BR')} passagens/hora
      </div>
      <div style={{position: 'absolute', left: 150, top: 830, fontFamily: FONT, fontSize: 20, color: C.muted, opacity: ease(f, q, q + 12)}}>
        Metas do anteprojeto, a validar no piloto · 6 faixas cabem em 10,68 m de acesso
      </div>
      <Sfx at={q} name="pop" /><Sfx at={d} name="pop" /><Sfx at={qu} name="pop" />
    </AbsoluteFill>
  );
};

const Panel: React.FC<{at: number; x: number; title: string; icon: string; children: React.ReactNode}> = ({at, x, title, icon, children}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const k = pop(f, at, 15, 170);
  return (
    <div style={{position: 'absolute', left: x, top: 190, width: 540, height: 560, borderRadius: 14, background: '#fff', border: `1px solid ${C.line}`, boxShadow: '0 20px 50px rgba(10,31,61,.12)', padding: 28, fontFamily: FONT, transform: `translateY(${(1 - k) * 40}px)`, opacity: Math.min(1, k * 1.5)}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20}}>
        <IconDot name={icon} size={52} />
        <div style={{fontSize: 24, fontWeight: 800, color: C.navy, letterSpacing: '.04em'}}>{title}</div>
      </div>
      {children}
    </div>
  );
};

export const C11: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const eq = wf(sc, 'equipes');
  const ev = wf(sc, 'evidencia');
  const priv = wf(sc, 'privacidade');
  const bars = [0.5, 0.7, 0.62, 0.85, 0.74, 0.9];
  const busy = {x: 380, y: 200};
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Panel at={0} x={110} title="Painel do comando" icon="chart">
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 18, height: 280, borderBottom: `2px solid ${C.line}`, padding: '0 10px'}}>
          {bars.map((b, i) => {
            const h = 260 * b * ease(f, 4 + i * 3, 22 + i * 3) * (0.92 + 0.08 * Math.sin(f / 10 + i));
            return <div key={i} style={{display: 'flex', gap: 4, alignItems: 'flex-end'}}><div style={{width: 26, height: h, background: C.cyan, borderRadius: 4}} /><div style={{width: 26, height: h * 0.8, background: C.navy, borderRadius: 4}} /></div>;
          })}
        </div>
        <div style={{display: 'flex', gap: 22, marginTop: 16, fontSize: 18, color: C.muted}}>
          <span><b style={{color: C.cyan}}>■</b> entradas</span><span><b style={{color: C.navy}}>■</b> saídas</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 30, fontSize: 24, fontWeight: 800, color: C.navy}}><Icon name="clock" size={28} color={C.gold} />Atualiza a cada 15 min</div>
      </Panel>
      <Panel at={eq} x={690} title="Equipes onde a festa precisa" icon="map">
        <svg width={484} height={380}>
          <path d="M20 360 C 140 260, 220 220, 470 30" stroke={C.line} strokeWidth={46} fill="none" strokeLinecap="round" />
          {[[90, 300], [230, 205], [busy.x, busy.y], [440, 70]].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={i === 2 ? 20 + 6 * Math.sin(f / 4) : 14} fill={i === 2 ? C.gold : C.navy} opacity={i === 2 ? 0.9 : 0.7} />
            </g>
          ))}
          {[[60, 120], [200, 330], [460, 300]].map(([sx, sy], i) => {
            const t = ease(f, eq + 6 + i * 4, eq + 40 + i * 4);
            return <g key={'t' + i} transform={`translate(${sx + (busy.x - 40 + i * 30 - sx) * t} ${sy + (busy.y + 50 - sy) * t})`}><circle r={16} fill={C.cyan} /><path d="M-7 0 l5 5 9-10" stroke="#fff" strokeWidth={3} fill="none" /></g>;
          })}
        </svg>
      </Panel>
      <Panel at={ev} x={1270} title="Decisão com evidência" icon="shield">
        {['Imagem da passagem', 'Faixa e sentido', 'Horário exato', 'Vínculo pessoa ↔ pertences'].map((t, i) => (
          <div key={t} style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, color: C.graphite, marginTop: 22, opacity: ease(f, ev + 4 + i * 4, ev + 12 + i * 4)}}>
            <Icon name="check" size={34} color={C.cyan} />{t}
          </div>
        ))}
      </Panel>
      {/* privacidade */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 110, bottom: 0, background: C.navy, opacity: ease(f, priv - 2, priv + 10) * 0.93}} />
      {f >= priv && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: FONT, color: '#fff', opacity: ease(f, priv, priv + 10)}}>
          <div style={{width: 150, height: 150, borderRadius: 75, background: 'rgba(201,162,75,.18)', display: 'grid', placeItems: 'center', color: C.gold, transform: `scale(${pop(f, priv, 13, 180)})`}}><Icon name="lock" size={84} /></div>
          <div style={{fontSize: 56, fontWeight: 800, marginTop: 30}}>Privacidade por padrão</div>
          <div style={{fontSize: 30, color: '#D5DEEA', marginTop: 18, textAlign: 'center', lineHeight: 1.45}}>
            Gestores recebem dados agregados.<br />Imagens individuais: só com perfil autorizado, finalidade registrada e trilha de auditoria.
          </div>
        </div>
      )}
      <Sfx at={eq} name="pop" /><Sfx at={ev} name="pop" /><Sfx at={priv} name="success" volume={0.3} />
    </AbsoluteFill>
  );
};

// ================================================================== fechamento

export const C12: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const len = sceneLen(sc);
  const mais = wf(sc, 'mais');
  const seg = wf(sc, 'seguranca');
  const pil = wf(sc, 'piloto');
  const fadeOut = ease(f, len - 24, len - 2);
  return (
    <AbsoluteFill>
      <Aerial orderly len={len} zoom={[1.04, 1.12]} />
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(10,31,61,.95) 0%, rgba(10,31,61,.75) 48%, rgba(10,31,61,0) 75%)'}} />
      <div style={{position: 'absolute', left: 130, top: 250, fontFamily: FONT, color: '#fff'}}>
        <div style={{fontSize: 150, fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1, opacity: ease(f, 0, 12), transform: `translateY(${ease(f, 0, 12, 20, 0)}px)`}}>PIC BA</div>
        <div style={{height: 6, width: 560 * ease(f, 6, 26), marginTop: 22, background: `linear-gradient(90deg, ${C.gold} 0 34%, ${C.cyan} 34% 100%)`, backgroundSize: '560px 100%'}} />
        <div style={{fontSize: 46, fontWeight: 700, marginTop: 30, opacity: ease(f, mais, mais + 10)}}>Mais controle no acesso.</div>
        <div style={{fontSize: 46, fontWeight: 700, color: C.gold, opacity: ease(f, seg, seg + 10)}}>Mais segurança na festa.</div>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 40, fontSize: 24, fontWeight: 800, letterSpacing: '.12em', color: C.navy, background: C.gold, padding: '10px 16px', borderRadius: 6, opacity: ease(f, pil, pil + 8), transform: `scale(${pop(f, pil, 14, 200) || 0.001})`, transformOrigin: 'left center'}}>
          <Icon name="flag" size={26} />PILOTO · CARNAVAL 2027 · ONDINA
        </div>
        <div style={{fontSize: 20, color: '#A9B7CC', marginTop: 46, opacity: ease(f, pil + 20, pil + 34)}}>
          Concepção: <b style={{color: '#fff'}}>Henrique Eduardo Weyll Wiering</b> · Engenharia e integração: <b style={{color: '#fff'}}>Grupo SBS</b>
        </div>
      </div>
      <AbsoluteFill style={{background: C.navy, opacity: fadeOut}} />
      <Sfx at={pil} name="success" volume={0.35} />
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC<P>> = {c01: C01, c02: C02, c03: C03, c04: C04, c05: C05, c06: C06, c07: C07, c08: C08, c09: C09, c10: C10, c11: C11, c12: C12};
