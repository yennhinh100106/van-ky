import React, { useState, useEffect } from 'react';
import { 
  Filter, Volume2, VolumeX, Sparkles, AlertTriangle, BookCheck, 
  X, CheckCircle, Info, ChevronRight, Layers, MapPin, Calendar, User,
  ShieldCheck, Package, Store, Check, AlertCircle, Compass, ArrowRight, ExternalLink, Users, Award
} from 'lucide-react';
import lookbookData from '../data/lookbook.json';
import { Costume } from '../types/lookbook';
import { HeritageCorner, CloudMotif, LotusMotif } from './TraditionalPattern';
import { normalizeVN } from '../utils/unicode';
import { COSTUME_PRICING, PARTNER_STORES } from '../data/partners';
import { isCostumeCanonVerified } from '../utils/partnerStoreSettings';
import { 
  Language, 
  Currency, 
  formatPrice, 
  UI_TRANSLATIONS, 
  DESTINATIONS_DATA, 
  CULTURAL_ETIQUETTE_DATA, 
  DestinationInfo 
} from '../utils/i18n';
import { COSTUME_TRANSLATIONS } from '../data/costumeTranslations';

interface LookbookViewProps {
  onSelectForStudio: (costumeId: string) => void;
  onOpenRentalModal?: (costume: Costume) => void;
  onNavigateToGroups?: () => void;
  language?: Language;
  currency?: Currency;
  initialDestination?: string;
}

export const LookbookView: React.FC<LookbookViewProps> = ({ 
  onSelectForStudio,
  onOpenRentalModal,
  onNavigateToGroups,
  language = 'vi',
  currency = 'VND',
  initialDestination = 'all'
}) => {
  const costumes = React.useMemo(() => normalizeVN(lookbookData as Costume[]), []);
  const t = UI_TRANSLATIONS[language].lookbook;
  const tf = UI_TRANSLATIONS[language].filter;

  // Destination filter state (Huế, Hội An, Hà Nội, Văn Miếu, TP.HCM)
  const [selectedDestination, setSelectedDestination] = useState<string>(initialDestination);

  // Filter states
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // Active detail modal
  const [selectedCostume, setSelectedCostume] = useState<Costume | null>(null);

  // Web Speech state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  // Stop speech when closing modal or changing costume
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedCostume]);

  const toggleSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'en' ? 'en-US' : 'vi-VN';
      utterance.rate = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const targetVoice = voices.find(v => language === 'en' ? (v.lang.includes('en') || v.lang.includes('EN')) : (v.lang.includes('vi') || v.lang.includes('VI')));
      if (targetVoice) {
        utterance.voice = targetVoice;
      }

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Find active destination details
  const activeDestInfo = React.useMemo<DestinationInfo | undefined>(() => {
    if (selectedDestination === 'all') return undefined;
    return DESTINATIONS_DATA.find(d => d.id === selectedDestination);
  }, [selectedDestination]);

  // Filter logic
  const filteredCostumes = costumes.filter((c) => {
    // Destination filter
    if (selectedDestination !== 'all' && activeDestInfo) {
      if (!activeDestInfo.suggestedCostumeIds.includes(c.id)) {
        return false;
      }
    }

    if (selectedGroup !== 'all' && c.group !== selectedGroup) return false;
    if (selectedGender !== 'all' && c.gender !== selectedGender && c.gender !== 'unisex') return false;
    if (selectedRegion !== 'all' && c.region !== selectedRegion && c.region !== 'toan-quoc') return false;
    if (selectedPeriod !== 'all') {
      if (selectedPeriod === 'nguyen' && !c.period.includes('Nguyễn')) return false;
      if (selectedPeriod === 'le' && !c.period.includes('Lê')) return false;
      if (selectedPeriod === 'ly-tran' && !c.period.includes('Lý') && !c.period.includes('Trần')) return false;
      if (selectedPeriod === 'hien-dai' && !c.period.includes('Hiện đại') && !c.period.includes('1930')) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B8862B] font-medium mb-1">
          <CloudMotif className="w-6 h-3 text-[#B8862B]" />
          <span>{language === 'en' ? 'Living Heritage Archives' : 'Kho Lưu Trữ Di Sản'}</span>
          <CloudMotif className="w-6 h-3 text-[#B8862B] rotate-180" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A]">
          {t.title}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#4A4A4A] leading-relaxed">
          {t.subtitle}
        </p>

        {/* Nút Tạo đơn nhóm cho lớp / kỷ yếu / CLB */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => onNavigateToGroups?.()}
            className="px-4 py-2.5 bg-[#1F2A44] hover:bg-[#121A2D] text-white text-xs font-bold uppercase tracking-wider rounded flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
          >
            <Users size={16} className="text-[#D4A347]" />
            <span>{language === 'en' ? 'Create Group Order (Class / Year-end / Club)' : 'Tạo đơn nhóm (Lớp, Kỷ yếu, CLB)'}</span>
          </button>
        </div>
      </div>

      {/* REQUIREMENT 3: DESTINATION FILTER CHIPS */}
      <div className="bg-[#FAF6ED] border border-[#B8862B]/50 p-4 sm:p-5 rounded mb-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E8DEC8] mb-3 gap-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A4161A]">
            <Compass size={16} />
            <span>{tf.destinationsTitle} (Huế, Hội An, Hà Nội, Văn Miếu, TP.HCM)</span>
          </div>
          <span className="text-[11px] text-[#666]">
            {language === 'en' ? 'Click to see matching attire & nearest rental shop' : 'Bấm để xem cổ phục phù hợp & tiệm đối tác gần nhất'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedDestination('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedDestination === 'all'
                ? 'bg-[#A4161A] text-white shadow-xs'
                : 'bg-[#F6EFE3] hover:bg-[#EAE0D0] text-[#1A1A1A] border border-[#D8CEBE]'
            }`}
          >
            {tf.allDestinations}
          </button>

          {DESTINATIONS_DATA.map((dest) => {
            const isSelected = selectedDestination === dest.id;
            return (
              <button
                key={dest.id}
                onClick={() => setSelectedDestination(dest.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#A4161A] text-white shadow-xs ring-2 ring-[#A4161A]/30'
                    : 'bg-[#F6EFE3] hover:bg-[#EAE0D0] text-[#1A1A1A] border border-[#D8CEBE]'
                }`}
              >
                <MapPin size={12} className={isSelected ? 'text-[#D4A347]' : 'text-[#A4161A]'} />
                <span>{language === 'en' ? dest.nameEn : dest.nameVi}</span>
              </button>
            );
          })}
        </div>

        {/* Informative destination banner if selected */}
        {activeDestInfo && (
          <div className="mt-4 p-3.5 bg-white border border-[#D8CEBE] rounded text-xs space-y-2 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <strong className="text-[#A4161A] text-sm font-serif">
                  {language === 'en' ? activeDestInfo.nameEn : activeDestInfo.nameVi}
                </strong>
                <p className="text-[11px] text-[#555] mt-0.5">
                  {language === 'en' ? activeDestInfo.taglineEn : activeDestInfo.taglineVi}
                </p>
              </div>

              <div className="bg-[#FAF6ED] px-3 py-1.5 rounded border border-[#E8DEC8] shrink-0 text-left sm:text-right">
                <div className="text-[10px] text-[#888] uppercase font-bold">{tf.nearestStore}:</div>
                <div className="text-xs font-bold text-[#1A1A1A]">
                  {language === 'en' ? activeDestInfo.nearestStoreNameEn : activeDestInfo.nearestStoreNameVi}
                </div>
                <div className="text-[10px] text-[#2D6A4F]">
                  {language === 'en' ? activeDestInfo.storeDistanceEn : activeDestInfo.storeDistanceVi}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E8DEC8] flex items-start gap-2 text-[11px] text-[#785E23] bg-[#FFFBEB] p-2 rounded">
              <Info size={14} className="text-[#B8862B] shrink-0 mt-0.5" />
              <div>
                <strong>{tf.culturalTips}: </strong>
                <span>{language === 'en' ? activeDestInfo.etiquetteTipsEn : activeDestInfo.etiquetteTipsVi}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Bar with Standard Criteria */}
      <div className="bg-[#FAF6ED] border border-[#D8CEBE] p-4 sm:p-5 rounded mb-8 shadow-xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#E8DEC8] text-xs font-semibold uppercase tracking-wider text-[#A4161A]">
          <Filter size={14} />
          <span>{language === 'en' ? 'Historical & Demographic Filters' : 'Bộ Lọc Khảo Cứu Nâng Cao'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Filter 1: Nhóm */}
          <div>
            <label className="block text-[#666] mb-1 font-medium">{tf.group}:</label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full bg-[#F6EFE3] border border-[#CFC3B0] rounded px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#A4161A]"
            >
              <option value="all">{language === 'en' ? 'All categories' : 'Tất cả nhóm'}</option>
              <option value="cung-dinh">{language === 'en' ? 'Imperial Court & Nobility' : 'Cung đình & Quý tộc'}</option>
              <option value="quy-toc-tri-thuc">{language === 'en' ? 'Scholars & Intellectuals' : 'Sĩ phu & Trí thức'}</option>
              <option value="dan-gian">{language === 'en' ? 'Traditional Folklore' : 'Dân gian truyền thống'}</option>
              <option value="hien-dai">{language === 'en' ? 'Modern & Fusion' : 'Hiện đại & Giao thoa'}</option>
            </select>
          </div>

          {/* Filter 2: Thời kỳ */}
          <div>
            <label className="block text-[#666] mb-1 font-medium">{tf.period}:</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full bg-[#F6EFE3] border border-[#CFC3B0] rounded px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#A4161A]"
            >
              <option value="all">{language === 'en' ? 'All historical eras' : 'Tất cả thời kỳ'}</option>
              <option value="nguyen">{language === 'en' ? 'Nguyen Dynasty (1802 - 1945)' : 'Triều Nguyễn (1802 - 1945)'}</option>
              <option value="le">{language === 'en' ? 'Le Dynasty (1428 - 1789)' : 'Thời Hậu Lê (1428 - 1789)'}</option>
              <option value="ly-tran">{language === 'en' ? 'Ly - Tran Dynasties (1009 - 1400)' : 'Thời Lý - Trần (1009 - 1400)'}</option>
              <option value="hien-dai">{language === 'en' ? 'Modernity (1930 - present)' : 'Cận đại & Đương đại (1930 - nay)'}</option>
            </select>
          </div>

          {/* Filter 3: Giới tính */}
          <div>
            <label className="block text-[#666] mb-1 font-medium">{tf.gender}:</label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full bg-[#F6EFE3] border border-[#CFC3B0] rounded px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#A4161A]"
            >
              <option value="all">{language === 'en' ? 'All (Men & Women)' : 'Tất cả (Nam & Nữ)'}</option>
              <option value="nu">{tf.female}</option>
              <option value="nam">{tf.male}</option>
            </select>
          </div>

          {/* Filter 4: Vùng miền */}
          <div>
            <label className="block text-[#666] mb-1 font-medium">{language === 'en' ? 'Cultural Region:' : 'Vùng miền:'}</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-[#F6EFE3] border border-[#CFC3B0] rounded px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#A4161A]"
            >
              <option value="all">{language === 'en' ? 'Nationwide' : 'Toàn quốc'}</option>
              <option value="bac-bo">{language === 'en' ? 'Northern (Thang Long / Kinh Bac)' : 'Bắc Bộ (Thăng Long / Kinh Bắc)'}</option>
              <option value="trung-bo">{language === 'en' ? 'Central (Hue Imperial City)' : 'Trung Bộ (Huế)'}</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Reset */}
        {(selectedGroup !== 'all' || selectedPeriod !== 'all' || selectedGender !== 'all' || selectedRegion !== 'all' || selectedDestination !== 'all') && (
          <div className="mt-3 pt-2 flex justify-end">
            <button
              onClick={() => {
                setSelectedDestination('all');
                setSelectedGroup('all');
                setSelectedPeriod('all');
                setSelectedGender('all');
                setSelectedRegion('all');
              }}
              className="text-xs text-[#A4161A] hover:underline cursor-pointer font-medium"
            >
              {language === 'en' ? `Reset all filters (${filteredCostumes.length} results)` : `Xóa tất cả bộ lọc (${filteredCostumes.length} kết quả)`}
            </button>
          </div>
        )}
      </div>

      {/* Masonry / Responsive Grid */}
      {filteredCostumes.length === 0 ? (
        <div className="text-center py-16 bg-[#FAF6ED] border border-dashed border-[#D8CEBE] rounded p-6">
          <Info size={32} className="mx-auto text-[#B8862B] mb-2" />
          <p className="font-serif text-lg text-[#1A1A1A]">
            {language === 'en' ? 'No costume found matching your criteria' : 'Không tìm thấy bộ trang phục phù hợp với bộ lọc'}
          </p>
          <p className="text-xs text-[#666] mt-1">
            {language === 'en' ? 'Please try selecting another destination or historical era.' : 'Vui lòng thử điều chỉnh lại điểm đến hoặc thời kỳ khảo cứu.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCostumes.map((costume) => {
            const trans = COSTUME_TRANSLATIONS[costume.id];
            const pricing = COSTUME_PRICING[costume.id];

            return (
              <article
                key={costume.id}
                onClick={() => setSelectedCostume(costume)}
                className="group relative bg-[#FAF6ED] border border-[#D8CEBE] hover:border-[#A4161A] transition-all duration-300 overflow-hidden flex flex-col cursor-pointer shadow-xs hover:shadow-lg"
              >
                <HeritageCorner position="top-right" />
                
                {/* Costume Image Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#1F2A44]/10">
                  <img
                    src={costume.coverImage || costume.image}
                    alt={costume.alt || costume.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Badges on Image */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 bg-[#A4161A] text-white rounded-xs">
                        {language === 'en' && trans ? trans.englishPeriod : costume.groupName}
                      </span>
                      {isCostumeCanonVerified(costume.id) && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#D4A347] text-[#1A1A1A] rounded-xs shadow-xs border border-[#B8862B] flex items-center gap-0.5">
                          <Award size={10} />
                          <span>Đã kiểm định</span>
                        </span>
                      )}
                    </div>
                    {pricing && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-[#FAF6ED] text-[#A4161A] rounded-xs shadow-xs border border-[#D8CEBE]">
                        {t.rentFrom} {formatPrice(pricing.pricePerDay, currency)}/{t.perDay}
                      </span>
                    )}
                  </div>

                  {/* Bottom Overlay Title & Dynasty */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-[11px] text-[#D4A347] font-medium tracking-wider uppercase mb-0.5">
                      {language === 'en' && trans ? trans.englishPeriod : costume.period}
                    </div>
                    {/* BILINGUAL TITLE REQUIREMENT 1 */}
                    <h3 className="font-serif text-2xl font-bold tracking-normal leading-snug text-[#FAF6ED] group-hover:text-[#D4A347] transition-colors">
                      {costume.ten || costume.name}
                    </h3>
                    {trans && (
                      <div className="text-xs text-[#FAF6ED]/85 font-light italic line-clamp-1 mt-0.5">
                        "{trans.englishSubtitle}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs sm:text-sm text-[#4A4A4A] line-clamp-2 leading-relaxed">
                    {language === 'en' && trans ? trans.englishShortDesc : (costume.shortDesc || costume.boiCanhLichSu)}
                  </p>

                  {/* Metadata tags */}
                  <div className="mt-4 pt-3 border-t border-[#E8DEC8] flex items-center justify-between text-xs text-[#666]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#1A1A1A] font-medium">
                        {language === 'en' ? (costume.gender === 'nu' ? 'Female' : costume.gender === 'nam' ? 'Male' : 'Unisex') : costume.genderLabel}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{costume.regionLabel}</span>
                    </div>
                    <div className="flex items-center text-[#A4161A] font-semibold group-hover:translate-x-1 transition-transform">
                      <span>{language === 'en' ? 'View details' : 'Chi tiết'}</span>
                      <ChevronRight size={14} className="ml-0.5" />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL WITH CULTURAL ETIQUETTE (REQUIREMENT 4) */}
      {selectedCostume && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-[#F6EFE3] border border-[#B8862B] shadow-2xl rounded p-5 sm:p-8 text-left max-h-[92vh] overflow-y-auto">
            <HeritageCorner position="top-left" />
            <HeritageCorner position="top-right" />
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedCostume(null)}
              className="absolute top-4 right-4 p-2 text-[#666] hover:text-[#1A1A1A] hover:bg-black/5 rounded-full transition-colors z-20 cursor-pointer"
              aria-label="Đóng"
            >
              <X size={22} />
            </button>

            {/* Modal Body */}
            <div className="space-y-6">
              {/* Top Section: Image & Main Intro */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-5 relative aspect-[3/4] w-full rounded overflow-hidden border border-[#D8CEBE] shadow-md bg-[#1F2A44]/10">
                  <img
                    src={selectedCostume.coverImage || selectedCostume.image}
                    alt={selectedCostume.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#A4161A] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-xs">
                    {selectedCostume.dynasty}
                  </div>
                </div>

                <div className="md:col-span-7 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B8862B] font-semibold mb-1">
                      <LotusMotif size={14} />
                      <span>{selectedCostume.dynasty} · {selectedCostume.period}</span>
                    </div>

                    {/* BILINGUAL TITLE & SUBTITLE */}
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] leading-tight">
                      {selectedCostume.ten || selectedCostume.name}
                    </h2>
                    {isCostumeCanonVerified(selectedCostume.id) && (
                      <div className="mt-1.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 bg-[#D4A347] text-[#1A1A1A] rounded-xs shadow-xs border border-[#B8862B]">
                          <Award size={12} />
                          <span>Đã kiểm định điển chế</span>
                        </span>
                      </div>
                    )}
                    {COSTUME_TRANSLATIONS[selectedCostume.id] && (
                      <p className="font-serif italic text-sm sm:text-base text-[#A4161A] mt-1">
                        "{COSTUME_TRANSLATIONS[selectedCostume.id].englishSubtitle}"
                      </p>
                    )}

                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs border-y border-[#D8CEBE] py-3 text-[#4A4A4A]">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#B8862B]" />
                        <span>{language === 'en' && COSTUME_TRANSLATIONS[selectedCostume.id] ? COSTUME_TRANSLATIONS[selectedCostume.id].englishPeriod : (selectedCostume.thoiKy || selectedCostume.period)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User size={14} className="text-[#B8862B]" />
                        <span>{language === 'en' && COSTUME_TRANSLATIONS[selectedCostume.id] ? COSTUME_TRANSLATIONS[selectedCostume.id].englishWearer : (selectedCostume.nguoiMac || selectedCostume.genderLabel)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-[#B8862B]" />
                        <span>{selectedCostume.diaPhuongLienQuan?.join(', ') || selectedCostume.regionLabel}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Layers size={14} className="text-[#B8862B]" />
                        <span>Triều đại: {selectedCostume.dynasty}</span>
                      </div>
                    </div>

                    <p className="mt-4 text-xs sm:text-sm text-[#3A3A3A] leading-relaxed">
                      {language === 'en' && COSTUME_TRANSLATIONS[selectedCostume.id] 
                        ? COSTUME_TRANSLATIONS[selectedCostume.id].englishShortDesc 
                        : (selectedCostume.shortDesc || selectedCostume.boiCanhLichSu)}
                    </p>

                    {/* Bảng giá thuê & Đối tác VẬN KỲ Escrow */}
                    {COSTUME_PRICING[selectedCostume.id] && (
                      <div className="mt-4 p-3.5 bg-[#FAF6ED] border border-[#B8862B] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="text-[11px] uppercase tracking-wider text-[#B8862B] font-bold flex items-center gap-1.5">
                            <ShieldCheck size={14} className="text-[#A4161A]" />
                            <span>{language === 'en' ? 'VAN KY Escrow Protection Service' : 'Dịch vụ thuê ký quỹ bảo chứng VẬN KỲ'}</span>
                          </div>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="font-serif text-xl font-bold text-[#A4161A]">
                              {formatPrice(COSTUME_PRICING[selectedCostume.id].pricePerDay, currency)}
                            </span>
                            <span className="text-xs text-[#555]">/ {t.perDay}</span>
                            <span className="text-xs text-[#888]">
                              · {t.deposit} {formatPrice(COSTUME_PRICING[selectedCostume.id].depositPrice, currency)}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#666] mt-0.5">
                            Size: S, M, L, XL · {tf.nearestStore}: {PARTNER_STORES.find(s => s.id === COSTUME_PRICING[selectedCostume.id]?.defaultStoreId)?.name || 'Tiệm Cổ Phục Huế'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions: Nút chính "Đặt thuê bộ này", nút phụ "Phối thử tại Studio" & Nghe câu chuyện */}
                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        if (onOpenRentalModal) {
                          onOpenRentalModal(selectedCostume);
                        }
                        setSelectedCostume(null);
                      }}
                      className="flex-1 min-w-[170px] px-5 py-3.5 bg-[#A4161A] hover:bg-[#850D11] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Package size={16} className="text-[#D4A347]" />
                      <span>{t.rentNow}</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCostume(null);
                        onNavigateToGroups?.();
                      }}
                      className="px-4 py-3.5 border border-[#1F2A44] bg-[#1F2A44] hover:bg-[#121A2D] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <Users size={15} className="text-[#D4A347]" />
                      <span>{language === 'en' ? 'Group Order' : 'Thuê theo nhóm'}</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectForStudio(selectedCostume.id);
                        setSelectedCostume(null);
                      }}
                      className="px-4 py-3.5 border border-[#B8862B] bg-[#FAF6ED] hover:bg-[#E8DEC8] text-[#1A1A1A] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles size={15} className="text-[#B8862B]" />
                      <span>{t.tryInStudio}</span>
                    </button>

                    {speechSupported && (
                      <button
                        onClick={() => {
                          const trans = COSTUME_TRANSLATIONS[selectedCostume.id];
                          const narration = language === 'en' && trans
                            ? `${selectedCostume.name}. ${trans.englishHistoryContext} ${trans.englishStory}`
                            : `${selectedCostume.name}. ${selectedCostume.historyContext} ${selectedCostume.story}`;
                          toggleSpeech(narration);
                        }}
                        className={`px-4 py-3 border border-[#B8862B] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-2 cursor-pointer ${
                          isPlayingAudio
                            ? 'bg-[#B8862B] text-white'
                            : 'bg-transparent text-[#B8862B] hover:bg-[#B8862B]/10'
                        }`}
                      >
                        {isPlayingAudio ? (
                          <>
                            <VolumeX size={16} />
                            <span>{t.stopAudio}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 size={16} />
                            <span>{t.listenAudio}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* REQUIREMENT 4: DEDICATED CULTURAL ETIQUETTE BLOCK FOR FOREIGNERS & TRAVELERS */}
              {CULTURAL_ETIQUETTE_DATA[selectedCostume.id] && (
                <div className="bg-[#FFFDF7] border-2 border-[#B8862B] p-5 sm:p-6 rounded space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 text-[#A4161A] pb-2 border-b border-[#E8DEC8]">
                    <ShieldCheck size={20} className="text-[#A4161A]" />
                    <h3 className="font-serif text-lg font-bold">
                      {t.culturalEtiquette}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* DO's */}
                    <div className="bg-[#FAF6ED] p-4 rounded border border-[#E8DEC8]">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-[#2D6A4F] mb-2 flex items-center gap-1.5">
                        <Check size={16} className="text-[#2D6A4F]" />
                        <span>{t.dos}</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-[#333]">
                        {(language === 'en' ? CULTURAL_ETIQUETTE_DATA[selectedCostume.id].dosEn : CULTURAL_ETIQUETTE_DATA[selectedCostume.id].dosVi).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#2D6A4F] font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* DONT's */}
                    <div className="bg-[#FAF6ED] p-4 rounded border border-[#E8DEC8]">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-[#A4161A] mb-2 flex items-center gap-1.5">
                        <AlertTriangle size={16} className="text-[#A4161A]" />
                        <span>{t.donts}</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-[#333]">
                        {(language === 'en' ? CULTURAL_ETIQUETTE_DATA[selectedCostume.id].dontsEn : CULTURAL_ETIQUETTE_DATA[selectedCostume.id].dontsVi).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#A4161A] font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Color significance & Taboo motifs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
                    <div className="p-3 bg-[#FAF6ED] rounded border border-[#E8DEC8]">
                      <div className="font-bold text-[#B8862B] mb-1 flex items-center gap-1.5">
                        <Sparkles size={14} />
                        <span>{t.colorSignificance}</span>
                      </div>
                      <p className="text-[#4A4A4A] leading-relaxed">
                        {language === 'en' ? CULTURAL_ETIQUETTE_DATA[selectedCostume.id].colorSignificanceEn : CULTURAL_ETIQUETTE_DATA[selectedCostume.id].colorSignificanceVi}
                      </p>
                    </div>

                    <div className="p-3 bg-[#FAF6ED] rounded border border-[#E8DEC8]">
                      <div className="font-bold text-[#A4161A] mb-1 flex items-center gap-1.5">
                        <AlertCircle size={14} />
                        <span>{t.tabooMotifs}</span>
                      </div>
                      <p className="text-[#4A4A4A] leading-relaxed">
                        {language === 'en' ? CULTURAL_ETIQUETTE_DATA[selectedCostume.id].tabooMotifsEn : CULTURAL_ETIQUETTE_DATA[selectedCostume.id].tabooMotifsVi}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bối cảnh lịch sử & Câu chuyện văn hóa */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAF6ED] border border-[#D8CEBE] p-5 rounded">
                <div>
                  <h4 className="font-serif text-base font-bold text-[#A4161A] mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A4161A]" />
                    <span>{t.historyContext}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-[#3A3A3A] leading-relaxed">
                    {language === 'en' && COSTUME_TRANSLATIONS[selectedCostume.id]
                      ? COSTUME_TRANSLATIONS[selectedCostume.id].englishHistoryContext
                      : selectedCostume.historyContext}
                  </p>
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-[#A4161A] mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A4161A]" />
                    <span>{t.culturalStory}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-[#3A3A3A] leading-relaxed">
                    {language === 'en' && COSTUME_TRANSLATIONS[selectedCostume.id]
                      ? COSTUME_TRANSLATIONS[selectedCostume.id].englishStory
                      : selectedCostume.story}
                  </p>
                </div>
              </div>

              {/* Đặc điểm nhận dạng */}
              <div>
                <h4 className="font-serif text-lg font-bold text-[#1A1A1A] mb-3">
                  {t.identifyingFeatures}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(language === 'en' && COSTUME_TRANSLATIONS[selectedCostume.id]
                    ? COSTUME_TRANSLATIONS[selectedCostume.id].englishIdentifyingFeatures
                    : selectedCostume.identifyingFeatures
                  ).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-[#FAF6ED] p-3 rounded border border-[#E8DEC8] text-xs text-[#2A2A2A]">
                      <CheckCircle size={15} className="text-[#A4161A] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bảng màu truyền thống kèm ý nghĩa */}
              <div>
                <h4 className="font-serif text-lg font-bold text-[#1A1A1A] mb-3">
                  {t.traditionalPalette}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {selectedCostume.traditionalPalette.map((color, idx) => (
                    <div key={idx} className="bg-[#FAF6ED] border border-[#D8CEBE] p-3 rounded flex flex-col justify-between">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-6 h-6 rounded-full border border-black/10 shrink-0 shadow-xs"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="font-serif font-bold text-xs text-[#1A1A1A]">{color.name}</span>
                      </div>
                      <p className="text-[11px] text-[#555] leading-relaxed">
                        {color.meaning}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Người mặc, Dịp sử dụng, Phụ kiện */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-[#FAF6ED] p-4 border border-[#D8CEBE] rounded">
                  <div className="font-serif font-bold text-sm text-[#1A1A1A] mb-2 text-[#A4161A]">
                    {t.wearer}
                  </div>
                  <p className="text-[#4A4A4A] leading-relaxed">
                    {language === 'en' && COSTUME_TRANSLATIONS[selectedCostume.id]
                      ? COSTUME_TRANSLATIONS[selectedCostume.id].englishWearer
                      : selectedCostume.wearer}
                  </p>
                </div>
                <div className="bg-[#FAF6ED] p-4 border border-[#D8CEBE] rounded">
                  <div className="font-serif font-bold text-sm text-[#1A1A1A] mb-2 text-[#A4161A]">
                    {t.occasions}
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[#4A4A4A]">
                    {(language === 'en' && COSTUME_TRANSLATIONS[selectedCostume.id]
                      ? COSTUME_TRANSLATIONS[selectedCostume.id].englishOccasions
                      : selectedCostume.occasions
                    ).map((occ, idx) => (
                      <li key={idx}>{occ}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FAF6ED] p-4 border border-[#D8CEBE] rounded">
                  <div className="font-serif font-bold text-sm text-[#1A1A1A] mb-2 text-[#A4161A]">
                    {t.accessories}
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[#4A4A4A]">
                    {(selectedCostume.phuKienDiKem || selectedCostume.accessories).map((acc, idx) => (
                      <li key={idx}>{acc}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Cách phối hiện đại / Gen Z Styling Vibe */}
              {(selectedCostume.cachPhoiHienDai || (language === 'en' && COSTUME_TRANSLATIONS[selectedCostume.id]?.englishContemporaryStyling)) && (
                <div className="bg-[#F4EFE6] border border-[#CBBDA8] p-4 sm:p-5 rounded flex items-start gap-3">
                  <div className="p-2 bg-[#A4161A]/10 text-[#A4161A] rounded shrink-0 mt-0.5">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-[#A4161A] mb-1">
                      {t.contemporaryStyling}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#3A3A3A] leading-relaxed">
                      {language === 'en' && COSTUME_TRANSLATIONS[selectedCostume.id]?.englishContemporaryStyling
                        ? COSTUME_TRANSLATIONS[selectedCostume.id].englishContemporaryStyling
                        : selectedCostume.cachPhoiHienDai}
                    </p>
                  </div>
                </div>
              )}

              {/* Hộp Cảnh Báo Văn Hóa */}
              <div className="bg-[#FFFBEB] border-l-4 border-[#B8862B] p-4 sm:p-5 rounded-r">
                <div className="flex items-center gap-2 text-[#B8862B] font-bold text-sm mb-1">
                  <AlertTriangle size={18} />
                  <span>{t.culturalCaution}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#785E23] leading-relaxed">
                  {language === 'en' && COSTUME_TRANSLATIONS[selectedCostume.id]
                    ? COSTUME_TRANSLATIONS[selectedCostume.id].englishCulturalNotes
                    : (selectedCostume.luuYVanHoa || selectedCostume.culturalNotes)}
                </p>
              </div>

              {/* Nguồn tham khảo */}
              <div className="pt-2 border-t border-[#D8CEBE] text-[11px] text-[#666]">
                <span className="font-semibold text-[#1A1A1A]">{t.references}: </span>
                <span>{selectedCostume.references.join(' · ')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
