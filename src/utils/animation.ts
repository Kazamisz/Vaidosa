export const ANIMATION_FPS = 24;
export const ANIMATION_FRAME_INTERVAL = 1000 / ANIMATION_FPS;
export const MAX_WEBGL_DPR = 1.5;

export const getWebGLDpr = () => Math.min(window.devicePixelRatio || 1, MAX_WEBGL_DPR);
