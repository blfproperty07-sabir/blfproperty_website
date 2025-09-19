import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import propertyService from '../services/propertyService';
import { formatCurrency, formatDate } from '../utils/formatters';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    location: ''
  });

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      
      // Parse URL parameters
      const urlParams = new URLSearchParams(location.search);
      const listingType = urlParams.get('listingType');
      
      console.log('Properties page - URL params:', { listingType });
      
      // Determine which properties to show based on listingType
      let category = 'sale'; // Default to sale properties
      if (listingType === 'rent') {
        category = 'rent'; // Show rental properties for tenants
      }
      
      console.log('Properties page - Fetching properties with category:', category);
      
      // Fetch properties based on category
      const response = await propertyService.getAllProperties({ category });
      console.log('Properties page - API response:', response);
      
      // The backend already filters for approved properties, so we can use them directly
      const properties = response.data?.properties || [];
      console.log('Properties page - Properties received:', properties);
      
      setProperties(properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }, [location.search]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]); // Use fetchProperties dependency

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const filteredProperties = properties.filter(property => {
    return (
      property.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.type === '' || property.type === filters.type) &&
      (filters.location === '' || 
        property.location?.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
        property.location?.address?.toLowerCase().includes(filters.location.toLowerCase())) &&
      (filters.bedrooms === '' || (property.features?.bedrooms || 0).toString() === filters.bedrooms) &&
      (filters.minPrice === '' || (property.price?.amount || property.price) >= parseInt(filters.minPrice)) &&
      (filters.maxPrice === '' || (property.price?.amount || property.price) <= parseInt(filters.maxPrice))
    );
  });

  const propertyTypes = ['apartment', 'villa', 'house', 'office', 'commercial'];
  const bedroomOptions = [1, 2, 3, 4, 5];

  // Get the listing type from URL to determine page title
  const urlParams = new URLSearchParams(location.search);
  const listingType = urlParams.get('listingType');
  const isRentalPage = listingType === 'rent';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {isRentalPage ? 'Find Your Perfect Rental' : 'Find Your Dream Property'}
            </h1>
            <p className="text-lg max-w-3xl mx-auto">
              {isRentalPage 
                ? 'Discover amazing rental properties perfect for tenants' 
                : 'Browse through our extensive collection of verified properties'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white shadow-md py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <input
                type="text"
                name="search"
                placeholder="Search properties..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
            
            <div>
              <select
                name="type"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <input
                type="text"
                name="location"
                placeholder="Location..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={filters.location}
                onChange={handleFilterChange}
              />
            </div>
            
            <div>
              <select
                name="bedrooms"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={filters.bedrooms}
                onChange={handleFilterChange}
              >
                <option value="">Bedrooms</option>
                {bedroomOptions.map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Bedroom' : 'Bedrooms'}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
            </div>
            
            <div>
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading properties...</p>
          </div>
        ) : filteredProperties.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredProperties.length} of {properties.length} properties
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <div key={property._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <img 
                      src={property.images?.[0]?.url || property.images?.[0] || '/image/2bhk-modern-apartment.jpg'}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-primary-500 text-white px-2 py-1 rounded text-sm font-semibold">
                      {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                    </div>
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-sm font-semibold">
                      Available
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{property.title}</h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">{property.description}</p>
                    
                    <div className="flex items-center text-gray-500 mb-3">
                      <i className="fas fa-map-marker-alt mr-2"></i>
                      <span className="line-clamp-1">{property.location?.city}, {property.location?.state}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <i className="fas fa-bed mr-1"></i>
                        <span>{property.features?.bedrooms || 0} Bed</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-bath mr-1"></i>
                        <span>{property.features?.bathrooms || 0} Bath</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-ruler-combined mr-1"></i>
                        <span>{property.area?.size || 0} {property.area?.unit || 'sqft'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-primary-600">
                          {formatCurrency(property.price?.amount || property.price)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Listed {formatDate(property.createdAt)}
                        </p>
                      </div>
                      
                      <Link 
                        to={`/properties/${property._id}`}
                        className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <i className="fas fa-home text-6xl text-gray-300"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Properties Found</h3>
            <p className="text-gray-600 mb-4">
              {filters.search || filters.type || filters.location || filters.bedrooms || filters.minPrice || filters.maxPrice
                ? 'Try adjusting your search filters'
                : 'No approved properties available at the moment'}
            </p>
            <button 
              onClick={() => setFilters({
                search: '',
                type: '',
                minPrice: '',
                maxPrice: '',
                bedrooms: '',
                location: ''
              })}
              className="bg-primary-500 text-white px-6 py-2 rounded hover:bg-primary-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;