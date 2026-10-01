import { PartnerStore, RentalCostumePricing, RentalSize } from '../types/rental';

export const PARTNER_STORES: PartnerStore[] = [
  {
    id: 'store-hue',
    name: 'Tiệm Cổ Phục Huế - Đại Nội',
    city: 'hue',
    cityName: 'Thành phố Huế',
    address: 'Số 12 Đặng Thái Thân, P. Thuận Thành, TP. Huế (Cách cửa Hiển Nhơn 200m)',
    phone: '0905.123.456',
    rating: 4.9,
    highlight: 'Chuyên Áo Nhật Bình, Áo Tấc hoàng gia thêu tay chuẩn quy chế triều Nguyễn',
    stockByCostume: {
      'nhat-binh': { S: 3, M: 4, L: 2, XL: 1 },
      'ao-tac': { S: 4, M: 5, L: 3, XL: 2 },
      'ao-ngu-than-tay-chen': { S: 3, M: 4, L: 3, XL: 1 },
      'ao-dai': { S: 5, M: 5, L: 4, XL: 2 },
      'ao-vien-linh': { S: 2, M: 3, L: 2, XL: 1 },
      'ao-giao-linh': { S: 2, M: 2, L: 2, XL: 1 },
      'ao-tu-than': { S: 2, M: 3, L: 2, XL: 1 },
      'ao-dai-cach-tan': { S: 4, M: 5, L: 3, XL: 2 }
    }
  },
  {
    id: 'store-hanoi',
    name: 'Đại Việt Cổ Y - Thăng Long',
    city: 'hanoi',
    cityName: 'Thủ đô Hà Nội',
    address: '28 Phố Hàng Bạc, Q. Hoàn Kiếm, Hà Nội (Gần Hoàng thành Thăng Long)',
    phone: '0912.888.999',
    rating: 4.95,
    highlight: 'Chuyên Viên Lĩnh, Giao Lĩnh thời Lý - Trần - Lê, lụa Vạn Phúc thủ công',
    stockByCostume: {
      'ao-vien-linh': { S: 3, M: 4, L: 3, XL: 2 },
      'ao-giao-linh': { S: 3, M: 4, L: 3, XL: 2 },
      'ao-tu-than': { S: 4, M: 5, L: 3, XL: 2 },
      'nhat-binh': { S: 2, M: 3, L: 2, XL: 1 },
      'ao-tac': { S: 3, M: 4, L: 2, XL: 1 },
      'ao-ngu-than-tay-chen': { S: 3, M: 3, L: 2, XL: 1 },
      'ao-dai': { S: 4, M: 5, L: 4, XL: 2 },
      'ao-dai-cach-tan': { S: 5, M: 6, L: 4, XL: 2 }
    }
  },
  {
    id: 'store-hoian',
    name: 'Tiệm May & Cổ Phục Phố Hội',
    city: 'hoian',
    cityName: 'Phố Cổ Hội An',
    address: '45 Trần Phú, P. Minh An, TP. Hội An, Quảng Nam',
    phone: '0935.678.910',
    rating: 4.85,
    highlight: 'Chuyên Áo Tấc, Ngũ thân dạo phố cổ, chụp ảnh kỷ niệm nón quai thao lụa',
    stockByCostume: {
      'ao-tac': { S: 4, M: 5, L: 3, XL: 2 },
      'ao-ngu-than-tay-chen': { S: 4, M: 4, L: 3, XL: 2 },
      'ao-dai': { S: 5, M: 6, L: 4, XL: 2 },
      'ao-tu-than': { S: 3, M: 4, L: 2, XL: 1 },
      'nhat-binh': { S: 2, M: 3, L: 2, XL: 1 },
      'ao-vien-linh': { S: 1, M: 2, L: 2, XL: 1 },
      'ao-giao-linh': { S: 2, M: 2, L: 2, XL: 1 },
      'ao-dai-cach-tan': { S: 5, M: 5, L: 4, XL: 2 }
    }
  },
  {
    id: 'store-hcm',
    name: 'Vận Kỳ Sài Gòn - Nam Bộ Cổ Các',
    city: 'hcm',
    cityName: 'TP. Hồ Chí Minh',
    address: '184 Nam Kỳ Khởi Nghĩa, P. Võ Thị Sáu, Quận 3, TP.HCM',
    phone: '0988.334.455',
    rating: 4.9,
    highlight: 'Chuyên Việt phục cách tân, Nhật Bình dạ hội và Áo dài gấm lụa cao cấp',
    stockByCostume: {
      'nhat-binh': { S: 3, M: 4, L: 3, XL: 2 },
      'ao-dai-cach-tan': { S: 6, M: 6, L: 5, XL: 3 },
      'ao-dai': { S: 5, M: 5, L: 4, XL: 2 },
      'ao-tac': { S: 3, M: 4, L: 3, XL: 1 },
      'ao-ngu-than-tay-chen': { S: 3, M: 4, L: 2, XL: 1 },
      'ao-vien-linh': { S: 2, M: 3, L: 2, XL: 1 },
      'ao-giao-linh': { S: 2, M: 3, L: 2, XL: 1 },
      'ao-tu-than': { S: 2, M: 3, L: 2, XL: 1 }
    }
  }
];

export const COSTUME_PRICING: Record<string, RentalCostumePricing> = {
  'nhat-binh': {
    costumeId: 'nhat-binh',
    pricePerDay: 350000,
    depositPrice: 1500000,
    defaultStoreId: 'store-hue',
    sizes: ['S', 'M', 'L', 'XL'],
    sizeGuides: {
      S: 'Cao 1m50 - 1m58 · Nặng 42 - 48kg (Vòng 1: 80 - 84cm)',
      M: 'Cao 1m58 - 1m65 · Nặng 49 - 55kg (Vòng 1: 85 - 89cm)',
      L: 'Cao 1m65 - 1m72 · Nặng 56 - 65kg (Vòng 1: 90 - 95cm)',
      XL: 'Cao 1m70 - 1m78 · Nặng 66 - 76kg (Vòng 1: 96 - 102cm)'
    }
  },
  'ao-tac': {
    costumeId: 'ao-tac',
    pricePerDay: 280000,
    depositPrice: 1000000,
    defaultStoreId: 'store-hue',
    sizes: ['S', 'M', 'L', 'XL'],
    sizeGuides: {
      S: 'Cao 1m55 - 1m62 · Nặng 48 - 54kg (Form tay thụng rộng)',
      M: 'Cao 1m63 - 1m70 · Nặng 55 - 63kg (Form tay thụng rộng)',
      L: 'Cao 1m71 - 1m78 · Nặng 64 - 72kg (Form tay thụng rộng)',
      XL: 'Cao 1m78 - 1m85 · Nặng 73 - 85kg (Form tay thụng rộng)'
    }
  },
  'ao-vien-linh': {
    costumeId: 'ao-vien-linh',
    pricePerDay: 420000,
    depositPrice: 1800000,
    defaultStoreId: 'store-hanoi',
    sizes: ['S', 'M', 'L', 'XL'],
    sizeGuides: {
      S: 'Cao 1m60 - 1m66 · Nặng 52 - 58kg (Kèm đai và bổ tử)',
      M: 'Cao 1m67 - 1m74 · Nặng 59 - 68kg (Kèm đai và bổ tử)',
      L: 'Cao 1m75 - 1m82 · Nặng 69 - 78kg (Kèm đai và bổ tử)',
      XL: 'Cao 1m80 - 1m88 · Nặng 79 - 90kg (Kèm đai và bổ tử)'
    }
  },
  'ao-giao-linh': {
    costumeId: 'ao-giao-linh',
    pricePerDay: 320000,
    depositPrice: 1200000,
    defaultStoreId: 'store-hanoi',
    sizes: ['S', 'M', 'L', 'XL'],
    sizeGuides: {
      S: 'Cao 1m55 - 1m63 · Nặng 46 - 54kg (Cổ chéo hữu nhậm)',
      M: 'Cao 1m64 - 1m71 · Nặng 55 - 64kg (Cổ chéo hữu nhậm)',
      L: 'Cao 1m72 - 1m79 · Nặng 65 - 74kg (Cổ chéo hữu nhậm)',
      XL: 'Cao 1m79 - 1m86 · Nặng 75 - 86kg (Cổ chéo hữu nhậm)'
    }
  },
  'ao-tu-than': {
    costumeId: 'ao-tu-than',
    pricePerDay: 220000,
    depositPrice: 800000,
    defaultStoreId: 'store-hanoi',
    sizes: ['S', 'M', 'L', 'XL'],
    sizeGuides: {
      S: 'Cao 1m50 - 1m56 · Nặng 42 - 47kg (Kèm yếm và khăn mỏ quạ)',
      M: 'Cao 1m57 - 1m64 · Nặng 48 - 55kg (Kèm yếm và khăn mỏ quạ)',
      L: 'Cao 1m65 - 1m71 · Nặng 56 - 63kg (Kèm yếm và khăn mỏ quạ)',
      XL: 'Cao 1m70 - 1m77 · Nặng 64 - 72kg (Kèm yếm và khăn mỏ quạ)'
    }
  },
  'ao-ngu-than-tay-chen': {
    costumeId: 'ao-ngu-than-tay-chen',
    pricePerDay: 260000,
    depositPrice: 900000,
    defaultStoreId: 'store-hue',
    sizes: ['S', 'M', 'L', 'XL'],
    sizeGuides: {
      S: 'Cao 1m55 - 1m63 · Nặng 47 - 54kg (Tay chẽn gọn gàng)',
      M: 'Cao 1m64 - 1m71 · Nặng 55 - 63kg (Tay chẽn gọn gàng)',
      L: 'Cao 1m72 - 1m79 · Nặng 64 - 73kg (Tay chẽn gọn gàng)',
      XL: 'Cao 1m79 - 1m86 · Nặng 74 - 84kg (Tay chẽn gọn gàng)'
    }
  },
  'ao-dai': {
    costumeId: 'ao-dai',
    pricePerDay: 200000,
    depositPrice: 700000,
    defaultStoreId: 'store-hoian',
    sizes: ['S', 'M', 'L', 'XL'],
    sizeGuides: {
      S: 'Cao 1m50 - 1m57 · Nặng 42 - 47kg (Eo: 62 - 66cm)',
      M: 'Cao 1m58 - 1m65 · Nặng 48 - 54kg (Eo: 67 - 71cm)',
      L: 'Cao 1m65 - 1m72 · Nặng 55 - 62kg (Eo: 72 - 77cm)',
      XL: 'Cao 1m70 - 1m77 · Nặng 63 - 70kg (Eo: 78 - 84cm)'
    }
  },
  'ao-dai-cach-tan': {
    costumeId: 'ao-dai-cach-tan',
    pricePerDay: 190000,
    depositPrice: 600000,
    defaultStoreId: 'store-hcm',
    sizes: ['S', 'M', 'L', 'XL'],
    sizeGuides: {
      S: 'Cao 1m50 - 1m58 · Nặng 42 - 48kg (Form chữ A trẻ trung)',
      M: 'Cao 1m58 - 1m65 · Nặng 49 - 55kg (Form chữ A trẻ trung)',
      L: 'Cao 1m65 - 1m72 · Nặng 56 - 63kg (Form chữ A trẻ trung)',
      XL: 'Cao 1m70 - 1m78 · Nặng 64 - 72kg (Form chữ A trẻ trung)'
    }
  }
};

export const PLATFORM_SERVICE_FEE = 30000; // 30.000 VNĐ phí vận hành nền tảng bảo chứng
export const STANDARD_SHIPPING_FEE = 40000; // 40.000 VNĐ giao tận nơi

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
}
