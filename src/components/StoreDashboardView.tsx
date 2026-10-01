import React, { useState, useEffect, useMemo } from 'react';
import { 
  Store, Calendar, Package, DollarSign, Award, CheckCircle2, 
  Clock, AlertTriangle, AlertCircle, RefreshCw, Eye, ArrowRight, 
  MapPin, Phone, ShieldCheck, ChevronRight, Filter, Search, 
  Upload, Camera, Sparkles, Check, X, FileText, BarChart3,
  Layers, Users, Lock, Unlock, HelpCircle, Bell, ArrowUpRight
} from 'lucide-react';
import { PARTNER_STORES } from '../data/partners';
import { RentalOrder, OrderStepStatus, PartnerStore, DamageReport } from '../types/rental';
import { getStoredOrders, updateOrder, saveOrders, STATUS_SEQUENCE, STATUS_LABELS } from '../utils/orderStorage';
import { 
  getStoreConfig, saveStoreConfig, toggleMaintenanceLock, 
  isCostumeDateLocked, CanonInspectionStatus, StorePlan 
} from '../utils/partnerStoreSettings';
import lookbookData from '../data/lookbook.json';
import { Costume } from '../types/lookbook';
import { Language, Currency, formatPrice } from '../utils/i18n';
import { HeritageCorner, VanKySeal, CloudMotif } from './TraditionalPattern';

export type StoreTabType = 'overview' | 'calendar' | 'orders' | 'inspection' | 'revenue' | 'badges';

interface StoreDashboardViewProps {
  currentStoreId: string;
  onSelectStore: (storeId: string) => void;
  onSwitchToCustomer: () => void;
  language?: Language;
  currency?: Currency;
}

export const StoreDashboardView: React.FC<StoreDashboardViewProps> = ({
  currentStoreId,
  onSelectStore,
  onSwitchToCustomer,
  language = 'vi',
  currency = 'VND'
}) => {
  const [activeTab, setActiveTab] = useState<StoreTabType>('overview');
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Store config (canon status, pro plan, maintenance locks)
  const [storeConfig, setStoreConfigState] = useState(() => getStoreConfig(currentStoreId));

  // Tab 3: Order filter state
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');

  // Tab 4: Inspection state
  const [selectedInspectionOrderId, setSelectedInspectionOrderId] = useState<string>('');
  const [inspectionCondition, setInspectionCondition] = useState<'pristine' | 'minor' | 'major' | 'lost'>('pristine');
  const [inspectionNotes, setInspectionNotes] = useState<string>('Trang phục và phụ kiện hoàn hảo, sạch sẽ, không sút chỉ.');
  const [inspectionPhotoPreview, setInspectionPhotoPreview] = useState<string | null>(null);

  // Tab 2: Calendar detail popup
  const [selectedCalendarCell, setSelectedCalendarCell] = useState<{
    costume: Costume;
    date: string;
    order?: RentalOrder;
    isLocked?: boolean;
  } | null>(null);

  // Current store object
  const store = useMemo(() => {
    return PARTNER_STORES.find(s => s.id === currentStoreId) || PARTNER_STORES[0];
  }, [currentStoreId]);

  // Load orders from shared store
  const refreshOrders = () => {
    const all = getStoredOrders();
    setOrders(all);
  };

  useEffect(() => {
    refreshOrders();
    setStoreConfigState(getStoreConfig(currentStoreId));
  }, [currentStoreId]);

  // Filter orders belonging to this store
  const storeOrders = useMemo(() => {
    return orders.filter(o => o.storeId === currentStoreId);
  }, [orders, currentStoreId]);

  // Helper toast notification
  const showToast = (msg: string) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(null), 4500);
  };

  // Today reference (simulate current date: 2026-09-30)
  const todayStr = '2026-09-30';
  const todayMs = new Date(todayStr).getTime();

  // Metrics for Tab 1: Tổng quan
  const metrics = useMemo(() => {
    const newOrders = storeOrders.filter(o => o.status === 'da-dat' && !o.isConfirmedByStore);
    
    // Revenue this month (paid orders)
    const monthlyRevenue = storeOrders.reduce((sum, o) => {
      return sum + (o.financials.partnerPayout || 0);
    }, 0);

    // Costumes currently out with customers
    const outCostumes = storeOrders.filter(o => o.status === 'dang-giao' || o.status === 'dang-su-dung');
    let outCount = 0;
    outCostumes.forEach(o => {
      if (o.isGroupOrder && o.groupOrderSummary) {
        outCount += o.groupOrderSummary.totalMembers || 1;
      } else {
        outCount += 1;
      }
    });

    // Orders due for return in next 2 days (between today and today+2 days, or overdue)
    const twoDaysMs = todayMs + (2 * 24 * 60 * 60 * 1000);
    const dueSoonOrders = storeOrders.filter(o => {
      if (o.status !== 'dang-su-dung') return false;
      const endMs = new Date(o.endDate).getTime();
      return endMs <= twoDaysMs;
    });

    // Approximate total inventory units across sizes
    const totalInventory = Object.values(store.stockByCostume).reduce((sum, sizes) => {
      return sum + Object.values(sizes).reduce((s, count) => s + count, 0);
    }, 0);

    const occupancyRate = totalInventory > 0 ? Math.min(100, Math.round((outCount / totalInventory) * 100)) : 0;

    return {
      newOrdersCount: newOrders.length,
      monthlyRevenue,
      outCount,
      dueSoonCount: dueSoonOrders.length,
      occupancyRate,
      totalInventory
    };
  }, [storeOrders, store, todayMs]);

  // "Cần xử lý hôm nay" lists
  const needsAction = useMemo(() => {
    const unconfirmed = storeOrders.filter(o => o.status === 'da-dat' && !o.isConfirmedByStore);
    
    // Needs delivery today or tomorrow
    const needsDelivery = storeOrders.filter(o => {
      if (o.status === 'da-dat' || o.status === 'dang-giao') {
        const startMs = new Date(o.startDate).getTime();
        return startMs <= todayMs + (24 * 60 * 60 * 1000);
      }
      return false;
    });

    // Needs return / inspection today
    const needsReturnOrInspection = storeOrders.filter(o => {
      if (o.status === 'da-tra-do') return true;
      if (o.status === 'dang-su-dung') {
        const endMs = new Date(o.endDate).getTime();
        return endMs <= todayMs;
      }
      return false;
    });

    return { unconfirmed, needsDelivery, needsReturnOrInspection };
  }, [storeOrders, todayMs]);

  // Available costumes in this boutique (normalized from lookbook)
  const boutiqueCostumes = useMemo(() => {
    const all = lookbookData as unknown as Costume[];
    const storeCostumeIds = Object.keys(store.stockByCostume);
    return all.filter(c => storeCostumeIds.includes(c.id));
  }, [store]);

  // 14 calendar dates starting from today
  const calendarDates = useMemo(() => {
    const dates: { dateStr: string; label: string; isWeekend: boolean; isToday: boolean }[] = [];
    const base = new Date(todayStr);
    for (let i = 0; i < 14; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isToday = i === 0;
      const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      dates.push({
        dateStr,
        label: `${dayNames[dayOfWeek]} ${dd}/${mm}`,
        isWeekend,
        isToday
      });
    }
    return dates;
  }, [todayStr]);

  // Check date conflict across active orders for this store
  const conflictingBookings = useMemo(() => {
    const conflicts: { costumeName: string; date: string; orders: RentalOrder[] }[] = [];
    boutiqueCostumes.forEach(costume => {
      calendarDates.forEach(({ dateStr }) => {
        const targetMs = new Date(dateStr).getTime();
        const activeMatches = storeOrders.filter(o => {
          if (o.costumeId !== costume.id || o.status === 'hoan-coc') return false;
          const s = new Date(o.startDate).getTime();
          const e = new Date(o.endDate).getTime();
          return targetMs >= s && targetMs <= e;
        });
        if (activeMatches.length > 1) {
          conflicts.push({
            costumeName: costume.name,
            date: dateStr,
            orders: activeMatches
          });
        }
      });
    });
    return conflicts;
  }, [boutiqueCostumes, calendarDates, storeOrders]);

  // Weekly Revenue mock data for Chart
  const weeklyRevenueData = [
    { day: 'T2 (28/09)', revenue: 1450000, heightPct: 45 },
    { day: 'T3 (29/09)', revenue: 2100000, heightPct: 65 },
    { day: 'T4 (30/09)', revenue: 3200000, heightPct: 95, isToday: true },
    { day: 'T5 (01/10)', revenue: 1850000, heightPct: 55 },
    { day: 'T6 (02/10)', revenue: 2750000, heightPct: 80 },
    { day: 'T7 (03/10)', revenue: 3900000, heightPct: 100 },
    { day: 'CN (04/10)', revenue: 3500000, heightPct: 90 }
  ];

  // ORDER ACTION HANDLERS (Shared state update)
  const handleConfirmOrder = (order: RentalOrder) => {
    const updated: RentalOrder = {
      ...order,
      isConfirmedByStore: true,
      statusHistory: [
        ...order.statusHistory,
        {
          status: order.status,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
          note: `Chủ tiệm ${store.name} đã xác nhận tiếp nhận đơn & đang chuẩn bị trang phục.`
        }
      ]
    };
    updateOrder(updated);
    refreshOrders();
    showToast(`Đã xác nhận đơn #${order.id}! Khách hàng có thể theo dõi tiến trình ngay.`);
  };

  const handleMarkShipped = (order: RentalOrder) => {
    const updated: RentalOrder = {
      ...order,
      status: 'dang-giao',
      isConfirmedByStore: true,
      statusHistory: [
        ...order.statusHistory,
        {
          status: 'dang-giao',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
          note: order.deliveryMethod === 'store'
            ? `Trang phục đã ủi phẳng, đóng gói trang trọng và sẵn sàng tại tiệm ${store.name}.`
            : `Đã bàn giao đồ cho shipper / nhân viên giao tới địa chỉ/khách sạn của khách.`
        }
      ]
    };
    updateOrder(updated);
    refreshOrders();
    showToast(`Đơn #${order.id} đã chuyển sang trạng thái "Đang giao / Sẵn sàng"!`);
  };

  const handleMarkInUse = (order: RentalOrder) => {
    const updated: RentalOrder = {
      ...order,
      status: 'dang-su-dung',
      statusHistory: [
        ...order.statusHistory,
        {
          status: 'dang-su-dung',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
          note: `Khách đã nhận đầy đủ trang phục & phụ kiện. Đang trong thời gian thuê.`
        }
      ]
    };
    updateOrder(updated);
    refreshOrders();
    showToast(`Đơn #${order.id} đã chuyển sang trạng thái "Đang sử dụng"!`);
  };

  const handleMarkReceivedBack = (order: RentalOrder) => {
    const updated: RentalOrder = {
      ...order,
      status: 'da-tra-do',
      statusHistory: [
        ...order.statusHistory,
        {
          status: 'da-tra-do',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
          note: `Tiệm đã nhận lại đồ từ khách. Đang tiến hành kiểm tra vải & phụ kiện.`
        }
      ]
    };
    updateOrder(updated);
    refreshOrders();
    setSelectedInspectionOrderId(order.id);
    showToast(`Đã nhận lại đồ cho đơn #${order.id}. Mời tiệm kiểm tra hiện trạng ở mục "Kiểm tra đồ trả"!`);
  };

  // TAB 4: INSPECTION SUBMIT HANDLER
  const handleCompleteInspection = () => {
    const targetOrder = storeOrders.find(o => o.id === selectedInspectionOrderId);
    if (!targetOrder) {
      showToast('Vui lòng chọn đơn cần nghiệm thu!');
      return;
    }

    const depositTotal = targetOrder.financials.depositTotal || 1000000;
    let deductionRate = 0;
    let damageType: DamageReport['type'] = 'none';

    if (inspectionCondition === 'minor') {
      deductionRate = 0.15; // 15%
      damageType = 'minor-stain';
    } else if (inspectionCondition === 'major') {
      deductionRate = 0.60; // 60%
      damageType = 'major';
    } else if (inspectionCondition === 'lost') {
      deductionRate = 1.0; // 100%
      damageType = 'major';
    }

    const deductionAmount = Math.round(depositTotal * deductionRate);
    const refundAmount = Math.max(0, depositTotal - deductionAmount);

    const report: DamageReport = {
      isDamaged: inspectionCondition !== 'pristine',
      type: damageType,
      description: inspectionNotes,
      deductionAmount,
      photoUrl: inspectionPhotoPreview || undefined,
      inspectionNote: inspectionNotes
    };

    const updatedFinancials = {
      ...targetOrder.financials,
      deductionAmount,
      depositRefund: refundAmount
    };

    const updated: RentalOrder = {
      ...targetOrder,
      status: 'hoan-coc',
      escrowStatus: 'disbursed',
      damageReport: report,
      financials: updatedFinancials,
      statusHistory: [
        ...targetOrder.statusHistory,
        {
          status: 'hoan-coc',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
          note: deductionAmount > 0
            ? `Nghiệm thu: Khấu trừ ${formatPrice(deductionAmount, currency)} phí xử lý hư hại (${Math.round(deductionRate * 100)}%). VẬN KỲ đã hoàn ${formatPrice(refundAmount, currency)} tiền cọc còn lại cho khách.`
            : `Nghiệm thu: Trang phục nguyên vẹn 100%. VẬN KỲ đã hoàn toàn bộ ${formatPrice(refundAmount, currency)} tiền cọc cho khách.`
        }
      ]
    };

    updateOrder(updated);
    refreshOrders();
    showToast(`Đã hoàn tất nghiệm thu đơn #${targetOrder.id}! Tiền cọc đã giải ngân tự động.`);
  };

  // Toggle Maintenance Lock in Tab 2
  const handleToggleLock = (costumeId: string, dateStr: string) => {
    const isLockedNow = toggleMaintenanceLock(currentStoreId, costumeId, dateStr);
    setStoreConfigState(getStoreConfig(currentStoreId));
    showToast(isLockedNow ? `Đã khóa bảo trì ngày ${dateStr}!` : `Đã mở khóa ngày ${dateStr}!`);
    setSelectedCalendarCell(null);
  };

  // Change Canon Status in Tab 6
  const handleSetCanonStatus = (status: CanonInspectionStatus) => {
    const updated = { ...storeConfig, canonStatus: status };
    saveStoreConfig(updated);
    setStoreConfigState(updated);
    showToast(status === 'da-duyet' 
      ? 'Chúc mừng! Tiệm đã đạt Huy hiệu "Đã kiểm định điển chế". Huy hiệu sẽ hiển thị trên Lookbook & Phối đồ.' 
      : 'Đã cập nhật trạng thái hồ sơ kiểm định!');
  };

  // Change Plan in Tab 6
  const handleSetPlan = (plan: StorePlan) => {
    const updated = { ...storeConfig, plan };
    saveStoreConfig(updated);
    setStoreConfigState(updated);
    showToast(plan === 'pro' 
      ? 'Đã kích hoạt Gói Pro! Bật tính năng nhắc hạn tự động qua SMS/Zalo & báo cáo chi tiết.' 
      : 'Đã chuyển về Gói Cơ bản!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
      {/* Toast Alert */}
      {alertMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-[#1F2A44] text-[#FAF6ED] border border-[#B8862B] p-3.5 sm:p-4 rounded shadow-xl text-xs flex items-center gap-3 animate-in slide-in-from-top-3 max-w-md">
          <CheckCircle2 size={18} className="text-[#D4A347] shrink-0" />
          <span className="leading-relaxed">{alertMessage}</span>
        </div>
      )}

      {/* TOP HEADER: PARTNER BOUTIQUE IDENTITY & MODE SWITCHER */}
      <div className="bg-[#FAF6ED] border-2 border-[#B8862B] p-5 sm:p-6 rounded shadow-sm relative overflow-hidden">
        <HeritageCorner position="top-right" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#D8CEBE]">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded bg-[#A4161A] text-white flex items-center justify-center shrink-0 border border-[#D4A347] shadow-sm">
              <Store size={26} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-[#1F2A44] text-[#FAF6ED] px-2 py-0.5 rounded">
                  Cổng Dành Cho Tiệm Đối Tác
                </span>
                {storeConfig.canonStatus === 'da-duyet' && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#D4A347] text-[#1A1A1A] px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs">
                    <Award size={11} />
                    <span>Đã Kiểm Định Điển Chế</span>
                  </span>
                )}
                {storeConfig.plan === 'pro' ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#2D6A4F] text-white px-2 py-0.5 rounded flex items-center gap-1">
                    <Sparkles size={11} />
                    <span>Đối Tác Pro</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-medium bg-[#E8DEC8] text-[#555] px-2 py-0.5 rounded">
                    Gói Cơ Bản
                  </span>
                )}
              </div>

              <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#1A1A1A] mt-1">
                {store.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#555] mt-1">
                <span className="flex items-center gap-1 text-[#A4161A]">
                  <MapPin size={12} />
                  <span>{store.address}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Phone size={12} />
                  <span>{store.phone}</span>
                </span>
                <span>·</span>
                <span>Đánh giá: <strong>★ {store.rating}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Store Selector & Back to Customer Mode */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="bg-white border border-[#D8CEBE] rounded p-1 flex items-center gap-1 text-xs">
              <span className="text-[10px] font-bold uppercase text-[#777] px-2">Chọn tiệm demo:</span>
              <select
                value={currentStoreId}
                onChange={(e) => onSelectStore(e.target.value)}
                className="bg-transparent text-xs font-bold text-[#A4161A] focus:outline-none cursor-pointer pr-1"
              >
                {PARTNER_STORES.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.cityName}: {s.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onSwitchToCustomer}
              className="px-3.5 py-2 bg-[#1F2A44] hover:bg-[#121A2D] text-white text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <span>Về trang Khách</span>
              <ArrowRight size={14} className="text-[#D4A347]" />
            </button>
          </div>
        </div>

        {/* 6 MAIN TABS */}
        <div className="flex items-center gap-1 pt-4 overflow-x-auto scrollbar-thin">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-3.5 text-xs font-bold rounded uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#A4161A] text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-[#555] border border-[#D8CEBE]'
            }`}
          >
            <BarChart3 size={15} />
            <span>1. Tổng Quan</span>
            {needsAction.unconfirmed.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#D4A347] text-[#1A1A1A] text-[10px] font-bold flex items-center justify-center">
                {needsAction.unconfirmed.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-2 px-3.5 text-xs font-bold rounded uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-[#A4161A] text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-[#555] border border-[#D8CEBE]'
            }`}
          >
            <Calendar size={15} />
            <span>2. Lịch Tồn Kho (14 Ngày)</span>
            {conflictingBookings.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                !
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-3.5 text-xs font-bold rounded uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#A4161A] text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-[#555] border border-[#D8CEBE]'
            }`}
          >
            <Package size={15} />
            <span>3. Đơn Hàng ({storeOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inspection')}
            className={`py-2 px-3.5 text-xs font-bold rounded uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'inspection'
                ? 'bg-[#A4161A] text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-[#555] border border-[#D8CEBE]'
            }`}
          >
            <ShieldCheck size={15} />
            <span>4. Kiểm Tra Đồ Trả</span>
            {storeOrders.filter(o => o.status === 'da-tra-do').length > 0 && (
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                {storeOrders.filter(o => o.status === 'da-tra-do').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('revenue')}
            className={`py-2 px-3.5 text-xs font-bold rounded uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'revenue'
                ? 'bg-[#A4161A] text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-[#555] border border-[#D8CEBE]'
            }`}
          >
            <DollarSign size={15} />
            <span>5. Doanh Thu & Chi Trả</span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`py-2 px-3.5 text-xs font-bold rounded uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'badges'
                ? 'bg-[#A4161A] text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-[#555] border border-[#D8CEBE]'
            }`}
          >
            <Award size={15} />
            <span>6. Huy Hiệu & Gói Tiệm</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: TỔNG QUAN (OVERVIEW)
      ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 5 KEY METRICS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {/* 1. Đơn mới */}
            <div className="bg-[#FAF6ED] p-4 rounded border border-[#D8CEBE] shadow-2xs">
              <div className="text-[11px] font-bold uppercase text-[#777] flex items-center justify-between">
                <span>Đơn mới hôm nay</span>
                <Clock size={14} className="text-[#B8862B]" />
              </div>
              <div className="text-2xl font-bold text-[#A4161A] mt-1.5">
                {metrics.newOrdersCount}
              </div>
              <p className="text-[10px] text-[#666] mt-1">Đơn chờ tiệm duyệt</p>
            </div>

            {/* 2. Doanh thu tháng */}
            <div className="bg-[#FAF6ED] p-4 rounded border border-[#D8CEBE] shadow-2xs">
              <div className="text-[11px] font-bold uppercase text-[#777] flex items-center justify-between">
                <span>Doanh thu tháng</span>
                <DollarSign size={14} className="text-[#2D6A4F]" />
              </div>
              <div className="text-2xl font-bold text-[#1A1A1A] mt-1.5">
                {formatPrice(metrics.monthlyRevenue, currency)}
              </div>
              <p className="text-[10px] text-[#2D6A4F] mt-1">Tiền thuê & dịch vụ tiệm</p>
            </div>

            {/* 3. Số bộ đang ở ngoài */}
            <div className="bg-[#FAF6ED] p-4 rounded border border-[#D8CEBE] shadow-2xs">
              <div className="text-[11px] font-bold uppercase text-[#777] flex items-center justify-between">
                <span>Đang ở ngoài</span>
                <Layers size={14} className="text-[#0068FF]" />
              </div>
              <div className="text-2xl font-bold text-[#0068FF] mt-1.5">
                {metrics.outCount} <span className="text-xs text-[#555] font-normal">bộ</span>
              </div>
              <p className="text-[10px] text-[#666] mt-1">Khách đang mặc trải nghiệm</p>
            </div>

            {/* 4. Sắp đến hạn trả */}
            <div className="bg-[#FAF6ED] p-4 rounded border border-[#D8CEBE] shadow-2xs">
              <div className="text-[11px] font-bold uppercase text-[#777] flex items-center justify-between">
                <span>Hạn trả 2 ngày tới</span>
                <AlertTriangle size={14} className="text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-amber-700 mt-1.5">
                {metrics.dueSoonCount} <span className="text-xs text-[#555] font-normal">đơn</span>
              </div>
              <p className="text-[10px] text-[#666] mt-1">Cần chuẩn bị nhận lại</p>
            </div>

            {/* 5. Tỷ lệ lấp đầy kho */}
            <div className="bg-[#FAF6ED] p-4 rounded border border-[#D8CEBE] shadow-2xs col-span-2 sm:col-span-1">
              <div className="text-[11px] font-bold uppercase text-[#777] flex items-center justify-between">
                <span>Tỷ lệ lấp đầy kho</span>
                <BarChart3 size={14} className="text-[#A4161A]" />
              </div>
              <div className="text-2xl font-bold text-[#A4161A] mt-1.5">
                {metrics.occupancyRate}%
              </div>
              <div className="w-full bg-[#E8DEC8] h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-[#A4161A] h-full" style={{ width: `${metrics.occupancyRate}%` }} />
              </div>
            </div>
          </div>

          {/* WEEKLY REVENUE CHART */}
          <div className="bg-[#FAF6ED] border border-[#D8CEBE] p-5 rounded shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E8DEC8] gap-2">
              <div>
                <h3 className="font-serif text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                  <BarChart3 size={18} className="text-[#A4161A]" />
                  <span>Biểu Đồ Doanh Thu Cho Thuê Theo Tuần (VND)</span>
                </h3>
                <p className="text-xs text-[#666] mt-0.5">
                  Thống kê doanh thu tiền thuê cổ phục thực nhận sau bảo chứng
                </p>
              </div>
              <span className="text-xs text-[#2D6A4F] font-bold bg-green-50 px-2.5 py-1 rounded border border-green-200 self-start sm:self-auto">
                Tuần hiện tại: +18% so với tuần trước
              </span>
            </div>

            {/* Visual Bar Chart */}
            <div className="pt-2">
              <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 pb-2 border-b border-[#D8CEBE]">
                {weeklyRevenueData.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-end h-full group relative">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-[#1F2A44] text-white text-[10px] px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10 shadow-md">
                      {formatPrice(item.revenue, currency)}
                    </div>

                    <div className="text-[10px] font-bold text-[#555] mb-1.5 hidden sm:block">
                      {(item.revenue / 1000000).toFixed(1)}Tr
                    </div>

                    <div
                      className={`w-full max-w-[38px] rounded-t transition-all duration-300 ${
                        item.isToday
                          ? 'bg-[#A4161A] ring-2 ring-[#A4161A]/40'
                          : 'bg-[#B8862B] hover:bg-[#8F6C22]'
                      }`}
                      style={{ height: `${item.heightPct}%` }}
                    />
                  </div>
                ))}
              </div>

              {/* Day Labels */}
              <div className="grid grid-cols-7 gap-2 sm:gap-4 text-center text-[10px] sm:text-xs text-[#555] font-semibold pt-2">
                {weeklyRevenueData.map((item, idx) => (
                  <div key={idx} className={item.isToday ? 'text-[#A4161A] font-bold' : ''}>
                    {item.day}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* KHỐI "CẦN XỬ LÝ HÔM NAY" (REQUIREMENT 1) */}
          <div className="bg-[#FAF6ED] border-2 border-[#A4161A]/30 p-5 rounded space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8CEBE]">
              <div className="flex items-center gap-2 text-[#A4161A]">
                <Bell size={18} />
                <h3 className="font-serif text-base font-bold uppercase tracking-wide">
                  Cần Xử Lý Hôm Nay ({needsAction.unconfirmed.length + needsAction.needsDelivery.length + needsAction.needsReturnOrInspection.length} tác vụ)
                </h3>
              </div>
              <span className="text-[11px] text-[#666]">
                Cập nhật tức thì với phía khách
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* CỘT 1: ĐƠN CHỜ XÁC NHẬN */}
              <div className="bg-white p-4 rounded border border-[#D8CEBE] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8DEC8]">
                  <span className="font-bold text-xs text-[#A4161A] uppercase flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>Đơn chờ xác nhận</span>
                  </span>
                  <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    {needsAction.unconfirmed.length}
                  </span>
                </div>

                {needsAction.unconfirmed.length === 0 ? (
                  <p className="text-xs text-[#888] italic py-4 text-center">Không có đơn chờ xác nhận</p>
                ) : (
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {needsAction.unconfirmed.map(o => (
                      <div key={o.id} className="p-2.5 bg-[#FAF6ED] rounded border border-[#E8DEC8] text-xs space-y-1.5">
                        <div className="flex justify-between items-start">
                          <strong className="text-[#1A1A1A]">#{o.id}</strong>
                          <span className="text-[10px] text-[#A4161A] font-bold">{formatPrice(o.financials.partnerPayout, currency)}</span>
                        </div>
                        <div className="text-[11px] text-[#444] font-medium">{o.costumeName} (Size {o.size})</div>
                        <div className="text-[10px] text-[#666]">Khách: {o.recipientName} ({o.recipientPhone})</div>
                        <div className="text-[10px] text-[#777]">Ngày thuê: {o.startDate} ~ {o.endDate}</div>
                        
                        <div className="pt-1 flex justify-end">
                          <button
                            onClick={() => handleConfirmOrder(o)}
                            className="px-3 py-1 bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-[11px] font-bold rounded cursor-pointer transition-colors shadow-2xs"
                          >
                            Xác nhận đơn
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CỘT 2: ĐỒ CẦN GIAO */}
              <div className="bg-white p-4 rounded border border-[#D8CEBE] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8DEC8]">
                  <span className="font-bold text-xs text-[#0068FF] uppercase flex items-center gap-1.5">
                    <Package size={14} />
                    <span>Đồ cần giao / Sẵn sàng</span>
                  </span>
                  <span className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    {needsAction.needsDelivery.length}
                  </span>
                </div>

                {needsAction.needsDelivery.length === 0 ? (
                  <p className="text-xs text-[#888] italic py-4 text-center">Không có đơn cần giao gấp</p>
                ) : (
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {needsAction.needsDelivery.map(o => (
                      <div key={o.id} className="p-2.5 bg-[#FAF6ED] rounded border border-[#E8DEC8] text-xs space-y-1.5">
                        <div className="flex justify-between items-start">
                          <strong className="text-[#1A1A1A]">#{o.id}</strong>
                          <span className="text-[10px] text-[#0068FF] font-semibold">
                            {o.deliveryMethod === 'hotel' ? 'Gửi khách sạn' : o.deliveryMethod === 'shipping' ? 'Giao tận nơi' : 'Nhận tại tiệm'}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#444] font-medium">{o.costumeName} (Size {o.size})</div>
                        <div className="text-[10px] text-[#666]">
                          Khách: {o.recipientName} {o.hotelName ? `(${o.hotelName})` : ''}
                        </div>
                        
                        <div className="pt-1 flex justify-end gap-1.5">
                          {o.status === 'da-dat' ? (
                            <button
                              onClick={() => handleMarkShipped(o)}
                              className="px-3 py-1 bg-[#0068FF] hover:bg-[#0052CC] text-white text-[11px] font-bold rounded cursor-pointer transition-colors shadow-2xs"
                            >
                              Đã giao / Sẵn sàng
                            </button>
                          ) : (
                            <button
                              onClick={() => handleMarkInUse(o)}
                              className="px-3 py-1 bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-[11px] font-bold rounded cursor-pointer transition-colors shadow-2xs"
                            >
                              Khách đã nhận đồ
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CỘT 3: ĐỒ CẦN THU HỒI / KIỂM TRA */}
              <div className="bg-white p-4 rounded border border-[#D8CEBE] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8DEC8]">
                  <span className="font-bold text-xs text-purple-700 uppercase flex items-center gap-1.5">
                    <ShieldCheck size={14} />
                    <span>Thu hồi / Kiểm tra cọc</span>
                  </span>
                  <span className="text-[11px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                    {needsAction.needsReturnOrInspection.length}
                  </span>
                </div>

                {needsAction.needsReturnOrInspection.length === 0 ? (
                  <p className="text-xs text-[#888] italic py-4 text-center">Không có đơn cần thu hồi hôm nay</p>
                ) : (
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {needsAction.needsReturnOrInspection.map(o => (
                      <div key={o.id} className="p-2.5 bg-[#FAF6ED] rounded border border-[#E8DEC8] text-xs space-y-1.5">
                        <div className="flex justify-between items-start">
                          <strong className="text-[#1A1A1A]">#{o.id}</strong>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                            o.status === 'da-tra-do' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {o.status === 'da-tra-do' ? 'Đã trả đồ' : 'Đến hạn trả'}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#444] font-medium">{o.costumeName} (Size {o.size})</div>
                        <div className="text-[10px] text-[#666]">Khách: {o.recipientName} ({o.recipientPhone})</div>
                        <div className="text-[10px] text-[#2D6A4F] font-semibold">Cọc: {formatPrice(o.financials.depositTotal, currency)}</div>

                        <div className="pt-1 flex justify-end gap-1.5">
                          {o.status === 'dang-su-dung' ? (
                            <button
                              onClick={() => handleMarkReceivedBack(o)}
                              className="px-3 py-1 bg-[#1F2A44] hover:bg-[#121A2D] text-white text-[11px] font-bold rounded cursor-pointer transition-colors shadow-2xs"
                            >
                              Đã nhận lại đồ
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedInspectionOrderId(o.id);
                                setActiveTab('inspection');
                              }}
                              className="px-3 py-1 bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-bold rounded cursor-pointer transition-colors shadow-2xs"
                            >
                              Kiểm tra & Hoàn cọc →
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: LỊCH TỒN KHO (INVENTORY CALENDAR - 14 NGÀY)
      ========================================================================= */}
      {activeTab === 'calendar' && (
        <div className="space-y-5">
          {/* Calendar Header & Conflict Warnings */}
          <div className="bg-[#FAF6ED] border border-[#D8CEBE] p-4 sm:p-5 rounded space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E8DEC8] gap-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
                  <Calendar size={18} className="text-[#A4161A]" />
                  <span>Lưới Lịch Tồn Kho & Điều Phối (14 Ngày Tới)</span>
                </h3>
                <p className="text-xs text-[#555] mt-0.5">
                  Bấm vào từng ô để xem chi tiết đơn hoặc khóa bảo trì bộ đồ.
                </p>
              </div>

              {/* Status Color Legend */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded border border-green-200 text-green-800 text-[11px] font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span>Trống</span>
                </span>
                <span className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded border border-amber-200 text-amber-800 text-[11px] font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Đã đặt</span>
                </span>
                <span className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded border border-blue-200 text-blue-800 text-[11px] font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span>Đang cho thuê</span>
                </span>
                <span className="flex items-center gap-1.5 bg-purple-50 px-2 py-1 rounded border border-purple-200 text-purple-800 text-[11px] font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                  <span>Giặt / Kiểm tra</span>
                </span>
                <span className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded border border-gray-300 text-gray-700 text-[11px] font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-500" />
                  <span>Bảo trì</span>
                </span>
              </div>
            </div>

            {/* DATE CONFLICT ALERT (REQUIREMENT 2) */}
            {conflictingBookings.length > 0 && (
              <div className="p-3 bg-red-50 border-l-4 border-red-600 rounded text-xs text-red-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle size={15} className="text-red-600 shrink-0" />
                  <span>Cảnh Báo Trùng Lịch Thuê ({conflictingBookings.length} ngày phát hiện xung đột):</span>
                </div>
                {conflictingBookings.map((c, idx) => (
                  <div key={idx} className="text-[11px] pl-5 leading-relaxed">
                    • <strong>{c.costumeName}</strong> vào ngày <strong>{c.date}</strong> có {c.orders.length} đơn cùng chọn ({c.orders.map(o => `#${o.id}`).join(', ')}). Tiệm vui lòng liên hệ điều phối size hoặc chuyển đồ hỗ trợ.
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 14-DAY GRID TABLE */}
          <div className="overflow-x-auto border border-[#D8CEBE] rounded bg-white shadow-xs">
            <table className="w-full text-xs text-left border-collapse min-w-[900px]">
              <thead className="bg-[#F6EFE3] text-[#444] border-b border-[#D8CEBE]">
                <tr>
                  <th className="p-3 sticky left-0 bg-[#F6EFE3] z-10 w-48 border-r border-[#D8CEBE] font-bold text-xs uppercase">
                    Mẫu Cổ Phục ({boutiqueCostumes.length} bộ)
                  </th>
                  {calendarDates.map((col, idx) => (
                    <th 
                      key={idx} 
                      className={`p-2 text-center border-r border-[#EAE0D0] text-[11px] font-bold ${
                        col.isToday ? 'bg-[#A4161A] text-white' : col.isWeekend ? 'bg-[#EFE7D8]' : ''
                      }`}
                    >
                      <div>{col.label}</div>
                      {col.isToday && <span className="text-[9px] font-normal uppercase opacity-90">Hôm nay</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE0D0]">
                {boutiqueCostumes.map((costume) => {
                  return (
                    <tr key={costume.id} className="hover:bg-amber-50/30 transition-colors">
                      {/* Costume Name & stock */}
                      <td className="p-3 sticky left-0 bg-white z-10 border-r border-[#D8CEBE] font-semibold text-[#1A1A1A]">
                        <div className="line-clamp-1">{costume.name}</div>
                        <div className="text-[10px] text-[#777] font-normal">
                          Kho: S({store.stockByCostume[costume.id]?.S || 0}) M({store.stockByCostume[costume.id]?.M || 0}) L({store.stockByCostume[costume.id]?.L || 0}) XL({store.stockByCostume[costume.id]?.XL || 0})
                        </div>
                      </td>

                      {/* 14 Day Cells */}
                      {calendarDates.map((col, idx) => {
                        const targetMs = new Date(col.dateStr).getTime();
                        
                        // Check if manually locked for maintenance
                        const isLocked = isCostumeDateLocked(currentStoreId, costume.id, col.dateStr);

                        // Find order occupying this costume on this date
                        const matchedOrder = storeOrders.find(o => {
                          if (o.costumeId !== costume.id || o.status === 'hoan-coc') return false;
                          const s = new Date(o.startDate).getTime();
                          const e = new Date(o.endDate).getTime();
                          return targetMs >= s && targetMs <= e;
                        });

                        let cellClass = 'bg-green-50/70 border-green-200 text-green-700 hover:bg-green-100';
                        let cellContent = 'Trống';
                        let cellIcon = null;

                        if (isLocked) {
                          cellClass = 'bg-gray-100 border-gray-300 text-gray-700';
                          cellContent = 'Bảo trì';
                          cellIcon = <Lock size={10} className="inline mr-0.5" />;
                        } else if (matchedOrder) {
                          if (matchedOrder.status === 'da-dat') {
                            cellClass = 'bg-amber-100 border-amber-300 text-amber-900 font-bold';
                            cellContent = 'Đã đặt';
                          } else if (matchedOrder.status === 'dang-giao' || matchedOrder.status === 'dang-su-dung') {
                            cellClass = 'bg-blue-100 border-blue-300 text-blue-900 font-bold';
                            cellContent = 'Đang thuê';
                          } else if (matchedOrder.status === 'da-tra-do') {
                            cellClass = 'bg-purple-100 border-purple-300 text-purple-900 font-bold';
                            cellContent = 'Giặt/Kiểm';
                          }
                        }

                        return (
                          <td
                            key={idx}
                            onClick={() => setSelectedCalendarCell({
                              costume,
                              date: col.dateStr,
                              order: matchedOrder,
                              isLocked
                            })}
                            className={`p-1.5 text-center border-r border-[#EAE0D0] cursor-pointer transition-all text-[10px] ${cellClass}`}
                            title={`Bấm để xem/quản lý: ${costume.name} ngày ${col.dateStr}`}
                          >
                            <div className="py-1 px-0.5 rounded truncate">
                              {cellIcon}
                              <span>{cellContent}</span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* CALENDAR CELL DETAIL MODAL / POPOVER */}
          {selectedCalendarCell && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
              <div className="relative w-full max-w-md bg-[#FAF6ED] border-2 border-[#B8862B] shadow-2xl rounded p-5 sm:p-6 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-[#D8CEBE] mb-3">
                  <div>
                    <h4 className="font-serif text-base font-bold text-[#1A1A1A]">
                      {selectedCalendarCell.costume.name}
                    </h4>
                    <span className="text-xs text-[#777]">Ngày: {selectedCalendarCell.date}</span>
                  </div>
                  <button
                    onClick={() => setSelectedCalendarCell(null)}
                    className="p-1 text-[#666] hover:text-[#1A1A1A] cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {selectedCalendarCell.order ? (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-white rounded border border-[#D8CEBE] space-y-1.5">
                      <div className="font-bold text-[#A4161A] text-sm flex justify-between">
                        <span>Đơn #{selectedCalendarCell.order.id}</span>
                        <span>{STATUS_LABELS[selectedCalendarCell.order.status]?.label}</span>
                      </div>
                      <div>Khách: <strong>{selectedCalendarCell.order.recipientName}</strong> ({selectedCalendarCell.order.recipientPhone})</div>
                      <div>Kích cỡ: <strong>Size {selectedCalendarCell.order.size}</strong></div>
                      <div>Thời gian: {selectedCalendarCell.order.startDate} ~ {selectedCalendarCell.order.endDate} ({selectedCalendarCell.order.totalDays} ngày)</div>
                      <div>Doanh thu tiệm: <strong>{formatPrice(selectedCalendarCell.order.financials.partnerPayout, currency)}</strong></div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => {
                          setSelectedCalendarCell(null);
                          setActiveTab('orders');
                        }}
                        className="px-3.5 py-1.5 bg-[#A4161A] text-white rounded font-bold cursor-pointer"
                      >
                        Mở xem chi tiết đơn
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs">
                    <p className="text-[#555] leading-relaxed">
                      Ngày <strong>{selectedCalendarCell.date}</strong> hiện đang {selectedCalendarCell.isLocked ? 'bị KHÓA BẢO TRÌ thủ công' : 'TRỐNG và sẵn sàng nhận khách đặt'}.
                    </p>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        onClick={() => handleToggleLock(selectedCalendarCell.costume.id, selectedCalendarCell.date)}
                        className={`px-4 py-2 rounded font-bold flex items-center gap-1.5 cursor-pointer text-white ${
                          selectedCalendarCell.isLocked ? 'bg-[#2D6A4F] hover:bg-[#1B4332]' : 'bg-[#1F2A44] hover:bg-[#121A2D]'
                        }`}
                      >
                        {selectedCalendarCell.isLocked ? <Unlock size={14} /> : <Lock size={14} />}
                        <span>{selectedCalendarCell.isLocked ? 'Mở khóa nhận đơn' : 'Khóa bộ thủ công (Bảo trì)'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: ĐƠN HÀNG (ORDERS LIST & STATUS UPDATE)
      ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-5">
          {/* Filter Bar & Search */}
          <div className="bg-[#FAF6ED] border border-[#D8CEBE] p-4 rounded flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs w-full md:w-auto">
              {[
                { id: 'all', label: `Tất cả (${storeOrders.length})` },
                { id: 'da-dat', label: `Chờ duyệt / Đã đặt (${storeOrders.filter(o => o.status === 'da-dat').length})` },
                { id: 'dang-giao', label: `Đang giao (${storeOrders.filter(o => o.status === 'dang-giao').length})` },
                { id: 'dang-su-dung', label: `Đang thuê (${storeOrders.filter(o => o.status === 'dang-su-dung').length})` },
                { id: 'da-tra-do', label: `Đã trả đồ (${storeOrders.filter(o => o.status === 'da-tra-do').length})` },
                { id: 'hoan-coc', label: `Hoàn tất (${storeOrders.filter(o => o.status === 'hoan-coc').length})` }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setOrderStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded transition-all cursor-pointer font-semibold ${
                    orderStatusFilter === f.id
                      ? 'bg-[#A4161A] text-white shadow-2xs'
                      : 'bg-white hover:bg-[#E8DEC8] text-[#555] border border-[#D8CEBE]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
              <input
                type="text"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder="Tìm mã đơn, tên khách, SĐT..."
                className="w-full bg-white border border-[#D8CEBE] pl-8 pr-3 py-1.5 rounded text-xs focus:outline-none focus:border-[#A4161A]"
              />
            </div>
          </div>

          {/* Orders Listing */}
          <div className="space-y-4">
            {storeOrders
              .filter(o => {
                if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
                if (orderSearchQuery.trim()) {
                  const q = orderSearchQuery.toLowerCase();
                  return (
                    o.id.toLowerCase().includes(q) ||
                    o.recipientName.toLowerCase().includes(q) ||
                    o.recipientPhone.includes(q) ||
                    o.costumeName.toLowerCase().includes(q)
                  );
                }
                return true;
              })
              .map(order => {
                const statusMeta = STATUS_LABELS[order.status] || { label: order.status, color: '#666' };

                return (
                  <div key={order.id} className="bg-white border border-[#D8CEBE] p-5 rounded-lg space-y-4 shadow-xs hover:border-[#B8862B] transition-colors">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#EAE0D0] gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="font-serif text-base text-[#1A1A1A]">#{order.id}</strong>
                        <span
                          className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded"
                          style={{
                            backgroundColor: `${statusMeta.color}15`,
                            color: statusMeta.color
                          }}
                        >
                          {statusMeta.label}
                        </span>

                        {!order.isConfirmedByStore && order.status === 'da-dat' && (
                          <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded animate-pulse">
                            Cần xác nhận
                          </span>
                        )}

                        {order.isGroupOrder && (
                          <span className="text-[10px] font-bold bg-[#1F2A44] text-[#FAF6ED] px-2 py-0.5 rounded flex items-center gap-1">
                            <Users size={11} />
                            <span>Đơn nhóm ({order.groupOrderSummary?.totalMembers} người)</span>
                          </span>
                        )}

                        {order.experiencePackage && (order.experiencePackage.hasPhotography || order.experiencePackage.hasMakeup) && (
                          <span className="text-[10px] font-bold bg-[#A4161A] text-white px-2 py-0.5 rounded flex items-center gap-1">
                            <Camera size={11} />
                            <span>Gói trải nghiệm</span>
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-[#777]">
                        Khởi tạo: {new Date(order.createdAt).toLocaleDateString('vi-VN')} · Nhận đồ: <strong>{order.deliveryMethod === 'hotel' ? 'Khách sạn' : order.deliveryMethod === 'shipping' ? 'Giao hàng' : 'Tại tiệm'}</strong>
                      </div>
                    </div>

                    {/* Order Main Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Customer Info */}
                      <div className="space-y-1">
                        <div className="text-[#888] uppercase text-[10px] font-bold">Khách hàng:</div>
                        <div className="font-bold text-[#1A1A1A]">{order.recipientName}</div>
                        <div className="text-[#555]">{order.recipientPhone}</div>
                        {order.hotelName && (
                          <div className="text-[#A4161A] font-medium">{order.hotelName} ({order.hotelRoom || 'Lễ tân'})</div>
                        )}
                        {order.recipientAddress && (
                          <div className="text-[#666] line-clamp-2">{order.recipientAddress}</div>
                        )}
                      </div>

                      {/* Costume & Period */}
                      <div className="space-y-1">
                        <div className="text-[#888] uppercase text-[10px] font-bold">Trang phục & Size:</div>
                        <div className="font-bold text-[#1A1A1A]">{order.costumeName}</div>
                        <div className="text-[#555]">
                          Size: <strong className="text-[#A4161A]">{order.size}</strong> {order.colorName ? `· Màu: ${order.colorName}` : ''}
                        </div>
                        <div className="text-[#777]">
                          Lịch thuê: <strong>{order.startDate} ~ {order.endDate}</strong> ({order.totalDays} ngày)
                        </div>
                      </div>

                      {/* Financials for Store */}
                      <div className="space-y-1 bg-[#FAF6ED] p-3 rounded border border-[#E8DEC8]">
                        <div className="text-[#888] uppercase text-[10px] font-bold">Tài chính tiệm:</div>
                        <div className="flex justify-between items-center text-[#1A1A1A]">
                          <span>Tiền thuê tiệm nhận:</span>
                          <strong className="text-[#2D6A4F] text-sm">{formatPrice(order.financials.partnerPayout, currency)}</strong>
                        </div>
                        <div className="flex justify-between items-center text-[#777] text-[11px]">
                          <span>Cọc Escrow giữ:</span>
                          <span>{formatPrice(order.financials.depositTotal, currency)}</span>
                        </div>
                      </div>
                    </div>

                    {/* SPECIAL SECTION: GÓI TRẢI NGHIỆM (REQUIREMENT 3) */}
                    {order.experiencePackage && (order.experiencePackage.hasPhotography || order.experiencePackage.hasMakeup) && (
                      <div className="p-3 bg-[#FFFBEB] border border-[#E8DEC8] rounded text-xs space-y-1.5">
                        <div className="font-bold text-[#8F6C22] flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Camera size={14} className="text-[#A4161A]" />
                            <span>Lịch Trình Chụp Ảnh & Makeup Đối Tác</span>
                          </span>
                          <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">
                            ✓ {order.experiencePackage.photoScheduleStatus === 'da-xac-nhan' ? 'Đã xác nhận lịch chụp' : 'Chờ xác nhận'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#555] text-[11px]">
                          <div>• Chụp ảnh: <strong>{order.experiencePackage.photographerName}</strong> tại {order.experiencePackage.heritageSpot || 'Di tích Huế'}</div>
                          <div>• Thời gian hẹn: <strong>{order.experiencePackage.scheduledTime || '08:30 sáng'}</strong> ({order.experiencePackage.makeupArtistName || 'Makeup chuyên gia'})</div>
                        </div>
                      </div>
                    )}

                    {/* SPECIAL SECTION: ĐƠN NHÓM (REQUIREMENT 3) */}
                    {order.isGroupOrder && order.groupOrderSummary && (
                      <div className="p-3.5 bg-[#FAF6ED] border border-[#B8862B] rounded text-xs space-y-3">
                        <div className="flex items-center justify-between font-bold text-[#1A1A1A]">
                          <span className="flex items-center gap-1.5 text-[#1F2A44]">
                            <Users size={15} />
                            <span>Chi Tiết Đơn Nhóm: {order.groupOrderSummary.groupName}</span>
                          </span>
                          <span className="text-[11px] text-[#A4161A]">
                            Đã thu {order.groupOrderSummary.paidMembersCount}/{order.groupOrderSummary.totalMembers} người
                          </span>
                        </div>

                        {/* Tổng số bộ theo size */}
                        <div className="grid grid-cols-4 gap-2 text-center text-xs">
                          <div className="bg-white p-2 rounded border border-[#D8CEBE]">
                            <span className="text-[#777] text-[10px] font-semibold">Size S</span>
                            <div className="font-bold text-[#A4161A]">{order.groupOrderSummary.sizeCounts.S || 0} bộ</div>
                          </div>
                          <div className="bg-white p-2 rounded border border-[#D8CEBE]">
                            <span className="text-[#777] text-[10px] font-semibold">Size M</span>
                            <div className="font-bold text-[#A4161A]">{order.groupOrderSummary.sizeCounts.M || 0} bộ</div>
                          </div>
                          <div className="bg-white p-2 rounded border border-[#D8CEBE]">
                            <span className="text-[#777] text-[10px] font-semibold">Size L</span>
                            <div className="font-bold text-[#A4161A]">{order.groupOrderSummary.sizeCounts.L || 0} bộ</div>
                          </div>
                          <div className="bg-white p-2 rounded border border-[#D8CEBE]">
                            <span className="text-[#777] text-[10px] font-semibold">Size XL</span>
                            <div className="font-bold text-[#A4161A]">{order.groupOrderSummary.sizeCounts.XL || 0} bộ</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ORDER ACTION BUTTONS (REQUIREMENT 3) */}
                    <div className="pt-3 border-t border-[#EAE0D0] flex flex-wrap items-center justify-between gap-2">
                      <div className="text-[11px] text-[#888]">
                        Tiến trình hiện tại: <strong className="text-[#1A1A1A]">{statusMeta.label}</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        {order.status === 'da-dat' && !order.isConfirmedByStore && (
                          <button
                            onClick={() => handleConfirmOrder(order)}
                            className="px-4 py-2 bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-bold rounded cursor-pointer transition-colors shadow-xs"
                          >
                            ✓ Xác nhận đơn
                          </button>
                        )}

                        {(order.status === 'da-dat' || order.status === 'dang-giao') && (
                          <button
                            onClick={() => handleMarkShipped(order)}
                            className="px-4 py-2 bg-[#0068FF] hover:bg-[#0052CC] text-white text-xs font-bold rounded cursor-pointer transition-colors shadow-xs"
                          >
                            Đã giao / Sẵn sàng nhận
                          </button>
                        )}

                        {order.status === 'dang-su-dung' && (
                          <button
                            onClick={() => handleMarkReceivedBack(order)}
                            className="px-4 py-2 bg-[#1F2A44] hover:bg-[#121A2D] text-white text-xs font-bold rounded cursor-pointer transition-colors shadow-xs"
                          >
                            Đã nhận lại đồ
                          </button>
                        )}

                        {order.status === 'da-tra-do' && (
                          <button
                            onClick={() => {
                              setSelectedInspectionOrderId(order.id);
                              setActiveTab('inspection');
                            }}
                            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded cursor-pointer transition-colors shadow-xs"
                          >
                            Kiểm tra đồ trả & Hoàn cọc →
                          </button>
                        )}

                        {order.status === 'hoan-coc' && (
                          <span className="text-xs text-green-700 font-bold bg-green-50 px-3 py-1.5 rounded border border-green-200">
                            ✓ Giao dịch hoàn tất & đã giải ngân
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: KIỂM TRA ĐỒ TRẢ (RETURN INSPECTION & DEPOSIT DEDUCTION)
      ========================================================================= */}
      {activeTab === 'inspection' && (
        <div className="bg-[#FAF6ED] border-2 border-[#B8862B] p-6 rounded space-y-6 shadow-sm">
          <div className="pb-3 border-b border-[#D8CEBE]">
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
              <ShieldCheck size={22} className="text-[#A4161A]" />
              <span>Biên Bản Nghiệm Thu Trang Phục & Quyết Định Khấu Trừ Cọc</span>
            </h3>
            <p className="text-xs text-[#555] mt-1 leading-relaxed">
              Tiệm đánh giá hiện trạng vải gấm, chỉ thêu, khuy ngọc và phụ kiện đi kèm. Xác nhận xong, hệ thống VẬN KỲ Escrow sẽ tự động hoàn cọc đúng số tiền về ví/thẻ của khách.
            </p>
          </div>

          {/* Select Order */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-[#1A1A1A] block mb-1">
                Chọn đơn hàng cần nghiệm thu hiện trạng: *
              </label>
              <select
                value={selectedInspectionOrderId}
                onChange={(e) => {
                  setSelectedInspectionOrderId(e.target.value);
                  const o = storeOrders.find(ord => ord.id === e.target.value);
                  if (o && o.status === 'hoan-coc' && o.damageReport) {
                    setInspectionCondition(o.damageReport.type === 'minor-stain' ? 'minor' : o.damageReport.type === 'major' ? 'major' : 'pristine');
                    setInspectionNotes(o.damageReport.description || '');
                  }
                }}
                className="w-full bg-white border border-[#D8CEBE] p-2.5 rounded text-xs text-[#1A1A1A] font-semibold focus:outline-none focus:border-[#A4161A] cursor-pointer"
              >
                <option value="">-- Chọn đơn cần nghiệm thu --</option>
                {storeOrders.map(o => (
                  <option key={o.id} value={o.id}>
                    #{o.id} - {o.costumeName} ({o.recipientName}) - [{STATUS_LABELS[o.status]?.label}]
                  </option>
                ))}
              </select>
            </div>

            {selectedInspectionOrderId && (
              <div className="bg-white p-3 rounded border border-[#D8CEBE] text-xs space-y-1">
                <div className="font-bold text-[#A4161A]">
                  Thông tin đơn #{selectedInspectionOrderId}
                </div>
                {(() => {
                  const target = storeOrders.find(o => o.id === selectedInspectionOrderId);
                  if (!target) return null;
                  return (
                    <>
                      <div>Khách hàng: <strong>{target.recipientName}</strong> ({target.recipientPhone})</div>
                      <div>Trang phục: <strong>{target.costumeName}</strong> (Size {target.size})</div>
                      <div>Tiền cọc gốc đang giữ trong Escrow: <strong className="text-[#2D6A4F]">{formatPrice(target.financials.depositTotal, currency)}</strong></div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          {/* 4 Condition Options */}
          <div className="space-y-3">
            <label className="font-bold text-xs text-[#1A1A1A] block">
              1. Đánh giá mức độ hiện trạng vải & phụ kiện: *
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Option 1: Nguyên vẹn */}
              <label 
                className={`p-3.5 rounded border-2 cursor-pointer flex flex-col justify-between transition-all ${
                  inspectionCondition === 'pristine'
                    ? 'bg-green-50/80 border-green-600 text-green-900 shadow-xs'
                    : 'bg-white border-[#D8CEBE] hover:border-gray-400'
                }`}
                onClick={() => {
                  setInspectionCondition('pristine');
                  setInspectionNotes('Trang phục và phụ kiện hoàn hảo, sạch sẽ, không sút chỉ.');
                }}
              >
                <div>
                  <div className="font-bold text-sm flex items-center justify-between">
                    <span>Nguyên vẹn</span>
                    <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">Trừ 0%</span>
                  </div>
                  <p className="text-[11px] text-[#555] mt-1.5 leading-relaxed">
                    Vải lụa sạch sẽ, hoa văn sắc nét, phụ kiện và khuy cài đủ 100%.
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-green-700 mt-2">
                  ✓ Hoàn 100% cọc cho khách
                </div>
              </label>

              {/* Option 2: Hư hỏng nhẹ */}
              <label 
                className={`p-3.5 rounded border-2 cursor-pointer flex flex-col justify-between transition-all ${
                  inspectionCondition === 'minor'
                    ? 'bg-amber-50/80 border-amber-600 text-amber-900 shadow-xs'
                    : 'bg-white border-[#D8CEBE] hover:border-gray-400'
                }`}
                onClick={() => {
                  setInspectionCondition('minor');
                  setInspectionNotes('Vết bẩn bùn đất nhẹ ở gấu tà và sút một mũi chỉ cổ tay áo, có thể giặt hấp phục hồi.');
                }}
              >
                <div>
                  <div className="font-bold text-sm flex items-center justify-between">
                    <span>Hư hỏng nhẹ</span>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Trừ 15%</span>
                  </div>
                  <p className="text-[11px] text-[#555] mt-1.5 leading-relaxed">
                    Vết bẩn giặt được, sút chỉ nhỏ, mất móc gài có thể phục hồi dễ dàng.
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-amber-700 mt-2">
                  Hoàn 85% cọc còn lại
                </div>
              </label>

              {/* Option 3: Hư hỏng nặng */}
              <label 
                className={`p-3.5 rounded border-2 cursor-pointer flex flex-col justify-between transition-all ${
                  inspectionCondition === 'major'
                    ? 'bg-orange-50/80 border-orange-600 text-orange-900 shadow-xs'
                    : 'bg-white border-[#D8CEBE] hover:border-gray-400'
                }`}
                onClick={() => {
                  setInspectionCondition('major');
                  setInspectionNotes('Rách một đường 10cm ở tà sau và ố mực loang không thể tự xử lý, cần thợ may phục dựng.');
                }}
              >
                <div>
                  <div className="font-bold text-sm flex items-center justify-between">
                    <span>Hư hỏng nặng</span>
                    <span className="text-[11px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded">Trừ 60%</span>
                  </div>
                  <p className="text-[11px] text-[#555] mt-1.5 leading-relaxed">
                    Rách tà, cháy xém tàn thuốc, ố màu loang, gãy trâm ngọc cung đình.
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-orange-700 mt-2">
                  Hoàn 40% cọc còn lại
                </div>
              </label>

              {/* Option 4: Mất đồ */}
              <label 
                className={`p-3.5 rounded border-2 cursor-pointer flex flex-col justify-between transition-all ${
                  inspectionCondition === 'lost'
                    ? 'bg-red-50/80 border-red-600 text-red-900 shadow-xs'
                    : 'bg-white border-[#D8CEBE] hover:border-gray-400'
                }`}
                onClick={() => {
                  setInspectionCondition('lost');
                  setInspectionNotes('Khách làm thất lạc toàn bộ bộ trang phục hoặc hư hại biến dạng hoàn toàn.');
                }}
              >
                <div>
                  <div className="font-bold text-sm flex items-center justify-between">
                    <span>Mất đồ / Hỏng hẳn</span>
                    <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">Trừ 100%</span>
                  </div>
                  <p className="text-[11px] text-[#555] mt-1.5 leading-relaxed">
                    Mất trọn bộ trang phục, không thể thu hồi hoặc không thể khắc phục.
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-red-700 mt-2">
                  Không hoàn cọc
                </div>
              </label>
            </div>
          </div>

          {/* DEDUCTION CALCULATION TABLE (REQUIREMENT 4) */}
          {(() => {
            const target = storeOrders.find(o => o.id === selectedInspectionOrderId);
            const depTotal = target?.financials.depositTotal || 1500000;
            const rate = inspectionCondition === 'pristine' ? 0 : inspectionCondition === 'minor' ? 0.15 : inspectionCondition === 'major' ? 0.60 : 1.0;
            const deduct = Math.round(depTotal * rate);
            const refund = Math.max(0, depTotal - deduct);

            return (
              <div className="bg-white p-4 rounded border border-[#D8CEBE] space-y-2 text-xs">
                <div className="font-bold text-[#1A1A1A] pb-2 border-b border-[#E8DEC8] flex justify-between items-center">
                  <span>Bảng phân bổ tài chính cọc sau nghiệm thu:</span>
                  <span className="text-[11px] font-normal text-[#666]">Tỷ lệ trừ cọc: <strong>{Math.round(rate * 100)}%</strong></span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-2.5 bg-[#FAF6ED] rounded border border-[#E8DEC8]">
                    <span className="text-[#666] text-[11px]">Tiền cọc gốc ban đầu:</span>
                    <div className="text-base font-bold text-[#1A1A1A] mt-0.5">{formatPrice(depTotal, currency)}</div>
                  </div>
                  <div className="p-2.5 bg-red-50 rounded border border-red-200">
                    <span className="text-red-700 text-[11px]">Tiền khấu trừ chuyển tiệm:</span>
                    <div className="text-base font-bold text-red-700 mt-0.5">+{formatPrice(deduct, currency)}</div>
                  </div>
                  <div className="p-2.5 bg-green-50 rounded border border-green-200">
                    <span className="text-green-700 text-[11px]">Tiền cọc hoàn trả khách:</span>
                    <div className="text-base font-bold text-green-700 mt-0.5">{formatPrice(refund, currency)}</div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Photo Upload & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Upload Area */}
            <div className="space-y-2">
              <label className="font-bold text-[#1A1A1A] block">
                2. Hình ảnh hiện vật kiểm tra (nếu có vết bẩn/hư hại):
              </label>

              <div className="p-4 bg-white border border-dashed border-[#D8CEBE] rounded flex flex-col items-center justify-center text-center space-y-2">
                {inspectionPhotoPreview ? (
                  <div className="space-y-2 w-full">
                    <img 
                      src={inspectionPhotoPreview} 
                      alt="Hiện trạng kiểm tra" 
                      className="w-full h-36 object-cover rounded border border-[#D8CEBE]" 
                    />
                    <button
                      type="button"
                      onClick={() => setInspectionPhotoPreview(null)}
                      className="text-[11px] text-red-600 hover:underline"
                    >
                      Gỡ ảnh
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={22} className="text-[#A4161A]" />
                    <span className="text-xs text-[#555]">Tải ảnh chụp hiện vật thực tế của khách trả</span>
                    <label className="px-3 py-1.5 bg-[#FAF6ED] hover:bg-[#E8DEC8] border border-[#B8862B] text-[#A4161A] font-semibold rounded cursor-pointer text-xs">
                      <span>Chọn file ảnh</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setInspectionPhotoPreview(ev.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </>
                )}
              </div>

              {/* Preset demo tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-[#777]">Chọn mẫu nhanh:</span>
                <button
                  type="button"
                  onClick={() => {
                    setInspectionCondition('pristine');
                    setInspectionPhotoPreview('/images/nhat-binh.jpg');
                    setInspectionNotes('Trang phục nguyên vẹn, thơm tho sạch sẽ.');
                  }}
                  className="px-2 py-0.5 rounded border border-[#D8CEBE] bg-white text-[10px] hover:bg-gray-50 cursor-pointer"
                >
                  ✓ Ảnh nguyên vẹn
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInspectionCondition('minor');
                    setInspectionPhotoPreview('/images/ao-tac.jpg');
                    setInspectionNotes('Vết bẩn nhẹ ở viền gấu áo.');
                  }}
                  className="px-2 py-0.5 rounded border border-[#D8CEBE] bg-white text-[10px] hover:bg-gray-50 cursor-pointer"
                >
                  ⚠ Ảnh vết ố nhẹ
                </button>
              </div>
            </div>

            {/* Inspection Note Input */}
            <div className="space-y-2">
              <label className="font-bold text-[#1A1A1A] block">
                3. Ghi chú nghiệm thu của tiệm (Hiển thị tới khách):
              </label>
              <textarea
                rows={5}
                value={inspectionNotes}
                onChange={(e) => setInspectionNotes(e.target.value)}
                className="w-full bg-white border border-[#D8CEBE] p-3 rounded text-xs text-[#1A1A1A] focus:outline-none focus:border-[#A4161A]"
                placeholder="Nhập chi tiết nhận xét của tiệm về tình trạng đồ trả..."
              />
            </div>
          </div>

          {/* Confirm Button */}
          <div className="pt-3 border-t border-[#D8CEBE] flex justify-end gap-3">
            <button
              onClick={handleCompleteInspection}
              disabled={!selectedInspectionOrderId}
              className="px-6 py-3 bg-[#A4161A] hover:bg-[#850D11] text-white text-xs font-bold uppercase tracking-wider rounded cursor-pointer shadow-md transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <CheckCircle2 size={16} />
              <span>Xác Nhận Nghiệm Thu & Kích Hoạt Hoàn Cọc Tự Động</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: DOANH THU VÀ CHI TRẢ (REVENUE & PAYOUTS)
      ========================================================================= */}
      {activeTab === 'revenue' && (
        <div className="space-y-5">
          {/* Summary Financial Cards (REQUIREMENT 5) */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
            {/* 1. Tổng doanh thu */}
            <div className="bg-[#FAF6ED] p-4 rounded border border-[#D8CEBE] shadow-2xs">
              <div className="text-[11px] font-bold uppercase text-[#777]">
                Tổng tiền thuê (Gross)
              </div>
              <div className="text-xl font-bold text-[#1A1A1A] mt-1.5">
                {formatPrice(
                  storeOrders.reduce((sum, o) => sum + (o.financials.rentalTotal || 0), 0),
                  currency
                )}
              </div>
              <p className="text-[10px] text-[#666] mt-1">Từ tất cả {storeOrders.length} đơn</p>
            </div>

            {/* 2. Hoa hồng nền tảng */}
            <div className="bg-[#FAF6ED] p-4 rounded border border-[#D8CEBE] shadow-2xs">
              <div className="text-[11px] font-bold uppercase text-[#777]">
                Hoa hồng VẬN KỲ
              </div>
              <div className="text-xl font-bold text-[#B8862B] mt-1.5">
                {formatPrice(
                  storeOrders.reduce((sum, o) => sum + (o.financials.platformFee || 30000), 0),
                  currency
                )}
              </div>
              <p className="text-[10px] text-[#777] mt-1">Phí công nghệ & bảo chứng</p>
            </div>

            {/* 3. Tiền thực nhận về tiệm */}
            <div className="bg-white p-4 rounded border-2 border-[#2D6A4F] shadow-xs">
              <div className="text-[11px] font-bold uppercase text-[#2D6A4F]">
                Tiền thực nhận của tiệm (Net)
              </div>
              <div className="text-2xl font-bold text-[#2D6A4F] mt-1.5">
                {formatPrice(
                  storeOrders.reduce((sum, o) => sum + (o.financials.partnerPayout || 0), 0),
                  currency
                )}
              </div>
              <p className="text-[10px] text-[#2D6A4F] mt-1">✓ Đã trừ hoa hồng sàn</p>
            </div>

            {/* 4. Tiền cọc được giữ */}
            <div className="bg-[#FAF6ED] p-4 rounded border border-[#D8CEBE] shadow-2xs">
              <div className="text-[11px] font-bold uppercase text-[#777]">
                Cọc Escrow đang giữ
              </div>
              <div className="text-xl font-bold text-[#1F2A44] mt-1.5">
                {formatPrice(
                  storeOrders
                    .filter(o => o.escrowStatus === 'holding')
                    .reduce((sum, o) => sum + (o.financials.depositTotal || 0), 0),
                  currency
                )}
              </div>
              <p className="text-[10px] text-[#666] mt-1">Bảo đảm trong két VẬN KỲ</p>
            </div>
          </div>

          {/* Detailed Financial Ledger Table */}
          <div className="bg-white border border-[#D8CEBE] rounded p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#EAE0D0] gap-2">
              <h3 className="font-serif text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                <FileText size={18} className="text-[#A4161A]" />
                <span>Bảng Kê Chi Tiết Từng Đơn & Trạng Thái Dòng Tiền</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast('Đã gửi yêu cầu đối soát sao kê định kỳ tới kế toán VẬN KỲ!')}
                  className="px-3 py-1.5 bg-[#FAF6ED] hover:bg-[#E8DEC8] border border-[#B8862B] text-xs font-semibold text-[#A4161A] rounded cursor-pointer"
                >
                  Đối soát sao kê
                </button>
                <button
                  onClick={() => showToast('Đã yêu cầu lệnh giải ngân tự động về tài khoản ngân hàng của tiệm!')}
                  className="px-3.5 py-1.5 bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-bold rounded cursor-pointer shadow-2xs"
                >
                  Yêu cầu giải ngân nhanh
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F6EFE3] text-[#444] border-b border-[#D8CEBE] text-[11px] font-bold uppercase">
                  <tr>
                    <th className="p-3">Mã đơn</th>
                    <th className="p-3">Trang phục</th>
                    <th className="p-3">Khách hàng</th>
                    <th className="p-3 text-right">Tiền thuê</th>
                    <th className="p-3 text-right">Hoa hồng sàn</th>
                    <th className="p-3 text-right">Thực nhận tiệm</th>
                    <th className="p-3 text-center">Trạng thái giải ngân</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE0D0]">
                  {storeOrders.map(order => {
                    const isDisbursed = order.escrowStatus === 'disbursed' || order.status === 'hoan-coc';

                    return (
                      <tr key={order.id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="p-3 font-mono font-bold text-[#1A1A1A]">
                          #{order.id}
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-[#1A1A1A]">{order.costumeName}</div>
                          <div className="text-[10px] text-[#777]">Size {order.size} · {order.startDate}</div>
                        </td>
                        <td className="p-3 text-[#555]">
                          {order.recipientName}
                        </td>
                        <td className="p-3 text-right font-medium text-[#1A1A1A]">
                          {formatPrice(order.financials.rentalTotal, currency)}
                        </td>
                        <td className="p-3 text-right text-[#B8862B]">
                          -{formatPrice(order.financials.platformFee || 30000, currency)}
                        </td>
                        <td className="p-3 text-right font-bold text-[#2D6A4F] text-sm">
                          {formatPrice(order.financials.partnerPayout, currency)}
                        </td>
                        <td className="p-3 text-center">
                          {isDisbursed ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded border border-green-200">
                              <CheckCircle2 size={12} />
                              <span>Đã chuyển cho tiệm</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                              <Clock size={12} />
                              <span>Đang giữ trong Escrow</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: HUY HIỆU VÀ GÓI DỊCH VỤ (BADGES & PARTNER PLANS)
      ========================================================================= */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          {/* PHẦN 1: HUY HIỆU "ĐÃ KIỂM ĐỊNH ĐIỂN CHẾ" (REQUIREMENT 6) */}
          <div className="bg-[#FAF6ED] border-2 border-[#D4A347] p-6 rounded space-y-5 shadow-sm relative overflow-hidden">
            <HeritageCorner position="top-right" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8DEC8] gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#D4A347] text-[#1A1A1A] rounded-full shadow-sm">
                  <Award size={26} />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1A1A1A]">
                    Huy Hiệu "Đã Kiểm Định Điển Chế" (Canon Verified)
                  </h3>
                  <p className="text-xs text-[#555] mt-0.5">
                    Chứng nhận cao nhất của Hội đồng Nghiên cứu Cổ phục VẬN KỲ bảo chứng phom dáng chuẩn di sản.
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#666]">Trạng thái tiệm:</span>
                <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${
                  storeConfig.canonStatus === 'da-duyet'
                    ? 'bg-green-100 text-green-800 border-green-300'
                    : storeConfig.canonStatus === 'dang-xet'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                }`}>
                  {storeConfig.canonStatus === 'da-duyet' ? '✓ Đã Duyệt' : storeConfig.canonStatus === 'dang-xet' ? 'Đang Xét Duyệt' : 'Chưa Nộp Hồ Sơ'}
                </span>
              </div>
            </div>

            {/* Checklist Tiêu chí */}
            <div className="space-y-3">
              <div className="font-bold text-xs uppercase tracking-wider text-[#A4161A]">
                Checklist 3 Tiêu Chí Xét Duyệt:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                {/* Tiêu chí 1 */}
                <div className="p-3.5 bg-white rounded border border-[#E8DEC8] space-y-1.5">
                  <div className="flex items-center gap-2 text-[#2D6A4F] font-bold">
                    <CheckCircle2 size={16} />
                    <span>1. Nguồn tham chiếu sử liệu</span>
                  </div>
                  <p className="text-[11px] text-[#555] leading-relaxed">
                    Có trích dẫn chuẩn xác từ <em>Khâm Định Đại Nam Hội Điển Sự Lệ</em>, <em>Đại Nam Thực Lục</em> hoặc công trình khảo cứu uy tín (Ngàn Năm Áo Mũ).
                  </p>
                </div>

                {/* Tiêu chí 2 */}
                <div className="p-3.5 bg-white rounded border border-[#E8DEC8] space-y-1.5">
                  <div className="flex items-center gap-2 text-[#2D6A4F] font-bold">
                    <CheckCircle2 size={16} />
                    <span>2. Đúng màu & hoa văn điển chế</span>
                  </div>
                  <p className="text-[11px] text-[#555] leading-relaxed">
                    Không sai lệch phẩm hàm (tránh rồng 5 móng cho thứ dân), chuẩn Ngũ Hành màu sắc, thêu tay chỉ kim tuyến đúng quy cách cung đình.
                  </p>
                </div>

                {/* Tiêu chí 3 */}
                <div className="p-3.5 bg-white rounded border border-[#E8DEC8] space-y-1.5">
                  <div className="flex items-center gap-2 text-[#2D6A4F] font-bold">
                    <CheckCircle2 size={16} />
                    <span>3. Ảnh hiện vật rõ ràng</span>
                  </div>
                  <p className="text-[11px] text-[#555] leading-relaxed">
                    Có ảnh chụp chi tiết đường may nẹp cổ, gấu vạt, hạt cúc ngọc và chất liệu vải gấm tơ tằm thực tế tại tiệm, không dùng ảnh mạng giả lập.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Status Switcher (Demo requirement) */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-white/70 p-3.5 rounded border border-[#E8DEC8]">
              <span className="text-[#555]">
                {storeConfig.canonStatus === 'da-duyet'
                  ? '🌟 Tiệm đã đạt chuẩn! Tất cả bộ đồ của tiệm đang được gắn huy hiệu vàng trên Lookbook và Studio.'
                  : 'Tiệm có thể nộp hoặc chuyển trạng thái để trải nghiệm hiển thị huy hiệu trên toàn hệ thống:'}
              </span>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleSetCanonStatus('chua-nop')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer ${
                    storeConfig.canonStatus === 'chua-nop' ? 'bg-[#1F2A44] text-white' : 'bg-white border border-[#D8CEBE]'
                  }`}
                >
                  Chưa nộp
                </button>
                <button
                  onClick={() => handleSetCanonStatus('dang-xet')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer ${
                    storeConfig.canonStatus === 'dang-xet' ? 'bg-amber-600 text-white' : 'bg-white border border-[#D8CEBE]'
                  }`}
                >
                  Đang xét
                </button>
                <button
                  onClick={() => handleSetCanonStatus('da-duyet')}
                  className={`px-3 py-1.5 rounded text-xs font-bold cursor-pointer ${
                    storeConfig.canonStatus === 'da-duyet' ? 'bg-[#2D6A4F] text-white' : 'bg-white border border-[#D8CEBE]'
                  }`}
                >
                  ✓ Duyệt cấp huy hiệu
                </button>
              </div>
            </div>
          </div>

          {/* PHẦN 2: SO SÁNH 2 GÓI DỊCH VỤ CHO TIỆM (REQUIREMENT 6) */}
          <div className="space-y-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                So Sánh Gói Dịch Vụ Đối Tác Tiệm
              </h3>
              <p className="text-xs text-[#666] mt-0.5">
                Nâng cấp gói Pro để tự động hóa quy trình nhắc hẹn và tiếp cận hàng nghìn khách hàng tiềm năng mỗi tháng.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Gói Cơ bản */}
              <div className={`p-6 rounded-lg border-2 bg-white flex flex-col justify-between space-y-4 transition-all ${
                storeConfig.plan === 'basic' ? 'border-[#1F2A44] ring-2 ring-[#1F2A44]/10' : 'border-[#D8CEBE]'
              }`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase text-[#777]">Gói Khởi Điểm</span>
                    {storeConfig.plan === 'basic' && (
                      <span className="text-[10px] font-bold bg-[#1F2A44] text-white px-2 py-0.5 rounded">Đang dùng</span>
                    )}
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-[#1A1A1A]">Gói Cơ Bản</h4>
                  <div className="text-lg font-bold text-[#2D6A4F]">Miễn phí vĩnh viễn</div>
                  <p className="text-xs text-[#666]">
                    Phù hợp cho tiệm mới bắt đầu số hóa quy trình quản lý cho thuê cổ phục.
                  </p>

                  <ul className="space-y-2 pt-2 text-xs text-[#444]">
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-[#2D6A4F]" />
                      <span>Nhận đơn đặt thuê trực tuyến 24/7</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-[#2D6A4F]" />
                      <span>Lưới xem lịch tồn kho 14 ngày</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-[#2D6A4F]" />
                      <span>Bảo chứng ký quỹ tiền cọc VẬN KỲ Escrow</span>
                    </li>
                    <li className="flex items-center gap-2 text-[#999]">
                      <X size={14} className="text-[#999]" />
                      <span>Không có nhắc hạn trả tự động qua SMS/Zalo</span>
                    </li>
                    <li className="flex items-center gap-2 text-[#999]">
                      <X size={14} className="text-[#999]" />
                      <span>Không ưu tiên hiển thị trên đề xuất AI Stylist</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => handleSetPlan('basic')}
                  disabled={storeConfig.plan === 'basic'}
                  className="w-full py-2.5 border border-[#1F2A44] text-[#1F2A44] hover:bg-gray-50 text-xs font-bold rounded cursor-pointer transition-colors disabled:opacity-50"
                >
                  {storeConfig.plan === 'basic' ? 'Gói Hiện Tại' : 'Chuyển về Gói Cơ Bản'}
                </button>
              </div>

              {/* Gói Pro */}
              <div className={`p-6 rounded-lg border-2 bg-gradient-to-b from-[#FFFDF7] to-[#FAF6ED] flex flex-col justify-between space-y-4 relative overflow-hidden transition-all ${
                storeConfig.plan === 'pro' ? 'border-[#B8862B] ring-2 ring-[#B8862B]/30 shadow-md' : 'border-[#D8CEBE]'
              }`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase text-[#A4161A] flex items-center gap-1">
                      <Sparkles size={13} className="text-[#D4A347]" />
                      <span>Khuyên Dùng Cho Tiệm Chuyên Nghiệp</span>
                    </span>
                    {storeConfig.plan === 'pro' && (
                      <span className="text-[10px] font-bold bg-[#A4161A] text-white px-2.5 py-0.5 rounded shadow-2xs">Đang Kích Hoạt</span>
                    )}
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-[#A4161A]">Gói Pro</h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[#A4161A]">300.000đ</span>
                    <span className="text-xs text-[#777]">/ tháng</span>
                  </div>
                  <p className="text-xs text-[#666]">
                    Bộ công cụ tăng tốc vận hành, hạn chế 90% rủi ro trễ hẹn trả đồ và nhân đôi lượt đặt thuê.
                  </p>

                  <ul className="space-y-2 pt-2 text-xs text-[#222]">
                    <li className="flex items-center gap-2 font-medium">
                      <Check size={14} className="text-[#A4161A]" />
                      <span>Bao gồm tất cả tính năng của Gói Cơ bản</span>
                    </li>
                    <li className="flex items-center gap-2 font-medium text-[#A4161A]">
                      <Check size={14} className="text-[#A4161A]" />
                      <span>Tự động gửi SMS & Zalo nhắc hạn trả trước 24h & 2h</span>
                    </li>
                    <li className="flex items-center gap-2 font-medium text-[#A4161A]">
                      <Check size={14} className="text-[#A4161A]" />
                      <span>Báo cáo doanh thu & tỷ lệ lấp đầy kho chuyên sâu</span>
                    </li>
                    <li className="flex items-center gap-2 font-medium text-[#A4161A]">
                      <Check size={14} className="text-[#A4161A]" />
                      <span>Ưu tiên hiển thị Top 1 & gợi ý trong chat AI Stylist Vân</span>
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check size={14} className="text-[#A4161A]" />
                      <span>Huy hiệu độc quyền "Tiệm Đối Tác Vàng Pro"</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => handleSetPlan('pro')}
                  disabled={storeConfig.plan === 'pro'}
                  className="w-full py-3 bg-[#A4161A] hover:bg-[#850D11] text-white text-xs font-bold uppercase tracking-wider rounded cursor-pointer transition-colors shadow-sm disabled:opacity-50"
                >
                  {storeConfig.plan === 'pro' ? 'Đang Sử Dụng Gói Pro' : 'Nâng Cấp Gói Pro (300.000đ/tháng)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
