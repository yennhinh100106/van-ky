import React from 'react';
import { BookOpen, Sparkles, Compass, MessageSquareQuote, ArrowRight } from 'lucide-react';
import { CloudMotif, HeritageCorner } from './TraditionalPattern';

interface HomeHeroProps {
  onNavigate: (tab: 'home' | 'lookbook' | 'studio' | 'chat' | 'about') => void;
  onSelectCostume?: (costumeId: string) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ onNavigate }) => {
  return (
    <div className="w-full">
      {/* 1. Full-screen Hero Section with ONE Large Editorial Image */}
      <section className="relative w-full min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-[#1F2A44]">
        {/* Background Image with Fallback */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.jpg"
            onError={(e) => {
              // Fallback to generated image asset if needed
              const target = e.currentTarget;
              target.src = '/src/assets/images/hero_vietphuc_editorial_1790255922850.jpg';
            }}
            alt="Người trẻ Việt Nam trong trang phục truyền thống Áo Nhật Bình và Áo Tấc"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Measured Dark Scrim for High Contrast Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/30" />
          <div className="absolute inset-0 bg-[#A4161A]/10 mix-blend-color" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          {/* Top Heritage Badge */}
          <div className="inline-flex items-center gap-2 mb-4 text-[#D4A347] text-xs sm:text-sm uppercase tracking-widest font-medium">
            <CloudMotif className="w-8 h-4 text-[#D4A347]" />
            <span>Di Sản · Phong Cách · Bản Sắc</span>
            <CloudMotif className="w-8 h-4 text-[#D4A347] rotate-180" />
          </div>

          {/* Giant Wordmark */}
          <h1 className="font-display-custom text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-normal text-[#FAF6ED] drop-shadow-md select-none leading-[1.18]">
            VẬN KỲ
          </h1>

          {/* Tagline */}
          <p className="mt-4 font-serif italic text-xl sm:text-2xl md:text-3xl text-[#E5D7BE] tracking-normal max-w-2xl text-balance leading-snug">
            Phối Việt phục theo cách của bạn
          </p>

          <p className="mt-3 text-sm sm:text-base text-[#D4CEBF] max-w-xl font-sans font-light leading-relaxed">
            Hồi sinh vẻ đẹp nghìn năm văn hiến Đại Việt. Khám phá chuẩn mực cổ phong, 
            trải nghiệm thử đồ tương tác và nhận tư vấn từ Cố vấn AI chuyên sâu.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('lookbook')}
              className="w-full sm:w-auto px-8 py-3.5 border border-[#D4A347]/80 text-[#FAF6ED] bg-black/30 hover:bg-[#D4A347]/20 backdrop-blur-sm text-sm font-semibold tracking-wider uppercase transition-all rounded hover:border-[#D4A347] cursor-pointer"
            >
              Khám phá Lookbook
            </button>
            <button
              onClick={() => onNavigate('studio')}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#A4161A] hover:bg-[#850D11] text-[#FAF6ED] text-sm font-semibold tracking-wider uppercase transition-all rounded shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-[#C23B3F]"
            >
              <Sparkles size={16} className="text-[#D4A347]" />
              <span>Bắt đầu phối đồ</span>
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
          <span className="text-[11px] text-[#FAF6ED] tracking-widest uppercase font-light">Cuộn để xem tính năng</span>
          <div className="w-4 h-7 border border-[#FAF6ED]/50 rounded-full flex justify-center pt-1">
            <div className="w-1 h-2 bg-[#FAF6ED] rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* 2. Four Feature Cards Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-8 z-20">
        <div className="text-center mb-10">
          <div className="text-xs uppercase tracking-widest text-[#B8862B] font-medium mb-1">
            Khám Phá Toàn Diện
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
            Bốn Trải Nghiệm Văn Hóa Độc Bản
          </h2>
          <div className="w-12 h-0.5 bg-[#A4161A] mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Lookbook */}
          <div
            onClick={() => onNavigate('lookbook')}
            className="group relative bg-[#FAF6ED] border border-[#D8CEBE] p-6 hover:border-[#A4161A] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between"
          >
            <HeritageCorner position="top-right" />
            <div>
              <div className="w-10 h-10 rounded bg-[#A4161A]/10 text-[#A4161A] flex items-center justify-center mb-4 group-hover:bg-[#A4161A] group-hover:text-white transition-colors">
                <BookOpen size={20} />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A] group-hover:text-[#A4161A] transition-colors">
                01. Lookbook Di Sản
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
                Kho lưu trữ 8+ bộ cổ phục qua các thời kỳ Lý, Trần, Lê, Nguyễn. Đầy đủ điển chế, quy chuẩn may mặc và giọng đọc câu chuyện lịch sử.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#E8DEC8] flex items-center text-xs font-semibold text-[#A4161A] group-hover:translate-x-1 transition-transform">
              <span>Xem cổ phục</span>
              <ArrowRight size={14} className="ml-1" />
            </div>
          </div>

          {/* Card 2: Phối đồ Studio */}
          <div
            onClick={() => onNavigate('studio')}
            className="group relative bg-[#FAF6ED] border border-[#D8CEBE] p-6 hover:border-[#A4161A] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between"
          >
            <HeritageCorner position="top-right" />
            <div>
              <div className="w-10 h-10 rounded bg-[#B8862B]/10 text-[#B8862B] flex items-center justify-center mb-4 group-hover:bg-[#B8862B] group-hover:text-white transition-colors">
                <Sparkles size={20} />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A] group-hover:text-[#B8862B] transition-colors">
                02. Việt Phục Studio
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
                Studio búp bê giấy tương tác nhiều lớp. Thử màu sắc truyền thống (đỏ son, xanh chàm...), phối phụ kiện và nhận thuật toán chấm điểm hài hòa.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#E8DEC8] flex items-center text-xs font-semibold text-[#B8862B] group-hover:translate-x-1 transition-transform">
              <span>Bắt đầu phối</span>
              <ArrowRight size={14} className="ml-1" />
            </div>
          </div>

          {/* Card 3: Phụ kiện */}
          <div
            onClick={() => onNavigate('studio')}
            className="group relative bg-[#FAF6ED] border border-[#D8CEBE] p-6 hover:border-[#A4161A] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between"
          >
            <HeritageCorner position="top-right" />
            <div>
              <div className="w-10 h-10 rounded bg-[#1F2A44]/10 text-[#1F2A44] flex items-center justify-center mb-4 group-hover:bg-[#1F2A44] group-hover:text-white transition-colors">
                <Compass size={20} />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A] group-hover:text-[#1F2A44] transition-colors">
                03. Kho Tàng Phụ Kiện
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
                Khăn đóng, mấn, nón quai thao, xà tích, quạt lụa, guốc mộc... Tìm hiểu nguồn gốc từng món đồ và các quy tắc tránh phạm húy, lệch giai tầng.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#E8DEC8] flex items-center text-xs font-semibold text-[#1F2A44] group-hover:translate-x-1 transition-transform">
              <span>Tra cứu phụ kiện</span>
              <ArrowRight size={14} className="ml-1" />
            </div>
          </div>

          {/* Card 4: Cố vấn AI Stylist */}
          <div
            onClick={() => onNavigate('chat')}
            className="group relative bg-[#FAF6ED] border border-[#D8CEBE] p-6 hover:border-[#A4161A] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between"
          >
            <HeritageCorner position="top-right" />
            <div>
              <div className="w-10 h-10 rounded bg-[#A4161A]/10 text-[#A4161A] flex items-center justify-center mb-4 group-hover:bg-[#A4161A] group-hover:text-white transition-colors">
                <MessageSquareQuote size={20} />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A] group-hover:text-[#A4161A] transition-colors">
                04. Hỏi AI Stylist "Vân"
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
                Trợ lý thời trang cổ phong thông minh được huấn luyện sử liệu. Giải đáp thắc mắc mặc gì đi Văn Miếu, Huế, Hội An, chụp kỷ yếu hay lễ cưới.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#E8DEC8] flex items-center text-xs font-semibold text-[#A4161A] group-hover:translate-x-1 transition-transform">
              <span>Trò chuyện cùng Vân</span>
              <ArrowRight size={14} className="ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Quote Banner */}
      <section className="bg-[#FAF6ED] border-y border-[#D8CEBE] py-10 my-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="font-serif italic text-lg sm:text-xl text-[#3A3A3A] leading-relaxed">
            "Y phục xứng kỳ đức – Mặc một tà áo cổ không chỉ là khoác lên một tấm vải, mà là tiếp nối mạch nguồn sống của một nền văn minh rực rỡ."
          </p>
          <div className="mt-3 text-xs uppercase tracking-widest text-[#B8862B] font-medium">
            Trích · Tinh thần phục dựng văn hiến Việt Nam
          </div>
        </div>
      </section>
    </div>
  );
};
