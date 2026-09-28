export interface ColorItem {
  name: string;
  hex: string;
  meaning: string;
  ten?: string;
  ma?: string;
  yNghia?: string;
}

export interface Costume {
  id: string;
  name: string;
  romanized: string;
  group: 'cung-dinh' | 'dan-gian' | 'quy-toc-tri-thuc' | 'hien-dai';
  groupName: string;
  period: string;
  dynasty: string;
  gender: 'nu' | 'nam' | 'unisex';
  genderLabel: string;
  region: 'bac-bo' | 'trung-bo' | 'nam-bo' | 'toan-quoc';
  regionLabel: string;
  image: string;
  coverImage: string;
  alt: string;
  imageAlt?: string;
  shortDesc: string;
  historyContext: string;
  story: string;
  identifyingFeatures: string[];
  wearer: string;
  occasions: string[];
  traditionalPalette: ColorItem[];
  accessories: string[];
  culturalNotes: string;
  references: string[];
  certaintyLevel: string;
  defaultColor: string;
  svgLayer: string;

  // Rich Vietnamese fields from user dataset
  ten?: string;
  tenKhac?: string;
  nhomTrangPhuc?: string;
  thoiKy?: string;
  boiCanhLichSu?: string;
  cauChuyen?: string;
  dacDiemNhanDang?: string[];
  nguoiMac?: string;
  dipSuDung?: string[];
  diaPhuongLienQuan?: string[];
  mauSacTruyenThong?: {
    ten: string;
    ma: string;
    yNghia: string;
  }[];
  phuKienDiKem?: string[];
  luuYVanHoa?: string;
  cachPhoiHienDai?: string;
  nguonThamKhao?: string[];
  mucDoChacChan?: 'cao' | 'trung bình' | string;
  ghiChuTranhLuan?: string;
}

export interface AccessoryItem {
  id: string;
  name: string;
  category: 'headwear' | 'jewelry' | 'handheld' | 'footwear' | 'belt';
  period: string;
  origin: string;
  meaning: string;
  compatibleWith: string[]; // costume IDs or '*'
  incompatibleWith?: string[]; // costume IDs with cultural violation
  incompatibilityReason?: string;
  icon?: string;
}

export interface StudioConfig {
  costumeId: string;
  colorHex: string;
  colorName: string;
  accessories: string[];
  backgroundScene: string;
  modelGender: 'nu' | 'nam';
  userAvatar?: string;
}

export interface HarmonyScoreResult {
  score: number; // 0 - 100
  title: string;
  verdict: string;
  wuxingBalance: string;
  contrastRatio: string;
}

export interface CulturalWarning {
  type: 'danger' | 'warning' | 'info';
  title: string;
  message: string;
  reference: string;
}

export interface SavedOutfit {
  id: string;
  title: string;
  timestamp: string;
  config: StudioConfig;
}
