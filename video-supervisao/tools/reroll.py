"""Regenera uma frase até a transcrição conferir com o texto esperado (máx. N tentativas)."""
import base64, json, os, subprocess, sys, urllib.request
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
CFG = json.loads((ROOT / "script.json").read_text())
KEY = os.environ["ELEVENLABS_API_KEY"]
MODEL = "/opt/tools/src/whisper.cpp/models/ggml-small.bin"
TMP = Path(os.environ.get("TMPDIR_REROLL", "/tmp"))
sid, must, tries = sys.argv[1], sys.argv[2].lower(), int(sys.argv[3]) if len(sys.argv) > 3 else 4
sc = next(s for s in CFG["scenes"] if s["id"] == sid)
text = sc.get("spoken", sc["text"])
for k in range(tries):
    body = {"text": text, "model_id": "eleven_multilingual_v2", "language_code": "pt",
            "voice_settings": {"stability": 0.75, "similarity_boost": 1.0, "style": 0.0, "use_speaker_boost": True}}
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{CFG['voice_id']}/with-timestamps?output_format=mp3_44100_128",
                                 method="POST", data=json.dumps(body).encode(), headers={"xi-api-key": KEY, "Content-Type": "application/json"})
    res = json.loads(urllib.request.urlopen(req, timeout=120).read())
    mp3 = TMP / f"{sid}_try{k}.mp3"
    mp3.write_bytes(base64.b64decode(res["audio_base64"]))
    wav = TMP / f"{sid}_try{k}.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(mp3), "-ar", "16000", "-ac", "1", str(wav)], check=True)
    heard = subprocess.run(["whisper-cli", "-m", MODEL, "-l", "pt", "-f", str(wav), "-nt", "-t", "4"], capture_output=True, text=True).stdout.strip()
    print(f"tentativa {k + 1}: {heard}")
    if must in heard.lower():
        (ROOT / "public" / "voice" / f"{sid}.mp3").write_bytes(mp3.read_bytes())
        (ROOT / "public" / "voice" / f"{sid}.json").write_text(json.dumps(res["alignment"]))
        print("  -> aceita")
        break
else:
    print("  -> nenhuma tentativa conferiu; mantida a versão anterior")
