import React, { useEffect, useState } from 'react';
import { getPropertyImageUrl } from '../../utils/propertyImages';

const FALLBACK_IMAGE = '/image/2bhk-modern-apartment.jpg';

const PropertyImage = ({
  image,
  alt,
  fallback = FALLBACK_IMAGE,
  className = '',
  loading = 'lazy'
}) => {
  const imageUrl = getPropertyImageUrl(image);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [imageUrl]);

  return (
    <img
      src={failed || !imageUrl ? fallback : imageUrl}
      alt={alt || 'Property'}
      className={className}
      loading={loading}
      onError={() => {
        if (!failed) {
          setFailed(true);
        }
      }}
    />
  );
};

export default PropertyImage;
