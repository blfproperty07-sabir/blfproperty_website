import React, { useState } from 'react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  
  const galleryImages = [
    {
      src: '/image/2bhk-budget-flat.jpg',
      title: '2 BHK Budget Flat',
      description: 'Affordable housing solution for modern families'
    },
    {
      src: '/image/2bhk-modern-apartment.jpg',
      title: '2 BHK Modern Apartment',
      description: 'Contemporary design with modern amenities'
    },
    {
      src: '/image/3bhk-luxury-flat.jpg',
      title: '3 BHK Luxury Flat',
      description: 'Premium living spaces with luxury finishes'
    },
    {
      src: '/image/4bhk-villa.jpg',
      title: '4 BHK Villa',
      description: 'Spacious villa with garden and premium facilities'
    },
    {
      src: '/image/5bhk-independent-house.jpg',
      title: '5 BHK Independent House',
      description: 'Large independent house perfect for big families'
    },
    {
      src: '/image/Office.jpg',
      title: 'Commercial Office Space',
      description: 'Modern office spaces for businesses'
    },
    {
      src: '/image/muz1.jpg',
      title: 'Property Showcase 1',
      description: 'Beautiful residential property'
    },
    {
      src: '/image/muz2.jpg',
      title: 'Property Showcase 2',
      description: 'Elegant home design'
    },
    {
      src: '/image/muz3.jpg',
      title: 'Property Showcase 3',
      description: 'Modern architectural marvel'
    },
    {
      src: '/image/muz4.jpg',
      title: 'Property Showcase 4',
      description: 'Luxurious living spaces'
    },
    {
      src: '/image/muz5.jpg',
      title: 'Property Showcase 5',
      description: 'Contemporary home design'
    },
    {
      src: '/image/muz7.jpg',
      title: 'Property Showcase 6',
      description: 'Premium property development'
    }
  ];

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Property Gallery</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our stunning collection of properties. From budget-friendly apartments to luxury villas, 
            we have something for every taste and budget.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleryImages.map((image, index) => (
            <div 
              key={index}
              className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => openModal(image)}
            >
              <div className="relative overflow-hidden h-48">
                <img 
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">{image.title}</h3>
                <p className="text-sm text-gray-600">{image.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition-all z-10"
            >
              ×
            </button>
            <img 
              src={selectedImage.src}
              alt={selectedImage.title}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4 rounded-b-lg">
              <h3 className="text-xl font-semibold mb-2">{selectedImage.title}</h3>
              <p className="text-gray-300">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;