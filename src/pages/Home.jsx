import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categoriesData } from '../data/categoriesData';

// All Category Components
import GiftHampers from '../data/giftHampers';
import MetalHampers from '../data/metalHampers';
import FestivalHampers from '../data/festivalHampers';
import WeddingHampers from '../data/weddingHampers';
import CorporateHampers from '../data/corporateHampers';
import OccasionsHampers from '../data/occasionsHampers';

import MobileHeader from '../components/mobile/MobileHeader';
import MobileHomeView from '../components/mobile/MobileHomeView';
import DesktopHeader from '../components/desktop/DesktopHeader';
import DesktopHomeView from '../components/desktop/DesktopHomeView';

export default function Home() {
  const [searchParams] = useSearchParams();
  const catFromUrl = searchParams.get('cat');

  // Default tab URL ke hisaab se ya 'all'
  const [activeTab, setActiveTab] = useState(catFromUrl || 'all');

  // 👈 FIX: Har bar URL change hone par activeTab ko properly sync karein
  useEffect(() => {
    setActiveTab(catFromUrl || 'all');
  }, [catFromUrl]);

  const currentCategoryData = categoriesData[activeTab] || categoriesData['all'];

  // Helper function to render specific category view
  const renderCategoryContent = () => {
    switch (activeTab) {
      case 'gift':
        return <GiftHampers />;
      case 'metal':
        return <MetalHampers />;
      case 'festival':
        return <FestivalHampers />;
      case 'wedding':
        return <WeddingHampers />;
      case 'corporate':
        return <CorporateHampers />;
      case 'occasions':
        return <OccasionsHampers />;
      default:
        return null;
    }
  };

  const isCustomCategory = ['gift', 'metal', 'festival', 'wedding', 'corporate', 'occasions'].includes(activeTab);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      
      {/* ================= MOBILE VIEW ONLY ================= */}
      <div className="block md:hidden">
        <MobileHeader 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          categoriesData={categoriesData}
          currentCategoryData={currentCategoryData}
        />
        {isCustomCategory ? (
          renderCategoryContent()
        ) : (
          <MobileHomeView currentCategoryData={currentCategoryData} />
        )}
      </div>

      {/* ================= DESKTOP VIEW ONLY ================= */}
      <div className="hidden md:block">
        <DesktopHeader />
        {isCustomCategory ? (
          <div className="max-w-7xl mx-auto py-6">
            {renderCategoryContent()}
          </div>
        ) : (
          <DesktopHomeView />
        )}
      </div>

    </div>
  );
}