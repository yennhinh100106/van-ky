import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Plus, Share2, Copy, Check, Clock, Calendar, MapPin, 
  Sparkles, ShieldCheck, DollarSign, ArrowRight, AlertCircle, 
  CheckCircle2, Bell, RefreshCw, Layers, UserCheck, Package, Store
} from 'lucide-react';
import { GroupOrder, GroupMember, GROUP_COORDINATION_FEE, getGroupDiscountRate } from '../types/groupOrder';
import { 
  getStoredGroups, 
  saveGroup, 
  calculateMemberPricing, 
  calculateGroupFinancials, 
  finalizeGroupOrder 
} from '../utils/groupOrderStorage';
import { Costume } from '../types/lookbook';
import lookbookData from '../data/lookbook.json';
import { RentalSize } from '../types/rental';
import { Language, Currency, formatPrice } from '../utils/i18n';
import { COSTUME_PRICING } from '../data/partners';
import { HeritageCorner } from './TraditionalPattern';

interface GroupOrderViewProps {
  onNavigateToOrders?: () => void;
  onNavigateToLookbook?: () => void;
  language?: Language;
  currency?: Currency;
}

export const GroupOrderView: React.FC<GroupOrderViewProps> = ({
  onNavigateToOrders,
  onNavigateToLookbook,
  language = 'vi',
  currency = 'VND'
}) => {
  const [groups, setGroups] = useState<GroupOrder[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showMemberJoinModal, setShowMemberJoinModal] = useState<boolean>(false);
  const [finalizedSuccessOrder, setFinalizedSuccessOrder] = useState<string | null>(null);

  // New Group Form State
  const [newGroupName, setNewGroupName] = useState<string>('Kỷ yếu Lớp 12 Văn – Quốc Học');
  const [newOrganizerName, setNewOrganizerName] = useState<string>('Lê Hoàng Bách (Lớp trưởng)');
  const [newOrganizerPhone, setNewOrganizerPhone] = useState<string>('0905.888.999');
  const [newExpectedMembers, setNewExpectedMembers] = useState<number>(25);
  const [newEventDate, setNewEventDate] = useState<string>('2026-10-25');
  const [newDeadlineDate, setNewDeadlineDate] = useState<string>('2026-10-15');
  const [newLocation, setNewLocation] = useState<string>('Trường THPT Chuyên Quốc Học Huế / Tiệm Cổ Phục Huế');
  const [newCostumeMode, setNewCostumeMode] = useState<'uniform' | 'flexible'>('flexible');
  const [newDefaultCostumeId, setNewDefaultCostumeId] = useState<string>('ao-tac');

  // Member Join Form State (Simulate clicking shareable link)
  const [joinMemberName, setJoinMemberName] = useState<string>('');
  const [joinMemberPhone, setJoinMemberPhone] = useState<string>('');
  const [joinCostumeId, setJoinCostumeId] = useState<string>('ao-tac');
  const [joinSize, setJoinSize] = useState<RentalSize>('M');

  // Load groups on mount
  const refreshGroups = () => {
    const list = getStoredGroups();
    setGroups(list);
    if (!selectedGroupId && list.length > 0) {
      setSelectedGroupId(list[0].id);
    }
  };

  useEffect(() => {
    refreshGroups();
  }, []);

  const activeGroup = useMemo(() => {
    return groups.find(g => g.id === selectedGroupId) || groups[0] || null;
  }, [groups, selectedGroupId]);

  // Financial calculations for active group
  const groupFinancials = useMemo(() => {
    if (!activeGroup) return null;
    return calculateGroupFinancials(activeGroup);
  }, [activeGroup]);

  // Calculate live countdown to deadline
  const countdownText = useMemo(() => {
    if (!activeGroup) return '';
    const now = new Date().getTime();
    const deadline = new Date(activeGroup.deadlineDate).getTime();
    const diff = deadline - now;
    if (diff <= 0) return language === 'en' ? 'Registration closed' : 'Đã đến hạn chốt đăng ký';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return language === 'en' 
      ? `Ends in ${days} days ${hours} hours` 
      : `Còn ${days} ngày ${hours} giờ đến hạn chốt`;
  }, [activeGroup, language]);

  // Copy shareable link
  const handleCopyLink = () => {
    const link = `https://vanky.vn/nhom/${activeGroup?.id || 'GRP-12A1-KYEU'}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).catch(() => {});
    }
    setCopiedLink(true);
    setAlertMessage(language === 'en' ? 'Invitation link copied to clipboard!' : 'Đã sao chép link mời thành viên! Gửi link này vào nhóm Zalo/Messenger của lớp.');
    setTimeout(() => {
      setCopiedLink(false);
      setAlertMessage(null);
    }, 4000);
  };

  // Simulate payment reminder to unpaid member
  const handleRemindPayment = (member: GroupMember) => {
    setAlertMessage(language === 'en'
      ? `Payment reminder sent to ${member.name} (${member.phone}) via Zalo & SMS.`
      : `Đã gửi thông báo nhắc thanh toán kèm mã QR cá nhân tới bạn ${member.name} (${member.phone}) qua Zalo!`);
    setTimeout(() => setAlertMessage(null), 4000);
  };

  // Simulate paying for an unpaid member on the spot
  const handleSimulatePayMember = (memberId: string) => {
    if (!activeGroup) return;
    const nowStr = new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const updatedMembers = activeGroup.members.map(m => {
      if (m.id === memberId) {
        const p = calculateMemberPricing(m.costumeId, activeGroup.expectedMembers);
        return {
          ...m,
          isPaid: true,
          paidAt: nowStr,
          amountPaid: p.totalToPay
        };
      }
      return m;
    });

    const updatedGroup: GroupOrder = {
      ...activeGroup,
      members: updatedMembers
    };

    saveGroup(updatedGroup);
    refreshGroups();
    setAlertMessage(language === 'en' ? 'Member payment marked as completed!' : 'Đã xác nhận thanh toán thành công phần đóng góp của thành viên!');
    setTimeout(() => setAlertMessage(null), 3500);
  };

  // Handle Create New Group
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || newExpectedMembers < 2) return;

    const discountRate = getGroupDiscountRate(newExpectedMembers);
    const newId = `GRP-${Date.now().toString().slice(-6)}`;
    const costumeInfo = (lookbookData as unknown as Costume[]).find(c => c.id === newDefaultCostumeId);

    // Initial organizer as first member
    const initialOrganizerMember: GroupMember = {
      id: `mem-${Date.now()}-01`,
      name: newOrganizerName.trim(),
      costumeId: newDefaultCostumeId,
      costumeName: costumeInfo?.name || 'Áo Tấc Nam Triều Nguyễn',
      size: 'L',
      isPaid: true,
      paidAt: 'Vừa xong',
      amountPaid: calculateMemberPricing(newDefaultCostumeId, newExpectedMembers).totalToPay,
      phone: newOrganizerPhone.trim()
    };

    const created: GroupOrder = {
      id: newId,
      name: newGroupName.trim(),
      organizerName: newOrganizerName.trim(),
      organizerPhone: newOrganizerPhone.trim(),
      expectedMembers: Number(newExpectedMembers),
      eventDate: newEventDate,
      deadlineDate: newDeadlineDate,
      location: newLocation.trim(),
      costumeMode: newCostumeMode,
      defaultCostumeId: newDefaultCostumeId,
      defaultCostumeName: costumeInfo?.name,
      coordinationFee: GROUP_COORDINATION_FEE,
      discountRate,
      members: [initialOrganizerMember],
      status: 'open',
      createdAt: new Date().toISOString()
    };

    saveGroup(created);
    refreshGroups();
    setSelectedGroupId(newId);
    setShowCreateModal(false);
    setAlertMessage(language === 'en' ? 'New group order created successfully!' : `Đã tạo đơn nhóm "${newGroupName}" thành công! Hãy gửi link mời các thành viên tham gia.`);
    setTimeout(() => setAlertMessage(null), 4000);
  };

  // Handle Member Join & Pay
  const handleMemberJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGroup || !joinMemberName.trim()) return;

    const costumeInfo = (lookbookData as unknown as Costume[]).find(c => c.id === joinCostumeId);
    const pricing = calculateMemberPricing(joinCostumeId, activeGroup.expectedMembers);
    const nowStr = new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    const newMember: GroupMember = {
      id: `mem-${Date.now()}`,
      name: joinMemberName.trim(),
      costumeId: joinCostumeId,
      costumeName: costumeInfo?.name || 'Cổ phục truyền thống',
      size: joinSize,
      isPaid: true,
      paidAt: nowStr,
      amountPaid: pricing.totalToPay,
      phone: joinMemberPhone.trim() || '0912.345.678'
    };

    const updatedGroup: GroupOrder = {
      ...activeGroup,
      members: [...activeGroup.members, newMember]
    };

    saveGroup(updatedGroup);
    refreshGroups();
    setShowMemberJoinModal(false);
    setJoinMemberName('');
    setJoinMemberPhone('');
    setAlertMessage(language === 'en' 
      ? `Welcome ${newMember.name}! Your individual payment of ${formatPrice(pricing.totalToPay, currency)} is securely held in VAN KY Escrow.` 
      : `Chúc mừng bạn ${newMember.name}! Đã đóng thành công phần tiền cá nhân (${formatPrice(pricing.totalToPay, currency)}) vào quỹ VẬN KỲ.`);
    setTimeout(() => setAlertMessage(null), 5000);
  };

  // Handle Finalize Group Order
  const handleFinalizeGroup = () => {
    if (!activeGroup) return;
    const bulkOrder = finalizeGroupOrder(activeGroup.id);
    if (bulkOrder) {
      refreshGroups();
      setFinalizedSuccessOrder(bulkOrder.id);
      setAlertMessage(language === 'en' 
        ? `Group order finalized! Bulk order #${bulkOrder.id} has been created in "My Orders".` 
        : `Đã chốt đơn nhóm thành công! Đơn giao hàng loạt #${bulkOrder.id} đã được tạo và hiển thị trong mục "Đơn của tôi".`);
      setTimeout(() => setAlertMessage(null), 6000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in">
      {/* Toast Notification Alert */}
      {alertMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-[#1F2A44] text-[#FAF6ED] border border-[#B8862B] p-3.5 sm:p-4 rounded-lg shadow-xl text-xs flex items-center gap-3 animate-in slide-in-from-top-3 max-w-md">
          <CheckCircle2 size={18} className="text-[#D4A347] shrink-0" />
          <span className="leading-relaxed">{alertMessage}</span>
        </div>
      )}

      {/* Header section with Heritage styling */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B8862B] font-medium mb-1">
          <Users className="w-4 h-4 text-[#B8862B]" />
          <span>{language === 'en' ? 'Classrooms · Graduation · Clubs' : 'Lớp Học · Kỷ Yếu · Câu Lạc Bộ'}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A]">
          {language === 'en' ? 'Heritage Group Rentals & Graduation' : 'Đơn Nhóm & Kỷ Yếu Cổ Phục'}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#4A4A4A] leading-relaxed">
          {language === 'en'
            ? 'Effortless collective rentals for graduation shoots and clubs. Members pay individual shares directly into escrow; organizers never front the money.'
            : 'Giải pháp đặt thuê cổ phục tập thể cho kỷ yếu học sinh, sinh viên, CLB. Thành viên tự đóng tiền phần mình qua link mời, người đầu mối không cần phải ứng trước tiền túi.'}
        </p>
      </div>

      {/* Group Selector & Action Buttons */}
      <div className="bg-[#FAF6ED] border border-[#D8CEBE] p-4 rounded flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <label className="text-xs font-bold text-[#1A1A1A] whitespace-nowrap uppercase tracking-wider">
            {language === 'en' ? 'Select Group:' : 'Chọn nhóm:'}
          </label>
          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="bg-white border border-[#D8CEBE] px-3 py-1.5 rounded text-xs text-[#1A1A1A] font-semibold focus:outline-none focus:border-[#A4161A] w-full sm:w-auto cursor-pointer"
          >
            {groups.map(g => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.members.filter(m => m.isPaid).length}/{g.expectedMembers} người)
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto px-4 py-2 bg-[#A4161A] hover:bg-[#850D11] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus size={15} />
            <span>{language === 'en' ? 'Create New Group' : 'Tạo đơn nhóm mới'}</span>
          </button>

          <button
            onClick={() => setShowMemberJoinModal(true)}
            className="w-full sm:w-auto px-3.5 py-2 bg-[#FAF6ED] hover:bg-[#E8DEC8] border border-[#B8862B] text-[#A4161A] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Users size={14} className="text-[#B8862B]" />
            <span>{language === 'en' ? 'Join & Pay Share' : 'Tham gia đóng tiền'}</span>
          </button>
        </div>
      </div>

      {activeGroup && groupFinancials && (
        <div className="space-y-6">
          {/* Group Overview Banner & Link Sharing */}
          <div className="bg-[#FAF6ED] border-2 border-[#B8862B] p-5 sm:p-6 rounded space-y-4 shadow-sm relative overflow-hidden">
            <HeritageCorner position="top-right" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-[#D8CEBE] gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                    {activeGroup.name}
                  </h2>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded font-bold uppercase ${
                    activeGroup.status === 'finalized'
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {activeGroup.status === 'finalized' ? (language === 'en' ? 'Finalized Bulk Order' : 'Đã chốt đơn hàng loạt') : (language === 'en' ? 'Collecting Payments' : 'Đang thu tiền')}
                  </span>
                </div>
                <div className="text-xs text-[#555] mt-1 space-x-3">
                  <span>{language === 'en' ? 'Organizer:' : 'Đầu mối:'} <strong>{activeGroup.organizerName}</strong> ({activeGroup.organizerPhone})</span>
                  <span>·</span>
                  <span>{language === 'en' ? 'Event date:' : 'Ngày chụp:'} <strong>{activeGroup.eventDate}</strong></span>
                  <span>·</span>
                  <span>{language === 'en' ? 'Delivery spot:' : 'Điểm giao:'} <strong>{activeGroup.location}</strong></span>
                </div>
              </div>

              {/* Deadline Countdown Box */}
              <div className="bg-[#FFFBEB] border border-[#E8DEC8] px-3.5 py-2 rounded shrink-0 flex items-center gap-2 text-xs text-[#8F6C22] font-semibold">
                <Clock size={16} className="text-[#B8862B]" />
                <span>{countdownText}</span>
              </div>
            </div>

            {/* Shareable Link Bar */}
            <div className="bg-white p-3 rounded border border-[#D8CEBE] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-xs flex-1 truncate">
                <span className="text-[#777] font-semibold uppercase text-[10px] shrink-0">
                  {language === 'en' ? 'Member Link:' : 'Link mời thành viên:'}
                </span>
                <span className="font-mono text-[#A4161A] bg-[#FAF6ED] px-2.5 py-1 rounded border border-[#E8DEC8] text-xs truncate">
                  https://vanky.vn/nhom/{activeGroup.id}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyLink}
                  className="px-3.5 py-1.5 bg-[#FAF6ED] hover:bg-[#E8DEC8] border border-[#B8862B] text-xs font-semibold text-[#A4161A] rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedLink ? <Check size={14} className="text-green-700" /> : <Copy size={14} className="text-[#A4161A]" />}
                  <span>{copiedLink ? (language === 'en' ? 'Copied' : 'Đã sao chép') : (language === 'en' ? 'Copy Link' : 'Sao chép link')}</span>
                </button>

                <button
                  onClick={() => setShowMemberJoinModal(true)}
                  className="px-3.5 py-1.5 bg-[#1F2A44] hover:bg-[#121A2D] text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 size={13} className="text-[#D4A347]" />
                  <span>{language === 'en' ? 'Simulate Member Payment' : 'Mở link đóng tiền'}</span>
                </button>
              </div>
            </div>

            {/* Progress Bar & Collection Stats */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-baseline text-xs">
                <span className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                  <UserCheck size={15} className="text-[#2D6A4F]" />
                  <span>
                    {language === 'en' 
                      ? `Collected: ${groupFinancials.paidCount}/${activeGroup.expectedMembers} members` 
                      : `Tiến độ thu: Đã thu ${groupFinancials.paidCount}/${activeGroup.expectedMembers} người`}
                  </span>
                </span>
                <span className="text-[#666]">
                  {language === 'en' ? 'Paid:' : 'Đã thu:'} <strong className="text-[#A4161A]">{formatPrice(groupFinancials.totalPaidSoFar, currency)}</strong> / {formatPrice(groupFinancials.totalExpectedPaid, currency)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-[#E8DEC8] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#A4161A] to-[#B8862B] transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, (groupFinancials.paidCount / activeGroup.expectedMembers) * 100)}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[11px] text-[#666]">
                <span>{((groupFinancials.paidCount / activeGroup.expectedMembers) * 100).toFixed(1)}% hoàn thành</span>
                <span>
                  {groupFinancials.totalPending > 0
                    ? `Còn thiếu ${activeGroup.expectedMembers - groupFinancials.paidCount} người (${formatPrice(groupFinancials.totalPending, currency)})`
                    : '✓ Đã thu đủ 100% thành viên!'}
                </span>
              </div>
            </div>

            {/* Group Pricing Discount Policy Pill */}
            <div className="p-3 bg-white border border-[#E8DEC8] rounded text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[#444]">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#B8862B] shrink-0" />
                <span>
                  {language === 'en' 
                    ? `Group Policy: ${activeGroup.expectedMembers >= 20 ? '15% discount' : activeGroup.expectedMembers >= 10 ? '10% discount' : 'No discount'} applied. Fixed coordination fee: ${formatPrice(activeGroup.coordinationFee, currency)} (~${formatPrice(Math.round(activeGroup.coordinationFee / activeGroup.expectedMembers), currency)}/person).`
                    : `Chính sách nhóm: Giảm ${(activeGroup.discountRate * 100).toFixed(0)}% tiền thuê (áp dụng cho nhóm >= ${activeGroup.expectedMembers >= 20 ? 20 : 10} người). Phí điều phối cố định ${formatPrice(activeGroup.coordinationFee, currency)} chia đều ~${formatPrice(Math.round(activeGroup.coordinationFee / activeGroup.expectedMembers), currency)}/người.`}
                </span>
              </div>
              <span className="text-[11px] text-green-700 font-bold shrink-0 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                Đã tiết kiệm {formatPrice(groupFinancials.totalDiscountSaved, currency)}
              </span>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-[#FAF6ED] border border-[#D8CEBE] p-5 rounded space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#D8CEBE] gap-2">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-[#A4161A]" />
                <h3 className="font-serif text-base font-bold text-[#1A1A1A]">
                  {language === 'en' ? `Member Roster (${activeGroup.members.length} members)` : `Danh Sách Thành Viên Tham Gia (${activeGroup.members.length} người)`}
                </h3>
              </div>

              {/* Chốt đơn button */}
              {activeGroup.status === 'open' ? (
                <button
                  onClick={handleFinalizeGroup}
                  className="px-4 py-2 bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Package size={15} />
                  <span>{language === 'en' ? 'Finalize Order (Bulk Delivery)' : 'Chốt đơn (Giao hàng loạt)'}</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-green-700 font-bold flex items-center gap-1">
                    <CheckCircle2 size={15} />
                    <span>{language === 'en' ? 'Order Finalized' : 'Đã chốt đơn'}</span>
                  </span>
                  {onNavigateToOrders && (
                    <button
                      onClick={onNavigateToOrders}
                      className="px-3 py-1.5 bg-[#1F2A44] hover:bg-[#121A2D] text-white text-xs font-semibold rounded flex items-center gap-1 cursor-pointer"
                    >
                      <span>Xem trong Đơn của tôi</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Member List Table */}
            <div className="overflow-x-auto border border-[#D8CEBE] rounded bg-white">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F6EFE3] text-[#444] border-b border-[#D8CEBE] text-[11px] font-bold uppercase">
                  <tr>
                    <th className="p-3">STT</th>
                    <th className="p-3">{language === 'en' ? 'Member Name' : 'Họ tên thành viên'}</th>
                    <th className="p-3">{language === 'en' ? 'Selected Costume' : 'Bộ trang phục'}</th>
                    <th className="p-3">Size</th>
                    <th className="p-3 text-right">{language === 'en' ? 'Individual Share' : 'Phần đóng góp'}</th>
                    <th className="p-3 text-center">{language === 'en' ? 'Status' : 'Trạng thái'}</th>
                    <th className="p-3 text-right">{language === 'en' ? 'Actions' : 'Thao tác'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE0D0]">
                  {activeGroup.members.map((member, idx) => {
                    const pricing = calculateMemberPricing(member.costumeId, activeGroup.expectedMembers);
                    return (
                      <tr key={member.id} className="hover:bg-amber-50/50 transition-colors">
                        <td className="p-3 text-[#777] font-mono">{idx + 1}</td>
                        <td className="p-3">
                          <div className="font-bold text-[#1A1A1A]">{member.name}</div>
                          {member.phone && <div className="text-[10px] text-[#888]">{member.phone}</div>}
                        </td>
                        <td className="p-3">
                          <div className="text-[#444] font-medium">{member.costumeName}</div>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-[#A4161A] bg-[#A4161A]/10 px-2 py-0.5 rounded text-[11px]">
                            {member.size}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="font-bold text-[#1A1A1A]">
                            {formatPrice(member.isPaid ? member.amountPaid : pricing.totalToPay, currency)}
                          </div>
                          <div className="text-[10px] text-[#777]">
                            (Thuê {formatPrice(pricing.discountedRental, currency)} + Cọc {formatPrice(pricing.deposit, currency)} + Phí {formatPrice(pricing.coordinationShare, currency)})
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          {member.isPaid ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                              <CheckCircle2 size={12} />
                              <span>{language === 'en' ? 'Paid' : 'Đã thanh toán'}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              <Clock size={12} />
                              <span>{language === 'en' ? 'Unpaid' : 'Chưa thanh toán'}</span>
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {!member.isPaid ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleRemindPayment(member)}
                                title="Gửi tin nhắn Zalo/SMS nhắc thành viên thanh toán"
                                className="px-2.5 py-1 bg-[#FAF6ED] hover:bg-[#E8DEC8] border border-[#B8862B] text-[11px] font-medium text-[#A4161A] rounded flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Bell size={12} />
                                <span>{language === 'en' ? 'Remind' : 'Nhắc'}</span>
                              </button>
                              <button
                                onClick={() => handleSimulatePayMember(member.id)}
                                title="Mô phỏng thành viên thanh toán phần mình"
                                className="px-2.5 py-1 bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-[11px] font-semibold rounded cursor-pointer transition-colors"
                              >
                                {language === 'en' ? 'Pay Demo' : 'Thu tiền'}
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-[#888]">{member.paidAt}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* DÒNG TIỀN CỦA ĐƠN NHÓM (REQUIREMENT 2) */}
          <div className="bg-[#FAF6ED] border border-[#D8CEBE] p-5 rounded space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8CEBE]">
              <div className="flex items-center gap-2 text-[#A4161A]">
                <DollarSign size={18} />
                <h3 className="font-serif text-base font-bold">
                  {language === 'en' ? 'Group Order Escrow Financial Ledger' : 'Dòng Tiền Của Đơn Nhóm (Bảo Chứng VẬN KỲ)'}
                </h3>
              </div>
              <span className="text-[11px] px-2.5 py-0.5 rounded font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300">
                {language === 'en' ? 'Escrow Protected' : 'Ký Quỹ An Toàn'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Tổng khách trả */}
              <div className="bg-white p-3.5 border border-[#D8CEBE] rounded">
                <div className="text-[11px] text-[#666] uppercase font-bold">
                  {language === 'en' ? '1. Total Paid by Members' : '1. Tổng Khách Trả'}
                </div>
                <div className="text-lg font-bold text-[#A4161A] mt-1">
                  {formatPrice(groupFinancials.totalPaidSoFar, currency)}
                </div>
                <div className="text-[10px] text-[#666] mt-1">
                  {groupFinancials.paidCount}/{activeGroup.expectedMembers} thành viên đã đóng
                </div>
              </div>

              {/* Phần chuyển cho tiệm */}
              <div className="bg-white p-3.5 border border-[#D8CEBE] rounded">
                <div className="text-[11px] text-[#666] uppercase font-bold">
                  {language === 'en' ? '2. Payout to Boutique' : '2. Chuyển Cho Tiệm'}
                </div>
                <div className="text-lg font-bold text-[#1A1A1A] mt-1">
                  {formatPrice(groupFinancials.totalRentalPayoutToShop, currency)}
                </div>
                <div className="text-[10px] text-[#2D6A4F] mt-1">
                  Tiền thuê (đã áp dụng chiết khấu)
                </div>
              </div>

              {/* Phí nền tảng */}
              <div className="bg-white p-3.5 border border-[#D8CEBE] rounded">
                <div className="text-[11px] text-[#666] uppercase font-bold">
                  {language === 'en' ? '3. Platform Fee' : '3. Phí Nền Tảng'}
                </div>
                <div className="text-lg font-bold text-[#B8862B] mt-1">
                  {formatPrice(groupFinancials.totalPlatformRevenue, currency)}
                </div>
                <div className="text-[10px] text-[#666] mt-1">
                  Phí điều phối đơn nhóm cố định
                </div>
              </div>

              {/* Tiền cọc được giữ */}
              <div className="bg-white p-3.5 border border-[#D8CEBE] rounded">
                <div className="text-[11px] text-[#666] uppercase font-bold">
                  {language === 'en' ? '4. Escrow Deposit Held' : '4. Tiền Cọc Được Giữ'}
                </div>
                <div className="text-lg font-bold text-[#2D6A4F] mt-1">
                  {formatPrice(groupFinancials.totalEscrowDepositHeld, currency)}
                </div>
                <div className="text-[10px] text-[#2D6A4F] mt-1">
                  Hoàn trả 100% khi tiệm kiểm tra xong
                </div>
              </div>
            </div>

            <div className="p-3 bg-white border border-[#E8DEC8] rounded text-xs text-[#555] flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#B8862B] shrink-0" />
              <span>
                {language === 'en'
                  ? 'Transparent Escrow Guarantee: Member payments are safely locked in VẬN KỲ vault. Partner boutiques only receive rental payouts after attire inspection upon return.'
                  : 'Cam kết ký quỹ minh bạch: Toàn bộ tiền thành viên được VẬN KỲ bảo chứng an toàn. Tiệm chỉ nhận tiền thuê sau khi nhận đồ và tiền cọc được hoàn lại 100% cho từng thành viên khi đồ nguyên vẹn.'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TẠO ĐƠN NHÓM MỚI */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#F6EFE3] border border-[#B8862B] shadow-2xl rounded p-5 sm:p-7 text-left max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8CEBE] mb-4">
              <div className="flex items-center gap-2 text-[#A4161A]">
                <Users size={22} />
                <h3 className="font-serif text-xl font-bold">
                  {language === 'en' ? 'Create New Group Order' : 'Tạo Đơn Nhóm Cổ Phục Mới'}
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#666] hover:text-[#1A1A1A] p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4 overflow-y-auto pr-1 text-xs">
              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">
                  Tên nhóm (Lớp, CLB, Đoàn sự kiện) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lớp 12A1 – Kỷ yếu, CLB Di Sản Văn Miếu..."
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full bg-white border border-[#D8CEBE] px-3 py-2 rounded focus:outline-none focus:border-[#A4161A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Họ tên người đầu mối *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn A (Lớp trưởng)"
                    value={newOrganizerName}
                    onChange={(e) => setNewOrganizerName(e.target.value)}
                    className="w-full bg-white border border-[#D8CEBE] px-3 py-2 rounded focus:outline-none focus:border-[#A4161A]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Số điện thoại liên hệ *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0912.xxx.xxx"
                    value={newOrganizerPhone}
                    onChange={(e) => setNewOrganizerPhone(e.target.value)}
                    className="w-full bg-white border border-[#D8CEBE] px-3 py-2 rounded focus:outline-none focus:border-[#A4161A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Số người dự kiến *</label>
                  <input
                    type="number"
                    min="2"
                    max="100"
                    required
                    value={newExpectedMembers}
                    onChange={(e) => setNewExpectedMembers(Number(e.target.value))}
                    className="w-full bg-white border border-[#D8CEBE] px-3 py-2 rounded focus:outline-none focus:border-[#A4161A]"
                  />
                  <span className="text-[10px] text-[#A4161A] font-bold mt-1 block">
                    {newExpectedMembers >= 20 ? 'Giảm 15% tiền thuê' : newExpectedMembers >= 10 ? 'Giảm 10% tiền thuê' : 'Chưa đủ điều kiện giảm giá'}
                  </span>
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Ngày sử dụng đồ *</label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full bg-white border border-[#D8CEBE] px-3 py-2 rounded focus:outline-none focus:border-[#A4161A]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Hạn chốt đăng ký *</label>
                  <input
                    type="date"
                    required
                    value={newDeadlineDate}
                    onChange={(e) => setNewDeadlineDate(e.target.value)}
                    className="w-full bg-white border border-[#D8CEBE] px-3 py-2 rounded focus:outline-none focus:border-[#A4161A]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Điểm nhận đồ (Địa chỉ giao hoặc tiệm đối tác) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Cổng trường THPT Chuyên Quốc Học Huế hoặc Tiệm Cổ Phục..."
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-white border border-[#D8CEBE] px-3 py-2 rounded focus:outline-none focus:border-[#A4161A]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Phương thức chọn bộ trang phục</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`p-2.5 rounded border cursor-pointer flex items-center gap-2 ${newCostumeMode === 'flexible' ? 'bg-[#FAF6ED] border-[#A4161A] font-bold text-[#A4161A]' : 'bg-white border-[#D8CEBE]'}`}>
                    <input
                      type="radio"
                      name="costumeMode"
                      checked={newCostumeMode === 'flexible'}
                      onChange={() => setNewCostumeMode('flexible')}
                      className="accent-[#A4161A]"
                    />
                    <span>Mỗi người tự chọn bộ</span>
                  </label>
                  <label className={`p-2.5 rounded border cursor-pointer flex items-center gap-2 ${newCostumeMode === 'uniform' ? 'bg-[#FAF6ED] border-[#A4161A] font-bold text-[#A4161A]' : 'bg-white border-[#D8CEBE]'}`}>
                    <input
                      type="radio"
                      name="costumeMode"
                      checked={newCostumeMode === 'uniform'}
                      onChange={() => setNewCostumeMode('uniform')}
                      className="accent-[#A4161A]"
                    />
                    <span>Chọn bộ chung cả nhóm</span>
                  </label>
                </div>
              </div>

              {/* Price Calculation Preview Box */}
              <div className="bg-[#FFFBEB] p-3 rounded border border-[#E8DEC8] text-[11px] text-[#785E23] space-y-1">
                <div className="font-bold text-xs">Cơ cấu giá tự động tính:</div>
                <div>• Mức giảm giá: <strong>{(getGroupDiscountRate(newExpectedMembers) * 100).toFixed(0)}%</strong> trên đơn giá thuê.</div>
                <div>• Phí điều phối cố định: <strong>{formatPrice(GROUP_COORDINATION_FEE, currency)}</strong> (mỗi thành viên chia đều ~<strong>{formatPrice(Math.round(GROUP_COORDINATION_FEE / newExpectedMembers), currency)}</strong>).</div>
                <div>• Người đầu mối không cần ứng tiền trước; mỗi thành viên tham gia tự nộp phần mình qua link nhóm.</div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#D8CEBE]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-[#D8CEBE] rounded text-xs font-semibold hover:bg-black/5 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#A4161A] hover:bg-[#850D11] text-white text-xs font-bold uppercase tracking-wider rounded cursor-pointer shadow-xs"
                >
                  Khởi tạo nhóm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: THÀNH VIÊN THAM GIA ĐÓNG TIỀN (SIMULATED SHARE LINK PAGE) */}
      {showMemberJoinModal && activeGroup && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-xl bg-[#F6EFE3] border border-[#B8862B] shadow-2xl rounded p-5 sm:p-7 text-left max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8CEBE] mb-3">
              <div>
                <div className="text-[10px] text-[#B8862B] uppercase font-bold">
                  {language === 'en' ? 'Group Invitation Link' : 'Giao Diện Thành Viên Đóng Tiền'}
                </div>
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                  {activeGroup.name}
                </h3>
              </div>
              <button
                onClick={() => setShowMemberJoinModal(false)}
                className="text-[#666] hover:text-[#1A1A1A] p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#555] mb-3 leading-relaxed">
              Bạn đang đăng ký tham gia đơn cổ phục của nhóm <strong>{activeGroup.name}</strong>. Hãy chọn bộ, size và thanh toán phần của riêng bạn để hoàn tất giữ chỗ.
            </p>

            <form onSubmit={handleMemberJoinSubmit} className="space-y-3.5 overflow-y-auto pr-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Họ tên của bạn *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Hoàng Bảo Ngọc"
                    value={joinMemberName}
                    onChange={(e) => setJoinMemberName(e.target.value)}
                    className="w-full bg-white border border-[#D8CEBE] px-3 py-2 rounded focus:outline-none focus:border-[#A4161A]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0912.xxx.xxx"
                    value={joinMemberPhone}
                    onChange={(e) => setJoinMemberPhone(e.target.value)}
                    className="w-full bg-white border border-[#D8CEBE] px-3 py-2 rounded focus:outline-none focus:border-[#A4161A]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Chọn mẫu cổ phục *</label>
                <select
                  value={joinCostumeId}
                  onChange={(e) => setJoinCostumeId(e.target.value)}
                  className="w-full bg-white border border-[#D8CEBE] px-3 py-2 rounded focus:outline-none focus:border-[#A4161A] cursor-pointer"
                >
                  {(lookbookData as unknown as Costume[]).map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.period}) - Thuê gốc {formatPrice(COSTUME_PRICING[c.id]?.pricePerDay || 300000, currency)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Chọn kích cỡ trang phục (Size) *</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['S', 'M', 'L', 'XL'] as RentalSize[]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setJoinSize(sz)}
                      className={`py-2 rounded font-bold transition-all border text-xs cursor-pointer ${
                        joinSize === sz
                          ? 'bg-[#A4161A] text-white border-[#A4161A] shadow-xs'
                          : 'bg-white hover:bg-[#FAF6ED] text-[#1A1A1A] border-[#D8CEBE]'
                      }`}
                    >
                      Size {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Individual Price Breakdown */}
              {(() => {
                const pricing = calculateMemberPricing(joinCostumeId, activeGroup.expectedMembers);
                return (
                  <div className="bg-[#FAF6ED] p-3.5 border border-[#D8CEBE] rounded space-y-2 text-xs">
                    <div className="font-bold text-[#1A1A1A] uppercase tracking-wide text-[11px] pb-1 border-b border-[#D8CEBE]">
                      Phần chi phí cá nhân của bạn:
                    </div>
                    <div className="flex justify-between text-[#555]">
                      <span>1. Tiền thuê (đã giảm {(pricing.discountRate * 100).toFixed(0)}% nhóm):</span>
                      <span className="font-semibold text-[#1A1A1A]">{formatPrice(pricing.discountedRental, currency)}</span>
                    </div>
                    <div className="flex justify-between text-[#555]">
                      <span>2. Tiền cọc đồ (hoàn lại 100% khi trả):</span>
                      <span className="font-semibold text-[#1A1A1A]">{formatPrice(pricing.deposit, currency)}</span>
                    </div>
                    <div className="flex justify-between text-[#555]">
                      <span>3. Phần chia phí điều phối nhóm (500k/{activeGroup.expectedMembers}):</span>
                      <span className="font-semibold text-[#1A1A1A]">{formatPrice(pricing.coordinationShare, currency)}</span>
                    </div>
                    <div className="pt-2 border-t border-[#D8CEBE] flex justify-between items-baseline font-bold text-sm text-[#A4161A]">
                      <span>Tổng bạn cần thanh toán:</span>
                      <span className="text-base">{formatPrice(pricing.totalToPay, currency)}</span>
                    </div>
                  </div>
                );
              })()}

              <div className="flex justify-end gap-2 pt-2 border-t border-[#D8CEBE]">
                <button
                  type="button"
                  onClick={() => setShowMemberJoinModal(false)}
                  className="px-4 py-2 border border-[#D8CEBE] rounded text-xs font-semibold hover:bg-black/5 cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#A4161A] hover:bg-[#850D11] text-white text-xs font-bold uppercase tracking-wider rounded cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <ShieldCheck size={15} />
                  <span>Thanh toán phần của tôi (Ký quỹ VẬN KỲ)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
