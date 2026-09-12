/**
 * Haptic feedback utility using the navigator.vibrate Web API.
 * Provides subtle tactile feedback on mobile devices for key interactions.
 */
export const triggerHapticFeedback = (pattern: number | number[] = 15): void => {
  if (typeof window === 'undefined' || !('navigator' in window)) return;
  try {
    if (typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern);
    }
  } catch {
    // Ignore unsupported devices or silent permission denials
  }
};
