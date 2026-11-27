import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {AIIcon, Bell, Bubble, Delegado, FamilySofa, Ico, LawDoc, Lock, Magnifier, Phone, Scale, SearchBar, ShieldHeart, TeenBack} from './art';
import {C, CX, FONT, Headline, Reveal, SAFE, Scene, Sfx, clamp, ease, floatY, sceneLen, soft, wf} from './lib';

type P = {sc: Scene};
const Abs: React.FC<{x: number; y: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, y, children, style}) => (
  <div style={{position: 'absolute', left: x, top: y, ...style}}>{children}</div>
);
/** janela de visibilidade com fade (entra em a, sai em b) */
const win = (f: number, a: number, b = 1e9, d = 8) => Math.min(ease(f, a, a + d), 1 - ease(f, b - d, b));

const Chip: React.FC<{children: React.ReactNode; tone?: 'amber' | 'sky' | 'white'; size?: number}> = ({children, tone = 'amber', size = 30}) => {
  const t = {amber: {background: C.amber, color: C.navy}, sky: {background: C.sky, color: C.navy}, white: {background: C.white, color: C.navy}}[tone];
  return <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: '.04em', padding: `${size * 0.35}px ${size * 0.7}px`, borderRadius: 999, boxShadow: '0 10px 30px rgba(0,0,0,.25)', whiteSpace: 'nowrap', ...t}}>{children}</div>;
};

/** Cartão de alerta genérico, sempre com a etiqueta ILUSTRAÇÃO */
const AlertCard: React.FC<{w?: number}> = ({w = 420}) => (
  <div style={{width: w, borderRadius: 22, background: C.white, padding: '20px 22px', boxShadow: '0 20px 50px rgba(0,0,0,.35)', fontFamily: FONT, position: 'relative'}}>
    <div style={{position: 'absolute', top: -16, right: 16}}><Chip tone="sky" size={18}>ILUSTRAÇÃO</Chip></div>
    <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
      <div style={{width: 56, height: 56, borderRadius: 16, background: C.navy, display: 'grid', placeItems: 'center'}}><Bell size={38} /></div>
      <div style={{fontSize: 24, fontWeight: 900, color: C.navy, letterSpacing: '.06em'}}>ALERTA</div>
    </div>
    {[0.95, 0.7].map((x, i) => <div key={i} style={{height: 12, width: `${x * 100}%`, borderRadius: 6, background: '#C4D3E4', marginTop: i ? 10 : 16, filter: 'blur(1.5px)'}} />)}
  </div>
);

const TapPulse: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const t = ((f - at) % 30) / 30;
  return (
    <>
      <div style={{position: 'absolute', left: x - 34, top: y - 34, width: 68, height: 68, borderRadius: 34, background: 'rgba(245,185,66,.35)', border: `4px solid ${C.amber}`}} />
      <div style={{position: 'absolute', left: x - 34 - 40 * t, top: y - 34 - 40 * t, width: 68 + 80 * t, height: 68 + 80 * t, borderRadius: '50%', border: `4px solid ${C.amber}`, opacity: 1 - t}} />
    </>
  );
};

// ================================================================== CENA 1 · gancho

export const S1: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const alerta = wf(sc, 'alerta');
  const ajuda = wf(sc, 'ajuda');
  const mas = wf(sc, 'mas');
  const ativar = wf(sc, 'ativar');
  const sh = soft(f, ajuda - 6);
  return (
    <AbsoluteFill>
      <Headline at={0} size={54}>ESSE ALERTA SÓ FUNCIONA<br /><span style={{color: C.amber}}>SE VOCÊ ATIVAR</span></Headline>
      <Abs x={CX - 260} y={560 + floatY(f, 6)} style={{opacity: sh, transform: `scale(${0.7 + 0.3 * sh})`, transformOrigin: '50% 50%'}}>
        <ShieldHeart size={520} glow={0.4 + 0.6 * ease(f, ativar, ativar + 12)} />
      </Abs>
      <Abs x={CX - 150} y={600 + floatY(f, 8, 50)}>
        <Phone w={300} h={560} glow={ease(f, alerta, alerta + 10)}>
          <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center'}}><Bell size={150} lit={f >= alerta ? 1 : 0} /></div>
        </Phone>
      </Abs>
      {f >= mas - 6 && <Abs x={20} y={800} style={{opacity: ease(f, mas - 6, mas + 6), transform: `translateX(${ease(f, mas - 6, mas + 8, -60, 0)}px)`}}><Delegado scale={0.72} talking wave={1} /></Abs>}
      <Sfx at={alerta} name="ding" volume={0.1} />
    </AbsoluteFill>
  );
};

// ================================================================== CENA 2 · apresentação

export const S2: React.FC<P> = () => {
  const f = useCurrentFrame();
  const enter = soft(f, 0, 18, 110);
  return (
    <AbsoluteFill>
      <Headline at={2} size={56}>DELEGADO JORGE FIGUEIREDO<div style={{fontSize: 36, fontWeight: 700, color: C.amber, marginTop: 14}}>POLÍCIA CIVIL DA BAHIA</div></Headline>
      <Abs x={60} y={640} style={{transform: `translateX(${(1 - enter) * -300}px)`, opacity: enter}}><Delegado scale={1.02} talking wave={0.5} /></Abs>
      <Abs x={540} y={760 + floatY(f, 8)}><ShieldHeart size={330} glow={0.7} /></Abs>
    </AbsoluteFill>
  );
};

// ================================================================== CENA 3 · como funciona

export const S3: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const pesq = wf(sc, 'pesquisar');
  const auto = wf(sc, 'automutilacao');
  const conv = wf(sc, 'conversa');
  const risco = wf(sc, 'risco');
  const brasil = wf(sc, 'brasil');
  const aEnd = auto + 14; // fim da fase das buscas
  const bars = [pesq, wf(sc, 'varias'), wf(sc, 'pouco'), wf(sc, 'termos')];
  const magX = interpolate(f, [pesq, auto], [0, 300], clamp);
  return (
    <AbsoluteFill>
      {/* fase A: buscas repetidas */}
      <AbsoluteFill style={{opacity: win(f, 0, aEnd + 20)}}>
        <Headline at={pesq} size={64}>BUSCAS <span style={{color: C.amber}}>REPETIDAS</span></Headline>
        <Abs x={40} y={760}><TeenBack /></Abs>
        {bars.map((at, i) => (
          <Abs key={i} x={380} y={560 + i * 108} style={{opacity: ease(f, at, at + 8), transform: `translateX(${ease(f, at, at + 10, 40, 0)}px) scale(${0.92 + 0.02 * i})`, transformOrigin: 'left center'}}>
            <SearchBar w={520} blurW={0.55 + 0.1 * (i % 3)} />
          </Abs>
        ))}
        <Abs x={560 + magX} y={520 + floatY(f, 10, 30)} style={{opacity: ease(f, pesq, pesq + 8)}}><Magnifier size={130} /></Abs>
      </AbsoluteFill>
      {/* fase B: o celular do responsável recebe o alerta */}
      <AbsoluteFill style={{opacity: win(f, aEnd, conv - 4)}}>
        <Headline at={aEnd} size={58}>O RESPONSÁVEL<br /><span style={{color: C.amber}}>RECEBE UM ALERTA</span></Headline>
        <Abs x={CX - 150} y={600 + floatY(f, 6)}><Phone w={300} h={560} glow={1}>
          <div style={{position: 'absolute', top: 90, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - soft(f, aEnd + 6)) * -80}px)`, opacity: soft(f, aEnd + 6)}}><AlertCard w={250} /></div>
        </Phone></Abs>
      </AbsoluteFill>
      {/* fase C: conversas com a IA */}
      <AbsoluteFill style={{opacity: win(f, conv - 4)}}>
        <Headline at={conv - 4} size={64}>CONVERSAS <span style={{color: C.amber}}>COM A IA</span></Headline>
        <Reveal at={conv} dx={-40} dy={0} style={{position: 'absolute', left: 80, top: 600}}><Bubble w={420} side="r" tone={C.skySoft} lines={2} /></Reveal>
        <Reveal at={conv + 12} dx={40} dy={0} style={{position: 'absolute', left: 300, top: 760}}><Bubble w={420} side="l" lines={3} /></Reveal>
        <Abs x={110} y={760 + floatY(f, 8)} style={{opacity: ease(f, conv + 8, conv + 18)}}><AIIcon size={140} /></Abs>
        <Abs x={CX - 210} y={960} style={{opacity: soft(f, risco), transform: `scale(${0.85 + 0.15 * soft(f, risco)})`}}><AlertCard w={420} /></Abs>
        <Abs x={CX - 230} y={1160} style={{opacity: ease(f, brasil - 4, brasil + 6)}}><Chip>✓ JÁ FUNCIONA NO BRASIL</Chip></Abs>
      </AbsoluteFill>
      <Sfx at={aEnd + 6} name="ding" volume={0.08} /><Sfx at={risco} name="ding" volume={0.08} />
    </AbsoluteFill>
  );
};

// ================================================================== CENA 4 · privacidade e canais

const CHANNELS = [{k: 'aplicativo', icon: 'app', label: 'App'}, {k: 'email', icon: 'mail', label: 'E-mail'}, {k: 'sms', icon: 'sms', label: 'SMS'}, {k: 'whatsapp', icon: 'chat', label: 'WhatsApp'}];

export const S4: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const nao = wf(sc, 'nao');
  const msg = wf(sc, 'mensagens');
  const rec = wf(sc, 'recebe');
  const cont = wf(sc, 'contatos');
  const close = ease(f, nao, msg + 6);
  const lockIn = soft(f, msg + 4);
  const shrink = ease(f, rec - 4, rec + 12);
  return (
    <AbsoluteFill>
      <Headline at={wf(sc, 'voce')} size={60}>VOCÊ <span style={{color: C.amber}}>NÃO LÊ</span><br />AS MENSAGENS</Headline>
      {/* balões que se fecham + cadeado */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translate(${-250 * shrink}px, ${-110 * shrink}px) scale(${1 - 0.45 * shrink})`, transformOrigin: `${CX}px 760px`}}>
        {[0, 1, 2].map((i) => (
          <Abs key={i} x={CX - 220 + (i - 1) * 40 * (1 - close)} y={590 + i * (130 - 90 * close)} style={{opacity: 1 - 0.3 * close}}>
            <Bubble w={440} side={i % 2 ? 'r' : 'l'} tone={i % 2 ? C.skySoft : C.white} lines={2} />
          </Abs>
        ))}
        <Abs x={CX - 75} y={interpolate(lockIn, [0, 1], [460, 640])} style={{opacity: Math.min(1, lockIn * 2)}}><Lock size={150} closed={lockIn} /></Abs>
      </div>
      {/* alerta + canais */}
      <Abs x={CX - 30} y={560} style={{opacity: ease(f, wf(sc, 'alerta'), wf(sc, 'alerta') + 8)}}><AlertCard w={400} /></Abs>
      <div style={{position: 'absolute', left: SAFE.left, width: SAFE.right - SAFE.left, top: 880, display: 'flex', justifyContent: 'center', gap: 26}}>
        {CHANNELS.map((c) => {
          const at = wf(sc, c.k);
          const t = soft(f, at);
          return (
            <div key={c.k} style={{width: 180, textAlign: 'center', opacity: Math.min(1, t * 1.5), transform: `translateY(${(1 - t) * 30}px)`, fontFamily: FONT}}>
              <div style={{width: 150, height: 150, margin: '0 auto', borderRadius: 36, background: C.navy3, border: `3px solid ${C.sky}`, display: 'grid', placeItems: 'center', transform: `translateY(${floatY(f, 4, 30, at)}px)`}}><Ico name={c.icon} size={82} /></div>
              <div style={{fontSize: 30, fontWeight: 800, color: C.white, marginTop: 12}}>{c.label}</div>
            </div>
          );
        })}
      </div>
      <Abs x={CX - 260} y={1150} style={{opacity: ease(f, cont, cont + 8)}}><Chip>✓ CONTATOS ATUALIZADOS</Chip></Abs>
    </AbsoluteFill>
  );
};

// ================================================================== CENA 5 · autoridade legal

export const S5: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const eca = wf(sc, 'eca');
  const vamos = wf(sc, 'vamos');
  return (
    <AbsoluteFill>
      <Headline at={eca} size={64}>ECA DIGITAL<div style={{fontSize: 44, color: C.amber, marginTop: 10}}>LEI 15.211/2025</div></Headline>
      <Abs x={70} y={640}><Scale size={380} /></Abs>
      <Abs x={560} y={640 + floatY(f, 8)}><Reveal at={4}><LawDoc w={270} /></Reveal></Abs>
      <Abs x={CX - 150} y={1130} style={{opacity: ease(f, vamos, vamos + 8)}}><Chip tone="sky">VAMOS LÁ →</Chip></Abs>
    </AbsoluteFill>
  );
};

// ================================================================== CENA 6 · passo a passo (celular genérico)

const PW = 380, PH = 740, PX = CX - PW / 2, PY = 500;

const StepHead: React.FC<{n: number; label: React.ReactNode; at: number}> = ({n, label, at}) => {
  const f = useCurrentFrame();
  const b = soft(f, 0, 14, 160);
  return (
    <div style={{position: 'absolute', left: SAFE.left, width: SAFE.right - SAFE.left, top: 300, display: 'flex', alignItems: 'center', gap: 24, fontFamily: FONT}}>
      <div style={{width: 130, height: 130, borderRadius: 65, background: C.amber, color: C.navy, display: 'grid', placeItems: 'center', fontSize: 84, fontWeight: 900, flex: 'none', transform: `scale(${b})`, boxShadow: `0 0 40px rgba(245,185,66,.5)`}}>{n}</div>
      <Reveal at={at} dx={30} dy={0}><div style={{fontSize: 52, fontWeight: 900, color: C.white, lineHeight: 1.1}}>{label}</div></Reveal>
    </div>
  );
};

const Row: React.FC<{hl?: number; text?: string; icon?: string}> = ({hl = 0, text, icon = 'user'}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 14, background: hl ? `rgba(245,185,66,${0.25 * hl})` : 'transparent', border: `3px solid rgba(245,185,66,${hl})`, marginTop: 8}}>
    <div style={{width: 40, height: 40, borderRadius: 12, background: '#24507F', display: 'grid', placeItems: 'center'}}><Ico name={icon} size={26} color={C.skySoft} /></div>
    {text ? <div style={{fontFamily: FONT, fontSize: 24, fontWeight: 800, color: C.white}}>{text}</div> : <div style={{height: 14, width: '60%', borderRadius: 7, background: '#2E5C8F'}} />}
  </div>
);

const TopBar: React.FC<{menu?: boolean}> = ({menu}) => (
  <div style={{display: 'flex', alignItems: 'center', padding: '46px 18px 10px'}}>
    <div style={{height: 16, width: 120, borderRadius: 8, background: '#2E5C8F'}} />
    {menu && <div style={{marginLeft: 'auto'}}><Ico name="menu" size={40} color={C.white} stroke={2.4} /></div>}
  </div>
);

export const P1: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const per = wf(sc, 'perfil');
  return (
    <AbsoluteFill>
      <StepHead n={1} label="PERFIL" at={per} />
      <Abs x={PX} y={PY}><Phone w={PW} h={PH}>
        <TopBar />
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: 14}}>{Array.from({length: 4}).map((_, i) => <div key={i} style={{height: 170, borderRadius: 14, background: '#24507F'}} />)}</div>
        <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 92, background: '#0F2A4C', display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
          {['home', 'search', 'plus', 'play'].map((n) => <Ico key={n} name={n} size={34} color={C.skySoft} />)}
          <div style={{width: 44, height: 44, borderRadius: 22, background: C.skySoft, border: `3px solid ${f >= per ? C.amber : C.skySoft}`}} />
        </div>
      </Phone></Abs>
      <TapPulse x={PX + PW - 54} y={PY + PH - 56} at={per} />
      <Sfx at={per} name="tick" volume={0.1} />
    </AbsoluteFill>
  );
};

export const P2: React.FC<P> = ({sc}) => {
  const tres = wf(sc, 'tres');
  return (
    <AbsoluteFill>
      <StepHead n={2} label={<>MENU ☰<div style={{fontSize: 32, fontWeight: 700, color: C.amber, marginTop: 6}}>(canto superior direito)</div></>} at={tres} />
      <Abs x={PX} y={PY}><Phone w={PW} h={PH}>
        <TopBar menu />
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '16px 22px'}}>
          <div style={{width: 110, height: 110, borderRadius: 55, background: C.skySoft}} />
          <div style={{flex: 1}}>{[0.9, 0.6].map((x, i) => <div key={i} style={{height: 14, width: `${x * 100}%`, borderRadius: 7, background: '#2E5C8F', marginTop: i ? 12 : 0}} />)}</div>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, padding: 12}}>{Array.from({length: 9}).map((_, i) => <div key={i} style={{height: 104, background: '#24507F', borderRadius: 6}} />)}</div>
      </Phone></Abs>
      <TapPulse x={PX + PW - 48} y={PY + 74} at={tres} />
      <Sfx at={tres} name="tick" volume={0.1} />
    </AbsoluteFill>
  );
};

export const P3: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const fam = wf(sc, 'familias');
  const sup = wf(sc, 'supervisao');
  const slide = ease(f, sup - 8, sup + 4);
  return (
    <AbsoluteFill>
      <StepHead n={3} label={<>PARA FAMÍLIAS ›<br />SUPERVISÃO</>} at={fam} />
      <Abs x={PX} y={PY}><Phone w={PW} h={PH}>
        <div style={{position: 'absolute', inset: 0, transform: `translateX(${-PW * slide}px)`}}>
          <TopBar />
          <div style={{padding: 12}}>
            <Row /><Row /><Row hl={ease(f, fam - 4, fam + 6)} text="Para famílias" icon="user" /><Row /><Row /><Row />
          </div>
        </div>
        <div style={{position: 'absolute', inset: 0, transform: `translateX(${PW * (1 - slide)}px)`}}>
          <TopBar />
          <div style={{padding: 12}}><Row hl={ease(f, sup, sup + 8)} text="Supervisão" icon="check" /><Row /><Row /></div>
        </div>
      </Phone></Abs>
      <TapPulse x={PX + 120} y={PY + 330} at={fam} />
    </AbsoluteFill>
  );
};

export const P4: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const criar = wf(sc, 'criar');
  const esc = wf(sc, 'escolha');
  const seg = wf(sc, 'seguir');
  const list = ease(f, esc - 4, esc + 8);
  return (
    <AbsoluteFill>
      <StepHead n={4} label="CRIAR CONVITE" at={criar} />
      <Abs x={PX} y={PY}><Phone w={PW} h={PH}>
        <TopBar />
        <div style={{padding: '30px 22px', opacity: 1 - list}}>
          <div style={{display: 'grid', placeItems: 'center', marginTop: 40}}><ShieldHeart size={150} glow={0.4} /></div>
          <div style={{marginTop: 40, height: 74, borderRadius: 37, background: C.amber, display: 'grid', placeItems: 'center', fontFamily: FONT, fontSize: 28, fontWeight: 900, color: C.navy, transform: `scale(${f >= criar && f < criar + 8 ? 0.95 : 1})`}}>Criar convite</div>
        </div>
        <div style={{position: 'absolute', top: 90, left: 12, right: 12, opacity: list}}>
          <Row /><Row hl={ease(f, esc + 6, esc + 16)} text="Conta do seu filho" icon="user" /><Row />
          {f >= seg && <div style={{marginTop: 18, display: 'flex', justifyContent: 'center', opacity: ease(f, seg, seg + 8)}}><Chip tone="sky" size={22}>✓ VOCÊ SEGUE ESSA CONTA</Chip></div>}
        </div>
      </Phone></Abs>
      {f < esc - 2 && <TapPulse x={CX} y={PY + 470} at={criar} />}
      {f >= esc + 6 && <TapPulse x={PX + 120} y={PY + 200} at={esc + 6} />}
    </AbsoluteFill>
  );
};

export const P5: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const sup = wf(sc, 'supervisionada');
  const pend = wf(sc, 'pendente');
  const ok = soft(f, sup);
  return (
    <AbsoluteFill>
      <StepHead n={5} label={<>CONTA<br />SUPERVISIONADA ✓</>} at={sup} />
      <Abs x={PX} y={PY}><Phone w={PW} h={PH}>
        <TopBar />
        <div style={{padding: 14}}>
          <Row hl={ok} text="Conta do seu filho" icon="user" />
          <div style={{display: 'flex', justifyContent: 'center', marginTop: 16, opacity: ok, transform: `scale(${0.8 + 0.2 * ok})`}}><Chip size={22}>✓ SUPERVISIONADA</Chip></div>
          <div style={{display: 'grid', placeItems: 'center', marginTop: 40}}><ShieldHeart size={200} glow={0.3 + 0.9 * ok} lit={0.2 + 0.8 * ok} /></div>
        </div>
      </Phone></Abs>
      <Abs x={CX - 300} y={1150} style={{opacity: ease(f, pend, pend + 8)}}><Chip tone="white" size={26}>PENDENTE? PEÇA PARA ELE ACEITAR</Chip></Abs>
      <Sfx at={sup} name="success" volume={0.14} />
    </AbsoluteFill>
  );
};

// ================================================================== CENA 7 · aviso

export const S7: React.FC<P> = () => (
  <AbsoluteFill>
    <div style={{position: 'absolute', left: SAFE.left + 40, width: SAFE.right - SAFE.left - 80, top: 700, textAlign: 'center', fontFamily: FONT}}>
      <Reveal at={0}><Ico name="info" size={110} color={C.sky} stroke={1.6} /></Reveal>
      <Reveal at={4}><div style={{fontSize: 42, fontWeight: 700, color: C.white, lineHeight: 1.3, marginTop: 30}}>Os nomes dos menus podem variar conforme a versão do app.</div></Reveal>
    </div>
  </AbsoluteFill>
);

// ================================================================== CENA 8 · se chegar um alerta

export const S8: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const diag = wf(sc, 'diagnostico');
  const ligue = wf(sc, 'ligue');
  const conv = wf(sc, 'conversar');
  const cvv = soft(f, ligue - 4);
  return (
    <AbsoluteFill>
      <div style={{opacity: win(f, diag - 4, ligue - 2)}}><Headline at={diag - 4} size={64}>NÃO É <span style={{color: C.amber}}>DIAGNÓSTICO</span></Headline></div>
      {/* cartão CVV: aparece em “ligue” e fica até o fim da cena (bem mais de 4 s) */}
      <div style={{position: 'absolute', left: SAFE.left + 20, width: SAFE.right - SAFE.left - 40, top: 290, opacity: Math.min(1, cvv * 1.5), transform: `translateY(${(1 - cvv) * 30}px)`}}>
        <div style={{background: C.white, borderRadius: 28, padding: '26px 30px', textAlign: 'center', fontFamily: FONT, boxShadow: '0 20px 60px rgba(0,0,0,.35)', borderBottom: `10px solid ${C.amber}`}}>
          <div style={{fontSize: 80, fontWeight: 900, color: C.navy, lineHeight: 1}}>CVV – 188</div>
          <div style={{fontSize: 40, fontWeight: 700, color: C.navy3, marginTop: 12}}>gratuito, 24 horas</div>
        </div>
      </div>
      <Abs x={CX - 410} y={640 + floatY(f, 4, 60)}><FamilySofa heart={0.6 + 0.4 * ease(f, conv, conv + 14)} /></Abs>
    </AbsoluteFill>
  );
};

// ================================================================== CENA 9 · encerramento

export const S9: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const salve = wf(sc, 'salve');
  const mande = wf(sc, 'mande');
  const len = sceneLen(sc);
  const beats = ['CONVERSE.', 'ESCUTE.', 'ACOLHA.'];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: SAFE.left, width: SAFE.right - SAFE.left, top: 290, textAlign: 'center', fontFamily: FONT}}>
        {beats.map((b, i) => <Reveal key={b} at={i * 14}><div style={{fontSize: 62, fontWeight: 900, lineHeight: 1.12, color: i === 2 ? C.amber : C.white}}>{b}</div></Reveal>)}
      </div>
      <Abs x={50} y={640} style={{opacity: ease(f, 6, 16)}}><Delegado scale={0.95} talking={f < len - 40} wave={0.4} /></Abs>
      <Abs x={560} y={680 + floatY(f, 8)}><ShieldHeart size={280} glow={0.9} /></Abs>
      <div style={{position: 'absolute', left: 560, top: 1040, display: 'flex', gap: 30}}>
        <Reveal at={salve}><div style={{width: 110, height: 110, borderRadius: 30, background: C.navy3, border: `3px solid ${C.amber}`, display: 'grid', placeItems: 'center'}}><Ico name="bookmark" size={60} color={C.amber} /></div></Reveal>
        <Reveal at={mande}><div style={{width: 110, height: 110, borderRadius: 30, background: C.navy3, border: `3px solid ${C.amber}`, display: 'grid', placeItems: 'center'}}><Ico name="send" size={60} color={C.amber} /></div></Reveal>
      </div>
      <Abs x={CX - 260} y={1180} style={{opacity: ease(f, mande + 6, mande + 16)}}>
        <div style={{width: 520, textAlign: 'center', fontFamily: FONT, fontSize: 40, fontWeight: 900, color: C.white}}>@delegadojorgefigueiredo</div>
      </Abs>
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC<P>> = {s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, p1: P1, p2: P2, p3: P3, p4: P4, p5: P5, s7: S7, s8: S8, s9: S9};
