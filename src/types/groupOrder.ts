import { RentalSize } from './rental';

export interface GroupMember {
  id: string;
  name: string;
  costumeId: string;
  costumeName: string;
  size: RentalSize;
  colorName?: string;
  colorHex?: string;
  isPaid: boolean;
  paidAt?: string;
  amountPaid: number;
  phone?: string;
}

export interface GroupOrder {
  id: string; // e.g. GRP-12A1-KYEU
  name: string; // e.g. "Lớp 12A1 – Kỷ yếu"
  organizerName: string;
  organizerPhone: string;
  expectedMembers: number; // e.g. 30
  eventDate: string; // YYYY-MM-DD
  deadlineDate: string; // YYYY-MM-DD
  location: string; // Điểm nhận đồ
  costumeMode: 'uniform' | 'flexible'; // 'uniform' (chọn bộ chung) | 'flexible' (tự chọn)
  defaultCostumeId?: string;
  defaultCostumeName?: string;
  
  // Pricing configuration
  coordinationFee: number; // 500.000đ cố định
  discountRate: number; // 0.10 nếu >= 10 người, 0.15 nếu >= 20 người
  
  // Thành viên
  members: GroupMember[];
  
  // Trạng thái nhóm
  status: 'open' | 'finalized';
  finalizedOrderId?: string;
  createdAt: string;
}

export const GROUP_COORDINATION_FEE = 500000;

export function getGroupDiscountRate(memberCount: number): number {
  if (memberCount >= 20) return 0.15; // Giảm 15%
  if (memberCount >= 10) return 0.10; // Giảm 10%
  return 0;
}
