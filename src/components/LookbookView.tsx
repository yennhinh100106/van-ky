import React, { useState, useEffect } from 'react';
import { 
  Filter, Volume2, VolumeX, Sparkles, AlertTriangle, BookCheck, 
  X, CheckCircle, Info, ChevronRight, Layers, MapPin, Calendar, User
} from 'lucide-react';
import lookbookData from '../data/lookbook.json';
import { Costume } from '../types/lookbook';
import { HeritageCorner, CloudMotif, LotusMotif } from './TraditionalPattern';
import { normalizeVN } from '../utils/unicode';

interface LookbookViewProps {
  onSelectForStudio: (costumeId: string) => void;
}

export const LookbookView: React.FC<LookbookViewProps> = ({ onSelectForStudio }) => {
  const costumes = React.useMemo(() => normalizeVN(lookbookData as Costume[]), []);

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
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find(v => v.lang.includes('vi') || v.lang.includes('VI'));
      if (viVoice) {
        utterance.voice = viVoice;
      }

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Filter logic
  const filteredCostumes = costumes.filter((c) => {
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
          <span>Kho Lưu Trữ Di Sản</span>
          <CloudMotif className="w-6 h-3 text-[#B8862B] rotate-180" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A]">
          Lookbook Việt Phục
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#4A4A4A] leading-relaxed">
          Khám phá chuẩn phục Việt qua từng triều đại và vùng miền. Mỗi tà áo là một pho sử liệu sống động chứa đựng nhân sinh quan và bản sắc Đại Việt.
        </p>
      </div>

      {/* Filter Bar with Functional Buttons */}
      <div className="bg-[#FAF6ED] border border-[#D8CEBE] p-4 sm:p-5 rounded mb-8 shadow-xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#E8DEC8] text-xs font-semibold uppercase tracking-wider text-[#A4161A]">
          <Filter size={14} />
          <span>Bộ Lọc Khảo Cứu</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Filter 1: Nhóm */}
          <div>
            <label className="block text-[#666] mb-1 font-medium">Nhóm trang phục:</label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full bg-[#F6EFE3] border border-[#CFC3B0] rounded px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#A4161A]"
            >
              <option value="all">Tất cả nhóm</option>
              <option value="cung-dinh">Cung đình & Quý tộc</option>
              <option value="quy-toc-tri-thuc">Sĩ phu & Trí thức</option>
              <option value="dan-gian">Dân gian truyền thống</option>
              <option value="hien-dai">Hiện đại & Giao thoa</option>
            </select>
          </div>

          {/* Filter 2: Thời kỳ */}
          <div>
            <label className="block text-[#666] mb-1 font-medium">Thời kỳ / Triều đại:</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full bg-[#F6EFE3] border border-[#CFC3B0] rounded px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#A4161A]"
            >
              <option value="all">Tất cả thời kỳ</option>
              <option value="nguyen">Triều Nguyễn (1802 - 1945)</option>
              <option value="le">Thời Hậu Lê (1428 - 1789)</option>
              <option value="ly-tran">Thời Lý - Trần (1009 - 1400)</option>
              <option value="hien-dai">Cận đại & Đương đại (1930 - nay)</option>
            </select>
          </div>

          {/* Filter 3: Giới tính */}
          <div>
            <label className="block text-[#666] mb-1 font-medium">Đối tượng mặc:</label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full bg-[#F6EFE3] border border-[#CFC3B0] rounded px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#A4161A]"
            >
              <option value="all">Tất cả (Nam & Nữ)</option>
              <option value="nu">Nữ phục</option>
              <option value="nam">Nam phục</option>
            </select>
          </div>

          {/* Filter 4: Vùng miền */}
          <div>
            <label className="block text-[#666] mb-1 font-medium">Vùng miền:</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-[#F6EFE3] border border-[#CFC3B0] rounded px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#A4161A]"
            >
              <option value="all">Toàn quốc</option>
              <option value="bac-bo">Bắc Bộ (Thăng Long / Kinh Bắc)</option>
              <option value="trung-bo">Trung Bộ (Huế)</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Reset */}
        {(selectedGroup !== 'all' || selectedPeriod !== 'all' || selectedGender !== 'all' || selectedRegion !== 'all') && (
          <div className="mt-3 pt-2 flex justify-end">
            <button
              onClick={() => {
                setSelectedGroup('all');
                setSelectedPeriod('all');
                setSelectedGender('all');
                setSelectedRegion('all');
              }}
              className="text-xs text-[#A4161A] hover:underline cursor-pointer font-medium"
            >
              Xóa tất cả bộ lọc ({filteredCostumes.length} kết quả)
            </button>
          </div>
        )}
      </div>

      {/* Masonry / Responsive Grid */}
      {filteredCostumes.length === 0 ? (
        <div className="text-center py-16 bg-[#FAF6ED] border border-dashed border-[#D8CEBE] rounded p-6">
          <Info size={32} className="mx-auto text-[#B8862B] mb-2" />
          <p className="font-serif text-lg text-[#1A1A1A]">Không tìm thấy bộ trang phục phù hợp với bộ lọc</p>
          <p className="text-xs text-[#666] mt-1">Vui lòng thử điều chỉnh lại nhóm trang phục hoặc thời kỳ khảo cứu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCostumes.map((costume) => (
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
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 bg-[#A4161A] text-white rounded-xs">
                    {costume.groupName}
                  </span>
                </div>

                {/* Bottom Overlay Title & Dynasty */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-[11px] text-[#D4A347] font-medium tracking-wider uppercase mb-0.5">
                    {costume.period}
                  </div>
                  <h3 className="font-serif text-2xl font-bold tracking-normal leading-snug text-[#FAF6ED] group-hover:text-[#D4A347] transition-colors">
                    {costume.name}
                  </h3>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-[#4A4A4A] line-clamp-2 leading-relaxed">
                  {costume.shortDesc}
                </p>

                {/* Metadata tags (unboxed text with separators per design rules) */}
                <div className="mt-4 pt-3 border-t border-[#E8DEC8] flex items-center justify-between text-xs text-[#666]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#1A1A1A] font-medium">{costume.genderLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{costume.regionLabel}</span>
                  </div>
                  <div className="flex items-center text-[#A4161A] font-semibold group-hover:translate-x-1 transition-transform">
                    <span>Chi tiết</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Full-Screen / Expanded Detail Modal */}
      {selectedCostume && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-[#F6EFE3] border border-[#B8862B] shadow-2xl rounded overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Top Bar */}
            <div className="sticky top-0 z-20 flex items-center justify-between bg-[#F6EFE3] px-6 py-4 border-b border-[#D8CEBE]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#B8862B] uppercase tracking-wider">
                <LotusMotif size={16} className="text-[#A4161A]" />
                <span>Khảo cứu chi tiết di sản</span>
              </div>
              <button
                onClick={() => setSelectedCostume(null)}
                className="p-1.5 text-[#1A1A1A] hover:text-[#A4161A] hover:bg-[#E8DEC8] rounded-full transition-colors cursor-pointer"
                aria-label="Đóng"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
              {/* Top Banner with Image and Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="relative aspect-[3/4] w-full rounded overflow-hidden shadow-md bg-stone-900 border border-[#D8CEBE]">
                  <img
                    src={selectedCostume.image}
                    alt={selectedCostume.alt || selectedCostume.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs p-2 rounded text-[11px] text-[#FAF6ED] text-center">
                    Hình ảnh hiện vật phục dựng · Bản quyền tư liệu VẬN KỲ
                  </div>
                </div>

                <div className="flex flex-col justify-between h-full space-y-4">
                  <div>
                    {/* Certainty Level Badge */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1F2A44]/10 border border-[#1F2A44]/20 rounded text-xs font-medium text-[#1F2A44]">
                        <BookCheck size={14} className="text-[#1F2A44]" />
                        <span>Mức độ xác thực: {selectedCostume.certaintyLevel || selectedCostume.mucDoChacChan}</span>
                      </div>
                      {selectedCostume.tenKhac && (
                        <span className="text-xs text-[#7A6B58] bg-[#EAE2D4] px-2 py-0.5 rounded">
                          Tên khác: <strong className="text-[#1A1A1A]">{selectedCostume.tenKhac}</strong>
                        </span>
                      )}
                    </div>

                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] leading-tight">
                      {selectedCostume.ten || selectedCostume.name}
                    </h2>
                    <p className="font-serif italic text-sm text-[#A4161A] mt-0.5">
                      {selectedCostume.nhomTrangPhuc ? `Nhóm: ${selectedCostume.nhomTrangPhuc}` : selectedCostume.groupName}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs border-y border-[#D8CEBE] py-3 text-[#4A4A4A]">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#B8862B]" />
                        <span>{selectedCostume.thoiKy || selectedCostume.period}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User size={14} className="text-[#B8862B]" />
                        <span>{selectedCostume.nguoiMac || selectedCostume.genderLabel}</span>
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
                      {selectedCostume.shortDesc || selectedCostume.boiCanhLichSu}
                    </p>
                  </div>

                  {/* Actions: Phối bộ này & Nghe câu chuyện */}
                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        onSelectForStudio(selectedCostume.id);
                        setSelectedCostume(null);
                      }}
                      className="flex-1 min-w-[160px] px-5 py-3 bg-[#A4161A] hover:bg-[#850D11] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles size={16} className="text-[#D4A347]" />
                      <span>Phối bộ này tại Studio</span>
                    </button>

                    {speechSupported && (
                      <button
                        onClick={() => toggleSpeech(`${selectedCostume.name}. ${selectedCostume.historyContext} ${selectedCostume.story}`)}
                        className={`px-4 py-3 border border-[#B8862B] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-2 cursor-pointer ${
                          isPlayingAudio
                            ? 'bg-[#B8862B] text-white'
                            : 'bg-transparent text-[#B8862B] hover:bg-[#B8862B]/10'
                        }`}
                      >
                        {isPlayingAudio ? (
                          <>
                            <VolumeX size={16} />
                            <span>Dừng đọc</span>
                          </>
                        ) : (
                          <>
                            <Volume2 size={16} />
                            <span>Nghe câu chuyện</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Bối cảnh lịch sử & Câu chuyện văn hóa */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAF6ED] border border-[#D8CEBE] p-5 rounded">
                <div>
                  <h4 className="font-serif text-base font-bold text-[#A4161A] mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A4161A]" />
                    Bối Cảnh Lịch Sử & Điển Chế
                  </h4>
                  <p className="text-xs sm:text-sm text-[#3A3A3A] leading-relaxed">
                    {selectedCostume.historyContext}
                  </p>
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-[#A4161A] mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A4161A]" />
                    Câu Chuyện & Ý Niệm Văn Hóa
                  </h4>
                  <p className="text-xs sm:text-sm text-[#3A3A3A] leading-relaxed">
                    {selectedCostume.story}
                  </p>
                </div>
              </div>

              {/* Đặc điểm nhận dạng */}
              <div>
                <h4 className="font-serif text-lg font-bold text-[#1A1A1A] mb-3">
                  Đặc Điểm Nhận Dạng Quy Chuẩn
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedCostume.identifyingFeatures.map((feat, idx) => (
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
                  Bảng Màu Truyền Thống & Ý Nghĩa Ngũ Hành
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
                    Người Sử Dụng
                  </div>
                  <p className="text-[#4A4A4A] leading-relaxed">{selectedCostume.wearer}</p>
                </div>
                <div className="bg-[#FAF6ED] p-4 border border-[#D8CEBE] rounded">
                  <div className="font-serif font-bold text-sm text-[#1A1A1A] mb-2 text-[#A4161A]">
                    Dịp Sử Dụng
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[#4A4A4A]">
                    {selectedCostume.occasions.map((occ, idx) => (
                      <li key={idx}>{occ}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FAF6ED] p-4 border border-[#D8CEBE] rounded">
                  <div className="font-serif font-bold text-sm text-[#1A1A1A] mb-2 text-[#A4161A]">
                    Phụ Kiện Đi Kèm
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[#4A4A4A]">
                    {(selectedCostume.phuKienDiKem || selectedCostume.accessories).map((acc, idx) => (
                      <li key={idx}>{acc}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Cách phối hiện đại / Gen Z Styling Vibe */}
              {selectedCostume.cachPhoiHienDai && (
                <div className="bg-[#F4EFE6] border border-[#CBBDA8] p-4 sm:p-5 rounded flex items-start gap-3">
                  <div className="p-2 bg-[#A4161A]/10 text-[#A4161A] rounded shrink-0 mt-0.5">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-[#A4161A] mb-1">
                      Gợi Ý Phối Đồ Hiện Đại (Gen Z / Contemporary Styling)
                    </h4>
                    <p className="text-xs sm:text-sm text-[#3A3A3A] leading-relaxed">
                      {selectedCostume.cachPhoiHienDai}
                    </p>
                  </div>
                </div>
              )}

              {/* Hộp Cảnh Báo Văn Hóa (Màu vàng theo yêu cầu) */}
              <div className="bg-[#FFFBEB] border-l-4 border-[#B8862B] p-4 sm:p-5 rounded-r">
                <div className="flex items-center gap-2 text-[#B8862B] font-bold text-sm mb-1">
                  <AlertTriangle size={18} />
                  <span>Lưu Ý Văn Hóa & Tôn Trọng Điển Chế</span>
                </div>
                <p className="text-xs sm:text-sm text-[#785E23] leading-relaxed">
                  {selectedCostume.luuYVanHoa || selectedCostume.culturalNotes}
                </p>
              </div>

              {/* Ghi chú tranh luận học thuật / Khảo dị */}
              {selectedCostume.ghiChuTranhLuan && (
                <div className="bg-[#FAF6ED] border border-[#D8CEBE] p-4 rounded text-xs text-[#555] flex items-start gap-2.5">
                  <Info size={16} className="text-[#1F2A44] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#1A1A1A] block font-serif text-xs mb-0.5">
                      Góc Khảo Dị & Nghiên Cứu Lịch Sử:
                    </strong>
                    <p className="leading-relaxed">{selectedCostume.ghiChuTranhLuan}</p>
                  </div>
                </div>
              )}

              {/* Nguồn tham khảo */}
              <div className="pt-2 border-t border-[#D8CEBE] text-[11px] text-[#666]">
                <span className="font-semibold text-[#1A1A1A]">Nguồn sử liệu tham chiếu: </span>
                <span>{selectedCostume.references.join(' · ')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
