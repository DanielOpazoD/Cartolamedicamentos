import React from 'react';

const ThreeQuarterPillIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M12 2a10 10 0 0 1 10 10h-10z" />
    <path d="M22 12a10 10 0 0 1-10 10v-10z" />
    <path d="M12 22a10 10 0 0 1-10-10h10z" />
  </svg>
);

export default ThreeQuarterPillIcon;
