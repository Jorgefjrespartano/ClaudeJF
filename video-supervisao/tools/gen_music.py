"""Trilha de piano suave e esperançosa (composta aqui, sem material de terceiros). Sem percussão, sem tensão."""
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

def piano(m, dur, decay=1.4):
    t = np.arange(int(dur * SR)) / SR
    s = sum(a * np.sin(2 * np.pi * hz(m) * (k + 1) * t) * np.exp(-t * (1 + k * 0.8)) for k, a in enumerate((1, .45, .2, .08)))
    return s * np.minimum(1, t / 0.004) * np.exp(-t / decay) * np.minimum(1, (dur - t) / 0.3)

def pad(m, dur):
    t = np.arange(int(dur * SR)) / SR
    return (np.sin(2 * np.pi * hz(m) * t) + .15 * np.sin(2 * np.pi * hz(m) * 2 * t)) * np.minimum(1, t / 1.5) * np.minimum(1, (dur - t) / 1.5)

beat = 60 / 76
bar = 4 * beat
prog = [[48, 55, 60, 64, 67], [43, 55, 59, 62, 67], [45, 57, 60, 64, 69], [41, 53, 57, 60, 65]]  # C  G  Am  F
t0, k = 0.0, 0
while t0 < T:
    ch = prog[k % 4]
    for m in ch[1:4]:
        add(pad(m, bar + 1.5), t0, gain=0.035)
    add(piano(ch[0], bar, 2.5), t0, gain=0.10)
    for e, m in enumerate([ch[2] + 12, ch[3] + 12, ch[4] + 12, ch[3] + 12, ch[2] + 12, ch[3] + 12]):
        add(piano(m, 2.0), t0 + e * bar / 6, pan=(-0.3 if e % 2 else 0.3), gain=0.05)
    t0 += bar; k += 1
fade = np.ones(n); fl = int(3 * SR); fade[-fl:] = np.linspace(1, 0, fl)
mix *= fade[:, None]
mix /= np.max(np.abs(mix)) / 0.5
with wave.open(str(ROOT / "public" / "music_raw.wav"), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
print("ok", round(T, 1))
