// Short incoming-message blip synthesized with WebAudio — no audio assets.
let audioCtx = null;

const warmUp = () => {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    audioCtx = audioCtx || new Ctx();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  } catch (_) {}
};

if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', warmUp);
  window.addEventListener('keydown', warmUp);
}

export function playMessageSound() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    audioCtx = audioCtx || new Ctx();
    if (audioCtx.state !== 'running') {
      audioCtx.resume().catch(() => {});
      return;
    }
    const start = audioCtx.currentTime;
    [[660, 0], [880, 0.09]].forEach(([freq, delay]) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, start + delay);
      gain.gain.exponentialRampToValueAtTime(0.25, start + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + delay + 0.18);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(start + delay);
      osc.stop(start + delay + 0.2);
    });
  } catch (_) {}
}
