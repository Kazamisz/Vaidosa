import { useEffect, useRef } from 'react';
import { Mesh, Program, Renderer, Triangle } from 'ogl';
import { ANIMATION_FRAME_INTERVAL, getWebGLDpr } from '../../utils/animation';

const hexToNormalizedRGB = hex => {
  const value = hex.replace('#', '');
  return [
    parseInt(value.slice(0, 2), 16) / 255,
    parseInt(value.slice(2, 4), 16) / 255,
    parseInt(value.slice(4, 6), 16) / 255
  ];
};

const vertexShader = `
attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;
uniform float uLightMode;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2 r = G * sin(G * texCoord);
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2 rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd = noise(gl_FragCoord.xy);
  vec2 uv = rotateUvs(vUv * uScale, uRotation);
  vec2 tex = uv * uScale;
  float tOffset = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  float grain = rnd / 15.0 * uNoiseIntensity;
  vec3 result = uColor * pattern - vec3(grain);

  if (uLightMode > 0.5) {
    float fold = smoothstep(0.28, 0.9, pattern);
    float specular = smoothstep(0.72, 0.98, pattern);
    vec3 shadowColor = uColor * 0.72;
    vec3 bodyColor = min(uColor * 1.18, vec3(1.0));
    vec3 lightBase = mix(shadowColor, bodyColor, fold);
    lightBase = mix(lightBase, vec3(1.0), specular * 0.92);
    float fineNoise = noise(gl_FragCoord.xy * 0.63 + vec2(17.0, 41.0));
    float grainSignal = rnd + fineNoise - 1.0;
    float grainStrength = clamp(uNoiseIntensity * 0.038, 0.0, 0.16);
    result = lightBase + grainSignal * grainStrength;
  }

  gl_FragColor = vec4(clamp(result, 0.0, 1.0), 1.0);
}
`;

const Silk = ({
  speed = 5,
  scale = 1,
  color = '#7B7481',
  noiseIntensity = 1.5,
  rotation = 0,
  lightMode = false
}) => {
  const containerRef = useRef(null);
  const programRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const renderer = new Renderer({
      alpha: false,
      antialias: false,
      dpr: getWebGLDpr(),
      webgl: 1,
      powerPreference: 'high-performance'
    });
    const gl = renderer.gl;
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.display = 'block';
    container.appendChild(gl.canvas);

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: hexToNormalizedRGB(color) },
        uSpeed: { value: speed },
        uScale: { value: scale },
        uRotation: { value: rotation },
        uNoiseIntensity: { value: noiseIntensity },
        uLightMode: { value: lightMode ? 1 : 0 }
      }
    });
    programRef.current = program;

    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(Math.max(1, width), Math.max(1, height));
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let lastRenderTime = 0;
    let visible = true;
    let pageVisible = !document.hidden;

    const renderFrame = time => {
      program.uniforms.uTime.value = time * 0.0001;
      renderer.render({ scene: mesh });
    };
    const canAnimate = () => visible && pageVisible && !reducedMotion.matches;
    const loop = time => {
      frame = 0;
      if (!canAnimate()) return;
      if (time - lastRenderTime >= ANIMATION_FRAME_INTERVAL) {
        lastRenderTime = time;
        renderFrame(time);
      }
      frame = requestAnimationFrame(loop);
    };
    const startLoop = () => {
      if (canAnimate() && frame === 0) frame = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) startLoop();
      else stopLoop();
    });
    const onVisibilityChange = () => {
      pageVisible = !document.hidden;
      if (pageVisible) startLoop();
      else stopLoop();
    };
    const onReducedMotionChange = () => {
      if (reducedMotion.matches) {
        stopLoop();
        renderFrame(performance.now());
      } else {
        startLoop();
      }
    };

    intersectionObserver.observe(container);
    document.addEventListener('visibilitychange', onVisibilityChange);
    reducedMotion.addEventListener('change', onReducedMotionChange);
    renderFrame(performance.now());
    startLoop();

    return () => {
      stopLoop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      reducedMotion.removeEventListener('change', onReducedMotionChange);
      programRef.current = null;
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      gl.canvas.remove();
    };
  }, []);

  useEffect(() => {
    const program = programRef.current;
    if (!program) return;
    program.uniforms.uSpeed.value = speed;
    program.uniforms.uScale.value = scale;
    program.uniforms.uColor.value = hexToNormalizedRGB(color);
    program.uniforms.uNoiseIntensity.value = noiseIntensity;
    program.uniforms.uRotation.value = rotation;
    program.uniforms.uLightMode.value = lightMode ? 1 : 0;
  }, [speed, scale, color, noiseIntensity, rotation, lightMode]);

  return <div ref={containerRef} className="h-full w-full" aria-hidden="true" />;
};

export default Silk;
