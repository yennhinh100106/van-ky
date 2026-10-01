import React from 'react';
import { VanKySeal, LotusMotif } from './TraditionalPattern';
import { NavTabType } from './Navbar';
import { Language } from '../utils/i18n';

interface FooterProps {
  onNavigate: (tab: NavTabType) => void;
  onSwitchToStore?: () => void;
  language?: Language;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSwitchToStore, language = 'vi' }) => {
  const isEn = language === 'en';

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
                {isEn ? '· Cultural Heritage Revival' : '· Phục Dựng Văn Hiến'}
              </span>
            </div>
            <p className="text-xs text-[#D8CEBE] max-w-md leading-relaxed font-light">
              {isEn
                ? 'A comprehensive platform for heritage archives, interactive styling, and secure escrow rental connecting trusted antique costume boutiques across Vietnam.'
                : 'Nền tảng tra cứu di sản, phối đồ và thuê Việt phục bảo chứng an toàn (Escrow Protection) kết nối các tiệm cổ phục uy tín toàn quốc.'}
            </p>
            <div className="text-[11px] text-[#A69B88]">
              {isEn
                ? '"Attire reflects supreme virtue · Continuing a thousand years of Dai Viet civilization"'
                : '"Y phục xứng kỳ đức · Tiếp nối ngàn năm văn hiến Đại Việt"'}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <div className="font-serif text-sm font-semibold text-[#D4A347] uppercase tracking-wider">
              {isEn ? 'Explore' : 'Khám Phá'}
            </div>
            <ul className="space-y-1.5 text-xs text-[#D8CEBE]">
              <li>
                <button onClick={() => onNavigate('lookbook')} className="hover:text-white transition-colors cursor-pointer">
                  {isEn ? 'Heritage Lookbook' : 'Lookbook Di Sản'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('studio')} className="hover:text-white transition-colors cursor-pointer">
                  {isEn ? 'Paper Doll Studio' : 'Việt Phục Studio'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('orders')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                  <span>{isEn ? 'My Rental Orders' : 'Đơn Thuê Của Tôi'}</span>
                  <span className="text-[10px] bg-[#B8862B] text-white px-1.5 py-0.2 rounded font-semibold">{isEn ? 'Escrow' : 'Ký Quỹ'}</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('groups')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                  <span>{isEn ? 'Group Orders (Yearbook/Club)' : 'Đơn Nhóm (Kỷ Yếu/CLB)'}</span>
                  <span className="text-[10px] bg-[#A4161A] text-white px-1.5 py-0.2 rounded font-semibold">{isEn ? 'Group' : 'Ưu Đãi'}</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('chat')} className="hover:text-white transition-colors cursor-pointer">
                  {isEn ? 'AI Stylist "Van"' : 'Hỏi AI Stylist "Vân"'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
                  {isEn ? 'About & Historical Sources' : 'Giới Thiệu & Nguồn Sử Liệu'}
                </button>
              </li>
              {onSwitchToStore && (
                <li className="pt-1 border-t border-[#FAF6ED]/10">
                  <button 
                    onClick={onSwitchToStore} 
                    className="text-[#D4A347] hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-semibold"
                  >
                    <span>{isEn ? 'Partner Boutique Portal' : 'Dành Cho Tiệm (Quản Lý Đơn)'}</span>
                    <span className="text-[10px] bg-[#D4A347] text-[#1F2A44] px-1.5 py-0.2 rounded font-bold">{isEn ? 'Partner' : 'Tiệm'}</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Cultural Respect Note */}
          <div className="space-y-2">
            <div className="font-serif text-sm font-semibold text-[#D4A347] uppercase tracking-wider">
              {isEn ? 'Cultural Respect' : 'Tôn Trọng Bản Sắc'}
            </div>
            <p className="text-xs text-[#D8CEBE] leading-relaxed font-light">
              {isEn
                ? 'Data surveyed from official dynastic chronicles and national museum collections. Suggestions welcome at VẬN KỲ editorial council.'
                : 'Dữ liệu được khảo sát từ các nguồn chính sử và bảo tàng di tích quốc gia. Mọi đóng góp khảo cứu xin gửi về ban biên tập văn hóa VẬN KỲ.'}
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8C9BAE] gap-2">
          <div>
            © 2026 VẬN KỲ. {isEn ? 'Dedicated to Vietnamese cultural heritage.' : 'Phát triển vì tình yêu văn hóa cổ phục Việt Nam.'}
          </div>
          <div className="flex items-center gap-4">
            <span>{isEn ? 'Crafted for museum fidelity & editorial fashion standards' : 'Thiết kế theo chuẩn bảo tàng & tạp chí thời trang'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
