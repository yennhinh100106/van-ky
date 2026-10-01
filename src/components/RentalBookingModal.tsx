import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, ShieldCheck, Calendar, MapPin, Store, Truck, CreditCard, 
  QrCode, AlertTriangle, CheckCircle2, ChevronRight, ArrowLeft, Info, Sparkles, Phone, Building2, Camera
} from 'lucide-react';
import { Costume } from '../types/lookbook';
import { RentalOrder, RentalSize, ExperiencePackage } from '../types/rental';
import { 
  PARTNER_STORES, 
  COSTUME_PRICING, 
  PLATFORM_SERVICE_FEE, 
  STANDARD_SHIPPING_FEE, 
  formatVND 
} from '../data/partners';
import { checkDateConflict, addOrder } from '../utils/orderStorage';
import { Language, Currency, formatPrice, UI_TRANSLATIONS } from '../utils/i18n';
import { COSTUME_TRANSLATIONS } from '../data/costumeTranslations';

interface RentalBookingModalProps {
  costume: Costume;
  selectedColorName?: string;
  selectedColorHex?: string;
  selectedAccessories?: string[];
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (order: RentalOrder) => void;
  language?: Language;
  currency?: Currency;
}

export const RentalBookingModal: React.FC<RentalBookingModalProps> = ({
  costume,
  selectedColorName,
  selectedColorHex,
  selectedAccessories,
  isOpen,
  onClose,
  onBookingSuccess,
  language = 'vi',
  currency = 'VND'
}) => {
  const t = UI_TRANSLATIONS[language].rental;
  const costumeTrans = COSTUME_TRANSLATIONS[costume.id];

  // Pricing configuration for this costume
  const pricing = useMemo(() => {
    return COSTUME_PRICING[costume.id] || {
      costumeId: costume.id,
      pricePerDay: 300000,
      depositPrice: 1000000,
      defaultStoreId: 'store-hue',
      sizes: ['S', 'M', 'L', 'XL'] as RentalSize[],
      sizeGuides: {
        S: 'Chiều cao 1m50 - 1m58 · Cân nặng 42 - 48kg',
        M: 'Chiều cao 1m58 - 1m65 · Cân nặng 49 - 55kg',
        L: 'Chiều cao 1m65 - 1m72 · Cân nặng 56 - 65kg',
        XL: 'Chiều cao 1m70 - 1m80 · Cân nặng 66 - 78kg'
      }
    };
  }, [costume.id]);

  // Stepper: 1: Config, 2: Checkout Escrow, 3: Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [selectedSize, setSelectedSize] = useState<RentalSize>('M');
  const [selectedStoreId, setSelectedStoreId] = useState<string>(pricing.defaultStoreId);
  const [deliveryMethod, setDeliveryMethod] = useState<'store' | 'shipping' | 'hotel'>(
    language === 'en' ? 'hotel' : 'store'
  );
  
  // Dates
  const todayStr = useMemo(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }, []);

  const defaultEndStr = useMemo(() => {
    const next = new Date();
    next.setDate(next.getDate() + 2);
    return next.toISOString().split('T')[0];
  }, []);

  const [startDate, setStartDate] = useState<string>(todayStr);
  const [endDate, setEndDate] = useState<string>(defaultEndStr);

  // Recipient & Hotel info
  const [recipientName, setRecipientName] = useState<string>('');
  const [recipientPhone, setRecipientPhone] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [hotelName, setHotelName] = useState<string>('');
  const [hotelRoom, setHotelRoom] = useState<string>('');

  // Experience package upgrades: Photography & Makeup
  const [hasPhotography, setHasPhotography] = useState<boolean>(false);
  const [hasMakeup, setHasMakeup] = useState<boolean>(false);
  const PHOTOGRAPHY_FEE = 800000;
  const MAKEUP_FEE = 150000;

  // Payment method: In EN mode, default to 'card' (International Card)
  const [paymentMethod, setPaymentMethod] = useState<'vietqr' | 'card' | 'momo'>(
    language === 'en' ? 'card' : 'vietqr'
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [createdOrder, setCreatedOrder] = useState<RentalOrder | null>(null);

  // Reset payment method preference when language changes
  useEffect(() => {
    if (language === 'en') {
      setPaymentMethod('card');
    }
  }, [language]);

  // Calculate rental duration in days
  const rentalDays = useMemo(() => {
    if (!startDate || !endDate) return 1;
    const s = new Date(startDate).getTime();
    const e = new Date(endDate).getTime();
    if (isNaN(s) || isNaN(e) || e < s) return 1;
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  }, [startDate, endDate]);

  // Selected store object
  const currentStore = useMemo(() => {
    return PARTNER_STORES.find(s => s.id === selectedStoreId) || PARTNER_STORES[0];
  }, [selectedStoreId]);

  // Date conflict check
  const conflictResult = useMemo(() => {
    if (!startDate || !endDate) return { isConflict: false };
    return checkDateConflict(costume.id, startDate, endDate);
  }, [costume.id, startDate, endDate]);

  // Financial calculations
  const rentalTotal = pricing.pricePerDay * rentalDays;
  const depositTotal = pricing.depositPrice;
  const shippingFee = (deliveryMethod === 'shipping' || deliveryMethod === 'hotel') ? STANDARD_SHIPPING_FEE : 0;
  const photographyPrice = hasPhotography ? PHOTOGRAPHY_FEE : 0;
  const makeupPrice = hasMakeup ? MAKEUP_FEE : 0;
  const experienceTotal = photographyPrice + makeupPrice;
  const totalAmount = rentalTotal + depositTotal + PLATFORM_SERVICE_FEE + shippingFee + experienceTotal;

  // Validation
  const isStep1Valid = useMemo(() => {
    if (conflictResult.isConflict) return false;
    if (new Date(endDate) < new Date(startDate)) return false;
    if (deliveryMethod === 'hotel') {
      return recipientName.trim().length > 1 && recipientPhone.trim().length >= 6 && hotelName.trim().length > 1;
    }
    if (deliveryMethod === 'shipping') {
      return recipientName.trim().length > 1 && recipientPhone.trim().length >= 6 && recipientAddress.trim().length > 5;
    }
    return true;
  }, [conflictResult, startDate, endDate, deliveryMethod, recipientName, recipientPhone, recipientAddress, hotelName]);

  if (!isOpen) return null;

  // Handle Create Order & Mock Payment
  const handleConfirmPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const newOrderId = `VK-2026-${randomNum}`;
      const nowStr = new Date().toLocaleString('vi-VN', {
        hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
      });

      const fullRecipientAddress = deliveryMethod === 'hotel'
        ? `Khách sạn: ${hotelName.trim()} (Phòng ${hotelRoom.trim() || 'Lễ tân'}), ${recipientAddress.trim() || currentStore.cityName}`
        : deliveryMethod === 'shipping'
        ? recipientAddress.trim()
        : undefined;

      const newOrder: RentalOrder = {
        id: newOrderId,
        createdAt: new Date().toISOString(),
        costumeId: costume.id,
        costumeName: costume.name,
        costumeImage: costume.image,
        period: costume.period,
        size: selectedSize,
        colorName: selectedColorName || (language === 'en' ? 'Traditional Colorway' : 'Màu truyền thống'),
        colorHex: selectedColorHex || costume.defaultColor,
        accessories: selectedAccessories || [],
        storeId: currentStore.id,
        storeName: currentStore.name,
        storeAddress: currentStore.address,
        storePhone: currentStore.phone,
        startDate,
        endDate,
        totalDays: rentalDays,
        deliveryMethod,
        recipientName: recipientName.trim() || (language === 'en' ? 'Honored Guest' : 'Khách hàng VẬN KỲ'),
        recipientPhone: recipientPhone.trim() || '0912.345.678',
        recipientAddress: fullRecipientAddress,
        hotelName: deliveryMethod === 'hotel' ? hotelName.trim() : undefined,
        hotelRoom: deliveryMethod === 'hotel' ? hotelRoom.trim() : undefined,
        paymentMethod,
        experiencePackage: (hasPhotography || hasMakeup) ? {
          hasPhotography,
          photographyPrice,
          hasMakeup,
          makeupPrice,
          totalExperienceFee: experienceTotal,
          photoScheduleStatus: 'da-xac-nhan',
          photographerName: hasPhotography ? 'Studio Cổ Phong Hoàng Gia' : undefined,
          makeupArtistName: hasMakeup ? 'Nghệ nhân Mai Anh Makeup' : undefined,
          scheduledTime: `08:30 - Ngày ${startDate}`,
          heritageSpot: deliveryMethod === 'hotel' ? hotelName : 'Điểm di sản / Di tích lịch sử'
        } : undefined,
        financials: {
          rentalTotal,
          depositTotal,
          platformFee: PLATFORM_SERVICE_FEE,
          shippingFee,
          photographyFee: photographyPrice,
          makeupFee: makeupPrice,
          experienceTotal,
          totalPaid: totalAmount,
          partnerPayout: rentalTotal + experienceTotal,
          platformRevenue: PLATFORM_SERVICE_FEE,
          depositRefund: depositTotal,
          deductionAmount: 0
        },
        escrowStatus: 'holding',
        status: 'da-dat',
        statusHistory: [
          {
            status: 'da-dat',
            timestamp: nowStr,
            note: language === 'en'
              ? `Client successfully secured & deposited ${formatPrice(totalAmount, currency)} into VAN KY Escrow Vault via ${paymentMethod.toUpperCase()}`
              : `Khách đã thanh toán & ký quỹ an toàn ${formatPrice(totalAmount, currency)} qua ${paymentMethod.toUpperCase()}`
          },
          ...((hasPhotography || hasMakeup) ? [
            {
              status: 'da-dat' as const,
              timestamp: nowStr,
              note: language === 'en'
                ? `Heritage Experience Package confirmed: Photo & makeup session scheduled at 08:30 on ${startDate}`
                : `Gói trải nghiệm di sản: Đã xác nhận lịch chụp & makeup lúc 08:30 ngày ${startDate}`
            }
          ] : [])
        ]
      };

      addOrder(newOrder);
      setCreatedOrder(newOrder);
      setIsProcessing(false);
      setStep(3);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-[#F6EFE3] border border-[#B8862B] shadow-2xl rounded p-5 sm:p-7 text-left max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D8CEBE] mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FAF6ED] border border-[#D8CEBE] rounded-full text-[#A4161A]">
              <ShieldCheck size={22} className="text-[#A4161A]" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-widest text-[#B8862B] font-semibold flex items-center gap-1.5">
                <span>{language === 'en' ? 'VAN KY Escrow Protection · Safe Heritage Attire Rental' : 'VẬN KỲ Escrow · Thuê Việt Phục An Toàn'}</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                {step === 1 && `${language === 'en' ? 'Book Rental:' : 'Đặt Thuê:'} ${costume.name}`}
                {step === 2 && (language === 'en' ? 'Review & Escrow Protection Checkout' : 'Xác Nhận & Ký Quỹ Bảo Chứng')}
                {step === 3 && t.successTitle}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#666] hover:text-[#1A1A1A] rounded-md hover:bg-black/5 cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Stepper Indicator */}
        <div className="grid grid-cols-3 gap-2 pb-4 mb-4 border-b border-[#D8CEBE] text-xs">
          <div className={`flex items-center gap-2 pb-1 border-b-2 font-medium ${step >= 1 ? 'border-[#A4161A] text-[#A4161A]' : 'border-transparent text-[#888]'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? 'bg-[#A4161A] text-white' : 'bg-[#D8CEBE] text-[#555]'}`}>1</span>
            <span>{t.step1}</span>
          </div>
          <div className={`flex items-center gap-2 pb-1 border-b-2 font-medium ${step >= 2 ? 'border-[#A4161A] text-[#A4161A]' : 'border-transparent text-[#888]'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 2 ? 'bg-[#A4161A] text-white' : 'bg-[#D8CEBE] text-[#555]'}`}>2</span>
            <span>{t.step2}</span>
          </div>
          <div className={`flex items-center gap-2 pb-1 border-b-2 font-medium ${step === 3 ? 'border-[#2D6A4F] text-[#2D6A4F]' : 'border-transparent text-[#888]'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 3 ? 'bg-[#2D6A4F] text-white' : 'bg-[#D8CEBE] text-[#555]'}`}>3</span>
            <span>{t.step3}</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-5 text-xs text-[#2A2A2A]">
          {/* STEP 1: CONFIGURE RENTAL */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Costume Mini Overview Card */}
              <div className="bg-[#FAF6ED] p-3.5 border border-[#D8CEBE] rounded flex items-center gap-3.5">
                <img
                  src={costume.image}
                  alt={costume.name}
                  className="w-16 h-20 object-cover rounded border border-[#D8CEBE] shrink-0"
                />
                <div className="flex-1">
                  <div className="font-serif font-bold text-sm text-[#1A1A1A]">{costume.name}</div>
                  {costumeTrans && (
                    <div className="text-[11px] text-[#555] italic">"{costumeTrans.englishSubtitle}"</div>
                  )}
                  <div className="text-[11px] text-[#A4161A] font-medium mt-0.5">{costume.period}</div>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#666]">
                    <span>{language === 'en' ? 'Rental rate:' : 'Giá thuê:'} <strong className="text-[#A4161A] font-semibold">{formatPrice(pricing.pricePerDay, currency)}</strong>/{language === 'en' ? 'day' : 'ngày'}</span>
                    <span>·</span>
                    <span>{language === 'en' ? 'Deposit:' : 'Tiền cọc:'} <strong className="text-[#1A1A1A]">{formatPrice(pricing.depositPrice, currency)}</strong></span>
                  </div>
                </div>
              </div>

              {/* Size Selector with Guide */}
              <div>
                <label className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A] block mb-2">
                  {t.sizeLabel}:
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {pricing.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`py-2 px-3 rounded border text-center transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'bg-[#A4161A] text-white border-[#A4161A] shadow-xs font-bold'
                          : 'bg-[#FAF6ED] hover:bg-[#E8DEC8] border-[#D8CEBE] text-[#1A1A1A]'
                      }`}
                    >
                      <div className="text-sm">{s}</div>
                      <div className={`text-[10px] ${selectedSize === s ? 'text-white/80' : 'text-[#777]'}`}>
                        {language === 'en' ? `${currentStore.stockByCostume[costume.id]?.[s] ?? 2} in stock` : `Còn ${currentStore.stockByCostume[costume.id]?.[s] ?? 2} bộ`}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-2 p-2.5 bg-[#FAF6ED]/70 border border-[#E8DEC8] rounded text-[11px] text-[#555] flex items-center gap-2">
                  <Info size={14} className="text-[#B8862B] shrink-0" />
                  <span><strong>{language === 'en' ? `Size ${selectedSize} fit guide:` : `Gợi ý size ${selectedSize}:`}</strong> {pricing.sizeGuides[selectedSize]}</span>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A] block mb-2">
                  {t.datesLabel}:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#FAF6ED] p-3 border border-[#D8CEBE] rounded">
                    <span className="text-[11px] text-[#666] block mb-1">{t.startDate}:</span>
                    <input
                      type="date"
                      min={todayStr}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-white border border-[#D8CEBE] p-1.5 rounded text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#A4161A]"
                    />
                  </div>
                  <div className="bg-[#FAF6ED] p-3 border border-[#D8CEBE] rounded">
                    <span className="text-[11px] text-[#666] block mb-1">{t.endDate}:</span>
                    <input
                      type="date"
                      min={startDate || todayStr}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-white border border-[#D8CEBE] p-1.5 rounded text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#A4161A]"
                    />
                  </div>
                </div>
                <div className="mt-1.5 text-right text-[11px] text-[#666]">
                  {t.totalDays}: <strong className="text-[#A4161A] text-xs font-bold">{rentalDays} {language === 'en' ? (rentalDays > 1 ? 'days' : 'day') : 'ngày'}</strong> (24h/ngày)
                </div>

                {/* Overlap / Conflict Alert */}
                {conflictResult.isConflict && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-300 text-red-800 rounded flex items-start gap-2.5 animate-in fade-in">
                    <AlertTriangle size={18} className="text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold">
                        {language === 'en' ? 'This attire is already booked during these dates!' : 'Bộ này đã được đặt trong khoảng ngày này!'}
                      </strong>
                      <p className="text-[11px] text-red-700 mt-0.5">
                        {language === 'en'
                          ? `Already reserved from ${conflictResult.conflictingOrder?.startDate} to ${conflictResult.conflictingOrder?.endDate}. Please choose different dates.`
                          : `Đã có khách đặt từ ${conflictResult.conflictingOrder?.startDate} đến ${conflictResult.conflictingOrder?.endDate}. Vui lòng chọn khoảng ngày khác để đảm bảo trang phục sẵn sàng.`}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Partner Store Selection */}
              <div>
                <label className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A] block mb-2">
                  {t.storeLabel}:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PARTNER_STORES.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => setSelectedStoreId(st.id)}
                      className={`p-3 rounded border text-left cursor-pointer transition-all ${
                        selectedStoreId === st.id
                          ? 'bg-[#FAF6ED] border-[#A4161A] ring-1 ring-[#A4161A] shadow-xs'
                          : 'bg-[#FAF6ED]/60 hover:bg-[#FAF6ED] border-[#D8CEBE]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#1A1A1A]">{st.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#E8DEC8] text-[#780016] font-semibold uppercase">
                          {st.cityName}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#555] mt-1 line-clamp-1">{st.address}</p>
                      <div className="flex items-center justify-between mt-2 text-[10px] text-[#666]">
                        <span>{language === 'en' ? `Stock size ${selectedSize}:` : `Tồn kho size ${selectedSize}:`} <strong>{st.stockByCostume[costume.id]?.[selectedSize] ?? 1}</strong></span>
                        <span className="text-[#B8862B]">★ {st.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* REQUIREMENT 3: DELIVERY & RETURN WITH HOTEL CONCIERGE OPTION */}
              <div>
                <label className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A] block mb-2">
                  {t.deliveryLabel}:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
                  {/* Option A: Hotel Concierge Delivery (Prominent for Tourists) */}
                  <label
                    className={`p-3 rounded border cursor-pointer flex flex-col justify-between transition-all ${
                      deliveryMethod === 'hotel'
                        ? 'bg-[#FAF6ED] border-[#A4161A] font-semibold text-[#1A1A1A] ring-1 ring-[#A4161A]'
                        : 'bg-[#FAF6ED]/60 border-[#D8CEBE] text-[#555]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'hotel'}
                        onChange={() => setDeliveryMethod('hotel')}
                        className="accent-[#A4161A]"
                      />
                      <Building2 size={16} className="text-[#A4161A]" />
                      <span className="text-xs font-bold">{language === 'en' ? 'Hotel Delivery' : 'Giao tại khách sạn'}</span>
                    </div>
                    <div className="text-[10px] text-[#2D6A4F] mt-2 leading-tight">
                      {language === 'en' ? 'Concierge reception & return (+40,000đ / $1.60)' : 'Giao tận lễ tân khách sạn & nhận trả (+40.000đ)'}
                    </div>
                  </label>

                  {/* Option B: Store Pickup */}
                  <label
                    className={`p-3 rounded border cursor-pointer flex flex-col justify-between transition-all ${
                      deliveryMethod === 'store'
                        ? 'bg-[#FAF6ED] border-[#A4161A] font-semibold text-[#1A1A1A] ring-1 ring-[#A4161A]'
                        : 'bg-[#FAF6ED]/60 border-[#D8CEBE] text-[#555]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'store'}
                        onChange={() => setDeliveryMethod('store')}
                        className="accent-[#A4161A]"
                      />
                      <Store size={16} className="text-[#A4161A]" />
                      <span className="text-xs font-bold">{language === 'en' ? 'Store Pickup' : 'Nhận tại tiệm'}</span>
                    </div>
                    <div className="text-[10px] text-[#2D6A4F] mt-2 leading-tight">
                      {language === 'en' ? 'Free · Direct fitting at boutique' : 'Miễn phí · Thử đồ trực tiếp tại tiệm'}
                    </div>
                  </label>

                  {/* Option C: Standard Private Doorstep */}
                  <label
                    className={`p-3 rounded border cursor-pointer flex flex-col justify-between transition-all ${
                      deliveryMethod === 'shipping'
                        ? 'bg-[#FAF6ED] border-[#A4161A] font-semibold text-[#1A1A1A] ring-1 ring-[#A4161A]'
                        : 'bg-[#FAF6ED]/60 border-[#D8CEBE] text-[#555]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'shipping'}
                        onChange={() => setDeliveryMethod('shipping')}
                        className="accent-[#A4161A]"
                      />
                      <Truck size={16} className="text-[#A4161A]" />
                      <span className="text-xs font-bold">{language === 'en' ? 'Doorstep Delivery' : 'Giao địa chỉ riêng'}</span>
                    </div>
                    <div className="text-[10px] text-[#666] mt-2 leading-tight">
                      {language === 'en' ? 'Standard courier (+40,000đ / $1.60)' : 'Giao tận nơi (+40.000đ)'}
                    </div>
                  </label>
                </div>

                {/* Hotel Delivery Form Fields */}
                {deliveryMethod === 'hotel' && (
                  <div className="bg-[#FAF6ED] p-3.5 border border-[#B8862B] rounded space-y-2.5 animate-in fade-in">
                    <div className="flex items-center gap-2 text-[#A4161A] font-bold text-xs">
                      <Building2 size={15} />
                      <span>{language === 'en' ? 'Hotel Delivery & Concierge Return Details' : 'Thông Tin Nhận & Trả Đồ Tại Khách Sạn'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] font-medium text-[#444] block mb-1">{t.hotelName}</label>
                        <input
                          type="text"
                          placeholder={language === 'en' ? 'e.g. Silk Path Grand Hue Hotel / Sofitel Legend Metropole' : 'Ví dụ: Khách sạn Silk Path Huế / Metropole Hà Nội'}
                          value={hotelName}
                          onChange={(e) => setHotelName(e.target.value)}
                          className="w-full bg-white border border-[#D8CEBE] px-2.5 py-1.5 rounded text-xs focus:outline-none focus:border-[#A4161A]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-[#444] block mb-1">{t.hotelRoom}</label>
                        <input
                          type="text"
                          placeholder={language === 'en' ? 'e.g. Room 402 (or Concierge Desk)' : 'Ví dụ: Phòng 402 hoặc Gửi Lễ tân'}
                          value={hotelRoom}
                          onChange={(e) => setHotelRoom(e.target.value)}
                          className="w-full bg-white border border-[#D8CEBE] px-2.5 py-1.5 rounded text-xs focus:outline-none focus:border-[#A4161A]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] font-medium text-[#444] block mb-1">{t.guestName}</label>
                        <input
                          type="text"
                          placeholder={language === 'en' ? 'Passport / Reservation Name' : 'Tên đăng ký phòng khách sạn'}
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          className="w-full bg-white border border-[#D8CEBE] px-2.5 py-1.5 rounded text-xs focus:outline-none focus:border-[#A4161A]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-[#444] block mb-1">{t.guestPhone}</label>
                        <input
                          type="tel"
                          placeholder="+84 / WhatsApp / Zalo"
                          value={recipientPhone}
                          onChange={(e) => setRecipientPhone(e.target.value)}
                          className="w-full bg-white border border-[#D8CEBE] px-2.5 py-1.5 rounded text-xs focus:outline-none focus:border-[#A4161A]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-[#444] block mb-1">{t.hotelAddress}</label>
                      <input
                        type="text"
                        placeholder={language === 'en' ? 'Hotel street address, ward, city' : 'Địa chỉ khách sạn (Đường, Phường, Thành phố)'}
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        className="w-full bg-white border border-[#D8CEBE] px-2.5 py-1.5 rounded text-xs focus:outline-none focus:border-[#A4161A]"
                      />
                    </div>
                    <div className="p-2 bg-[#FFFBEB] rounded border border-[#E8DEC8] text-[11px] text-[#785E23] flex items-center gap-2">
                      <Sparkles size={14} className="text-[#B8862B] shrink-0" />
                      <span>{t.hotelNote}</span>
                    </div>
                  </div>
                )}

                {/* Standard Shipping Form Fields */}
                {deliveryMethod === 'shipping' && (
                  <div className="bg-[#FAF6ED] p-3.5 border border-[#D8CEBE] rounded space-y-2.5 animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] font-medium text-[#444] block mb-1">{t.guestName}</label>
                        <input
                          type="text"
                          placeholder="Họ tên người nhận"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          className="w-full bg-white border border-[#D8CEBE] px-2.5 py-1.5 rounded text-xs focus:outline-none focus:border-[#A4161A]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-[#444] block mb-1">{t.guestPhone}</label>
                        <input
                          type="tel"
                          placeholder="Số điện thoại"
                          value={recipientPhone}
                          onChange={(e) => setRecipientPhone(e.target.value)}
                          className="w-full bg-white border border-[#D8CEBE] px-2.5 py-1.5 rounded text-xs focus:outline-none focus:border-[#A4161A]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-[#444] block mb-1">Địa chỉ giao nhận chi tiết *</label>
                      <input
                        type="text"
                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        className="w-full bg-white border border-[#D8CEBE] px-2.5 py-1.5 rounded text-xs focus:outline-none focus:border-[#A4161A]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 5. GÓI TRẢI NGHIỆM (Nâng cấp chụp ảnh + Makeup) */}
              <div className="pt-2 border-t border-[#D8CEBE]">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#B8862B]" />
                    <span>{language === 'en' ? '5. Upgrade Experience Package (Optional)' : '5. Nâng Cấp Gói Trải Nghiệm (Tùy chọn)'}</span>
                  </label>
                  <span className="text-[10px] text-[#A4161A] font-semibold bg-[#A4161A]/10 px-2 py-0.5 rounded">
                    {language === 'en' ? 'Verified Heritage Partners' : 'Đối tác di sản kiểm duyệt'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Chụp ảnh tại điểm di sản */}
                  <div
                    onClick={() => setHasPhotography(!hasPhotography)}
                    className={`p-3 rounded border transition-all cursor-pointer flex items-start gap-3 ${
                      hasPhotography
                        ? 'bg-[#FAF6ED] border-[#B8862B] ring-1 ring-[#B8862B] shadow-2xs'
                        : 'bg-white hover:bg-[#FAF6ED] border-[#D8CEBE]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={hasPhotography}
                      onChange={() => {}}
                      className="mt-0.5 accent-[#A4161A]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                          <Camera size={14} className="text-[#A4161A]" />
                          <span>{language === 'en' ? 'Heritage Photoshoot' : 'Chụp ảnh tại điểm di sản'}</span>
                        </span>
                        <span className="text-xs font-bold text-[#A4161A]">
                          +{formatPrice(PHOTOGRAPHY_FEE, currency)}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#666] mt-1 leading-relaxed">
                        {language === 'en' 
                          ? '800,000đ/session at monuments. Full original files + 15 retouched color grades.'
                          : '800.000đ/buổi tại di tích. Trả toàn bộ file gốc + 15 ảnh chỉnh màu nghệ thuật.'}
                      </p>
                    </div>
                  </div>

                  {/* Trang điểm và làm tóc */}
                  <div
                    onClick={() => setHasMakeup(!hasMakeup)}
                    className={`p-3 rounded border transition-all cursor-pointer flex items-start gap-3 ${
                      hasMakeup
                        ? 'bg-[#FAF6ED] border-[#B8862B] ring-1 ring-[#B8862B] shadow-2xs'
                        : 'bg-white hover:bg-[#FAF6ED] border-[#D8CEBE]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={hasMakeup}
                      onChange={() => {}}
                      className="mt-0.5 accent-[#A4161A]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                          <Sparkles size={14} className="text-[#B8862B]" />
                          <span>{language === 'en' ? 'Heritage Hair & Makeup' : 'Trang điểm và làm tóc'}</span>
                        </span>
                        <span className="text-xs font-bold text-[#A4161A]">
                          +{formatPrice(MAKEUP_FEE, currency)}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#666] mt-1 leading-relaxed">
                        {language === 'en'
                          ? '150,000đ/person. Traditional hairstyle, turban pinning & ancient beauty makeup.'
                          : '150.000đ/người. Vấn khăn, tạo kiểu tóc và trang điểm tone cổ phong chuẩn điển chế.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SUMMARY & ESCROW PAYMENT CHECKOUT */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              {/* Trust Badge Explanation - REQUIREMENT 3 */}
              <div className="bg-[#FFFBEB] border-l-4 border-[#B8862B] p-4 rounded-r text-xs">
                <div className="flex items-center gap-2 text-[#B8862B] font-bold text-sm mb-1">
                  <ShieldCheck size={18} />
                  <span>{t.escrowGuarantee}</span>
                </div>
                <p className="text-[#785E23] leading-relaxed">
                  <strong>{t.escrowExplanation}</strong>
                </p>
                <div className="mt-2 text-[11px] text-[#8F6C22] flex items-center gap-3">
                  <span>✓ {language === 'en' ? 'Transparent escrow lock' : 'Khóa cọc minh bạch'}</span>
                  <span>✓ {language === 'en' ? 'Fair boutique return check' : 'Tiệm kiểm tra công tâm'}</span>
                  <span>✓ {language === 'en' ? 'Auto refund to your bank/card' : 'Hoàn cọc tự động qua thẻ/ngân hàng'}</span>
                </div>
              </div>

              {/* Transparent Financial Table */}
              <div className="bg-[#FAF6ED] p-4 border border-[#D8CEBE] rounded space-y-3">
                <div className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A] pb-2 border-b border-[#D8CEBE]">
                  {t.financialTable}:
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-[#555]">
                    1. {t.rentalFee} ({formatPrice(pricing.pricePerDay, currency)} x {rentalDays} {language === 'en' ? 'days' : 'ngày'}):
                  </span>
                  <span className="font-semibold text-[#1A1A1A]">{formatPrice(rentalTotal, currency)}</span>
                </div>

                {hasPhotography && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#555] flex items-center gap-1.5">
                      <Camera size={13} className="text-[#A4161A]" />
                      <span>2. {language === 'en' ? 'Heritage Photoshoot (1 session):' : '2. Chụp ảnh tại điểm di sản (800.000đ/buổi):'}</span>
                    </span>
                    <span className="font-semibold text-[#A4161A]">{formatPrice(photographyPrice, currency)}</span>
                  </div>
                )}

                {hasMakeup && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#555] flex items-center gap-1.5">
                      <Sparkles size={13} className="text-[#B8862B]" />
                      <span>{hasPhotography ? '3' : '2'}. {language === 'en' ? 'Hair & Makeup styling:' : 'Trang điểm và làm tóc (150.000đ/người):'}</span>
                    </span>
                    <span className="font-semibold text-[#A4161A]">{formatPrice(makeupPrice, currency)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-1">
                  <span className="text-[#555]">
                    {hasPhotography && hasMakeup ? '4' : (hasPhotography || hasMakeup) ? '3' : '2'}. {t.platformFee}:
                  </span>
                  <span className="text-[#1A1A1A]">{formatPrice(PLATFORM_SERVICE_FEE, currency)}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <div>
                    <span className="text-[#555]">
                      {hasPhotography && hasMakeup ? '5' : (hasPhotography || hasMakeup) ? '4' : '3'}. {t.depositFee}:
                    </span>
                    <span className="text-[10px] text-[#2D6A4F] ml-1.5 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                      {language === 'en' ? '100% refundable upon safe return' : 'Hoàn lại 100% khi trả đồ nguyên vẹn'}
                    </span>
                  </div>
                  <span className="font-semibold text-[#1A1A1A]">{formatPrice(depositTotal, currency)}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-[#555]">
                    {hasPhotography && hasMakeup ? '6' : (hasPhotography || hasMakeup) ? '5' : '4'}. {t.shippingFee}:
                  </span>
                  <span className="text-[#1A1A1A]">
                    {shippingFee === 0 
                      ? (language === 'en' ? 'Free (Store pick-up)' : 'Miễn phí (Nhận tại tiệm)') 
                      : formatPrice(shippingFee, currency)}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#D8CEBE] flex justify-between items-baseline">
                  <div>
                    <div className="font-bold text-sm text-[#A4161A]">{t.totalPayment}:</div>
                    <div className="text-[10px] text-[#777]">
                      {language === 'en' ? '(Includes rental fee + deposit in escrow + experience upgrades)' : '(Đã bao gồm tiền thuê + tiền cọc ký quỹ + nâng cấp trải nghiệm)'}
                    </div>
                  </div>
                  <div className="text-xl font-bold text-[#A4161A]">
                    {formatPrice(totalAmount, currency)}
                  </div>
                </div>

                {/* Ghi chú dịch vụ đối tác theo yêu cầu đề bài */}
                {(hasPhotography || hasMakeup) && (
                  <div className="p-2.5 bg-[#FFFBEB] border border-[#E8DEC8] rounded text-[11px] text-[#785E23] flex items-center gap-2">
                    <Info size={14} className="text-[#B8862B] shrink-0" />
                    <span>
                      {language === 'en' 
                        ? 'Note: Services performed by verified partners, VAN KY holds funds in escrow until completion.'
                        : 'Dịch vụ do đối tác thực hiện, VẬN KỲ giữ tiền đến khi hoàn tất.'}
                    </span>
                  </div>
                )}
              </div>

              {/* Order Info Recap */}
              <div className="bg-[#FAF6ED] p-3 border border-[#D8CEBE] rounded text-[11px] grid grid-cols-2 gap-2 text-[#555]">
                <div><strong>{language === 'en' ? 'Attire:' : 'Trang phục:'}</strong> {costume.name} (Size {selectedSize})</div>
                <div><strong>{language === 'en' ? 'Rental Period:' : 'Thời gian:'}</strong> {startDate} ~ {endDate} ({rentalDays} {language === 'en' ? 'days' : 'ngày'})</div>
                <div><strong>{language === 'en' ? 'Partner Boutique:' : 'Tiệm cung cấp:'}</strong> {currentStore.name}</div>
                <div>
                  <strong>{language === 'en' ? 'Delivery Mode:' : 'Nhận đồ:'}</strong>{' '}
                  {deliveryMethod === 'hotel' 
                    ? `${language === 'en' ? 'Hotel Delivery' : 'Khách sạn'}: ${hotelName} (${hotelRoom || 'Lễ tân'})` 
                    : deliveryMethod === 'store' 
                    ? (language === 'en' ? 'At partner boutique' : 'Tại tiệm đối tác') 
                    : `${language === 'en' ? 'Doorstep to' : 'Giao đến'}: ${recipientAddress || recipientName}`}
                </div>
              </div>

              {/* Payment Methods (REQUIREMENT 2: International Card prioritized in EN) */}
              <div>
                <label className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A] block mb-2">
                  {t.paymentMethodLabel}:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {/* Card Option (First in EN) */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded border text-center transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-[#FAF6ED] border-[#A4161A] ring-1 ring-[#A4161A] text-[#A4161A] font-bold'
                        : 'bg-white hover:bg-[#FAF6ED] border-[#D8CEBE] text-[#555]'
                    }`}
                  >
                    <CreditCard size={20} className="mx-auto mb-1 text-[#A4161A]" />
                    <span className="text-xs">{language === 'en' ? 'International Card (Visa/Master)' : 'Thẻ ATM / Visa / Master'}</span>
                  </button>

                  {/* VietQR Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('vietqr')}
                    className={`p-3 rounded border text-center transition-all cursor-pointer ${
                      paymentMethod === 'vietqr'
                        ? 'bg-[#FAF6ED] border-[#A4161A] ring-1 ring-[#A4161A] text-[#A4161A] font-bold'
                        : 'bg-white hover:bg-[#FAF6ED] border-[#D8CEBE] text-[#555]'
                    }`}
                  >
                    <QrCode size={20} className="mx-auto mb-1 text-[#0068FF]" />
                    <span className="text-xs">{language === 'en' ? 'VietQR / Bank Transfer' : 'Chuyển khoản VietQR'}</span>
                  </button>

                  {/* E-wallet / PayPal */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('momo')}
                    className={`p-3 rounded border text-center transition-all cursor-pointer ${
                      paymentMethod === 'momo'
                        ? 'bg-[#FAF6ED] border-[#A4161A] ring-1 ring-[#A4161A] text-[#A4161A] font-bold'
                        : 'bg-white hover:bg-[#FAF6ED] border-[#D8CEBE] text-[#555]'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-[#A50064] text-white text-[10px] font-bold flex items-center justify-center mx-auto mb-1">
                      {language === 'en' ? 'P' : 'M'}
                    </div>
                    <span className="text-xs">{language === 'en' ? 'Digital Wallet / PayPal' : 'Ví MoMo / ZaloPay'}</span>
                  </button>
                </div>

                {/* Mock Card form if International Card */}
                {paymentMethod === 'card' && (
                  <div className="mt-3 p-3 bg-white border border-[#D8CEBE] rounded space-y-2 text-[11px] text-[#555]">
                    <div className="flex items-center justify-between font-bold text-[#1A1A1A]">
                      <span>{language === 'en' ? 'International Payment Gateway' : 'Cổng Thanh Toán Quốc Tế Bảo Mật'}</span>
                      <span className="text-[#2D6A4F] text-[10px]">256-bit SSL Escrow Encrypted</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="4111 2222 3333 4444"
                        readOnly
                        value="4111 •••• •••• 8899"
                        className="bg-[#F6EFE3] border border-[#D8CEBE] px-2 py-1.5 rounded font-mono text-xs"
                      />
                      <input
                        type="text"
                        placeholder="MM/YY"
                        readOnly
                        value="12/28"
                        className="bg-[#F6EFE3] border border-[#D8CEBE] px-2 py-1.5 rounded font-mono text-xs"
                      />
                    </div>
                    <div className="text-[10px] text-[#777]">
                      {language === 'en' 
                        ? 'Demo card preloaded. Clicking Confirm will securely authorize the payment in VAN KY Escrow.' 
                        : 'Mô phỏng thanh toán thẻ quốc tế. Tiền cọc và tiền thuê được giữ trung gian an toàn.'}
                    </div>
                  </div>
                )}

                {/* Mock QR display if VietQR */}
                {paymentMethod === 'vietqr' && (
                  <div className="mt-3 p-3 bg-white border border-[#D8CEBE] rounded flex items-center gap-3">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=247000-VANKY-ESCROW-${totalAmount}`}
                      alt="VietQR Mock"
                      className="w-20 h-20 border rounded shrink-0"
                    />
                    <div className="text-[11px] text-[#555] space-y-1">
                      <div><strong>Ngân hàng thụ hưởng:</strong> MBBank (Ngân hàng Quân Đội)</div>
                      <div><strong>Số tài khoản Escrow:</strong> 8888 2026 9999</div>
                      <div><strong>Chủ tài khoản:</strong> VẬN KỲ - QUỸ BẢO CHỨNG DI SẢN</div>
                      <div><strong>Số tiền:</strong> <strong className="text-[#A4161A]">{formatPrice(totalAmount, currency)}</strong></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRMATION SUCCESS */}
          {step === 3 && createdOrder && (
            <div className="text-center py-6 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto border-2 border-green-500">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                  {t.successTitle}
                </h3>
                <div className="text-xs text-[#2D6A4F] font-semibold mt-1">
                  {t.successSub} #{createdOrder.id}
                </div>
              </div>

              <div className="max-w-md mx-auto bg-[#FAF6ED] p-4 border border-[#D8CEBE] rounded text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#666]">{language === 'en' ? 'Attire:' : 'Trang phục:'}</span>
                  <span className="font-bold">{createdOrder.costumeName} (Size {createdOrder.size})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">{language === 'en' ? 'Rental Period:' : 'Thời gian thuê:'}</span>
                  <span>{createdOrder.startDate} ~ {createdOrder.endDate} ({createdOrder.totalDays} {language === 'en' ? 'days' : 'ngày'})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">{language === 'en' ? 'Boutique:' : 'Tiệm cung cấp:'}</span>
                  <span>{createdOrder.storeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">{language === 'en' ? 'Delivery Mode:' : 'Địa chỉ nhận đồ:'}</span>
                  <span className="text-right max-w-[220px] truncate">
                    {createdOrder.hotelName ? `Khách sạn ${createdOrder.hotelName} (Phòng ${createdOrder.hotelRoom || 'Lễ tân'})` : (createdOrder.recipientAddress || createdOrder.storeAddress)}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#D8CEBE] flex justify-between font-bold text-[#A4161A]">
                  <span>{language === 'en' ? 'Total Locked in Escrow:' : 'Tổng tiền đã ký quỹ:'}</span>
                  <span>{formatPrice(createdOrder.financials.totalPaid, currency)}</span>
                </div>
              </div>

              <p className="text-xs text-[#666] max-w-md mx-auto leading-relaxed">
                {t.successDesc} {language === 'en' ? 'You can follow all 5 steps and refund progress under "My Orders".' : 'Bạn có thể theo dõi tiến trình 5 bước và dòng tiền hoàn cọc tại mục "Đơn của tôi".'}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-4 border-t border-[#D8CEBE] mt-4 flex items-center justify-between">
          {step === 1 && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-transparent text-xs text-[#666] hover:text-[#1A1A1A] cursor-pointer"
              >
                {language === 'en' ? 'Cancel' : 'Hủy bỏ'}
              </button>
              <button
                type="button"
                disabled={!isStep1Valid}
                onClick={() => setStep(2)}
                className={`px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs ${
                  isStep1Valid
                    ? 'bg-[#A4161A] hover:bg-[#850D11] text-white cursor-pointer'
                    : 'bg-[#D8CEBE] text-[#777] cursor-not-allowed'
                }`}
              >
                <span>{language === 'en' ? 'Review & Escrow Checkout' : 'Xem tóm tắt & Thanh toán'}</span>
                <ChevronRight size={15} />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-3.5 py-2 bg-[#FAF6ED] hover:bg-[#E8DEC8] border border-[#D8CEBE] text-xs font-medium rounded text-[#1A1A1A] flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>{language === 'en' ? 'Back' : 'Quay lại'}</span>
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmPayment}
                className="px-6 py-2.5 bg-[#A4161A] hover:bg-[#850D11] text-white text-xs font-bold uppercase tracking-wider rounded transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{language === 'en' ? 'Securing Escrow Vault...' : 'Đang kết nối ký quỹ...'}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} className="text-[#D4A347]" />
                    <span>{t.confirmPay}</span>
                  </>
                )}
              </button>
            </>
          )}

          {step === 3 && createdOrder && (
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-[#FAF6ED] hover:bg-[#E8DEC8] border border-[#D8CEBE] text-xs font-medium rounded text-[#1A1A1A] cursor-pointer"
              >
                {t.continueBrowsing}
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBookingSuccess(createdOrder);
                }}
                className="px-6 py-2.5 bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-bold uppercase tracking-wider rounded transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>{t.goToOrders}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
