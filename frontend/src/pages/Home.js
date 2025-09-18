import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProperty } from '../context/PropertyContext';
import propertyService from '../services/propertyService';
import { formatCurrency, formatArea } from '../utils/formatters';
import { PROPERTY_TYPES } from '../utils/constants';
import Gallery from '../components/Gallery';

const Home = () => {
  const { setLoading } = useProperty();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [newlyLaunched, setNewlyLaunched] = useState([]);
  const [activeTab, setActiveTab] = useState('Buy');
  const [searchForm, setSearchForm] = useState({
    location: '',
    type: '',
    bedrooms: '',
    listingType: 'sale',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    fetchFeaturedProperties();
    fetchNewlyLaunched();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyService.getProperties({ 
        limit: 6, 
        status: 'approved',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      const properties = response.data.properties || [];
      
      // If no properties from backend, create mock data
      if (properties.length === 0) {
        const mockProperties = [
          {
            _id: 'featured1',
            title: 'Prime Office Space',
            location: { city: 'Mumbai', address: 'Bandra West, Mumbai' },
            price: 8500000,
            bedrooms: 3,
            bathrooms: 2,
            area: 1200,
            images: ['/image/muz10.webp'],
            amenities: ['Parking', 'Gym', 'Swimming Pool', 'Security', 'Garden']
          },
          {
            _id: 'featured2',
            title: 'Elegant 5 BHK Independent House',
            location: { city: 'Delhi', address: 'South Extension, Delhi' },
            price: 15000000,
            bedrooms: 5,
            bathrooms: 4,
            area: 2500,
            images: ['/image/muz6.webp'],
            amenities: ['Garden', 'Parking', 'Security', 'Pool', 'Gym']
          }
        ];
        setFeaturedProperties(mockProperties);
      } else {
        setFeaturedProperties(properties);
      }
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      // Fallback to mock data
      const mockProperties = [
        {
          _id: 'featured1',
          title: 'Prime Office Space',
          location: { city: 'Mumbai', address: 'Bandra West, Mumbai' },
          price: 8500000,
          bedrooms: 3,
          bathrooms: 2,
          area: 1200,
          images: ['/image/muz10.webp'],
          amenities: ['Parking', 'Gym', 'Swimming Pool', 'Security', 'Garden']
        },
        {
          _id: 'featured2',
          title: 'Elegant 5 BHK Independent House',
          location: { city: 'Delhi', address: 'South Extension, Delhi' },
          price: 15000000,
          bedrooms: 5,
          bathrooms: 4,
          area: 2500,
          images: ['/image/muz6.webp'],
          amenities: ['Garden', 'Parking', 'Security', 'Pool', 'Gym']
        }
      ];
      setFeaturedProperties(mockProperties);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewlyLaunched = async () => {
    try {
      const response = await propertyService.getProperties({ 
        limit: 3, 
        status: 'approved',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      const properties = response.data.properties || [];
      
      // If no properties from backend, create mock data
      if (properties.length === 0) {
        const mockProperties = [
          {
            _id: 'mock1',
            title: 'Prime Office Space',
            location: { city: 'Mumbai', address: 'Bandra West' },
            price: 8500000,
            bedrooms: 3,
            area: 1200,
            images: ['/image/muz1.jpg'],
            amenities: ['Parking', 'Gym', 'Swimming Pool']
          },
          {
            _id: 'mock2',
            title: 'Elegant 5 BHK Independent House',
            location: { city: 'Delhi', address: 'South Extension' },
            price: 15000000,
            bedrooms: 5,
            area: 2500,
            images: ['/image/muz2.jpg'],
            amenities: ['Garden', 'Parking', 'Security']
          },
          {
            _id: 'mock3',
            title: 'Magnificent 4 BHK Villa',
            location: { city: 'Bangalore', address: 'Whitefield' },
            price: 12000000,
            bedrooms: 4,
            area: 1800,
            images: ['/image/muz3.jpg'],
            amenities: ['Pool', 'Garden', 'Gym']
          }
        ];
        setNewlyLaunched(mockProperties);
      } else {
        setNewlyLaunched(properties);
      }
    } catch (error) {
      console.error('Error fetching newly launched properties:', error);
      // Fallback to mock data
      const mockProperties = [
        {
          _id: 'mock1',
          title: 'Prime Office Space',
          location: { city: 'Mumbai', address: 'Bandra West' },
          price: 8500000,
          bedrooms: 3,
          area: 1200,
          images: ['/image/2bhk-modern-apartment.jpg'],
          amenities: ['Parking', 'Gym', 'Swimming Pool']
        },
        {
          _id: 'mock2',
          title: 'Elegant 5 BHK Independent House',
          location: { city: 'Delhi', address: 'South Extension' },
          price: 15000000,
          bedrooms: 5,
          area: 2500,
          images: ['/image/5bhk-independent-house.jpg'],
          amenities: ['Garden', 'Parking', 'Security']
        },
        {
          _id: 'mock3',
          title: 'Magnificent 4 BHK Villa',
          location: { city: 'Bangalore', address: 'Whitefield' },
          price: 12000000,
          bedrooms: 4,
          area: 1800,
          images: ['/image/4bhk-villa.jpg'],
          amenities: ['Pool', 'Garden', 'Gym']
        }
      ];
      setNewlyLaunched(mockProperties);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchForm(prev => ({
      ...prev,
      listingType: tab === 'Buy' ? 'sale' : 'rent'
    }));
  };

  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Build search query
    const searchParams = new URLSearchParams();
    Object.entries(searchForm).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value);
      }
    });
    
    // Navigate to properties page with search params
    window.location.href = `/properties?${searchParams.toString()}`;
  };

  const tabs = [
    { name: 'Buy', icon: '🏠', active: activeTab === 'Buy' },
    { name: 'Rent', icon: '🏡', active: activeTab === 'Rent' },
    { name: 'New Launch', icon: '✨', badge: 'NEW', active: activeTab === 'New Launch' },
    { name: 'Commercial', icon: '🏢', active: activeTab === 'Commercial' },
    { name: 'Plots/Land', icon: '🌿', active: activeTab === 'Plots/Land' },
    { name: 'Projects', icon: '🏗️', active: activeTab === 'Projects' }
  ];

  const categoryCards = [
    {
      title: 'Buying a home',
      image: '/image/2bhk-modern-apartment.jpg',
      description: 'Find verified properties',
      link: '/properties?listingType=sale',
      icon: '🏠',
      gradient: 'from-blue-500 to-blue-600',
      stats: '2,500+ Properties'
    },
    {
      title: 'Renting a home',
      image: '/image/3bhk-luxury-flat.jpg',
      description: 'Find rental properties',
      link: '/properties?listingType=rent',
      icon: '🏡',
      gradient: 'from-green-500 to-green-600',
      stats: '1,200+ Rentals'
    },
    {
      title: 'Invest in Real Estate',
      image: '/image/4bhk-villa.jpg',
      description: 'Best investment opportunities',
      link: '/properties?type=investment',
      icon: '📈',
      gradient: 'from-purple-500 to-purple-600',
      stats: '300+ Projects'
    },
    {
      title: 'Sell/Rent your property',
      image: '/image/5bhk-independent-house.jpg',
      description: 'List your property',
      link: '/dashboard',
      icon: '💰',
      gradient: 'from-orange-500 to-orange-600',
      stats: 'Free Listing'
    },
    {
      title: 'Plots/Land',
      image: '/image/muz3.jpg',
      description: 'Buy/Sell land & plots',
      link: '/properties?type=plot',
      icon: '🌿',
      gradient: 'from-yellow-500 to-yellow-600',
      stats: '800+ Plots'
    },
    {
      title: 'Explore Insights',
      image: '/image/muz4.jpg',
      description: 'Market trends & analysis',
      link: '/insights',
      icon: '📊',
      gradient: 'from-indigo-500 to-indigo-600',
      stats: 'Live Data'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <section className="relative overflow-hidden">
        {/* Hero Background */}
        <div className="h-[500px] bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-400 relative">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-60 transition-all duration-700 hover:scale-105"
            style={{ backgroundImage: 'url(/image/4bhk-villa.jpg)' }}
          ></div>
          
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-20 h-20 bg-primary-300 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-32 right-20 w-16 h-16 bg-secondary-300 rounded-full opacity-20 animate-bounce"></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-primary-400 rounded-full opacity-30 animate-pulse"></div>
          </div>
          
          {/* Company Logo and Branding */}
          <div className="relative z-10 container-custom pt-12">
            <div className="text-center">
              <div className="animate-fade-in-down">
                <img 
                  src="/image/eazy-property-logo.png" 
                  alt="Eazy Property Solution" 
                  className="h-16 w-auto mx-auto mb-6 filter drop-shadow-lg"
                  onError={(e) => {
                    e.target.src = "/image/EAZY PROPERTY SOLUTION comapy logo.png";
                  }}
                />
              </div>
              <div className="text-white animate-fade-in-up">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                  EAZY PROPERTY SOLUTION
                </h1>
                <p className="text-xl md:text-2xl opacity-90 mb-8 font-medium">
                  & CONSTRUCTION
                </p>
                <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-80 leading-relaxed">
                  Your Dream Property Awaits - Quality, Trust, and Excellence in Every Project
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Container */}
        <div className="relative z-20 -mt-40 container-custom">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-6xl mx-auto border border-gray-100 animate-slide-up"
               style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Find Your Perfect Property</h2>
              <p className="text-gray-600">Search from thousands of verified properties</p>
            </div>
            {/* Search Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => handleTabChange(tab.name)}
                  className={`px-4 py-3 rounded-t-lg font-medium text-sm relative transition-all ${
                    tab.active
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                  {tab.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* Location Search */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <input
                      type="text"
                      name="location"
                      value={searchForm.location}
                      onChange={handleSearchInputChange}
                      placeholder="Enter city, locality, project or landmark"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 pl-10"
                    />
                    <div className="absolute left-3 top-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Property Type Dropdown */}
                <div>
                  <select
                    name="type"
                    value={searchForm.type}
                    onChange={handleSearchInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Residential</option>
                    {PROPERTY_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Button */}
                <div>
                  <button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* GET STARTED Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-gray-600 mb-8">
              GET STARTED WITH EXPLORING REAL ESTATE OPTIONS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {categoryCards.map((card, index) => (
              <Link
                key={index}
                to={card.link}
                className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${card.gradient} opacity-0 group-hover:opacity-80 transition-opacity duration-300`}></div>
                  
                  {/* Icon and Stats */}
                  <div className="absolute top-3 left-3">
                    <div className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-xl">{card.icon}</span>
                    </div>
                  </div>
                  
                  <div className="absolute top-3 right-3">
                    <span className="bg-primary-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {card.stats}
                    </span>
                  </div>

                  {/* Hover Content */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-center text-white">
                      <div className="text-3xl mb-2">{card.icon}</div>
                      <div className="text-sm font-medium">View Properties</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-primary-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {card.description}
                  </p>
                  
                  {/* Bottom decoration */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs font-medium text-primary-600">
                      Explore Now
                    </div>
                    <svg className="w-4 h-4 text-primary-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newly Launched Projects */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-6">
              <span className="text-white text-2xl">🚀</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Newly launched projects</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Discover premium properties with modern amenities and bigger homes in your budget</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newlyLaunched.map((property, index) => (
              <Link
                key={property._id}
                to={`/properties/${property._id}`}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={property.images?.[0] || `/image/${['2bhk-modern-apartment', '3bhk-luxury-flat', '4bhk-villa'][index % 3]}.jpg`}
                    alt={property.title || 'Property Image'}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const fallbackImages = [
                        'muz1.jpg', 'muz2.jpg', 'muz3.jpg', 'muz4.jpg', 'muz5.jpg',
                        '2bhk-modern-apartment.jpg', '3bhk-luxury-flat.jpg', '4bhk-villa.jpg', '5bhk-independent-house.jpg'
                      ];
                      e.target.src = `/image/${fallbackImages[index % fallbackImages.length]}`;
                      e.target.onerror = null; // Prevent infinite loop
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      🔥 NEW LAUNCH
                    </span>
                    <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center shadow-lg">
                      <span className="mr-1">✓</span>
                      RERA APPROVED
                    </span>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                      <div className="text-xs text-gray-600">Starting from</div>
                      <div className="text-lg font-bold text-primary-600">
                        {formatCurrency(property.price)}
                      </div>
                    </div>
                  </div>

                  {/* Hover Content */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-6 py-3 shadow-xl">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-gray-900">View Details</div>
                        <div className="text-xs text-gray-600">Click to explore</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {property.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">{property.location?.city || 'Prime Location'}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center bg-gray-50 rounded-lg py-2">
                      <div className="text-sm font-semibold text-gray-900">{property.bedrooms || '3'} BHK</div>
                      <div className="text-xs text-gray-600">Configuration</div>
                    </div>
                    <div className="text-center bg-gray-50 rounded-lg py-2">
                      <div className="text-sm font-semibold text-gray-900">{formatArea(property.area) || '1200'}</div>
                      <div className="text-xs text-gray-600">Carpet Area</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-600">
                      Ready to Move • {property.amenities?.length || 15}+ Amenities
                    </div>
                    <svg className="w-5 h-5 text-primary-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              to="/properties"
              className="inline-flex items-center bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-semibold px-8 py-4 rounded-xl hover:from-primary-700 hover:to-secondary-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>Explore All Projects</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Handpicked Residential Projects */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
              <span className="text-white text-2xl">💎</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Handpicked Residential Projects</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Carefully curated premium properties across India with exceptional value and quality</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredProperties.slice(0, 2).map((property, index) => (
              <div key={property._id} className="group bg-white rounded-3xl shadow-xl overflow-hidden relative transform hover:-translate-y-2 transition-all duration-500">
                {/* Image Section */}
                <div className="relative overflow-hidden h-80">
                  <img
                    src={property.images?.[0] || `/image/${['3bhk-luxury-flat', '4bhk-villa'][index]}.jpg`}
                    alt={property.title || 'Featured Property'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      const fallbackImages = [
                        'muz6.jpg', 'muz7.jpg', 'muz8.jpg',
                        '3bhk-luxury-flat.jpg', '4bhk-villa.jpg', '5bhk-independent-house.jpg', '2bhk-modern-apartment.jpg'
                      ];
                      e.target.src = `/image/${fallbackImages[index % fallbackImages.length]}`;
                      e.target.onerror = null; // Prevent infinite loop
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  
                  {/* Top Badges */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg">
                      ⭐ FEATURED
                    </span>
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors group">
                      <svg className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Bottom Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-600">Starting from</div>
                          <div className="text-2xl font-bold text-gray-900">
                            {formatCurrency(property.price)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">{property.bedrooms} BHK</div>
                          <div className="text-sm font-semibold text-gray-900">{formatArea(property.area)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {property.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-6">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{property.location?.address}, {property.location?.city}</span>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center bg-gray-50 rounded-lg py-3">
                      <div className="text-lg font-bold text-gray-900">{property.bedrooms || '3'}</div>
                      <div className="text-xs text-gray-600">Bedrooms</div>
                    </div>
                    <div className="text-center bg-gray-50 rounded-lg py-3">
                      <div className="text-lg font-bold text-gray-900">{property.bathrooms || '2'}</div>
                      <div className="text-xs text-gray-600">Bathrooms</div>
                    </div>
                    <div className="text-center bg-gray-50 rounded-lg py-3">
                      <div className="text-lg font-bold text-gray-900">{property.amenities?.length || '15'}+</div>
                      <div className="text-xs text-gray-600">Amenities</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    to={`/properties/${property._id}`}
                    className="block w-full bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white font-bold py-4 px-6 rounded-xl text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <span className="flex items-center justify-center">
                      View Complete Details
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              to="/properties"
              className="inline-flex items-center bg-gradient-to-r from-gray-900 to-gray-700 text-white font-semibold px-8 py-4 rounded-xl hover:from-gray-800 hover:to-gray-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>View All Properties</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Property Gallery */}
      <Gallery />

      {/* Call to Action */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect property with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/properties"
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition duration-200"
            >
              Browse Properties
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition duration-200"
            >
              List Your Property
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;