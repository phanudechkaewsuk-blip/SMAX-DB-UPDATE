import { useEffect, useState } from 'react';
import { RefreshCw, Database } from 'lucide-react';
import { getStatusMeta } from '../constants/waterLevel';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const DEVICE = 'ESP32-01';
const MAX_ROWS = 10;

// ดึง array ออกมาไม่ว่า backend จะห่อมาแบบไหน
function pickRows(json) {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.rows)) return json.rows;
  if (Array.isArray(json?.readings)) return json.readings;
  if (Array.isArray(json?.data?.rows)) return json.data.rows;
  return [];
}

// หาค่าจากชื่อคอลัมน์ที่เป็นไปได้หลายแบบ
const pick = (o, keys) => keys.map((k) => o?.[k]).find((v) => v != null);

export default function HistoryPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/readings/${DEVICE}?limit=${MAX_ROWS}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setRows(pickRows(json).slice(0, MAX_ROWS));
    } catch (e) {
      setError(e.message);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, []);

  const fmt = (ts) => {
    if (!ts) return '—';
    const d = new Date(ts);
    return Number.isNaN(d.getTime())
      ? '—'
      : d.toLocaleString('th-TH', {
          day: '2-digit', month: 'short',
          hour: '2-digit', minute: '2-digit', second: '2-digit',
        });
  };

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">ประวัติย้อนหลัง</h2>
          <p className="text-sm text-slate-400">
            ค่าล่าสุด {MAX_ROWS} รายการจากเซ็นเซอร์วัดระดับน้ำ
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 rounded-lg border border-slate-700
                     bg-slate-800/60 px-3 py-2 text-sm text-slate-200
                     transition hover:bg-slate-700 active:scale-95"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          รีเฟรช
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          เชื่อมต่อ API ไม่สำเร็จ ({error}) — ตรวจว่า Backend รันอยู่ที่ {API}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/70 text-slate-300">
            <tr>
              <th className="px-4 py-3 text-left font-medium">#</th>
              <th className="px-4 py-3 text-left font-medium">เวลาที่บันทึก</th>
              <th className="px-4 py-3 text-right font-medium">ระดับน้ำ (cm)</th>
              <th className="px-4 py-3 text-center font-medium">สถานะ</th>
              <th className="px-4 py-3 text-right font-medium">แบตเตอรี่ (V)</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                  ยังไม่มีข้อมูลจาก ESP32
                </td>
              </tr>
            )}
            {rows.map((r, i) => {
              const level = pick(r, ['level_cm', 'water_level_cm', 'level', 'value']);
              const batt  = pick(r, ['battery_v', 'battery', 'batt_v', 'voltage']);
              const time  = pick(r, ['recorded_at', 'created_at', 'ts', 't', 'timestamp']);
              const meta  = getStatusMeta(r.status ?? level);
              return (
                <tr
                  key={r.id ?? i}
                  className="border-t border-slate-800 transition hover:bg-slate-800/40"
                >
                  <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                  <td className="px-4 py-3 text-slate-300">{fmt(time)}</td>
                  <td className="px-4 py-3 text-right font-mono text-base text-slate-100">
                    {level != null ? Number(level).toFixed(1) : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ color: meta.color, background: meta.soft }}
                    >
                      {meta.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-400">
                    {batt != null ? Number(batt).toFixed(2) : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="flex items-center gap-2 text-xs text-slate-500">
        <Database size={14} />
        แสดงสูงสุด {MAX_ROWS} รายการ — ดูย้อนหลังทั้งหมดได้ที่ฐานข้อมูล PostgreSQL
      </p>
    </div>
  );
}