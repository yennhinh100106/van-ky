import React from 'react';
import { VanKySeal, LotusMotif } from './TraditionalPattern';

interface FooterProps {
  onNavigate: (tab: 'home' | 'lookbook' | 'studio' | 'chat' | 'about') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#1F2A44] text-[#FAF6ED] border-t border-[#B8862B]/30 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#FAF6ED]/10">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-brand-custom text-2xl font-bold tracking-normal leading-tight text-[#FAF6ED]">
                VẬN KỲ
              </span>
              <span className="text-xs uppercase tracking-widest text-[#D4A347] font-medium">
                · Phục Dựng Văn Hiến
              </span>
            </div>
            <p className="text-xs text-[#D8CEBE] max-w-md leading-relaxed font-light">
              Nền tảng tra cứu di sản và phối trang phục cổ truyền Việt Nam dành cho học sinh, sinh viên và người yêu văn hóa truyền thống.
            </p>
            <div className="text-[11px] text-[#A69B88]">
              "Y phục xứng kỳ đức · Tiếp nối ngàn năm văn hiến Đại Việt"
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <div className="font-serif text-sm font-semibold text-[#D4A347] uppercase tracking-wider">
              Khám Phá
            </div>
            <ul className="space-y-1.5 text-xs text-[#D8CEBE]">
              <li>
                <button onClick={() => onNavigate('lookbook')} className="hover:text-white transition-colors cursor-pointer">
                  Lookbook Di Sản
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('studio')} className="hover:text-white transition-colors cursor-pointer">
                  Việt Phục Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('chat')} className="hover:text-white transition-colors cursor-pointer">
                  Hỏi AI Stylist "Vân"
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
                  Giới Thiệu & Nguồn Sử Liệu
                </button>
              </li>
            </ul>
          </div>

          {/* Cultural Respect Note */}
          <div className="space-y-2">
            <div className="font-serif text-sm font-semibold text-[#D4A347] uppercase tracking-wider">
              Tôn Trọng Bản Sắc
            </div>
            <p className="text-xs text-[#D8CEBE] leading-relaxed font-light">
              Dữ liệu được khảo sát từ các nguồn chính sử và bảo tàng di tích quốc gia. Mọi đóng góp khảo cứu xin gửi về ban biên tập văn hóa VẬN KỲ.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8C9BAE] gap-2">
          <div>
            © 2026 VẬN KỲ. Phát triển vì tình yêu văn hóa cổ phục Việt Nam.
          </div>
          <div className="flex items-center gap-4">
            <span>Thiết kế theo chuẩn bảo tàng & tạp chí thời trang</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
