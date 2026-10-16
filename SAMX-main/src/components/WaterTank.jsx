import { classifyLevel, STATUS_META, THRESHOLDS } from '../constants/waterLevel';

export default function WaterTank({ levelCm, maxCm = 20 }) {
  const has = levelCm !== null && levelCm !== undefined && !Number.isNaN(Number(levelCm));
  const pct = has ? Math.min(100, Math.max(0, (Number(levelCm) / maxCm) * 100)) : 0;
  const meta = STATUS_META[classifyLevel(levelCm)];

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
      {/* เส้นเกณฑ์ */}
      {[
        { v: THRESHOLDS.SAFE_MAX, c: '#22c55e' },
        { v: THRESHOLDS.WATCH_MAX, c: '#eab308' },
        { v: THRESHOLDS.CRITICAL_MIN, c: '#ef4444' },
      ].map((t) => (
        <div
          key={t.v}
          className="absolute left-0 right-0 z-20 border-t border-dashed"
          style={{ bottom: `${(t.v / maxCm) * 100}%`, borderColor: t.c, opacity: .55 }}
        >
          <span className="absolute right-2 -top-5 text-[10px]" style={{ color: t.c }}>
            {t.v} cm
          </span>
        </div>
      ))}

      {/* มวลน้ำ */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 transition-[height] duration-1000 ease-out"
        style={{ height: `${pct}%`, background: meta.soft }}
      >
        <div className="absolute inset-x-0 -top-3 h-6 w-[200%] wg-wave"
             style={{ background: meta.color, opacity: .35, borderRadius: '45%' }} />
        <div className="absolute inset-x-0 -top-4 h-6 w-[200%] wg-wave-2"
             style={{ background: meta.color, opacity: .25, borderRadius: '42%' }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${meta.color}55, transparent)` }} />
        {/* ฟองอากาศ */}
        {[15, 40, 62, 85].map((l, i) => (
          <span
            key={l}
            className="wg-bubble absolute bottom-2 h-2 w-2 rounded-full bg-white/40"
            style={{ left: `${l}%`, animationDelay: `${i * 1.3}s` }}
          />
        ))}
      </div>

      {/* ตัวเลข */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center">
        <div className="wg-bob text-center">
          <div className="font-mono text-5xl font-bold text-slate-50">
            {has ? Number(levelCm).toFixed(1) : '— —'}
            <span className="ml-1 text-xl text-slate-400">cm</span>
          </div>
          <div className="mt-2 inline-block rounded-full px-4 py-1 text-sm font-semibold"
               style={{ color: meta.color, background: meta.soft }}>
            {meta.label}
          </div>
          <p className="mt-2 text-xs text-slate-400">{meta.message}</p>
        </div>
      </div>
    </div>
  );
}