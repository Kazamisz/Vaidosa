import { useEffect, useRef } from 'react';
import { Mesh, Program, Renderer, Triangle } from 'ogl';
import './backgrounds.css';
import { ANIMATION_FRAME_INTERVAL } from '../../utils/animation';

interface MoltenMetalProps {
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
  scale?: number;
  detail?: number;
  glow?: number;
  coreSize?: number;
  swirl?: number;
  fold?: number;
  blackPoint?: number;
  brightness?: number;
  grain?: boolean;
  grainIntensity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  opacity?: number;
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
uniform float uScale;
uniform float uDetail;
uniform float uGlow;
uniform float uCoreSize;
uniform float uSwirl;
uniform float uFold;
uniform float uBlackPoint;
uniform float uBrightness;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform bool uEnableMouse;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  float time = iTime * uSpeed;
  vec2 p = uScale * ((gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y) - 0.5;
  if (uEnableMouse) p += (uMouse - 0.5) * uMouseStrength * 2.0;

  vec2 position = p;
  float caustic = 0.0;
  float radius = length(p + vec2(sin(time), sin(time * 0.3 + 5.0)) * 0.5);
  float distanceFromCenter = length(p);
  float rotation = distanceFromCenter + time + p.x * uSwirl;
  float cosine = cos(rotation);
  mat2 warp = mat2(
    cos(rotation - sin(time / 5.0)), sin(rotation),
    -sin(cosine - time), cosine
  ) * uFold;
  float coreGlow = uGlow * uCoreSize;

  for (float n = 0.0; n < 8.0; n++) {
    if (n >= uDetail) break;
    p *= warp;
    float phase = radius - time / (n + 3.0);
    position -= p + vec2(
      cos(phase - position.x - radius) + sin(phase + position.y),
      sin(phase - position.y) + cos(phase + position.x) + radius
    );
    caustic += coreGlow / max(length(vec2(sin(position.x + phase), cos(position.y + phase))), 0.001);
  }

  caustic /= 6.0;
  float intensity = max(caustic - uBlackPoint, 0.0) * uBrightness;
  float signal = clamp(intensity, 0.0, 1.0);
  vec3 color = mix(uColor1, uColor2, smoothstep(0.0, 0.5, signal));
  color = mix(color, uColor3, smoothstep(0.5, 1.0, signal));
  float alpha = signal;
  if (uGrain > 0.5) {
    alpha += (hash(gl_FragCoord.xy + iTime) - 0.5) * uGrainIntensity;
  }
  alpha = clamp(alpha, 0.0, 1.0) * uOpacity;
  fragColor = vec4(color * alpha, alpha);
}
`;

export default function MoltenMetal({
  color1 = '#4b0019',
  color2 = '#a30a43',
  color3 = '#f7c9d8',
  speed = 0.2,
  scale = 4,
  detail = 3,
  glow = 1.5,
  coreSize = 0.1,
  swirl = 1,
  fold = -0.2,
  blackPoint = 0.05,
  brightness = 1.2,
  grain = true,
  grainIntensity = 0.035,
  mouseInteraction = false,
  mouseStrength = 0.3,
  opacity = 0.72,
  className = '',
}: MoltenMetalProps) {
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
          uScale: { value: scale },
          uDetail: { value: Math.min(Math.max(detail, 1), 8) },
          uGlow: { value: glow },
          uCoreSize: { value: Math.max(coreSize, 0.001) },
          uSwirl: { value: swirl },
          uFold: { value: fold },
          uBlackPoint: { value: blackPoint },
          uBrightness: { value: brightness },
          uGrain: { value: grain ? 1 : 0 },
          uGrainIntensity: { value: grainIntensity },
          uOpacity: { value: opacity },
          uMouse: { value: new Float32Array([0.5, 0.5]) },
          uMouseStrength: { value: mouseStrength },
          uEnableMouse: { value: mouseInteraction },
          uColor1: { value: new Float32Array(hexToRgb(color1)) },
          uColor2: { value: new Float32Array(hexToRgb(color2)) },
          uColor3: { value: new Float32Array(hexToRgb(color3)) },
        },
      });

      if (!program || !program.uniformLocations) return;

      mesh = new Mesh(gl, { geometry, program });
    } catch (err) {
      console.warn('MoltenMetal WebGL init failed:', err);
      return;
    }

    const safeRender = () => {
      try {
        if (renderer && mesh && program && program.uniformLocations) {
          renderer.render({ scene: mesh });
        }
      } catch (err) {
        console.warn('MoltenMetal render failed:', err);
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
  }, [blackPoint, brightness, color1, color2, color3, coreSize, detail, fold, glow, grain, grainIntensity, mouseInteraction, mouseStrength, opacity, scale, speed, swirl]);

  return <div ref={containerRef} className={`react-bits-background ${className}`.trim()} />;
}
