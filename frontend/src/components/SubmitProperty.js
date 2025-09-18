import React, { useState } from 'react';
import { toast } from 'react-toastify';
import propertyService from '../services/propertyService';

const SubmitProperty = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'apartment',
    category: 'sale',
    price: {
      amount: '',
      currency: 'INR',
      negotiable: true
    },
    area: {
      size: '',
      unit: 'sqft'
    },
    location: {
      address: '',
      city: '',
      state: '',
      pincode: '',
      coordinates: {
        latitude: '',
        longitude: ''
      },
      landmark: '',
      neighborhood: ''
    },
    features: {
      bedrooms: 0,
      bathrooms: 0,
      balconies: 0,
      parking: 0,
      furnished: 'unfurnished',
      floor: {
        current: '',
        total: ''
      },
      age: '',
      facing: ''
    },
    amenities: [],
    contact: {
      showOwnerDetails: true,
      preferredTime: '',
      additionalPhone: ''
    }
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'house', label: 'House' },
    { value: 'plot', label: 'Plot' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'office', label: 'Office' },
    { value: 'shop', label: 'Shop' },
    { value: 'warehouse', label: 'Warehouse' }
  ];

  const categories = [
    { value: 'sale', label: 'For Sale' },
    { value: 'rent', label: 'For Rent' },
    { value: 'lease', label: 'For Lease' }
  ];

  const furnishedOptions = [
    { value: 'fully-furnished', label: 'Fully Furnished' },
    { value: 'semi-furnished', label: 'Semi Furnished' },
    { value: 'unfurnished', label: 'Unfurnished' }
  ];

  const facingOptions = [
    { value: 'north', label: 'North' },
    { value: 'south', label: 'South' },
    { value: 'east', label: 'East' },
    { value: 'west', label: 'West' },
    { value: 'north-east', label: 'North-East' },
    { value: 'north-west', label: 'North-West' },
    { value: 'south-east', label: 'South-East' },
    { value: 'south-west', label: 'South-West' }
  ];

  const amenitiesList = [
    'gym', 'swimming-pool', 'garden', 'playground', 'security', 'parking',
    'elevator', 'power-backup', 'water-supply', 'club-house', 'jogging-track',
    'tennis-court', 'basketball-court', 'library', 'party-hall', 'spa',
    'yoga-room', 'meditation-hall', 'intercom', 'waste-management', 'wifi'
  ];

  const handleInputChange = (e, section = null) => {
    const { name, value, type, checked } = e.target;
    
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleNestedChange = (e, section, subsection = null) => {
    const { name, value } = e.target;
    
    if (subsection) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subsection]: {
            ...prev[section][subsection],
            [name]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value
        }
      }));
    }
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: {
                latitude: position.coords.latitude.toString(),
                longitude: position.coords.longitude.toString()
              }
            }
          }));
          toast.success('Location coordinates updated!');
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Unable to get current location. Please enter coordinates manually.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }
    setImages(files);
  };

  const validateStep1 = () => {
    const { title, description, type, category } = formData;
    const { amount } = formData.price;
    const { size } = formData.area;
    
    if (!title || !description || !type || !category || !amount || !size) {
      toast.error('Please fill all required fields in Step 1');
      return false;
    }
    
    if (title.length < 5) {
      toast.error('Title must be at least 5 characters');
      return false;
    }
    
    if (description.length < 20) {
      toast.error('Description must be at least 20 characters');
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    const { address, city, state, pincode } = formData.location;
    const { latitude, longitude } = formData.location.coordinates;
    
    if (!address || !city || !state || !pincode || !latitude || !longitude) {
      toast.error('Please fill all required location fields');
      return false;
    }
    
    if (!/^[0-9]{6}$/.test(pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }
    
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast.error('Please enter valid coordinates');
      return false;
    }
    
    return true;
  };

  const validateStep3 = () => {
    if (images.length === 0) {
      toast.error('Please upload at least one property image');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      setStep(4);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep1() || !validateStep2() || !validateStep3()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const submitData = new FormData();
      
      // Append basic fields
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('type', formData.type);
      submitData.append('category', formData.category);
      
      // Append JSON objects as strings
      submitData.append('price', JSON.stringify(formData.price));
      submitData.append('area', JSON.stringify(formData.area));
      submitData.append('location', JSON.stringify(formData.location));
      submitData.append('features', JSON.stringify(formData.features));
      submitData.append('contact', JSON.stringify(formData.contact));
      
      // Append amenities array
      formData.amenities.forEach(amenity => {
        submitData.append('amenities', amenity);
      });
      
      // Append images
      images.forEach(image => {
        submitData.append('images', image);
      });
      
      await propertyService.createProperty(submitData);
      
      toast.success('Property submitted successfully! It will be reviewed by our admin team.');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        type: 'apartment',
        category: 'sale',
        price: {
          amount: '',
          currency: 'INR',
          negotiable: true
        },
        area: {
          size: '',
          unit: 'sqft'
        },
        location: {
          address: '',
          city: '',
          state: '',
          pincode: '',
          coordinates: {
            latitude: '',
            longitude: ''
          },
          landmark: '',
          neighborhood: ''
        },
        features: {
          bedrooms: 0,
          bathrooms: 0,
          balconies: 0,
          parking: 0,
          furnished: 'unfurnished',
          floor: {
            current: '',
            total: ''
          },
          age: '',
          facing: ''
        },
        amenities: [],
        contact: {
          showOwnerDetails: true,
          preferredTime: '',
          additionalPhone: ''
        }
      });
      setImages([]);
      setStep(1);
      
    } catch (error) {
      console.error('Submit property error:', error);
      
      // Show specific error messages
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map(err => err.message || err.msg).join(', ');
        toast.error(`Validation errors: ${errorMessages}`);
      } else {
        toast.error(error.response?.data?.message || 'Failed to submit property. Please check all fields and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Submit Your Property</h2>
        <p className="text-gray-600">Fill in the details below to list your property for sale or rent</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= stepNum ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNum}
              </div>
              <span className={`ml-2 text-sm ${step >= stepNum ? 'text-orange-500' : 'text-gray-600'}`}>
                {stepNum === 1 && 'Basic Info'}
                {stepNum === 2 && 'Location'}
                {stepNum === 3 && 'Images & Features'}
                {stepNum === 4 && 'Review & Submit'}
              </span>
              {stepNum < 4 && <div className={`flex-1 h-0.5 mx-4 ${step > stepNum ? 'bg-orange-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., 3BHK Spacious Apartment in Prime Location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.price.amount}
                  onChange={(e) => handleNestedChange(e, 'price')}
                  placeholder="Enter price in rupees"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area Size *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="size"
                    value={formData.area.size}
                    onChange={(e) => handleNestedChange(e, 'area')}
                    placeholder="Size"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                  <select
                    name="unit"
                    value={formData.area.unit}
                    onChange={(e) => handleNestedChange(e, 'area')}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="sqft">Sq Ft</option>
                    <option value="sqm">Sq M</option>
                    <option value="acres">Acres</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="negotiable"
                    checked={formData.price.negotiable}
                    onChange={(e) => handleNestedChange(e, 'price')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Price Negotiable</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe your property in detail..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Location Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                name="address"
                value={formData.location.address}
                onChange={(e) => handleNestedChange(e, 'location')}
                rows={3}
                placeholder="Enter complete address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.location.city}
                  onChange={(e) => handleNestedChange(e, 'location')}
                  placeholder="City name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.location.state}
                  onChange={(e) => handleNestedChange(e, 'location')}
                  placeholder="State name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.location.pincode}
                  onChange={(e) => handleNestedChange(e, 'location')}
                  placeholder="6-digit pincode"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude *
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.location.coordinates.latitude}
                  onChange={(e) => handleNestedChange(e, 'location', 'coordinates')}
                  placeholder="e.g., 28.6139"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can get coordinates from Google Maps by right-clicking on the location
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude *
                </label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.location.coordinates.longitude}
                  onChange={(e) => handleNestedChange(e, 'location', 'coordinates')}
                  placeholder="e.g., 77.2090"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  <a 
                    href="https://www.google.com/maps" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 underline"
                  >
                    Open Google Maps
                  </a> to find coordinates
                </p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                type="button"
                onClick={getCurrentLocation}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm"
              >
                📍 Use Current Location
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Landmark
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.location.landmark}
                  onChange={(e) => handleNestedChange(e, 'location')}
                  placeholder="Nearby landmark"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Neighborhood
                </label>
                <input
                  type="text"
                  name="neighborhood"
                  value={formData.location.neighborhood}
                  onChange={(e) => handleNestedChange(e, 'location')}
                  placeholder="Area/Sector name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Images and Features */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Images & Features</h3>
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Images * (Max 10 images)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              {images.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">{images.length} image(s) selected</p>
              )}
            </div>
            
            {/* Property Features */}
            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-4">Property Features</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.features.bedrooms}
                    onChange={(e) => handleNestedChange(e, 'features')}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.features.bathrooms}
                    onChange={(e) => handleNestedChange(e, 'features')}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Balconies
                  </label>
                  <input
                    type="number"
                    name="balconies"
                    value={formData.features.balconies}
                    onChange={(e) => handleNestedChange(e, 'features')}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parking
                  </label>
                  <input
                    type="number"
                    name="parking"
                    value={formData.features.parking}
                    onChange={(e) => handleNestedChange(e, 'features')}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Additional Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Furnished Status
                </label>
                <select
                  name="furnished"
                  value={formData.features.furnished}
                  onChange={(e) => handleNestedChange(e, 'features')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {furnishedOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Age (years)
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.features.age}
                  onChange={(e) => handleNestedChange(e, 'features')}
                  min="0"
                  placeholder="Property age"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facing Direction
                </label>
                <select
                  name="facing"
                  value={formData.features.facing}
                  onChange={(e) => handleNestedChange(e, 'features')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select facing</option>
                  {facingOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Floor Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Floor
                </label>
                <input
                  type="number"
                  name="current"
                  value={formData.features.floor.current}
                  onChange={(e) => handleNestedChange(e, 'features', 'floor')}
                  min="0"
                  placeholder="Floor number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Floors
                </label>
                <input
                  type="number"
                  name="total"
                  value={formData.features.floor.total}
                  onChange={(e) => handleNestedChange(e, 'features', 'floor')}
                  min="1"
                  placeholder="Total floors in building"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            
            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {amenitiesList.map(amenity => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {amenity.replace('-', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Contact Preferences */}
            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-4">Contact Preferences</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Contact Time
                  </label>
                  <input
                    type="text"
                    name="preferredTime"
                    value={formData.contact.preferredTime}
                    onChange={(e) => handleNestedChange(e, 'contact')}
                    placeholder="e.g., 10 AM - 6 PM"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Phone Number
                  </label>
                  <input
                    type="tel"
                    name="additionalPhone"
                    value={formData.contact.additionalPhone}
                    onChange={(e) => handleNestedChange(e, 'contact')}
                    placeholder="Alternative contact number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="showOwnerDetails"
                    checked={formData.contact.showOwnerDetails}
                    onChange={(e) => handleNestedChange(e, 'contact')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    Show my contact details to interested buyers/tenants
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review and Submit */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Review Your Property Details</h3>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800">Basic Information</h4>
                <p><strong>Title:</strong> {formData.title}</p>
                <p><strong>Type:</strong> {formData.type}</p>
                <p><strong>Category:</strong> {formData.category}</p>
                <p><strong>Price:</strong> ₹{formData.price.amount?.toLocaleString('en-IN')}</p>
                <p><strong>Area:</strong> {formData.area.size} {formData.area.unit}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800">Location</h4>
                <p><strong>Address:</strong> {formData.location.address}</p>
                <p><strong>City:</strong> {formData.location.city}, {formData.location.state} - {formData.location.pincode}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800">Features</h4>
                <p><strong>Bedrooms:</strong> {formData.features.bedrooms}</p>
                <p><strong>Bathrooms:</strong> {formData.features.bathrooms}</p>
                <p><strong>Furnished:</strong> {formData.features.furnished}</p>
                {formData.amenities.length > 0 && (
                  <p><strong>Amenities:</strong> {formData.amenities.join(', ')}</p>
                )}
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800">Images</h4>
                <p>{images.length} image(s) selected</p>
              </div>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Your property will be submitted for admin review and approval. 
                    Once approved, it will be visible to potential buyers/tenants on our platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
          )}
          
          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="ml-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Property'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SubmitProperty;