// Screen Wake Lock Manager: Keeps mobile screen awake and prevents display timeout while playing
class WakeLockManager {
  private wakeLockSentinel: any = null;
  private isEnabled: boolean = true;
  private isRequesting: boolean = false;
  private changeListeners: Set<(active: boolean) => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    // Re-acquire wake lock when page returns to visible state (e.g. app switch, tab switch)
    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState === 'visible' && this.isEnabled) {
        await this.requestWakeLock();
      }
    });

    // Auto-request on first user interaction in case browser policy required a user gesture
    const handleInitialGesture = async () => {
      if (this.isEnabled && !this.wakeLockSentinel) {
        await this.requestWakeLock();
      }
      window.removeEventListener('pointerdown', handleInitialGesture);
      window.removeEventListener('touchstart', handleInitialGesture);
      window.removeEventListener('click', handleInitialGesture);
    };

    window.addEventListener('pointerdown', handleInitialGesture, { passive: true });
    window.addEventListener('touchstart', handleInitialGesture, { passive: true });
    window.addEventListener('click', handleInitialGesture, { passive: true });

    // Initial attempt
    this.requestWakeLock();
  }

  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'wakeLock' in navigator;
  }

  public isActive(): boolean {
    return this.wakeLockSentinel !== null;
  }

  public async requestWakeLock(): Promise<boolean> {
    if (!this.isSupported() || !this.isEnabled || this.isRequesting) {
      return false;
    }

    try {
      this.isRequesting = true;
      if (this.wakeLockSentinel) {
        return true;
      }

      // @ts-ignore - Screen Wake Lock API
      const sentinel = await navigator.wakeLock.request('screen');
      this.wakeLockSentinel = sentinel;

      sentinel.addEventListener('release', () => {
        this.wakeLockSentinel = null;
        this.notifyListeners(false);
      });

      this.notifyListeners(true);
      return true;
    } catch {
      // Wake lock request failed (e.g. low battery mode or browser restriction)
      return false;
    } finally {
      this.isRequesting = false;
    }
  }

  public async releaseWakeLock(): Promise<void> {
    if (this.wakeLockSentinel) {
      try {
        await this.wakeLockSentinel.release();
      } catch {
        // ignore
      }
      this.wakeLockSentinel = null;
      this.notifyListeners(false);
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (enabled) {
      this.requestWakeLock();
    } else {
      this.releaseWakeLock();
    }
  }

  public subscribe(callback: (active: boolean) => void): () => void {
    this.changeListeners.add(callback);
    callback(this.isActive());
    return () => {
      this.changeListeners.delete(callback);
    };
  }

  private notifyListeners(active: boolean) {
    this.changeListeners.forEach((fn) => {
      try {
        fn(active);
      } catch {
        // ignore
      }
    });
  }
}

export const wakeLockManager = new WakeLockManager();
