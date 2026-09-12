import { useEffect, useRef } from 'react';
import { Mesh, Program, Renderer, Triangle } from 'ogl';
import './backgrounds.css';
import { ANIMATION_FRAME_INTERVAL } from '../../utils/animation';

type Detail = 'low' | 'medium' | 'high';

interface GradientWavesProps {
  horizonColor?: string;
  waveColor?: string;
  crestColor?: string;
  speed?: number;
  amplitude?: number;
  waveScale?: number;
  waveRatio?: number;
  swell?: number;
  turbulence?: number;
  tilt?: number;
  zoom?: number;
  height?: number;
  fogDepth?: number;
  detail?: Detail;
  brightness?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  parallaxStrength?: number;
  grain?: boolean;
  grainIntensity?: number;
  className?: string;
}

const hexToRgb = (hex: string) => {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!match) return [1, 1, 1];
  return [
    parseInt(match[1], 16) / 255,
    parseInt(match[2], 16) / 255,
    parseInt(match[3], 16) / 255,
  ];
};

const detailSteps = (detail: Detail) => {
  if (detail === 'low') return 40;
  if (detail === 'high') return 110;
  return 70;
};

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaveScale;
uniform float uWaveRatio;
uniform float uSwell;
uniform float uTurbulence;
uniform float uTilt;
uniform float uZoom;
uniform float uHeight;
uniform float uFogDepth;
uniform float uSteps;
uniform float uBrightness;
uniform float uOpacity;
uniform float uGrain;
uniform float uGrainIntensity;
uniform vec2 uMouse;
uniform float uParallax;
uniform bool uEnableMouse;
uniform vec3 uHorizonColor;
uniform vec3 uWaveColor;
uniform vec3 uCrestColor;
out vec4 fragColor;
const float MAX_DIST = 20000.0;

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float plasma(vec3 ray, vec2 frequency, vec4 clock) {
  float x = ray.x + clock.x;
  x += uSwell * sin((ray.y + x) / 20.0 + clock.y);
  float y = ray.y - clock.z;
  y += uTurbulence * cos(ray.x / 23.0 + clock.w);
  return ray.z - (sin(x * frequency.x) * uAmplitude + sin(y * frequency.y) * uAmplitude + uHeight);
}

float raymarch(vec3 origin, vec3 direction, vec2 frequency, vec4 clock) {
  float distanceTravelled = 0.0;
  for (int i = 0; i < 128; i++) {
    if (float(i) >= uSteps) break;
    float sceneDistance = plasma(origin + distanceTravelled * direction, frequency, clock);
    if (abs(sceneDistance) < 0.1) break;
    distanceTravelled += 0.9 * sceneDistance;
    if (!(abs(distanceTravelled) < MAX_DIST)) return MAX_DIST;
  }
  return distanceTravelled;
}

void main() {
  float time = iTime * uSpeed;
  vec2 frequency = vec2(uWaveScale / 7.0, (uWaveScale * uWaveRatio) / 3.0);
  vec4 clock = vec4(time / 0.130, time / 0.810, time / 0.200, time / 0.710);
  float verticalFov = (3.14159 / 2.3) / max(uZoom, 0.05);
  vec3 camera = vec3(0.0, 0.0, 30.0);
  vec2 uv = gl_FragCoord.xy / iResolution.xy - 0.5;
  uv.x *= iResolution.x / iResolution.y;
  uv.y *= -1.0;

  vec3 direction = vec3(0.0, 0.0, -1.0);
  float uvLength = length(uv);
  float xRotation = verticalFov * uvLength;
  float cosine = cos(xRotation);
  float sine = sin(xRotation);
  direction = mat3(1.0, 0.0, 0.0, 0.0, cosine, -sine, 0.0, sine, cosine) * direction;
  vec2 normalizedUv = uvLength > 0.00001 ? uv / uvLength : vec2(1.0, 0.0);
  cosine = normalizedUv.x;
  sine = normalizedUv.y;
  direction = mat3(cosine, -sine, 0.0, sine, cosine, 0.0, 0.0, 0.0, 1.0) * direction;
  cosine = cos(uTilt);
  sine = sin(uTilt);
  direction = mat3(cosine, 0.0, sine, 0.0, 1.0, 0.0, -sine, 0.0, cosine) * direction;

  if (uEnableMouse) {
    float yaw = (uMouse.x - 0.5) * uParallax * 0.4;
    float pitch = (uMouse.y - 0.5) * uParallax * 0.4;
    cosine = cos(yaw);
    sine = sin(yaw);
    direction = mat3(cosine, 0.0, sine, 0.0, 1.0, 0.0, -sine, 0.0, cosine) * direction;
    cosine = cos(pitch);
    sine = sin(pitch);
    direction = mat3(1.0, 0.0, 0.0, 0.0, cosine, -sine, 0.0, sine, cosine) * direction;
  }

  float distanceTravelled = raymarch(camera, direction, frequency, clock);
  vec3 position = camera + distanceTravelled * direction;
  float fog = clamp(uFogDepth / max(distanceTravelled, 0.001), 0.0, 1.0);
  vec3 body = mix(uWaveColor, uCrestColor, clamp(position.z * 0.08 + 0.5, 0.0, 1.0));
  vec3 color = clamp(mix(uHorizonColor, body, fog) * uBrightness, 0.0, 1.0);
  float alpha = clamp(fog, 0.0, 1.0) * uOpacity;
  if (uGrain > 0.5) {
    alpha += (hash21(gl_FragCoord.xy + mod(iTime, 64.0) * 11.0) - 0.5) * uGrainIntensity;
  }
  alpha = clamp(alpha, 0.0, 1.0);
  fragColor = vec4(color * alpha, alpha);
}
`;

export default function GradientWaves({
  horizonColor = '#26000e',
  waveColor = '#790931',
  crestColor = '#f2b7ca',
  speed = 0.28,
  amplitude = 2.5,
  waveScale = 0.6,
  waveRatio = 0.9,
  swell = 35,
  turbulence = 20,
  tilt = 1.11,
  zoom = 1,
  height = 5.5,
  fogDepth = 15,
  detail = 'medium',
  brightness = 1,
  opacity = 0.72,
  mouseInteraction = false,
  parallaxStrength = 0.5,
  grain = true,
  grainIntensity = 0.035,
  className = '',
}: GradientWavesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: any = null;
    let gl: any = null;
    let program: any = null;
    let mesh: any = null;

    try {
      renderer = new Renderer({
        webgl: 2,
        alpha: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      });
      gl = renderer.gl;
      if (!gl) return;

      const canvas = gl.canvas as HTMLCanvasElement;
      gl.clearColor(0, 0, 0, 0);
      canvas.setAttribute('aria-hidden', 'true');

      const handleContextLost = (e: Event) => {
        e.preventDefault();
      };
      canvas.addEventListener('webglcontextlost', handleContextLost, false);

      container.appendChild(canvas);

      const geometry = new Triangle(gl);
      program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new Float32Array([1, 1]) },
          uSpeed: { value: speed },
          uAmplitude: { value: amplitude },
          uWaveScale: { value: waveScale },
          uWaveRatio: { value: waveRatio },
          uSwell: { value: swell },
          uTurbulence: { value: turbulence },
          uTilt: { value: tilt },
          uZoom: { value: zoom },
          uHeight: { value: height },
          uFogDepth: { value: fogDepth },
          uSteps: { value: detailSteps(detail) },
          uBrightness: { value: brightness },
          uOpacity: { value: opacity },
          uGrain: { value: grain ? 1 : 0 },
          uGrainIntensity: { value: grainIntensity },
          uMouse: { value: new Float32Array([0.5, 0.5]) },
          uParallax: { value: parallaxStrength },
          uEnableMouse: { value: mouseInteraction },
          uHorizonColor: { value: new Float32Array(hexToRgb(horizonColor)) },
          uWaveColor: { value: new Float32Array(hexToRgb(waveColor)) },
          uCrestColor: { value: new Float32Array(hexToRgb(crestColor)) },
        },
      });

      if (!program || !program.uniformLocations) return;

      mesh = new Mesh(gl, { geometry, program });
    } catch (err) {
      console.warn('GradientWaves WebGL init failed:', err);
      return;
    }

    const safeRender = () => {
      try {
        if (renderer && mesh && program && program.uniformLocations) {
          renderer.render({ scene: mesh });
        }
      } catch (err) {
        console.warn('GradientWaves render failed:', err);
      }
    };

    const canvas = gl.canvas as HTMLCanvasElement;

    const resize = () => {
      try {
        const rect = container.getBoundingClientRect();
        renderer.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)));
        if (program.uniforms?.iResolution?.value) {
          program.uniforms.iResolution.value[0] = gl.drawingBufferWidth;
          program.uniforms.iResolution.value[1] = gl.drawingBufferHeight;
        }
        safeRender();
      } catch {}
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const targetMouse = [0.5, 0.5];
    const currentMouse = [0.5, 0.5];
    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouse[0] = (event.clientX - rect.left) / Math.max(rect.width, 1);
      targetMouse[1] = 1 - (event.clientY - rect.top) / Math.max(rect.height, 1);
    };
    if (mouseInteraction) window.addEventListener('pointermove', onPointerMove, { passive: true });

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let visible = false;
    let pageVisible = !document.hidden;
    const startTime = performance.now();
    let lastRenderTime = 0;
    const loop = (time: number) => {
      frame = requestAnimationFrame(loop);
      if (program.uniforms?.iTime) {
        program.uniforms.iTime.value = (time - startTime) * 0.001;
      }
      currentMouse[0] += 0.05 * (targetMouse[0] - currentMouse[0]);
      currentMouse[1] += 0.05 * (targetMouse[1] - currentMouse[1]);
      if (program.uniforms?.uMouse?.value) {
        program.uniforms.uMouse.value[0] = currentMouse[0];
        program.uniforms.uMouse.value[1] = currentMouse[1];
      }
      safeRender();
    };
    const start = () => {
      if (!reduceMotion && visible && pageVisible && frame === 0) frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      visible ? start() : stop();
    });
    intersectionObserver.observe(container);
    const onVisibility = () => {
      pageVisible = !document.hidden;
      pageVisible ? start() : stop();
    };
    document.addEventListener('visibilitychange', onVisibility);
    safeRender();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      if (mouseInteraction) window.removeEventListener('pointermove', onPointerMove);
      if (canvas.parentNode === container) container.removeChild(canvas);
    };
  }, [amplitude, brightness, crestColor, detail, fogDepth, grain, grainIntensity, height, horizonColor, mouseInteraction, opacity, parallaxStrength, speed, swell, tilt, turbulence, waveColor, waveRatio, waveScale, zoom]);

  return <div ref={containerRef} className={`react-bits-background ${className}`.trim()} />;
}
