// Energetic game-show voice synthesis engine using Web Speech API
class VoiceManager {
  private selectedVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.initVoices();
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const pickBestVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;

      // Prefer natural English voices (Google, Microsoft Natural, Samantha, etc.)
      const englishVoices = voices.filter(
        (v) => v.lang.startsWith('en') || v.lang.includes('US') || v.lang.includes('GB')
      );

      // Prioritize natural sounding premium voices if available
      const preferred =
        englishVoices.find(
          (v) =>
            v.name.includes('Natural') ||
            v.name.includes('Neural') ||
            v.name.includes('Online') ||
            v.name.includes('Google US English') ||
            v.name.includes('Microsoft Jenny') ||
            v.name.includes('Microsoft Guy') ||
            v.name.includes('Microsoft Aria') ||
            v.name.includes('Samantha') ||
            v.name.includes('Karen') ||
            v.name.includes('Daniel')
        ) ||
        englishVoices[0] ||
        voices[0];

      this.selectedVoice = preferred || null;
    };

    pickBestVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = pickBestVoice;
    }
  }

  speak(text: string, options?: { pitch?: number; rate?: number }) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      // Cancel previous speech to keep prompt timing tight and responsive
      window.speechSynthesis.cancel();

      if (!this.selectedVoice) {
        this.initVoices();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
        utterance.lang = this.selectedVoice.lang || 'en-US';
      } else {
        utterance.lang = 'en-US';
      }

      // Clear, easy-to-understand conversational speed and pitch
      utterance.rate = options?.rate ?? 0.95;
      utterance.pitch = options?.pitch ?? 1.0;
      utterance.volume = 1.0;

      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech fallback
    }
  }

  speakCorrect(streak = 1) {
    if (streak === 3) {
      this.speak('Awesome! Three in a row!', { pitch: 1.05, rate: 1.0 });
    } else if (streak === 5) {
      this.speak('Incredible! Five streak on fire!', { pitch: 1.05, rate: 1.0 });
    } else if (streak === 10) {
      this.speak('Unstoppable! Ten in a row!', { pitch: 1.05, rate: 1.0 });
    } else {
      const variations = [
        'Correct! Well done!',
        'Spot on! That is right!',
        'Awesome! You got it!',
        'Perfect! Great job!',
      ];
      const pick = variations[Math.floor(Math.random() * variations.length)];
      this.speak(pick, { pitch: 1.0, rate: 0.98 });
    }
  }

  speakFlagWithClicks(countryName: string, attempts: number, streak = 1) {
    if (streak === 3 || streak === 5 || streak === 10) {
      this.speakCorrect(streak);
      return;
    }

    if (attempts === 1) {
      this.speak(`One click answer! That's the flag of ${countryName}!`, { pitch: 1.05, rate: 1.0 });
    } else if (attempts === 2) {
      this.speak(`Two click answer! That's the flag of ${countryName}!`, { pitch: 1.0, rate: 0.98 });
    } else if (attempts === 3) {
      this.speak(`Three click answer! That's the flag of ${countryName}!`, { pitch: 1.0, rate: 0.98 });
    } else if (attempts === 4) {
      this.speak(`Four click answer! That's the flag of ${countryName}!`, { pitch: 1.0, rate: 0.98 });
    } else {
      this.speak(`Correct! That's the flag of ${countryName}!`, { pitch: 1.0, rate: 0.98 });
    }
  }

  speakWrong() {
    const variations = [
      'Wrong! Try again!',
      'Not quite! Give it another try!',
      'Oops! Try again!',
    ];
    const pick = variations[Math.floor(Math.random() * variations.length)];
    this.speak(pick, { pitch: 0.98, rate: 0.95 });
  }

  speakNewQuestion(countryName: string) {
    this.speak(`What's the flag of ${countryName}?`, { pitch: 1.0, rate: 0.95 });
  }

  speakCapitalOfCountry(countryName: string) {
    this.speak(`What is the capital of ${countryName}?`, { pitch: 1.0, rate: 0.95 });
  }

  speakCapitalWithClicks(capital: string, countryName: string, attempts: number) {
    if (attempts === 1) {
      this.speak(`One click answer! ${capital} is the capital of ${countryName}!`, { pitch: 1.05, rate: 1.0 });
    } else if (attempts === 2) {
      this.speak(`Two click answer! ${capital} is the capital of ${countryName}!`, { pitch: 1.0, rate: 0.98 });
    } else if (attempts === 3) {
      this.speak(`Three click answer! ${capital} is the capital of ${countryName}!`, { pitch: 1.0, rate: 0.98 });
    } else if (attempts === 4) {
      this.speak(`Four click answer! ${capital} is the capital of ${countryName}!`, { pitch: 1.0, rate: 0.98 });
    } else {
      this.speak(`Correct! ${capital} is the capital of ${countryName}!`, { pitch: 1.0, rate: 0.98 });
    }
  }

  speakGameOver(score: number) {
    this.speak(`Great job! Your final score is ${score}!`, { pitch: 1.02, rate: 0.98 });
  }
}

export const voiceManager = new VoiceManager();
