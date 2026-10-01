import { GroupOrder, GroupMember, GROUP_COORDINATION_FEE, getGroupDiscountRate } from '../types/groupOrder';
import { RentalOrder, RentalSize } from '../types/rental';
import { addOrder, getStoredOrders, saveOrders } from './orderStorage';
import { COSTUME_PRICING, PARTNER_STORES } from '../data/partners';

const GROUP_STORAGE_KEY = 'vanky_group_orders';

// 30 realistic members for sample group "Lớp 12A1 – Kỷ yếu" (22 paid, 8 unpaid)
const SAMPLE_MEMBERS: GroupMember[] = [
  { id: 'mem-01', name: 'Nguyễn Hoàng Nam (Lớp trưởng)', costumeId: 'ao-tac', costumeName: 'Áo Tấc Nam Triều Nguyễn', size: 'L', isPaid: true, paidAt: '28/09/2026 10:15', amountPaid: 1255000, phone: '0912.345.601' },
  { id: 'mem-02', name: 'Trần Thị Thu Thảo (Bí thư)', costumeId: 'nhat-binh', costumeName: 'Áo Nhật Bình Cung Đình', size: 'M', isPaid: true, paidAt: '28/09/2026 10:20', amountPaid: 1814000, phone: '0912.345.602' },
  { id: 'mem-03', name: 'Lê Văn Minh', costumeId: 'ao-ngu-than-tay-chen', costumeName: 'Áo Ngũ Thân Tay Chẽn', size: 'M', isPaid: true, paidAt: '28/09/2026 11:00', amountPaid: 1071000, phone: '0912.345.603' },
  { id: 'mem-04', name: 'Phạm Quỳnh Anh', costumeId: 'nhat-binh', costumeName: 'Áo Nhật Bình Cung Đình', size: 'S', isPaid: true, paidAt: '28/09/2026 11:30', amountPaid: 1814000, phone: '0912.345.604' },
  { id: 'mem-05', name: 'Vũ Đức Duy', costumeId: 'ao-tac', costumeName: 'Áo Tấc Nam Triều Nguyễn', size: 'XL', isPaid: true, paidAt: '28/09/2026 12:05', amountPaid: 1255000, phone: '0912.345.605' },
  { id: 'mem-06', name: 'Hoàng Mai Phương', costumeId: 'ao-tu-than', costumeName: 'Áo Tứ Thân Kinh Bắc', size: 'M', isPaid: true, paidAt: '28/09/2026 13:40', amountPaid: 1029000, phone: '0912.345.606' },
  { id: 'mem-07', name: 'Đặng Tuấn Kiệt', costumeId: 'ao-ngu-than-tay-chen', costumeName: 'Áo Ngũ Thân Tay Chẽn', size: 'L', isPaid: true, paidAt: '28/09/2026 14:10', amountPaid: 1071000, phone: '0912.345.607' },
  { id: 'mem-08', name: 'Bùi Thị Thanh Hằng', costumeId: 'nhat-binh', costumeName: 'Áo Nhật Bình Cung Đình', size: 'M', isPaid: true, paidAt: '28/09/2026 15:25', amountPaid: 1814000, phone: '0912.345.608' },
  { id: 'mem-09', name: 'Ngô Quốc Bảo', costumeId: 'ao-tac', costumeName: 'Áo Tấc Nam Triều Nguyễn', size: 'M', isPaid: true, paidAt: '28/09/2026 16:00', amountPaid: 1255000, phone: '0912.345.609' },
  { id: 'mem-10', name: 'Dương Khánh Linh', costumeId: 'ao-dai-co-phuc', costumeName: 'Áo Dài Cổ Phục Nữ', size: 'S', isPaid: true, paidAt: '28/09/2026 16:45', amountPaid: 1042000, phone: '0912.345.610' },
  { id: 'mem-11', name: 'Lý Trọng Nghĩa', costumeId: 'ao-vien-linh', costumeName: 'Áo Viên Lĩnh Thêu Bổ Tử', size: 'L', isPaid: true, paidAt: '29/09/2026 08:30', amountPaid: 2174000, phone: '0912.345.611' },
  { id: 'mem-12', name: 'Phan Thị Ngọc Bích', costumeId: 'nhat-binh', costumeName: 'Áo Nhật Bình Cung Đình', size: 'S', isPaid: true, paidAt: '29/09/2026 09:15', amountPaid: 1814000, phone: '0912.345.612' },
  { id: 'mem-13', name: 'Tạ Minh Khôi', costumeId: 'ao-tac', costumeName: 'Áo Tấc Nam Triều Nguyễn', size: 'M', isPaid: true, paidAt: '29/09/2026 09:50', amountPaid: 1255000, phone: '0912.345.613' },
  { id: 'mem-14', name: 'Trịnh Cẩm Tú', costumeId: 'ao-giao-linh', costumeName: 'Áo Giao Lĩnh Thắt Vạt', size: 'M', isPaid: true, paidAt: '29/09/2026 10:30', amountPaid: 1357000, phone: '0912.345.614' },
  { id: 'mem-15', name: 'Đoàn Hữu Phước', costumeId: 'ao-ngu-than-tay-chen', costumeName: 'Áo Ngũ Thân Tay Chẽn', size: 'L', isPaid: true, paidAt: '29/09/2026 11:20', amountPaid: 1071000, phone: '0912.345.615' },
  { id: 'mem-16', name: 'Lâm Thục Uyên', costumeId: 'nhat-binh', costumeName: 'Áo Nhật Bình Cung Đình', size: 'M', isPaid: true, paidAt: '29/09/2026 13:10', amountPaid: 1814000, phone: '0912.345.616' },
  { id: 'mem-17', name: 'Chu Đình Trọng', costumeId: 'ao-tac', costumeName: 'Áo Tấc Nam Triều Nguyễn', size: 'M', isPaid: true, paidAt: '29/09/2026 14:05', amountPaid: 1255000, phone: '0912.345.617' },
  { id: 'mem-18', name: 'Hà Kiều Trinh', costumeId: 'ao-tu-than', costumeName: 'Áo Tứ Thân Kinh Bắc', size: 'S', isPaid: true, paidAt: '29/09/2026 14:40', amountPaid: 1029000, phone: '0912.345.618' },
  { id: 'mem-19', name: 'Lương Quang Huy', costumeId: 'ao-tac', costumeName: 'Áo Tấc Nam Triều Nguyễn', size: 'L', isPaid: true, paidAt: '29/09/2026 15:30', amountPaid: 1255000, phone: '0912.345.619' },
  { id: 'mem-20', name: 'Võ Thảo My', costumeId: 'nhat-binh', costumeName: 'Áo Nhật Bình Cung Đình', size: 'S', isPaid: true, paidAt: '29/09/2026 16:15', amountPaid: 1814000, phone: '0912.345.620' },
  { id: 'mem-21', name: 'Đinh Tiến Đạt', costumeId: 'ao-ngu-than-tay-chen', costumeName: 'Áo Ngũ Thân Tay Chẽn', size: 'XL', isPaid: true, paidAt: '29/09/2026 17:00', amountPaid: 1071000, phone: '0912.345.621' },
  { id: 'mem-22', name: 'Mai Phương Thúy', costumeId: 'ao-dai-co-phuc', costumeName: 'Áo Dài Cổ Phục Nữ', size: 'M', isPaid: true, paidAt: '29/09/2026 17:45', amountPaid: 1042000, phone: '0912.345.622' },
  
  // 8 unpaid members
  { id: 'mem-23', name: 'Nguyễn Tấn Dũng', costumeId: 'ao-tac', costumeName: 'Áo Tấc Nam Triều Nguyễn', size: 'L', isPaid: false, amountPaid: 0, phone: '0912.345.623' },
  { id: 'mem-24', name: 'Lê Thùy Dung', costumeId: 'nhat-binh', costumeName: 'Áo Nhật Bình Cung Đình', size: 'M', isPaid: false, amountPaid: 0, phone: '0912.345.624' },
  { id: 'mem-25', name: 'Trần Gia Hưng', costumeId: 'ao-ngu-than-tay-chen', costumeName: 'Áo Ngũ Thân Tay Chẽn', size: 'M', isPaid: false, amountPaid: 0, phone: '0912.345.625' },
  { id: 'mem-26', name: 'Phạm Thu Trang', costumeId: 'nhat-binh', costumeName: 'Áo Nhật Bình Cung Đình', size: 'S', isPaid: false, amountPaid: 0, phone: '0912.345.626' },
  { id: 'mem-27', name: 'Vũ Hoàng Long', costumeId: 'ao-tac', costumeName: 'Áo Tấc Nam Triều Nguyễn', size: 'XL', isPaid: false, amountPaid: 0, phone: '0912.345.627' },
  { id: 'mem-28', name: 'Hoàng Bảo Ngọc', costumeId: 'ao-tu-than', costumeName: 'Áo Tứ Thân Kinh Bắc', size: 'M', isPaid: false, amountPaid: 0, phone: '0912.345.628' },
  { id: 'mem-29', name: 'Lê Khắc Toàn', costumeId: 'ao-ngu-than-tay-chen', costumeName: 'Áo Ngũ Thân Tay Chẽn', size: 'M', isPaid: false, amountPaid: 0, phone: '0912.345.629' },
  { id: 'mem-30', name: 'Đỗ Thảo Vy', costumeId: 'ao-dai-co-phuc', costumeName: 'Áo Dài Cổ Phục Nữ', size: 'S', isPaid: false, amountPaid: 0, phone: '0912.345.630' },
];

// Pre-configured sample group order (30 people, 22 paid)
const INITIAL_SAMPLE_GROUPS: GroupOrder[] = [
  {
    id: 'GRP-12A1-KYEU',
    name: 'Lớp 12A1 – Kỷ yếu',
    organizerName: 'Nguyễn Hoàng Nam (Lớp trưởng)',
    organizerPhone: '0912.345.601',
    expectedMembers: 30,
    eventDate: '2026-10-18',
    deadlineDate: '2026-10-10',
    location: 'Trường THPT Chuyên Quốc Học Huế / Tiệm Cổ Phục Huế - Đại Nội',
    costumeMode: 'flexible',
    coordinationFee: GROUP_COORDINATION_FEE,
    discountRate: 0.15, // 30 người >= 20 người -> giảm 15%
    members: SAMPLE_MEMBERS,
    status: 'open',
    createdAt: '2026-09-28T08:00:00Z'
  }
];

export function getStoredGroups(): GroupOrder[] {
  try {
    const raw = localStorage.getItem(GROUP_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(GROUP_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_GROUPS));
      return INITIAL_SAMPLE_GROUPS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(GROUP_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_GROUPS));
    return INITIAL_SAMPLE_GROUPS;
  } catch (err) {
    console.error('Error reading group orders from localStorage', err);
    return INITIAL_SAMPLE_GROUPS;
  }
}

export function saveGroups(groups: GroupOrder[]): void {
  try {
    localStorage.setItem(GROUP_STORAGE_KEY, JSON.stringify(groups));
  } catch (err) {
    console.error('Error saving group orders to localStorage', err);
  }
}

export function getGroupById(groupId: string): GroupOrder | undefined {
  const groups = getStoredGroups();
  return groups.find(g => g.id === groupId);
}

export function saveGroup(updatedGroup: GroupOrder): void {
  const groups = getStoredGroups();
  const exists = groups.some(g => g.id === updatedGroup.id);
  const updated = exists 
    ? groups.map(g => g.id === updatedGroup.id ? updatedGroup : g)
    : [updatedGroup, ...groups];
  saveGroups(updated);
}

// Calculate individual member pricing for a given costume and group
export function calculateMemberPricing(
  costumeId: string,
  expectedMembers: number
): {
  originalRental: number;
  discountRate: number;
  discountAmount: number;
  discountedRental: number;
  deposit: number;
  coordinationShare: number;
  totalToPay: number;
} {
  const pricing = COSTUME_PRICING[costumeId] || { pricePerDay: 300000, depositPrice: 1000000 };
  const originalRental = pricing.pricePerDay;
  const discountRate = getGroupDiscountRate(expectedMembers);
  const discountAmount = Math.round(originalRental * discountRate);
  const discountedRental = originalRental - discountAmount;
  const deposit = pricing.depositPrice;
  const coordinationShare = expectedMembers > 0 ? Math.round(GROUP_COORDINATION_FEE / expectedMembers) : 0;
  const totalToPay = discountedRental + deposit + coordinationShare;

  return {
    originalRental,
    discountRate,
    discountAmount,
    discountedRental,
    deposit,
    coordinationShare,
    totalToPay
  };
}

// Calculate entire group cash flow
export function calculateGroupFinancials(group: GroupOrder): {
  totalExpectedPaid: number;
  totalPaidSoFar: number;
  totalPending: number;
  paidCount: number;
  totalRentalPayoutToShop: number;
  totalPlatformRevenue: number;
  totalEscrowDepositHeld: number;
  totalDiscountSaved: number;
} {
  let totalExpectedPaid = 0;
  let totalPaidSoFar = 0;
  let paidCount = 0;
  let totalRentalPayoutToShop = 0;
  let totalEscrowDepositHeld = 0;
  let totalDiscountSaved = 0;

  group.members.forEach(member => {
    const p = calculateMemberPricing(member.costumeId, group.expectedMembers);
    totalExpectedPaid += p.totalToPay;
    if (member.isPaid) {
      paidCount++;
      totalPaidSoFar += member.amountPaid || p.totalToPay;
      totalRentalPayoutToShop += p.discountedRental;
      totalEscrowDepositHeld += p.deposit;
      totalDiscountSaved += p.discountAmount;
    }
  });

  const totalPlatformRevenue = GROUP_COORDINATION_FEE; // Fixed coordination fee goes to platform coordination & logistics

  return {
    totalExpectedPaid,
    totalPaidSoFar,
    totalPending: Math.max(0, totalExpectedPaid - totalPaidSoFar),
    paidCount,
    totalRentalPayoutToShop,
    totalPlatformRevenue,
    totalEscrowDepositHeld,
    totalDiscountSaved
  };
}

// Finalize group order into a single bulk delivery order for My Orders
export function finalizeGroupOrder(groupId: string): RentalOrder | null {
  const group = getGroupById(groupId);
  if (!group) return null;

  const financials = calculateGroupFinancials(group);
  const now = new Date();
  const nowFormatted = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  // Count costumes by size
  const sizeCounts: Record<RentalSize, number> = { S: 0, M: 0, L: 0, XL: 0 };
  const memberBreakdown = group.members.map(m => {
    if (m.size) sizeCounts[m.size] = (sizeCounts[m.size] || 0) + 1;
    return {
      name: m.name,
      costumeName: m.costumeName,
      size: m.size,
      isPaid: m.isPaid,
      amountPaid: m.amountPaid
    };
  });

  const orderId = `VK-GRP-${group.id.replace('GRP-', '')}`;

  const bulkOrder: RentalOrder = {
    id: orderId,
    createdAt: now.toISOString(),
    costumeId: group.defaultCostumeId || 'ao-tac',
    costumeName: `Đơn nhóm: ${group.name} (${group.members.length} bộ)`,
    costumeImage: '/images/ao-tac.jpg',
    period: 'Thời Nguyễn (Kỷ yếu cổ phục)',
    size: 'M',
    storeId: 'store-hue',
    storeName: 'Tiệm Cổ Phục Huế - Đại Nội',
    storeAddress: 'Số 12 Đặng Thái Thân, P. Thuận Thành, TP. Huế',
    storePhone: '0905.123.456',
    startDate: group.eventDate,
    endDate: group.eventDate,
    totalDays: 1,
    deliveryMethod: 'shipping',
    recipientName: group.organizerName,
    recipientPhone: group.organizerPhone,
    recipientAddress: group.location,
    paymentMethod: 'vietqr',
    financials: {
      rentalTotal: financials.totalRentalPayoutToShop,
      depositTotal: financials.totalEscrowDepositHeld,
      platformFee: financials.totalPlatformRevenue,
      shippingFee: 0, // Miễn phí giao nhận đơn nhóm lớn
      totalPaid: financials.totalPaidSoFar,
      partnerPayout: financials.totalRentalPayoutToShop,
      platformRevenue: financials.totalPlatformRevenue,
      depositRefund: financials.totalEscrowDepositHeld,
      deductionAmount: 0,
      coordinationFee: GROUP_COORDINATION_FEE,
      discountAmount: financials.totalDiscountSaved
    },
    escrowStatus: 'holding',
    status: 'da-dat',
    isGroupOrder: true,
    groupOrderSummary: {
      groupId: group.id,
      groupName: group.name,
      totalMembers: group.expectedMembers,
      paidMembersCount: financials.paidCount,
      coordinationFee: GROUP_COORDINATION_FEE,
      discountRate: group.discountRate,
      sizeCounts,
      memberBreakdown
    },
    statusHistory: [
      {
        status: 'da-dat',
        timestamp: nowFormatted,
        note: `Đầu mối ${group.organizerName} đã chốt đơn nhóm "${group.name}". Toàn bộ ${financials.paidCount} phần tiền đã được khóa an toàn trong quỹ VẬN KỲ Escrow.`
      }
    ]
  };

  // Add bulk order to orders storage
  addOrder(bulkOrder);

  // Mark group as finalized
  group.status = 'finalized';
  group.finalizedOrderId = orderId;
  saveGroup(group);

  return bulkOrder;
}
