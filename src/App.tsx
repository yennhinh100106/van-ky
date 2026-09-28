/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { LookbookView } from './components/LookbookView';
import { StudioView } from './components/StudioView';
import { ChatStylist } from './components/ChatStylist';
import { AboutView } from './components/AboutView';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'lookbook' | 'studio' | 'chat' | 'about'>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['home', 'lookbook', 'studio', 'chat', 'about'].includes(tabParam)) {
        return tabParam as any;
      }
      if (params.get('costume')) {
        return 'studio';
      }
    } catch (e) {
      console.error(e);
    }
    return 'home';
  });

  const [studioCostumeId, setStudioCostumeId] = useState<string>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('costume') || 'nhat-binh';
    } catch {
      return 'nhat-binh';
    }
  });

  // Sync tab navigation with browser history
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['home', 'lookbook', 'studio', 'chat', 'about'].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }
      const costumeParam = params.get('costume');
      if (costumeParam) {
        setStudioCostumeId(costumeParam);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Trigger from Lookbook "Phối bộ này"
  const handleSelectCostumeForStudio = (costumeId: string) => {
    setStudioCostumeId(costumeId);
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trigger from AI Chat Stylist "Thử phối bộ này"
  const handleApplyOutfitFromChat = (config: {
    costumeId: string;
    colorHex?: string;
    colorName?: string;
    accessories?: string[];
  }) => {
    setStudioCostumeId(config.costumeId);
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F6EFE3] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#A4161A] selection:text-white">
      {/* Top Fixed Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {activeTab === 'home' && (
          <HomeHero
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'lookbook' && (
          <LookbookView onSelectForStudio={handleSelectCostumeForStudio} />
        )}

        {activeTab === 'studio' && (
          <StudioView initialCostumeId={studioCostumeId} />
        )}

        {activeTab === 'chat' && (
          <ChatStylist onApplyOutfitToStudio={handleApplyOutfitFromChat} />
        )}

        {activeTab === 'about' && (
          <AboutView />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />
    </div>
  );
}
