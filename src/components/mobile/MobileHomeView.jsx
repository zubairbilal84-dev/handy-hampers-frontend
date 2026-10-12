import React from 'react';
import { useLocation } from 'react-router-dom';

import AllHampers, { allHampersData } from '../../data/allHampers.jsx';
import { giftHampersData } from '../../data/giftHampers.jsx';
import { metalHampersData } from '../../data/metalHampers.jsx';
import { corporateHampersData } from '../../data/corporateHampers.jsx';
import { festivalHampersData } from '../../data/festivalHampers.jsx';
import { occasionsHampersData } from '../../data/occasionsHampers.jsx';
import { weddingHampersData } from '../../data/weddingHampers.jsx';

const categoryDataMap = {
  all: allHampersData,
  gift: giftHampersData || allHampersData,
  metal: metalHampersData || allHampersData,
  corporate: corporateHampersData || allHampersData,
  festival: festivalHampersData || allHampersData,
  occasions: occasionsHampersData || allHampersData,
  wedding: weddingHampersData || allHampersData,
};

export default function MobileHomeView() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCat = queryParams.get('cat') || 'all';

  const activeData = categoryDataMap[selectedCat] || allHampersData;

  return (
    <div className="w-full md:hidden">
      <AllHampers data={activeData} />
    </div>
  );
}