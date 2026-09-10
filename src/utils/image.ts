/**
 * Utility functions for image resolution and formatting
 */

export const LOGO_URL = '/images/logo.webp';

/**
 * Normalizes an image path to an absolute path served from public root.
 * Ensures compatibility with Vite in both dev and production.
 */
export function getImageUrl(path?: string | null): string {
  if (!path) return '';
  const clean = path.trim().replace(/^\/+/, '');
  if (clean.startsWith('images/')) {
    return `/${clean}`;
  }
  if (clean.startsWith('instagram/')) {
    return `/images/${clean}`;
  }
  return `/images/${clean}`;
}
