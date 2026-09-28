import React, { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { VanKySeal } from './TraditionalPattern';

interface NavbarProps {
  activeTab: 'home' | 'lookbook' | 'studio' | 'chat' | 'about';
  setActiveTab: (tab: 'home' | 'lookbook' | 'studio' | 'chat' | 'about') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: 'home' | 'lookbook' | 'studio' | 'chat' | 'about'; label: string }[] = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'lookbook', label: 'Lookbook' },
    { id: 'studio', label: 'Phối đồ' },
    { id: 'chat', label: 'Hỏi AI Stylist' },
    { id: 'about', label: 'Giới thiệu & Nguồn' },
  ];

  const handleNavClick = (id: 'home' | 'lookbook' | 'studio' | 'chat' | 'about') => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F6EFE3]/90 backdrop-blur-md border-b border-[#D8CEBE] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 text-left group focus:outline-none"
          >
            <VanKySeal size={32} />
            <div className="flex flex-col">
              <span className="font-brand-custom text-xl sm:text-2xl font-bold tracking-normal leading-tight text-[#A4161A] group-hover:text-[#780016] transition-colors">
                VẬN KỲ
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Clean 4-5 Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-normal">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`relative py-1 text-sm transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-[#A4161A] font-semibold'
                    : 'text-[#1A1A1A]/80 hover:text-[#A4161A]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A4161A] transition-all" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('studio')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#A4161A] hover:bg-[#780016] text-[#FAF6ED] text-xs font-semibold uppercase tracking-wider rounded transition-colors shadow-sm whitespace-nowrap cursor-pointer"
          >
            <Sparkles size={14} className="text-[#D4A347]" />
            <span>Phối đồ ngay</span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#1A1A1A] hover:text-[#A4161A] focus:outline-none"
            aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F6EFE3] border-b border-[#D8CEBE] px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3">
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
                  <span>{link.label}</span>
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
                <span>Bắt đầu phối đồ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
