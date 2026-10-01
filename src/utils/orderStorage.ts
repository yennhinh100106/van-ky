import { RentalOrder, OrderStepStatus, DamageReport } from '../types/rental';
import { COSTUME_PRICING, PARTNER_STORES, PLATFORM_SERVICE_FEE, STANDARD_SHIPPING_FEE } from '../data/partners';

const STORAGE_KEY = 'vanky_rental_orders';

// Initial sample orders for demonstration across all 4 partner boutiques
const SAMPLE_INITIAL_ORDERS: RentalOrder[] = [
  // --- STORE HUẾ (Tiệm Cổ Phục Huế - Đại Nội) ---
  {
    id: 'VK-2026-8812',
    createdAt: '2026-09-27T09:30:00Z',
    costumeId: 'nhat-binh',
    costumeName: 'Áo Nhật Bình Cung Đình',
    costumeImage: '/images/nhat-binh.jpg',
    period: 'Thời Nguyễn (1802 - 1945)',
    size: 'M',
    colorName: 'Đỏ son chu sa',
    colorHex: '#A4161A',
    accessories: ['khan-vanh-day', 'quat-xep-lua'],
    storeId: 'store-hue',
    storeName: 'Tiệm Cổ Phục Huế - Đại Nội',
    storeAddress: 'Số 12 Đặng Thái Thân, P. Thuận Thành, TP. Huế',
    storePhone: '0905.123.456',
    startDate: '2026-09-28',
    endDate: '2026-10-01', // Sắp đến hạn trả trong 1 ngày!
    totalDays: 3,
    deliveryMethod: 'hotel',
    hotelName: 'Khách sạn Azerai La Residence Huế',
    hotelRoom: 'Phòng 204',
    recipientName: 'Nguyễn Thị Hoàng Yến',
    recipientPhone: '0912.345.678',
    paymentMethod: 'vietqr',
    financials: {
      rentalTotal: 1050000,
      depositTotal: 1500000,
      platformFee: PLATFORM_SERVICE_FEE,
      shippingFee: STANDARD_SHIPPING_FEE,
      totalPaid: 2600000,
      partnerPayout: 1050000,
      platformRevenue: PLATFORM_SERVICE_FEE,
      depositRefund: 1500000,
      deductionAmount: 0
    },
    escrowStatus: 'holding',
    status: 'dang-su-dung',
    isConfirmedByStore: true,
    statusHistory: [
      { status: 'da-dat', timestamp: '27/09/2026 09:30', note: 'Đặt cọc & thanh toán an toàn thành công qua VietQR' },
      { status: 'dang-giao', timestamp: '27/09/2026 15:00', note: 'Tiệm đã giao đồ tới lễ tân khách sạn Azerai La Residence' },
      { status: 'dang-su-dung', timestamp: '28/09/2026 08:30', note: 'Khách nhận đồ và chụp ảnh tại Đại Nội' }
    ]
  },
  {
    id: 'VK-2026-1044',
    createdAt: '2026-09-30T04:15:00Z',
    costumeId: 'ao-tac',
    costumeName: 'Áo Tấc Nam Triều Nguyễn',
    costumeImage: '/images/ao-tac.jpg',
    period: 'Thời Nguyễn (1802 - 1945)',
    size: 'L',
    colorName: 'Xanh chàm hoàng gia',
    colorHex: '#1D3557',
    accessories: ['khan-dong', 'quat-xep-lua'],
    storeId: 'store-hue',
    storeName: 'Tiệm Cổ Phục Huế - Đại Nội',
    storeAddress: 'Số 12 Đặng Thái Thân, P. Thuận Thành, TP. Huế',
    storePhone: '0905.123.456',
    startDate: '2026-10-02',
    endDate: '2026-10-04',
    totalDays: 2,
    deliveryMethod: 'hotel',
    hotelName: 'Silk Path Grand Hotel Hue',
    hotelRoom: 'Phòng 512',
    recipientName: 'Vũ Đức Minh',
    recipientPhone: '0909.888.777',
    paymentMethod: 'card',
    financials: {
      rentalTotal: 600000,
      depositTotal: 1200000,
      platformFee: PLATFORM_SERVICE_FEE,
      shippingFee: STANDARD_SHIPPING_FEE,
      photographyFee: 800000,
      makeupFee: 150000,
      experienceTotal: 950000,
      totalPaid: 2770000,
      partnerPayout: 1550000,
      platformRevenue: PLATFORM_SERVICE_FEE,
      depositRefund: 1200000,
      deductionAmount: 0
    },
    experiencePackage: {
      hasPhotography: true,
      photographyPrice: 800000,
      hasMakeup: true,
      makeupPrice: 150000,
      totalExperienceFee: 950000,
      photoScheduleStatus: 'da-xac-nhan',
      photographerName: 'Nhiếp ảnh gia Lê Tuấn (Hue Heritage Photos)',
      makeupArtistName: 'Cố vấn Makeup Diệu Thảo',
      scheduledTime: '08:00 sáng 02/10/2026',
      heritageSpot: 'Đại Nội Huế & Cung Diên Thọ'
    },
    escrowStatus: 'holding',
    status: 'da-dat',
    isConfirmedByStore: false, // CẦN XỬ LÝ HÔM NAY: ĐƠN CHỜ XÁC NHẬN
    statusHistory: [
      { status: 'da-dat', timestamp: '30/09/2026 04:15', note: 'Khách thanh toán cọc qua thẻ Visa. Đang chờ tiệm xác nhận tiếp nhận đơn.' }
    ]
  },
  {
    id: 'VK-2026-9210',
    createdAt: '2026-09-25T11:00:00Z',
    costumeId: 'ao-ngu-than-tay-chen',
    costumeName: 'Áo Ngũ Thân Tay Chẽn',
    costumeImage: '/images/ao-ngu-than-tay-chen.jpg',
    period: 'Thời Nguyễn (1802 - 1945)',
    size: 'XL',
    colorName: 'Nâu sồng thanh đạm',
    colorHex: '#4A3728',
    accessories: ['khan-dong'],
    storeId: 'store-hue',
    storeName: 'Tiệm Cổ Phục Huế - Đại Nội',
    storeAddress: 'Số 12 Đặng Thái Thân, P. Thuận Thành, TP. Huế',
    storePhone: '0905.123.456',
    startDate: '2026-09-26',
    endDate: '2026-09-29',
    totalDays: 3,
    deliveryMethod: 'store',
    recipientName: 'Đặng Tuấn Kiệt',
    recipientPhone: '0918.223.344',
    paymentMethod: 'vietqr',
    financials: {
      rentalTotal: 750000,
      depositTotal: 1000000,
      platformFee: PLATFORM_SERVICE_FEE,
      shippingFee: 0,
      totalPaid: 1780000,
      partnerPayout: 750000,
      platformRevenue: PLATFORM_SERVICE_FEE,
      depositRefund: 1000000,
      deductionAmount: 0
    },
    escrowStatus: 'holding',
    status: 'da-tra-do', // CẦN XỬ LÝ HÔM NAY: CHỜ KIỂM TRA ĐỒ TRẢ
    statusHistory: [
      { status: 'da-dat', timestamp: '25/09/2026 11:00', note: 'Đặt cọc thành công' },
      { status: 'dang-giao', timestamp: '25/09/2026 16:00', note: 'Đồ sẵn sàng tại tiệm' },
      { status: 'dang-su-dung', timestamp: '26/09/2026 09:00', note: 'Khách nhận đồ dạo phố' },
      { status: 'da-tra-do', timestamp: '29/09/2026 17:30', note: 'Khách hoàn trả tại quầy tiệm. Chờ nhân viên nghiệm thu sợi vải và khuy cài.' }
    ]
  },
  {
    id: 'VK-GRP-12A1',
    createdAt: '2026-09-28T08:00:00Z',
    costumeId: 'ao-tac',
    costumeName: 'Đơn nhóm: Lớp 12A1 – Kỷ yếu (30 bộ)',
    costumeImage: '/images/ao-tac.jpg',
    period: 'Thời Nguyễn (Kỷ yếu cổ phục)',
    size: 'M',
    storeId: 'store-hue',
    storeName: 'Tiệm Cổ Phục Huế - Đại Nội',
    storeAddress: 'Số 12 Đặng Thái Thân, P. Thuận Thành, TP. Huế',
    storePhone: '0905.123.456',
    startDate: '2026-10-18',
    endDate: '2026-10-18',
    totalDays: 1,
    deliveryMethod: 'shipping',
    recipientName: 'Nguyễn Hoàng Nam (Lớp trưởng)',
    recipientPhone: '0912.345.601',
    recipientAddress: 'Trường THPT Chuyên Quốc Học Huế / Tiệm Cổ Phục Huế',
    paymentMethod: 'vietqr',
    financials: {
      rentalTotal: 7777500,
      depositTotal: 29700000,
      platformFee: 500000,
      shippingFee: 0,
      totalPaid: 30129000,
      partnerPayout: 7777500,
      platformRevenue: 500000,
      depositRefund: 29700000,
      deductionAmount: 0,
      coordinationFee: 500000,
      discountAmount: 1372500
    },
    escrowStatus: 'holding',
    status: 'da-dat',
    isConfirmedByStore: true,
    isGroupOrder: true,
    groupOrderSummary: {
      groupId: 'GRP-12A1-KYEU',
      groupName: 'Lớp 12A1 – Kỷ yếu',
      totalMembers: 30,
      paidMembersCount: 22,
      coordinationFee: 500000,
      discountRate: 0.15,
      sizeCounts: { S: 7, M: 12, L: 8, XL: 3 },
      memberBreakdown: [
        { name: 'Nguyễn Hoàng Nam (Lớp trưởng)', costumeName: 'Áo Tấc Nam Triều Nguyễn', size: 'L', isPaid: true, amountPaid: 1255000 },
        { name: 'Trần Thị Thu Thảo (Bí thư)', costumeName: 'Áo Nhật Bình Cung Đình', size: 'M', isPaid: true, amountPaid: 1814000 },
        { name: 'Lê Văn Minh', costumeName: 'Áo Ngũ Thân Tay Chẽn', size: 'M', isPaid: true, amountPaid: 1071000 },
        { name: 'Phạm Quỳnh Anh', costumeName: 'Áo Nhật Bình Cung Đình', size: 'S', isPaid: true, amountPaid: 1814000 },
        { name: 'Vũ Đức Duy', costumeName: 'Áo Tấc Nam Triều Nguyễn', size: 'XL', isPaid: true, amountPaid: 1255000 },
        { name: 'Hoàng Mai Phương', costumeName: 'Áo Tứ Thân Kinh Bắc', size: 'M', isPaid: true, amountPaid: 1029000 },
        { name: 'Đặng Tuấn Kiệt', costumeName: 'Áo Ngũ Thân Tay Chẽn', size: 'L', isPaid: true, amountPaid: 1071000 },
        { name: 'Bùi Thị Thanh Hằng', costumeName: 'Áo Nhật Bình Cung Đình', size: 'M', isPaid: true, amountPaid: 1814000 }
      ]
    },
    statusHistory: [
      { status: 'da-dat', timestamp: '28/09/2026 08:00', note: 'Đầu mối đã chốt đơn nhóm kỷ yếu 30 bộ. Quỹ VẬN KỲ đã khóa bảo chứng tiền cọc.' }
    ]
  },
  {
    id: 'VK-2026-3401',
    createdAt: '2026-09-29T16:00:00Z',
    costumeId: 'ao-dai',
    costumeName: 'Áo Dài Cổ Phục Nữ',
    costumeImage: '/images/ao-dai.jpg',
    period: 'Thời Nguyễn (Cổ phục cung đình)',
    size: 'S',
    colorName: 'Hồng sen thanh nhã',
    colorHex: '#C97A7E',
    accessories: ['khan-vanh-day'],
    storeId: 'store-hue',
    storeName: 'Tiệm Cổ Phục Huế - Đại Nội',
    storeAddress: 'Số 12 Đặng Thái Thân, P. Thuận Thành, TP. Huế',
    storePhone: '0905.123.456',
    startDate: '2026-09-30', // Bắt đầu hôm nay -> CẦN XỬ LÝ HÔM NAY: ĐỒ CẦN GIAO
    endDate: '2026-10-02',
    totalDays: 2,
    deliveryMethod: 'store',
    recipientName: 'Phạm Thúy Hằng',
    recipientPhone: '0945.667.889',
    paymentMethod: 'vietqr',
    financials: {
      rentalTotal: 500000,
      depositTotal: 1000000,
      platformFee: PLATFORM_SERVICE_FEE,
      shippingFee: 0,
      totalPaid: 1530000,
      partnerPayout: 500000,
      platformRevenue: PLATFORM_SERVICE_FEE,
      depositRefund: 1000000,
      deductionAmount: 0
    },
    escrowStatus: 'holding',
    status: 'dang-giao',
    isConfirmedByStore: true,
    statusHistory: [
      { status: 'da-dat', timestamp: '29/09/2026 16:00', note: 'Đặt cọc thành công' },
      { status: 'dang-giao', timestamp: '30/09/2026 07:30', note: 'Trang phục đã giặt hấp và sẵn sàng tại tiệm chờ khách ghé lấy' }
    ]
  },

  // --- STORE HÀ NỘI (Đại Việt Cổ Y - Thăng Long) ---
  {
    id: 'VK-2026-7925',
    createdAt: '2026-09-24T14:15:00Z',
    costumeId: 'ao-vien-linh',
    costumeName: 'Áo Viên Lĩnh Thêu Bổ Tử',
    costumeImage: '/images/ao-vien-linh.jpg',
    period: 'Thời Lê Sơ (1428 - 1527)',
    size: 'L',
    colorName: 'Xanh lục bảo sẫm',
    colorHex: '#1B4332',
    accessories: ['khan-dong', 'that-lung-lua'],
    storeId: 'store-hanoi',
    storeName: 'Đại Việt Cổ Y - Thăng Long',
    storeAddress: '28 Phố Hàng Bạc, Q. Hoàn Kiếm, Hà Nội',
    storePhone: '0912.888.999',
    startDate: '2026-09-25',
    endDate: '2026-09-28',
    totalDays: 3,
    deliveryMethod: 'shipping',
    recipientName: 'Trần Văn Hoàng Nam',
    recipientPhone: '0988.765.432',
    recipientAddress: 'Tòa nhà Landmark 72, Đường Phạm Hùng, Q. Nam Từ Liêm, Hà Nội',
    paymentMethod: 'card',
    financials: {
      rentalTotal: 1260000,
      depositTotal: 1800000,
      platformFee: PLATFORM_SERVICE_FEE,
      shippingFee: STANDARD_SHIPPING_FEE,
      totalPaid: 3130000,
      partnerPayout: 1260000,
      platformRevenue: PLATFORM_SERVICE_FEE,
      depositRefund: 1800000,
      deductionAmount: 0
    },
    escrowStatus: 'holding',
    status: 'da-tra-do',
    isConfirmedByStore: true,
    statusHistory: [
      { status: 'da-dat', timestamp: '24/09/2026 14:15', note: 'Thanh toán thẻ Visa qua VẬN KỲ Escrow bảo chứng' },
      { status: 'dang-giao', timestamp: '24/09/2026 17:30', note: 'Shipper đã giao tận nơi trang phục kèm phụ kiện' },
      { status: 'dang-su-dung', timestamp: '25/09/2026 09:00', note: 'Khách nhận đồ và chụp ảnh tại Hoàng thành Thăng Long' },
      { status: 'da-tra-do', timestamp: '28/09/2026 18:00', note: 'Khách đã gửi trả đồ về tiệm, tiệm đang tiến hành kiểm tra hiện trạng' }
    ]
  },
  {
    id: 'VK-2026-5521',
    createdAt: '2026-09-28T10:30:00Z',
    costumeId: 'ao-giao-linh',
    costumeName: 'Áo Giao Lĩnh Thắt Vạt',
    costumeImage: '/images/ao-giao-linh.jpg',
    period: 'Thời Lê Trung Hưng (1533 - 1789)',
    size: 'M',
    colorName: 'Xanh chàm thẫm',
    colorHex: '#14213D',
    accessories: ['that-lung-lua'],
    storeId: 'store-hanoi',
    storeName: 'Đại Việt Cổ Y - Thăng Long',
    storeAddress: '28 Phố Hàng Bạc, Q. Hoàn Kiếm, Hà Nội',
    storePhone: '0912.888.999',
    startDate: '2026-09-29',
    endDate: '2026-10-02', // Sắp hết hạn trong 2 ngày
    totalDays: 3,
    deliveryMethod: 'store',
    recipientName: 'Lý Trọng Nghĩa',
    recipientPhone: '0936.554.433',
    paymentMethod: 'vietqr',
    financials: {
      rentalTotal: 1050000,
      depositTotal: 1500000,
      platformFee: PLATFORM_SERVICE_FEE,
      shippingFee: 0,
      totalPaid: 2580000,
      partnerPayout: 1050000,
      platformRevenue: PLATFORM_SERVICE_FEE,
      depositRefund: 1500000,
      deductionAmount: 0
    },
    escrowStatus: 'holding',
    status: 'dang-su-dung',
    isConfirmedByStore: true,
    statusHistory: [
      { status: 'da-dat', timestamp: '28/09/2026 10:30', note: 'Đặt cọc thành công' },
      { status: 'dang-giao', timestamp: '28/09/2026 17:00', note: 'Đồ sẵn sàng tại Hàng Bạc' },
      { status: 'dang-su-dung', timestamp: '29/09/2026 08:30', note: 'Khách nhận đồ đi Văn Miếu' }
    ]
  },
  {
    id: 'VK-2026-4190',
    createdAt: '2026-09-20T09:00:00Z',
    costumeId: 'ao-tu-than',
    costumeName: 'Áo Tứ Thân Kinh Bắc',
    costumeImage: '/images/ao-tu-than.jpg',
    period: 'Truyền thống Dân gian',
    size: 'S',
    colorName: 'Nâu non phối yếm đào',
    colorHex: '#A26769',
    accessories: ['non-quai-thao'],
    storeId: 'store-hanoi',
    storeName: 'Đại Việt Cổ Y - Thăng Long',
    storeAddress: '28 Phố Hàng Bạc, Q. Hoàn Kiếm, Hà Nội',
    storePhone: '0912.888.999',
    startDate: '2026-09-21',
    endDate: '2026-09-22',
    totalDays: 1,
    deliveryMethod: 'store',
    recipientName: 'Hoàng Mai Phương',
    recipientPhone: '0904.332.211',
    paymentMethod: 'vietqr',
    financials: {
      rentalTotal: 250000,
      depositTotal: 800000,
      platformFee: PLATFORM_SERVICE_FEE,
      shippingFee: 0,
      totalPaid: 1080000,
      partnerPayout: 250000,
      platformRevenue: PLATFORM_SERVICE_FEE,
      depositRefund: 800000,
      deductionAmount: 0
    },
    escrowStatus: 'disbursed',
    status: 'hoan-coc',
    isConfirmedByStore: true,
    damageReport: {
      isDamaged: false,
      type: 'none',
      description: 'Áo tứ thân và nón quai thao nguyên vẹn, sạch đẹp.',
      deductionAmount: 0,
      inspectionNote: 'Nghiệm thu đạt chuẩn 100%. Đã hoàn cọc đầy đủ cho khách.'
    },
    statusHistory: [
      { status: 'da-dat', timestamp: '20/09/2026 09:00', note: 'Đặt đơn thành công' },
      { status: 'dang-giao', timestamp: '20/09/2026 15:00', note: 'Sẵn sàng tại tiệm' },
      { status: 'dang-su-dung', timestamp: '21/09/2026 08:00', note: 'Khách nhận đồ' },
      { status: 'da-tra-do', timestamp: '22/09/2026 18:00', note: 'Khách hoàn trả đồ' },
      { status: 'hoan-coc', timestamp: '23/09/2026 09:30', note: 'VẬN KỲ đã hoàn 800.000đ tiền cọc về tài khoản khách' }
    ]
  },

  // --- STORE HỘI AN (Tiệm May & Cổ Phục Phố Hội) ---
  {
    id: 'VK-2026-6540',
    createdAt: '2026-09-18T10:00:00Z',
    costumeId: 'ao-tac',
    costumeName: 'Áo Tấc Nam Triều Nguyễn',
    costumeImage: '/images/ao-tac.jpg',
    period: 'Thời Nguyễn (1802 - 1945)',
    size: 'M',
    colorName: 'Xanh chàm cổ',
    colorHex: '#1D3557',
    accessories: ['khan-dong'],
    storeId: 'store-hoian',
    storeName: 'Tiệm May & Cổ Phục Phố Hội',
    storeAddress: '45 Trần Phú, P. Minh An, TP. Hội An, Quảng Nam',
    storePhone: '0935.678.910',
    startDate: '2026-09-19',
    endDate: '2026-09-20',
    totalDays: 1,
    deliveryMethod: 'store',
    recipientName: 'Lê Minh Khang',
    recipientPhone: '0903.999.888',
    paymentMethod: 'momo',
    financials: {
      rentalTotal: 280000,
      depositTotal: 1000000,
      platformFee: PLATFORM_SERVICE_FEE,
      shippingFee: 0,
      totalPaid: 1310000,
      partnerPayout: 280000,
      platformRevenue: PLATFORM_SERVICE_FEE,
      depositRefund: 1000000,
      deductionAmount: 0
    },
    escrowStatus: 'disbursed',
    status: 'hoan-coc',
    isConfirmedByStore: true,
    damageReport: {
      isDamaged: false,
      type: 'none',
      description: 'Trang phục và phụ kiện hoàn hảo, sạch sẽ, không sút chỉ.',
      deductionAmount: 0,
      inspectionNote: 'Đạt chuẩn kiểm duyệt 100%. Đã kích hoạt lệnh hoàn toàn bộ tiền cọc cho khách.'
    },
    statusHistory: [
      { status: 'da-dat', timestamp: '18/09/2026 10:00', note: 'Đặt đơn thành công' },
      { status: 'dang-giao', timestamp: '18/09/2026 16:00', note: 'Sẵn sàng tại tiệm Hội An' },
      { status: 'dang-su-dung', timestamp: '19/09/2026 08:00', note: 'Khách nhận đồ' },
      { status: 'da-tra-do', timestamp: '20/09/2026 18:30', note: 'Khách hoàn trả tại tiệm' },
      { status: 'hoan-coc', timestamp: '21/09/2026 09:00', note: 'Kiểm tra hoàn hảo. VẬN KỲ đã hoàn 1.000.000đ về ví MoMo của khách' }
    ]
  },
  {
    id: 'VK-2026-7102',
    createdAt: '2026-09-29T14:20:00Z',
    costumeId: 'ao-dai',
    costumeName: 'Áo Dài Cổ Phục Nữ',
    costumeImage: '/images/ao-dai.jpg',
    period: 'Thời Nguyễn (1802 - 1945)',
    size: 'M',
    colorName: 'Vàng hoàng yến quý phái',
    colorHex: '#D4A347',
    accessories: ['khan-vanh-day', 'quat-xep-lua'],
    storeId: 'store-hoian',
    storeName: 'Tiệm May & Cổ Phục Phố Hội',
    storeAddress: '45 Trần Phú, P. Minh An, TP. Hội An, Quảng Nam',
    storePhone: '0935.678.910',
    startDate: '2026-10-01',
    endDate: '2026-10-03',
    totalDays: 2,
    deliveryMethod: 'hotel',
    hotelName: 'Anantara Hoi An Resort',
    hotelRoom: 'Villa 12',
    recipientName: 'Bùi Thị Bích Ngọc',
    recipientPhone: '0919.445.566',
    paymentMethod: 'card',
    financials: {
      rentalTotal: 500000,
      depositTotal: 1000000,
      platformFee: PLATFORM_SERVICE_FEE,
      shippingFee: STANDARD_SHIPPING_FEE,
      photographyFee: 800000,
      makeupFee: 150000,
      experienceTotal: 950000,
      totalPaid: 2520000,
      partnerPayout: 1450000,
      platformRevenue: PLATFORM_SERVICE_FEE,
      depositRefund: 1000000,
      deductionAmount: 0
    },
    experiencePackage: {
      hasPhotography: true,
      photographyPrice: 800000,
      hasMakeup: true,
      makeupPrice: 150000,
      totalExperienceFee: 950000,
      photoScheduleStatus: 'da-xac-nhan',
      photographerName: 'Hội An Memories Studio',
      makeupArtistName: 'Chuyên viên Ánh Tuyết',
      scheduledTime: '15:30 chiều 01/10/2026',
      heritageSpot: 'Chùa Cầu & Bến thuyền sông Hoài Hội An'
    },
    escrowStatus: 'holding',
    status: 'da-dat',
    isConfirmedByStore: true,
    statusHistory: [
      { status: 'da-dat', timestamp: '29/09/2026 14:20', note: 'Tiệm Hội An đã xác nhận lịch chụp ảnh và chuẩn bị trang phục' }
    ]
  },

  // --- STORE TP.HCM (Vận Kỳ Sài Gòn - Nam Bộ Cổ Các) ---
  {
    id: 'VK-2026-8319',
    createdAt: '2026-09-28T15:00:00Z',
    costumeId: 'ao-dai-cach-tan',
    costumeName: 'Áo Dài Cách Tân Hiện Đại',
    costumeImage: '/images/ao-dai-cach-tan.jpg',
    period: 'Hiện đại & Giao thoa',
    size: 'L',
    colorName: 'Đỏ ruby tiệc tối',
    colorHex: '#800020',
    accessories: ['quat-xep-lua'],
    storeId: 'store-hcm',
    storeName: 'Vận Kỳ Sài Gòn - Nam Bộ Cổ Các',
    storeAddress: '184 Nam Kỳ Khởi Nghĩa, P. Võ Thị Sáu, Quận 3, TP.HCM',
    storePhone: '0988.334.455',
    startDate: '2026-09-29',
    endDate: '2026-10-01', // Sắp hết hạn trong 1 ngày
    totalDays: 2,
    deliveryMethod: 'shipping',
    recipientName: 'Mai Phương Thúy',
    recipientPhone: '0908.776.655',
    recipientAddress: 'Chung cư Vinhomes Central Park, Bình Thạnh, TP.HCM',
    paymentMethod: 'card',
    financials: {
      rentalTotal: 500000,
      depositTotal: 800000,
      platformFee: PLATFORM_SERVICE_FEE,
      shippingFee: STANDARD_SHIPPING_FEE,
      totalPaid: 1370000,
      partnerPayout: 500000,
      platformRevenue: PLATFORM_SERVICE_FEE,
      depositRefund: 800000,
      deductionAmount: 0
    },
    escrowStatus: 'holding',
    status: 'dang-su-dung',
    isConfirmedByStore: true,
    statusHistory: [
      { status: 'da-dat', timestamp: '28/09/2026 15:00', note: 'Đặt cọc thành công' },
      { status: 'dang-giao', timestamp: '28/09/2026 18:00', note: 'Shipper giao hỏa tốc tại Quận 3' },
      { status: 'dang-su-dung', timestamp: '29/09/2026 09:00', note: 'Khách nhận đồ dự sự kiện văn hóa Nam Bộ' }
    ]
  },
  {
    id: 'VK-2026-2940',
    createdAt: '2026-09-30T03:00:00Z',
    costumeId: 'nhat-binh',
    costumeName: 'Áo Nhật Bình Cung Đình',
    costumeImage: '/images/nhat-binh.jpg',
    period: 'Thời Nguyễn (1802 - 1945)',
    size: 'S',
    colorName: 'Xanh ngọc bích',
    colorHex: '#2A9D8F',
    accessories: ['khan-vanh-day'],
    storeId: 'store-hcm',
    storeName: 'Vận Kỳ Sài Gòn - Nam Bộ Cổ Các',
    storeAddress: '184 Nam Kỳ Khởi Nghĩa, P. Võ Thị Sáu, Quận 3, TP.HCM',
    storePhone: '0988.334.455',
    startDate: '2026-10-03',
    endDate: '2026-10-05',
    totalDays: 2,
    deliveryMethod: 'store',
    recipientName: 'Lâm Thục Uyên',
    recipientPhone: '0977.123.456',
    paymentMethod: 'vietqr',
    financials: {
      rentalTotal: 700000,
      depositTotal: 1500000,
      platformFee: PLATFORM_SERVICE_FEE,
      shippingFee: 0,
      totalPaid: 2230000,
      partnerPayout: 700000,
      platformRevenue: PLATFORM_SERVICE_FEE,
      depositRefund: 1500000,
      deductionAmount: 0
    },
    escrowStatus: 'holding',
    status: 'da-dat',
    isConfirmedByStore: false, // Chờ xác nhận
    statusHistory: [
      { status: 'da-dat', timestamp: '30/09/2026 03:00', note: 'Đơn mới đặt qua VietQR, chờ tiệm Sài Gòn xác nhận' }
    ]
  }
];

export function getStoredOrders(): RentalOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_INITIAL_ORDERS));
      return SAMPLE_INITIAL_ORDERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_INITIAL_ORDERS));
    return SAMPLE_INITIAL_ORDERS;
  } catch (err) {
    console.error('Error reading orders from localStorage', err);
    return SAMPLE_INITIAL_ORDERS;
  }
}

export function saveOrders(orders: RentalOrder[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('Error saving orders to localStorage', err);
  }
}

export function addOrder(order: RentalOrder): void {
  const current = getStoredOrders();
  const updated = [order, ...current];
  saveOrders(updated);
}

export function updateOrder(updatedOrder: RentalOrder): void {
  const current = getStoredOrders();
  const updated = current.map(o => o.id === updatedOrder.id ? updatedOrder : o);
  saveOrders(updated);
}

// Check date overlap for same costume in active orders
export function checkDateConflict(
  costumeId: string,
  startDate: string,
  endDate: string,
  excludeOrderId?: string
): { isConflict: boolean; conflictingOrder?: RentalOrder } {
  const orders = getStoredOrders();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  for (const order of orders) {
    // Only check active orders (not completed/refunded)
    if (order.costumeId === costumeId && order.status !== 'hoan-coc') {
      if (excludeOrderId && order.id === excludeOrderId) continue;

      const orderStart = new Date(order.startDate).getTime();
      const orderEnd = new Date(order.endDate).getTime();

      // Overlap condition: (StartA <= EndB) and (EndA >= StartB)
      if (start <= orderEnd && end >= orderStart) {
        return { isConflict: true, conflictingOrder: order };
      }
    }
  }

  return { isConflict: false };
}

// Next Status Progression Helper
export const STATUS_SEQUENCE: OrderStepStatus[] = [
  'da-dat',
  'dang-giao',
  'dang-su-dung',
  'da-tra-do',
  'hoan-coc'
];

export const STATUS_LABELS: Record<OrderStepStatus, { label: string; subtext: string; color: string }> = {
  'da-dat': {
    label: 'Đã đặt cọc',
    subtext: 'Tiền bảo chứng trong quỹ VẬN KỲ · Tiệm đang chuẩn bị đồ',
    color: '#B8862B'
  },
  'dang-giao': {
    label: 'Đang giao / Sẵn sàng',
    subtext: 'Shipper đang giao hoặc Khách có thể ghé tiệm lấy',
    color: '#0068FF'
  },
  'dang-su-dung': {
    label: 'Đang sử dụng',
    subtext: 'Khách đang mặc trang phục và trải nghiệm di sản',
    color: '#2D6A4F'
  },
  'da-tra-do': {
    label: 'Đã trả đồ',
    subtext: 'Tiệm đối tác đang kiểm tra hiện trạng vải & phụ kiện',
    color: '#9333EA'
  },
  'hoan-coc': {
    label: 'Hoàn tất & Hoàn cọc',
    subtext: 'Đã giải ngân tiền thuê cho tiệm & Hoàn cọc cho khách',
    color: '#16A34A'
  }
};

// Create a fast test order to demonstrate full rental cycle
export function createTestOrder(targetStoreId: string = 'store-hue'): RentalOrder {
  const store = PARTNER_STORES.find(s => s.id === targetStoreId) || PARTNER_STORES[0];
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const newId = `VK-TEST-${randNum}`;
  const now = new Date();
  
  const testOrder: RentalOrder = {
    id: newId,
    createdAt: now.toISOString(),
    costumeId: 'nhat-binh',
    costumeName: 'Áo Nhật Bình Cung Đình (Đơn Thử)',
    costumeImage: '/images/nhat-binh.jpg',
    period: 'Thời Nguyễn (1802 - 1945)',
    size: 'M',
    colorName: 'Đỏ son chu sa',
    colorHex: '#A4161A',
    accessories: ['khan-vanh-day', 'quat-xep-lua'],
    storeId: store.id,
    storeName: store.name,
    storeAddress: store.address,
    storePhone: store.phone,
    startDate: '2026-10-01',
    endDate: '2026-10-03',
    totalDays: 2,
    deliveryMethod: 'hotel',
    hotelName: 'Silk Path Grand Hotel Hue',
    hotelRoom: 'Phòng 306',
    recipientName: 'Đặng Mai Phương (Khách thử nghiệm)',
    recipientPhone: '0938.889.999',
    paymentMethod: 'vietqr',
    financials: {
      rentalTotal: 700000,
      depositTotal: 1500000,
      platformFee: PLATFORM_SERVICE_FEE,
      shippingFee: STANDARD_SHIPPING_FEE,
      photographyFee: 800000,
      makeupFee: 150000,
      experienceTotal: 950000,
      totalPaid: 3330000,
      partnerPayout: 1650000,
      platformRevenue: PLATFORM_SERVICE_FEE,
      depositRefund: 1500000,
      deductionAmount: 0
    },
    experiencePackage: {
      hasPhotography: true,
      photographyPrice: 800000,
      hasMakeup: true,
      makeupPrice: 150000,
      totalExperienceFee: 950000,
      photoScheduleStatus: 'da-xac-nhan',
      photographerName: 'Minh Trí Media (Huế Heritage)',
      makeupArtistName: 'Chuyên gia Hoàng Yến Makeup',
      scheduledTime: '08:30 sáng 02/10/2026',
      heritageSpot: 'Đại Nội Huế & Cung An Định'
    },
    escrowStatus: 'holding',
    status: 'da-dat',
    isConfirmedByStore: false,
    statusHistory: [
      {
        status: 'da-dat',
        timestamp: `${now.toLocaleDateString('vi-VN')} ${now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
        note: 'Đơn thử nghiệm mới tạo thành công qua VẬN KỲ Escrow. Đang chờ chủ tiệm duyệt & chuẩn bị trang phục.'
      }
    ]
  };

  addOrder(testOrder);
  return testOrder;
}

