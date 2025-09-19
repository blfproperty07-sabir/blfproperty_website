import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import propertyService from '../services/propertyService';
import { formatCurrency, formatArea } from '../utils/formatters';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const response = await propertyService.getPropertyById(id);
      // Backend returns { success: true, data: { property, similarProperties } }
      setProperty(response.data.property);
      setSimilarProperties(response.data.similarProperties || []);
    } catch (error) {
      console.error('Error fetching property details:', error);
      setError('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const handleImageNavigation = (direction) => {
    if (!property?.images || property.images.length <= 1) return;
    
    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const formatAmenities = (amenities) => {
    if (!amenities || amenities.length === 0) return 'No amenities listed';
    return amenities.map(amenity => 
      amenity.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    ).join(', ');
  };

  const formatFurnishing = (furnished) => {
    if (!furnished) return 'Not specified';
    return furnished.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="text-red-500 text-6xl mb-4">🏠</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'The property you are looking for does not exist.'}</p>
            <button
              onClick={() => navigate('/properties')}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg"
            >
              Browse Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li><a href="/" className="text-primary-600 hover:text-primary-700">Home</a></li>
            <li><span className="text-gray-500">/</span></li>
            <li><a href="/properties" className="text-primary-600 hover:text-primary-700">Properties</a></li>
            <li><span className="text-gray-500">/</span></li>
            <li className="text-gray-600">{property.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Property Info */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="relative h-96">
                <img
                  src={property.images?.[currentImageIndex]?.url || property.images?.[0]?.url || '/image/muz1.jpg'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/image/muz1.jpg';
                  }}
                />
                
                {/* Image Navigation */}
                {property.images && property.images.length > 1 && (
                  <>
                    <button
                      onClick={() => handleImageNavigation('prev')}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => handleImageNavigation('next')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      →
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  </>
                )}

                {/* Property Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    property.status === 'approved' ? 'bg-green-500 text-white' :
                    property.status === 'pending' ? 'bg-yellow-500 text-white' :
                    property.status === 'sold' ? 'bg-red-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}>
                    {property.status?.charAt(0).toUpperCase() + property.status?.slice(1)}
                  </span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    For {property.category?.charAt(0).toUpperCase() + property.category?.slice(1)}
                  </span>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {property.images && property.images.length > 1 && (
                <div className="p-4 bg-gray-50">
                  <div className="flex space-x-2 overflow-x-auto">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          currentImageIndex === index ? 'border-primary-600' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/image/muz1.jpg';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Property Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.title}</h1>
              
              {/* Price and Area */}
              <div className="flex items-center justify-between mb-6 p-4 bg-primary-50 rounded-lg">
                <div>
                  <p className="text-3xl font-bold text-primary-600">
                    {formatCurrency(property.price?.amount)}
                    {property.price?.negotiable && <span className="text-sm text-gray-600 ml-2">(Negotiable)</span>}
                  </p>
                  <p className="text-gray-600">Total Price</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold text-gray-900">{formatArea(property.area?.size)}</p>
                  <p className="text-gray-600">Built-up Area</p>
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{property.features?.bedrooms || 0}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{property.features?.bathrooms || 0}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{property.features?.balconies || 0}</div>
                  <div className="text-sm text-gray-600">Balconies</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{property.features?.parking || 0}</div>
                  <div className="text-sm text-gray-600">Parking</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Property Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Type:</span>
                      <span className="font-medium">{property.type?.charAt(0).toUpperCase() + property.type?.slice(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Furnishing:</span>
                      <span className="font-medium">{formatFurnishing(property.features?.furnished)}</span>
                    </div>
                    {property.features?.floor && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Floor:</span>
                        <span className="font-medium">{property.features.floor.current} of {property.features.floor.total}</span>
                      </div>
                    )}
                    {property.features?.age && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Property Age:</span>
                        <span className="font-medium">{property.features.age} years</span>
                      </div>
                    )}
                    {property.features?.facing && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Facing:</span>
                        <span className="font-medium">{property.features.facing.charAt(0).toUpperCase() + property.features.facing.slice(1)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Location Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">City:</span>
                      <span className="font-medium">{property.location?.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">State:</span>
                      <span className="font-medium">{property.location?.state}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pincode:</span>
                      <span className="font-medium">{property.location?.pincode}</span>
                    </div>
                    {property.location?.neighborhood && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Neighborhood:</span>
                        <span className="font-medium">{property.location.neighborhood}</span>
                      </div>
                    )}
                    {property.location?.landmark && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Landmark:</span>
                        <span className="font-medium">{property.location.landmark}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Amenities</h3>
                <p className="text-gray-600">{formatAmenities(property.amenities)}</p>
              </div>

              {/* Address */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Address</h3>
                <p className="text-gray-600">{property.location?.address}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact and Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Property Owner</h3>
              
              {/* Contact Information - NO MOBILE NUMBER */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Property Listed By:</p>
                <p className="font-semibold text-gray-900">{property.owner?.name || 'Property Owner'}</p>
                <p className="text-gray-600">{property.owner?.email || 'Contact via form'}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Note: Contact details are protected. Use the contact form to reach the owner.
                </p>
              </div>

              {/* Contact Actions */}
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/contact')}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center"
                >
                  <span className="mr-2">📞</span>
                  Contact Owner
                </button>
                
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center">
                  <span className="mr-2">💬</span>
                  WhatsApp Inquiry
                </button>
                
                <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center">
                  <span className="mr-2">❤️</span>
                  Save Property
                </button>
              </div>

              {/* Property Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Property Views</p>
                  <p className="text-2xl font-bold text-primary-600">{property.views || 0}</p>
                </div>
              </div>

              {/* Listed Date */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Listed on {new Date(property.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;