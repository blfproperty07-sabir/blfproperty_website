import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DefaultGallery from './GalleryDefault';

const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5001/api').replace(/\/+$/, '');

const Gallery = () => {
  const [adminImages, setAdminImages] = useState([]);

  useEffect(() => {
    let active = true;

    axios.get(`${API_BASE_URL}/gallery`, { timeout: 15000 })
      .then((response) => {
        const images = response.data?.data?.images || response.data?.images || [];
        if (active && Array.isArray(images)) {
          setAdminImages(images.filter((image) => image.imageUrl || image.url));
        }
      })
      .catch((error) => {
        console.warn('Could not load admin gallery images:', error.message);
      });

    return () => {
      active = false;
    };
  }, []);

  return <DefaultGallery adminImages={adminImages} />;
};

export default Gallery;
