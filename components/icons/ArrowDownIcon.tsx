import React from 'react';

const ArrowDownIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className || 'w-5 h-5 text-blue-600'}
  >
    <path
      fillRule="evenodd"
      d="M12 20a.75.75 0 01-.53-.22l-5.25-5.25a.75.75 0 111.06-1.06L11.25 17.19V4a.75.75 0 011.5 0v13.19l3.97-3.97a.75.75 0 111.06 1.06l-5.25 5.25A.75.75 0 0112 20z"
      clipRule="evenodd"
    />
  </svg>
);

export default ArrowDownIcon;
