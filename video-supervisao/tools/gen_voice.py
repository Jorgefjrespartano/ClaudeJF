"""Narração por cena com ElevenLabs (tempos por palavra) -> public/narration.wav + src/timeline.json

A chave é lida de ELEVENLABS_API_KEY (nunca fica no código).
Uso: ELEVENLABS_API_KEY=... python3 tools/gen_voice.py [VOICE_ID] [--reuse]
"""
import base64, json, os, subprocess, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CFG = json.loads((ROOT / "script.json").read_text())
VOICE_DIR = ROOT / "public" / "voice"
VOICE_DIR.mkdir(parents=True, exist_ok=True)
KEY = os.environ.get("ELEVENLABS_API_KEY", "")
GAP = 0.18  # respiro entre frases (s)
LEAD = 0.15  # sem vinheta: a fala começa quase de imediato
TEMPO = 1.0  # sem aceleração artificial da voz


def tts(text, prev, nxt, voice):
    body = {
        "text": text, "model_id": "eleven_multilingual_v2", "language_code": "pt",
        "voice_settings": {"stability": 0.75, "similarity_boost": 1.0, "style": 0.0, "use_speaker_boost": True},
        "previous_text": prev, "next_text": nxt,
    }
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps?output_format=mp3_44100_128",
        method="POST", data=json.dumps(body).encode(),
        headers={"xi-api-key": KEY, "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=180) as r:
        return json.loads(r.read())


def words_from_alignment(al):
    words, cur, s0, e0 = [], "", None, None
    for c, s, e in zip(al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]):
        if c.isspace():
            if cur:
                words.append({"w": cur, "s": s0, "e": e0})
            cur, s0 = "", None
            continue
        if s0 is None:
            s0 = s
        cur += c
        e0 = e
    if cur:
        words.append({"w": cur, "s": s0, "e": e0})
    return words


def duration(p):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)],
                                capture_output=True, text=True).stdout)


def main():
    args = sys.argv[1:]
    voice = next((a for a in args if not a.startswith("--")), CFG["voice_id"])
    reuse = "--reuse" in args
    scs = CFG["scenes"]
    spoken = [s.get("spoken", s["text"]) for s in scs]
    out, parts, t0 = [], [], LEAD
    for i, sc in enumerate(scs):
        mp3, js = VOICE_DIR / f"{sc['id']}.mp3", VOICE_DIR / f"{sc['id']}.json"
        if not (reuse and mp3.exists() and js.exists()):
            ctx = "--nocontext" not in args
            res = tts(spoken[i], (spoken[i - 1] if i else None) if ctx else None, (spoken[i + 1] if i + 1 < len(scs) else None) if ctx else None, voice)
            mp3.write_bytes(base64.b64decode(res["audio_base64"]))
            js.write_text(json.dumps(res["alignment"]))
        heard = words_from_alignment(json.loads(js.read_text()))
        shown = sc["text"].split()
        # texto exibido x falado: se o número de palavras for igual, casa 1:1; senão, distribui proporcionalmente
        if len(heard) == len(shown):
            ws = [{"w": d, "s": h["s"], "e": h["e"]} for d, h in zip(shown, heard)]
        else:
            ws = []
            for k, d in enumerate(shown):
                a = heard[min(len(heard) - 1, round(k * len(heard) / len(shown)))]
                ws.append({"w": d, "s": a["s"], "e": a["e"]})
        # corta só o silêncio antes e depois da fala (sem mudar a velocidade)
        al = json.loads(js.read_text())
        a = max(0.0, al["character_start_times_seconds"][0] - 0.04)
        b = al["character_end_times_seconds"][-1] + 0.12
        trimmed = VOICE_DIR / f"{sc['id']}_trim.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(mp3), "-af", f"atrim=start={a:.3f}:end={b:.3f},asetpts=PTS-STARTPTS,afade=t=out:st={max(0, b - a - 0.04):.3f}:d=0.04",
                        "-ar", "44100", str(trimmed)], check=True)
        ws = [{**w, "s": max(0, w["s"] - a), "e": max(0, w["e"] - a)} for w in ws]
        mp3 = trimmed
        dur = duration(mp3)
        hold = dur + sc.get("tail", GAP)
        out.append({"id": sc["id"], "block": sc["block"], "text": sc["text"], "start": round(t0, 3),
                    "duration": round(hold, 3), "words": [{**w, "s": round(w["s"], 3), "e": round(w["e"], 3)} for w in ws]})
        parts.append((mp3, t0))
        print(f"{sc['id']} {dur:5.2f}s  {sc['text'][:58]}")
        t0 += hold
    # a primeira cena começa no frame 0 (inclui o silêncio inicial)
    out[0]["words"] = [{**w, "s": round(w["s"] + LEAD, 3), "e": round(w["e"] + LEAD, 3)} for w in out[0]["words"]]
    out[0]["duration"] = round(out[0]["duration"] + LEAD, 3)
    out[0]["start"] = 0.0
    total = t0 + 0.1
    # mixa cada cena na posição exata
    inputs, filt = [], []
    for k, (p, st) in enumerate(parts):
        inputs += ["-i", str(p)]
        ms = int(st * 1000)
        filt.append(f"[{k}:a]aresample=44100,adelay={ms}|{ms}[a{k}]")
    filt.append("".join(f"[a{k}]" for k in range(len(parts))) + f"amix=inputs={len(parts)}:normalize=0,apad,atrim=0:{total:.3f}[o]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(filt), "-map", "[o]",
                    "-ac", "1", "-c:a", "pcm_s16le", str(ROOT / "public" / "narration.wav")], check=True)
    (ROOT / "src" / "timeline.json").write_text(json.dumps({"total": round(total, 3), "scenes": out}, ensure_ascii=False, indent=1))
    print(f"TOTAL {total:.1f}s")


if __name__ == "__main__":
    main()
