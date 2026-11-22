"""Trilha sintetizada: tensão (abertura) -> base corporativa leve (solução em diante) -> acorde final."""
import json, sys, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
TL = json.loads((ROOT / "src" / "timeline.json").read_text())
SR = 44100
T = TL["total"]
turn = next(s["start"] for s in TL["scenes"] if s["id"] == "c03")  # virada: entra a solução
end_t = next(s["start"] for s in TL["scenes"] if s["id"] == "c12")
n = int(T * SR)
t = np.arange(n) / SR
mix = np.zeros((n, 2))
rng = np.random.default_rng(3)

def hz(m):
    return 440 * 2 ** ((m - 69) / 12)

def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= n:
        return
    sig = sig[: n - i] * gain
    mix[i:i + len(sig), 0] += sig * (1 - pan) / 2 * 2 ** 0.5
    mix[i:i + len(sig), 1] += sig * (1 + pan) / 2 * 2 ** 0.5

def tone(freq, dur, attack=0.01, decay=None, harm=(1, .35, .15)):
    tt = np.arange(int(dur * SR)) / SR
    s = sum(a * np.sin(2 * np.pi * freq * (k + 1) * tt) for k, a in enumerate(harm))
    env = np.minimum(1, tt / attack)
    env *= np.exp(-tt / decay) if decay else np.minimum(1, (dur - tt) / 0.3)
    return s * env

# --- abertura: drone grave + pulso cardíaco + ruído que cresce
d = int(turn * SR)
tt = t[:d]
drone = 0.22 * np.sin(2 * np.pi * 55 * tt) + 0.12 * np.sin(2 * np.pi * 82.4 * tt) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.15 * tt))
noise = rng.standard_normal(d)
noise = np.convolve(noise, np.ones(60) / 60, mode="same") * 0.5 * (tt / turn) ** 2
fade = np.minimum(1, tt / 1.5) * np.minimum(1, (turn - tt) / 0.25)
add((drone + noise) * fade, 0)
for b in np.arange(0.6, turn - 0.4, 1.2):
    add(tone(50, 0.35, 0.005, 0.09, (1,)), b, gain=0.5)
    add(tone(48, 0.35, 0.005, 0.09, (1,)), b + 0.22, gain=0.35)

# --- base corporativa: 100 bpm, Am - F - C - G
bpm = 100
beat = 60 / bpm
bar = 4 * beat
chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # Am F C G
cur = turn
k = 0
while cur < end_t + bar * 2 and cur < T - 2.5:
    ch = chords[k % 4]
    # pad
    for m in ch:
        add(tone(hz(m), bar + 0.4, 0.5, None, (1, .2, .05)), cur, pan=0.0, gain=0.07)
    # baixo
    for bt in range(4):
        add(tone(hz(ch[0] - 12), beat * 0.9, 0.01, 0.35, (1, .3)), cur + bt * beat, gain=0.16)
    # arpejo (colcheias)
    arp = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 12]
    for e in range(8):
        add(tone(hz(arp[e % 4]), 0.5, 0.004, 0.16, (1, .25, .08)), cur + e * beat / 2, pan=(-0.4 if e % 2 else 0.4), gain=0.07)
    # bumbo suave (1 e 3) e chimbal nos contratempos
    for bt in (0, 2):
        tt2 = np.arange(int(0.3 * SR)) / SR
        kick = np.sin(2 * np.pi * (45 + 80 * np.exp(-tt2 * 30)) * tt2) * np.exp(-tt2 * 12)
        add(kick, cur + bt * beat, gain=0.3)
    for e in range(4):
        hh = rng.standard_normal(int(0.05 * SR))
        hh = np.diff(hh, prepend=0) * np.exp(-np.arange(len(hh)) / SR * 70)
        add(hh, cur + e * beat + beat / 2, gain=0.025)
    cur += bar
    k += 1

# --- acorde final (Dó maior) até o fim
fin = cur
for m in (48, 55, 60, 64, 67):
    add(tone(hz(m), T - fin, 0.05, 3.5, (1, .25, .06)), fin, gain=0.08)

# riser/whoosh na virada
rl = 1.2
rt = np.arange(int(rl * SR)) / SR
riser = rng.standard_normal(len(rt))
riser = np.convolve(riser, np.ones(8) / 8, mode="same") * (rt / rl) ** 3 * 0.25
add(riser, turn - rl)

mix /= np.max(np.abs(mix)) / 0.6
pcm = (mix * 32767).astype(np.int16)
with wave.open(str(ROOT / "public" / "music.wav"), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print(f"music.wav {T:.1f}s, virada em {turn:.1f}s, final em {fin:.1f}s")
