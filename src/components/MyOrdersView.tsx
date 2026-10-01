import React, { useState, useEffect } from 'react';
import { 
  Package, ShieldCheck, CheckCircle2, Clock, Truck, UserCheck, 
  RotateCcw, Sparkles, Upload, AlertCircle, ArrowRight, DollarSign,
  Store, Calendar, Phone, MapPin, Eye, RefreshCw, ChevronRight, FileText, Info, Building2,
  Camera, Users
} from 'lucide-react';
import { RentalOrder, OrderStepStatus, DamageReport } from '../types/rental';
import { 
  getStoredOrders, 
  updateOrder, 
  STATUS_SEQUENCE,
  createTestOrder
} from '../utils/orderStorage';
import { Language, Currency, formatPrice, UI_TRANSLATIONS } from '../utils/i18n';
import { COSTUME_TRANSLATIONS } from '../data/costumeTranslations';

interface MyOrdersViewProps {
  onNavigateToLookbook?: () => void;
  onNavigateToStudio?: (costumeId: string) => void;
  onSwitchToStore?: () => void;
  language?: Language;
  currency?: Currency;
}

export const MyOrdersView: React.FC<MyOrdersViewProps> = ({
  onNavigateToLookbook,
  onNavigateToStudio,
  onSwitchToStore,
  language = 'vi',
  currency = 'VND'
}) => {
  const t = UI_TRANSLATIONS[language].orders;
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [testOrderToast, setTestOrderToast] = useState<{ id: string; text: string } | null>(null);

  // Inspection form state (for orders at 'da-tra-do' step)
  const [inspectionResult, setInspectionResult] = useState<'perfect' | 'minor'>('perfect');
  const [inspectionDamageType, setInspectionDamageType] = useState<string>('stain');
  const [inspectionDeduction, setInspectionDeduction] = useState<number>(120000);
  const [inspectionNote, setInspectionNote] = useState<string>(
    language === 'en' ? 'Attire returned clean, no loose threads or stains.' : 'Trang phục nguyên vẹn, sạch sẽ, không sờn rách.'
  );
  const [uploadedInspectionImg, setUploadedInspectionImg] = useState<string | null>(null);

  // Load orders from localStorage
  const refreshOrders = () => {
    const list = getStoredOrders();
    setOrders(list);
    if (!selectedOrderId && list.length > 0) {
      setSelectedOrderId(list[0].id);
    }
  };

  useEffect(() => {
    refreshOrders();
  }, []);

  const activeOrder = orders.find(o => o.id === selectedOrderId) || orders[0] || null;

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (filterTab === 'active') return o.status !== 'hoan-coc';
    if (filterTab === 'completed') return o.status === 'hoan-coc';
    return true;
  });

  // Dynamic status labels based on current language
  const statusLabels: Record<OrderStepStatus, { label: string; subtext: string; color: string }> = {
    'da-dat': {
      label: t.step1,
      subtext: language === 'en' 
        ? 'Funds safely protected in VAN KY Escrow Vault · Boutique is preparing attire' 
        : 'Tiền bảo chứng trong quỹ VẬN KỲ · Tiệm đang chuẩn bị đồ',
      color: '#B8862B'
    },
    'dang-giao': {
      label: t.step2,
      subtext: language === 'en'
        ? 'Courier in transit or Package ready at boutique / hotel concierge'
        : 'Shipper đang giao hoặc Khách có thể ghé tiệm lấy / Gửi lễ tân',
      color: '#0068FF'
    },
    'dang-su-dung': {
      label: t.step3,
      subtext: language === 'en'
        ? 'Customer is enjoying the traditional heritage experience'
        : 'Khách đang mặc trang phục và trải nghiệm di sản',
      color: '#2D6A4F'
    },
    'da-tra-do': {
      label: t.step4,
      subtext: language === 'en'
        ? 'Boutique is conducting condition inspection on fabric & accessories'
        : 'Tiệm đối tác đang kiểm tra hiện trạng vải & phụ kiện',
      color: '#9333EA'
    },
    'hoan-coc': {
      label: t.step5,
      subtext: language === 'en'
        ? 'Inspection complete. Rental fee disbursed to boutique & deposit refunded to customer'
        : 'Đã giải ngân tiền thuê cho tiệm & Hoàn cọc cho khách',
      color: '#16A34A'
    }
  };

  // Demo step transition handler
  const handleAdvanceStep = (order: RentalOrder) => {
    const currentIndex = STATUS_SEQUENCE.indexOf(order.status);
    if (currentIndex >= STATUS_SEQUENCE.length - 1) return;

    const nextStatus = STATUS_SEQUENCE[currentIndex + 1];
    const nowStr = new Date().toLocaleString(language === 'en' ? 'en-US' : 'vi-VN', {
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
    });

    const nextNotes: Record<OrderStepStatus, string> = {
      'da-dat': language === 'en' ? 'Deposit secured safely in VAN KY Escrow Vault' : 'Đã đặt cọc và tiền đang khóa an toàn trong quỹ VẬN KỲ',
      'dang-giao': order.deliveryMethod === 'hotel'
        ? (language === 'en' ? `Package delivered to hotel front desk for ${order.recipientName}` : `Đã giao tới lễ tân khách sạn cho ${order.recipientName}`)
        : order.deliveryMethod === 'store'
        ? (language === 'en' ? `Attire prepared and ready for pickup at ${order.storeName}` : `Trang phục đã chuẩn bị sẵn sàng tại ${order.storeName}`)
        : (language === 'en' ? 'Courier is in transit with your package' : 'Shipper đã lấy trang phục và đang giao tận nơi cho khách'),
      'dang-su-dung': language === 'en' ? 'Client has received attire and started heritage tour' : 'Khách hàng đã nhận trang phục và bắt đầu thời gian trải nghiệm',
      'da-tra-do': language === 'en' ? 'Costume returned to boutique; partner is inspecting condition' : 'Khách đã gửi trả đồ về tiệm đối tác, tiệm đang tiến hành kiểm tra tình trạng vải',
      'hoan-coc': language === 'en' ? 'Inspection approved. Escrow vault disbursed payout & refunded deposit' : 'Kiểm tra hoàn tất. Quỹ VẬN KỲ đã giải ngân tiền thuê cho tiệm và hoàn cọc cho khách'
    };

    const updated: RentalOrder = {
      ...order,
      status: nextStatus,
      statusHistory: [
        ...order.statusHistory,
        {
          status: nextStatus,
          timestamp: nowStr,
          note: nextNotes[nextStatus]
        }
      ]
    };

    // If transitioned to hoan-coc, update escrow status and financials
    if (nextStatus === 'hoan-coc') {
      updated.escrowStatus = 'disbursed';
      if (!updated.damageReport) {
        updated.damageReport = {
          isDamaged: false,
          type: 'none',
          description: language === 'en' ? 'Attire returned in 100% pristine condition' : 'Trang phục hoàn hảo nguyên vẹn',
          deductionAmount: 0,
          inspectionNote: language === 'en' ? 'Passed quality check. 100% security deposit refunded.' : 'Không phát hiện tì vết. Đã hoàn 100% tiền cọc.'
        };
      }
    }

    updateOrder(updated);
    refreshOrders();
  };

  // Submit Inspection Report at 'da-tra-do' step
  const handleCompleteInspection = (order: RentalOrder) => {
    const isDamaged = inspectionResult === 'minor';
    const deduction = isDamaged ? inspectionDeduction : 0;
    const finalRefund = Math.max(0, order.financials.depositTotal - deduction);

    const damageReport: DamageReport = {
      isDamaged,
      type: isDamaged ? 'minor-stain' : 'none',
      description: isDamaged 
        ? (language === 'en' 
            ? `Minor wear: ${inspectionDamageType === 'stain' ? 'Lipstick mark on collar line' : 'Loose seam at hem'}. Restoration fee deducted.`
            : `Hư hỏng nhẹ: ${inspectionDamageType === 'stain' ? 'Dính lem son / vết bẩn nhẹ ở viền cổ áo' : 'Sút chỉ đường may tà áo'}. Khấu trừ chi phí giặt hấp & phục chế.`)
        : (language === 'en' ? 'Attire in 100% pristine condition, silk pristine, accessories complete.' : 'Trang phục nguyên vẹn 100%, tơ lụa phẳng phiu, đầy đủ phụ kiện.'),
      deductionAmount: deduction,
      photoUrl: uploadedInspectionImg || order.costumeImage,
      inspectionNote: inspectionNote.trim() || (language === 'en' ? 'Inspection authenticated by partner boutique and VAN KY.' : 'Biên bản kiểm tra nghiệm thu đã được tiệm đối tác và VẬN KỲ xác thực.')
    };

    const nowStr = new Date().toLocaleString(language === 'en' ? 'en-US' : 'vi-VN', {
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
    });

    const updated: RentalOrder = {
      ...order,
      status: 'hoan-coc',
      escrowStatus: 'disbursed',
      damageReport,
      financials: {
        ...order.financials,
        deductionAmount: deduction,
        depositRefund: finalRefund
      },
      statusHistory: [
        ...order.statusHistory,
        {
          status: 'hoan-coc',
          timestamp: nowStr,
          note: isDamaged
            ? (language === 'en' 
                ? `Inspection: Deducted ${formatPrice(deduction, currency)} restoration fee. VAN KY refunded remaining ${formatPrice(finalRefund, currency)} deposit to customer.`
                : `Nghiệm thu: Khấu trừ ${formatPrice(deduction, currency)} phí phục hồi. VẬN KỲ đã hoàn ${formatPrice(finalRefund, currency)} tiền cọc còn lại cho khách.`)
            : (language === 'en'
                ? `Inspection: Pristine condition. VAN KY refunded 100% deposit (${formatPrice(finalRefund, currency)}) to customer.`
                : `Nghiệm thu: Trang phục nguyên vẹn. VẬN KỲ đã hoàn 100% tiền cọc (${formatPrice(finalRefund, currency)}) cho khách.`)
        }
      ]
    };

    updateOrder(updated);
    refreshOrders();
  };

  // Simulate Photo Upload
  const handlePhotoUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedInspectionImg(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateTestOrder = () => {
    const newOrder = createTestOrder();
    refreshOrders();
    setSelectedOrderId(newOrder.id);
    setTestOrderToast({
      id: newOrder.id,
      text: language === 'en'
        ? `Demo order #${newOrder.id} created successfully! Switch to "Store" mode in the header to approve, ship, and inspect.`
        : `Đã tạo đơn thử nghiệm #${newOrder.id} thành công! Hãy chuyển sang chế độ "Tiệm" ở menu để duyệt, giao và nghiệm thu.`
    });
    setTimeout(() => setTestOrderToast(null), 7000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Test Order Toast Notification */}
      {testOrderToast && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-[#1F2A44] text-[#FAF6ED] border-2 border-[#D4A347] p-4 rounded-lg shadow-2xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in slide-in-from-top-3 max-w-lg">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 size={18} className="text-[#D4A347] shrink-0 mt-0.5" />
            <span className="leading-relaxed">{testOrderToast.text}</span>
          </div>
          {onSwitchToStore && (
            <button
              onClick={() => {
                setTestOrderToast(null);
                onSwitchToStore();
              }}
              className="px-3 py-1.5 bg-[#A4161A] hover:bg-[#850D11] text-white font-bold rounded text-xs shrink-0 cursor-pointer shadow-xs transition-colors self-end sm:self-auto"
            >
              Sang Giao Diện Tiệm →
            </button>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#D8CEBE] mb-8 gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#B8862B] font-semibold flex items-center gap-1.5 mb-1">
            <ShieldCheck size={16} className="text-[#A4161A]" />
            <span>{language === 'en' ? 'VAN KY Escrow · Safe Heritage Attire Rental Platform' : 'VẬN KỲ Escrow · Nền Tảng Ký Quỹ & Bảo Chứng Thuê Cổ Phục'}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A]">
            {t.title}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#555] max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Filter Tabs & Test Order Button */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCreateTestOrder}
            title="Tạo nhanh 1 đơn hàng mới để trải nghiệm luồng đặt -> tiệm duyệt -> giao -> trả -> nghiệm thu"
            className="px-3.5 py-1.5 bg-[#A4161A] hover:bg-[#850D11] text-white text-xs font-bold rounded flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
          >
            <Sparkles size={13} className="text-[#D4A347]" />
            <span>Tạo đơn thử</span>
          </button>

          <div className="flex items-center gap-1 bg-[#FAF6ED] p-1 border border-[#D8CEBE] rounded text-xs font-medium">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                filterTab === 'all' ? 'bg-[#1F2A44] text-white font-bold' : 'text-[#555] hover:text-[#1A1A1A]'
              }`}
            >
              {t.allTab} ({orders.length})
            </button>
            <button
              onClick={() => setFilterTab('active')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                filterTab === 'active' ? 'bg-[#1F2A44] text-white font-bold' : 'text-[#555] hover:text-[#1A1A1A]'
              }`}
            >
              {t.activeTab} ({orders.filter(o => o.status !== 'hoan-coc').length})
            </button>
            <button
              onClick={() => setFilterTab('completed')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                filterTab === 'completed' ? 'bg-[#1F2A44] text-white font-bold' : 'text-[#555] hover:text-[#1A1A1A]'
              }`}
            >
              {t.completedTab} ({orders.filter(o => o.status === 'hoan-coc').length})
            </button>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-[#FAF6ED] border border-[#D8CEBE] rounded p-8">
          <Package size={48} className="mx-auto text-[#CBBDA8] mb-3" />
          <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
            {language === 'en' ? 'You have no rental orders yet' : 'Bạn chưa có đơn thuê nào'}
          </h3>
          <p className="text-xs text-[#666] mt-1 max-w-sm mx-auto">
            {language === 'en'
              ? 'Explore Vietnamese historical attire in the Lookbook and enjoy safe escrow-protected rentals!'
              : 'Hãy khám phá các mẫu cổ phục di sản trong Lookbook và trải nghiệm dịch vụ thuê an toàn với quỹ bảo chứng VẬN KỲ!'}
          </p>
          {onNavigateToLookbook && (
            <button
              onClick={onNavigateToLookbook}
              className="mt-4 px-5 py-2.5 bg-[#A4161A] hover:bg-[#850D11] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer"
            >
              {language === 'en' ? 'Explore Lookbook' : 'Khám phá Lookbook ngay'}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Order List Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>{language === 'en' ? `Order List (${filteredOrders.length})` : `Danh sách đơn hàng (${filteredOrders.length})`}</span>
              <span className="text-[10px] text-[#777] font-normal">{language === 'en' ? 'Select to view' : 'Chọn đơn để xem'}</span>
            </div>

            <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
              {filteredOrders.map((order) => {
                const isSelected = order.id === activeOrder?.id;
                const statusMeta = statusLabels[order.status];

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`p-3.5 rounded border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#FAF6ED] border-[#A4161A] ring-1 ring-[#A4161A] shadow-xs'
                        : 'bg-white hover:bg-[#FAF6ED]/50 border-[#D8CEBE]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={order.costumeImage}
                          alt={order.costumeName}
                          className="w-12 h-14 object-cover rounded border border-[#D8CEBE] shrink-0"
                        />
                        <div>
                          <div className="font-bold text-xs text-[#1A1A1A] line-clamp-1">
                            {order.costumeName}
                          </div>
                          <div className="text-[10px] text-[#777]">
                            #{order.id} · Size {order.size}
                          </div>
                          {/* Badges for Experience Package & Group Order */}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {order.experiencePackage && (order.experiencePackage.hasPhotography || order.experiencePackage.hasMakeup) && (
                              <span className="text-[9px] font-bold bg-[#A4161A]/10 text-[#A4161A] px-1.5 py-0.5 rounded border border-[#A4161A]/20 flex items-center gap-0.5">
                                <Camera size={9} />
                                <span>{language === 'en' ? 'Experience' : 'Gói trải nghiệm'}</span>
                              </span>
                            )}
                            {order.isGroupOrder && (
                              <span className="text-[9px] font-bold bg-[#1F2A44]/10 text-[#1F2A44] px-1.5 py-0.5 rounded border border-[#1F2A44]/20 flex items-center gap-0.5">
                                <Users size={9} />
                                <span>{language === 'en' ? 'Group Order' : 'Đơn nhóm'}</span>
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-bold text-[#A4161A] mt-1">
                            {formatPrice(order.financials.totalPaid, currency)}
                          </div>
                        </div>
                      </div>

                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap uppercase"
                        style={{
                          backgroundColor: `${statusMeta.color}15`,
                          color: statusMeta.color
                        }}
                      >
                        {statusMeta.label}
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-[#E8DEC8] flex items-center justify-between text-[10px] text-[#666]">
                      <span>{order.startDate} ~ {order.endDate}</span>
                      <span>{order.storeName}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Active Order Detail Dashboard */}
          {activeOrder && (
            <div className="lg:col-span-8 space-y-6">
              {/* Order Master Card */}
              <div className="bg-[#FAF6ED] border border-[#D8CEBE] p-5 sm:p-6 rounded space-y-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#D8CEBE] gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-serif text-lg font-bold text-[#1A1A1A]">
                        {language === 'en' ? `Rental Order #${activeOrder.id}` : `Đơn Thuê #${activeOrder.id}`}
                      </h2>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded font-bold uppercase"
                        style={{
                          backgroundColor: `${statusLabels[activeOrder.status].color}20`,
                          color: statusLabels[activeOrder.status].color
                        }}
                      >
                        {statusLabels[activeOrder.status].label}
                      </span>
                      {activeOrder.experiencePackage && (activeOrder.experiencePackage.hasPhotography || activeOrder.experiencePackage.hasMakeup) && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-[#A4161A] text-white flex items-center gap-1 shadow-2xs">
                          <Camera size={11} />
                          <span>{language === 'en' ? 'Experience Package' : 'Gói trải nghiệm'}</span>
                        </span>
                      )}
                      {activeOrder.isGroupOrder && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-[#1F2A44] text-[#FAF6ED] flex items-center gap-1 shadow-2xs">
                          <Users size={11} />
                          <span>{language === 'en' ? 'Group Order' : 'Đơn nhóm'}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#666] mt-0.5">
                      {language === 'en' ? 'Created:' : 'Khởi tạo:'} {activeOrder.createdAt ? new Date(activeOrder.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'vi-VN') : 'Recent'} · {activeOrder.storeName}
                    </p>
                  </div>

                  {/* DEMO ADVANCE BUTTON (REQUIREMENT 4) */}
                  {activeOrder.status !== 'hoan-coc' && (
                    <button
                      onClick={() => handleAdvanceStep(activeOrder)}
                      title="Bấm để mô phỏng nâng tiến trình sang bước kế tiếp"
                      className="px-3.5 py-2 bg-[#1F2A44] hover:bg-[#121A2D] text-white text-xs font-semibold rounded flex items-center gap-2 cursor-pointer shadow-xs transition-colors shrink-0"
                    >
                      <RefreshCw size={14} className="text-[#D4A347]" />
                      <span>{t.advanceStepDemo}</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>

                {/* 5-STEP VISUAL PROGRESSION BAR (REQUIREMENT 4) */}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A] mb-3 flex items-center gap-1.5">
                    <Clock size={14} className="text-[#A4161A]" />
                    <span>{t.stepSequence}:</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                    {STATUS_SEQUENCE.map((st, idx) => {
                      const currentIdx = STATUS_SEQUENCE.indexOf(activeOrder.status);
                      const isPast = idx < currentIdx;
                      const isCurrent = idx === currentIdx;
                      const isFuture = idx > currentIdx;
                      const meta = statusLabels[st];

                      return (
                        <div
                          key={st}
                          className={`p-2.5 rounded border text-xs flex flex-col justify-between transition-all ${
                            isCurrent
                              ? 'bg-white border-[#A4161A] ring-2 ring-[#A4161A]/30 shadow-xs'
                              : isPast
                              ? 'bg-[#E8F5E9] border-[#2D6A4F]/40 text-[#2D6A4F]'
                              : 'bg-[#FAF6ED]/50 border-[#D8CEBE] text-[#999]'
                          }`}
                        >
                          <div>
                            <div className={`w-6 h-6 rounded-full mx-auto mb-1.5 flex items-center justify-center text-xs font-bold ${
                              isCurrent
                                ? 'bg-[#A4161A] text-white'
                                : isPast
                                ? 'bg-[#2D6A4F] text-white'
                                : 'bg-[#D8CEBE] text-[#666]'
                            }`}>
                              {isPast ? '✓' : idx + 1}
                            </div>
                            <div className="font-bold text-[11px] leading-snug">
                              {meta.label}
                            </div>
                          </div>
                          <div className="text-[10px] mt-1.5 line-clamp-2 leading-tight">
                            {isCurrent && <span className="text-[#A4161A] font-medium">{language === 'en' ? 'Active step' : 'Đang diễn ra'}</span>}
                            {isPast && <span className="text-[#2D6A4F]">{language === 'en' ? 'Completed' : 'Đã hoàn tất'}</span>}
                            {isFuture && <span>{language === 'en' ? 'Pending' : 'Chờ tiến trình'}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Status explanation alert */}
                  <div className="mt-3 p-3 bg-white border border-[#D8CEBE] rounded text-xs text-[#555] flex items-center gap-2.5">
                    <Info size={16} className="text-[#B8862B] shrink-0" />
                    <div>
                      <strong>{language === 'en' ? 'Current Status:' : 'Hiện trạng:'} </strong>
                      <span>{statusLabels[activeOrder.status].subtext}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* GÓI TRẢI NGHIỆM: CHI TIẾT & BƯỚC THEO DÕI "ĐÃ XÁC NHẬN LỊCH CHỤP" */}
              {activeOrder.experiencePackage && (activeOrder.experiencePackage.hasPhotography || activeOrder.experiencePackage.hasMakeup) && (
                <div className="bg-[#FFFBEB] border-2 border-[#B8862B] p-5 rounded space-y-3.5 shadow-xs animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E8DEC8] gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-[#B8862B] text-white rounded-md shrink-0">
                        <Camera size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-sm sm:text-base font-bold text-[#8F6C22] uppercase tracking-wide">
                            {language === 'en' ? 'Heritage Experience Package (Photo & Makeup)' : 'Gói Trải Nghiệm Di Sản (Thuê + Chụp + Makeup)'}
                          </h3>
                          <span className="text-[10px] bg-[#A4161A] text-white px-2 py-0.5 rounded-full font-bold uppercase">
                            {language === 'en' ? 'Experience' : 'Gói trải nghiệm'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#785E23] mt-0.5">
                          {language === 'en'
                            ? 'Services performed by verified local partners, VAN KY holds escrow funds until completion.'
                            : 'Dịch vụ do đối tác thực hiện, VẬN KỲ giữ tiền đến khi hoàn tất.'}
                        </p>
                      </div>
                    </div>

                    {/* BƯỚC THEO DÕI: "ĐÃ XÁC NHẬN LỊCH CHỤP" */}
                    <div className="flex items-center gap-1.5 bg-green-100 border border-green-400 text-green-900 px-3.5 py-1.5 rounded-full font-bold text-xs shrink-0 self-start sm:self-auto shadow-2xs">
                      <CheckCircle2 size={15} className="text-green-700" />
                      <span>{language === 'en' ? 'Photo Schedule Confirmed' : 'Đã xác nhận lịch chụp'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {activeOrder.experiencePackage.hasPhotography && (
                      <div className="bg-white/90 p-3.5 rounded border border-[#E8DEC8] space-y-1.5">
                        <div className="font-bold text-[#A4161A] flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Camera size={14} />
                            <span>{language === 'en' ? 'Heritage Photoshoot' : 'Chụp ảnh tại điểm di sản'}</span>
                          </span>
                          <span className="text-xs">{formatPrice(activeOrder.experiencePackage.photographyPrice, currency)}</span>
                        </div>
                        <div className="text-[11px] text-[#555] space-y-1 pt-1 border-t border-[#F0E6D8]">
                          <div>• {language === 'en' ? 'Lead Photographer:' : 'Nhiếp ảnh gia:'} <strong>{activeOrder.experiencePackage.photographerName || 'Studio Cổ Phong Hoàng Gia'}</strong></div>
                          <div>• {language === 'en' ? 'Schedule Slot:' : 'Lịch chụp:'} <strong>{activeOrder.experiencePackage.scheduledTime || `08:30 ngày ${activeOrder.startDate}`}</strong></div>
                          <div>• {language === 'en' ? 'Output deliverables:' : 'Gói bàn giao:'} Toàn bộ file gốc + 15 ảnh chỉnh màu nghệ thuật</div>
                          <div>• {language === 'en' ? 'Status:' : 'Trạng thái:'} <span className="text-green-700 font-bold">✓ {language === 'en' ? 'Slot locked' : 'Đã khóa lịch chụp di sản'}</span></div>
                        </div>
                      </div>
                    )}

                    {activeOrder.experiencePackage.hasMakeup && (
                      <div className="bg-white/90 p-3.5 rounded border border-[#E8DEC8] space-y-1.5">
                        <div className="font-bold text-[#B8862B] flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Sparkles size={14} />
                            <span>{language === 'en' ? 'Hair & Makeup Styling' : 'Trang điểm và làm tóc'}</span>
                          </span>
                          <span className="text-xs">{formatPrice(activeOrder.experiencePackage.makeupPrice, currency)}</span>
                        </div>
                        <div className="text-[11px] text-[#555] space-y-1 pt-1 border-t border-[#F0E6D8]">
                          <div>• {language === 'en' ? 'Stylist Artist:' : 'Chuyên viên:'} <strong>{activeOrder.experiencePackage.makeupArtistName || 'Nghệ nhân Mai Anh Makeup'}</strong></div>
                          <div>• {language === 'en' ? 'Style Protocol:' : 'Kỹ thuật:'} Vấn khăn chuẩn triều đại, rẽ ngôi & tone cổ phong</div>
                          <div>• {language === 'en' ? 'Timing:' : 'Thời gian thực hiện:'} 45 phút trước giờ nhận đồ / chụp ảnh</div>
                          <div>• {language === 'en' ? 'Status:' : 'Trạng thái:'} <span className="text-green-700 font-bold">✓ {language === 'en' ? 'Artist reserved' : 'Đã bố trí nghệ nhân'}</span></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ĐƠN NHÓM: TỔNG SỐ BỘ THEO SIZE & DANH SÁCH TỪNG NGƯỜI */}
              {activeOrder.isGroupOrder && activeOrder.groupOrderSummary && (
                <div className="bg-[#FAF6ED] border-2 border-[#1F2A44] p-5 rounded space-y-4 shadow-xs animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#D8CEBE] gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-[#1F2A44] text-white rounded-md shrink-0">
                        <Users size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-base font-bold text-[#1F2A44] uppercase tracking-wide">
                            {activeOrder.groupOrderSummary.groupName}
                          </h3>
                          <span className="text-[10px] bg-[#1F2A44] text-[#FAF6ED] px-2 py-0.5 rounded-full font-bold uppercase">
                            Đơn nhóm kỷ yếu
                          </span>
                        </div>
                        <p className="text-[11px] text-[#555] mt-0.5">
                          Đã áp dụng giảm giá {(activeOrder.groupOrderSummary.discountRate * 100).toFixed(0)}% tiền thuê · Phí điều phối {formatPrice(activeOrder.groupOrderSummary.coordinationFee, currency)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-green-50 border border-green-300 text-green-900 px-3 py-1.5 rounded font-bold text-xs">
                      <span>Đã thu {activeOrder.groupOrderSummary.paidMembersCount}/{activeOrder.groupOrderSummary.totalMembers} thành viên</span>
                    </div>
                  </div>

                  {/* Tổng số bộ theo size */}
                  <div>
                    <div className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A] mb-2 flex items-center justify-between">
                      <span>Tổng số bộ theo Size (Giao hàng loạt):</span>
                      <span className="text-[11px] text-[#A4161A] font-bold">
                        Tổng {Object.values(activeOrder.groupOrderSummary.sizeCounts).reduce((a, b) => a + b, 0)} bộ
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                      <div className="bg-white p-3 rounded border border-[#D8CEBE]">
                        <div className="text-[11px] text-[#777] uppercase font-semibold">Size S</div>
                        <div className="text-xl font-bold text-[#A4161A] mt-0.5">{activeOrder.groupOrderSummary.sizeCounts.S || 0}</div>
                        <div className="text-[10px] text-[#999]">bộ trang phục</div>
                      </div>
                      <div className="bg-white p-3 rounded border border-[#D8CEBE]">
                        <div className="text-[11px] text-[#777] uppercase font-semibold">Size M</div>
                        <div className="text-xl font-bold text-[#A4161A] mt-0.5">{activeOrder.groupOrderSummary.sizeCounts.M || 0}</div>
                        <div className="text-[10px] text-[#999]">bộ trang phục</div>
                      </div>
                      <div className="bg-white p-3 rounded border border-[#D8CEBE]">
                        <div className="text-[11px] text-[#777] uppercase font-semibold">Size L</div>
                        <div className="text-xl font-bold text-[#A4161A] mt-0.5">{activeOrder.groupOrderSummary.sizeCounts.L || 0}</div>
                        <div className="text-[10px] text-[#999]">bộ trang phục</div>
                      </div>
                      <div className="bg-white p-3 rounded border border-[#D8CEBE]">
                        <div className="text-[11px] text-[#777] uppercase font-semibold">Size XL</div>
                        <div className="text-xl font-bold text-[#A4161A] mt-0.5">{activeOrder.groupOrderSummary.sizeCounts.XL || 0}</div>
                        <div className="text-[10px] text-[#999]">bộ trang phục</div>
                      </div>
                    </div>
                  </div>

                  {/* Danh sách phân bổ trang phục theo từng người */}
                  <div>
                    <div className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A] mb-2">
                      Danh sách phân bổ bộ trang phục theo từng người:
                    </div>
                    <div className="max-h-56 overflow-y-auto border border-[#D8CEBE] rounded bg-white">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-[#F6EFE3] text-[#444] border-b border-[#D8CEBE] sticky top-0 text-[11px]">
                          <tr>
                            <th className="p-2.5">STT</th>
                            <th className="p-2.5">Họ tên thành viên</th>
                            <th className="p-2.5">Bộ trang phục</th>
                            <th className="p-2.5">Size</th>
                            <th className="p-2.5 text-right">Phần tiền đã nộp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EAE0D0]">
                          {activeOrder.groupOrderSummary.memberBreakdown.map((m, idx) => (
                            <tr key={idx} className="hover:bg-amber-50/50">
                              <td className="p-2.5 text-[#777]">{idx + 1}</td>
                              <td className="p-2.5 font-medium text-[#1A1A1A]">{m.name}</td>
                              <td className="p-2.5 text-[#555]">{m.costumeName}</td>
                              <td className="p-2.5 font-bold text-[#A4161A]">{m.size}</td>
                              <td className="p-2.5 text-right">
                                {m.isPaid ? (
                                  <span className="text-green-700 font-bold">✓ {formatPrice(m.amountPaid, currency)}</span>
                                ) : (
                                  <span className="text-amber-700 font-medium">Chưa thanh toán</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* INSPECTION MODULE (Khi đơn ở bước 'da-tra-do' - REQUIREMENT 4) */}
              {activeOrder.status === 'da-tra-do' && (
                <div className="bg-[#FFFDF7] border-2 border-[#B8862B] p-5 rounded space-y-4 shadow-sm animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8]">
                    <div className="flex items-center gap-2 text-[#A4161A]">
                      <FileText size={20} />
                      <h3 className="font-serif text-base font-bold">
                        {t.inspectionTitle}
                      </h3>
                    </div>
                    <span className="text-[11px] text-[#780016] bg-[#FDF2F2] px-2.5 py-0.5 rounded font-semibold border border-red-200">
                      {language === 'en' ? 'Boutique is inspecting' : 'Tiệm đối tác đang xử lý'}
                    </span>
                  </div>

                  <p className="text-xs text-[#555] leading-relaxed">
                    {t.inspectionDesc}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left: Upload photo */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#1A1A1A] block">
                        {t.inspectionPhoto}:
                      </label>
                      <div className="w-full aspect-[4/3] bg-white border border-dashed border-[#D8CEBE] rounded flex flex-col items-center justify-center p-3 text-center relative overflow-hidden">
                        {uploadedInspectionImg ? (
                          <img
                            src={uploadedInspectionImg}
                            alt="Inspection"
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="space-y-2 text-[#777]">
                            <img
                              src={activeOrder.costumeImage}
                              alt="Costume sample"
                              className="w-20 h-20 object-cover mx-auto rounded opacity-80"
                            />
                            <div className="text-[11px]">
                              {language === 'en' ? 'Condition photograph upon return' : 'Ảnh chụp trang phục sau khi nhận lại tại tiệm'}
                            </div>
                          </div>
                        )}
                      </div>
                      <label className="w-full py-2 bg-[#FAF6ED] hover:bg-[#E8DEC8] border border-[#D8CEBE] rounded text-xs font-medium text-[#1A1A1A] flex items-center justify-center gap-2 cursor-pointer transition-colors">
                        <Upload size={14} className="text-[#A4161A]" />
                        <span>{uploadedInspectionImg ? t.changePhoto : t.uploadPhoto}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUploadSim}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Right: Inspection options */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-[#1A1A1A] block">
                        {t.evaluationLabel}:
                      </label>

                      <div className="space-y-2">
                        {/* Option 1: Perfect */}
                        <div
                          onClick={() => {
                            setInspectionResult('perfect');
                            setInspectionNote(language === 'en' ? 'Attire and accessories returned in pristine, spotless condition.' : 'Trang phục và phụ kiện hoàn hảo nguyên vẹn, thơm tho.');
                          }}
                          className={`p-3 rounded border cursor-pointer transition-all text-xs ${
                            inspectionResult === 'perfect'
                              ? 'bg-green-50 border-[#2D6A4F] ring-1 ring-[#2D6A4F] text-[#1B4332]'
                              : 'bg-white border-[#D8CEBE] text-[#555]'
                          }`}
                        >
                          <div className="font-bold flex items-center justify-between">
                            <span>{t.perfectOption}</span>
                            <span className="text-[#2D6A4F] font-bold">
                              {language === 'en' ? 'Refund ' : 'Hoàn '} {formatPrice(activeOrder.financials.depositTotal, currency)}
                            </span>
                          </div>
                          <p className="text-[11px] mt-1 text-[#2D6A4F]">
                            {t.perfectDesc}
                          </p>
                        </div>

                        {/* Option 2: Minor Damage */}
                        <div
                          onClick={() => {
                            setInspectionResult('minor');
                            setInspectionNote(language === 'en' ? 'Noticeable light lipstick trace on collar, requires gentle dry cleaning.' : 'Phát hiện lem son nhẹ viền cổ áo, cần xử lý giặt hấp chuyên sâu.');
                          }}
                          className={`p-3 rounded border cursor-pointer transition-all text-xs ${
                            inspectionResult === 'minor'
                              ? 'bg-amber-50 border-[#B8862B] ring-1 ring-[#B8862B] text-[#785E23]'
                              : 'bg-white border-[#D8CEBE] text-[#555]'
                          }`}
                        >
                          <div className="font-bold flex items-center justify-between">
                            <span>{t.minorOption}</span>
                            <span className="text-[#A4161A] font-bold">
                              -{formatPrice(inspectionDeduction, currency)}
                            </span>
                          </div>
                          <p className="text-[11px] mt-1 text-[#8F6C22]">
                            {t.minorDesc}
                          </p>

                          {inspectionResult === 'minor' && (
                            <div className="mt-2.5 pt-2.5 border-t border-amber-200 space-y-2">
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setInspectionDamageType('stain');
                                    setInspectionDeduction(120000);
                                  }}
                                  className={`px-2 py-1 rounded text-[11px] ${inspectionDamageType === 'stain' ? 'bg-[#B8862B] text-white font-bold' : 'bg-white border text-[#555]'}`}
                                >
                                  {t.stainDeduction}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setInspectionDamageType('thread');
                                    setInspectionDeduction(150000);
                                  }}
                                  className={`px-2 py-1 rounded text-[11px] ${inspectionDamageType === 'thread' ? 'bg-[#B8862B] text-white font-bold' : 'bg-white border text-[#555]'}`}
                                >
                                  {t.threadDeduction}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-[#444] block mb-1">
                          {t.inspectionNoteLabel}:
                        </label>
                        <input
                          type="text"
                          value={inspectionNote}
                          onChange={(e) => setInspectionNote(e.target.value)}
                          className="w-full bg-white border border-[#D8CEBE] px-3 py-1.5 rounded text-xs text-[#1A1A1A] focus:outline-none"
                        />
                      </div>

                      <button
                        onClick={() => handleCompleteInspection(activeOrder)}
                        className="w-full py-2.5 bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 size={16} />
                        <span>{t.confirmInspection}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TRANSPARENT FINANCIAL LEDGER (REQUIREMENT 4) */}
              <div className="bg-[#FAF6ED] border border-[#D8CEBE] p-5 rounded space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#D8CEBE]">
                  <div className="flex items-center gap-2 text-[#A4161A]">
                    <DollarSign size={18} />
                    <h3 className="font-serif text-base font-bold">
                      {t.ledgerTitle}
                    </h3>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded font-semibold uppercase ${
                    activeOrder.escrowStatus === 'disbursed'
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {activeOrder.escrowStatus === 'disbursed' ? t.ledgerDisbursed : t.ledgerHolding}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3.5 border border-[#D8CEBE] rounded">
                    <div className="text-[11px] text-[#666]">{t.payoutPartner}:</div>
                    <div className="text-base font-bold text-[#1A1A1A] mt-1">
                      {formatPrice(activeOrder.financials.partnerPayout, currency)}
                    </div>
                    <div className="text-[10px] text-[#2D6A4F] mt-1">
                      {activeOrder.status === 'hoan-coc' ? t.payoutNoteDisbursed : t.payoutNoteHolding}
                    </div>
                  </div>

                  <div className="bg-white p-3.5 border border-[#D8CEBE] rounded">
                    <div className="text-[11px] text-[#666]">{t.platformRevenue}:</div>
                    <div className="text-base font-bold text-[#1A1A1A] mt-1">
                      {formatPrice(activeOrder.financials.platformRevenue, currency)}
                    </div>
                    <div className="text-[10px] text-[#666] mt-1">
                      {activeOrder.isGroupOrder ? 'Bao gồm phí điều phối nhóm 500k' : (language === 'en' ? 'Platform operations & insurance' : 'Phí vận hành & bảo chứng')}
                    </div>
                  </div>

                  <div className="bg-white p-3.5 border border-[#D8CEBE] rounded">
                    <div className="text-[11px] text-[#666]">{t.depositRefund}:</div>
                    <div className="text-base font-bold text-[#A4161A] mt-1">
                      {formatPrice(activeOrder.financials.depositRefund, currency)}
                    </div>
                    <div className="text-[10px] text-[#2D6A4F] mt-1">
                      {activeOrder.status === 'hoan-coc' ? t.refundNoteDisbursed : t.refundNoteHolding}
                    </div>
                  </div>
                </div>

                {/* Detailed financial items for Experience and Group */}
                {(activeOrder.experiencePackage || activeOrder.isGroupOrder) && (
                  <div className="bg-white p-3 rounded border border-[#E8DEC8] text-[11px] space-y-1.5 text-[#555]">
                    <div className="font-bold text-[#1A1A1A] uppercase tracking-wide text-[10px] pb-1 border-b border-[#F0E6D8]">
                      Chi tiết cấu thành tài chính đơn:
                    </div>
                    <div className="flex justify-between">
                      <span>• Tiền thuê cổ phục:</span>
                      <span className="font-semibold text-[#1A1A1A]">{formatPrice(activeOrder.financials.rentalTotal, currency)}</span>
                    </div>
                    {activeOrder.financials.photographyFee ? (
                      <div className="flex justify-between">
                        <span>• Chụp ảnh di sản (800.000đ/buổi):</span>
                        <span className="font-semibold text-[#A4161A]">+{formatPrice(activeOrder.financials.photographyFee, currency)}</span>
                      </div>
                    ) : null}
                    {activeOrder.financials.makeupFee ? (
                      <div className="flex justify-between">
                        <span>• Trang điểm và làm tóc (150.000đ/người):</span>
                        <span className="font-semibold text-[#B8862B]">+{formatPrice(activeOrder.financials.makeupFee, currency)}</span>
                      </div>
                    ) : null}
                    {activeOrder.financials.discountAmount ? (
                      <div className="flex justify-between text-green-700">
                        <span>• Ưu đãi giảm giá nhóm ({(activeOrder.groupOrderSummary?.discountRate || 0.15) * 100}%):</span>
                        <span className="font-bold">-{formatPrice(activeOrder.financials.discountAmount, currency)}</span>
                      </div>
                    ) : null}
                    {activeOrder.financials.coordinationFee ? (
                      <div className="flex justify-between">
                        <span>• Phí điều phối & logistics đơn nhóm:</span>
                        <span className="font-semibold text-[#1A1A1A]">+{formatPrice(activeOrder.financials.coordinationFee, currency)}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between">
                      <span>• Tiền cọc bảo chứng VẬN KỲ (hoàn lại):</span>
                      <span className="font-semibold text-[#1A1A1A]">{formatPrice(activeOrder.financials.depositTotal, currency)}</span>
                    </div>
                  </div>
                )}

                {activeOrder.damageReport?.isDamaged && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-start gap-2">
                    <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>{language === 'en' ? 'Deduction Applied:' : 'Khấu trừ vi phạm:'} {formatPrice(activeOrder.damageReport.deductionAmount, currency)}</strong>
                      <p className="text-[11px] text-red-700 mt-0.5">{activeOrder.damageReport.description}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Info & Store Details (WITH HOTEL SUPPORT) */}
              <div className="bg-[#FAF6ED] border border-[#D8CEBE] p-5 rounded grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#444]">
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A] mb-2 flex items-center gap-1.5">
                    <Store size={14} className="text-[#A4161A]" />
                    <span>{language === 'en' ? 'Partner Boutique:' : 'Tiệm Đối Tác Cung Cấp:'}</span>
                  </div>
                  <div className="space-y-1">
                    <div><strong>{activeOrder.storeName}</strong></div>
                    <div className="text-[#666]">{activeOrder.storeAddress}</div>
                    <div className="text-[#A4161A] flex items-center gap-1 mt-1">
                      <Phone size={12} />
                      <span>{activeOrder.storePhone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A] mb-2 flex items-center gap-1.5">
                    {activeOrder.hotelName ? <Building2 size={14} className="text-[#A4161A]" /> : <Calendar size={14} className="text-[#A4161A]" />}
                    <span>{language === 'en' ? 'Delivery & Schedule:' : 'Thông Tin Nhận & Trả:'}</span>
                  </div>
                  <div className="space-y-1 text-[#666]">
                    <div>{language === 'en' ? 'Client:' : 'Người nhận:'} <strong className="text-[#1A1A1A]">{activeOrder.recipientName} ({activeOrder.recipientPhone})</strong></div>
                    {activeOrder.hotelName ? (
                      <div className="text-[#A4161A] font-semibold">
                        🏨 {language === 'en' ? 'Hotel Delivery:' : 'Giao tại khách sạn:'} {activeOrder.hotelName} (Phòng {activeOrder.hotelRoom || 'Lễ tân'})
                      </div>
                    ) : (
                      <div>
                        {language === 'en' ? 'Method:' : 'Hình thức:'} <strong>{activeOrder.deliveryMethod === 'store' ? (language === 'en' ? 'Pickup at store' : 'Nhận tại tiệm') : activeOrder.recipientAddress}</strong>
                      </div>
                    )}
                    <div>{language === 'en' ? 'Dates:' : 'Thời gian:'} <strong>{activeOrder.startDate}</strong> ~ <strong>{activeOrder.endDate}</strong> ({activeOrder.totalDays} {language === 'en' ? 'days' : 'ngày'})</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
