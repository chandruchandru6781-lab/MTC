// Audio context management
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Play correct answer bell sound
export const playCorrectSound = (): void => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const duration = 0.8;

    const notes = [
      { freq: 523.25, time: 0 },
      { freq: 659.25, time: 0.2 },
      { freq: 783.99, time: 0.4 },
    ];

    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.value = note.freq;

      filter.type = 'lowpass';
      filter.frequency.value = 3000;
      filter.Q.value = 5;

      gain.gain.setValueAtTime(0.3, now + note.time);
      gain.gain.exponentialRampToValueAtTime(0.01, now + note.time + 0.4);

      osc.start(now + note.time);
      osc.stop(now + note.time + 0.4);
    });
  } catch (error) {
    console.error('Error playing correct sound:', error);
  }
};

// Play wrong answer sound
export const playWrongSound = (): void => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(200, now + 0.3);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch (error) {
    console.error('Error playing wrong sound:', error);
  }
};

// Play completion sound (celebration)
export const playCompletionSound = (): void => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const clapTimes = [0, 0.15, 0.3, 0.5, 0.7, 1.0];

    clapTimes.forEach((time) => {
      const bufferSize = ctx.sampleRate * 0.1;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      filter.type = 'highpass';
      filter.frequency.value = 800;

      gain.gain.setValueAtTime(0.4, now + time);
      gain.gain.exponentialRampToValueAtTime(0.05, now + time + 0.12);

      source.start(now + time);
      source.stop(now + time + 0.15);
    });
  } catch (error) {
    console.error('Error playing completion sound:', error);
  }
};

// Play click sound
export const playClickSound = (): void => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch (error) {
    console.error('Error playing click sound:', error);
  }
};

// Enable audio context on user interaction
export const enableAudioContext = (): void => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  } catch (error) {
    console.error('Error enabling audio context:', error);
  }
};
