import React from 'react';

// Vietnamese traditional Lotus motif (Hoa Sen)
export const LotusMotif: React.FC<{ className?: string; size?: number }> = ({ className = "text-[#A4161A]", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M12 2C12 2 10 7 10 10.5C10 12.5 10.8 14 12 14C13.2 14 14 12.5 14 10.5C14 7 12 2 12 2Z"
      fill="currentColor"
      fillOpacity="0.85"
    />
    <path
      d="M7.5 5.5C7.5 5.5 6.5 9.5 7.5 12.5C8.2 14.5 9.8 15.5 11 15.5C9.5 14 9 12 9 10C9 7.8 7.5 5.5 7.5 5.5Z"
      fill="currentColor"
      fillOpacity="0.7"
    />
    <path
      d="M16.5 5.5C16.5 5.5 17.5 9.5 16.5 12.5C15.8 14.5 14.2 15.5 13 15.5C14.5 14 15 12 15 10C15 7.8 16.5 5.5 16.5 5.5Z"
      fill="currentColor"
      fillOpacity="0.7"
    />
    <path
      d="M3.5 10C3.5 10 3.5 13.5 5.5 16C7 18 9.5 18 11.5 17C9 17 7 15 6 13C5.5 12 5.5 10 3.5 10Z"
      fill="currentColor"
      fillOpacity="0.5"
    />
    <path
      d="M20.5 10C20.5 10 20.5 13.5 18.5 16C17 18 14.5 18 12.5 17C15 17 17 15 18 13C18.5 12 18.5 10 20.5 10Z"
      fill="currentColor"
      fillOpacity="0.5"
    />
    <path
      d="M2 19C5.5 18 9 19.5 12 19.5C15 19.5 18.5 18 22 19C20 21 16 22 12 22C8 22 4 21 2 19Z"
      fill="currentColor"
      fillOpacity="0.8"
    />
  </svg>
);

// Cloud motif (Mây Tường Vân)
export const CloudMotif: React.FC<{ className?: string }> = ({ className = "text-[#B8862B]" }) => (
  <svg width="60" height="24" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M10 18C5 18 2 14.5 2 11C2 7.5 6 5 10 6C11 3 14 1 18 1C23 1 26 4.5 26 7.5C28 6.5 31 6.5 33 8C35 6 38 5 42 5C47 5 50 8 50 11C53 11 56 13 56 16C56 19.5 52.5 21.5 48 21.5C41 21.5 35 17 29 17C23 17 17 22 10 22C4 22 1 19 1 18"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      strokeOpacity="0.65"
    />
  </svg>
);

// Traditional Red Seal (Ấn Triện VẬN KỲ)
export const VanKySeal: React.FC<{ size?: number; className?: string }> = ({ size = 44, className = "" }) => (
  <div
    style={{ width: size, height: size }}
    className={`relative inline-flex items-center justify-center border-2 border-[#A4161A] bg-[#A4161A]/10 text-[#A4161A] select-none p-1 font-display-custom ${className}`}
  >
    <div className="absolute inset-0.5 border border-[#A4161A]/40 pointer-events-none" />
    <span className="text-[10px] font-bold tracking-normal leading-tight text-center uppercase">
      VẬN<br />KỲ
    </span>
  </div>
);

// Hairline Corner Ornament
export const HeritageCorner: React.FC<{ position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }> = ({
  position = 'top-left'
}) => {
  const rotationClass = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0 rotate-90',
    'bottom-right': 'bottom-0 right-0 rotate-180',
    'bottom-left': 'bottom-0 left-0 -rotate-90'
  }[position];

  return (
    <div className={`absolute ${rotationClass} pointer-events-none p-1.5 opacity-60 text-[#B8862B]`}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M0 0H18V2H2V18H0V0Z" fill="currentColor" />
        <rect x="5" y="5" width="2" height="2" fill="currentColor" />
      </svg>
    </div>
  );
};
