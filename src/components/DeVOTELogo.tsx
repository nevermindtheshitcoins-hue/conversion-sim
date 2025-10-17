import React from 'react';

interface DeVOTELogoProps {
  className?: string;
  size?: number;
}

export const DeVOTELogo: React.FC<DeVOTELogoProps> = ({
  className = "",
  size = 24
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main arrow body */}
      <path
        d="M12 2L20 12L12 22L4 12L12 2Z"
        fill="currentColor"
        opacity="0.9"
      />

      {/* Inner arrow design - creates the arrowhead effect */}
      <path
        d="M12 6L16 12L12 18L8 12L12 6Z"
        fill="currentColor"
        opacity="0.6"
      />

      {/* Center accent */}
      <circle
        cx="12"
        cy="12"
        r="2"
        fill="currentColor"
        opacity="0.8"
      />

      {/* Glow effect overlay */}
      <path
        d="M12 2L20 12L12 22L4 12L12 2Z"
        fill="currentColor"
        opacity="0.3"
        filter="blur(1px)"
      />
    </svg>
  );
};