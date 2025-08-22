import React from 'react';

const ArrowUpIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className || 'w-5 h-5 text-blue-600'}
  >
    <path
      fillRule="evenodd"
      d="M12 4a.75.75 0 01.53.22l5.25 5.25a.75.75 0 11-1.06 1.06L12.75 6.81V20a.75.75 0 01-1.5 0V6.81L7.28 10.53a.75.75 0 11-1.06-1.06l5.25-5.25A.75.75 0 0112 4z"
      clipRule="evenodd"
    />
  </svg>
);

export default ArrowUpIcon;
