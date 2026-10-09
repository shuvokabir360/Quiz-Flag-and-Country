// Virtual Hand Controller: allows programmatic control of the Girl Hand Cursor during Auto Play
type HandListener = (state: {
  x: number;
  y: number;
  isVisible: boolean;
  isClicking: boolean;
  isVirtual: boolean;
}) => void;

class VirtualHandController {
  private x: number = -300;
  private y: number = -300;
  private isVisible: boolean = false;
  private isClicking: boolean = false;
  private isVirtual: boolean = false;
  private listeners: Set<HandListener> = new Set();
  private animationFrameId: number | null = null;
  private idleIntervalId: number | null = null;

  public getState() {
    return {
      x: this.x,
      y: this.y,
      isVisible: this.isVisible,
      isClicking: this.isClicking,
      isVirtual: this.isVirtual,
    };
  }

  // Activates auto mode and positions the hand visibly on screen
  public activateAutoMode() {
    this.isVirtual = true;
    this.isVisible = true;

    // Position the hand in the lower center area of the game viewport
    const vp = document.getElementById('game-viewport');
    if (vp) {
      const rect = vp.getBoundingClientRect();
      this.x = rect.left + rect.width * 0.55;
      this.y = rect.top + rect.height * 0.72;
    } else {
      this.x = window.innerWidth * 0.5;
      this.y = window.innerHeight * 0.65;
    }

    this.notify();
    this.startIdleFloat();
  }

  // Subtle floating micro-movement when waiting between clicks
  private startIdleFloat() {
    if (this.idleIntervalId) {
      clearInterval(this.idleIntervalId);
    }

    let angle = 0;
    const baseX = this.x;
    const baseY = this.y;

    this.idleIntervalId = window.setInterval(() => {
      if (!this.isVirtual || this.isClicking) return;
      angle += 0.08;
      this.x = baseX + Math.sin(angle) * 6;
      this.y = baseY + Math.cos(angle * 0.8) * 4;
      this.notify();
    }, 50);
  }

  public stopIdleFloat() {
    if (this.idleIntervalId) {
      clearInterval(this.idleIntervalId);
      this.idleIntervalId = null;
    }
  }

  public setPosition(x: number, y: number, isVirtual = false) {
    this.x = x;
    this.y = y;
    this.isVisible = true;
    this.isVirtual = isVirtual;
    this.notify();
  }

  public setClicking(isClicking: boolean) {
    this.isClicking = isClicking;
    this.notify();
  }

  public setVisible(isVisible: boolean) {
    this.isVisible = isVisible;
    this.notify();
  }

  public releaseVirtual() {
    this.stopIdleFloat();
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.isVirtual = false;
    this.isClicking = false;
    this.notify();
  }

  // Smoothly glides the Girl Hand cursor to the target coordinates and performs a realistic tap
  public async glideToAndTap(
    targetX: number,
    targetY: number,
    glideDurationMs = 600,
    tapDurationMs = 280
  ): Promise<void> {
    this.stopIdleFloat();

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.isVirtual = true;
    this.isVisible = true;

    // If starting off-screen, start near bottom of target
    let startX = this.x;
    let startY = this.y;
    if (startX < 0 || startY < 0) {
      startX = targetX + 30;
      startY = targetY + 140;
    }

    const startTime = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    // 1. Glide to card target
    await new Promise<void>((resolve) => {
      const animateStep = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / glideDurationMs);
        const ease = easeOutCubic(progress);

        this.x = startX + (targetX - startX) * ease;
        this.y = startY + (targetY - startY) * ease;
        this.notify();

        if (progress < 1) {
          this.animationFrameId = requestAnimationFrame(animateStep);
        } else {
          this.animationFrameId = null;
          resolve();
        }
      };

      this.animationFrameId = requestAnimationFrame(animateStep);
    });

    // 2. Firm finger tap gesture
    this.isClicking = true;
    this.notify();

    await new Promise<void>((r) => setTimeout(r, tapDurationMs));

    this.isClicking = false;
    this.notify();

    // 3. Gentle lift after tap
    this.y = targetY + 20;
    this.notify();

    // 4. Resume idle floating around new position
    this.startIdleFloat();
  }

  public subscribe(listener: HandListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((fn) => {
      try {
        fn(state);
      } catch {
        // ignore
      }
    });
  }
}

export const virtualHandController = new VirtualHandController();
