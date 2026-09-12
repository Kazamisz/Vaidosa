import React, { useEffect, useState, useRef } from 'react';
import { getWebGLDpr, isMobileDevice, webGLTracker } from '../utils/animation';
import { Activity, Cpu, Monitor, Zap, ChevronDown, ChevronUp } from 'lucide-react';

export const FpsMonitor: React.FC = () => {
  const [stats, setStats] = useState({
    fps: 60,
    frametime: 16.6,
    minFps: 60,
    activeCanvases: 0,
    dpr: 1,
    isMobile: false,
  });
  const [expanded, setExpanded] = useState(false);

  const frameTimesRef = useRef<number[]>([]);
  const lastTimeRef = useRef(performance.now());
  const lastUiUpdateRef = useRef(performance.now());
  const rafIdRef = useRef<number>(0);

  useEffect(() => {
    const isMobile = isMobileDevice();
    const dpr = getWebGLDpr();

    // Listen to active WebGL instances count
    let activeCanvasesCount = 0;
    const unsub = webGLTracker.subscribe(count => {
      activeCanvasesCount = count;
    });

    const loop = (now: number) => {
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (delta > 0 && delta < 200) {
        // Store frametimes in a 60-frame circular ring buffer
        frameTimesRef.current.push(delta);
        if (frameTimesRef.current.length > 60) {
          frameTimesRef.current.shift();
        }
      }

      // Throttle UI React state updates to every 250ms to prevent GC/layout thrashing
      if (now - lastUiUpdateRef.current >= 250 && frameTimesRef.current.length > 0) {
        const frames = frameTimesRef.current;
        const avgDelta = frames.reduce((a, b) => a + b, 0) / frames.length;
        const rawFps = Math.round(1000 / avgDelta);
        const currentFps = Math.min(rawFps >= 58 ? 60 : rawFps, 60);
        const maxDelta = Math.max(...frames);
        const rawMinFps = Math.round(1000 / maxDelta);
        const minFps = Math.min(rawMinFps >= 58 ? 60 : rawMinFps, currentFps);

        setStats({
          fps: currentFps,
          frametime: Number(avgDelta.toFixed(1)),
          minFps: Math.min(minFps, currentFps),
          activeCanvases: activeCanvasesCount,
          dpr: Number(dpr.toFixed(2)),
          isMobile,
        });

        lastUiUpdateRef.current = now;
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      unsub();
    };
  }, []);

  // Performance Color Coding
  const getFpsColor = (fps: number) => {
    if (fps >= 55) return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40';
    if (fps >= 40) return 'text-amber-400 bg-amber-500/20 border-amber-500/40';
    return 'text-rose-400 bg-rose-500/20 border-rose-500/40';
  };

  const getStatusDot = (fps: number) => {
    if (fps >= 55) return 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]';
    if (fps >= 40) return 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]';
    return 'bg-rose-400 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]';
  };

  return (
    <aside
      aria-label="Painel de Benchmark e Fluidez WebGL"
      className="fixed bottom-4 left-4 z-50 select-none font-mono text-xs transition-all duration-300"
    >
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex cursor-pointer items-center gap-2.5 rounded-full border border-rose-950/80 bg-[#090205]/90 px-3.5 py-1.5 text-stone-200 shadow-2xl backdrop-blur-md transition-colors hover:border-rose-500/50 hover:bg-[#15030d]/95"
      >
        <span className={`h-2 w-2 rounded-full transition-colors ${getStatusDot(stats.fps)}`} />
        <span className="font-semibold tracking-wider text-white">
          {stats.fps}{' '}
          <span className="text-[10px] font-normal text-stone-400">FPS</span>
        </span>
        <span className="text-stone-500">•</span>
        <span className="text-stone-300">
          {stats.frametime}{' '}
          <span className="text-[10px] text-stone-400">ms</span>
        </span>
        <span className="ml-1 text-stone-400">
          {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </span>
      </div>

      {expanded && (
        <div className="mt-2 w-64 rounded-2xl border border-rose-900/50 bg-[#0c0208]/95 p-4 text-[11px] leading-relaxed text-stone-300 shadow-2xl backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between border-b border-rose-950 pb-2">
            <span className="flex items-center gap-1.5 font-sans font-semibold uppercase tracking-wider text-rose-300">
              <Activity size={13} className="text-rose-400" /> WebGL Benchmark
            </span>
            <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${getFpsColor(stats.fps)}`}>
              {stats.fps >= 55 ? 'FLUIDO (60 FPS)' : stats.fps >= 40 ? 'ESTÁVEL' : 'GARGALO GPU'}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-stone-400">
                <Zap size={12} className="text-amber-400" /> Frametime Médio:
              </span>
              <span className="font-bold text-white">{stats.frametime} ms</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-stone-400">1% Low (Piores Quadros):</span>
              <span className="font-semibold text-stone-300">{stats.minFps} FPS</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-stone-400">
                <Cpu size={12} className="text-fuchsia-400" /> Contextos WebGL Ativos:
              </span>
              <span className="font-bold text-fuchsia-300">{stats.activeCanvases}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-stone-400">
                <Monitor size={12} className="text-blue-400" /> Clamped DPR:
              </span>
              <span className="font-bold text-blue-300">{stats.dpr}x</span>
            </div>

            <div className="flex items-center justify-between border-t border-rose-950/60 pt-2 text-[10px]">
              <span className="text-stone-400">Perfil Detectado:</span>
              <span className="font-medium text-rose-300">
                {stats.isMobile ? 'Mobile / Touch (Otimizado)' : 'Desktop High-Performance'}
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
