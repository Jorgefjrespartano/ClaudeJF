import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, Hairline, Icon, Reveal, Scene, Sfx, clamp, ease, sceneLen, soft, wf} from './lib';

type P = {sc: Scene};

// área dos destaques: entre o topo seguro (260) e o início das legendas (1250)
const Stack: React.FC<{children: React.ReactNode; top?: number}> = ({children, top = 330}) => (
  <div style={{position: 'absolute', left: 90, right: 90, top, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', fontFamily: FONT, color: C.white}}>
    {children}
  </div>
);

const Headline: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 84, color = C.white}) => (
  <div style={{fontSize: size, fontWeight: 800, lineHeight: 1.06, letterSpacing: '-.01em', color}}>{children}</div>
);

// ------------------------------------------------------------------ 1 · abertura: a mensagem

const PhoneArt: React.FC<{f: number; msgAt: number}> = ({f, msgAt}) => {
  const m = soft(f, msgAt);
  return (
    <div style={{position: 'relative', width: 360, height: 590, borderRadius: 52, border: `4px solid ${C.white}`, background: '#0E0E10'}}>
      <div style={{position: 'absolute', top: 18, left: 140, width: 80, height: 22, borderRadius: 11, background: '#1E1E21'}} />
      <div style={{position: 'absolute', top: 110, left: 20, right: 20, borderRadius: 22, background: C.panel, border: `1px solid ${C.line}`, padding: 20,
        opacity: m, transform: `translateY(${(1 - m) * -40}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <div style={{width: 46, height: 46, borderRadius: 12, background: '#232326', display: 'grid', placeItems: 'center'}}><Icon name="mail" size={28} color={C.gold} stroke={1.8} /></div>
          <div style={{fontFamily: FONT, fontSize: 20, fontWeight: 700, color: C.white, letterSpacing: '.08em'}}>NOVA MENSAGEM</div>
        </div>
        {[0.95, 0.8, 0.6].map((w, i) => <div key={i} style={{height: 14, width: `${w * 100}%`, borderRadius: 7, background: '#2C2C30', marginTop: i ? 12 : 20}} />)}
      </div>
    </div>
  );
};

export const S1: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Stack top={300}>
        <Reveal at={0} dy={10}><Headline>RECEBEU UMA<br />MENSAGEM?</Headline></Reveal>
        <Hairline at={6} width={180} style={{marginTop: 30}} />
      </Stack>
      <div style={{position: 'absolute', left: 360, top: 590}}><PhoneArt f={f} msgAt={wf(sc, 'mensagem')} /></div>
      <Sfx at={wf(sc, 'mensagem')} name="ding" volume={0.12} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ 2 · “Sabe o que acontece agora?” (aproximação)

export const S2: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const len = sceneLen(sc);
  // aproximação discreta só no celular; o título fica fixo dentro da área segura
  const z = interpolate(f, [0, len], [1, 1.12], {...clamp, easing: (x) => x * (2 - x)});
  return (
    <AbsoluteFill>
      <Stack top={300}>
        <Reveal at={0} dy={10}><Headline size={76}>SABE O QUE<br />ACONTECE AGORA?</Headline></Reveal>
      </Stack>
      <div style={{position: 'absolute', left: 360, top: 590, transform: `scale(${z})`, transformOrigin: '50% 100%'}}><PhoneArt f={60} msgAt={0} /></div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ 3 · título da operação

export const S3: React.FC<P> = ({sc}) => {
  const tit = wf(sc, 'intimacoes');
  const sub = wf(sc, 'fase');
  return (
    <AbsoluteFill>
      <Stack top={430}>
        <Reveal at={0}><div style={{fontSize: 30, fontWeight: 700, letterSpacing: '.22em', color: C.gray}}>POLÍCIA CIVIL DA BAHIA</div></Reveal>
        <Hairline at={tit - 6} width={220} style={{marginTop: 46, marginBottom: 46}} />
        <Reveal at={tit}><Headline size={118}>INTIMAÇÕES<br />MOBILE</Headline></Reveal>
        <Reveal at={sub} style={{marginTop: 40}}><div style={{fontSize: 42, fontWeight: 600, color: C.gold}}>Operação Mobile 360 | 10ª edição</div></Reveal>
      </Stack>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ 4 · quem não apresentou está sendo intimado

export const S4: React.FC<P> = ({sc}) => {
  const intim = wf(sc, 'intimado');
  return (
    <AbsoluteFill>
      <Stack top={380}>
        <Reveal at={0}><Icon name="doc" size={190} color={C.white} stroke={1.1} /></Reveal>
        <Reveal at={2} style={{marginTop: 60}}><Headline size={70}>QUEM NÃO APRESENTOU<br />O APARELHO</Headline></Reveal>
        <Reveal at={intim - 8} style={{marginTop: 22}}><Headline size={70} color={C.gold}>ESTÁ SENDO INTIMADO</Headline></Reveal>
      </Stack>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ 5 · comparecimento

const Item: React.FC<{at: number; icon: string; label: string}> = ({at, icon, label}) => (
  <Reveal at={at} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, width: 250}}>
    <div style={{width: 150, height: 150, borderRadius: 75, border: `2px solid ${C.goldDim}`, display: 'grid', placeItems: 'center'}}><Icon name={icon} size={78} color={C.white} stroke={1.3} /></div>
    <div style={{fontSize: 30, fontWeight: 700, letterSpacing: '.14em', color: C.white}}>{label}</div>
  </Reveal>
);

export const S5: React.FC<P> = ({sc}) => {
  const comp = wf(sc, 'compareca');
  const und = wf(sc, 'unidade');
  const data = wf(sc, 'data');
  const hor = wf(sc, 'horario');
  const leve = wf(sc, 'leve');
  return (
    <AbsoluteFill>
      <Stack top={330}>
        <Reveal at={0}><div style={{fontSize: 34, fontWeight: 700, letterSpacing: '.2em', color: C.gold}}>RECEBEU A INTIMAÇÃO?</div></Reveal>
        <Reveal at={comp} style={{marginTop: 26}}><Headline size={86}>COMPAREÇA</Headline></Reveal>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 56}}>
          <Item at={und} icon="pin" label="UNIDADE" />
          <Item at={data} icon="calendar" label="DATA" />
          <Item at={hor} icon="clock" label="HORÁRIO" />
        </div>
        <Reveal at={hor + 10} style={{marginTop: 50}}>
          <div style={{fontSize: 36, fontWeight: 700, lineHeight: 1.3, color: C.white, border: `2px solid ${C.gold}`, padding: '16px 26px', borderRadius: 8}}>
            UNIDADE, DATA E HORÁRIO<br />INDICADOS NA INTIMAÇÃO
          </div>
        </Reveal>
        <Reveal at={leve} style={{marginTop: 34, display: 'flex', alignItems: 'center', gap: 16}}>
          <Icon name="phone" size={50} color={C.gold} stroke={1.6} />
          <div style={{fontSize: 38, fontWeight: 800, color: C.white, letterSpacing: '.04em'}}>LEVE O CELULAR</div>
        </Reveal>
      </Stack>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ 6 · receptação, conforme as circunstâncias

export const S6: React.FC<P> = ({sc}) => {
  return (
    <AbsoluteFill>
      <Stack top={470}>
        <Reveal at={0}>
          <div style={{fontSize: 52, fontWeight: 800, color: C.gold, letterSpacing: '.06em', border: `3px solid ${C.gold}`, padding: '20px 30px', borderRadius: 8}}>CONFORME AS<br />CIRCUNSTÂNCIAS</div>
        </Reveal>
        <Reveal at={Math.max(6, wf(sc, 'podera'))} style={{marginTop: 54}}>
          <div style={{fontSize: 52, fontWeight: 500, lineHeight: 1.25, color: C.white}}>poderá haver<br /><b style={{fontWeight: 800}}>responsabilização</b><br />por receptação</div>
        </Reveal>
      </Stack>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ 7 · alerta de segurança

export const S7: React.FC<P> = ({sc}) => {
  const links = wf(sc, 'links');
  const dados = wf(sc, 'dados');
  return (
    <AbsoluteFill>
      <Stack top={360}>
        <Reveal at={0} style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <Icon name="alert" size={48} color={C.gold} stroke={1.8} />
          <div style={{fontSize: 36, fontWeight: 800, letterSpacing: '.22em', color: C.gold}}>ATENÇÃO</div>
        </Reveal>
        <Reveal at={wf(sc, 'mensagens')} style={{marginTop: 50}}>
          <div style={{fontSize: 40, fontWeight: 800, lineHeight: 1.25, letterSpacing: '.03em', color: C.white, border: `2px solid ${C.gold}`, padding: '18px 28px', borderRadius: 8}}>SEM LINKS •<br />SEM SOLICITAÇÃO DE DADOS</div>
        </Reveal>
        <div style={{display: 'flex', gap: 110, marginTop: 70}}>
          <Reveal at={links - 4} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
            <Icon name="linkoff" size={130} stroke={1.2} /><div style={{fontSize: 30, fontWeight: 700, letterSpacing: '.12em', color: C.gray}}>LINKS</div>
          </Reveal>
          <Reveal at={Math.max(links + 4, wf(sc, 'pedem') - 4)} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
            <Icon name="formoff" size={130} stroke={1.2} /><div style={{fontSize: 30, fontWeight: 700, letterSpacing: '.12em', color: C.gray}}>DADOS</div>
          </Reveal>
        </div>
      </Stack>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ 8–9 · encerramento

export const S8: React.FC<P> = ({sc}) => {
  const comp = wf(sc, 'compareca');
  return (
    <AbsoluteFill>
      <Stack top={560}>
        <Reveal at={0}><div style={{fontSize: 40, fontWeight: 700, letterSpacing: '.2em', color: C.gray}}>NÃO ADIE</div></Reveal>
        <Hairline at={comp - 4} width={200} style={{marginTop: 40, marginBottom: 40}} />
        <Reveal at={comp}><Headline size={92}>COMPAREÇA E<br />APRESENTE<br />O APARELHO</Headline></Reveal>
      </Stack>
    </AbsoluteFill>
  );
};

export const S9: React.FC<P> = ({sc}) => {
  const f = useCurrentFrame();
  const len = sceneLen(sc);
  const out = ease(f, len - 12, len);
  return (
    <AbsoluteFill style={{opacity: 1 - out * 0.0}}>
      <Stack top={500}>
        <div style={{fontSize: 52, fontWeight: 800, lineHeight: 1.1, color: C.gray, opacity: 0.85}}>COMPAREÇA E APRESENTE<br />O APARELHO</div>
        <Hairline at={2} width={260} style={{marginTop: 70, marginBottom: 46}} />
        <Reveal at={2}><div style={{fontSize: 70, fontWeight: 800, letterSpacing: '.08em', color: C.white}}>POLÍCIA CIVIL<br />DA BAHIA</div></Reveal>
        <Hairline at={8} width={260} style={{marginTop: 46}} />
      </Stack>
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC<P>> = {s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8, s9: S9};
