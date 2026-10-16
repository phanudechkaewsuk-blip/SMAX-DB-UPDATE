// ===== เกณฑ์ระดับน้ำ (ต้องตรงกับฝั่ง frontend) =====
export const THRESHOLDS = {
  SAFE_MAX: 5,
  WATCH_MAX: 10,
  CRITICAL_MIN: 15,
};

export const WATER_STATUS = {
  SAFE: 'SAFE',
  WARNING: 'WARNING',
  CRITICAL: 'CRITICAL',
  UNKNOWN: 'UNKNOWN',
};

// ===== สถานะการเชื่อมต่อ (enum conn_state) =====
export const CONNECTION = {
  ONLINE: 'ONLINE',
  RECONNECTING: 'RECONNECTING',
  OFFLINE: 'OFFLINE',
};

// ===== สถานะ/คำสั่งประตูน้ำ (enum gate_state, gate_action) =====
export const GATE = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  MOVING: 'MOVING',
  UNKNOWN: 'UNKNOWN',
};

export const GATE_ACTION = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
};

export const DEVICE_MODE = {
  AUTO: 'AUTO',
  MANUAL: 'MANUAL',
};

export const CMD_SOURCE = {
  AUTO_LOCAL: 'AUTO_LOCAL',
  AUTO_SERVER: 'AUTO_SERVER',
  MANUAL_WEB: 'MANUAL_WEB',
};

export const CMD_STATUS = {
  PENDING: 'PENDING',
  ACKED: 'ACKED',
  FAILED: 'FAILED',
  TIMEOUT: 'TIMEOUT',
};

export const SEVERITY = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  CRITICAL: 'CRITICAL',
};

// ===== จัดระดับน้ำ =====
export function classifyLevel(cm) {
  if (cm === null || cm === undefined || Number.isNaN(Number(cm))) {
    return WATER_STATUS.UNKNOWN;
  }
  const v = Number(cm);
  if (v >= THRESHOLDS.CRITICAL_MIN) return WATER_STATUS.CRITICAL;
  if (v > THRESHOLDS.SAFE_MAX) return WATER_STATUS.WARNING;
  return WATER_STATUS.SAFE;
}

// ชื่อเดิมเผื่อโค้ดส่วนอื่นเรียกอยู่
export const CONN_STATE = CONNECTION;
export const GATE_STATE = GATE;
export const getWaterStatus = classifyLevel;
// ===== alias เผื่อโค้ดเดิมเรียกชื่อเก่า =====
export const getStatusByLevel = classifyLevel;
export const getLevelStatus   = classifyLevel;
