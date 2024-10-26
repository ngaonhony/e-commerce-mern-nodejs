// src/assets/icons/DropdownArrowIcon.jsx
import React from 'react';

const DropdownArrowIcon = ({ className, width = 12, height = 12 }) => (
    <svg
        className={className}
        width={width}
        height={height}
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default DropdownArrowIcon;
