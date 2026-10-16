// ============ เกณฑ์ระดับน้ำ (cm) ============
export const THRESHOLDS = {
  SAFE_MAX: 5,
  WATCH_MAX: 10,
  CRITICAL_MIN: 15,
};
export const TANK_MAX_CM = 20;
export const THRESHOLD_WARNING = THRESHOLDS.SAFE_MAX + 1;
export const THRESHOLD_CRITICAL = THRESHOLDS.CRITICAL_MIN;

// ชื่อสถานะ (string enum) — ตรงกับ enum water_status ใน PostgreSQL
export const WATER_STATUS = {
  SAFE: 'SAFE',
  WARNING: 'WARNING',
  CRITICAL: 'CRITICAL',
  UNKNOWN: 'UNKNOWN',
};

// ============ ข้อมูลประกอบของแต่ละสถานะ ============
export const STATUS_META = {
  SAFE: {
    key: 'SAFE',
    label: 'ปลอดภัย',
    labelEn: 'SAFE',
    range: '0–5 cm',
    hex: '#22c55e',
    text: 'text-emerald-400',
    bgSolid: 'bg-emerald-500',
    bgSoft: 'bg-emerald-500/10',
    border: 'border-emerald-500/40',
    buzzer: false,
    message: 'ระดับน้ำปกติ ไม่ต้องดำเนินการ',
    color: '#22c55e',
    soft: 'rgba(34,197,94,0.12)',
    ring: 'rgba(34,197,94,0.45)',
  },
  WARNING: {
    key: 'WARNING',
    label: 'เฝ้าระวัง',
    labelEn: 'WARNING',
    range: '6–14 cm',
    hex: '#eab308',
    text: 'text-amber-400',
    bgSolid: 'bg-amber-500',
    bgSoft: 'bg-amber-500/10',
    border: 'border-amber-500/40',
    buzzer: false,
    message: 'ระดับน้ำสูงขึ้น ติดตามอย่างใกล้ชิด',
    color: '#eab308',
    soft: 'rgba(234,179,8,0.12)',
    ring: 'rgba(234,179,8,0.45)',
  },
  CRITICAL: {
    key: 'CRITICAL',
    label: 'วิกฤต',
    labelEn: 'CRITICAL',
    range: '15 cm ขึ้นไป',
    hex: '#ef4444',
    text: 'text-red-400',
    bgSolid: 'bg-red-500',
    bgSoft: 'bg-red-500/10',
    border: 'border-red-500/40',
    buzzer: true,
    message: 'ควรปล่อยน้ำออกทันที',
    color: '#ef4444',
    soft: 'rgba(239,68,68,0.14)',
    ring: 'rgba(239,68,68,0.5)',
  },
  UNKNOWN: {
    key: 'UNKNOWN',
    label: 'ไม่ทราบสถานะ',
    labelEn: 'UNKNOWN',
    range: '-',
    hex: '#64748b',
    text: 'text-slate-400',
    bgSolid: 'bg-slate-500',
    bgSoft: 'bg-slate-500/10',
    border: 'border-slate-500/40',
    buzzer: false,
    message: 'ไม่มีข้อมูลจากเซ็นเซอร์',
    color: '#64748b',
    soft: 'rgba(100,116,139,0.12)',
    ring: 'rgba(100,116,139,0.35)',
  },
};

// ============ ฟังก์ชันจัดระดับ ============
export function classifyLevel(cm) {
  if (cm === null || cm === undefined || cm === '' || Number.isNaN(Number(cm))) {
    return WATER_STATUS.UNKNOWN;
  }
  const v = Number(cm);
  if (v >= THRESHOLDS.CRITICAL_MIN) return WATER_STATUS.CRITICAL;
  if (v >= THRESHOLD_WARNING) return WATER_STATUS.WARNING;
  return WATER_STATUS.SAFE;
}

// คืน meta object ได้เลย ไม่ต้องกลัว undefined
export function getStatusMeta(statusOrCm) {
  if (typeof statusOrCm === 'string' && STATUS_META[statusOrCm]) {
    return STATUS_META[statusOrCm];
  }
  return STATUS_META[classifyLevel(statusOrCm)] ?? STATUS_META.UNKNOWN;
}

export const THRESHOLD_TEXT =
  `ปลอดภัย 0–${THRESHOLDS.SAFE_MAX} · เฝ้าระวัง ${THRESHOLD_WARNING}–${THRESHOLDS.CRITICAL_MIN - 1} · วิกฤต ≥${THRESHOLDS.CRITICAL_MIN}`;

export const ROLE = {
  USER: { key: 'USER', label: 'General User', canControl: false, canOverride: false },
  OPERATOR: { key: 'OPERATOR', label: 'Operator', canControl: true, canOverride: false },
  ADMIN: { key: 'ADMIN', label: 'Admin', canControl: true, canOverride: true },
};

// ============ ชื่อเดิม (ของเก่ายังเรียกใช้ได้) ============
export const STATUS = STATUS_META;
export const LEVEL_THRESHOLDS = THRESHOLDS;
export const getWaterStatus = classifyLevel;

export default {
  THRESHOLDS, TANK_MAX_CM, THRESHOLD_WARNING, THRESHOLD_CRITICAL,
  WATER_STATUS, STATUS_META, STATUS, ROLE,
  classifyLevel, getStatusMeta, THRESHOLD_TEXT,
};