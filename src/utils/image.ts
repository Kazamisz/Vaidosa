/** Normalizes an image path to the public root. */
export function getImageUrl(path?: string | null): string {
  if (!path) return '';
  const clean = path.trim().replace(/^\/+/, '');
  if (clean.startsWith('images/')) return `/${clean}`;
  if (clean.startsWith('instagram/')) return `/images/${clean}`;
  return `/images/${clean}`;
}

export const LOGO_URL = '/images/logo-256.webp';

export function getImageSrcSet(path?: string | null): string | undefined {
  const source = getImageUrl(path);
  if (!source || !source.includes('/images/instagram/')) return undefined;
  const extensionIndex = source.lastIndexOf('.');
  return `${source.slice(0, extensionIndex)}-480.webp 480w, ${source.slice(0, extensionIndex)}-960.webp 960w, ${source} 1080w`;
}
