import { COSTUME_PRICING } from '../data/partners';

export type CanonInspectionStatus = 'chua-nop' | 'dang-xet' | 'da-duyet';
export type StorePlan = 'basic' | 'pro';

export interface MaintenanceLock {
  id: string;
  storeId: string;
  costumeId: string;
  date: string; // YYYY-MM-DD
  reason?: string;
}

export interface PartnerStoreConfig {
  storeId: string;
  canonStatus: CanonInspectionStatus;
  plan: StorePlan;
  maintenanceLocks: MaintenanceLock[];
}

const SETTINGS_KEY = 'vanky_partner_store_configs';

const DEFAULT_CONFIGS: Record<string, PartnerStoreConfig> = {
  'store-hue': {
    storeId: 'store-hue',
    canonStatus: 'da-duyet',
    plan: 'pro',
    maintenanceLocks: [
      { id: 'lock-1', storeId: 'store-hue', costumeId: 'ao-vien-linh', date: '2026-10-04', reason: 'Bảo trì đính lại hạt ngọc cổ áo' }
    ]
  },
  'store-hanoi': {
    storeId: 'store-hanoi',
    canonStatus: 'da-duyet',
    plan: 'pro',
    maintenanceLocks: []
  },
  'store-hoian': {
    storeId: 'store-hoian',
    canonStatus: 'dang-xet',
    plan: 'basic',
    maintenanceLocks: []
  },
  'store-hcm': {
    storeId: 'store-hcm',
    canonStatus: 'chua-nop',
    plan: 'basic',
    maintenanceLocks: []
  }
};

export function getAllStoreConfigs(): Record<string, PartnerStoreConfig> {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_CONFIGS));
      return DEFAULT_CONFIGS;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONFIGS, ...parsed };
  } catch (err) {
    console.error('Error loading store configs', err);
    return DEFAULT_CONFIGS;
  }
}

export function getStoreConfig(storeId: string): PartnerStoreConfig {
  const all = getAllStoreConfigs();
  return all[storeId] || {
    storeId,
    canonStatus: 'dang-xet',
    plan: 'basic',
    maintenanceLocks: []
  };
}

export function saveStoreConfig(config: PartnerStoreConfig): void {
  try {
    const all = getAllStoreConfigs();
    all[config.storeId] = config;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(all));
  } catch (err) {
    console.error('Error saving store config', err);
  }
}

export function toggleMaintenanceLock(storeId: string, costumeId: string, date: string, reason?: string): boolean {
  const config = getStoreConfig(storeId);
  const existingIdx = config.maintenanceLocks.findIndex(l => l.costumeId === costumeId && l.date === date);
  let isNowLocked = false;
  if (existingIdx >= 0) {
    config.maintenanceLocks.splice(existingIdx, 1);
    isNowLocked = false;
  } else {
    config.maintenanceLocks.push({
      id: `lock-${Date.now()}`,
      storeId,
      costumeId,
      date,
      reason: reason || 'Bảo trì phục hồi định kỳ'
    });
    isNowLocked = true;
  }
  saveStoreConfig(config);
  return isNowLocked;
}

export function isCostumeDateLocked(storeId: string, costumeId: string, date: string): boolean {
  const config = getStoreConfig(storeId);
  return config.maintenanceLocks.some(l => l.costumeId === costumeId && l.date === date);
}

export function isStoreCanonVerified(storeId: string): boolean {
  const config = getStoreConfig(storeId);
  return config.canonStatus === 'da-duyet';
}

export function isCostumeCanonVerified(costumeId: string): boolean {
  const defaultStoreId = COSTUME_PRICING[costumeId]?.defaultStoreId || 'store-hue';
  return isStoreCanonVerified(defaultStoreId);
}
