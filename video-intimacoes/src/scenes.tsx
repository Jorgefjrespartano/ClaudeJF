import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, DashLine, Draw, FONT, Hairline, Icon, Reveal, Scene, Sfx, clamp, drawP, ease, sceneLen, soft, wf} from './lib';

type P = {sc: Scene};

// Zonas do quadro 1080×1920: títulos 300–560 · ilustração 560–1200 · legendas a partir de 1250

const Title: React.FC<{children: React.ReactNode; top?: number}> = ({children, top = 300}) => (
  <div style={{position: 'absolute', left: 90, right: 90, top, textAlign: 'center', fontFamily: FONT, color: C.white}}>{children}</div>
);
const H1: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 76, color = C.white}) => (
  <div style={{fontSize: size, fontWeight: 800, lineHeight: 1.06, letterSpacing: '-.01em', color}}>{children}</div>
);
const Label: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({children, color = C.gold, size = 30}) => (
  <div style={{fontSize: size, fontWeight: 700, letterSpacing: '.2em', color}}>{children}</div>
);
const Abs: React.FC<{x: number; y: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, y, children, style}) => (
  <div style={{position: 'absolute', left: x, top: y, ...style}}>{children}</div>
);
const FullSvg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>{children}</svg>
);

/** Celular em traço fino com conteúdo de tela em HTML */
const Phone: React.FC<{x: number; y: number; w?: number; h?: number; children?: React.ReactNode; glow?: number}> = ({x, y, w = 340, h = 600, children, glow = 0}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: w * 0.15, border: `4px solid ${C.white}`, background: '#0D0D0F',
    boxShadow: glow ? `0 0 ${60 * glow}px rgba(201,164,76,${0.35 * glow})` : 'none', overflow: 'hidden'}}>
    <div style={{position: 'absolute', top: 16, left: w / 2 - 38, width: 76, height: 20, borderRadius: 10, background: '#1E1E21'}} />
    {children}
  </div>
);

/** Notificação genérica (sem reproduzir texto oficial) */
const Notification: React.FC<{at: number; sender?: string}> = ({at, sender = 'POLÍCIA CIVIL'}) => {
  const f = useCurrentFrame();
  const m = soft(f, at);
  return (
    <div style={{position: 'absolute', top: 100, left: 16, right: 16, borderRadius: 20, background: C.panel, border: `1px solid ${C.line}`, padding: 18,
      opacity: m, transform: `translateY(${(1 - m) * -50}px)`, fontFamily: FONT}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <div style={{width: 44, height: 44, borderRadius: 11, background: '#232326', display: 'grid', placeItems: 'center'}}><Icon name="mail" size={26} color={C.gold} stroke={1.8} /></div>
        <div style={{fontSize: 19, fontWeight: 800, color: C.white, letterSpacing: '.08em'}}>{sender}</div>
        <div style={{marginLeft: 'auto', fontSize: 15, color: C.dim}}>agora</div>
      </div>
      {[0.95, 0.82, 0.55].map((w, i) => <div key={i} style={{height: 12, width: `${w * 100}%`, borderRadius: 6, background: '#2C2C30', marginTop: i ? 10 : 18}} />)}
    </div>
  );
};

/** Unidade policial genérica (prédio em traço fino, sem brasão) */
const Unit: React.FC<{x: number; y: number; at: number; size?: number; label?: boolean}> = ({x, y, at, size = 150, label = true}) => {
  const f = useCurrentFrame();
  const t = soft(f, at);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: size, textAlign: 'center', opacity: t, transform: `translateY(${(1 - t) * 16}px)`, fontFamily: FONT}}>
      <Icon name="building" size={size} stroke={1.1} />
      {label && <div style={{fontSize: 22, fontWeight: 700, letterSpacing: '.16em', color: C.gray, marginTop: 6}}>UNIDADE</div>}
    </div>
  );
};

// ================================================================== 1 · a mensagem

export const S1: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const msg = wf(sc, 'mensagem');
  const cel = wf(sc, 'celular');
  const reg = wf(sc, 'registro');
  const dev = wf(sc, 'devolveu');
  const float = Math.sin(f / 18) * 6;
  const tag = soft(f, reg);
  const pathP = ease(f, dev - 4, dev + 18) * 0.55; // o caminho fica pela metade: não devolveu
  return (
    <AbsoluteFill>
      <Title><H1>RECEBEU UMA<br />MENSAGEM?</H1><Hairline at={6} width={180} style={{marginTop: 26}} /></Title>
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${float}px)`}}>
        <Phone x={150} y={600} glow={ease(f, msg, msg + 10)}>
          <Notification at={msg} />
          {/* o aparelho citado na mensagem */}
          <div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center', opacity: ease(f, cel, cel + 8)}}>
            <div style={{width: 110, height: 190, borderRadius: 20, border: `3px solid ${C.gray}`, position: 'relative'}}>
              <div style={{position: 'absolute', top: 10, left: 38, width: 34, height: 8, borderRadius: 4, background: '#2C2C30'}} />
            </div>
          </div>
        </Phone>
      </div>
      {/* etiqueta “registro de roubo ou furto” presa ao aparelho */}
      <FullSvg><DashLine x1={420} y1={1010} x2={600} y2={1010} p={ease(f, reg, reg + 10)} color={C.gold} width={3} /></FullSvg>
      <Abs x={560} y={960} style={{opacity: tag, transform: `scale(${0.85 + 0.15 * tag})`, transformOrigin: 'left center'}}>
        <div style={{fontFamily: FONT, fontSize: 26, fontWeight: 800, letterSpacing: '.06em', color: '#111', background: C.gold, padding: '12px 18px', borderRadius: 6, lineHeight: 1.2}}>REGISTRO DE<br />ROUBO OU FURTO</div>
      </Abs>
      {/* caminho até a unidade, interrompido */}
      <Unit x={790} y={700} at={dev - 6} size={140} />
      <FullSvg><DashLine x1={500} y1={760} x2={790} y2={760} p={pathP / 0.55 * 0.55 + 0} color={C.gray} width={4} /></FullSvg>
      {f >= dev + 4 && <Abs x={640} y={700} style={{fontFamily: FONT, fontSize: 64, fontWeight: 800, color: C.gold, opacity: ease(f, dev + 4, dev + 12)}}>?</Abs>}
      <Sfx at={msg} name="ding" volume={0.12} />
    </AbsoluteFill>
  );
};

// ================================================================== 2 · “Sabe o que acontece agora?”

export const S2: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const len = sceneLen(sc);
  const z = interpolate(f, [0, len], [1, 1.14], {...clamp, easing: (x) => x * (2 - x)});
  return (
    <AbsoluteFill>
      <Title><H1>SABE O QUE<br />ACONTECE AGORA?</H1></Title>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '42% 70%'}}>
        <Phone x={150} y={600} glow={1}><Notification at={-30} /></Phone>
        <Abs x={640} y={700} style={{fontFamily: FONT, fontSize: 64 + 40 * ease(f, 0, len), fontWeight: 800, color: C.gold}}>?</Abs>
        <Unit x={790} y={700} at={-30} size={140} />
      </div>
    </AbsoluteFill>
  );
};

// ================================================================== 3 · a operação (anel 360° com 10 segmentos)

const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => [cx + r * Math.cos((a - 90) * Math.PI / 180), cy + r * Math.sin((a - 90) * Math.PI / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
};

export const S3: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const tit = wf(sc, 'intimacoes');
  const dec = wf(sc, 'decima');
  const fase = wf(sc, 'fase');
  const cx = 540, cy = 860, r = 230;
  return (
    <AbsoluteFill>
      <Title top={290}>
        <Reveal at={0}><Label color={C.gray} size={26}>POLÍCIA CIVIL DA BAHIA</Label></Reveal>
        <Reveal at={tit} style={{marginTop: 22}}><H1 size={96}>INTIMAÇÕES MOBILE</H1></Reveal>
      </Title>
      <FullSvg>
        {Array.from({length: 10}).map((_, i) => {
          const a0 = i * 36 + 3, a1 = (i + 1) * 36 - 3;
          const isTenth = i === 9;
          const lit = isTenth && f >= dec;
          return <Draw key={i} d={arc(cx, cy, r, a0, a1)} at={4 + i * 3} dur={10} color={lit ? C.gold : C.white} width={lit ? 12 : 6} opacity={isTenth && !lit ? 0.5 : 1} />;
        })}
        <Draw d={arc(cx, cy, r + 36, 0, 359.9)} at={tit} dur={30} color={C.goldDim} width={2} />
      </FullSvg>
      {/* celular no centro do anel */}
      <Abs x={cx - 70} y={cy - 120} style={{opacity: ease(f, 2, 12)}}><Icon name="phone" size={240} stroke={0.9} /></Abs>
      <Abs x={cx + r * 0.5} y={cy - r * 1.02} style={{opacity: ease(f, dec, dec + 8), transform: `scale(${0.8 + 0.2 * soft(f, dec)})`}}>
        <div style={{fontFamily: FONT, fontSize: 34, fontWeight: 800, color: '#111', background: C.gold, borderRadius: 30, padding: '6px 16px'}}>10ª</div>
      </Abs>
      <Title top={1130}><Reveal at={fase}><div style={{fontSize: 40, fontWeight: 600, color: C.gold}}>Operação Mobile 360 | 10ª edição</div></Reveal></Title>
    </AbsoluteFill>
  );
};

// ================================================================== 4 · intimações enviadas

const Envelope: React.FC<{open: number; doc: number; w?: number}> = ({open, doc, w = 420}) => {
  const h = w * 0.62;
  const flapY = h * (0.55 - 1.15 * open); // ponta da aba: desce (fechada) → sobe (aberta)
  return (
    <div style={{position: 'relative', width: w, height: h}}>
      {/* fundo + aba (atrás do documento) */}
      <svg width={w} height={h} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <rect x={2} y={2} width={w - 4} height={h - 4} rx={10} fill="#111114" stroke={C.white} strokeWidth={4} />
        <path d={`M4 6 L${w / 2} ${flapY} L${w - 4} 6`} fill="#111114" stroke={C.white} strokeWidth={4} strokeLinejoin="round" />
      </svg>
      {/* documento saindo */}
      <div style={{position: 'absolute', left: w * 0.1, right: w * 0.1, top: h * 0.12 - doc * h * 0.72, height: h * 0.85, background: '#F2F1EC', borderRadius: 6, padding: 18, fontFamily: FONT}}>
        <div style={{fontSize: 22, fontWeight: 800, letterSpacing: '.18em', color: '#8A6A1F'}}>INTIMAÇÃO</div>
        {[0.9, 0.75, 0.85, 0.5].map((x, i) => <div key={i} style={{height: 10, width: `${x * 100}%`, background: '#C9C8C2', borderRadius: 5, marginTop: 14}} />)}
      </div>
      {/* bolso da frente */}
      <svg width={w} height={h} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <path d={`M4 ${h * 0.34} L${w / 2} ${h * 0.64} L${w - 4} ${h * 0.34} L${w - 4} ${h - 12} Q${w - 4} ${h - 4} ${w - 12} ${h - 4} L12 ${h - 4} Q4 ${h - 4} 4 ${h - 12} Z`}
          fill="#111114" stroke={C.white} strokeWidth={4} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export const S4: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const int = wf(sc, 'intimado');
  const open = ease(f, 4, 16);
  const doc = ease(f, 12, 30);
  return (
    <AbsoluteFill>
      <Title>
        <Reveal at={0}><H1 size={64}>QUEM NÃO APRESENTOU<br />O APARELHO</H1></Reveal>
        <Reveal at={int - 10} style={{marginTop: 14}}><H1 size={64} color={C.gold}>ESTÁ SENDO INTIMADO</H1></Reveal>
      </Title>
      <Abs x={330} y={790}><Envelope open={open} doc={doc} /></Abs>
      {/* cópias enviadas */}
      {[[-1, -0.2], [1, -0.25], [-1, 0.45], [1, 0.4]].map(([dx, dy], i) => {
        const t = ease(f, int - 8 + i * 3, int + 18 + i * 3);
        if (t <= 0) return null;
        return (
          <Abs key={i} x={490 + dx * 370 * t} y={900 + dy * 300 * t} style={{opacity: Math.min(1, t * 3) * (1 - Math.max(0, t - 0.8) * 2), transform: `scale(${0.4 + 0.1 * t})`, transformOrigin: 'left top'}}>
            <Icon name="mail" size={200} color={C.gold} stroke={1.2} />
          </Abs>
        );
      })}
    </AbsoluteFill>
  );
};

// ================================================================== 5 · comparecimento

const Field: React.FC<{at: number; icon: string; label: string}> = ({at, icon, label}) => {
  const f = useCurrentFrame();
  const t = ease(f, at, at + 10);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '14px 18px', borderRadius: 8, background: t > 0 ? `rgba(201,164,76,${0.14 * t})` : 'transparent', border: `2px solid rgba(201,164,76,${0.2 + 0.8 * t})`, marginTop: 14}}>
      <Icon name={icon} size={52} color={t > 0.5 ? C.gold : C.white} stroke={1.5} />
      <div style={{fontSize: 30, fontWeight: 800, letterSpacing: '.1em', color: C.white, width: 190}}>{label}</div>
      <div style={{flex: 1, height: 12, borderRadius: 6, background: t > 0.5 ? C.gold : '#2C2C30', opacity: 0.8}} />
    </div>
  );
};

export const S5: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const comp = wf(sc, 'compareca');
  const und = wf(sc, 'unidade');
  const data = wf(sc, 'data');
  const hor = wf(sc, 'horario');
  const leve = wf(sc, 'leve');
  const cel = wf(sc, 'celular');
  const d = soft(f, 0);
  // percurso até a unidade
  const route = ease(f, leve - 2, cel + 26);
  return (
    <AbsoluteFill>
      <Title top={290}>
        <Reveal at={0}><Label size={30}>RECEBEU A INTIMAÇÃO?</Label></Reveal>
        <Reveal at={comp} style={{marginTop: 14}}><H1 size={78}>COMPAREÇA</H1></Reveal>
      </Title>
      {/* a intimação em destaque */}
      <div style={{position: 'absolute', left: 120, right: 120, top: 520, borderRadius: 12, background: C.panel, border: `1px solid ${C.line}`, padding: '22px 26px 26px', fontFamily: FONT,
        opacity: d, transform: `translateY(${(1 - d) * 30}px)`}}>
        <div style={{fontSize: 22, fontWeight: 800, letterSpacing: '.2em', color: C.gold}}>INTIMAÇÃO</div>
        <Field at={und} icon="pin" label="UNIDADE" />
        <Field at={data} icon="calendar" label="DATA" />
        <Field at={hor} icon="clock" label="HORÁRIO" />
        <div style={{marginTop: 20, fontSize: 26, fontWeight: 700, lineHeight: 1.3, color: C.white, textAlign: 'center', opacity: ease(f, hor + 8, hor + 18)}}>UNIDADE, DATA E HORÁRIO<br />INDICADOS NA INTIMAÇÃO</div>
      </div>
      {/* levar o celular até a unidade */}
      <FullSvg><DashLine x1={200} y1={1150} x2={800} y2={1150} p={ease(f, leve - 6, leve + 8)} color={C.gray} width={3} /></FullSvg>
      {f >= leve - 4 && (
        <Abs x={160 + 600 * route} y={1090} style={{opacity: ease(f, leve - 4, leve + 4)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}><Icon name="phone" size={92} color={C.gold} stroke={1.5} /></div>
        </Abs>
      )}
      <Unit x={820} y={1060} at={leve - 6} size={120} label={false} />
      {f >= leve && <Abs x={200} y={1180} style={{fontFamily: FONT, fontSize: 26, fontWeight: 800, letterSpacing: '.12em', color: C.gold, opacity: ease(f, leve, leve + 8)}}>LEVE O CELULAR</Abs>}
      <Sfx at={und} name="tick" volume={0.08} /><Sfx at={data} name="tick" volume={0.08} /><Sfx at={hor} name="tick" volume={0.08} />
    </AbsoluteFill>
  );
};

// ================================================================== 6 · conforme as circunstâncias (balança)

export const S6: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  // balança que oscila e se assenta em equilíbrio
  const ang = 9 * Math.sin(f / 9) * Math.exp(-f / 50);
  const cx = 540, cy = 760, arm = 250;
  const lx = cx - arm * Math.cos(ang * Math.PI / 180), ly = cy - arm * Math.sin(ang * Math.PI / 180);
  const rx = cx + arm * Math.cos(ang * Math.PI / 180), ry = cy + arm * Math.sin(ang * Math.PI / 180);
  const pan = (x: number, y: number) => `M${x - 90} ${y + 150} Q${x} ${y + 210} ${x + 90} ${y + 150} Z`;
  return (
    <AbsoluteFill>
      <Title top={300}>
        <Reveal at={0}><div style={{display: 'inline-block', fontSize: 50, fontWeight: 800, color: C.gold, letterSpacing: '.05em', border: `3px solid ${C.gold}`, padding: '16px 26px', borderRadius: 8, lineHeight: 1.1}}>CONFORME AS<br />CIRCUNSTÂNCIAS</div></Reveal>
      </Title>
      <FullSvg>
        <Draw d={`M${cx} ${cy - 20} L${cx} ${cy + 330}`} at={0} dur={12} width={5} />
        <Draw d={`M${cx - 120} ${cy + 330} L${cx + 120} ${cy + 330}`} at={6} dur={10} width={5} />
        <circle cx={cx} cy={cy - 28} r={14} fill={C.gold} opacity={ease(f, 4, 10)} />
        <g opacity={ease(f, 4, 14)}>
          <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={C.white} strokeWidth={5} strokeLinecap="round" />
          {[[lx, ly], [rx, ry]].map(([x, y], i) => (
            <g key={i}>
              <line x1={x} y1={y} x2={x - 85} y2={y + 150} stroke={C.gray} strokeWidth={2} />
              <line x1={x} y1={y} x2={x + 85} y2={y + 150} stroke={C.gray} strokeWidth={2} />
              <path d={pan(x, y)} fill="none" stroke={C.white} strokeWidth={4} />
              <g transform={`translate(${x - 34} ${y + 82}) scale(2.8)`} opacity={ease(f, 10 + i * 6, 22 + i * 6)}>
                {i === 0
                  ? <><rect x="6" y="2" width="12" height="20" rx="2.5" fill="none" stroke={C.gold} strokeWidth={1.3} /><path d="M10.5 18.5h3" stroke={C.gold} strokeWidth={1.3} /></>
                  : <><path d="M6 2h9l4 4v16H6z" fill="none" stroke={C.gold} strokeWidth={1.3} /><path d="M9 11h7M9 15h7" stroke={C.gold} strokeWidth={1.3} /></>}
              </g>
            </g>
          ))}
        </g>
      </FullSvg>
    </AbsoluteFill>
  );
};

// ================================================================== 7 · sem links, sem pedido de dados

const Strike: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const p = drawP(f, at, 8);
  return p > 0 ? <div style={{position: 'absolute', left: -8, right: -8, top: '50%', height: 5, background: C.gold, transformOrigin: 'left center', transform: `scaleX(${p}) rotate(-4deg)`}} /> : null;
};

export const S7: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const msgs = wf(sc, 'mensagens');
  const links = wf(sc, 'links');
  const ped = wf(sc, 'pedem');
  const dados = wf(sc, 'dados');
  const l = soft(f, links - 8);
  const fm = soft(f, ped - 6);
  return (
    <AbsoluteFill>
      <Title top={290}>
        <Reveal at={0} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12}}><Icon name="alert" size={42} color={C.gold} stroke={1.8} /><Label size={32}>ATENÇÃO</Label></Reveal>
        <Reveal at={msgs} style={{marginTop: 20}}><div style={{display: 'inline-block', fontSize: 34, fontWeight: 800, lineHeight: 1.25, border: `2px solid ${C.gold}`, padding: '12px 22px', borderRadius: 8}}>SEM LINKS • SEM SOLICITAÇÃO DE DADOS</div></Reveal>
      </Title>
      <Phone x={300} y={560} w={480} h={640}>
        <div style={{position: 'absolute', top: 70, left: 24, right: 24, fontFamily: FONT}}>
          <div style={{fontSize: 18, fontWeight: 800, letterSpacing: '.12em', color: C.gray, textAlign: 'center'}}>MENSAGEM DA OPERAÇÃO</div>
          <div style={{marginTop: 18, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 18, padding: 18, opacity: ease(f, msgs - 4, msgs + 6)}}>
            {[0.95, 0.85, 0.6].map((w, i) => <div key={i} style={{height: 12, width: `${w * 100}%`, borderRadius: 6, background: '#2C2C30', marginTop: i ? 10 : 0}} />)}
          </div>
          {/* link: aparece e é riscado */}
          <div style={{position: 'relative', marginTop: 26, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, border: `2px dashed ${C.gray}`, opacity: l, transform: `scale(${0.9 + 0.1 * l})`}}>
            <Icon name="link" size={40} color={C.gray} stroke={1.8} />
            <div style={{fontSize: 24, color: C.gray, fontWeight: 600}}>link</div>
            <Strike at={links + 2} />
          </div>
          {/* formulário de dados: aparece e é riscado */}
          <div style={{position: 'relative', marginTop: 20, padding: '14px 16px', borderRadius: 12, border: `2px dashed ${C.gray}`, opacity: fm, transform: `scale(${0.9 + 0.1 * fm})`}}>
            {['seus dados', 'senha'].map((t) => (
              <div key={t} style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 6}}>
                <div style={{fontSize: 22, color: C.gray, width: 120}}>{t}</div><div style={{flex: 1, height: 30, borderRadius: 6, border: `2px solid #3A3A40`}} />
              </div>
            ))}
            <Strike at={dados + 4} />
          </div>
        </div>
      </Phone>
      <Sfx at={links + 2} name="tick" volume={0.08} /><Sfx at={dados + 4} name="tick" volume={0.08} />
    </AbsoluteFill>
  );
};

// ================================================================== 8 · compareça e apresente

export const S8: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const comp = wf(sc, 'compareca');
  const apr = wf(sc, 'apresente');
  const apa = wf(sc, 'aparelho');
  const move = ease(f, apr - 6, apa + 4);
  const ok = soft(f, apa + 6);
  return (
    <AbsoluteFill>
      <Title>
        <Reveal at={0}><Label color={C.gray} size={34}>NÃO ADIE</Label></Reveal>
        <Reveal at={comp} style={{marginTop: 18}}><H1 size={70}>COMPAREÇA E APRESENTE<br />O APARELHO</H1></Reveal>
      </Title>
      {/* balcão de atendimento */}
      <FullSvg>
        <Draw d="M170 1060 L910 1060" at={0} dur={14} width={5} />
        <Draw d="M240 1060 L240 1180 M840 1060 L840 1180" at={6} dur={10} width={4} />
        <Draw d="M380 660 L380 1060 M700 660 L700 1060 M330 660 L750 660" at={4} dur={16} width={3} color={C.dim} />
      </FullSvg>
      <Unit x={480} y={690} at={4} size={120} label={false} />
      <Abs x={140 + 330 * move} y={940 + 0 * move} style={{opacity: ease(f, 0, 8)}}><Icon name="phone" size={110} color={C.white} stroke={1.4} /></Abs>
      <Abs x={600} y={920} style={{opacity: ok, transform: `scale(${0.6 + 0.4 * ok})`}}><Icon name="check" size={110} color={C.gold} stroke={1.6} /></Abs>
    </AbsoluteFill>
  );
};

// ================================================================== 9 · assinatura

export const S9: React.FC<P> = () => (
  <AbsoluteFill>
    <Title top={500}>
      <div style={{fontSize: 52, fontWeight: 800, lineHeight: 1.1, color: C.gray, opacity: 0.85}}>COMPAREÇA E APRESENTE<br />O APARELHO</div>
      <Hairline at={2} width={260} style={{marginTop: 70, marginBottom: 46}} />
      <Reveal at={2}><div style={{fontSize: 70, fontWeight: 800, letterSpacing: '.08em', color: C.white}}>POLÍCIA CIVIL<br />DA BAHIA</div></Reveal>
      <Hairline at={8} width={260} style={{marginTop: 46}} />
    </Title>
  </AbsoluteFill>
);

export const SCENES: Record<string, React.FC<P>> = {s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8, s9: S9};
