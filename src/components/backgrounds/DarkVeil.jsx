import { useRef, useEffect, useState } from 'react';
import { Renderer, Program, Mesh, Triangle, Vec2 } from 'ogl';
import './DarkVeil.css';
import { getWebGLDpr, isMobileDevice, webGLTracker, ANIMATION_FRAME_INTERVAL } from '../../utils/animation';

const vertex = `
attribute vec2 position;
void main(){gl_Position=vec4(position,0.0,1.0);}
`;

const fragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 uResolution;
uniform float uTime;
uniform float uHueShift;
uniform float uNoise;
uniform float uScan;
uniform float uScanFreq;
uniform float uWarp;
uniform float uLightMode;

mat3 rgb2yiq = mat3(0.299, 0.587, 0.114, 0.596, -0.274, -0.322, 0.211, -0.523, 0.312);
mat3 yiq2rgb = mat3(1.0, 0.956, 0.621, 1.0, -0.272, -0.647, 1.0, -1.106, 1.703);

vec3 hueShiftRGB(vec3 col, float deg) {
    vec3 yiq = rgb2yiq * col;
    float rad = radians(deg);
    float cosh = cos(rad), sinh = sin(rad);
    vec3 yiqShift = vec3(yiq.x, yiq.y * cosh - yiq.z * sinh, yiq.y * sinh + yiq.z * cosh);
    return clamp(yiq2rgb * yiqShift, 0.0, 1.0);
}

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
    vec2 res = max(uResolution, vec2(1.0));
    vec2 uv = gl_FragCoord.xy / res;
    float aspect = res.x / res.y;
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 2.4;

    float t = uTime * 0.45;
    
    vec2 warp = uWarp * vec2(sin(p.y * 2.8 + t * 0.7), cos(p.x * 2.8 + t * 0.5)) * 0.35;
    p += warp;

    float f1 = sin(p.x * 2.6 + p.y * 1.9 + t * 0.85);
    float f2 = cos(p.x * 1.8 - p.y * 2.9 - t * 0.65);
    float f3 = sin((f1 + f2) * 2.3 + p.x * 1.3 + t * 0.5);
    float f4 = cos(length(p + vec2(f1, f2) * 0.35) * 3.4 - t * 0.9);

    float folds = (f1 * 0.3 + f2 * 0.3 + f3 * 0.25 + f4 * 0.15) * 0.5 + 0.5;

    // Deep noir velvet, luxury royal #47041B wine, shimmering rose crests
    vec3 colDeep = vec3(0.04, 0.005, 0.015);
    vec3 colMid  = vec3(0.2784, 0.0157, 0.1059); // Exact #47041B premium bordeaux
    vec3 colHigh = vec3(0.55, 0.04, 0.22);       // Glowing royal wine
    vec3 colCrest = vec3(0.88, 0.42, 0.62);      // Rose silk highlights

    vec3 col = mix(colDeep, colMid, smoothstep(0.08, 0.55, folds));
    col = mix(col, colHigh, pow(folds, 1.9) * 0.95);
    col = mix(col, colCrest, pow(folds, 4.0) * 0.6);

    // Subtle edge fade
    float vig = 1.0 - smoothstep(0.65, 1.65, length(uv - 0.5));
    col *= (0.8 + 0.2 * vig);

    col = hueShiftRGB(col, uHueShift);

    if (uScan > 0.01) {
        float scanline = sin(gl_FragCoord.y * uScanFreq) * 0.5 + 0.5;
        col *= 1.0 - (scanline * scanline) * uScan;
    }
    if (uNoise > 0.005) {
        col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * uNoise;
    }

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export default function DarkVeil({
  hueShift = 0,
  noiseIntensity = 0,
  scanlineIntensity = 0,
  speed = 0.5,
  scanlineFrequency = 0,
  warpAmount = 0,
  resolutionScale = 1,
  lightMode = false
}) {
  const ref = useRef(null);
  const [glReady, setGlReady] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    let renderer = null;
    let gl = null;
    let program = null;
    let mesh = null;

    const isMobile = isMobileDevice();
    const targetDpr = getWebGLDpr();
    const effectiveResolutionScale = isMobile ? Math.min(resolutionScale, 0.65) : Math.min(resolutionScale, 0.85);

    const handleContextLost = (e) => {
      e.preventDefault();
      console.warn('DarkVeil WebGL context lost handled.');
    };

    const handleContextRestored = () => {
      console.info('DarkVeil WebGL context restored.');
      safeRender();
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    try {
      renderer = new Renderer({
        dpr: targetDpr,
        canvas,
        alpha: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: true,
        antialias: false,
        powerPreference: 'high-performance'
      });

      gl = renderer.gl;
      if (!gl) return;

      const geometry = new Triangle(gl);

      program = new Program(gl, {
        vertex,
        fragment: fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: new Vec2(window.innerWidth || 800, window.innerHeight || 600) },
          uHueShift: { value: hueShift },
          uNoise: { value: noiseIntensity },
          uScan: { value: scanlineIntensity },
          uScanFreq: { value: scanlineFrequency },
          uWarp: { value: warpAmount },
          uLightMode: { value: lightMode ? 1 : 0 }
        }
      });

      if (!program || !program.uniformLocations) return;

      mesh = new Mesh(gl, { geometry, program });
      setGlReady(true);
    } catch (err) {
      console.warn('DarkVeil WebGL init failed:', err);
      return;
    }

    const canvasId = 'darkveil_' + Math.random().toString(36).substring(2, 9);

    let isVisible = false;
    let isTabVisible = !document.hidden;
    let frameId = 0;
    let lastRenderTime = 0;

    const safeRender = () => {
      try {
        if (renderer && mesh && program && program.uniformLocations) {
          renderer.render({ scene: mesh });
        }
      } catch (err) {
        console.warn('DarkVeil render failed:', err);
      }
    };

    const resize = () => {
      const w = parent.clientWidth || window.innerWidth || 800;
      const h = parent.clientHeight || window.innerHeight || 600;
      if (w <= 0 || h <= 0) return;
      try {
        renderer.setSize(w * effectiveResolutionScale, h * effectiveResolutionScale);
        if (program.uniforms?.uResolution?.value) {
          program.uniforms.uResolution.value.set(gl.drawingBufferWidth, gl.drawingBufferHeight);
        }
        safeRender();
      } catch {}
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);
    resize();
    safeRender();

    const start = performance.now();

    const loop = (now) => {
      frameId = 0;
      if (!isVisible || !isTabVisible) return;

      if (program.uniforms?.uTime) {
        program.uniforms.uTime.value = ((now - start) / 1000) * speed;
      }
      safeRender();

      frameId = requestAnimationFrame(loop);
    };

    const tryStart = () => {
      if (isVisible && isTabVisible && frameId === 0) {
        webGLTracker.register(canvasId);
        frameId = requestAnimationFrame(loop);
      }
    };

    const tryStop = () => {
      if (frameId !== 0) {
        cancelAnimationFrame(frameId);
        frameId = 0;
        webGLTracker.unregister(canvasId);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          tryStart();
        } else {
          tryStop();
        }
      },
      { threshold: 0.01, rootMargin: '50px' }
    );
    io.observe(canvas);

    const onVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && isVisible) tryStart();
      else tryStop();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      tryStop();
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      resizeObserver.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [hueShift, noiseIntensity, scanlineIntensity, speed, scanlineFrequency, warpAmount, resolutionScale, lightMode]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="darkveil-fallback" style={{ opacity: glReady ? 0.45 : 1 }} />
      <canvas ref={ref} className="darkveil-canvas" aria-hidden="true" />
    </div>
  );
}
