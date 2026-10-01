/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, NavTabType } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { LookbookView } from './components/LookbookView';
import { StudioView } from './components/StudioView';
import { MyOrdersView } from './components/MyOrdersView';
import { GroupOrderView } from './components/GroupOrderView';
import { ChatStylist } from './components/ChatStylist';
import { AboutView } from './components/AboutView';
import { Footer } from './components/Footer';
import { RentalBookingModal } from './components/RentalBookingModal';
import { StoreDashboardView } from './components/StoreDashboardView';
import { Costume } from './types/lookbook';
import { RentalOrder } from './types/rental';
import { getStoredOrders } from './utils/orderStorage';
import { Language, Currency } from './utils/i18n';

export default function App() {
  const [language, setLanguage] = useState<Language>('vi');
  const [currency, setCurrency] = useState<Currency>('VND');

  // Customer view mode vs Partner Store Dashboard mode
  const [viewMode, setViewMode] = useState<'customer' | 'store'>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get('mode') || params.get('view');
      if (modeParam === 'store') {
        return 'store';
      }
    } catch (e) {
      console.error(e);
    }
    return 'customer';
  });

  // Current selected partner store for store dashboard
  const [currentStoreId, setCurrentStoreId] = useState<string>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const storeParam = params.get('store');
      if (storeParam && ['store-hue', 'store-hanoi', 'store-hoian', 'store-hcm'].includes(storeParam)) {
        return storeParam;
      }
    } catch (e) {
      console.error(e);
    }
    return 'store-hue';
  });

  const [activeTab, setActiveTab] = useState<NavTabType>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['home', 'lookbook', 'studio', 'orders', 'groups', 'chat', 'about'].includes(tabParam)) {
        return tabParam as NavTabType;
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

  // Track active orders count for Navbar badge
  const [activeOrdersCount, setActiveOrdersCount] = useState<number>(() => {
    try {
      const orders = getStoredOrders();
      return orders.filter(o => o.status !== 'hoan-coc').length;
    } catch {
      return 0;
    }
  });

  // Rental Booking Modal state
  const [isRentalModalOpen, setIsRentalModalOpen] = useState<boolean>(false);
  const [rentalCostume, setRentalCostume] = useState<Costume | null>(null);
  const [rentalColorName, setRentalColorName] = useState<string | undefined>(undefined);
  const [rentalColorHex, setRentalColorHex] = useState<string | undefined>(undefined);
  const [rentalAccessories, setRentalAccessories] = useState<string[] | undefined>(undefined);

  const refreshActiveOrdersCount = useCallback(() => {
    try {
      const orders = getStoredOrders();
      setActiveOrdersCount(orders.filter(o => o.status !== 'hoan-coc').length);
    } catch {
      setActiveOrdersCount(0);
    }
  }, []);

  // Sync tab navigation with browser history
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get('mode') || params.get('view');
      if (modeParam === 'store') {
        setViewMode('store');
      } else if (modeParam === 'customer') {
        setViewMode('customer');
      }

      const storeParam = params.get('store');
      if (storeParam && ['store-hue', 'store-hanoi', 'store-hoian', 'store-hcm'].includes(storeParam)) {
        setCurrentStoreId(storeParam);
      }

      const tabParam = params.get('tab');
      if (tabParam && ['home', 'lookbook', 'studio', 'orders', 'groups', 'chat', 'about'].includes(tabParam)) {
        setActiveTab(tabParam as NavTabType);
      }
      const costumeParam = params.get('costume');
      if (costumeParam) {
        setStudioCostumeId(costumeParam);
      }
      refreshActiveOrdersCount();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [refreshActiveOrdersCount]);

  // Open rental modal from Lookbook or Studio
  const handleOpenRentalModal = (
    costume: Costume,
    colorName?: string,
    colorHex?: string,
    accessories?: string[]
  ) => {
    setRentalCostume(costume);
    setRentalColorName(colorName);
    setRentalColorHex(colorHex);
    setRentalAccessories(accessories);
    setIsRentalModalOpen(true);
  };

  // On booking success from modal
  const handleBookingSuccess = (_order: RentalOrder) => {
    setIsRentalModalOpen(false);
    refreshActiveOrdersCount();
    setViewMode('customer');
    setActiveTab('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trigger from Lookbook "Phối bộ này"
  const handleSelectCostumeForStudio = (costumeId: string) => {
    setStudioCostumeId(costumeId);
    setViewMode('customer');
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
    setViewMode('customer');
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F6EFE3] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#A4161A] selection:text-white">
      {/* Top Fixed Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setViewMode('customer');
          setActiveTab(tab);
        }} 
        activeOrdersCount={activeOrdersCount} 
        language={language}
        setLanguage={setLanguage}
        currency={currency}
        setCurrency={setCurrency}
        viewMode={viewMode}
        onViewModeChange={(mode) => {
          setViewMode(mode);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentStoreId={currentStoreId}
        onSelectStore={setCurrentStoreId}
      />

      {/* Main Content Area: Customer Mode vs Store Partner Dashboard Mode */}
      <main className="flex-1 w-full">
        {viewMode === 'store' ? (
          <StoreDashboardView 
            currentStoreId={currentStoreId}
            onSelectStore={setCurrentStoreId}
            onSwitchToCustomer={() => {
              setViewMode('customer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            language={language}
            currency={currency}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeHero
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                language={language}
              />
            )}

            {activeTab === 'lookbook' && (
              <LookbookView 
                onSelectForStudio={handleSelectCostumeForStudio}
                onOpenRentalModal={handleOpenRentalModal}
                onNavigateToGroups={() => {
                  setActiveTab('groups');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                language={language}
                currency={currency}
              />
            )}

            {activeTab === 'studio' && (
              <StudioView 
                initialCostumeId={studioCostumeId} 
                onOpenRentalModal={handleOpenRentalModal}
                onNavigateToGroups={() => {
                  setActiveTab('groups');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                language={language}
                currency={currency}
              />
            )}

            {activeTab === 'orders' && (
              <MyOrdersView 
                onNavigateToLookbook={() => {
                  setActiveTab('lookbook');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToStudio={(costumeId) => handleSelectCostumeForStudio(costumeId)}
                onSwitchToStore={() => {
                  setViewMode('store');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                language={language}
                currency={currency}
              />
            )}

            {activeTab === 'groups' && (
              <GroupOrderView
                onNavigateToOrders={() => {
                  setActiveTab('orders');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToLookbook={() => {
                  setActiveTab('lookbook');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                language={language}
                currency={currency}
              />
            )}

            {activeTab === 'chat' && (
              <ChatStylist 
                onApplyOutfitToStudio={handleApplyOutfitFromChat} 
                language={language}
              />
            )}

            {activeTab === 'about' && (
              <AboutView language={language} />
            )}
          </>
        )}
      </main>

      {/* Global Rental Booking Modal */}
      {isRentalModalOpen && rentalCostume && (
        <RentalBookingModal
          costume={rentalCostume}
          selectedColorName={rentalColorName}
          selectedColorHex={rentalColorHex}
          selectedAccessories={rentalAccessories}
          isOpen={isRentalModalOpen}
          onClose={() => setIsRentalModalOpen(false)}
          onBookingSuccess={handleBookingSuccess}
          language={language}
          currency={currency}
        />
      )}

      {/* Global Footer */}
      <Footer 
        onNavigate={(tab) => {
          setViewMode('customer');
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
        onSwitchToStore={() => {
          setViewMode('store');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={language}
      />
    </div>
  );
}
