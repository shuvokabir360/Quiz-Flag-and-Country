// Web Audio API synthesizer for zero-latency, reliable sound effects
class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private musicOscillators: OscillatorNode[] = [];
  private isMusicPlaying = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft click for UI buttons
  playClick() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio fallback silent
    }
  }

  // Card pickup / drag whoosh
  playPickup() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(580, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {
      // Audio fallback silent
    }
  }

  // Celebratory correct chime with harmonic arpeggio
  playCorrect(streak = 1) {
    try {
      this.initContext();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const baseTime = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        // If streak is high, raise pitch slightly
        const pitchMultiplier = streak >= 5 ? 1.05 : 1.0;
        osc.frequency.setValueAtTime(freq * pitchMultiplier, baseTime + idx * 0.06);

        gain.gain.setValueAtTime(0, baseTime + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.25, baseTime + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, baseTime + idx * 0.06 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(baseTime + idx * 0.06);
        osc.stop(baseTime + idx * 0.06 + 0.36);
      });
    } catch {
      // Audio fallback silent
    }
  }

  // Wrong answer buzz / thud
  playWrong() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.22);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.23);
    } catch {
      // Audio fallback silent
    }
  }

  // High streak burst sound (e.g., 3x, 5x, 10x)
  playStreakBonus() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const notes = [659.25, 830.61, 987.77, 1318.51];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.2, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.42);
      });
    } catch {
      // Audio fallback silent
    }
  }

  // Game complete fanfare
  playVictory() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0.28, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.52);
      });
    } catch {
      // Audio fallback silent
    }
  }

  // Upbeat subtle background melody loop
  startBackgroundMusic() {
    if (this.isMusicPlaying) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      this.isMusicPlaying = true;
      // Ambient synth pulse
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
      gain.connect(this.ctx.destination);
      this.musicGain = gain;

      // Gentle chord pad
      const chords = [261.63, 329.63, 392.0]; // C major
      this.musicOscillators = chords.map((freq) => {
        const osc = this.ctx!.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);
        osc.connect(gain);
        osc.start();
        return osc;
      });
    } catch {
      this.isMusicPlaying = false;
    }
  }

  stopBackgroundMusic() {
    try {
      this.musicOscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      this.musicOscillators = [];
      if (this.musicGain) {
        this.musicGain.disconnect();
        this.musicGain = null;
      }
      this.isMusicPlaying = false;
    } catch {
      // ignore
    }
  }
}

export const soundSynthesizer = new SoundSynthesizer();
