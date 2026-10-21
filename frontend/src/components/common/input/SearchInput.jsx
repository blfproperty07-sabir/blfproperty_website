import React from 'react';
import Input from './Input.jsx';

const SearchInput = ({ className = '', ...props }) => (
  <div className="relative">
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="7" strokeWidth="2" />
      <path d="m16 16 4 4" strokeWidth="2" strokeLinecap="round" />
    </svg>
    <Input
      {...props}
      type="search"
      className={`pl-10 ${className}`.trim()}
    />
  </div>
);

export default SearchInput;
