import React from 'react';

const NewIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className || 'w-5 h-5 text-purple-600'}
  >
    <rect x="2" y="2" width="20" height="20" rx="3" />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fontSize="10"
      fontFamily="Arial, sans-serif"
      fill="white"
    >
      NEW
    </text>
  </svg>
);

export default NewIcon;
