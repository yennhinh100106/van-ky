import React, { useState } from 'react';
import { Menu, X, Sparkles, Globe, DollarSign, Store } from 'lucide-react';
import { VanKySeal } from './TraditionalPattern';
import { Language, Currency, UI_TRANSLATIONS } from '../utils/i18n';
import { PARTNER_STORES } from '../data/partners';

export type NavTabType = 'home' | 'lookbook' | 'studio' | 'orders' | 'groups' | 'chat' | 'about';

interface NavbarProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  activeOrdersCount?: number;
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  viewMode?: 'customer' | 'store';
  onViewModeChange?: (mode: 'customer' | 'store') => void;
  currentStoreId?: string;
  onSelectStore?: (storeId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  activeOrdersCount = 0,
  language,
  setLanguage,
  currency,
  setCurrency,
  viewMode = 'customer',
  onViewModeChange,
  currentStoreId = 'store-hue',
  onSelectStore
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = UI_TRANSLATIONS[language].nav;

  const navLinks: { id: NavTabType; label: string; badge?: number }[] = [
    { id: 'home', label: t.home },
    { id: 'lookbook', label: t.lookbook },
    { id: 'studio', label: t.studio },
    { id: 'orders', label: t.orders, badge: activeOrdersCount > 0 ? activeOrdersCount : undefined },
    { id: 'groups', label: t.group },
    { id: 'chat', label: t.chat },
    { id: 'about', label: t.about },
  ];

  const handleNavClick = (id: NavTabType) => {
    if (viewMode === 'store' && onViewModeChange) {
      onViewModeChange('customer');
    }
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F6EFE3]/95 backdrop-blur-md border-b border-[#D8CEBE] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 text-left group focus:outline-none cursor-pointer"
          >
            <VanKySeal size={32} />
            <div className="flex flex-col">
              <span className="font-brand-custom text-xl sm:text-2xl font-bold tracking-normal leading-tight text-[#A4161A] group-hover:text-[#780016] transition-colors">
                {t.brand}
              </span>
              <span className="text-[9px] tracking-widest uppercase text-[#B8862B] font-medium hidden sm:inline">
                {t.tagline}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-3 xl:space-x-5 text-xs xl:text-sm font-medium tracking-normal">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`relative py-1 text-xs xl:text-sm transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'text-[#A4161A] font-bold'
                    : 'text-[#1A1A1A]/80 hover:text-[#A4161A]'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#A4161A] text-white">
                    {link.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A4161A] transition-all" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Switchers & Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Mode Switcher: Khách / Tiệm */}
          <div className="flex items-center bg-[#FAF6ED] border border-[#B8862B] rounded p-0.5 text-xs shadow-2xs">
            <button
              onClick={() => onViewModeChange?.('customer')}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                viewMode === 'customer'
                  ? 'bg-[#A4161A] text-white shadow-2xs'
                  : 'text-[#666] hover:text-[#1A1A1A]'
              }`}
              title="Chế độ người dùng tìm và đặt thuê"
            >
              Khách
            </button>
            <button
              onClick={() => onViewModeChange?.('store')}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'store'
                  ? 'bg-[#1F2A44] text-white shadow-2xs'
                  : 'text-[#666] hover:text-[#1A1A1A]'
              }`}
              title="Chuyển sang Cổng Quản lý Dành cho Tiệm"
            >
              <Store size={11} className={viewMode === 'store' ? 'text-[#D4A347]' : 'text-[#888]'} />
              <span>Tiệm</span>
            </button>
          </div>

          {/* Quick Store Selector when in Store Mode */}
          {viewMode === 'store' && onSelectStore && (
            <div className="hidden xl:flex items-center bg-white border border-[#B8862B] rounded px-2 py-0.5 text-xs shadow-2xs">
              <span className="text-[10px] font-bold text-[#888] uppercase mr-1">Tiệm:</span>
              <select
                value={currentStoreId}
                onChange={(e) => onSelectStore(e.target.value)}
                className="bg-transparent text-xs font-bold text-[#A4161A] focus:outline-none cursor-pointer pr-1"
              >
                {PARTNER_STORES.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.cityName}: {s.name.split('-')[0].trim()}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Language Switcher VI / EN */}
          <div className="flex items-center bg-[#FAF6ED] border border-[#D8CEBE] rounded p-0.5 text-xs shadow-2xs">
            <button
              onClick={() => setLanguage('vi')}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                language === 'vi'
                  ? 'bg-[#A4161A] text-white shadow-2xs'
                  : 'text-[#666] hover:text-[#1A1A1A]'
              }`}
              title="Chuyển sang Tiếng Việt"
            >
              VI
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                language === 'en'
                  ? 'bg-[#A4161A] text-white shadow-2xs'
                  : 'text-[#666] hover:text-[#1A1A1A]'
              }`}
              title="Switch to English"
            >
              <Globe size={11} className={language === 'en' ? 'text-[#FAF6ED]' : 'text-[#888]'} />
              <span>EN</span>
            </button>
          </div>

          {/* Currency Switcher VNĐ / USD */}
          <div className="flex items-center bg-[#FAF6ED] border border-[#D8CEBE] rounded p-0.5 text-xs shadow-2xs">
            <button
              onClick={() => setCurrency('VND')}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                currency === 'VND'
                  ? 'bg-[#1F2A44] text-white shadow-2xs'
                  : 'text-[#666] hover:text-[#1A1A1A]'
              }`}
              title="Hiển thị giá tiền đồng (VNĐ)"
            >
              đ
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-0.5 ${
                currency === 'USD'
                  ? 'bg-[#1F2A44] text-white shadow-2xs'
                  : 'text-[#666] hover:text-[#1A1A1A]'
              }`}
              title="Display price in US Dollars (USD)"
            >
              <DollarSign size={11} />
              <span>USD</span>
            </button>
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => handleNavClick('studio')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#A4161A] hover:bg-[#780016] text-[#FAF6ED] text-xs font-semibold uppercase tracking-wider rounded transition-colors shadow-xs whitespace-nowrap cursor-pointer"
          >
            <Sparkles size={13} className="text-[#D4A347]" />
            <span>{t.tryStudio}</span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#1A1A1A] hover:text-[#A4161A] focus:outline-none cursor-pointer"
            aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F6EFE3] border-b border-[#D8CEBE] px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2">
            {/* Mobile Switchers Bar */}
            <div className="flex flex-col gap-2 pb-3 border-b border-[#D8CEBE] mb-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1A1A1A]">Chế độ giao diện:</span>
                <div className="flex items-center bg-[#FAF6ED] border border-[#B8862B] rounded p-0.5 text-xs">
                  <button
                    onClick={() => {
                      onViewModeChange?.('customer');
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-1 rounded text-xs font-bold ${viewMode === 'customer' ? 'bg-[#A4161A] text-white' : 'text-[#666]'}`}
                  >
                    Khách hàng
                  </button>
                  <button
                    onClick={() => {
                      onViewModeChange?.('store');
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 ${viewMode === 'store' ? 'bg-[#1F2A44] text-white' : 'text-[#666]'}`}
                  >
                    <Store size={12} className="text-[#D4A347]" />
                    <span>Dành cho Tiệm</span>
                  </button>
                </div>
              </div>

              {viewMode === 'store' && onSelectStore && (
                <div className="flex items-center justify-between bg-white p-2 rounded border border-[#B8862B]">
                  <span className="text-[11px] font-bold text-[#777]">Chọn tiệm:</span>
                  <select
                    value={currentStoreId}
                    onChange={(e) => onSelectStore(e.target.value)}
                    className="bg-transparent text-xs font-bold text-[#A4161A] focus:outline-none cursor-pointer"
                  >
                    {PARTNER_STORES.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.cityName}: {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#666]">
                  {language === 'vi' ? 'Ngôn ngữ & Tiền tệ' : 'Language & Currency'}:
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#FAF6ED] border border-[#D8CEBE] rounded p-0.5 text-xs">
                    <button
                      onClick={() => setLanguage('vi')}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${language === 'vi' ? 'bg-[#A4161A] text-white' : 'text-[#666]'}`}
                    >
                      VI
                    </button>
                    <button
                      onClick={() => setLanguage('en')}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${language === 'en' ? 'bg-[#A4161A] text-white' : 'text-[#666]'}`}
                    >
                      EN
                    </button>
                  </div>
                  <div className="flex items-center bg-[#FAF6ED] border border-[#D8CEBE] rounded p-0.5 text-xs">
                    <button
                      onClick={() => setCurrency('VND')}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${currency === 'VND' ? 'bg-[#1F2A44] text-white' : 'text-[#666]'}`}
                    >
                      VNĐ
                    </button>
                    <button
                      onClick={() => setCurrency('USD')}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${currency === 'USD' ? 'bg-[#1F2A44] text-white' : 'text-[#666]'}`}
                    >
                      USD
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center justify-between text-left py-2.5 px-3 text-sm rounded ${
                    isActive
                      ? 'bg-[#A4161A]/10 text-[#A4161A] font-semibold'
                      : 'text-[#1A1A1A] hover:bg-[#EAE0D0]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#A4161A] text-white">
                        {link.badge}
                      </span>
                    )}
                  </div>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#A4161A]" />}
                </button>
              );
            })}
            <div className="pt-2">
              <button
                onClick={() => handleNavClick('studio')}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#A4161A] text-white text-xs font-semibold uppercase tracking-wider rounded shadow-sm"
              >
                <Sparkles size={15} className="text-[#D4A347]" />
                <span>{t.tryStudio}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

