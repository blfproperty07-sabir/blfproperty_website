import React, { useState, useEffect, useCallback } from 'react';
import HeroSection from '../components/layout/home/sections/HeroSection';
import { Link } from 'react-router-dom';
import propertyService from '../services/propertyService';
import { formatCurrency, formatArea } from '../utils/formatters';
import { PROPERTY_TYPES } from '../utils/constants';
import Gallery from '../components/Gallery';
import PropertyImage from '../components/property/PropertyImage';

const Home = () => {
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

  const fetchNewlyLaunched = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchNewlyLaunched();
  }, [fetchNewlyLaunched]);

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
    { name: 'Buy', icon: 'ðŸ ', active: activeTab === 'Buy' },
    { name: 'Rent', icon: 'ðŸ¡', active: activeTab === 'Rent' },
    { name: 'New Launch', icon: 'âœ¨', badge: 'NEW', active: activeTab === 'New Launch' },
    { name: 'Commercial', icon: 'ðŸ¢', active: activeTab === 'Commercial' },
    { name: 'Plots/Land', icon: 'ðŸŒ¿', active: activeTab === 'Plots/Land' },
    { name: 'Projects', icon: 'ðŸ—ï¸', active: activeTab === 'Projects' }
  ];

  const categoryCards = [
    {
      title: 'Buying a home',
      image: '/image/2bhk-modern-apartment.jpg',
      description: 'Find verified properties',
      link: '/properties?listingType=sale',
      icon: 'ðŸ ',
      gradient: 'from-blue-500 to-blue-600',
      stats: '2,500+ Properties'
    },
    {
      title: 'Renting a home',
      image: '/image/3bhk-luxury-flat.jpg',
      description: 'Find rental properties',
      link: '/properties?listingType=rent',
      icon: 'ðŸ¡',
      gradient: 'from-green-500 to-green-600',
      stats: '1,200+ Rentals'
    },
    {
      title: 'Invest in Real Estate',
      image: '/image/4bhk-villa.jpg',
      description: 'Best investment opportunities',
      link: '/properties?type=investment',
      icon: 'ðŸ“ˆ',
      gradient: 'from-purple-500 to-purple-600',
      stats: '300+ Projects'
    },
    {
      title: 'Sell/Rent your property',
      image: '/image/5bhk-independent-house.jpg',
      description: 'List your property',
      link: '/dashboard',
      icon: 'ðŸ’°',
      gradient: 'from-orange-500 to-orange-600',
      stats: 'Free Listing'
    },
    {
      title: 'Plots/Land',
      image: '/image/muz3.jpg',
      description: 'Buy/Sell land & plots',
      link: '/properties?type=plot',
      icon: 'ðŸŒ¿',
      gradient: 'from-yellow-500 to-yellow-600',
      stats: '800+ Plots'
    },
  ];

  return (
    <div className="min-h-screen">
      <HeroSection
        searchForm={searchForm}
        handleSearchInputChange={handleSearchInputChange}
        handleSearch={handleSearch}
        tabs={tabs}
        handleTabChange={handleTabChange}
        PROPERTY_TYPES={PROPERTY_TYPES}
      />
      {/* GET STARTED Section */}
      <section className="bg-[#F7F8FC] py-8 sm:py-10 lg:py-12">
        <div className="container-custom">
          <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-600 sm:text-sm">
              <span className="h-px w-8 bg-amber-500" />
              Explore Your Options
              <span className="h-px w-8 bg-amber-500" />
            </div>

            <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-[#17213D] sm:text-3xl lg:text-4xl">
              GET STARTED WITH EXPLORING
              <span className="mt-1 block text-amber-600">REAL ESTATE OPTIONS</span>
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Find a place to call home, explore investment opportunities, or list your property.
            </p>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {categoryCards.map((card, index) => (
              <Link
                key={card.link || index}
                to={card.link}
                className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_5px_20px_rgba(23,33,61,0.06)] transition duration-300 hover:-translate-y-1.5 hover:border-amber-200 hover:shadow-[0_18px_35px_rgba(23,33,61,0.13)] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                <div className="relative h-40 shrink-0 overflow-hidden bg-gray-100 sm:h-44">
                  <img
                    src={card.image}
                    alt={card.title || 'Real estate options'}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#111B3C]/55 via-transparent to-transparent" />
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-base font-bold leading-6 text-[#17213D] transition-colors group-hover:text-amber-700">
                    {card.title}
                  </h3>

                  <p className="mt-2 flex-1 text-sm leading-6 text-gray-500">
                    {card.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-sm font-bold text-amber-700">
                      Explore Now
                    </span>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F6F3EC] text-[#17213D] transition-colors duration-300 group-hover:bg-[#17213D] group-hover:text-white">
                      <svg
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 12h14m-6-6 6 6-6 6"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* Newly Launched Projects */}
      <section className="relative overflow-hidden bg-[#F7F8FC] py-8 sm:py-10 lg:py-12">
        <div className="pointer-events-none absolute -right-24 top-12 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl" />

        <div className="container-custom relative z-10">
          <div className="mb-6 flex flex-col items-center gap-4 border-b border-gray-200 pb-5 text-center sm:mb-7">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-3 flex items-center justify-center gap-2">
                <span className="h-1.5 w-7 rounded-full bg-amber-500" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
                  Fresh to the Market
                </span>
              </div>

              <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-[#17213D] sm:text-4xl lg:text-[42px]">
                Newly Launched
                <span className="text-amber-600"> Projects</span>
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                Explore new homes, distinctive properties and opportunities worth discovering.
              </p>
            </div>

            
          </div>

          <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
            {newlyLaunched.map((property, index) => (
              <Link
                key={property._id || index}
                to={`/properties/${property._id}`}
                className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_4px_18px_rgba(23,33,61,0.045)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_16px_36px_rgba(23,33,61,0.11)] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                <div className="relative h-48 shrink-0 overflow-hidden bg-gray-100 sm:h-52">
                  <PropertyImage
                    image={property.images?.[0]}
                    alt={property.title || 'Residential property'}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      New Launch
                    </span>
                    <span className="text-xs font-medium text-gray-400">
                      {property.amenities?.length || 3}+ amenities
                    </span>
                  </div>

                  <h3 className="text-center text-lg font-bold leading-6 text-[#17213D] transition-colors duration-200 group-hover:text-amber-700">
                    {property.title || 'Residential Property'}
                  </h3>

                  <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-sm text-gray-500">
                    <svg className="h-4 w-4 shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{property.location?.city || 'Prime Location'}</span>
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-3 py-3 text-center">
                      <p className="text-xs font-medium text-gray-500">Configuration</p>
                      <p className="mt-1.5 text-sm font-bold text-[#17213D]">
                        {property.bedrooms || 3} BHK
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-[#F8F9FC] px-3 py-3 text-center">
                      <p className="text-xs font-medium text-gray-500">Area</p>
                      <p className="mt-1.5 text-sm font-bold text-[#17213D]">
                        {formatArea(property.area) || '1,200 sqft'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col items-center gap-3 border-t border-gray-100 pt-4 text-center">
                    <div className="min-w-0">
                      <p className="text-center text-xs font-medium text-gray-500">Starting Price</p>
                      <p className="mt-1 text-center text-xl font-extrabold tracking-tight text-[#17213D]">
                        {formatCurrency(property.price)}
                      </p>
                    </div>

                    <span className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#17213D] px-3.5 py-2.5 text-xs font-bold text-white transition-colors duration-300 group-hover:bg-amber-500 group-hover:text-[#17213D]">
                      View Details
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-6-6 6 6-6 6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {newlyLaunched.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
              <p className="font-semibold text-[#17213D]">New projects coming soon</p>
              <p className="mt-2 text-sm text-gray-500">Please check back for the latest listings.</p>
            </div>
          )}
        </div>
      </section>
      {/* Property Gallery */}
      <Gallery />


    </div>
  );
};

export default Home;
