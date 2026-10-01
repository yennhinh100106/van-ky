export type RentalSize = 'S' | 'M' | 'L' | 'XL';

export interface PartnerStore {
  id: string;
  name: string;
  city: 'hue' | 'hanoi' | 'hoian' | 'hcm';
  cityName: string;
  address: string;
  phone: string;
  rating: number;
  highlight: string;
  stockByCostume: Record<string, Record<RentalSize, number>>; // costumeId -> size -> quantity
}

export interface RentalCostumePricing {
  costumeId: string;
  pricePerDay: number; // e.g. 350000
  depositPrice: number; // e.g. 1500000
  defaultStoreId: string;
  sizes: RentalSize[];
  sizeGuides: Record<RentalSize, string>;
}

export type OrderStepStatus = 
  | 'da-dat'        // 1. Đã đặt (Đang chuẩn bị đồ)
  | 'dang-giao'      // 2. Đang giao (hoặc Đã sẵn sàng tại tiệm)
  | 'dang-su-dung'   // 3. Đang sử dụng (Khách đang mặc đồ)
  | 'da-tra-do'      // 4. Đã trả đồ (Tiệm đang kiểm tra)
  | 'hoan-coc';      // 5. Hoàn cọc (Giao dịch hoàn tất)

export interface DamageReport {
  isDamaged: boolean;
  type: 'none' | 'minor-stain' | 'thread-pull' | 'major';
  description: string;
  deductionAmount: number; // số tiền trừ cọc
  photoUrl?: string;
  inspectionNote: string;
}

export interface EscrowFinancialBreakdown {
  rentalTotal: number;       // Tiền thuê (ngày * giá ngày)
  depositTotal: number;      // Tiền cọc gốc
  platformFee: number;       // Phí dịch vụ sàn (ví dụ 30.000đ)
  shippingFee: number;       // Phí giao nhận (0đ nếu nhận tại tiệm)
  photographyFee?: number;   // Chụp ảnh tại điểm di sản (800.000đ/buổi)
  makeupFee?: number;        // Trang điểm & làm tóc (150.000đ/người)
  experienceTotal?: number;  // Tổng gói trải nghiệm
  coordinationFee?: number;  // Phí điều phối đơn nhóm (nếu có)
  discountAmount?: number;   // Giảm giá nhóm (10% hoặc 15%)
  totalPaid: number;          // Khách trả lúc đầu = rental + deposit + fee + ship + experience
  
  // Sau khi kiểm tra đồ:
  partnerPayout: number;     // Tiền chuyển tiệm (rentalTotal + experience dịch vụ đối tác)
  platformRevenue: number;   // Phí sàn giữ lại
  depositRefund: number;     // Cọc hoàn trả khách (= depositTotal - deductionAmount)
  deductionAmount: number;   // Số tiền bồi thường khấu trừ
}

export interface ExperiencePackage {
  hasPhotography: boolean;
  photographyPrice: number; // 800.000đ/buổi
  hasMakeup: boolean;
  makeupPrice: number; // 150.000đ/người
  totalExperienceFee: number;
  photoScheduleStatus: 'da-xac-nhan' | 'cho-xac-nhan' | 'da-chup'; // "Đã xác nhận lịch chụp"
  photographerName?: string;
  makeupArtistName?: string;
  scheduledTime?: string;
  heritageSpot?: string;
}

export interface GroupOrderSummary {
  groupId: string;
  groupName: string;
  totalMembers: number;
  paidMembersCount: number;
  coordinationFee: number;
  discountRate: number;
  sizeCounts: Record<RentalSize, number>;
  memberBreakdown: {
    name: string;
    costumeName: string;
    size: RentalSize;
    isPaid: boolean;
    amountPaid: number;
  }[];
}

export interface RentalOrder {
  id: string; // e.g. VK-2026-8812
  createdAt: string;
  costumeId: string;
  costumeName: string;
  costumeImage: string;
  period: string;
  size: RentalSize;
  colorName?: string;
  colorHex?: string;
  accessories?: string[];

  // Tiệm đối tác
  storeId: string;
  storeName: string;
  storeAddress: string;
  storePhone: string;

  // Thời gian thuê
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  totalDays: number;

  // Phương thức nhận đồ
  deliveryMethod: 'store' | 'shipping' | 'hotel';
  recipientName: string;
  recipientPhone: string;
  recipientAddress?: string;
  hotelName?: string;
  hotelRoom?: string;

  // Tài chính & Escrow
  paymentMethod: 'vietqr' | 'card' | 'momo';
  financials: EscrowFinancialBreakdown;
  escrowStatus: 'holding' | 'disbursed';

  // Tiến trình 5 bước
  status: OrderStepStatus;
  isConfirmedByStore?: boolean;
  statusHistory: {
    status: OrderStepStatus;
    timestamp: string;
    note: string;
  }[];

  // Gói trải nghiệm & Đơn nhóm
  experiencePackage?: ExperiencePackage;
  isGroupOrder?: boolean;
  groupOrderSummary?: GroupOrderSummary;

  // Kiểm tra trả đồ
  damageReport?: DamageReport;
}
