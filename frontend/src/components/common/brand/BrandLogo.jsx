import React, { useState } from 'react';

const BrandLogo = ({
  src = '/image/blf_logo.png',
  alt = 'BLF Property logo',
  className = '',
  onError,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={`inline-flex items-center justify-center font-bold text-primary-600 ${className}`.trim()}
        {...props}
      >
        BLF
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(event) => {
        setHasError(true);
        onError?.(event);
      }}
      {...props}
    />
  );
};

export default BrandLogo;
