import React, { useRef, useEffect } from 'react';
import { Renderer, Camera, Transform, Program, Mesh, Plane } from 'ogl';
import { ANIMATION_FRAME_INTERVAL } from '../utils/animation';

interface GLSLAmbientCanvasProps {
  className?: string;
}

const VERTEX_SHADER = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
varying vec2 vUv;

// Simplex-inspired organic wave function
float wave(vec2 p, float freq, float speed) {
  return sin(p.x * freq + uTime * speed) * cos(p.y * freq + uTime * speed * 0.7);
}

void main() {
  vec2 uv = vUv;
  vec2 aspectUv = (uv - 0.5) * vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);

  // Mouse interaction influence
  vec2 mouseDist = aspectUv - (uMouse - 0.5);
  float mFactor = exp(-dot(mouseDist, mouseDist) * 6.0) * 0.15;

  // Multi-frequency undulating luxury silk caustics
  float n1 = wave(aspectUv * 2.2, 3.0, 0.4);
  float n2 = wave(aspectUv * 3.5 + vec2(n1 * 0.4, -n1 * 0.3), 4.5, 0.35);
  float pattern = n1 * 0.6 + n2 * 0.4 + mFactor;

  // Deep luxury color palette: Obsidian black, royal fuchsia, soft twilight purple, rose gold
  vec3 bgBase = vec3(0.04, 0.025, 0.06); // #0a0610
  vec3 colorFuchsia = vec3(0.75, 0.14, 0.78); // #c026d3
  vec3 colorPurple = vec3(0.48, 0.12, 0.72); // #7c3aed
  vec3 colorRoseGold = vec3(0.89, 0.42, 0.62); // #e26b9e

  vec3 color = bgBase;
  color = mix(color, colorPurple, smoothstep(-0.6, 0.6, pattern) * 0.35);
  color = mix(color, colorFuchsia, smoothstep(-0.2, 0.8, pattern) * 0.28);
  color = mix(color, colorRoseGold, smoothstep(0.4, 0.95, pattern) * 0.15);

  // Radial vignette mask so it fades gently towards the edges
  float vignette = 1.0 - smoothstep(0.3, 0.95, length(uv - 0.5));
  color *= vignette;

  gl_FragColor = vec4(color, 0.65 * vignette);
}
`;

export const GLSLAmbientCanvas: React.FC<GLSLAmbientCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let renderer: Renderer;
    let program: Program;
    let scene: Transform;
    let camera: Camera;
    let gl: any;

    const handleContextLost = (e: Event) => {
      e.preventDefault();
    };
    canvas.addEventListener('webglcontextlost', handleContextLost, false);

    try {
      renderer = new Renderer({
        canvas,
        alpha: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      });

      gl = renderer.gl;
      scene = new Transform();
      camera = new Camera(gl);
      camera.position.z = 1;

      const geometry = new Plane(gl, { width: 2, height: 2 });
      program = new Program(gl, {
        vertex: VERTEX_SHADER,
        fragment: FRAGMENT_SHADER,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: [container.clientWidth, container.clientHeight] },
          uMouse: { value: [0.5, 0.5] },
        },
        transparent: true,
      });

      if (!program || !program.program) {
        return;
      }

      const mesh = new Mesh(gl, { geometry, program });
      mesh.setParent(scene);
    } catch {
      return;
    }

    const updateSize = () => {
      if (!container || !renderer || !program) return;
      try {
        const width = container.clientWidth;
        const height = container.clientHeight;
        if (width > 0 && height > 0) {
          renderer.setSize(width, height);
          if (program.uniforms?.uResolution) {
            program.uniforms.uResolution.value = [width, height];
          }
        }
      } catch {}
    };
    updateSize();

    let mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX / window.innerWidth;
      mouse.targetY = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let rafId: number;
    let startTime = performance.now();
    const render = (time: number) => {
      try {
        const elapsed = (time - startTime) * 0.001;
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        if (program?.uniforms) {
          program.uniforms.uTime.value = elapsed;
          program.uniforms.uMouse.value = [mouse.x, mouse.y];
        }

        if (renderer && scene && camera) {
          renderer.render({ scene, camera });
        }
      } catch {
        // Safe bail if context is lost
        return;
      }
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(container);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      resizeObserver.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full opacity-60 mix-blend-screen" />
    </div>
  );
};
