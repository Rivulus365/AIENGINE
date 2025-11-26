import React from 'react';

const AdBanner: React.FC = () => {
  return (
    <div className="w-full py-3 px-6 border-t border-[#292524] bg-[#0c0a09]/30 shrink-0">
      <div className="w-full h-20 bg-[#050404] border border-[#292524] rounded-sm flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer shadow-inner hover:border-amber-900/30 transition-colors">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-[0.03]"></div>
          
          {/* Ad Indicator */}
          <span className="text-[7px] uppercase tracking-widest text-stone-800 absolute top-1 right-2">Sponsored</span>
          
          {/* Ad Content */}
          <div className="text-center z-10 opacity-60 group-hover:opacity-90 transition-opacity duration-500">
             <p className="text-amber-900/80 font-display text-xs tracking-widest uppercase group-hover:text-amber-700 transition-colors">The Gilded Tankard</p>
             <p className="text-stone-700 text-[9px] italic mt-0.5">Warm beds. Cold ale.</p>
          </div>
      </div>
    </div>
  );
};

export default AdBanner;