let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  if (ctx.state === 'suspended') {
    ctx.resume()
  }
  return ctx
}

function tone(
  freq: number,
  start: number,
  dur: number,
  vol = 0.12,
  type: OscillatorType = 'square',
) {
  const c = getCtx()
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  gain.gain.setValueAtTime(vol, start)
  gain.gain.exponentialRampToValueAtTime(0.001, start + dur)
  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(start)
  osc.stop(start + dur)
}

function noise(start: number, dur: number, vol = 0.06) {
  const c = getCtx()
  const len = c.sampleRate * dur
  const buf = c.createBuffer(1, len, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1)
  const src = c.createBufferSource()
  src.buffer = buf
  const gain = c.createGain()
  gain.gain.setValueAtTime(vol, start)
  gain.gain.exponentialRampToValueAtTime(0.001, start + dur)
  const filter = c.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.setValueAtTime(800, start)
  src.connect(filter)
  filter.connect(gain)
  gain.connect(c.destination)
  src.start(start)
  src.stop(start + dur)
}

/** 8-bit explosion — descending arpeggio + noise burst */
export function playMatchSound() {
  const c = getCtx()
  const t = c.currentTime
  // Rapid descending arpeggio
  ;[1200, 900, 600, 350, 200, 100].forEach((f, i) => {
    tone(f, t + i * 0.03, 0.12, 0.08, 'square')
  })
  // Noise debris
  noise(t, 0.18, 0.06)
}
