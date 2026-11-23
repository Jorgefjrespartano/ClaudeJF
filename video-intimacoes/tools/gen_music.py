"""Trilha instrumental sóbria (composta aqui, sem uso de material de terceiros): piano suave + pad, sem percussão."""
import json, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
T = json.loads((ROOT / "src" / "timeline.json").read_text())["total"]
SR = 44100
n = int(T * SR)
mix = np.zeros((n, 2))
hz = lambda m: 440 * 2 ** ((m - 69) / 12)

def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= n: return
    sig = sig[: n - i] * gain
    mix[i:i + len(sig), 0] += sig * (1 - pan)
    mix[i:i + len(sig), 1] += sig * (1 + pan)

def note(m, dur, attack, decay, harm):
    t = np.arange(int(dur * SR)) / SR
    s = sum(a * np.sin(2 * np.pi * hz(m) * (k + 1) * t) for k, a in enumerate(harm))
    env = np.minimum(1, t / attack) * np.exp(-t / decay) * np.minimum(1, (dur - t) / 0.4)
    return s * env

bpm = 72
beat = 60 / bpm
bar = 4 * beat
prog = [[50, 57, 62, 65], [46, 53, 58, 62], [41, 48, 53, 57], [48, 55, 60, 64]]  # Dm  Bb  F  C
t0, k = 0.0, 0
while t0 < T:
    ch = prog[k % 4]
    for m in ch[:3]:
        add(note(m, bar + 1.0, 1.2, 6.0, (1, .12)), t0, gain=0.05)            # pad
    add(note(ch[0] - 12, bar, 0.05, 2.5, (1, .3)), t0, gain=0.12)            # baixo
    for e, m in enumerate([ch[1] + 12, ch[2] + 12, ch[3] + 12, ch[2] + 12]):  # piano
        add(note(m, beat * 2.2, 0.005, 0.9, (1, .4, .15, .05)), t0 + e * beat, pan=(-0.25 if e % 2 else 0.25), gain=0.06)
    t0 += bar; k += 1

fade = np.ones(n); f = int(2.0 * SR); fade[-f:] = np.linspace(1, 0, f)
mix *= fade[:, None]
mix /= np.max(np.abs(mix)) / 0.5
with wave.open(str(ROOT / "public" / "music_raw.wav"), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
print("ok", round(T, 1))
