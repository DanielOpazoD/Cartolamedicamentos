import React from 'react';

const StopIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className || 'w-5 h-5 text-red-600'}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="7" y1="7" x2="17" y2="17" stroke="white" strokeWidth="2" />
    <line x1="17" y1="7" x2="7" y2="17" stroke="white" strokeWidth="2" />
  </svg>
);

export default StopIcon;
