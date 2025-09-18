import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import propertyService from '../services/propertyService';

const AddProperty = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'apartment',
    category: 'sale',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: '',
      landmark: ''
    },
    owner: {
      name: '',
      phone: '',
      email: ''
    },
    amenities: [],
    furnished: 'semi-furnished',
    parking: 'no',
    floor: '',
    totalFloors: '',
    constructionYear: '',
    propertyAge: 'new'
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Available amenities
  const availableAmenities = [
    'Swimming Pool', 'Gym', 'Power Backup', 'Lift', 'Security',
    'Garden', 'Playground', 'Club House', 'Parking', 'Water Supply',
    'Air Conditioning', 'Internet', 'Balcony', 'Terrace', 'Servant Quarter'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    setSelectedImages(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, {
          file,
          url: e.target.result
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
      toast.error('Only sellers can add properties');
      return;
    }

    if (selectedImages.length === 0) {
      toast.error('Please add at least one property image');
      return;
    }

    setLoading(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add property data
      Object.keys(formData).forEach(key => {
        if (typeof formData[key] === 'object' && formData[key] !== null) {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Add images
      selectedImages.forEach((image, index) => {
        submitData.append('images', image);
      });

      const response = await propertyService.createProperty(submitData);
      
      toast.success('Property submitted successfully! It will be reviewed and published soon.');
      navigate('/properties');
      
    } catch (error) {
      console.error('Property submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit property');
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen py-8">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="heading-2 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">Only sellers can add properties</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="heading-2 mb-4">Add New Property</h1>
            <p className="subheading">List your property for sale or rent</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., 3BHK Apartment in Central Mumbai"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">Independent House</option>
                    <option value="villa">Villa</option>
                    <option value="plot">Plot/Land</option>
                    <option value="commercial">Commercial Space</option>
                    <option value="office">Office Space</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Listing Type *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g., 5000000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                    Area (sq ft) *
                  </label>
                  <input
                    type="number"
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="e.g., 1200"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms
                  </label>
                  <select
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5+ BHK</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms
                  </label>
                  <select
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe your property, its features, and neighborhood..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="location.address" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="location.address"
                    name="location.address"
                    value={formData.location.address}
                    onChange={handleChange}
                    placeholder="e.g., 123 Main Street, Sector 15"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="location.city" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="location.city"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                    placeholder="e.g., Mumbai"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="location.state" className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    id="location.state"
                    name="location.state"
                    value={formData.location.state}
                    onChange={handleChange}
                    placeholder="e.g., Maharashtra"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="location.pincode" className="block text-sm font-medium text-gray-700 mb-1">
                    Pin Code *
                  </label>
                  <input
                    type="text"
                    id="location.pincode"
                    name="location.pincode"
                    value={formData.location.pincode}
                    onChange={handleChange}
                    placeholder="e.g., 400001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="location.landmark" className="block text-sm font-medium text-gray-700 mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    id="location.landmark"
                    name="location.landmark"
                    value={formData.location.landmark}
                    onChange={handleChange}
                    placeholder="e.g., Near City Mall"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Owner Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="owner.name" className="block text-sm font-medium text-gray-700 mb-1">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    id="owner.name"
                    name="owner.name"
                    value={formData.owner.name}
                    onChange={handleChange}
                    placeholder="Owner's full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="owner.phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    id="owner.phone"
                    name="owner.phone"
                    value={formData.owner.phone}
                    onChange={handleChange}
                    placeholder="e.g., +91 9876543210"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="owner.email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="owner.email"
                    name="owner.email"
                    value={formData.owner.email}
                    onChange={handleChange}
                    placeholder="owner@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Property Images */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Images *</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Images (Max 10 images, 5MB each)
                  </label>
                  <input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: JPG, PNG, WebP. First image will be used as main image.
                  </p>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview.url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableAmenities.map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="furnished" className="block text-sm font-medium text-gray-700 mb-1">
                    Furnished Status
                  </label>
                  <select
                    id="furnished"
                    name="furnished"
                    value={formData.furnished}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="furnished">Fully Furnished</option>
                    <option value="semi-furnished">Semi Furnished</option>
                    <option value="unfurnished">Unfurnished</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="parking" className="block text-sm font-medium text-gray-700 mb-1">
                    Parking
                  </label>
                  <select
                    id="parking"
                    name="parking"
                    value={formData.parking}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="no">No Parking</option>
                    <option value="bike">Bike Parking</option>
                    <option value="car">Car Parking</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
                    Floor
                  </label>
                  <input
                    type="text"
                    id="floor"
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    placeholder="e.g., 3rd Floor"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="totalFloors" className="block text-sm font-medium text-gray-700 mb-1">
                    Total Floors
                  </label>
                  <input
                    type="number"
                    id="totalFloors"
                    name="totalFloors"
                    value={formData.totalFloors}
                    onChange={handleChange}
                    placeholder="e.g., 10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="constructionYear" className="block text-sm font-medium text-gray-700 mb-1">
                    Construction Year
                  </label>
                  <input
                    type="number"
                    id="constructionYear"
                    name="constructionYear"
                    value={formData.constructionYear}
                    onChange={handleChange}
                    placeholder="e.g., 2020"
                    min="1950"
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="propertyAge" className="block text-sm font-medium text-gray-700 mb-1">
                    Property Age
                  </label>
                  <select
                    id="propertyAge"
                    name="propertyAge"
                    value={formData.propertyAge}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="new">New (Under Construction)</option>
                    <option value="0-1">0-1 Year</option>
                    <option value="1-5">1-5 Years</option>
                    <option value="5-10">5-10 Years</option>
                    <option value="10+">10+ Years</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting Property...
                  </div>
                ) : (
                  'Submit Property for Review'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;