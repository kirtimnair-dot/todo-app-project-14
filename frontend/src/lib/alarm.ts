// Web Audio API alarm synthesizer + browser notification helper (works offline with zero external audio files)

let audioCtx: AudioContext | null = null;
let alarmIntervalId: number | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {
      // Ignore autoplay restriction until user interacts
    });
  }
  return audioCtx;
}

export function unlockAlarmAudio(): void {
  getAudioContext();
}

export function playAlarmChime(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const notes = [
      { freq: 880, start: 0, duration: 0.16 },
      { freq: 1174.66, start: 0.17, duration: 0.16 },
      { freq: 1318.51, start: 0.34, duration: 0.28 },
    ];

    for (const note of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, now + note.start);

      gain.gain.setValueAtTime(0.0001, now + note.start);
      gain.gain.exponentialRampToValueAtTime(0.22, now + note.start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + note.start + note.duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + note.start);
      osc.stop(now + note.start + note.duration + 0.02);
    }
  } catch {
    // Ignore audio context playback failures
  }
}

export function startAlarmLoop(): void {
  stopAlarmLoop();
  playAlarmChime();
  if (typeof window !== 'undefined') {
    alarmIntervalId = window.setInterval(() => {
      playAlarmChime();
    }, 1800);
  }
}

export function stopAlarmLoop(): void {
  if (alarmIntervalId !== null && typeof window !== 'undefined') {
    window.clearInterval(alarmIntervalId);
    alarmIntervalId = null;
  }
}

export async function requestAlarmNotificationPermission(): Promise<void> {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission === 'default') {
    try {
      await Notification.requestPermission();
    } catch {
      // Ignore permission prompt errors inside iframes
    }
  }
}

export function showAlarmNotification(title: string, body: string): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, { body, icon: '/favicon.svg' });
    } catch {
      // Ignore notification errors
    }
  }
}
